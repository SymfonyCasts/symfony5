# Flex, Recipes & Aliases

We're going to install a *totally* new package into our app called the
"security checker". The security checker is a tool that will look at our
application's dependencies and tell us if any of them have known security
vulnerabilities. But, full disclosure, as *cool* as that is...  the *real*
reason I want to install this library is because it's a *great* way to look at
Symfony's super-important "recipe" system.

At your terminal, run:

```terminal
composer require sec-checker
```

For the Composer pros out, in a real app, you *should* probably pass `--dev`
to add this to your *dev* dependencies... but it won't matter for us.

## Flex Aliases

But there *is* something weird about this command. Specifically... `sec-checker`
is an *invalid* package name! In the Composer world, *every* package *must* be
`something/something-else`: it can't just be `sec-checker`. So what the heck
is going on?

Back in PhpStorm, open up `composer.json`. When we started the project, we
had just a *few* dependencies in this file. One of them is `symfony/flex`.
This is a composer *plugin* that adds *two* special features to Composer itself.
The first is called "aliases".

At your browser, go to http://flex.symfony.com to find and big page full of packages.
Search for `security`. Better, search for `sec-checker`. Boom! This says that there
is a package called `sensiolabs/security-checker` and it has aliases of
`sec-check`, `sec-checker`, `security-checker` and some more.

The alias system is simple: because Symfony Flex is in our app, we can say
`composer require security-checker`, and it will *really* download
`sensiolabs/security-checker`.

You can see this in our terminal: we said `sec-checker`, but ultimately it
downloaded `sensiolabs/security-checker`. That's also what was eventually put
into `composer.json` file. So... aliases are just a nice shortcut feature... but
it's kinda cool! You can almost *guess* an alias when you want to install something.
Want a logger? Run `composer require logger` to get the recommended logger.
Need to mail something, `composer require mailer`. Need to eat a cake?
`composer require cake`! Oh... I *wish* that worked.

## Flex Recipes

The *second* feature that Flex adds to Composer is the *really* important one.
It's the recipe system.

Back at my terminal, after installing the package, it says:

> Symfony operations: 1 recipe
> configuring sensiolabs/security-checker.

Interesting. Run:

```terminal
git status
```

Whoa! We expected `composer.json` and `composer.lock` to be modified... that's
how composer works. But something *also* modified some `symfony.lock` and added
a totally *new* `security_checker.yaml` file.

Ok, first, `symfony.lock` is a file that's managed by Flex. You don't need to
worry about it, but you *should* commit it. It keeps a big list of which "recipes"
have been installed.

So, who created the other file? Open it up: `config/packages/security_checker.yaml`.
Every package you install *may* have a Flex "recipe". The idea is *beautifully*
simple. Instead of telling people to install a package and *then* create some
configuration file so the package works, with Flex, the recipe adds any files you
need automatically! This file was added by the `sensiolabs/security-checker` recipe!

You don't need to worry about the specifics of what's *inside* this file right
now: that's something we'll explain later. The point is, *thanks* to this file,
we have a new `bin/console` command. Run:

```terminal
php bin/console
```

See that `security:check` command? That wasn't there a second ago. It's there
*now* thanks to the new YAML file. Try it:

```terminal
php bin/console security:check
```

No packages have known vulnerabilities! Awesome!

## How Recipes Work

Here is the *big* picture: thanks to the recipe system, whenever you install a
package, Flex will check to see if that package has a recipe and, if it does,
will install it. A recipe can do many things, like add files, create directories
or even *modify* a few files, like adding new lines to your `.gitignore` file.

The recipe system is a *game-changer*. I *love* it because anytime I need a
new package, all I need to do is install it. I don't need to add configuration
files or modify anything because the recipe will do all that boring work for me.

## Recipes can Modify Files

In fact, this recipe did something *else* we didn't notice. At the terminal, run:

```terminal
git diff composer.json
```

We expected that code would add this new line to our `require` section. But check
this out: it *also* modified *another* part - under `scripts`. This recipe added
a new config file but also *modified* this file.

Thanks to this, whenever you run:

```terminal
composer install
```

After it finishes, it automatically runs the security checker.

The point is: to use the security checker the *only* thing we needed to do was
install it. Its recipe took care of the rest of the setup.

Now... if you're wondering:

> Hey! Where the heck does this recipe live? Can I see it?

That's a *great* question! Let's look at that next.
