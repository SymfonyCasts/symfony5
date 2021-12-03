# Custom Voter

Coming soon...

So now
let's add our own custom voter that does understand and answer whether or not we have
access to edit a question object to help us do this, go to the terminal or on the

```terminal
symfony console make:voter
```

And let's call it `QuestionVoter`. I often have one voter
class per object in my system and done this great exactly one new class. So let's go
check it out. `src/Security/Voter/QuestionVoter.php` as usual. The location of
this class makes no difference at all. The important thing is that our voter
implements a `VoterInterface`. Well, not directly, but if you open this voter core
class, you can see that it implements `VoterInterface`. So as soon as we have a class
that implements the voter interface, every time that's the authorization system is
called, Symfony is going to call our `supports()` method and ask us whether or not we
understand how to vote on this `$attribute` and this `$subject`.

So for us, I'm going to say if in array attribute `EDIT`, so Gatorade is equal to edit. I'll
leave the array here. In case later, maybe I have, I have a separate checks for like,
are you able to delete or something like that? But anyways, if the `$attribute` `EDIT` is
the attribute and the `$subject` is an instance of `Question`, that's actually perfect.
Then yes, we know how to vote on this. We're returning false from this, our voters
going to abstain from voter. If we return true from this, then Symfony calls
`voteOnAttribute()`. And very simply we need to take the attribute in our case, `EDIT` and the
subject in our case, a `Question` object and determine whether or not the user should
have access by returning a true or a Boolean from this method. So this is fairly
simple.

I'm going to start by adding a couple of things. That'll help my editor. First of
all, the way that you get the user in here is you're past this kind of token object.
And then you call `$token->getUser()`. That's fine, except that my editor is not
going to know that this is an instance of my specific `User` class. So I'm going to
help it out by adding at VAR user above it. And then down here, we know that subject
is going to be an instance of our `Question` object. So I'm going to do kind of
something similar, but I'll, uh, in different way. I'm going to say if not `$subject` is
an instance of `Question`

And throw a new Exception and just say the wrong type somehow passed, that shouldn't
happen, but we're now coding defensively. And almost more importantly, now my editor
is going to know, and any static analysis tools I have are going to know what that
subject variable is. Finally down here, you see a kind of have a kind of a switch
case in case we're handling multiple cases, I'm going to lead a second case. We'll
make the first case `EDIT`. And I don't even need the break because I'm just going to
return true. If `$user` is equal to `$subject->getOwner()`, if it's not, this will
return false. Let's try it. All right. So I am anonymous right now. I am not logged
in. So if I go to actually, let's go back here or go back to the question page. I
click edit access is still denied, so let's log in. Okay. And when agreed to is back
to the edit page, it's access denied, which makes sense. We're an admin user, but we
are not the owner of this question. All right. So let's log in as the owner of this
question. So I'm gonna go back to the homepage, click inside of here, and you want to
make it more obvious, like which user actually owns this. I'm going to temporarily go
into the, I'm going to go into the `templates/question/show.httml.twig`
and down here after the display name says, just kind of to help us debug. I'm going
to say `question.owner.email`.

Perfect. So that you'll give me kind of an easy way and I'll do is I'll use
impersonation. So I'm going to go up here and say, `_switch_user=` that emailed us,
boom, I'm a person hitting them. And then when I hit edit access, granted, thanks to
our voter. We can even see it. If we jump into the profiler and scroll down, you can
see up here, access granted for editing this question object. I love that. And now
that we have this cool voter system, we can intelligently hide and showed this
button. So back in showed at HR twig, we can wrap this anchor tag with a similar Khan
Twix. So if h `is_granted()`, then we'll say `EDIT` and we'll pass it. The question object,

How cool was that? So it says, I do have access right now and I refresh it's still
there, but if I exit impersonation and click into it, it's gone so cool. But I have
one more challenge for us. What if we want to make it so that you can edit a question
if you are the owner or if you have `ROLE_ADMIN`. So to do that, all we need to do is
add a check to see if the current user has `ROLE_ADMIN` from inside of our voter to do
that. We can inject,

We can autowire, the `Security` class from civic component. We talked about this
service earlier. I'll hit all the enter and go to initialize properties, set up. We
thought about this service earlier. This is the way that you can get a S the user
object from within a service, but you can also use it to check security from within a
service. So we can add is if this will say, even before the switch case, if
`$this->security->isGranted('ROLE_ADMIN')` then we will always return a true, so admin
users can do anything. And since we're logged in as an admin user, as soon as we
refresh, Whoops, and I didn't mean to put the excavation went there. There we go. So
if it's granted `ROLE_ADMIN` return, true, we have access to everything. And since we
are logged in as admin user, when I refresh, we have the edit button and it works so
cool. All right, next, Let's add an email verification system to our registration
form. So after registration, we're going to need to, we're going to have a way to
confirm our email address.
