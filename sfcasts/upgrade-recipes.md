# Recipe Upgrades with recipes:update

Let's keep upgrading recipes! There are a *bunch* of them to do, but most of these are going to be super easy. We're going to go through this quickly, but I'll highlight the important parts as we go. For the next one, let's skip down to `symfony/console` since that's another important one. This updated just one file: `bin/console`. If I say

```terminal
git diff --cached bin/console
```

you can see it changed from being *kind of* long to pretty darn short. This is, once again, the Symfony Runtime component in action. The code to boot up Symfony for the console has moved into `symfony/runtime`. The nice thing about this is that making this change fixed our

```terminal
bin/console
```

command, which had been broken since we upgraded the Framework Bundle recipe. Let's update this and then keep going.

Skip down to `symfony/twig bundle`. That's number `7`. I'll clear the screen and... okay! We have some conflicts this time. *Exciting*. I'm going to clear the change log since I've already looked at it. Interesting... It deleted another environment-specific configuration file, and then we have two conflicts down here. Let's go check out `config/packages/twig.yaml`.

Once again, we're seeing the new environment-specific config. This config *used to* live in `config/packages/test/twig.yaml`, but it's now been moved into this file. And because I have a custom `forms_themes` config, this conflicted, but we want to keep *both* of those, so that's easy.

The second conflict was in `templates/base.html.twig`. Our `base.html.twig` is pretty customized, so we likely don't need to worry about any new changes. Basically, what I did was add a new `favicon` by default in Symfony. You probably *won't* want to use this since you'll likely have your own, but the default is there if you need it. To fix this conflict, since my project doesn't currently have a `favicon`, I'll copy this new stuff here, use *our* code, but then paste the `favicon` up here. And I'll also delete that comment. Perfect! Now we can commit everything.

Let's go again! Now we'll work on this list in order from top to bottom. The next item we need to take a look at is `doctrine/bundle`. I'll clear the screen... and start that up. This is a pretty cool update. Once again, I'll clear the screen and we'll say:

```terminal
git status
```

All right, it actually conflicted in the `.env` file. This is probably the *least* interesting part. Sometime over the past few months, DoctrineBundle started shipping with Postgres as the default database URL. You can *totally* change that to be whatever you want, but Postgres is *such* a good database engine that we started shipping with *this* as the default suggestion. But of course I'm using mySQL in this project, so I'm going to keep mySQL. But just to be super cool, I'll at least take their new example config, which looks a *little* different than what I have now, and update my examples on top with it. And then I will use *my* version. The end result is a couple of tweaks to these comments and *that's* it.

The other changes in here have to do with config files, and I bet you can see what's happening here. It deleted two environment-specific config files and updated the main one. Hmm... Let's open `config/packages/doctrine.yaml` and... sure enough, at the bottom, you can see the custom `when@test` and `when@prod` config, which is great. So everything's now in one file. Just make sure that, if you had any custom configuration inside of these files, that you move it over to *this* file right here and you don't lose it.

One other thing that's new is this `dbname_suffix` in `when@test`. This is pretty cool. When you're running tests, this will automatically reuse the same database connection configuration, but then just a different database name. Maybe whatever you're *normal* database name followed by `_test`. That allows you to have two: One database for your main coding and another one for your test. And this little end thing here makes it really easy to run parallel tests by helping you give a unique database name per parallel test run, which is *awesome*.

There's one *other* change in this file. If you look up, you can see it in PHPStorm. It deleted this type annotation line. Right now, we *are* still using annotations in our projet for entity configuration. We're going to change that in a few minutes to use PHP 8 attributes, which is going to be *amazing*. But anyways, in the `doctrine/bundle` configuration, you no longer need this type annotation line. It will be detected automatically. Doctrine's going to look at your entities and if it sees annotations, it will *load* the annotations. If it sees PHP 8 attributes, it's going to automatically load PHP attributes. So the best config to have here is *nothing* so that it figures out things *for* us. Once again, we'll add everything, commit, and then keep going to `doctrine-extensions-bundle`.

The next few are going to be *really* simple. This one, if you look, just modified a comment. That's it. So I'll go ahead and commit that... and move directly onto `debug-bundle`. I'll clear the screen and run that.

This actually made two different changes. If we run

```terminal
git status
```

the first thing it did was delete an environment-specific file and then move it into the main file. The second thing it did, which is not very common in recipe updates, is that in `config/bundles.php`, it previously loaded `DebugBundle` in the dev environment *and* test environment. We now recommend *only* loading it in the dev environment. You *can* have it in test environment, but it tends to slow things down, so it's been removed. Let's commit that... and go on to the next one, which is `monolog-bundle`.

This one *does* have a conflict, but it's a fairly simple change. Before, we had environment-specific files in `/dev`, `/prod`, and `/test`. These have all been moved into a central `config/packages/monolog.yaml`. The only reason it conflicted on my project is because I had previously created this file in an old tutorial to add a new markdown channel, which made it angry. I'll add my markdown channel down here... and keep that. And then you can see the `dev` configuration for logging, the `test` configuration for logging, and the `prod` configuration for logging. Again, if you had custom configuration in your individual files, make sure you bring that over to the new file so it doesn't get lost. Let's add *that*... and commit.

At this point, you guys know the drill. We're *almost* there, so let's *keep updating*. Next is `symfony/routing`. This one's *incredibly* simple. Another environment-specific configuration file was deleted. This is good! I like having less files, and it also highlights a new `default_uri` config that you can use if you are ever, for example, generating absolute URLs from a CLI command. This is something that you *need* to set so that those URLs generate correctly. We used to set this with some parameters called `config`, `route`, and `context`. There's now a *simpler* way and it's advertising it right here. Let's commit *that*, and next is `security-bundle`.

This one has a conflict, and it's inside of `config/packages/security.yaml`. There are a couple of important things here. The new recipe added an `enable_authenticator_manager: true`. This enables the new security system. We're going to talk about that later on. For now, set this to `false` so that we're still using the *old* security system.

It also added something called `password_hashers`, which replaced `encoders`. We'll also going to talk about *that* later. For right now, I want you to keep all of this config, and then once we get to the actual security upgrade part of our tutorial, we'll address those.

There's also a conflict down here on our firewall. The most important thing is that the new recipe has a `lazy: true`. That replaces `anonymous: lazy`, so we can go ahead and make that change, but it works the same way. We'll use the rest of our custom config as well. Then, at the bottom, we get one shiny new test configuration, which sets a custom password hasher. You can read the comment here, but basically, this will accelerate your tests by making it *much* faster to hash passwords in the test environment, where we don't care about security quite as much. Let's add the files... then keep going.

Next up is `symfony/translation`. This isn't *super* important. It's just showing off some new configuration options that you could have. Those are all commented out, so... cool to see, but not that important.

Next is `symfony/validator`. This is adding more environment-specific config. The `test/validated.yaml` config was moved into the main `validator.yaml`. That's nice!

Let's do *one more* right now: `web-profiler-bundle`. Can you guess what it did? It added *more* environment-specific config. So the config from `dev/web_profiler.yaml` and `test/web_profiler.yaml` was moved into the main `web_profiler.yaml`. The same thing happened for `/routes`. The configuration from `dev` was moved into a new `config/routes/web_profiler.yaml`. Let's commit that and... phew! We've *almost* done it! Just *two* recipes left!

Let's update these next. The WebpackEncoreBundle will also give us a chance to upgrade our JavaScript to the new Stimulus 3 version.
