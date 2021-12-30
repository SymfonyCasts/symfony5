# Custom Redirect when "Email Not Verified"

It's cool that we can listen to the `CheckPassportEvent` and cause authentication to
fail by throwing any authentication exception like this
`CustomUserMessageAuthenticationException`. But what if, instead of the normal
failure behavior - where we redirect to the login page and show the error - we want
to do something different. What if, in *just* this situation, we want to redirect
to a totally *different* page so we can explain that their email isn't verified...
and maybe even allow them to resend that email.

Well, unfortunately there's not a way - on this event - to control the failure
response. There's no `$event->setResponse()` or anything like that.

So we can't control the error behavior from here, but we *can* control it by
listening to a *different* event. We'll "signal" from *this* event that the account
wasn't verified, *look* for that signal from a different event listener, and
redirect to that other page. It's ok if this doesn't make sense yet: let's see it
in action.

## Creating a Custom Exception Class

To start, we need to create a *custom* authentication exception class. This will
serve as the "signal" that we're in this "account not verified" situation.

In the `Security/` directory, add a new class: how about
`AccountNotVerifiedAuthenticationException`. Make it extend `AuthenticationException`.
And then... do absolutely nothing else. This is just a marker class we'll use to
hint that we're failing authentication due to an unverified email.

Back in the subscriber, replace the `CustomUserMessageAuthenticationException` with
`AccountNotVerifiedAuthenticationException`. We don't need to pass it *any* message.

If we stopped right now, this won't be very interesting. Logging in still fails, but
we're back to the generic message:

> An authentication exception occurred

This is because out new custom class extends `AuthenticationException`... and that's
the generic message from that class. So this isn't what we want yet, but step 1
*is* now done.

## Listening to LoginFailureEvent

For the next step, remember from the `debug:event` command that one of the listeners
we have is for a `LoginFailureEvent`, which, as the name suggests, is called any
time that authentication *fails*.

Let's add another listener right in this class for that. Say
`LoginFailureEvent::class` set to, how about, `onLoginFailure`. In this case, the
priority won't matter.

Add the new method: `public ffunction onLoginFailure()`... and we know this will
receive a `LoginFailureEvent` argument. Just like before, let's start with
`dd($event)` to see what it looks like.

So with any luck, if we fail login - for any reason - our listener will be called.
For example, if I enter a bad password, yup! It gets hit. And notice that the
`LoginFailureEvent` has an exception property. In this case, it holds a
`BadCredentialsException`.

Now log in with the correct password and... it got hit again. But *this* time, check
out the exception. It's our custom `AccountNotVerifiedAuthenticationException`! So
the `LoginFailureEvent` object contains the authentication exception that *caused*
the failure. We can use that to know - from this method - if authentication failed
due to the account not being verified. And then, we can do something different.

## Redirecting when Account is Not Verified

So, if *not* `$event->getException()` is an instance of
`AccountNotVerifiedAuthenticationException`, then just return and allow the default
failure behavior to do its thing.

Finally, down here, we know we should redirect to that custom page. Let's... go create
that page real quick. Do it in `src/Controller/RegistrationController.php`. Down
here at the bottom, add a new method. I'll call it `resendVerifyEmail()`. ABove
this, add `@Route()` with, how about `/verify/resend` and name equals
`app_verify_resend_email`. Inside, I'm just going to render a template: return
`$this->render()`, `registration/resend_verify_email.html.twig`.

Let's go make that! Inside of the  `templates/registration/` directory, create
`resend_verify_email.html.twig` I'll just paste in the template: there's nothing
fancy here at all. It just says: "verify your email" and explains the situation.

I *did* include a button to resend the email, but I'll leave the implementation
to you. I'd probably surround it with a form that POSTs to this URL. And then,
in the controller, if the method is POST, you can use the verify email bundle
to generate a new link and re-send it.

Anyways, now that we have a functional page, copy the route name and head back
to our subscriber. To override the normal failure behavior, we can use a
`setResponse()` method on the event.

But we need the response first:  `$response = new RedirectResponse()`... and
we're going to generate a URL to that route in a minute. Use
`$event->setResponse($response)` to use this.

To generate the URL, we need a `__construct()` method - let me spell that correctly -
with a `RouterInterface $router` argument. Hit Alt+Enter and go to initialize
properties to create that property and set it.

Back down here, we're in business: `$this->router->generate()` passing
`app_verify_resend_email`.

That's it! We fail authentication, our first listeners throws that custom exception,
we look for that exception from the `LoginFailureEvent` and set the redirect.

Let's try it! Refresh and... got it! We're sent over to `/verify/resend`. I love
that!

Next: let's finish this tutorial by doing something *super* cool, super fun and...
kinda nerdy. Let's add two factor authentication to our site, complete with fancy
QR codes.
