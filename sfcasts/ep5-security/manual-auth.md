# Manual Authentication

Our registration form *would* work if we tried it. *But*, after registration, I want
to *also* automatically authenticate the user... so they don't need to register and
*then* immediately log in... that would be silly.

So far, all authentication has been done... kind of indirectly: the user makes a
request, some authenticator handles it and... voilà! But in this case, we want to
authenticate the user *directly*, by writing code *inside* of a controller.

## Hello UserAuthenticatorInterface

And... this is totally possible, by autowiring a service *specifically* for this.
Add a new argument up here type-hinted with `UserAuthenticatorInterface` and I'll
call it `$userAuthenticator`.

This object allows you to just... authenticate any `User` object. Right before the
redirect, let's do that: `$userAuthenticator->authenticateUser()` and we need to
pass this a few arguments. The first one is the `User` we want authenticate. Easy.
The second is an "authenticator" that you want to use. This system works
by basically taking your `User` object and... kind of "running it through" one
of your authenticators.

If we were still using our custom `LoginFormAuthenticator`, passing this argument
would be really easy. We could just autowire the `LoginFormAuthenticator` service
up here and pass it in.

## Injecting the Service for form_login

*But*, in our `security.yaml` file, our main way of authenticating is `form_login`.
That *does* activate an authenticator service behind the scenes - just like *our*
custom `LoginFormAuthenticator`. The tricky part is figuring out what that service
*is* and injecting it into our controller.

So, we need to do a bit of digging. At your terminal, run
`symfony console debug:container` and search for `form_login`.

```terminal-silent
symfony console debug:container form_login
```

In this list, I see a service called `security.authenticator.form_login.main`...
and remember that "main" is the name of our firewall. *This* is the id of the service
that we want. If you're wondering about the service *above* this, if you checked,
you'd find that it's an "abstract" service. A, sort of "fake" service that's
used as a template to create the *real* service for any firewalls that use
`form_login`.

Anyways, I'll hit "1" to get more details. Ok cool: this service is an instance of
`FormLoginAuthenticator`, which is the core class that we looked at earlier.

Back in our controller, add another argument type-hinted with `FormLoginAuthenticator`.
Then, down here, pass the new argument to `authenticateUser()`. This *won't*
work yet, but stick with me.

The *final* argument to `authenticateUser()` is the `Request` object... which we
already have... it's our first controller argument.

## authenticateUser Returns a Response

Done! Oh, and one cool thing about `authenticateUser()` is that it returns a
`Response` object! Specifically, the `Response` object from the
`onAuthenticationSuccess()` method of whatever authenticator we passed in. This
means that instead of redirecting to the homepage, we can return this and, wherever
that authenticator *normally* redirects to, we will redirect there as well, which *could* be the "target path".

## Binding the form_login Service

Let's try this thing! Refresh the registration form to be greeted with... an awesome
error!

> Cannot autowire argument $formLoginAuthenticator.

Hmm. We *did* type-hint that argument with the correct class:
`FormLoginAuthenticator`. The problem is that this is a rare example of a service
that is not available for autowiring! So, we need to configure this manually.

Fortunately, if we didn't already know what service we need, the error message
gives us a great hint. It says:

> no such service exists, maybe you should alias this class to the
> existing `security.authenticator.form_login.main` service.

Yup, it *gave* us the id of the service that we need to wire.

Go copy the argument name - `formLoginAuthenticator` - and then open
`config/services.yaml`. Beneath `_defaults`, add a new `bind` called
`$formLoginAuthenticator` set to `@` then... I'll go copy that long service
id... and paste it here.

This says: whenever a service has a `$formLoginAuthenticator` argument, pass it,
this service.

*That*... if we refresh... will get rid of our error.

Ok, let's finally register a new user! I'll use my real-life email... then any
password... as long as it's 6 characters: our registration form came pre-built
with that validation rule. And... we got it. Down on the web debug toolbar, we
are logged in as Merlin! I feel the magical power.

Next: sometimes denying access is *not* as simple as just checking a role. For
example, what if you had a question edit page and it needs to only be accessible
to the *creator* of that question? It's time to discover a powerful system inside
of Symfony called voters.
