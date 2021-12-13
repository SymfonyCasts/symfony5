# Voters

When we need to deny access to something, we can do it in a couple of different
places, like `access_control` in `security.yaml`:

[[[ code('084d23e027') ]]]

Or various ways inside of a controller. And when we deny access, we know that
we can do it by checking for a role like `ROLE_ADMIN` or by checking one of
the special strings like `IS_AUTHENTICATED_REMEMBERED`. It seems pretty simple,
right? If we use something like `ROLE_ADMIN`, it clearly calls `getRoles()`
on the `User` and denies or allows access.

## Introducing: the Voter System

So all of this is... basically true. But in reality, whenever you call the authorization
system - either via  `access_control`, `->denyAccessUnlessGranted()`, or even the
`IsGranted()` annotation/attribute, something more interesting happens internally.
It activates what's called the *voter* system.

We can see this. Refresh the page and then click on the security icon in the web
debug toolbar to jump into the profiler. Down near the bottom of this page,
as we saw earlier, you'll find an "Access decision log" that shows all the
different times that the authorization system was called during this request.
Apparently it was called a *bunch* of times. Most of these represent us trying
to figure out whether we should show or hide the voting links for each answer.

But check out this little "Show voter details" link. When you click, ooooh.
There are two "voters". The first one voted `ACCESS_DENIED` and the second voted
`ACCESS_ABSTAIN`.

When you call the authorization system, it loops over these things called
voters and asks each one:

> Do you know how to decide whether or not the user has `IS_AUTHENTICATED_REMEMBERED`,
> or `ROLE_ADMIN`... or whatever string we pass in.

In practice, exactly *one* of these voters will say that they *do* understand how
to vote on that string, and they'll answer with either `ACCESS_DENIED` or
`ACCESS_GRANTED`. All the other voters will return `ACCESS_ABSTAIN`... which just
means that they don't want to vote one way or another.

So, for example, whenever you call the authorization system and pass it one of
those `IS_AUTHENTICATED_` strings, it's this `AuthenticatedVoter` that knows how
to decide whether the user has that or not.

The `RoleHierarchyVoter`, well you can probably guess. That's responsible for voting
on anything that starts with `ROLE_`. Internally, that voter checks to see if the
user has that role. Well technically it checks the "token"... but that's not too
important. It also takes our `role_hierarchy` config into account.

And, by the way, even though this is called the "voter" system, in *all* cases,
every voter *except* for one will abstain, which means they don't vote at all.
You'll never have a situation where you have 5 voters and 3 vote access granted
and 2 vote access denied. You *could* create voters that did that, but you won't.

## Passing Custom "Attributes" into Authorization

Until now, denying access on our site has been pretty simple. We've either wanted
to check to see if the user is logged in, or we've checked for a specific role.

But security isn't always that simple. For our edit question page, we can't just
check for a global role. We need to check to see if the current user is the *owner*
of this *question*. Yes: the security logic is specific to some *data*. In this
case, the `Question` object. Putting the logic in the controller worked, but it
means that we're going to have to duplicate this logic in our Twig template in
order to hide or show the "edit question" link.

The way to fix this is by creating our *own* custom voter that centralizes our logic.
To do this, delete all of this code and replace it with
`$this->denyAccessUnlessGranted()`.

Here is where things get interesting: we're going to "invent" a new string to
pass to this. These strings - which you may have thought of as "roles" until now -
are actually called attributes. Say `EDIT`. I totally just made that up. You'll
see how that's used in a minute.

Then, we haven't seen it yet, but you can also pass a *second* argument to
`denyAccessUnlessGranted()`, which is some data related to this security check.
Pass the `Question` object:

[[[ code('914c3b8d76') ]]]

Ok, stop right now and click to the edit page. Ooh, we get "access denied". Well,
it redirected us to the login page... but that means we didn't have access. Click
any link on the web debug toolbar to jump into the profiler, click "Last 10", then
find the request to the question edit page. Click to view *its* profiler info...
and go down to the Security section.

At the bottom, under the "Access Decision Log", access was Denied for attribute
"EDIT" and this `Question` object. If you look at the voter details... oh! They
*all* abstained. So *every* voter said:

> I have no idea how to vote on the attribute "EDIT" and a `Question` object.

If all voters abstain, we get access denied.

Next: let's fix this by adding our own custom voter that *does* know how to vote
on this situation. Once we're finished, we'll make or logic even *more* complex
by *also* allowing admin users to access the edit page.
