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

HERE

things form all those things for me. In fact, if I go back, I'll run and get status
again and I'm going to get diff composer.json as expected when we install this
package, added the sensory lab security checker to our composer JSON file. But check
this out. It also added something down here under scripts called auto scripts called
secure security dash checker security check.

So that's actually an example of the recipe updating a file and thanks to this line
here, if you run composer install now after an install is on the packages, it
executes one extra script on here which is it actually executes that security check
command for us. So all we needed to do was install the security checker. It added the
configuration file that was needed and even updated our composer.json file to add
that auto script. Now you might be wondering, where did this recipe come from? Where
are the instructions for the recipe? Well, they live in the cloud, but also if you
look at flex dot [inaudible] dot com you can click and look at the recipe for any of
the packages on here. So I'm gonna click on this particular recipe and notice it
takes us to a repositor called Symfony. Slash. Recipes.

I actually click to go to the home page. So this repository is actually a big
repository full of all of the different recipes in the Symfony ecosystem. So I'll go
back here and I'll put in a 4.0 so when we installed this recipe, when we installed
that package, the Symfony flax looked at this recipe and looked at this manifest that
JSON file, which describes what should be added. So you can see the first thing it
says here is it says that we should copy the config directory into the user's
project. So a copy of this config packages, security check or dye Yammel file into
our config packages directory. The configuration file also said that it should add
this security checker line to composer and it defines the aliases that should use for
this recipe. So it's all right here. There's one other spot on the internet where
there are recipes which is Symfony /recipes.com trip. So in fact all the recipes are
either in their recipes repository or in recipes can trip. There's no difference
between these two different places. Um, except that the remain recipes repository is
a little more closely guarded. So these are guaranteed to be higher quality, whereas
recipes contributes easier for anyone to get their a recipe into it. We'll be
installing bundle libraries from both of these.

One other way that you can get information about the recipes is actually via composer
because remember flex is a composer plugin, so it actually adds a new command called
composer recipes. This gives you an example. This shows you all the recipes that are
currently installed into our system. And if we copy this name here, we can say
composer recipes sends the lab /security checker and it gives us a URL to be exact
version that we have installed and even shows us which files it copied into our
project. So that's it for composer or that's it for the flex recipe system. It's
going to be the key because it's going to help us install everything as we go along.
I need a good way to wrap that up. One other superpower of the recipe system. We're
just kind of handy because you can also remove packages. So the security checker is
cool, but I just wanted to show it as an example. So I'm gonna remove it. Composer
remove second checker. That of course is going to remove the packages, but it also
unconfigured the recipe. So when I run and get status, now look, it's clean. It
cleaned up our composer, that JSON file, the script section has gone from here and
deleted the extra configuration file. All right, next let's install a temp bunny
engine called twig doing. That's going to be super easy because the twig recipe is
going to configure everything we need automatically.
