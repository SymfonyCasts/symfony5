# form_login: The Built-in Authenticator

Custom authenticator classes like this give us *tons* of control. Like, imagine that,
in addition to email and password fields, you needed a *third* field - like a
"company" dropdown menu... and you use that value - along with the `email` - to
query for the `User`. Doing that in here would be... pretty darn simple! Grab the
`company` POST field, use it in your custom query and celebrate with nachos.

But a login form is a pretty common thing. And so, Symfony comes with a built-in
login form authenticator that we can... just use!

## Checking out the Core FormLoginAuthenticator

Let's open it up and check it out. Hit `Shift`+`Shift` and look for
`FormLoginAuthenticator`.

The first thing to notice is that this extends the *same* base class that we do. And
if you look at the methods - it references a bunch of options - but ultimately...
it does the same stuff that our class does: `getLoginUrl()` generates a URL to the
login page... and `authenticate()` creates a `Passport` with `UserBadge`,
`PasswordCredentials`, a `RememberMeBadge` and a `CsrfTokenBadge`.

Both `onAuthenticationSuccess` and `onAuthenticationFailure` offload their work
to *another* object... but if you looked inside of those, you would see that they're
basically doing the same thing that we are.

## Using form_login

So let's use *this* instead of our custom authenticator... which I would do in
a real project unless I need the flexibility of a custom authenticator.

In `security.yaml`, comment-out our customer authenticator... and also comment-out
the `entry_point` config:

[[[ code('be0ed4dbe7') ]]]

Replace it with a new key `form_login`. *This* activates that authenticator. Below,
this has a *ton* of options - I'll show you them in a minute. But there are two
important ones we need: `login_path:` set to the route to your login page... so for
us that's `app_login`... and also the `check_path`, which is the route that the
login form *submits* to... which for us is *also* `app_login`: we submit to the
same URL:

[[[ code('41c3d74eae') ]]]

## Setting the entry_point to form_login

And... that's it to start! Let's go try it! Refresh any page and... error! An error
that we've seen:

> Because you have multiple authenticators on firewall "main", you need to
> set "entry_point" to one of them: either `DummyAuthenticator`, or `form_login`.

I mentioned earlier that *some* authenticators provide an entry point and some
don't. The `remember_me` authenticator does *not* provide one... but our
`DummyAuthenticator` *does* and so does `form_login`. Its entry point redirects
to the login page.

So since we have multiple, we need to choose one. Set `entry_point:` to `form_login`:

[[[ code('7adff8ad2e') ]]]

## Customizing the Login Form Field Names

*Now* if we refresh... cool: no error. So let's try to log in. Actually... I'll
log out first... that still works... then go log in with `abraca_admin@example.com`
password `tada`. And... ah! Another error!

> The key "_username" must be a string, NULL given.

And it's coming from `FormLoginAuthenticator::getCredentials()`. Ok, so when you
use the built-in `form_login`, you need to make sure a few things are lined up.
Open the login template: `templates/security/login.html.twig`. Our two fields
are called `email`... and `password`:

[[[ code('acf108cb3c') ]]]

Whelp, it turns out that Symfony expects these fields to be called `_username`
and `_password`... that's why we get this error: it's looking for an `_username`
POST parameter... but it's not there. *Fortunately*, this is the type of thing
you can configure.

Find your favorite terminal and run:

```terminal
symfony console debug:config security
```

to see all of our *current* security configuration. Scroll up... and look for
`form_login`... here it is. There are a *bunch* of options that allow you to control
the `form_login` behavior. Two of the most important ones are `username_parameter`
and `password_parameter`. Let's configure these to match our field names.

So, in `security.yaml` add `username_parameter: email` and
`password_parameter: password`:

[[[ code('b2bd377267') ]]]

This tells it to read the `email` POST parameter... and then it will pass that
string to our user provider... which will handle querying the database.

Let's test it. Refresh to resubmit and... got it! We're logged in!

The moral of the story is this: using `form_login` lets you have a login form with
less code. But while using a custom authenticator class is more work... it has
infinite flexibility. So, it's your choice.

Next: let's see a few other things that we can configure on the login form *and*
add a totally new-feature: pre-filling the email field when we fail login.
