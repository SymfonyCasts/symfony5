# Creating a Security Event Subscriber

Coming soon...

to log in as a user whose email has not been verified, I want to prevent the user
from logging in. So if you want to stop authentication for some reason, then you're
going to want to listen to the `CheckPassportEvent`. So let's create an Event
Subscriber. So any source directory doesn't matter where I put this, but I'm going
to create a new directory called `EventsSubscriber/`, and inside of there. And you
class called  `CheckVerifiedUserSubscriber` And I'll make this implement the
`EventSubscriberInterface`, and then I'll go to code generate or Command + N on a
Mac and go to "Implement Methods" to generate the one method we need, which is
`getSubscribedEvents()`.

And some of here I'm going to return an array of all the events we're going to listen
to, or try now is just one. So we can say `CheckPassportEvent::class`, and
assign that to the method that we want. The methadone's class that should be called
when that event is dispatched. I'm gonna say `onCheckPassport` up above this.
I'll say public function `onCheckPassport()`. And this is going to be past this
event object. So `CheckPassportEvent $event`. And let's just `dd()` the, that `$event` to
see what it looks like now, just by creating a class and making it implement
`EventSubscriberInterface`, Symfony is going to use this things to auto configure. And if
you want to get in the weeds, it's technically going to listen to the Disney check
password event on all firewalls, which for us, we only have one really only have one
firewall. So it doesn't matter. But if you did have multiple real firewalls, then if
you, you could actually make this listen on just one of the firewalls. Um, but that's
beyond our scope. Check the documentation for that.

All right. So let's try something. I don't know, log in as adver up CA admin, at
example.com. We did make our fixtures users verify, but I haven't reloaded my
database yet. So that user is not going to be verified yet. Now notice by type the
wrong password here. Yes, it hit our DD. So it is working, but if I type in invalid
Email here, then our listener is not hit. And that's just due to the priority of the
listeners. If you go back to our debug console, you can see there that there's a
priority priority over here. And the default is zero. So let me actually make this a
little bit smaller so we can read it better. There we go. Okay. So by chance, Our
listener is kind of happening by chance before check credentials. That's why it was
hitting this before the PA that password validation, uh, through, but the, um, kind
of user checker stuff was happening before this. No, it's about an expiration check.
Credentials is the problem. It actually is the thing that loads the user. So all we
needed to do is make our W oh yeah, no, no, no. We want ours to have an after the
password, uh, only after the valid email and valid password. So we want both of these
to happen. So we're gonna set a negative priority, panic, excuse myself. So do that.
We can pass an array in here and say negative 10. So now we're going to have to put
in a valid email address and valid password, and only then will our event get called.
So I'm going to go back to `abraca_admin@example.com`

password cutoff and beautiful, because that was a valid login.
It stopped in check out this event, and this is awesome. We're past so many good
things. We're past the authenticator that's being used in case we need to do
something different based on the authenticator. And we're also passed the passport,
which is huge because that contains the user. And it also contains any badges that we
added to it, because sometimes you need to do different things based on the badges
that are on your passport. So inside of our subscriber, let's get to work in order to
get the user. We first need to get the passport, the `$passport = $event->getPassport()`.
And now I'm gonna say, if not `$passport`, in instance of `UserPassportInterface`, then throw an
exception.

This is not really important. Um, in reality, if I hit shift, shift my for passport
dot PHP, what every authenticated returns is this passport object here, which
implements this `UserPassportInterface`. What, so in reality, all of our passwords
are going to implement this. This interface means that the passport is going to have
a `getUser()` method on it that you can call to fetch the user. That means down here, we
can say `$user = $passport->getUser()`, and then I'll do a little sanity check
there. If the `$user` not an instance of our `User` class, then I'll also throw an
exception, Unexpected user type. And that's not really possible, but that's going to
make our editor happy. Cause it, now it knows what our user, we have, what our users
in instance of. And it's also going to, if you stack analysis like PHP standard
Psalm, it's going to make that happen as well.

Finally, we can check it. The user's verified. If not `$user->getIsVerified()`, get is
verified, then let's fail indication. How do we fail on occasion? At any time during
the process, you can throw a new `AuthenticationException` from security, and that
will cause authentication to fail. There are a bunch of subclasses of this like bad
credentials, exception. You can throw any of those as long as they all extend
authentication exception. That will cause the process to fail. Check it out. Let me
refresh here and got it. And authentication exception occurred. That is the generic
error message that is tied to authentication exception, not a very good error
message, but it did get the job done. How can we customize that error message by
throwing a very cool new `CustomUserMessageAuthenticationException()`, and inside of
here, we can say, please verify your account before logging in.

So let me explain this class here. If you all command or control and click to open
that you can see that this just extends authentication exception. It's just a special
authentication exception, most authentication exceptions and subclasses. If you pass
them a custom message, like throw a new authentication exception and pass them a
custom exception that except the message is not going to be seen by the end user.
Instead every single one of these authentication exception classes has a, where is it
getting messaged key method with a hard coded message in it. That's done for
security. So we always are going to show the user a nonsensitive message inside of
here. However, there are some cases where you do on purpose, want to throw in
authentication exception, but control the messaging to your user. You can do that
with this class right here. So it's going to fail its indication just like before,
but now we can control the message. Exactly beautiful bot to team. We can do even
better instead of just saying, please verify your account. And if we're logging in,
let's redirect them to another page so that we can better explain why they can't log
in and give them an opportunity to rescind the email. If they lost it, let's do that
next. It will require a second listener and some teamwork.
