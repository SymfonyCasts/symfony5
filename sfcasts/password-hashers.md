# Password encoders -> password_hashers & debug:firewall

By converting to the new security system, our deprecations just went *way* down.
If you look at what's left, one of them says:

> The child node "encoders" at path "security" is deprecated, use "password_hashers"
> instead.

This is *another* change that we saw when upgrading the `security-bundle` recipe.
Originally, we had `encoders`. This tells Symfony which algorithm to use to hash
passwords. This has been renamed to `password_hashers`. And instead of needing our
custom class, we can always just use this config. This says:

> Any class that that implements `PasswordAuthenticatedUserInterface` should
> use the `auto` algorithm.

And since... *every* user class with a password needs to implement this - including
our class - that covers us.

Oh, but if you had a *different* algorithm before, move that down to this line.
We don't want to *change* the algorithm: we just want to delete `encoders` in
favor of `password_hashers`.

Now, on the homepage... we have even less deprecations! Two left! Let's try to log
in. Ah! I think I missed some conflicts in my base layout earlier.

Let's swing over and fix these. In `templates/base.html.twig`... yep. When we
upgraded the `twig-bundle` recipe, this conflicted and I didn't even notice!
Shame on me!

Now... much better. Let's log in: we have a user called `abraca_admin@example.com`
with password `tada`. Sign in and... it's alive!

## The debug:firewall Command

Speaking of "security" and "firewalls" and other nerdery, Symfony ships with a new
command to help debug and *visualize* your firewall. It's called, appropriately,
`debug:firewall`. If you run it with no arguments:

```terminal-silent
php bin/console debug:firewall
```

It'll tell you your firewall names: `dev` and `main`. Re-run this with `main`:

```terminal-silent
php bin/console debug:firewall main
```

Here we go! This tells us what authenticators this firewall has, which user provider
it's using - though our app usually only has one - and also the entry point, which
is something we talk about in our Security tutorial.

Ok, put a big ol' check mark next to "Upgrade Security". Next, let's *crush* the
last few deprecations and learn how we can be sure that we didn't miss any.
