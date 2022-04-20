# Recipe Upgrades: Part 2!

Coming soon...

to `doctrine-extensions-bundle`.

The next few are going to be *really* simple. This one, if you look, just modified a
comment. That's it. So I'll go ahead and commit that... and move directly onto
`debug-bundle`. I'll clear the screen and run that.

This actually made two different changes. If we run

```terminal
git status
```

the first thing it did was delete an environment-specific file and then move it into
the main file. The second thing it did, which is not very common in recipe updates,
is that in `config/bundles.php`, it previously loaded `DebugBundle` in the dev
environment *and* test environment. We now recommend *only* loading it in the dev
environment. You *can* have it in test environment, but it tends to slow things down,
so it's been removed. Let's commit that... and go on to the next one, which is
`monolog-bundle`.

This one *does* have a conflict, but it's a fairly simple change. Before, we had
environment-specific files in `/dev`, `/prod`, and `/test`. These have all been moved
into a central `config/packages/monolog.yaml`. The only reason it conflicted on my
project is because I had previously created this file in an old tutorial to add a new
markdown channel, which made it angry. I'll add my markdown channel down here... and
keep that. And then you can see the `dev` configuration for logging, the `test`
configuration for logging, and the `prod` configuration for logging. Again, if you
had custom configuration in your individual files, make sure you bring that over to
the new file so it doesn't get lost. Let's add *that*... and commit.

At this point, you guys know the drill. We're *almost* there, so let's *keep
updating*. Next is `symfony/routing`. This one's *incredibly* simple. Another
environment-specific configuration file was deleted. This is good! I like having less
files, and it also highlights a new `default_uri` config that you can use if you are
ever, for example, generating absolute URLs from a CLI command. This is something
that you *need* to set so that those URLs generate correctly. We used to set this
with some parameters called `config`, `route`, and `context`. There's now a *simpler*
way and it's advertising it right here. Let's commit *that*, and next is
`security-bundle`.

This one has a conflict, and it's inside of `config/packages/security.yaml`. There
are a couple of important things here. The new recipe added an
`enable_authenticator_manager: true`. This enables the new security system. We're
going to talk about that later on. For now, set this to `false` so that we're still
using the *old* security system.

It also added something called `password_hashers`, which replaced `encoders`. We'll
also going to talk about *that* later. For right now, I want you to keep all of this
config, and then once we get to the actual security upgrade part of our tutorial,
we'll address those.

There's also a conflict down here on our firewall. The most important thing is that
the new recipe has a `lazy: true`. That replaces `anonymous: lazy`, so we can go
ahead and make that change, but it works the same way. We'll use the rest of our
custom config as well. Then, at the bottom, we get one shiny new test configuration,
which sets a custom password hasher. You can read the comment here, but basically,
this will accelerate your tests by making it *much* faster to hash passwords in the
test environment, where we don't care about security quite as much. Let's add the
files... then keep going.

Next up is `symfony/translation`. This isn't *super* important. It's just showing off
some new configuration options that you could have. Those are all commented out,
so... cool to see, but not that important.

Next is `symfony/validator`. This is adding more environment-specific config. The
`test/validated.yaml` config was moved into the main `validator.yaml`. That's nice!

Let's do *one more* right now: `web-profiler-bundle`. Can you guess what it did? It
added *more* environment-specific config. So the config from `dev/web_profiler.yaml`
and `test/web_profiler.yaml` was moved into the main `web_profiler.yaml`. The same
thing happened for `/routes`. The configuration from `dev` was moved into a new
`config/routes/web_profiler.yaml`. Let's commit that and... phew! We've *almost* done
it! Just *two* recipes left!

Let's update these next. The WebpackEncoreBundle will also give us a chance to
upgrade our JavaScript to the new Stimulus 3 version.
