# MakerBundle & Autoconfigure

Congrats on making it *so* far! *Seriously*: your work on this tutorial is going
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

As I've mentioned *so* many times - sorry - bundles give you services. In
this case, `MakerBundle` doesn't give you services that you will use directly,
like in your controller. Nope, it gives you services that power a *huge* list
of new *console* commands.

When the install finishes, run:

```terminal
php bin/console make:
```

Woh! Our app suddenly has a *bunch* of commands that start with `make:`, like
`make:command`, `make:controller`, `make:crud`, `make:entity`, which will be a
database entity and more.

Let's try one of these! Let's make our own custom console command!

## Making a Custom Console Command

Because, in Symfony, you can hook into *anything*. The `bin/console` executable

```terminal-silent
php bin/console
```

is no exception: we can add our *own* command here. I do this all the time
for CRON jobs or data importing. To get started, run:

```terminal
php bin/console make:command
```

Ok: it asks us for a command name. I like to prefix mine with `app`: how about
`app:random-spell`. Our new command will output a random magical spell - very useful!

And... we're done! You can see that this created a new
`src/Command/RandomSpellCommand.php` file. Let's go check it out! Cool! We can
see the name on top, it has a description, some options... and, at the bottom, it
ultimately prints a message. We'll start customizing this in a minute.

But before we do that... guess what? The new command already works! Run:

```terminal
php bin/console app:random-spell
```

It's alive! This message is coming from the bottom of the new class.

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

When autoconfiguration is enabled for a service, it basically tells Symfony:

> Yo! Please look at the base class or interface of this service and if it
> *looks* like it should be a command, or an event listener or something
> *else* that hooks *into* Symfony, please automatically integrat it into
> that system. Thanks!

In other words, Symfony sees our service, *notices* that it extends `Command`
and thinks:

> I bet this is meant to be a console command. I'll just... hook it into that
> system automatically.

I *love* this because it means there is *zero* configuration needed to get things
working. And you'll see this in a bunch of places in Symfony: you create a class,
make it implement an interface and... it'll just start working. We'll see
another example in a few minutes with a Twig extension.

Ok! Now that our command is working, let's *customize* it! Playing with console
commands is one of my *favorite* things to do in Symfony. Let's go!
