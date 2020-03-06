# Profiler: Your Debugging Best Friend

We're making some *pretty* serious progress - you should be proud! Let's check out
what files we've modified:

```terminal-silent
git status
```

Add everything:

```terminal-silent
git add .
```

And commit:

```terminal-silent
git commit -m "Added some Twiggy goodness"
```

## Installing the Profiler

Because *now* I want to install one of my *absolute* favorite tools in Symfony.
Run:

```terminal
composer require profiler --dev
```

I'm using `--dev` because the profiler is a tool that we'll only need while we're
*developing*: it won't be used on production. This means Composer adds it to the
`require-dev` section of `composer.json`. This isn't that important, but this is
the right way to do it.

And... at this point, it should be *no* surprise that this configured a recipe!
Run:

```terminal
git status
```

## Hello Web Debug Toolbar

Oh, wow! It added *three* config files. Thanks to these, the feature will work
*instantly*. Try it: back at your browser, refresh the page. Hello web debug
toolbar! The fancy little black bar on the bottom. This will now show up on *every*
HTML page while we're developing. It tells us the status code, which controller
and route were used, speed, memory, Twig calls and even *more* icons will show
up as we start using more parts of Symfony.

## And Hello Profiler

The *best* part is that you can click any of these icons to jump into... the
*profiler*. This is basically the expanded version of the toolbar and it is
*packed* with information about that page load, including request info, response
info and even a super-cool performance tab. This is not *only* a nice way to
debug the performance of your app, it's *also* a great way to... just understand
what's going on inside Symfony.

There are other sections for Twig, configuration, caching and eventually there
will be a tab to debug database queries. By the way, this isn't just for HTML
pages: you can *also* access the profiler for AJAX calls that you make to your
app. I'll show you how later.

## The dump() and dd() Functions

When we installed the profiler, we also got one other handy tool called `dump()`.
I'll click back a few times to get to the page. Open up the controller:
`src/Controller/QuestionController.php`.

Imagine we want to debug a variable. Normally I'd use `var_dump()`. Instead,
use `dump()` and let's dump the `$slug` and... how about `$this` object itself.
When we refresh, woh! It works *exactly* like `var_dump()` except... *way* more
beautiful and useful. The controller apparently has a `container` property... and
we can dig deeper and deeper.

If you're *really* lazy... like most of us are... you can also use `dd()` which
stands for `dump()` and `die()`. Now when we reload... it dumps, but *also* kills
the page. We've now perfected dump-and-die-driven development. I think we should
be proud?

## Installing the debug Package

Change that back to `dump()`... and let's *just* `dump()` `$this`.

There's *one* other library that we can install for debugging tools. This one
is less important - but still nice to have. At your terminal, run:

```terminal
composer require debug
```

This time I'm *not* using `--dev` because this will install something that I
*do* want on production. It installs DebugBundle - that's not something we need
on production - but *also* Monolog, which is a logging library. And we probably
*do* want to log things on production.

## Composer Packs?

Before we talk about what this gave us, check out the name of the package
it installed: `debug-pack`. This is not the first time that we've installed a
library with "pack" in its name.

A "pack" is a special concept in Symfony: it's sort of a "fake" package whose only
job is to help install several packages at once. Check it out: copy the package
name, find your browser, and go to https://github.com/symfony/debug-pack. Woh!
It's nothing more than a `composer.json` file! This gives us an easy way to install
just *this* package... but actually get *all* of these libraries.

So thanks to this, we have two new things in our app. The first is a logger!
If we refresh the page... and click into the profiler, we have a "Logs" section
that shows us *all* the logs for that request. These are *also* being saved to
a `var/log/dev.log` file.

The second new thing in our app is... well... if you were watching closely, the
`dump()` is gone from the page! The DebugBundle integrates the `dump()` function
even *more* into Symfony. Now if you use `dump()`, instead of printing in the
middle of the page, it puts it down here on the web debug toolbar. You can click
it to see a bigger version. It's not that important... just another example of how
Symfony gets smarter as you install more stuff.

## The server:dump Command

Oh, while we're talking about it, the DebugBundle gave us one handle new
console command. At your terminal, run:

```terminal
php bin/console server:dump
```

This starts a little server in the background. *Now* whenever `dump()` is called
in our code, it still shows up on the toolbar... but it *also* gets dumped out
in the terminal! That's a great way to see dumped data for AJAX requests. I'll
hit Control-C to stop that.

## Unpacking Packs

Oh, and about these "packs", if you open your `composer.json` file, the one
problem with packs is that we only have `debug-pack` version `1.0` here: we
can't control the versions of the packages inside. You just get whatever versions
the pack allows.

If you need more control, no problem... just unpack the pack:

```terminal
composer unpack symfony/debug-pack
```

That does exactly what you expect: it removes `debug-pack` from `composer.json`
and *adds* its underlying packages, like `debug-bundle` and `monolog`. Oh, and
because the `profiler-pack` is a dependency of the `debug-pack`, it's in both
places. I'll remove the extra one from `require`.

Next, let's make our site prettier by bringing CSS into our app.
