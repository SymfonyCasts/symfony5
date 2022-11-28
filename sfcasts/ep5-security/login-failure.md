# Custom Redirect when "Email Not Verified"

It's cool that we can listen to the `CheckPassportEvent` and cause authentication to
fail by throwing any authentication exception, like this
`CustomUserMessageAuthenticationException`:

[[[ code('4f86425dd6') ]]]

But what if, instead of the normal failure behavior - where we redirect to
the login page and show the error - we want to do something different.
What if, in *just* this situation, we want to redirect to a totally *different*
page so we can explain that their email isn't verified... and maybe even allow
them to *resend* that email.

Well, unfortunately, there is no way - on this event - to control the failure
response. There's no `$event->setResponse()` or anything like that.

So we can't control the error behavior from here, but we *can* control it by
listening to a *different* event. We'll "signal" from *this* event that the account
wasn't verified, *look* for that signal from a different event listener, and
redirect to that other page. It's ok if this doesn't make sense yet: let's see it
in action.

## Creating a Custom Exception Class

To start, we need to create a custom authentication exception class. This will
serve as the "signal" that we're in this "account not verified" situation.

In the `Security/` directory, add a new class: how about
`AccountNotVerifiedAuthenticationException`. Make it extend `AuthenticationException`.
And then... do absolutely nothing else:

[[[ code('848e3c237c') ]]]

This is just a marker class we'll use to hint that we're failing authentication
due to an unverified email.

Back in the subscriber, replace the `CustomUserMessageAuthenticationException` with
`AccountNotVerifiedAuthenticationException`. We don't need to pass it *any* message:

[[[ code('73c8e27894') ]]]

If we stopped right now, this won't be very interesting. Logging in still fails, but
we're back to the generic message:

> An authentication exception occurred

This is because our new custom class extends `AuthenticationException`... and
that's the generic message you get from *that* class. So this isn't what
we want yet, but step 1 *is* done!

## Listening to LoginFailureEvent

For the next step, remember from the `debug:event` command that one of the listeners
we have is for a `LoginFailureEvent`, which, as the name suggests, is called any
time that authentication *fails*.

Let's add another listener right in this class for that. Say
`LoginFailureEvent::class` set to, how about, `onLoginFailure`. In this case, the
priority won't matter:

[[[ code('61f59f0a91') ]]]

Add the new method: `public function onLoginFailure()`... and we know this will
receive a `LoginFailureEvent` argument. Just like before, start with
`dd($event)` to see what it looks like:

[[[ code('40a37351a2') ]]]

So with any luck, if we fail login - for any reason - our listener will be called.
For example, if I enter a bad password, yup! It gets hit. And notice that the
`LoginFailureEvent` has an exception property. In this case, it holds a
`BadCredentialsException`.

Now log in with the correct password and... it got hit again. But *this* time, check
out the exception. It's our custom `AccountNotVerifiedAuthenticationException`! So
the `LoginFailureEvent` object contains the authentication exception that *caused*
the failure. We can use that to know - from this method - if authentication failed
due to the account not being verified.

## Redirecting when Account is Not Verified

So, if *not* `$event->getException()` is an instance of
`AccountNotVerifiedAuthenticationException`, then just return and allow the default
failure behavior to do its thing:

[[[ code('d2033dfd9b') ]]]

Finally, down here, we know that we should redirect to that custom page. Let's...
go create that page real quick. Do it in `src/Controller/RegistrationController.php`.
Down at the bottom, add a new method. I'll call it `resendVerifyEmail()`. Above
this, add `@Route()` with, how about `/verify/resend` and name equals
`app_verify_resend_email`. Inside, I'm just going to render a template: return
`$this->render()`, `registration/resend_verify_email.html.twig`:

[[[ code('093f8613f8') ]]]

Let's go make that! Inside of `templates/registration/`, create
`resend_verify_email.html.twig`. I'll paste in the template:

[[[ code('00bdad4348') ]]]

There's nothing fancy here at all. It just explains the situation.

I *did* include a button to resend the email, but I'll leave the implementation
to you. I'd probably surround it with a form that POSTs to this URL. And then,
in the controller, if the method is POST, I’d use the verify email bundle
to generate a new link and re-send it. Basically the same code we used after
registration.

Anyways, now that we have a functional page, copy the route name and head back
to our subscriber. To override the normal failure behavior, we can use a
`setResponse()` method on the event.

Start with `$response = new RedirectResponse()` - we're going to generate a URL
to the route in a minute - then `$event->setResponse($response)`:

[[[ code('d5a84a00cc') ]]]

To generate the URL, we need a `__construct()` method - let me spell that
correctly - with a `RouterInterface $router` argument. Hit `Alt`+`Enter` and go
to "Initialize properties" to create that property and set it:

[[[ code('6d9e31c4ff') ]]]

Back down here, we're in business: `$this->router->generate()` with
`app_verify_resend_email`:

[[[ code('1361f5e4e6') ]]]

Donezo! We fail authentication, our first listener throws the custom exception,
we look for that exception from the `LoginFailureEvent` listener... and set
the redirect.

Testing time! Refresh and... got it! We're sent over to `/verify/resend`. I love
that!

Next: let's finish this tutorial by doing something *super* cool, super fun, and...
kinda nerdy. Let's add two-factor authentication, complete with fancy
QR codes.
