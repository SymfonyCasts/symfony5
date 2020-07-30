# Installing Doctrine

Well hey friends! And bienvenidos to our tutorial about learning Spanish! What?
That's next week? Doctrine?

Ah: welcome to our tutorial *all* about making Symfony talk to a database... in
English.

We learned a *ton* in the first two courses of this series, especially the last
tutorial where we demystified services, autowiring and configuration. That hard
work is about to pay off as we take our app to the next level by adding a
database. That's going to make things way, *way* more interesting.

## Who is Doctrine Exactly?

In truth, Symfony has *no* database layer at all. Instead, it
leverages *another* library called Doctrine, which has been around for a long time
and is *incredible*. Symfony and Doctrine are, sort of, the BFF's of
programming, the Batman and Robin of web development, the Bert & Ernie of HTTP!
They're both powerful, but they have *such* a strong integration that it *feels*
like you're using one library.

And not only is Doctrine powerful, but it's also easy to use. I'll admit that this
was *not* always the case. But Doctrine is now more accessible and fun to use
than *ever* before. I think you're going to love it.

## Project Setup

To learn the *most* about Doctrine - and to become the third amigo - you should
*definitely* code along with me by downloading the course code from this page.
After you unzip the file, you'll find a `start/` directory with the same code
that you see here. Check out this `README.md` file for all the setup fun!

The last step will be to open a terminal and use the Symfony binary to start a
local web server - you can download the binary at https://symfony.com/download.
Run:

```terminal
symfony serve -d
```

This starts a web server in the background on port 8000. I'll copy the URL, spin
over to my browser and say hello to... Cauldron Overflow! Our question and
answer site for witches and wizards: a place to debug *what* went wrong when you
tried to make your *cat* invisible and instead made your *car* invisible.

So far, we have a homepage that lists questions and you can view each individual
question and its answers. But... this is *all* hardcoded! None of this is coming
from a database... yet. *That* is our job.

## Installing Doctrine

Now, remember: Symfony starts small: it does not come with every feature and
library that you might *ever* need. And so, Doctrine is *not* installed yet.

To get it, find your terminal and run:

```terminal
composer require orm
```

## Auto-Unpacked Packs

Let's... "unpack" this command!

First, `orm` is one of those Symfony Flex *aliases*. We
only need to say `composer require orm` but, in reality, this is a shortcut
for a library called `symfony/orm-pack`.

Also, we talked about "packs" in a previous course. A pack is a, sort of, fake
package that exists simply to help you install several *other* packages.

Let me show you: copy the name of the package, and go open it in GitHub:
https://github.com/symfony/orm-pack. Yep! It's nothing more than a *single*
`composer.json` file! The whole point of this library is that it requires a few
*other* packages. That means that we can `composer require` this one package, but
in reality, we will get all four of these libraries.

Now, one of the *other* packages that we have in our project is `symfony/flex`,
which is what powers the alias and recipe systems. Starting in `symfony/flex`
version 1.9 - which I *am* using in this project - when you install a pack, Flex
does something special.

Go and look at your `composer.json` file. What you would *expect* to see is one
new line for `symfony/orm-pack`: the one library that we just required. In reality,
Composer *would* also download its 4 dependencies... but only the pack would show
up here. But... surprise! Instead of `symfony/orm-pack`, the 4 packages *it*
requires are here instead!

[[[ code('3b531fab0e') ]]]

Here's the deal: before `symfony/flex` 1.9, when you required a pack, nothing
special happened: Composer added the *one* new package to `composer.json`. But
starting in `symfony/flex` 1.9, instead of adding the pack, it adds the
*individual* libraries that the pack requires: these 4 lines. It does this because
it makes it *much* easier for us to manage the versions of each package independently.

The point is: a pack is *nothing* more than a shortcut to install *several* packages.
And in the latest version of Flex, it adds those "several" packages to your
`composer.json` file automatically to make life easier.

## DoctrineBundle Recipe & DATABASE_URL

Anyways, if we scroll down... you can ignore this `zend-framework` abandoned warning.
That's a distant dependency and it won't cause us problems. And... ah! It looks
like this installed *two* recipes... and one of those gives us a *nice* set
of instructions at the bottom. We'll learn *all* about this.

To see what the recipes did, I'll clear my screen and say:

```terminal
git status
```

Ok: in addition to the normal files that we expect to be modified, the recipe
also modified `.env` and created some *new* files.

Go check out `.env`. At the bottom... here it is: it added a new `DATABASE_URL`.
This is the environment variable that Doctrine uses to connect to the database.

[[[ code('c8060c922e') ]]]

And... we can see this! The recipe *also* added another file called
`config/packages/doctrine.yaml`

*This* file is responsible for configuring DoctrineBundle. And you can actually
*see* that this `doctrine.dbal.url` key *points* to the environment variable! We
won't need to do much work in this file, but I wanted you to see that the environment
variable is *passed* to the bundle.

[[[ code('02c3e9bed9') ]]]

The recipe also added a few directories `src/Entity/`, `src/Repository/`,
and `migrations/`, which we'll talk about soon.

So all we need to do to start working with Doctrine is configure this
`DATABASE_URL` environment variable to point to a database that we have running
somewhere.

To do that, we're going to do something *special* in this tutorial. Instead of
telling you to install MySQL locally, we're going to use Docker. If you already
use Docker, great! But if you *haven't* used Docker... or you tried it
and didn't like it, give me just a *few* minutes to convince you - I
think you're going to *love* how Symfony integrates with Docker. That's next!
