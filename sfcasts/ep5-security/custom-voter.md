# Custom Voter

To make the security system understand what it means when we check for `EDIT`
access on a `Question` object, we need a custom voter. And... to help us out,
we can *generate* this.

Find your terminal and run:

```terminal
symfony console make:voter
```

Let's call it `QuestionVoter`. I often have one voter class per *object* in my system
that I need to check access for. And... done!

## Adding the Voter Logic

Let's go check it out: `src/Security/Voter/QuestionVoter.php`. As usual, the location
of this class makes no difference. The important thing is that our voter
implements `VoterInterface`. Well, not directly... but if you open the core class
we extend, you can see that *it* implements `VoterInterface`. The point is: as soon
as we create a class that implements `VoterInterface`, each time that the
authorization system is called, Symfony will now call our `supports()` method
and basically ask:

> Hey! Do you understand how to vote on this `$attribute` and this `$subject`?

For us, I'm going to say if `in_array($attribute, ['EDIT'])`. So basically, *if*
the attribute that is passed is equal to `EDIT`. I'm just using an array in case
we support other attributes in this voter later - like `DELETE`.

Anyways, if the `$attribute` is `EDIT` *and* the `$subject` is an instance of
`Question`, then yes, we know how to vote on this.

If we return `false`, it means that our voter will "abstain" from voting. But
if we return true, *then* Symfony calls `voteOnAttribute()`. Very simply, we need
to take the attribute - in our case `EDIT` - and the `$subject` - in our case a
`Question` object - and determine whether or not the user should have access by
returning `true` or `false`.

I'm going to start by adding a few things that will help my editor. First, to get
the current `User` object, you use this `$token` and call `$token->getUser()`.
The only problem is that my editor doesn't know that this is an instance of *my*
specific `User` class: it only knows that it's some `UserInterface`. To help, I'll
add `@var User $user` above this. Even better, you could add an if statement
to check if `$user` is *not* an instance of `User` and throw an exception.

I'll actually do that down here. We know that `$subject` will be an instance of our
`Question` class. To help our editor know that, say if not `$subject` is an
`instanceof` `Question`, then throw a new `Exception` and just say "wrong type
somehow passed".

That should never happen, but we're coding defensively. And more importantly,
my editor - or static analysis tools like phpstan - will now know what type the
`$subject` variable is.

Finally, down here, the generated code has a switch-case to handle multiple
attributes. I'll remove the second case... and make the first case `EDIT`. And...
I don't even need the `break` because I'm going to return true if `$user` is
equal to `$subject->getOwner()`.

Let's try it! Back at the browser, I'm not logged in. So if we go back... to a
question page... and click "edit"... access is still denied. Log in with
our normal user. And then... access is still denied... which makes sense. We're an
admin user... but we are *not* the owner of this question.

So let's log in as the owner! Go back to the homepage and click into a question.
To make it more obvious *which* user owns this, temporarily, open
`templates/question/show.html.twig` and... down here, after the display name, just
to help debug, print `question.owner.email`.

And... cool. Copy the email and let's use impersonation! At the end of the URL,
add `?_switch_user=`, paste that email and... boom! Access is granted thanks to
our voter! We can prove it. Jump into the profiler and scroll down. Here it is:
access granted for `EDIT` of this `Question` object. I *love* that.

## Using the Voter in Twig

Now that we have this cool voter system, we can intelligently hide and show the
edit button. Back in `show.html.twig`, wrap the anchor tag with if
`is_granted()` passing the string `EDIT` and the question object.

How cool is that? We *should* still have access, and... when we refresh, it's still
there. But if I exit impersonation... and then click back to the question, it's gone!

## Also Allowing Admin Users to Edit

But I have one more challenge. Could we make it so that you can edit a question
if you are the owner *or* if you have `ROLE_ADMIN`. Sure! To do that, in the voter,
we just need to check for that role. To do that, we need a new service.

Add a constructor and autowire the `Security` service from the Symfony component.
I'll hit Alt + Enter and go to "initialize properties" to set things up. We talked
about this service earlier: we used it to get the currently-authenticated
User object from inside a service. It can *also* be used to check security from
within a service.

Even before the switch case, let's add: if `$this->security->isGranted('ROLE_ADMIN')`
then always return `true`. So admin users can do anything. Oh, but whooops,
I didn't mean to add that exclamation point!

Since we *are* currently logged in as an admin user.... as soon as we refresh,
we have the edit button... and it works. So cool.

Next: Let's add an email confirmation system to our registration form.
