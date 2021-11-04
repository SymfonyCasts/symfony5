# Dynamic Roles

Coming soon...

Earlier, we talked about how the moment a user logs in Symfony calls the `getRoles()`
method on that `User` object to figure out which roles that user will have. This method
reads eight `$roles` property that's stored in the database,

And then it takes whatever roles are in the database and always as a `ROLE_USER` to it.
And so now, until now we haven't added any, given any users, any extra roles in the
database. So they all have role user. You can see that in the web, you have a
toolbar. If you click on the profiler, we have `ROLE_USER`. Now let's add some true
admin users to start, go to `config/packages/security.yaml` and down an
access control. What's changed this once again to require a `ROLE_ADMIN`. Remember the
roles are just strings. We invent. They can be anything `ROLE_USER` `ROLE_ADMIN` 
`ROLE_PUPPY` `ROLE_ROLLERCOASTER`. The only rule is they have to start with `ROLE_`
So we've got to `/admin` right now because we don't have `ROLE_ADMIN`. We get access
tonight. All right, let's add some admin users to the database. So open up our
fixtures glass, or just data fixtures at fixtures. And let's see down here, we're
creating one custom user and then 10 random users let's make this first user and
admin I'll do that by setting `roles` to an array with `ROLE_ADMIN`.

I'm also going to create one kind of normal user that I can log in as, so I'll create
Africa user and we will set no roles on them. So it's roles. Property will be empty.
All right, cool. Let's reload. The fixtures 

```terminal
symfony console doctrine:fixttures:load
```

And when that finishes

Spin over and refresh, we're actually going to be logged out that's because when the
user was loaded from the session, our user provider tried to refresh that user from
the database, but the, with the old ID was gone since our fixtures just deleted the
database and add a new re records. So let's log back in password and access. Granted
we rock and a profiler. We have the two roles. So in the distant to checking or
enforcing roles in access control like this, or in our controller, we often also need
to check roles in twig. For example, if the current user has a `ROLE_ADMIN`, we can add
a nice admin link.

You can add an admin link to our header. Let's do that opening based layout. So
`templates/base.html.twig`, right after this answers link. So let me
search for answers. There we go. Let's add a new link to the admin page, but only if
the user can actually see it to do that. We can say if, and then use a special
`is_granted()` function and pass this the role `ROLE_ADMIN`. And if it's that easy, a copy
of the NAB link up here, face that. And then we will go to `admin_dashboard` and say
admin. So since we have this rule right now, when I refresh it shows up, it's that
simple while we're here, instead of all showing log in and sign up, even if we're
logged in, let's be smarter. So down here, let's add an if statement say if, and in
order to check simply if the user's logged in, we can check for `is_granted('ROLE_USER')`
because in our app store and user class, every single log in user has that role. And
I'll add an Ellis. And if, and then let's copy the log in link because we, when we're
logged in, can change that to a nice and log out like the blog out, going to the 
`app_logout` route.

All right, refresh so much better. It's looking like a real site now. All right,
next, we're going to learn about a few special that you can use in the authorization
system. So strings that do not start with rural underscore, we'll use one of these to
show how we could deny access to every page and exception, except for one or more a
useful strategy. It, if almost every page of your site requires authentication.

