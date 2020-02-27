# The Twig Recipe

Unless you're building a pure API - and we *will* talk about returning JSON later
in this tutorial - you're going to need to write some HTML. And... putting text
or HTML in a controller like this is... ugly.

No worries! Symfony has *great* integration with an *incredible* template library
called Twig. There's just one problem: our Symfony app is *so* small that Twig
isn't even installed yet! Ah, but that's not *really* a problem... thanks to the
recipe system.

## Installing Twig

Head back to https://flex.symfony.com and search for "template". There it is!
Apparently Symfony's recommended "template" library is something called `twig-pack`.
Let's install it!

```terminal
composer require template
```

This installs a few packages... and yea! 2 recipes! Let's see what they did:

```terminal
git status
```

## Checking out the Recipe Changes

Whoa, awesome. Okay: we expected changes to `composer.json`, `composer.lock`
and `symfony.lock`. Everything *else* was done by those recipes.

## What are Bundles?

Let's look at `bundles.php` first:

```terminal
git diff config/bundles.php
```

Interesting: it added two lines. Go open that: `config/bundles.php`. A "bundle"
is a Symfony *plugin*. Pretty commonly, when you want to add a new feature
to your app, you'll install a bundle. And when you install a bundle, you need
to *enable* it in your application. A long time ago, doing this was manual.
But thanks to Symfony Flex, whenever you install a Symfony bundle, it automatically
updates this to enable it for you. So... now that we've talked about this file,
you'll probably *never* need to think about it again.

## The templates/ Directory and Config

The recipe *also* added a `templates/` directory. So if you were wondering where
your templates are supposed to live... the recipe kinda answered that question!
It also added a `base.html.twig` layout file that we'll talk about soon.

So... apparently our templates are supposed to live in `templates/`. But why?
I mean, is that path hardcoded deep in some core Twig file? Nope! It lives right
in *our* code, thanks to a `twig.yaml` file that was created by the recipe. Let's
check that out: `config/packages/twig.yaml`.

We're going to talk more about these YAML files in another tutorial. But without
understanding a lot about this file, it... already makes sense! This `default_path`
config points to the `templates/` directory. Want your templates to live somewhere
else? Just change this and... done! You're in control.

By the way, don't worry about this weird `%kernel.project_dir%` syntax. We'll
learn about that later. But basically, it's a fancy way to point to the root
of our project.

The recipe also created one other `twig.yaml` file which is less important:
`config/packages/test/twig.yaml`. This makes a *tiny* change to Twig inside your
automated tests. The details don't really matter. The point is: we installed Twig
and its recipe handled everything else. We are 100% ready to use it in our app.
Let's do that next.
