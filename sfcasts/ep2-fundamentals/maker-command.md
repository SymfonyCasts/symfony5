# MakerBundle & Autoconfigure

Congrats on making it this far! *Seriously*: your work on this tutorial is going
to make *everything* else you do make a *lot* more sense. Now, it's time to celebrate!

One of the *best* parts of Symfony is that it has a *killer* code generator.
It's called "MakerBundle"... because shouting "make me a controller!" is more fun
than saying "generate me a controller".

## Hello MakerBundle

Let's get it installed. Find your terminal and run:

```terminal
composer require maker --dev
```

We're adding `--dev` because we won't need the `MakerBundle` in production,
but that's a minor detail.

As I've mentioned now *so* many times - sorry - bundles give you services. In
this case, `MakerBundle` doesn't give you services that you will use directly,
like in your controller. Nope, it gives you services that power a *huge* list
of new console commands.

When the install finishes, run:

```terminal
php bin/console make:
```

Woh! Our app suddenly has a *bunch* of commands that start with `make:`, like
`make:command`, `make:controller`, `make:crud`, `make:entity`, which will be a
database entity and more.

Let's try some of these! Let's make our own custom console command!

## Making a Custom Console Command

Because, in Symfony, you can hook into *anything*. The `bin/console` executable

```terminal-silent
php bin/console
```

is no exception: we can add our *own* new command here. I do this all the time
for CRON jobs or data importing. To get started, run:

```terminal
php bin/console make:command
```

Ok: it asks us for a command name. I like to prefix mine with the `app`. So how
`app:random-spell`. Our new command will output a random magical spell - very useful!

And... we're done! You can see that this created anew
`src/Command/RandomSpellCommand.php` file. Let's go check it out! Cool! You can
see the name on top, it has a description, some options... and, at the bottom, it
ultimately prints a message. We'll start customizing this in a minute.

But before we do that... guess what? We can *already* use this! Run:

```terminal
php bin/console app:random-spell
```

It works! This message is coming from the bottom of the new class.

## Service Auto Configuration

But wait: how did Symfony *instantly* see our new command class and start using it?
Is it because... it lives in a `Command/` directory and Symfony scans for classes
that live there? Nope! We could rename this to directory to
`DefinitelyNoCommandsInHere/` and it would *still* see the command.

The way this works is way cooler. Open up `config/services.yaml` and look at
the `_defaults` section. We talked about what `autowire: true` means, but I did
*not* explain the purpose of `autoconfigure: true`. Because this is below
`_defaults`, autoconfiguration *is* active on *all* of our services, *including*
our new command.

When autoconfiguration is enabled for a service, it basically says: look at the
base class or interface of this service. If it *looks* like it should be a command,
please automatically integrate that into the command system.

So what tells Symfony that this is a command is... the fact that it extends the
`Command` class! This is great because it means there is *zero* configuration needed
to get things working. You'll see this in a bunch of places in Symfony: you'll
create a class, make it implement an interface and... it will just work. We'll
see another example in a few minutes with a Twig extension.

Ok! Now that our command is working, let's *customize* it! Playing with console
commands is one of my *favorite* things to do in Symfony.
