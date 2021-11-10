# Dynamic Roles

Earlier, we talked about how the moment a user logs in, Symfony calls the `getRoles()`
method on that `User` object to figure out which *roles* that user will have. This
method reads a `$roles` array property that's stored in the database as JSON... then
always adds `ROLE_USER` to it.

Until now, we haven't added given any users any extra roles in the database... so
*all* users have *just* `ROLE_USER`. You can see that in the web debug toolbar: click
to jump into the profiler. Yup, ee have `ROLE_USER`.

This is too boring... so let's add some true admin users! First, open
`config/packages/security.yaml`... and down under `access_control`, change this
to once again require `ROLE_ADMIN`.

Remember roles: are just strings that we invent... they can be anything: `ROLE_USER`
`ROLE_ADMIN`, `ROLE_PUPPY`, `ROLE_ROLLERCOASTER`... whatever you want. The only rule
is that they must start with `ROLE_`. Thanks to this, if we go to `/admin`... access
denied because we *don't* have `ROLE_ADMIN`.

## Populating Roles in the Database

Let's add some admin users to the database. Open up the fixtures class:
`src/DataFixtures/AppFixtures`. Let's see... down here, we're creating one custom
user and then 10 random users. Let's make this first user an admin: set
`roles` to an array with `ROLE_ADMIN`.

Let's also create one normal user that we can use to log in. Copy the `UserFactory`
code, paste, use `abraca_user@example.com`.. and leave `roles` empty.

Ok, let's do it! At your terminal, run:

```terminal
symfony console doctrine:fixttures:load
```

When that finishes... spin over and refresh. We got logged out! That's because, when
the user was loaded from the session, our user provider tried to refresh the user
from the database... but the old user with its old id was gone since our fixtures
just cleared the database. Let's log back in.... with password `tada` and...
access granted! We rock! And in the profiler, we have the two roles.

## Checking for Access inside Twig

In addition to checking or enforcing roles via `access_control`... or from inside
a controller, we often *also* need to check roles in Twig. For example, if the current
user has `ROLE_ADMIN`, we can add a nice admin link.

Let's do that! Open `templates/base.html.twig`. Right after this answers link...
so let me search for "answers"... there we go, let's add a new link to the admin page,
but only if the user has permission to actually *go* to that page. Add if, then use
a special `is_granted()` function passing the role to check: `ROLE_ADMIN`.

It's that easy! If that's true, copy the nav link up here... paste.. send the user
to `admin_dashboard` and say "Admin".

And... when we refresh... we got it!

Let's do the same with the "log in" and "sign up": those only need to show if we
are *not* logged in. Down here, to simply check if the user is logged in, we can
look for `is_granted('ROLE_USER')`... because, in our app, every user has at least
that role. Add `else`, `endif`, then I'll indent these. If we *are* logged in, we
can paste to add a "Log out" link that points to the `app_logout` route.

Cool! Refresh and... so much better. It's looking like a real site!

Next, let's learn about a few special "strings" that you can use with the authorization:
strings that do *not* start with `ROLE_`. We'll use one of these to show how we could
easily deny access to every page in a section *except* for one or two.
