# Voters

When we need to deny access to something, we can do it in a couple of different
places, like via `access_control` in `security.yaml`, or various ways inside of a
controller. And when we deny access, we know that we can do it by checking for a
role like `ROLE_ADMIN` or by checking one of the special strings like
`IS_AUTHENTICATED_REMEMBERED`. It seems pretty simple, right? If we use something
like `ROLE_ADMIN`, it clearly calls `getRoles()` on the `User` and denies or allows
access.

## Introducing: the Voter System

That is... basically true. But in reality, whenever you call the authorization
system - either via  `access_control`, `->denyAccessUnlessGranted()`, or even the
`IsGranted()` annotation or attribute, something more interesting happens internally.
It activates what's called the "voter" system.

We can actually see this. Refresh the page and then click on the security icon in
the web debug toolbar to jump into the profiler. Down near the bottom of this page,
as we saw earlier, you can find an "Access Decision Log" that shows you all the
different times that the authorization system was called. Apparently it was called
a *bunch* of times. Most of these us trying to figure out whether or not we should
show or hide the voting links for each answer.

But check out this little "Show voter details" link. When you click, oooo.
There are two voters. The first one voted `ACCESS_DENIED` and the second voted
`ACCESS_ABSTAIN`.

When you call the authorization system, it actually loops over these things called
voters and asks each one:

> Do you know how to decide whether or not the user has `IS_AUTHENTICATED_REMEMBER`,
> or `ROLE_ADMIN`... or whatever thing we're passing in.

In practice, exactly *one* of these voters will say that they *do* understand how
to vote on that string and they'll answer with either `ACCESS_DENIED` or
`ACCESS_GRANTED`. All the other voters return `ACCESS_ABSTAIN`... which just means
that they didn't vote one way or another.

So, for example, whenever you call the authorization system and pass it one of
those `IS_AUTHENTICATED_` strings, it's this `AuthenticatedVoter` that knows how
to decide whether the user has that or not.

The `RoleHierarchyVoter`, well you can probably guess. That's responsible for voting
on anything that starts with `ROLE_`. Internally, that voter checks to see if the
user has that role. Well technically it checks the "token"... but that's not
important. It also checks the `role_hierarchy` in `security.yaml`.

And, by the way, even this is called the "voter" system, in *all* cases, every voter
*except* for exactly one will abstain, which means they don't vote at all. Uou never
end up in a situation where you have 5 voters and 3 vote access granted and 2
vote access denied.

## Passing Custom "Attributes" into Authorization

Until now, denying access on our site has been pretty simple. We've either wanted
to check to see if the user is logged in we've checked for a specific role.

But security isn't always that simple. For our edit question page, we can't just
check for a global role. We need to check to see if the current user is the *owner*
of this question. If you think about it: the security logic is specific to some
object - in this case - the `Question` object. Putting the logic in the controller
worked, but it means that we're going to have to duplicate this logic in our Twig
template in order to hide or show this "edit question" link.

The way to fix this is by creating our *own* custom voter that centralizes our logic.
To do this, delete all of this code and replace it with
`$this->denyAccessUnlessGranted()`.

Here is where things get interesting: we're going to "invent" a new string to
pass to this, which is actually called an attribute. Say `EDIT`. I totally just made
that up. You'll see how it's used in a minute.

Then, we haven't seen it yet, but you can actually pass a *second* argument to
`denyAccessUnlessGranted()`, which is some data related to this security check.
Pass the `Question` object.

Ok, stop right now and click to the edit page. Ooh, we got "access denied". We can
tell because it redirected us to the login page. Click any link on the web debug
toolbar to jump into the profiler, click "Last 10", then find the request to
the question edit page. Click to view *its* profiler info.. and go down to the
Security section here.

At the bottom, under the "Access Decision Log", access was Denied for attribute
"EDIT" and this `Question` object. If you look at the voter details... oh! They
*all* abstained. So *every* voter said: "I don't know what the attribute "EDIT"
and a `Question` object. And if all voters abstain, we get access denied.

Next: let's fix this by adding our own custom voter that *does* know how to vote
on this situation. Once we're finished, we'll make or logic even *more* complex
by *also* allowing admin users to access the edit page.
