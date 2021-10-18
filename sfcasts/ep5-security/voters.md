# Voters

Coming soon...

We know that when we need to deny access to something, we can do it in a couple of
different places like in access control and security, diagonal, or various ways
inside of a controller. And when we deny access, we know that we can do it by using a
role like rural admin or a couple of these kind of special things like is
authenticated. Remember now it seems pretty simple, right? If we use something like
role admin, what it does, it goes and looks on the user sees if the user has that
role in either allows or denies access and on a high level, that is completely true.
But in reality, whenever you call the authorization system, either via access
control, deny access, unless granted, or even the is granted, annotation, something
more interesting happens internally. It activates what's called a voter system. We
can actually see this. Let's see Let's refresh this page and then click on the

Security icon to jump into the profiler down at the bottom of this page. As we saw
earlier, you can find an access decision log like shows you all the different times
that the authorization system was called. So this guy was actually called a bunch of
times. Most of these are to figure out whether or not we should show or hide the
voting links for each question, each answer, but check out this little link on each
one. It says, show voter details. When you click it, there are two voters in this
case, the first one says access denied. And the second one says access abstain. So
the truth is that when you call the authorization system, it actually loops over to
these things called voters and asks each one. Do you know how to decide Whether or
not the user has, uh, whether or not they user has, is authenticated, remember, or
role previous admin role admin

[inaudible].

And then what happens is that exactly one of those voters will say that they do
understand how to vote on that. And then they'll say either access denied or access
granted. So internally, whenever you start with one of those ease authenticated
things, it's actually this authenticated voter that knows how to decide that this
role hierarchy voter that's responsible for deciding on anything that starts with
role underscore. So if what we pass into this series system starts with rural
underscore. It is called, and it looks on the user to see if it has that role. And it
also looks at the role higher, the configuration insecurity .yaml.

And by the way, even though the system is called the voter system, in all cases,
every voter will exact all voters will abstain, which means they don't vote at all.
Except for one, you're never going to end up in a situation where you have five
voters and they win by a count of three to two anyways, until now denying access in
our site has been pretty simple. We've either wanted to check to see if the user is
logged in, or sometimes we've wanted to check for a specific role, but security.
Isn't always that simple for our edit question page. We can't just check for a global
role. We need to check to see if the current user is the owner of this question. So
the security check is specific to some object. In this case, the question object put
in logic in the controller worked, but it means that we're going to have to duplicate
this logic in our twig template also to hide or show this edit question and things
are going to get even more complex.

If our logic is more complex. So the way that we fix this is we are going to create
our own voter that centralizes our logic to do this, delete all of this code. And
we're going to add a new, this->deny access unless granted, and then we're going to
invent a new first key is first key is actually called an attribute. I'm going to say
edit. I totally made that up. You'll see. Well, how it's, why it's important a
second. And then we haven't seen it yet, but you can actually pass a second argument
to deny access unless granted, which is some data related to, to this question. So do
this a check. We are going to pass the question object. Now, if I stop right there
and go to click the edit page, we get access tonight. We can tell because it
redirected us to the log in page.

And if I kind of, I'm going to open up the profiler and hit last 10, and I'm going to
go find that request here. That was actually the request to the edit page. I'm going
to go open that up and go down to the security system here. And if you scroll down
cool, you can actually see access denied for attribute, edit object to question. And
if you look at the voter details, they all abstained. So everybody said, I don't know
what to do with that. And so if all voters abstain, you get access tonight. So now
let's add our own custom voter that does understand and answer whether or not we have
access to edit a question object to help us do this, go to the terminal or on the
Symfony console, make voter. And let's call it question voter. I often have one voter
class per object in my system and done this great exactly one new class. So let's go
check it out. So we're security voter question voted at BHP as usual. The location of
this class makes no difference at all. The important thing is that our voter
implements a voter interface. Well, not directly, but if you open this voter core
class, you can see that it implements voter interface. So as soon as we have a class
that implements the voter interface, every time that's the authorization system is
called, Symfony is going to call our supports method and ask us whether or not we
understand how to vote on this attribute and this subject.

So for us, I'm going to say if NRA attribute edit, so Gatorade is equal to edit. I'll
leave the array here. In case later, maybe I have, I have a separate checks for like,
are you able to delete or something like that? But anyways, if the attribute edit is
the attribute and the subject is an instance of question, that's actually perfect.
Then yes, we know how to vote on this. We're returning false from this, our voters
going to abstain from voter. If we return true from this, then Symfony calls vote on
an attribute. And very simply we need to take the attribute in our case, edit and the
subject in our case, a question object and determine whether or not the user should
have access by returning a true or a Boolean from this method. So this is fairly
simple.

I'm going to start by adding a couple of things. That'll help my editor. First of
all, the way that you get the user in here is you're past this kind of token object.
And then you call token arrow, get user. That's fine, except that my editor is not
going to know that this is an instance of my specific user class. So I'm going to
help it out by adding at VAR user above it. And then down here, we know that subject
is going to be an instance of our question object. So I'm going to do kind of
something similar, but I'll, uh, in different way. I'm going to say if not subject is
an instance of question

And throw a new exception and just say the wrong type somehow passed, that shouldn't
happen, but we're now coding defensively. And almost more importantly, now my editor
is going to know, and any static analysis tools I have are going to know what that
subject variable is. Finally down here, you see a kind of have a kind of a switch
case in case we're handling multiple cases, I'm going to lead a second case. We'll
make the first case edit. And I don't even need the break because I'm just going to
return true. If user is equal to subject arrow, get owner, if it's not, this will
return false. Let's try it. All right. So I am anonymous right now. I am not logged
in. So if I go to actually, let's go back here or go back to the question page. I
click edit access is still denied, so let's log in. Okay. And when agreed to is back
to the edit page, it's access denied, which makes sense. We're an admin user, but we
are not the owner of this question. All right. So let's log in as the owner of this
question. So I'm gonna go back to the homepage, click inside of here, and you want to
make it more obvious, like which user actually owns this. I'm going to temporarily go
into the, I'm going to go into the templates. Questions showed at age two months way
and down here after the display name says, just kind of to help us debug. I'm going
to say question that owner, that email.

Perfect. So that you'll give me kind of an easy way and I'll do is I'll use
impersonation. So I'm going to go up here and say,_switch,_a user = that emailed us,
boom, I'm a person hitting them. And then when I hit edit access, granted, thanks to
our voter. We can even see it. If we jump into the profiler and scroll down, you can
see up here, access granted for editing this question object. I love that. And now
that we have this cool voter system, we can intelligently hide and showed this
button. So back in showed at HR twig, we can wrap this anchor tag with a similar Khan
Twix. So if his_granted, then we'll say edit and we'll pass it. The question object,

How cool was that? So it says, I do have access right now and I refresh it's still
there, but if I exit impersonation and click into it, it's gone so cool. But I have
one more challenge for us. What if we want to make it so that you can edit a question
if you are the owner or if you have role_admin. So to do that, all we need to do is
add a check to see if the current user has role_admin from inside of our voter to do
that. We can inject,

We can auto wire, the security class from civic component. We talked about this
service earlier. I'll hit all the enter and go to initialize properties, set up. We
thought about this service earlier. This is the way that you can get a S the user
object from within a service, but you can also use it to check security from within a
service. So we can add is if this will say, even before the switch case, if
this->security->is granted role_admin, then we will always return a true, so admin
users can do anything. And since we're logged in as an admin user, as soon as we
refresh, Whoops, and I didn't mean to put the excavation went there. There we go. So
if it's granted role admin return, true, we have access to everything. And since we
are logged in as admin user, when I refresh, we have the edit button and it works so
cool. All right, next, Let's add an email verification system to our registration
form. So after registration, we're going to need to, we're going to have a way to
confirm our email address.

