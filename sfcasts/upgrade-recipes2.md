# Recipe Upgrades: Part 2!

Run:

```terminal
composer recipes:update
```

Next up is `doctrine-extensions-bundle`. This one... when we look... just modified
a comment! Easy!. So commit that... and then move onto `debug-bundle`.

## symfony/debug-bundle Recipe

```terminal-silent
composer recipes:update
```

I'll clear the screen and run that. This made two changes. Run:

```terminal
git status
```

The first change was that it deleted an environment-specific file... and moved it
into the main file. The second change, which isn't very common in recipe updates,
is that in `config/bundles.php`, it previously loaded `DebugBundle` in the `dev`
environment *and* `test` environment. We now recommend *only* loading it in the `dev`
environment. You *can* load it in `test` environment, but it tends to slow things
down, so it's been removed by default.

[[[ code('e0e76dc964') ]]]

Easy! Commit those changes... and keep going!

## symfony/monolog-bundle Recipe

```terminal-silent
composer recipes:update
```

Next up is `symfony/monolog-bundle`. This one *does* have a conflict, but it's
fairly simple. Previously, we had environment-specific files in the `dev/`, `prod/`,
and `test/` directories. These have *all* been moved into the central
`config/packages/monolog.yaml` file. The only reason it conflicted on *my* project
is because I had previously created this file in a tutorial to add a new `markdown`
channel. I'll move my `markdown` channel down here... and keep the new stuff.

[[[ code('5de4ed9382') ]]]

Below this, you can see the `dev` configuration for logging, the `test` config,
and `prod` config. Again, if you had custom config in your old files, make sure
you bring that over to the *new* file so it doesn't get lost.

[[[ code('04e101b0ac') ]]]

Add *these* changes... and... commit.

## symfony/routing Recipe

Then right back to:

```terminal
composer recipes:update
```

We're getting closer! Update `symfony/routing`. Let's see. This deleted another
environment-specific config file. Yay! Less files! It also highlights a new
`default_uri` config that you set if you ever need to generate absolute URLs
from inside a command.

Previously, you accomplished this by setting `router.request_context` parameters.
It's easier now, and this advertises that.

[[[ code('1cbacc68f3') ]]]

Commit this stuff... and let's keep going!

## symfony/security-bundle Recipe

```terminal-silent
composer recipes:update
```

We've made it to `symfony/security-bundle`. This one has a conflict... and it's
inside  `config/packages/security.yaml`. There are a few important things happening.
The recipe update added `enable_authenticator_manager: true`. This enables
the new security system. We're going to talk about that later. For now, set this
to `false` so that we're still using the *old* security system.

[[[ code('ff4f02678c') ]]]

It also added something called `password_hashers`, which replaces `encoders`. We're
also going to talk about *that* later. For right now, I want you to keep both
things.

[[[ code('6600441dec') ]]]

There's also a conflict down on the firewall. The important change is that
the new recipe has `lazy: true`. That replaces `anonymous: lazy`, so we can go
ahead and keep that change... but use the rest of *our* firewall.

[[[ code('16d29f55ba') ]]]

Oh, and at the bottom, we get one shiny new `when@test` section, which sets a custom
password hasher. You can read the comment. This accelerates your tests by
making it *much* faster to hash passwords in the test environment, where we don't
care how secure our hashing algorithm is.

[[[ code('370ab38f70') ]]]

Let's add the files... then keep going.

## symfony/translation Recipe

Next up is `symfony/translation`. This isn't important... it just shows off
some new config options. Those are all commented out, so... they're cool to see,
but not important.

[[[ code('8ad40575d1') ]]]

Commit and... keep going!

## symfony/validator Recipe

Next is `symfony/validator`. Simple! This moved the config from
`config/test/validator.yaml` into the main `validator.yaml`.

Commit *that*!

## symfony/web-profiler-bundle Recipe

Let's update *one more* recipe right now: `web-profiler-bundle`. Can you guess what
it did? It added *more* environment-specific config. So the config from
`dev/web_profiler.yaml` and `test/web_profiler.yaml` was moved into the main
`web_profiler.yaml`. The same thing happened for routes. The config from
`dev` was moved into a new `config/routes/web_profiler.yaml`. Let's commit that
and... phew! We've *almost* done it! Just *two* recipes left!

Let's update those next. The WebpackEncoreBundle recipe will also give us a chance
to upgrade our JavaScript to the new Stimulus 3 version.
