# Playing with a Custom Console Command

Let's make our new console command *sing*! Start by giving it a better description:
"Cast a random spell!" For the arguments and options, these describe what you can
*pass* to the command. If we configured two arguments, then we could pass two things,
like `foo` and `bar` and the order of the arguments matters. Options are things
that start with `--` and can sometimes have values.

## Configuring Arguments & Options

Anyways, let's add one argument called `your-name`, which is an internal name:
you won't see that when using the command. Give it some documentation: this is
"your name". And let's add one option called `yell` so that users can type
`--yell` if they want everything in uppercase.

Both of these have more options - like you can make an argument optional or
required or allow users to pass a value to the `--yell` flag... but this is enough.

## Executing the Command

When someone *calls* our command, Symfony will run `execute()`. Let's rename the
variable to  `$yourName` and read out the `your-name` argument. So *if* the user
passes a first argument, we're going to get it here and then, if we have a name,
let's `Hi!` and then `$yourName`.

Cool! For the random spell part, I'll paste some code to get our random spell.

Let's check to see if user passed a `--yell` flag: if we have a `yell` option,
then `$spell = strtoupper($spell)`. *Finally*, we can use the `$io` variable
to output the spell. This is an instance of `SymfonyStyle`: it's basically a
set or shortcuts for rendering things in a nice way, asking the user questions,
printing tables and a lot more. Let's say `$io->success($spell)`.

Done! Let's try it! Back at your terminal, start by running the command, but with
a `--help` option:

```terminal-silent
php bin/console app:random-spell --help
```

This tells us everything about our command: the argument, `--yell` option and
a bunch of other options that are built into every command. Try the command with
no flags:

```terminal-silent
php bin/console app:random-spell
```

There's our random spell. And now try with your name.

```terminal-silent
php bin/console app:random-spell Ryan
```

Hi command! And of course we can pass `--yell`

```terminal-silent
php bin/console app:random-spell Ryan --yell
```

to tell it to scream at us.

There are a *lot* more fun things you can do with a command, like printing a
table, progress bars, asking users questions with auto-complete and more. You'll
have no problems.

## Commands are Services

Oh, but I do want to mention one more thing: a command is a good normal, boring
service. I love that! So what if we needed to *access* another service from
within a command - like a database connection? It's the same process as always.
Let's log something.

Add the `public function __construct` with one argument `LoggerInterface $logger`.
I'll press use my new PhpStorm shortcut - actually I need to hit Escape first -
then press Alt + Enter and go to "Initialize properties" to create that property
and set it.

But there is *one* unique thing with commands. The parent `Command` class has
its *own* constructor, which we need to call. Call `parent::__construct()`: we
don't even need to pass any arguments to it.

I can't think of *any* other part of Symfony where this is required - it's quirk
of the command system. Anyways, right before we print the success message, say
`$this->logger->info()` with: "Casting spell" and then `$spell`.

Let's make sure that works - run the command again.

```terminal-silent
php bin/console app:random-spell Ryan --yell
```

That works fine. To see if it logged, we can check the log file directly:

```terminal
tail var/log/dev.log
```

I'll move this up a bit... there it is!

Next, let's "make" *one* more thing with MakerBundle. We're going to create our
own Twig filter so that we can parse markdown through our caching system.
