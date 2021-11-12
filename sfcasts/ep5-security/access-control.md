# Denying Access, access_control & Roles

We've now talked a *lot* about authentication: the process of logging in. And...
we're *even* logged in right now. So let's get our first look at *authorization*.
That's the fun part where we get to run around and deny access to different parts of
our site.

## Hello access_control

The easiest way to kick someone out of your party is actually right inside of
`config/packages/security.yaml`. It's via `access_control`:

[[[ code('c21b478c72') ]]]

Un-comment the first entry:

[[[ code('1d9e53fd27') ]]]

The `path` is a regular expression. So this basically says:

> If a URL starts with `/admin` - so `/admin` or `/admin*` - then I shall deny
> access unless the user has `ROLE_ADMIN`.

We'll talk more about roles in a minute... but I can tell you that our user
does *not* have that role. So... let's try to go to a URL that matches this path.
We actually *do* have a small admin section on our site. Make sure you're logged
in... then go to `/admin`. Access denied! I've *never* been so happy to be rejected.
We get kicked out with a 403 error.

On production, you can customize what this 403 error page looks like... in addition
to customizing the 404 error page or 422.

## Roles! User::getRoles()

So let's talk about these "roles" thingies. Open up the `User` class:
`src/Entity/User.php`. Here's how this works. The moment we log in, Symfony calls
this `getRoles()` method, which is part of `UserInterface`:

[[[ code('79edc2e00f') ]]]

We return an array of *whatever* roles this user should have. The `make:user`
command generated this so that we *always* have a role called `ROLE_USER`...
plus any extra roles stored on the `$this->roles` property. That property holds
an *array* of strings... which are stored in the database as JSON:

[[[ code('26a1487de4') ]]]

This means that we can give each user as *many* roles as we want. So far, when we've
created our users, we haven't given them *any* roles yet... so our `roles` property
is empty. But thanks to how the `getRoles()` method is written, every user at
*least* has `ROLE_USER`. The `make:user` command generated the code like this
because *all* users need to have a least *one* role... otherwise they wander around
our site like half-dead zombie users. It's... not pretty.

So, by convention, we always give a user at *least* `ROLE_USER`. Oh, and the only
*rule* about *roles* - that's a mouthful - is that they must start with `ROLE_`.
Later in the tutorial, we'll learn why.

*Anyways*, the moment we log in, Symfony calls `getRoles()`, we return the array of
roles, and it stores them. We can actually see this if we click the security icon
on the web debug toolbar. Yup! Roles: `ROLE_USER`.

So then, when we go to `/admin`, this matches our first `access_control` entry, it
checks to see if we have `ROLE_ADMIN`, we don't, and it denies access.

## Only ONE access_control Matches

Oh, but there's one important detail to know about `access_control`: only *one*
will ever be matched on a request.

For example, suppose you had two access controls like this:

```yaml
security:
    # ...
    access_control:
      - { path: ^/admin, roles: ROLE_ADMIN }
      - { path: ^/admin/foo, roles: ROLE_USER }
```

If we went to `/admin`, that would match the *first* rule and *only* use the
first rule. It works like routing: it goes down the access control list one-by-one
and as soon as it finds the *first* match, it stops, and uses *only* that entry.

This will *help* us later when we deny access to *all* of a section *except* for
one URL. But for now, just be aware of it!

And... that's it. Access controls give us a *really* easy way to secure entire
sections of our site. But it's just *one* way to deny access. Soon we'll talk
about how we can deny access on a controller-by-controller basis, which I really
like.

But before we do, I know that if I try to access this page without `ROLE_ADMIN`,
I get the 403 forbidden error. But what if I try to access this page as an
*anonymous* user? Go to `/logout`? We're now *not* logged in.

Go back to `/admin` and... whoa! An error!

> Full authentication is required to access this resource.

Next, let's talk about the "entry point" of your firewall: the way that you help
anonymous users start the login process.
