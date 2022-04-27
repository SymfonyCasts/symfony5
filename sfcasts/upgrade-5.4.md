# Upgrading to Symfony 5.4

Step one to upgrading our app to Symfony 6 is to upgrade all of the Symfony libraries
to 5.4. And... that's pretty easy: it's just a composer thing.

## Tweaking the Composer Version Constraints

In `composer.json`, we have *quite a few* libraries that start with `symfony/`.
*Most* of these are part of the "main" Symfony project and they follow Symfony's
familiar versioning, with versions like 5.0, 5.1, up to 5.4 and then 6.0. *Those*
are the packages that we're going to focus on upgrading.

But a few of these, like `symfony/maker-bundle`, follow their *own* versioning
scheme. What a diva! We're not going to worry about upgrading those right now, but
we *will* make sure that, by the end, we've upgraded everything.

Okay, what we need to do is change all of these `5.0.*` to `5.4.*`. I'm going to
do a "Find & Replace" to replace `5.0.*` with `5.4.*`. Hit "Replace All".

[[[ code('ead5944d18') ]]]

Nice! And notice that, in addition to the packages themselves, we also needed to
change the `extra.symfony.require` key. This is a performance optimization from Flex:
it basically makes sure that Flex only considers Symfony packages that match this
version. Just make sure that you don't forget to update it.

Ok... let's see. This updated *a lot* of libraries. To make sure we didn't miss
anything, search for `symfony/`... and scroll down a bit. The `monolog-bundle` has
its own versioning, so that's ok. But, ooh... I *did* miss one: `symfony/routing`.
For *some* reason, this was already at Symfony 5.1. So let's change that to `5.4.*`
as well.

And... everything else looks okay: each is changed to `5.4.*` or it has its own
versioning strategy... and we're not going to worry about it right now.

## Updating the Dependencies

To *actually* update these, over at your terminal, we *could* try to upgrade *just*
the Symfony packages with:

```terminal
composer up 'symfony/*'
```

There's a good chance that's going to fail... because in order to upgrade all of
the Symfony packages, some *other* package will need to be upgraded, like
`symfony/proxy-manager-bridge`. If you wanted to, you could add *that* to the
`composer up` command... or add the `-W` flag, which tells Composer to upgrade
all of the `symfony/` libraries *and* their dependencies.

But... I'm going to upgrade *everything* with:

```terminal
composer up
```

Look: in our `composer.json` file, the version constraints on all of the packages
(Symfony *and* other libraries) are really good! They allow *minor* version updates,
like 4.0 to 4.1, but they don't allow *major* version updates. So if there were a
new version *5* of this library, running `composer up` would *not* upgrade to that
new major version.

In other words, updating should only upgrade *minor* versions... and those, in theory,
won't contain any breaks. So let's do this:

```terminal
composer up
```

And... hello upgrades! Wow! Look at that huge list! Lots of Symfony stuff...
but plenty of other libraries too.

Ok, so that was a *big* upgrade. Does the site still work? I don't know! Head over,
refresh and... it does! Symfony is amazing!

## Checking out the Deprecations

Now that we're on Symfony 5.4, we can see the full list of deprecated code paths
that we hit when rendering this page. *Your* number will vary... and the number
might even change when you refresh the page... that's due to some pages using
cache. It looks like I have about 71 deprecations.

If you click into this, *so* cool. We can see what all of those are.

So at this point, our job is simple... but not necessarily *easy*. We need to hunt
down every single one of these deprecations, figure out what code needs to change,
and then make that change. Some of these will be pretty obvious... and some of them
*won't*.

So before we even *attempt* to hunt them down manually, let's... do something
more automatic. We're programmers right! Let's use a tool called Rector to automate
as many changes to our code as possible. That's next.
