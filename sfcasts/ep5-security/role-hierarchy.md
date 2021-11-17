# Role Hierarchy

Right now, our site has two types of users: normal users and admin users. If you're
a normal user, you can vote on answers and probably do a bunch of other things once
we're done. If you're an admin, you can go to the admin section of our site.

There's not much here yet... but in theory, an admin user might have access to edit
questions, answers or manage user data. And... a lot of sites are just this simple:
you're either a normal user or an admin user.

## Organizing Role Names

But in a larger company, things might *not* be so simple: you might need *many*
different types of admin users. Some will have access to *some* sections and
other access to other sections. What's the best way to organize our roles to
accomplish this in the *cleanest* way?

Well, there are really only two possibilities. The first is to assign roles to users
that are named after the *type* of user. For example, you assign roles to users
like `ROLE_HUMAN_RESOURCES` or `ROLE_IT` or `ROLE_PERSON_WHO_OWNS_THE_COMPANY`.
But... I don't love this. You end up in weird situations where, in a controller,
you realize that you need to allow access to `ROLE_HUMAN_RESOURCES` *or* `ROLE_IT`,
which is just messy.

Ok, then, so what's the second option? To protect our controllers with role names
that describe what *access* that role gives you. For example, at the bottom of this
controller, let's create a pretend admin page for moderating answers. Set the URL
to `/admin/answers`... and call it `adminAnswers()`.

Imagine that our "human resources" department *and* IT department should both
have access to this. Well, as I mentioned earlier, I do *not* want to try to put
logic here that allows `ROLE_HUMAN_RESOURCES` *or* `ROLE_IT`.

Instead, say `$this->denyAccessUnlessGranted()` and pass this `ROLE_COMMENT_ADMIN`,
a role name that I *just* invented that describes what is being protected. Oh, dummy
Ryan! I should've called this `ROLE_ANSWER_ADMIN` - I keep using "comment" when I
mean "answer". This will work fine - but `ROLE_ANSWER_ADMIN` is *really* the best
name.

Anyways, what I *love* about this is how clear the controller is: you can't access
this unless you have a role that's *specific* to this controller. There's just one
problem: if we go to `/admin/answers`, we get access denied... Because we do *not*
have this role.

You can probably see the problem with this approach. Each time we create a new section
and protect that it with a new role name, we're going to need to add this role
to *every* user in the database that should have access to the section. That sounds
like a pain in the butt!

## Hello role_hierarchy

Fortunately, Symfony has a feature *just* for this called role hierarchy. Open up
the `config/packages/security.yaml` and, anywhere inside of here... but I'll put
it near the top, add `role_hierarchy`. Below this, say `ROLE_ADMIN` and set this
to an array.For now, just include `ROLE_COMMENT_ADMIN`.

This looks just as simple as it is. It says:

> If you have `ROLE_ADMIN`, then you automatically *also* have `ROLE_COMMENT_ADMIN`.

The result? If we refresh the page, access granted!

The idea is that, for each "type" of person in your company - like human resources,
or IT - you would create a new item in `role_hierarchy` for them, like
`ROLE_HUMAN_RESOURCES` set to an array of whatever roles it should have.

For example, let's pretend that we are *also* protecting another admin controller
with `ROLE_USER_ADMIN`. In this case, if you have `ROLE_HUMAN_RESOURCES`, then you
automatically get `ROLE_USER_ADMIN`... which gives you access to modify user data.
And if you have `ROLE_ADMIN`, maybe you can *also* access this section.

With this setup, each time we add a new section to our site and protect it with
a new role, we only need to go to `role_hierarchy` and add it to whatever groups
need it. We don't need to change the roles in the database for *anyone*. In the
database, most or all users will only need *one* role representing the "type"
of user they are - like `ROLE_HUMAN_RESOURCES`.

Speaking of admin users, when we're debugging a customer issue on your site,
sometimes it would be *really* useful if we could temporarily log *into* that user's
account... just to see what *they're* seeing. In Symfony, that's totally possible.
Let's talk about impersonation next.
