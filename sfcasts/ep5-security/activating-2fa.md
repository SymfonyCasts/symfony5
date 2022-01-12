# Activating 2fa

Ok: here's the flow. When we submit a valid email and password, the two-factor bundle
will intercept that and redirect us to an "enter the code" form. To validate
the code, it will read the `totpSecret` that's stored for that `User`.

But in order to know what code to type, the user *first* needs to *activate* two
factor authentication on their account and scan a QR code we provide with their
authenticator app.

Let's build *that* side of things now: the activation and QR code.

Oh, but before I forget agaain, we added a new property to our `User` in the last
chapter... and I forgot to make a migration for it. At your terminal, run:

```terminal
symfony console make:migration
```

Let's go check out that file and... good. No surprises, it adds one column to our
table. Run that:

```terminal
symfony console doctrine:migrations:migrate
```

## Adding a way to Activate 2fa

Here's the plan. A user will *not* have two-factor authentication enabled by default.
Instead, they'll *activate* it by clicking a link. When they do that, we'll generate a
`totpSecret`, set it on the user, save it to the database and show the user a QR code
to scan.

Head over to `src/Controller/SecurityController.php`. Let's create the endpoint
that activates two factor authentication: `public function enable2fa()`. Give
this a route: how about `/authenticate/2fa/enable` - and `name="app_2fa_enable"`.

Just be careful not to start the URL with `/2fa`... that's kind of reserved for the
two-factor authentication process.

Inside of the method, we need two services. The first is an
autowireable service from the bundle - `TotpAuthenticatorInterface $totpAuthenticator`.
That will help us generate the secret. The second is
`EntityManagerInterface $entityManager`.

Oh, and, of course, you can only use this route if you're authenticated. Add
`@IsGranted("ROLE_USER")`. Let me re-type that and hit tab to get the `use` statement
on top.

***TIP
This next paragraph is... wrong! Using ``ROLE_USER`` will not force a user to
re-renter their password if they're only authenticated via a remember me cookie.
To do that, you should use `IS_AUTHENTICATED_FULLY`. And that's what I should have
used here.
***

For the most part, I've been using `IS_AUTHENTICATED_REMEMBERED` for security...
so that you *just* need to be logged in... even if it’s via a remember me cookie.
But I'm using `ROLE_USER` here, which is effectively identical to
`IS_AUTHENTICATED_FULLY`. That’s on purpose. The result is that if the user *were*
authenticated... but only thanks to a remember me cookie, Symfony will force them to
re-type their password before getting here. A little extra security before we enable two-factor
authentication.

Anyways, say `$user = this->getUser()`... and then if *not*
`$user->isTotpAuthenticationEnabled()`. Hmm, I want to see if totp authentication
is *not* already enabled... but I'm not getting auto-completion for this.

We know why: the `getUser()` method only knows that it returns a `UserInterface`.
We fixed this earlier by making our own base controller. Let's extend that.

Back down here, if not `$user->isTotpAuthenticationEnabled()` - so if the
user does *not* already have a `totpSecret` - let's set one:
`$user->setTotpSecret()` passing `$totpAuthentiator->generateSecret()`. Then, save
with `$entityManager->flush()`.

At the bottom, for now, just `dd($user)` so we can make sure this is working.

## Linking to the Route

Cool! Let's link to this! Copy the route name... then open
`templates/base.html.twig`. Search for "log out". There we go. I'll paste that route
name, duplicate the entire `li`, clean things up, paste the new route name, remove
my temporary code and say "Enable 2fa".

Testing time! Oh, but first, at your terminal, reload your fixtures:

```terminal
symfony console doctrine:fixtures:load
```

That will make sure all of the users have *verified* emails so that we
can actually log in. When that finishes, log in with `abraca_admin@example.com`,
password `tada`. Beautiful. Then hit "Enable 2fa" and... got it! It hits our user dump!
And most importantly, we have a `totpSecret` set!

That's great! But the *final* step is to show the user a QR code that they can
scan to get their authenticator app set up. Let's do that next.
