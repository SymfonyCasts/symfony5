# Security Listener System & Csrf Protection

After we return the `Passport` object, we know that two things happen. First, the
`UserBadge` is used to get the `User` object. In our case, because we passed this
a second argument, it just calls our function and we do the work. But if you only
pass one argument, then the user provider does the work.

The second thing that happens is that the "credentials badge" is "resolved". Originally
it did this by executing our callback. Now it checks the user's password in the
database.

## The Event System in Action

All of this is powered by a really cool event system. After our `authenticate()`
method, the security system dispatches several events... and there are a set of
*listeners* to these events that do different work. We're going to see a full list of
these listeners later... and even add our *own* listeners to the system.

## UserProviderListener

But let's look at a few of them. Hit Shift + Shift so we can load some core files
from Symfony. The first is called `UserProviderListener`. Make sure to "include
non project items"... and open it up.

This is called after we return our `Passport`. It first checks to make sure the
`Passport` has a `UserBadge` - it always will in any normal situation - and then
*grabs* that object. It *then* checks to see if the badge has a "user loader":
that's the function that we're passing to the second argument of our `UserBadge`.
If the badge *already* has a user loader, like in our case, it does nothing. But
if it does *not*, it *sets* the user loader to the `loadUserByIdentifier()` method
on our user provider.

It's... a little technical... but *this* is what causes our user provider in
`security.yaml` to be responsible for loading the user if we only pass one argument
to `UserBadge`.

## CheckCredentialsListener

Let's check one other class. Close this one and hit Shift + Shift to open
`CheckCredentialsListener`. As the name suggests, *this* is responsible for checking
the user's "credentials". It first checks to see if the `Passport` has a
`PasswordCredentials` badge. Even though its name doesn't sound like it, the
"credentials" objects are just badges... like any other badge. So this checks to
see if the `Passport` has that badge and if it *does*, it grabs the badge, reads
the plain-text password off of it, and, eventually way down here, uses the password
hasher to *verify* that the password is correct. So this contains *all* of that
password hashing logic. Below, this listener also handles the `CustomCredentials`
badge.

## Badges Must be Resolved

So your `Passport` always has at least these two badges: the `UserBadge` and also
some sort of "credentials badge". One important property of badges is that each one
must be "resolved". You can see this in `CheckCredentialsListener`. After it finishes
checking the password, it calls `$badge->markResolved()`. If, for some reason,
this `CheckCredentialsListener` was never called due to some misconfiguration...
the badge would *remain* "unresolved" and that would actually cause authentication
to *fail*. Yup, after calling the listeners, Symfony checks to make sure that all
badges have been resolved. This means that you can confidently return
`PasswordCredentials` and not have to wonder if something *did* actually verify
that password.

## Adding CSRF Protection

And here's where things start to get more interesting. In addition to these
two badges, we can also add *more* badges to our `Passport` to activate more super
powers. For example, one good thing to have on a login form is CSRF protection.
Basically you add a hidden field to your form that contains a CSRF token... then,
on submit, you *validate* that token.

Let's do this. Anywhere inside your form, add an input `type="hidden"`,
`name="_csrf_token"` - this name could be anything, but this is a standard name -
then `value="{{ csrf_token() }}"`. Pass this the string "authenticate".

That `authenticate` could *also* be anything... it's like a unique name for this form.

Now that we have the field, copy its name and head over to `LoginFormAuthenticator`.
Here, we need to read that field from the POST data and then ask Symfony: "is
this CSRF token valid"? Well, in reality, that second part will happen automatically.

How? The `Passport` object has a *third* argument: an array of any *other* badges
that we want to add. Add one: a new `CsrfTokenBadge()`. This needs two things.
The first is the CSRF token ID. Say `authenticate`: this just needs to match whatever
we used in the form. The second argument is the submitted value, which is
`$request->request->get()` and the name of our field: `_csrf_token`.

And... we're done! Internally, a listener will notice this badge, validate the
CSRF token and *resolve* the badge.

Let's try it! Go to `/login`, inspect the form... and find the hidden field. There
it is. Enter any email, any password... but mess with the CSRF token value. Hit
"Sign in" and... yes! Invalid CSRF Token! Now if we *don't* mess with the token...
and use any email and password... beautiful! The CSRF token was valid... so it
continued to the email error.

Next: let's leverage Symfony's "remember me" system to allow users to stay logged
in for a long time. This feature *also* leverages the listener system and a badge.
