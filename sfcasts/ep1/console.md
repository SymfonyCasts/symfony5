# The Lovely bin/console Tool

Let's commit our progress so far. I'll clear the screen and run:

```terminal
git status
```

Interesting: there are a few *new* files here that I didn't create. Don't worry:
that's *exactly* what we're about to talk about. Add everything with:

```terminal
git add .
```

*Normally*... this command can be dangerous - we might accidentally add some
files that we *don't* want to commit to git! Fortunately, our project came with
a pre-filled `.gitignore` file which ignores all the most important directories,
like `vendor/` and some other paths we'll talk about later, like `var/`, which
holds cache and log file. The point is, Symfony has our back.

Commit with:

```terminal
git commit -m "we are ROCKING this Symfony thing"
```

## Hello bin/console Command

You can interact with your Symfony app in *two* different ways. The first is by
loading a page in your browser. The *second* is with a handy command-line script
called. At your terminal, run:

```terminal
php bin/console
```

Woh! This command lists a *bunch* of different things you can do with it, including
a *lot* of debugging tools. Now, just to demystify this a little, there is
*literally* a `bin/` directory with file called `console` inside. So this
`bin/console` thing is not some global command that got installed on our system:
we're simply executing a physical PHP file.

The `bin/console` command can do *many* things - and we'll discover my favorite
features along the way. For example, want to see a list of *every* route in your
app? Run:

```terminal
php bin/console debug:router
```

Yep! There are our *two* routes... plus another one that Symfony adds automatically
during development.

The point is: the `bin/console` tool is awesome... *and* the list of commands
it supports - like `debug:router` is *not* static. New commands can be added
by *us*... *or* by new packages that we install into our project... something
we'll see very soon.

Next: let's talk about Symfony Flex, Composer aliases and the recipes system.
Basically, the magic layer that makes Symfony awesome.
