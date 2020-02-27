# Creating a new Symfony 5 Project

Hey friends! And *welcome* to the world of Symfony 5... which just *happens* to
be my favorite world! Ok, maybe Disney World is my *favorite* world... but
programming in Symfony 5 is a *close* second.

Symfony 5 is lean and mean: it's lightning fast, starts tiny, but grows with you
as your app gets bigger. And that's *not* marketing jargon! Your Symfony app will
*literally* grow as you need more features. But more on that later.

Symfony 5 is *also* the product of *years* of work on developer experience. Basically,
the people behind Symfony want you to *love* using it but *without* sacrificing
quality. Yep, you get to write code that you're proud of, love the process, *and*
build things quickly.

Symfony is also the *fastest* major PHP framework, which is no surprise: - its
creator *also* created the PHP profiling system Blackfire. So... performance is
always a focus.

## Downloading the Symfony Installer

So... let's do this! Start off by going to http://symfony.com and clicking
"Download". What we're *about* to download is *not* actually Symfony. It's an
executable tool that will help make local development with Symfony... well..
awesome.

Because I'm on a Mac, I'll copy this command and then go open a terminal - I already
have one waiting. It doesn't matter *where* on your filesystem you run this.
Paste!

```terminal-silent
curl -sS https://get.symfony.com/cli/installer | bash
```

This downloads a *single* executable file and, for me, puts it into my home directory.
To make it so that I can run this executable from *anywhere* on my system, I'll
follow the command's advice and move the file somewhere else:

```terminal-silent
mv /Users/weaverryan/.symfony/bin/symfony /usr/local/bin/symfony
```

Ok, try it!

```terminal
symfony
```

It's alive! Say hello to the Symfony CLI: a command-line tool that will help us
with various things along our path to programming glory.

## Starting a new Symfony App

Its *first* job will be to help us create a new Symfony 5 project. Run:

```terminal
symfony new cauldron_overflow
```

Where `cauldron_overflow` will be the *directory* that the new app will live in.
This *also* happens to be the name of the site we're building... but more on that
later.

Behind the scenes, this command isn't doing anything special: it clones a Git
repository called `symfony/skeleton` and then uses Composer to install that
project's dependencies. We'll talk more about that repository *and* Composer a bit
later.

When it's done, move into the new directory:

```terminal
cd cauldron_overflow
```

And then *open* this directory in your favorite editor. I already have it open in
*my* favorite: PhpStorm, which I did by going to File -> Open Directory and
selecting the new project folder. Anyways, say hello to your brand new, shiny,
full-of-potential new Symfony 5 project.

## Our App is Small!

Before we start hacking away at things, let's create a new git repository and
commit. But wait... run:

```terminal
git status
```

> On branch master, nothing to commit.

Surprise! The `symfony new` command *already* initialized a git repository *for*
us and made the first commit. You can see it by running:

```terminal
git log
```

> Add initial set of files

Nice! Though, I personally would have liked a slightly more epic *first*
commit message... but that's fine.

I'll hit "q" to exit this mode.

I mentioned earlier that Symfony starts *small*. To prove it, we can see a list
of *all* the files that were committed by running:

```terminal
git show --name-only
```

Yea... that's it! Our project - which is *fully* set up and ready to leverage
Symfony - is less than 15 files... if you don't count things like `.gitignore`.
Lean and mean.

## Checking Requirements

Let's hook up a web server to our app and see it in action! First, make sure
your computer has everything Symfony needs by running:

```terminal
symfony check:req
```

For check requirements. We're good - but if you have any issues and need help
fixing them, let us know in the comments.

## Starting the PHP Web Server

To actually get the project running, look back in PhpStorm. We're going to talk
more about each directory soon. But the *first* thing you need to know is that
the `public/` directory is the "document root". This means that you need to point
your web server - like Apache or Nginx - at this directory. Symfony has docs on
how to do that.

But! To keep life simple, instead of setting up a *real* server on our local
machine, we can use PHP's built-in web server. At the root of your project, run:

```terminal
php -S 127.0.0.1:8000 -t public/
```

As soon as we do that, we can spin back over to our browser and go to
http://localhost:8000 to find... Welcome to Symfony 5! Ooh, fancy!

Next: as *easy* as it was to run that PHP web server, I'm going to show you an
even *better* option for local development. Then we'll get to know the
*significance* of the directories in our new app *and* make sure that we have
a few plugins installed in PhpStorm... which... make working with Symfony an
absolute pleasure.
