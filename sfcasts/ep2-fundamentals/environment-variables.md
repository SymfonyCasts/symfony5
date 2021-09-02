# Environment Variables

One big part of Symfony's configuration system that we have *not* talked about
yet is: environment variables. To show them off, let's implement a *real* feature
in our app.

Go to `sentry.io`. If you've never used Sentry before, it's a cloud-based error
monitoring tool: it's a really great way to track and debug errors on production.
Not that *those* ever happen. Ahem. They also have excellent integration with Symfony.

If you don't already have an account, sign up - it's free. Once you do, you'll
end up on a "Getting Started" page that looks something like this. I'll select
Symfony from the list. Ok: it wants us to install some `sentry/sentry-symfony`
package.

## Installing sentry/sentry-symfony & Contrib Recipes

Before you do, make sure you've committed all your changes to Git.

```terminal-silent
git add .
git commit -m "your commit message here..."
```

I committed before hitting record, so I'm good to go. I like to do this before
installing a new package so I can see what its recipe does.

Back on the docs, copy the `composer require` line, move over, and paste:

```terminal
composer require "sentry/sentry-symfony:^3.4"
```

It's downloading some packages and... interesting! It says:

> The package for this recipe comes from the contrib repository, which is open
> to community contributions. Do you want to execute this recipe?

There are actually *two* places that recipes come from. The first is the main,
official recipe repository, which is heavily-guarded for quality. Every recipe
we've installed so far has been from that. The second is a "contrib" repository.
That repository is *less* guarded for quality to make it easier for recipes from
the community to be added, though the recipe still requires approval from a core
Symfony member *or* an author of the package itself. The point is: if you're
cautious, you can check a contrib recipe before you install it.

I'm going to say yes permanently by saying `p`. Ok, what did the recipe do? Run:

```terminal
git status
```

It modified the normal stuff - like `composer.json`, `composer.lock`,
`symfony.lock` and `config/bundles.php` because this package contains a bundle:
`SentryBundle`:

[[[ code('69e4fb56cb') ]]]

## Hello Environment Variables & .env

The recipe also *updated* `.env` and added a new config file. Let's go see
what's going on.

First, open up `.env` and scroll to the bottom. Woh! This has a new section
that sets an environment variable called `SENTRY_DSN`:

[[[ code('6865775536') ]]]

Environment variables are not a Symfony or PHP concept: they're values that you
can pass to *any* process on your computer to configure that process's behavior.
Symfony supports *reading* environment variables, which we'll see in a minute.
But *setting* them can be a pain: it's different for every operating system.
For that reason, when Symfony loads, it reads this file and sets anything here
as an environment variable *for* you.

## Reading Environment Variables with %env()%

So... if we're *setting* a `SENTRY_DSN` environment variable... what's *using*
that? Go into `config/packages/` and open the shiny new `sentry.yaml` file, which,
not surprisingly, configures the new SentryBundle. Check this out: it has a `dsn`
key set to a *very* strange value: `%env(SENTRY_DSN)%`:

[[[ code('bd69cf06d2') ]]]

This... kind of looks like a parameter, right? It has percent signs on both sides,
just like how, in `cache.yaml`, we referenced the `cache_adapter` parameter with
`%cache_adapter%`:

[[[ code('f8e5ea52fe') ]]]

And... it is *sort* of a parameter, but with a special super-power: when you
surround something by `%env()%`, it tells Symfony to read the `SENTRY_DSN`
environment value.

## Why Environment Variables?

So... *why* are we setting an environment variable in `.env` and then reading it
here? Well, the `SENTRY_DSN` string will be a *sensitive* value: if someone got
*access* to it, they would be able to send information to our Sentry account.

Look back at the setup guide and skip down to the DSN part. Technically, we
*could* copy this value and paste it right into `sentry.yaml`. The problem is
that this file will be committed to git... and it's generally a *bad* idea to
commit sensitive values to your repository.

To avoid that, this bundle correctly recommended that we use an environment
variable: we'll store the environment variable somewhere *else*, then read it here.

## .env & .env.local

And, as we talked about, it *is* possible to set a *real* `SENTRY_DSN` environment
variable on your system. But... since that's a pain, Symfony allows us to *instead*
define any environment variables we need in `.env` if we want to... which we will.

But... this `.env` file is *also* committed to the repository: you can see that
in the terminal if you run:

```terminal
git status
```

So if we pasted the `SENTRY_DSN` value here, we would have the same problem: the
sensitive value would be committed to the repository.

Here's the deal: the `.env` file is meant to store non-sensitive *default* values
for your environment variables - usually values that are good for local development.
This works because *after* Symfony loads `.env`, it looks for *another* file called
`.env.local`.

We don't have that yet, so let's create it: `.env.local`.

Anything you put in this file will *override* the values in `.env`. Let's add
our real value here: `SENTRY_DSN=` then paste:

[[[ code('ace20a4aea') ]]]

*Perfect*! In `.env`, we set `SENTRY_DSN` to a non-sensitive default:

[[[ code('ef6fcde3e6') ]]]

in this case empty quotes means "don't send data to Sentry": and in `.env.local`
we *override* that to the real value:

[[[ code('0dffbdccc7') ]]]

If you're confused *why* this is better, there's *one* more thing I need to tell
you. Open up `.gitignore`: the `.env.local` file is *ignored* from Git:

[[[ code('c402790452') ]]]

Check it out: at your terminal, run:

```terminal
git status
```

It does *not* see `.env.local`: our sensitive value will *not* be committed. To
see the *final* environment variable values, we can run:

```terminal
php bin/console about
```

This gives us a *bunch* of info about our app including, at the bottom, a list
of the environment variables being loaded from the `.env` files. It's working
perfectly.

## Seeing it Work!

So let's... see if Sentry works! In the `show()` controller, throw a very realistic
new `\Exception()`:

> bad stuff happened!

[[[ code('e36c81b3a3') ]]]

When we installed SentryBundle, it *did* add some services to the container. But
the main purpose of those services isn't for us to interact with them directly:
it's for *them* to hook *into* Symfony. The bundle's services are set up to listen
for errors and send them to Sentry.

So all *we* need to do is... refresh! There's our error. Back on Sentry, I should
be able to go to `sentry.io` and... yep! It takes me over to the SymfonyCasts issues
and we have a new entry: Exception: bad stuff happened!

***TIP
If you don't see your logs showing up in Sentry, there could be some connection error that's being hidden
from you. If you want to debug, check out Ryan's comment about this: https://bit.ly/sentry-debug
***

Next, how do you handle setting environment variables when you deploy? It's time
to check out a *cool* new system called the secrets vault.
