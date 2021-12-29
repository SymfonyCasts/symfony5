# Security Events & Listeners

If you've used Symfony for a while, you probably know that Symfony dispatches events
during the request-response process and that you can listen to them. To see
these events and their listeners, we can run:

```terminal
symfony console debug:event
```

I'm not going to go too deeply, but, this `kernel.request` event is dispatched
on every request *before* the controller is called. This means that all of these
*listeners* are executed before our controller. Listeners to this `kernel.response`
event are called *after* our controller.

These two events have... nothing to do with the security system. But it turns out
that our firewall *also* dispatches several events during the authentication process.
And, we can also listen to those.

To see a list of all of the listeners to these events, we can run `debug:event`
again, but with a special `--dispatcher=` set to `security.event_dispatcher.main`.

I know, that looks a little funny... but this allows us to list the event listeners
for the event dispatcher that's specific to the `main` firewall.

```terminal-silent
symfony console debug:event --dispatcher=security.event_dispatcher.main
```

## Looking at the Core Security Events & Listeners

And... awesome! A totally different set of events and listeners. This is so cool.
Look back at our custom `LoginFormAuthenticator` class. We're not using this
anymore, but it can help us understand which events are dispatched through the
process.

We know that, in our `authenticate()` method, our job is to return the `Passport`.
Then, after the `authenticate()` method is called - on *any* authenticator - Symfony
dispatches `CheckPassportEvent`. There are a *bunch* of cool listeners to this.

For example, `UserProviderListener` is basically responsible for loading the `User`
object, `CheckCredentialsListener` is responsible for checking the password,
`CsrfProtectionListener` validates the CSRF token and `LoginThrottlingListener`
checks... the login throttling.

If we fail authentication, there's a *different* event for that: `LoginFailureEvent`.
Right now, our app has just one listener - `RememberMeListener` - which clears the
remember me cookie if the user had one.

When login is successful, Symfony dispatches `LoginSuccessEvent`. This already
has 5 listeners in our app, including the listener that *sets* the remember me
cookie.

There's also an event that's dispatched when you log out... so you can run
code or even control what happens - like where the user is redirected to.

This next one - `TokenDeauthenticatedEvent` - is a bit more subtle. It's dispatched
if the user "loses" authentication... but didn't log out. It's basically dispatched
if certain data *changes* on the user. For example, imagine you're logged in on two
computers and then you change your password on the first. When you refresh the site
on the second computer, you will be "deauthenticated" because your password changed
on another machine. In that case, this event is dispatched.

Oh, and this `security.authentication.success` isn't too important, it's very similar
to `LoginSuccessEvent`.

Knowing about these events is critical because I want to make it so that if the
user tries to log in using an email that has *not* been verified, we prevent
that and show them a nice message.

Let's do that next by bootstrapping our very own shiny event listener that has
the ability to cause authentication to fail.
