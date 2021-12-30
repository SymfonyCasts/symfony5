# Activating 2fa

Ok: here's the flow. When we submit a valid email and password, the two factor bundle
will intercept that and redirect us to some "enter the code" form. To validate
the code we enter, it will read the `totpSecret` that's stored for that `User`.

But in order to know what code to type, the user *first* needs to *activate* two
factor authentication on their account and scan a QR code we provide into their
authenticator app.

Let's build *that* side of things now: the activation and QR code side of things.

Oh, but before I forget, we added a new property to our `User` in the last chapter...
so we need a migration for that. At your terminal, run:

```terminal
symfony console make:migration
```

Let's go check out that file and... good. No surprises, it adds one column to our
table. Run that:

```terminal
symfony console doctrine:migrations:migrate
```

## Adding a way to Activate 2fa

Here's the plan. A user will *not* have two factor authentication enabled by default.
Instead, they'll activate it by clicking a link on the navigation. When they do
that, we'll generate a `totpSecret` for that user, save it to the database and show
the user a QR code to scan.

Head over to `src/Controller/SecurityController.php`. Let's create the endpoint
That activates two factor authentication: `public function enable2fa()`. Give
this a route - how about `/authentication/2fa/enable` - and `name="app_2fa_enable"`.

Just be careful not to start the URL with `/2fa`... that's kind of reserved for the
two factor authentication process.

Inside of the method, we're going to need two services. The first is an
autowireable service from the bundle - `TotpAuthenticatorInterface totpAuthenticator` -
that will help us generate the secret. The second is
`EntityManagerInterface $entityManager`.

Oh, and, of course, you can only use this route if you're authenticated. I'll use
`@IsGranted("ROLE_USER")`. Let me re-type that and hit tab to get the `use` statement
on top.

For the most part, I've been using `IS_AUTHENTICATED_REMEMBERED` for security...
so that you *just* need to be logged in... even if its via a remember me cookie.
But I'm using a `ROLE_USER` here, which is effectively identical to
`IS_AUTHENTICATED_FULLY`. The result is that if the user *were* authenticated...
but only thanks to a remember me cookie, Symfony will force them to re-type their
password before getting here. A little extra security before we enable two factor
authentication.

Anyways, say `$user = this->getUser()`... and then if *not*
`$user->isTotpAuthenticationEnabled()`. Hmm, I want to see if totp authentication
is *not* already enabled... but I'm not getting auto-completion for this.

We know why: the `getUser()` method only knows that it returns a `UserInterface`.
We fixed this earlier by making own base controller. Let's extend that.

Now, back down here, if not `$user->isTotpAuthenticationEnabled()` - so if the
user does *not* already have a `totpSecret`, let's set one:
`$user->setTotpSecret()` passing `$totpAuthentiator->generateSecret()`. Then, save
with `$entityManager->flush()`.

At the bottom, for now, just `dd($user)` so we can make sure that is working.

## Linking to the Route

Cool! Let's go link to this! Copy the route name... then open
`templates/base.html.twig`. Search for "log out". There we go. I'll paste that route
name, duplicate the entire `li`, clean things up, paste the new route name, remove
that temporary code and say "Enable 2fa".

Alright, let's try this! First, at your terminal, reload your fixtures:

```terminal
symfony console doctrine:fixtures:load
```

That will make sure that all of the dummy accounts are verified... so that we
can actually log in. When that finishes, go log in with `abraca_admin@example.com`,
password `tada`. Beautiful! hit "Enable 2fa" and... got it! It hits our user dump.
And most importantly, we have `totpSecret` set!

That's great! But the *final* step is to show the user a QR code that they can
scan to get their authenticator app set up. Let's do that next.
