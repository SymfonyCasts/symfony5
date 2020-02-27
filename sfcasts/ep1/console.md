# The Lovely bin/console Tool

Let's commit our progress so far. I'll clear the screen and run:

```terminal
git status
```

Interesting: there are a few *new* files here that I didn't create. Don't worry:
we're going to talk about that *exactly* in the next chapter. Add everything with:

```terminal
git add .
```

*Normally*... this command can be dangerous - we might accidentally add some
files that we *don't* want to commit! Fortunately, our project came with
a pre-filled `.gitignore` file which ignores the important stuff, like `vendor/`
and some other paths we'll talk about later. For example, `var/` holds cache
and log files. The point is, Symfony has our back.

Commit with:

```terminal
git commit -m "we are ROCKING this Symfony thing"
```

## Hello bin/console Command

You can interact with your Symfony app in *two* different ways. The first is by
loading a page in your browser. The *second* is with a handy command-line script
called `bin/console`. At your terminal, run:

```terminal
php bin/console
```

Woh! This command lists a *bunch* of different things you can do with it, including
a *lot* of debugging tools. Now, just to demystify this a little, there is
*literally* a `bin/` directory in our app with a file called `console` inside. So
this `bin/console` thing is not some global command that got installed on our
system: we are literally executing a physical PHP file.

The `bin/console` command can do *many* things - and we'll discover my favorite
features along the way. For example, want to see a list of *every* route in your
app? Run:

```terminal
php bin/console debug:router
```

Yep! There are our *two* routes... plus another one that Symfony adds automatically
during development.

The `bin/console` tool *already* contains *many* useful commands like this. But
the list of commands it supports is *not* static. New commands can be added
by *us*... *or* by new packages that we install into our project. That's my
"not-so-subtle" foreshadowing.

Next: let's talk about Symfony Flex, Composer aliases and the recipes system.
Basically, the tools that makes Symfony truly unique.
