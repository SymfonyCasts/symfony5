# Login Failure

Coming soon...

It's cool that we can listen to the Czech passport event and cause authentication to
fail by throwing any authentication exception like this custom user message
authentication exception. But what if instead of the normal authentication failure
behavior, where we redirect the log-in page and show the error, we want to do
something different, like redirect to a totally different page in just this
situation. Well, unfortunately there's not a way on this event, object to control the
response. We don't have like a event set response or anything like that. So we can't
control the error behavior from here, but we can control what happens when there's an
air from a different listener. Then we can have the both listeners work together as a
team to do this. We first need to create our own custom authentication exception
class. So in the security directory, okay. A new class, it could be called anything.
I'll call account, not verified, authentication exception, and then I will make it
extend authentication exception. Cool. But I'm going to do nothing in here. It's just
going to be a marker interface, a marker class back inside of our subscriber inside
of our custom class custom user message authentication exception. Let's now throw
account, not verified, authentication exception.

We don't need to pass it. Any message. Now if we stopped right now, that's not very
interesting. We are just going to go back to our very odd an an authentication
exception occurred message. So leave that for a second. And let's now add another
listener. Remember from our debug event that one of the listeners we have is it
log-in failure event, which as the name sounds is called every dispense. Every time
log-in fails, let's add another listener right in this class for that. So I'll say
login failure event calling home class, and then we'll call on log in failure. This
case the priority is not, does it won't matter. Okay. Call it function on log-in
failure. And we know that this way, pass it along and failure event argument,
software that there, and then let's just DD that event to make sure that it's called.

So with any luck, if we fail, if we fail log in, for any reason, this will be caught.
So for example, if I put in a bad password here, yes, it hits it. It hits and notice
this log and failure event has an exception. Properties had two bad credentials
exception. Now let me log in with the correct password and it got hit again. But this
time check out the exception. It's our custom account, not verified, authentication
exception. So the login failure event object contains the exception that caused a
failure. We can use that to know from this method, if authentication failed due to
the account, not being verified, if it did, we can do something different. So first
it's not, if you're like, let's check for that. If not event arrow, get exception,
instance of account, not verified exception, then let's just return. So if it's some
other type of exception, we're going to do nothing and let the normal behavior happen
down here.

We're going to redirect to a new page. Let's go create that page real quick. So let's
do it in source controller, registration controller down here on the bottom. Let's
make a new method. I'll call it, send, verify email and above this. We'll add our
route that route. How about verify /resend name = app verify three, send email inside
of here. I'm not. I'm just going to render a template as a return. This error render
registration, oops, /rescind verify email that .html.twig cool inside of the template
/registration directory. That's create a new file. Recent verify, email that age
channel that twig.

And I'm just going to paste in a template. So there's nothing fancy here at all. It
just says, verify your email to explains the situation. And then there's a button to
resend the email, which I actually I'll leave that up to you. You can make this go to
a new controller that would use the same method of creating the verification email as
before. But now that we have a functional page, I'm going to copy this route. And
instead of subscriber, all we need to do here is redirect there. Now, the way we do
that is that the log-in failure has a set response method where we can take over what
happens on log-in failure. Okay. So what we're gonna do here is I'm going to say
response = new redirect response, and then we're going to generate a URL to that
route. And then ultimately we'll say response error event, arrows, that response
response to generate that you were out, we're going to need the router. So I had to,
on top of this class, add a construct method,

Spell it correctly. They router interface, router arguments, hit all. Tenter go to
initialize properties to create that property and set it and down here, we're in
business. This->router->generate then app verify recent email. Oh, that's so cool. So
we fail. We call that authentication to fail with this custom exception. We listened
to that a customer exception and override what happens on logging failure. Let's try
it. So I need to do is refresh this page and got it. Where sent over to /verify
/reascend love that next team. Let's do something super cool, super fun, super nerdy.
Let's add a two factor authentication to our site complete with QR codes and
everything.

