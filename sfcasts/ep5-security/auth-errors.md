# When Authentication Fails

Go back to the login form. What happens if we *fail* login? Right now, there are
two ways to fail: if we can't find a `User` for the email *or* if the password is
incorrect. Let's try a wrong password first.

## onAuthenticationFailure & AuthenticationException

Enter a real email from the database... and then any password that *isn't* "tada".
And... yep! We hit the `dd()`... that comes from `onAuthenticationFailure()`:

[[[ code('4567400b59') ]]]

So no matter *how* we fail authentication, we end up here, and we're passed an
`$exception` argument. Let's also dump that:

[[[ code('a27b26687f') ]]]

Head back... and refresh. Cool! It's a `BadCredentialsException`.

This is cool. If authentication fails - no matter *how* it fails - we're going to
end up here with some sort of `AuthenticationException`. `BadCredentialsException`
is a *subclass* of that.... as is the `UserNotFoundException` that we're
throwing from our user loader callback:

[[[ code('c80f79af3d') ]]]

All of these exception classes have one important thing in common. Hold `Command` or
`Ctrl` to open up `UserNotFoundException` to see it. All of these authentication
exceptions have a special `getMessageKey()` method that contains a *safe* explanation
of why authentication failed. We can use this to tell the user what went wrong.

## hide_user_not_found: Showing Invalid Username/Email Errors

So here's the big picture: when authentication fails, it's because *something*
threw an `AuthenticationException` or one of its sub-classes. And so, since
we're throwing a `UserNotFoundException` when an unknown email is entered... if
we try to log in with a bad email, *that* exception should be passed to
`onAuthenticationFailure()`.

Let's test that theory. At the login form, enter some invented email... and... submit.
Oh! We *still* get a `BadCredentialsException`! I was expecting this to be the
*actual* exception that was thrown: the `UserNotFoundException`.

For the most part... that *is* how this works. If you throw an
`AuthenticationException` during the authenticator process, that exception *is* passed
to you down in `onAuthenticationFailure()`. Then you can use it to figure out what
went wrong. However, `UserNotFoundException` is a special case. On some sites, when
the user enters a *valid* email address but a wrong password, you might *not* want
to tell the user that email *was* in fact found. So you say "Invalid credentials"
both if the email wasn't found *or* if the password was incorrect.

This problem is called user enumeration: it's where someone can test emails on your
login form to figure out which people have accounts and which don't. For some
sites, you definitely do *not* want to expose that information.

And so, to be safe, Symfony converts `UserNotFoundException` to a
`BadCredentialsException` so that entering an invalid email or invalid password
both give the same error message. However, if you *do* want to be able to say
"Invalid email" - which is much more helpful to your users - you *can* do this.

Open up `config/packages/security.yaml`. And, anywhere under the root `security`
key, add a `hide_user_not_found` option set to `false`:

[[[ code('a8f4d243a9') ]]]

This tells Symfony to *not* convert `UserNotFoundException` to a `BadCredentialsException`.

If we refresh now... boom! Our `UserNotFoundException` is now being passed directly
to `onAuthenticationFailure()`.

## Storing the Authentication Error in the Session

Ok, so let's think. Down in `onAuthenticationFailure()`... what do we want to do?
Our job in this method is, as you can see, to return a `Response` object. For
a login form, what we probably want to do is redirect the user *back* to the login
page but show an error.

To be able to do that, let's stash this exception - which holds the error message -
into the session. Say `$request->getSession()->set()`. We can really use whatever
key we want... but there's a standard key that's used to store authentication
errors. You can read it from a constant: `Security` - the one from the Symfony
Security component - `::AUTHENTICATION_ERROR`. Pass `$exception` to the second
argument:

[[[ code('262638317d') ]]]

Now that the error is in the session, let's redirect back to the login page. I'll
cheat and copy the `RedirectResponse` from earlier... and change the route to
`app_login`:

[[[ code('fdb1b638ff') ]]]

## AuthenticationUtils: Rendering the Error

Cool! Next, inside `LoginController`, we need to read that error and render it. The
most straightforward way to do that would be to grab the session and read out this
key. But... it's even easier than that! Symfony provides a service that will grab
the key from the session automatically. Add a new argument type-hinted with
`AuthenticationUtils`:

[[[ code('ab7490f229') ]]]

And then give `render()` a second argument. Let's pass an `error` variable to Twig
set to `$authenticationUtils->getLastAuthenticationError()`:

[[[ code('f16f02e8d4') ]]]

That's just a shortcut to read that key off of the session.

This means that the `error` variable is literally going to be an
`AuthenticationException` *object*. And remember, to figure out what went wrong,
all `AuthenticationException` objects have a `getMessageKey()` method that returns
an explanation.

In `templates/security/login.html.twig`, let's render that. Right after the `h1`,
say if `error`, then add a `div` with `alert alert-danger`. Inside render
`error.messageKey`:

[[[ code('c9adc53e92') ]]]

You don't want to use `error.message` because if you had some sort of internal
error - like a database connection error - that message might contain sensitive
details. But `error.messageKey` is guaranteed to be safe.

Testing time! Refresh! Yes! We're redirected back to `/login` and we see:

> Username could not be found.

That's the message if the `User` object can't be loaded: the error that comes
form `UserNotFoundException`. It's... not a great message... since our users are
logging in with an email, not a username.

So next, let's learn how to customize these error messages *and* add a way to log
out.
