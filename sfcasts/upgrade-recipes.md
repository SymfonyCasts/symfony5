# Recipe Upgrades with recipes:update

Let's keep upgrading recipes! There are a *bunch* of them to do, but most of these
are going to be easy. We'll move quickly, but I'll highlight any important changes
as we go.

## symfony/console Recipe Update

For the next update, let's skip down to `symfony/console` since that's another
important one.

```terminal-silent
composer recipes:update symfony/console
```

This updated just one file: `bin/console`. Check out the changes with:

```terminal
git diff --cached bin/console
```

Hmm. It changed from being *kind of* long to... pretty darn short@ this is, once
again, the Symfony Runtime component in action. The code to boot up Symfony for the
console has moved into `symfony/runtime`. And... this fixed our `bin/console`
command, which had been broken since we upgraded the Framework Bundle recipe.

Let's commit this change... and keep going:

```terminal-silent
composer recipes:update
```

## symfony/twig-bundle Recipe

Skip down to `symfony/twig bundle`. That's number `7`. I'll clear the screen and...
okay! We have some conflicts. *Exciting*! I'm going to clear the changelog
since I already looked at it. Ok, this deleted an environment-specific config
file... and then we have two conflicts. Let's go check out
`config/packages/twig.yaml`.

Once again, we're seeing the new environment-specific config. This `whentest` stuff
*used to* live in `config/packages/test/twig.yaml`, but it's now been moved to this
file. And because I have a custom `form_themes` config, it conflicted. We want
to keep both things.

The second conflict is in `templates/base.html.twig`. Our `base.html.twig` is pretty
customized, so we likely don't need to worry about any new changes. The recipe
added a new `favicon` by default. You probably *won't* want to use this since you'll
have your own, but the default is there if you need it. To fix this conflict,
since my project doesn't have a `favicon` yet, I'll copy the new stuff, use *our*
code, but paste the `favicon`.

Perfect! Now we can commit everything.

## doctrine/doctrine-bundle Recipe Update

Let's keep going!

```terminal
composer recipes:update
```

We'll work on this list from top to bottom. The next is `doctrine/bundle`. This is
a cool update. Once again, I'll clear the screen and say:

```terminal
git status
```

It conflicted inside `.env` file... which is probably the *least* interesting change.
Recently, DoctrineBundle's recipe started shipping with PostgreSQL as the as the
default database. You can *totally* change that to be whatever you want, but
PostgreSQL is *such* a good database engine that we started shipping with *it* as
the default suggestion.

But I'm using MySQL in this project, so I'm going to keep that. But to be *super*
cool, I'll at least take their new example config, which looks a *little* different,
and update my comments on top with it. And then I'll use *my* version of the
conflict. The end-result is a few tweaks to the comments, but nothing else.

The other changes from the recipe relate to the config files, and I bet you can see
what's happening here. It deleted two environment-specific config files and updated
the main one. Hmm.

Open `config/packages/doctrine.yaml`. Sure enough, at the bottom, we see `when@test`
and `when@prod`. That's nice! Everything is now in one file. Just make sure that
if you had any custom config in the *old* deleted, files, that you move it over
to *this* file.

One other change that's new is this `dbname_suffix` under `when@test`. This is
cool. When you're running tests, this will automatically reuse the same database
connection configuration, but with a different database name: your normal name
followed by `_test`. And this fancy part on the end makes it really easy to run
parallel tests with Paratest. This will ensure that each parallel process will
use a different datbase name. You get that all, for free, thanks to this updated
recipe.

There's one *other* change in this file, and it's important. In PHPStorm, I can
see that the recipe update deleted the `type: annotation` line. Right now, we *are*
still using annotations in our project for entity configuration. We're going to
*change* that in a few minutes to use PHP 8 attributes, which is going to be
*amazing*. But anyways, in the DoctrineBundle configuration, you *no* longer need
this `type: annotation` line. It will be detected automatically. If Doctrine sees
annotations, it will *load* the annotations. If it sees PHP 8 attributes, it wil
load *those*. So the best config to have here is *nothing*... so that it figures
out things *for* us.

Once again, add all these changes, commit, and... let's keep going! Well, let's
keep going in the *next* chapter, where we upgrade DoctrineExtensionsBundle,
some debug recipes, routing, security and more!
