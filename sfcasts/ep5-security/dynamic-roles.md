# Dynamic Roles

Earlier, we talked about how the moment a user logs in, Symfony calls the `getRoles()`
method on the `User` object to figure out which *roles* that user will have:

[[[ code('9e0c2bdb98') ]]]

This method reads a `$roles` array property that's stored in the database as JSON...
then always adds `ROLE_USER` to it.

Until now, we haven't given any users any extra roles in the database... so
*all* users have *just* `ROLE_USER`. You can see this in the web debug toolbar:
click to jump into the profiler. Yup, we have `ROLE_USER`.

This is too boring... so let's add some true admin users! First, open
`config/packages/security.yaml`... and, down under `access_control`, change this
to once again require `ROLE_ADMIN`:

[[[ code('01c978807b') ]]]

Remember: roles are just strings that we invent... they can be anything: `ROLE_USER`
`ROLE_ADMIN`, `ROLE_PUPPY`, `ROLE_ROLLERCOASTER`... whatever. The only rule
is that they must start with `ROLE_`. Thanks to this, if we go to `/admin`... access
denied!

## Populating Roles in the Database

Let's add some admin users to the database. Open up the fixtures class:
`src/DataFixtures/AppFixtures.php`. Let's see... down here, we're creating one
custom user and then 10 random users. Make this first user an admin: set
`roles` to an array with `ROLE_ADMIN`:

[[[ code('14b41cb9af') ]]]

Let's also create one normal user that we can use to log in. Copy the `UserFactory`
code, paste, use `abraca_user@example.com`... and leave `roles` empty:

[[[ code('63ff90001a') ]]]

Let's do it! At your terminal, run:

```terminal
symfony console doctrine:fixtures:load
```

When that finishes... spin over and refresh. We got logged out! That's because, when
the user was loaded from the session, our user provider tried to refresh the user
from the database... but the old user with its old id was gone thanks to the fixtures.
Log back in.... with password `tada` and... access granted! We rock! And in the
profiler, we have the two roles.

## Checking for Access inside Twig

In addition to checking or enforcing roles via `access_control`... or from inside
a controller, we often *also* need to check roles in Twig. For example, if the current
user has `ROLE_ADMIN`, let's a link to the admin page.

Open `templates/base.html.twig`. Right after this answers link...
so let me search for "answers"... there we go, add if, then use
a special `is_granted()` function to check to see if the user has `ROLE_ADMIN`:

[[[ code('74c25e62d6') ]]]

It's that easy! If that's true, copy the nav link up here... paste.. send the user
to `admin_dashboard` and say "Admin":

[[[ code('825e167e28') ]]]

When we refresh... got it!

Let's do the same with the "log in" and "sign up" links: we only need those if we
are *not* logged in. Down here, to simply check if the user is logged in, use
`is_granted('ROLE_USER')`... because, in our app, every user has at least
that role. Add `else`, `endif`, then I'll indent. If we *are* logged in, we
can paste to add a "Log out" link that points to the `app_logout` route:

[[[ code('55cab805d1') ]]]

Cool! Refresh and... so much better. This is looking like a real site!

Next, let's learn about a few special "strings" that you can use with authorization:
strings that do *not* start with `ROLE_`. We'll use one of these to show how we could
easily deny access to every page in a section *except* for one.
