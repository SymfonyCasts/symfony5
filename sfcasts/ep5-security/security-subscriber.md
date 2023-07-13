# Creating a Security Event Subscriber

Here's our goal: if a user tries to log in but they have *not* verified their
email yet, we need to cause authentication to fail.

If you want to stop authentication for some reason, then you probably want to listen
to the `CheckPassportEvent`: that's called right *after* the `authenticate()` method
is executed on *any* authenticator and... its job is to do stuff like this.

## Creating the Event Susbcriber

In your `src/` directory, it doesn't matter where, but I'm going to create a new
directory called `EventSubscriber/`. Inside, add a class called
`CheckVerifiedUserSubscriber`. Make this implement `EventSubscriberInterface` and
then go to the "Code"-> "Generate" menu - or `Command` + `N` on a Mac - and hit
"Implement Methods" to generate the *one* we need: `getSubscribedEvents()`:

[[[ code('123553ade2') ]]]

Inside, return an array of all the events that we want to listen to, which is just
one. Say `CheckPassportEvent::class` set to the method on this class that should be
called when that event is dispatched. How about, `onCheckPassport`:

[[[ code('4d97fd928b') ]]]

Up above, add that: `public function onCheckPassport()`... and this will
receive this event object. So `CheckPassportEvent $event`. Start with
`dd($event)` so we can see what it looks like:

[[[ code('58fdb65eba') ]]]

Now, *just* by creating this class and making it implement
`EventSubscriberInterface`, thanks to Symfony's "autoconfigure" feature, it will
*already* be called when the `CheckPassportEvent` happens. And... if you want to
get technical, our subscriber listens to the `CheckPassportEvent` on *all*
firewalls. For us, we only have one *real* firewall, so it doesn't matter:

[[[ code('ba66da6ebd') ]]]

But if you *did* have multiple real firewalls, our subscriber would be called
whenever the event is triggered for *any* firewall. If you need to, you can add
a little extra config to target just *one* of the firewalls.

## Tweaking the Event Priority

Anyways, let's try this thing!. Log in as `abraca_admin@example.com`. We *did*
set  the `isVerified` flag in the fixtures to true for all users... but we
haven't reloaded the database yet. So this user will *not* be verified.

Try typing an *invalid* password and submitting. Yes! It hit our `dd()`. So this
*is* working. But if I type an invalid *email*, our listener is *not* executed.
Why?

Both the loading of the user *and* the checking of the password happen via listeners
to the `CheckPassportEvent`: the same event we're listening to. The inconsistency
in behavior - the fact that our listener was executed with an invalid password
but *not* with an invalid email - is due to the *priority* of the listeners.

Go back to your terminal. Ah, each event shows a *priority*, and the default is
zero. Let me make this a bit smaller so we can read it. There we go.

Look closely: our listener is called *before* the `CheckCredentialsListener`. That's
why it called our listener *before* the password check could fail.

But, that's not what we want. We don't want to do our "is verified" check until
we know the password is valid: no reason to expose whether the account is verified
or not until we *know* the real user is logging in.

The point is: we want our code to run *after* `CheckCredentialsListener`. To do
that, we can give *our* listener a *negative* priority. Tweak the syntax: set the
event name to an array with the method name as the first key and the priority
as the second. How about negative 10:

[[[ code('a2fbde8e3a') ]]]

Thanks to this, the user will need to enter a valid email *and* a valid password
before our listener is called. Try it: go back to `abraca_admin@example.com`,
password `tada` and... beautiful!

## Using the Event Object

Check out the event object that we're passed: it's *full* of good stuff. It contains
the authenticator that was used, in case we need to do something different based
on that. It also holds the `Passport`... which is *huge* because that contains the
`User` object *and* badges... because sometimes you need to do different things based
on the badges on the passport.

Inside of our subscriber, let's get to work. To get the user, we first need
to get the passport: `$passport = $event->getPassport()`. Now, add if *not*
`$passport` is an `instanceof UserPassportInterface`, throw an exception:

[[[ code('f1de8e770c') ]]]

This check isn't important and is *not* needed in Symfony 6 and higher. Basically,
this check makes sure that our `Passport` has a `getUser()` method, which in
practice, it always will. In Symfony 6, the check isn't needed at all because the
`Passport` class literally *always* has this method.

This means that, down here, we can say `$user = $passport->getUser()`. And then
let's add a sanity check: if `$user` is not an instance of our `User` class,
throw an exception: "Unexpected user type":

[[[ code('7a7b95600c') ]]]

In practice, in our app, this isn't possible. But that's a nice way to hint
to my editor - or static analysis tools - that `$user` is *our* User class.
Thanks to this, when we say if *not* `$user->getIsVerified()`, it auto-completes
that method:

[[[ code('4096b84c31') ]]]

## Failing Authentication

Ok, if we are *not* verified, we need to cause authentication to fail. How do we
do that? It turns out that, at any time during the authentication process, we can
throw an `AuthenticationException` - from Security - and that will cause
authentication to fail:

[[[ code('44c23b05a6') ]]]

And there are a bunch of subclasses to this class, like `BadCredentialsException`.
You can throw any of these because they all extend `AuthenticationException`.

Check it out. Let's refresh and... got it!

> An authentication exception occurred.

That's the generic error message tied to the `AuthenticationException` class...
not a very good error message. But it *did* get the job done.

How can we customize that? Either by throwing a different authentication
exception that matches the message you want - like `BadCredentialsException` - or
by taking *complete* control by throwing the special
`CustomUserMessageAuthenticationException()`. Pass this the message to show the
user:

> Please verify your account before logging in.

[[[ code('aae53638d5') ]]]

Let's see how this works. Hold `Cmd` or `Ctrl` and click to open this class. No
surprise: it extends `AuthenticationException`. If you try to pass a custom
exception message to `AuthenticationException` or one of its sub-classes, that
message will normally *not* be shown to the user.

This is because every authentication exception class has a `getMessageKey()`
method containing a hardcoded message... and *that* is what is shown to the user.
This is done for security so that we don't accidentally expose some internal
exception message to our users. This is why different authentication exception
sub-classes give us different messages.

However, there *are* some cases when you want to show a *truly* custom message.
You can do that by using this class. This will fail authentication just like
before, but now *we* control the message. Beautiful.

But we can do even better! Instead of just saying, "please verify your account",
let's redirect the user to another page where we can better explain why they can't
log in *and* give them an opportunity to re-send the email. This will require
a *second* listener and some serious team work. That's next.
