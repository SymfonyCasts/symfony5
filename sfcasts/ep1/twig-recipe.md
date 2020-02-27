# The Twig Recipe

Unless you're building a pure API - and we *will* talk about returning JSON later
in this tutorial - you're going to need to write some HTML. And... putting text
or HTML in a controller like this is... ugly.

No worries! Symfony has *great* integration with an *incredible* template library
called Twig. There's just one problem: our Symfony app is *so* small that Twig
isn't even installed yet! Ah, but that's not *really* a problem, thanks to the
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

Let's look at that `bundles.php` file first:

```terminal
git diff config/bundles.php
```

Interesting: it added two lines. Go open that: `config/bundles.php`. A "bundle"
is a Symfony *plugin*. And pretty commonly, when you want to add a new feature
to your app, you'll install a bundle. And whenever you install a bundle, you need
to *enable* it in your application. A long time ago, doing that was manual.
But thanks to Symfony Flex, whenever you install a Symfony bundle, it automatically
updates this to enable them for you. Now that we've talked about this file, you'll
probably *never* need to think about it again.

## The templates/ Directory and Config

The recipe *also* added a `templates/` directory. So if you were wondering where
your templates should live... the recipe answered that question! It also added a
`base.html.twig` layout file - but more on that later.

So... apparently our templates are supposed to live in this `templates/`. But why?
Is that hardcoded deep in some core Twig files? Nope! It lives right in *our* code,
thanks to a file that a `twig.yaml` file that was created by the recipe. Let's
check that out: `config/packages/twig.yaml`.

We're going to talk more about these YAML files in another tutorial. But without
understanding a lot about this file, it... already makes sense! This `default_path`
config points to the `templates/` directory. Want your templates to live somewhere
else? Just change this and... done! You're in total control.

By the way, don't worry yet about this weird `%kernel.project_dir%` syntax. We'll
learn about that ltaer. But basically, it's a fancy way to point to the root
of our project.

The recipe also created one other `twig.yaml` file which is less important:
`config/packages/test/twig.yaml`. This makes a *tiny* change to Twig if you write
automated tests. The details don't really matter. The point is: we installed Twig
and its recipe handled everything else. We are 100% ready to use it in our app.
Let's do that next.
