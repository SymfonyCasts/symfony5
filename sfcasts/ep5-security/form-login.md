# form_login: The Built-in Authenticator

Custom authenticator classes like this give us *tons* of control. Like, imagine that -
in addition to email and password fields, you needed a *third* field - like a
"company" dropdown menu... and you used that value - along with the `email` to
query for the `User`. Doing that in here would be... pretty darn simple! Grab the
`company` POST field, use it in your custom query and celebrate with nachos.

But a login form is a pretty common thing to. And so, Symfony comes with a built-in
login form authenticator that we can... just use!

## Checking out the Core FormLoginAuthenticator

We can actually open it up and check it out. Hit shift+shift and look for
`FormLoginAuthenticator`.

The first thing to notice is that it extends the *same* base class that we are. And
if you look at the methods - it's referencing a bunch of options - but ultimately...
it does the same stuff that our class does: `getLoginUrl()` generates a URL to the
login page... and `authenticate()` creates a `Passport` with `UserBadge`,
`PasswordCredentials`, a `RememberMeBadge` and a `CsrfTokenBadge`.

Both `onAuthenticationSuccess` and `onAuthenticationFailure` offload their work
to *another* object... but if you looked inside those, you'd see that they're
basically doing the same thing that we are.

## Using form_login

So let's use *this* instead of our custom authenticator... which I would do in
a real project if I didn't need the flexibility of our custom authenticator.

In `security.yaml`, comment-out our customer authenticator... and also comment-out
the `entry_point` config for now.

Replace it with a new key `form_login`. *This* activates that authenticator. Below,
this has a *ton* of options - I'll show you them in a minute. But there are two
important ones we need: `login_path:` set to the route to your login page... so for
us that `app_login`... and also the `check_path`, which is the route that the
login form *submits* to... which for us is *also* `app_login`: we submit to the
same URL.

## Setting the entry_point to form_login

And... that's it to start! Let's go try it! Refresh any page and... error! And error
that we've seen:

> Because you have multiple authenticators on firewall "main", you need to
> set entry point to one of them: either `App\Security\DummyAuthenticator`, or
> `form_login`.

I mentioned earlier that *some* authenticators provide an entry point and some
don't. The `remember_me` authenticator does *not* provide one... but our
`DummyAuthenticator` *does* and so does `form_login`. Its entry point redirects
to the login page.

So since we have multiple entry points, we need to choose one. Set `entry_point:`
to `form_login`.

## Customizing the Login Form Field Names

*Now* if we refresh... cool: no error. So let's try to log in. Actually... I'll
log out first... that still works... then go log in with `abraca_admin@example.com`
password `tada`. And... ah! An error!

> The key `_username` must be string, null given.

And it's coming from `FormLoginAuthenticator::getCredentials()`. Ok, so when you
use the built-in `form_login`, you need to make sure a few things are lined up. If
you open our login template - `templates/security/login.html.twig` - our two fields
are called `email`... and `password`. Whelp, it turns out that Symfony expects these
fields to called `_username` and `_password`. that's why we get this error: it's
looking for an `_username` POST parameter... but it's not there. *Fortunately*,
this is the type of thing you can configure.

Find your favorite terminal and run:

```terminal
symfony console debug:config security
```

to see all of our *current* security configuration. Scroll up... and look for
`form_login`... here it is. There are a *bunch* of options that allow you to control
the `form_login` behavior. Two of the most important ones are `username_parameter`
`password_parameter`. Let's configure these to match what our properties are.

So, in `security.yaml` add `username_parameter: email` and `password_parameter: password`.
This tells it to read the `email` POST parameter.... and then it will pass that
string to our user provider... which will handle querying the database.

Let's test it. Refresh to resubmit and... got it! We're logged in!

The moral of the story is this: using `form_login` lets you have a login form with
less code... while using a custom authenticator class is more work... but has
infinite flexibility. So, it's your choice.

## More form_login Config

Though, a lot of stuff on `form_login` *can* actually be configured.

For example, right now, it's actually *not* checking our CSRF token. Enable that
by saying `enable_csrf: true`.

That's it! Over in the options, when you enable CSRF protection, it looks for a hidden
field called `_csrf_token` with the string `authenticate` used to generate it.
Fortunately, in our template, we're already using *both* of those things... so
this is just going to work.

And there are even *more* ways we can configure this. Remember: to get this config,
I ran `debug:config security`... which shows your *current* configuration, including
defaults. But not *all* options are shown here. To see a full list, run
`config:dump security`.

```terminal-silent
symfomy console config:dump security
```

Instead of showing your *actual* config, this shows a huge list of *example* config.
This is a much bigger list... here's `form_login`. A lot of this we saw before...
but `success_handler` and `failure_handler` are both new. You can Google these
to control what happens after success or failure.

But also, later, we're going to learn about a more *global* way of hooking into
the success or failure process by registering an event listener.

## Rendering "last_username" On the Login Form

*Anyways*, we're not using our `LoginFormAuthenticator` anymore, so feel free
to delete it.

And... I have good news! The *core* authenticator is doing one thing that *our*
class never did. Up in `authenticate()`... this calls `getCredentials()` to read
the POST data. Let me search for "session"... yup! This took more into
`getCredentials()`. Anyways, after grabbing the submitted email - in this code
that's stored as `$credentials['username']` - it *saves* that value into the session.

It's doing that so that if authentication fails, we can *read* that and pre-fill
the email box on the login form.

Let's do that! Go to our controller: `src/Controller/SecurityController`. This
`AuthenticationUtils` has one other useful method. Pass a new variable to the
template called `last_username` - you can call it `last_email` if you'd like - set
to `$authenticationUtils->getLastUsername()`. Once again, this is just a helper
to read this exact key off of the session.

Now, in the template - `login.html.twig` - up here on the email field, add
`valu="{{ last_username}} "`.

Cool! If we go to `/login`... it's already there from filling out the form a
minute ago! If enter a different email... yes! that sticks too.

Next: let's get back to authorization by learning how to deny access in a
controller... in a number of different ways.
