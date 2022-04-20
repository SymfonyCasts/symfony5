# Updating the All-Important FrameworkBundle Recipe

At your terminal, run:

```terminal
composer recipes
```

As you probably know, whenever we install a new package, that package *may*
come with a recipe that does things like add configuration files, modify certain
files like `.env`, or add other files. Over time, Symfony makes *updates* to
these recipes. Sometimes these are minor... like the addition of a comment in a
config file. But other times, they're bigger, like renaming config keys to match
changes in Symfony itself. And while you don't *have* to update your recipes,
it's a great way to keep your app feeling like a standard Symfony app. It's also
a free way to update deprecated code!

# Hello recipes:update

Until recently, updating recipes was a *pain*. If you're not familiar, just check
our "Upgrade to Symfony 5" tutorial! Yikes. *But* no more! Starting with Symfony
Flex 1.18 or 2.1, Composer has a proper `recipes:update` command. It literally
*patches* your files to the latest version... and it's *awesome*. Let's try it!

Run:

```terminal
composer recipes:update
```

Oh! Before we run this, it tells us to commit everything that we've been working on.
Great idea! I'll say that we are:

> upgrading some code to Symfony 5.4 with Rector

```terminal-silent
git add .
git commit -m "upgrading some code to Symfony 5.4 with Rector"
```

Perfect! Try the `recipes:update` command again. The reason it wants our
working copy to be clean is because it's about to patch some files... which
*might* involve conflicts.

Let's start with `symfony/framework-bundle`, because this is the *big* one. The
*most* important files in our project come from this recipe. I'll hit `4`, clear
the screen, and go!

Behind the scenes, this checks to see what the recipe looked like when we *originally*
installed it, compares it to what the recipe looks like now, and generates a *diff*
that it then applies to our project. In some cases, like this one, that can cause
some conflicts, which is pretty cool. The best part might be that it generates a
changelog containing *all* the pull requests that contributed to these updates.
If you need to figure out *why* something changed, this will be your friend.

Oh, but creating the changelog requires making a *bunch* of API calls to GitHub.
So it's *possible* that composer will ask you for a personal access token, like
it just did for me. In some *rare* cases with a giant recipe like `framework-bundle`,
if your recipe is really, *really* old, you might get this message even if you *have*
given an access token to Composer. If that happens, just wait for 1 minute... then
re-enter your access token. Congratulations, you just hit GitHub's per-minute API
limit.

*Anyways*, *there's* the CHANGELOG. It's not usually that long, but this recipe
is the most important and... well... it was *horribly* out-of-date. Oh, and if
you have a trendy terminal like me - this is iTerm - you can click these
links to jump directly into the pull request, which will live at
https://github.com/symfony/recipes.

## Changes to .env

Alright, let's walk through the changes this made. This is the *biggest* and most
important recipe, so I want to cover everything.

Since I've already done my homework, I'll clear the changelog and run:

```terminal
git status
```

Woh. It made a *bunch* of changes, including three conflicts. Fun! Let's go
through those first. Move over and start inside `.env`. Let's see: apparently the
recipe *removed* these `#TRUSTED_PROXIES` and `#TRUSTED_HOSTS` lines. Both of
these are now set in a config file. And while you *could* still set an
environment variable and reference it from that config file, the recipe no longer
ships with these comments. I'm not sure why this caused a conflict, but let's
delete them.

## Changes to services.yaml

The next conflict is up in `config/services.yaml`. This one is pretty simple. This
is *our* config and below, the *new* config. The recipe removed the `App\Controller\`
entry. This... was never needed unless you make super-fancy controllers that
do *not* extend `AbstractController`. It was removed from the recipe for simplicity.
It also looks like the updated recipe reformats the `exclude` onto multiple lines,
which is nice. So let's take their version entirely.

## Changes to src/Kernel.php

The final conflict is in `src/Kernel.php`... where you can see that *our* side has
a bunch of code in it... and their side has nothing.

Remember how I mentioned that `configureRoutes()` was moved into `MicroKernelTrait`?
Well it turns out that *all* of these methods were moved into `MicroKernelTrait`. So
unless you have some custom logic - which is pretty rare - you can delete everything.

Ok, back at the terminal, let's add those three files:

```terminal-silent
git add .env config/services.yaml src/Kernel.php
```

And then run

```terminal
git status
```

to see what else the recipe update did.

## Updated public/index.php, deleted bootstrap.php!

Interesting. It deleted `config/bootstrap.php` and modified `public/index.php`.
Those are related. Look at the diff of `index.php`:

```terminal-silent
git diff --cached public/index.php
```

This file *used* to require `config/bootstrap.php`. And *that* file's job was
to read and set up all the environment variables:

```terminal-silent
git diff --cached config/
```

Let's go check out the *new* `public/index.php`. Here it is. *Now* this requires
some `vendor/autoload_runtime.php`. And the file is much shorter than before.
What we're seeing is Symfony's new Runtime component in action. You can check out
its
[introduction blog post](https://symfony.com/blog/new-in-symfony-5-3-runtime-component)
to learn more about it.

Basically, the job of booting up Symfony and loading all of the environment variables
was extracted *into* the runtime component. But... we don't actually have that
component installed yet... which is why, if we try to refresh the page, we're
gonna have a bad time:

> Failed to open `autoload_runtime.php`.

To fix this, head over to your terminal and run:

```terminal
composer require symfony/runtime
```

This package includes a Composer plugin... so it's going to ask us if we trust it.
Say "yes". Then it installs... and promptly explodes when it tries to clear the
cache! Ignore that for now: we'll fix it in a few minutes. It involves updating
*another* recipe.

But if we try our site... it works!

## New Environment-Specific Configuration

Ok, we're almost done! Back at the terminal, let's see what else changed:

```terminal-silent
git status
```

Notice that it deleted `config/packages/test/framework.yaml`, but *modified*
`config/packages/framework.yaml`. This is probably *the* most common change that
you'll see when you update your recipes today.

Open `config/packages/framework.yaml`. At the bottom... there's a new `when@test`
section. Starting in Symfony 5.3, you can now add environment-specific config using
this syntax. This configuration *used* to live inside of
`config/packages/test/framework.yaml`. But for simplicity, the recipe *deleted* that
file and just moved that config to the bottom of *this* file.

Back at the terminal, diff that file... it's hiding two other changes:

```terminal-silent
git diff --cached config/packages/framework.yaml
```

The recipe also changed `http_method_override` to `false`. That disables, by default,
a feature that you probably weren't using anyways. It *also* set
`storage_factory_id` to `session.storage.factory.native`. This has to do with how
your session is stored. Internally, the key changed from `storage_id` to
`storage_factory_id`, and it *should* now be configured.

## Environment-Specific Routing Config

Back at the terminal, let's look at the final changes:

```terminal-silent
git status
```

Speaking of environment-specific config, you can do that same trick with routing
files. See how it deleted `config/routes/dev/framework.yaml`, but *added*
`config/routes/framework.yaml`? If we open up `config/routes/framework.yaml`, yup!
It has `when@dev` and it imports the routes that allow us to test our error pages.
This is yet another example of the recipe moving configuration out of the
environment directory and into the main configuration file... just for simplicity.

## The new preload.php File

Finally, the recipe added a `config/preload.php` file. This one is pretty simple,
and it leverages PHP's preloading functionality. Essentially, on production, if you
point your `php.ini`, `opcache.preload` at this file, you'll get a free performance
boost! It's *that* simple. Well... *mostly* that simple. The only other thing you
need to do is restart your web server on every deploy... or PHP-FPM if you're
using that. We leverage this at SymfonyCasts for a little extra performance boost.

And... phew! The biggest recipe update is *done*. So let's add everything and
commit. Because next, *more* recipe updates! But with FrameworkBundle behind us,
the rest will be easier and faster.
