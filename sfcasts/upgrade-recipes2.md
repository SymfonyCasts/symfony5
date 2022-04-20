# Recipe Upgrades: Part 2!

Run:

```terminal
composer recipes:update
```

Next up is `doctrine-extensions-bundle`. This one... we we look... just modified
a comment. Easy!. So commit that... and move directly onto `debug-bundle`.

## symfony/debug-bundle Recipe

```terminal-silent
composer recipes:update
```


I'll clear the screen and run that. This actually made two changes. Run:

```terminal
git status
```

The first change was that it deleted an environment-specific file... and moved it
into the main file. The second change, which isn't very common in recipe updates,
is that in `config/bundles.php`, it previously loaded `DebugBundle` in the `dev`
environment *and* `test` environment. We now recommend *only* loading it in the `dev`
environment. You *can* load it in `test` environment, but it tends to slow things
down, so it's been removed by default.

Easy! Commit those changes... and keep going!

## symfony/monolog-bundle Recipe

```terminal-silent
composer recipes:update
```

Next up is `monolog-bundle`. This one *does* have a conflict, but it's fairly simple.
Previously, we had environment-specific files in `dev/`, `prod/`, and `test/` directories.
These have *all* been moved into the central `config/packages/monolog.yaml`. The
only reason it conflicted on *my* project is because I had previously created this
file in a tutorial to add a new `markdown` channel. I'll move my `markdown` channel
down here... and keep that.

Below this, you can see the `dev` configuration for logging, the `test` config,
and `prod` confnig. Again, if you had custom config in your old files, make sure
you bring that over to the *new* file so it doesn't get lost.

Add *these* changes... and... commit.

## symfony/routing Recipe

Run:

```terminal
composer recipes:update
```

We're getting closer! Next is `symfony/routing`. Let's see. This deleted another
environment-specific config file. Yay! Less files! It also highlights a new
`default_uri` config that you set if you ever need to generate absolute URLs
from inside a command.

Previously, you accomplished this two `router.request_context` parameters. It's
easier now, and this advertises that.

Commit this stuff... and let's keep going!

## symfony/security-bundle Recipe

```terminal-silent
composer recipes:update
```

Next is `security-bundle`. This one has a conflict... and it's inside of
`config/packages/security.yaml`. There are a few important things happening. The
recipe update added an `enable_authenticator_manager: true` setting. This enables
the new security system. We're going to talk about that later on. For now, set this
to `false` so that we're still using the *old* security system.

It also added something called `password_hashers`, which replaces `encoders`. We're
also going to talk about *that* later. For right now, I want you to keep all of this
config. We'll fix things later.

There's also a conflict down here on the firewall. The most important thing is that
the new recipe has `lazy: true`. That replaces `anonymous: lazy`, so we can go
ahead and keep that change... but use the rest of our firewall.

Oh, and at the bottom, we get one shiny new `when@test` section, which sets a custom
password hasher. You can read the comment here. This accelerates your tests by
making it *much* faster to hash passwords in the test environment, where we don't
care how secure our hashing algorithm is.

Let's add the files... then keep going.

## symfony/translation Recipe

Next up is `symfony/translation`. This isn't *super* important... it just shows off
some new config options. Those are all commented out, so... they're cool to see,
but not important.

Commit and... keep going!

## symfony/validator

Next is `symfony/validator`. Simple! This moved the config from
`config/test/validator.yaml` into the main `validator.yaml`. Nice!

Commit this.

Let's update *one more* recipe right now: `web-profiler-bundle`. Can you guess what
it did? It added *more* environment-specific config. So the config from
`dev/web_profiler.yaml` and `test/web_profiler.yaml` was moved into the main
`web_profiler.yaml`. The same thing happened for routes. The config from
`dev` was moved into a new `config/routes/web_profiler.yaml`. Let's commit that
and... phew! We've *almost* done it! Just *two* recipes left!

Let's update those next. The WebpackEncoreBundle will also give us a chance to
upgrade our JavaScript to the new Stimulus 3 version.
