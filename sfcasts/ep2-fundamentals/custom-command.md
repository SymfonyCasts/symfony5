# Playing with a Custom Console Command

Let's make our new console command *sing*! Start by giving it a better description:
"Cast a random spell!":

[[[ code('e035ef0bec') ]]]

For the arguments and options, these describe what you can *pass* to the command.
Like, if we configured two arguments, then we could pass two things, like `foo`
and `bar` after the command. The *order* of arguments is important. Options are
things that start with `--`. Some have values and some don't.

## Configuring Arguments & Options

Anyways, let's add one argument called `your-name`. The argument name is an internal
key: you won't see that when using the command. Give it some docs: this is
"your name". Let's also add an option called `yell` so that users can type
`--yell` if they want us to *scream* the spell at them in uppercase:

[[[ code('26c1c1cc9d') ]]]

There are more ways to configure this stuff - like you can make an argument optional
or required or allow the `--yell` flag to have a value... but you get the idea.

## Executing the Command

When someone *calls* our command, Symfony will run `execute()`. Let's rename the
variable to  `$yourName` and read out the `your-name` argument:

[[[ code('76905fc6e9') ]]]

So *if* the user passes a first argument, we're going to get it here and then,
if we have a name, let's say `Hi!` and then `$yourName`:

[[[ code('f06515d9f7') ]]]

Cool! For the random spell part, I'll paste some code to get it:

[[[ code('950209db11') ]]]

Let's check to see if the user passed a `--yell` flag: if we have a `yell` option,
then `$spell = strtoupper($spell)`:

[[[ code('82573aabc3') ]]]

*Finally*, we can use the `$io` variable to output the spell. This is an instance
of `SymfonyStyle`: it's basically a set or shortcuts for rendering things
in a nice way, asking the user questions, printing tables and a lot more.
Let's say `$io->success($spell)`:

[[[ code('c4483cf40d') ]]]

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

Hello random spell! Try with a name argument:

```terminal-silent
php bin/console app:random-spell Ryan
```

Hi command! And of course we can pass `--yell`

```terminal-silent
php bin/console app:random-spell Ryan --yell
```

to tell it to scream at us.

There are *many* more fun things you can do with a command, like printing lists,
progress bars, asking users questions with auto-complete and more. You'll
have no problems figuring that stuff out.

## Commands are Services

Oh, but I do want to mention one more thing: a command is a good normal, boring
service. I love that! So what if we needed to *access* another service from
within a command? Like a database connection? Well... it's the same process as always.
Let's log something.

Add a `public function __construct` with one argument `LoggerInterface $logger`:

[[[ code('c6d3de2bab') ]]]

I'll use my new PhpStorm shortcut - actually I need to hit Escape first -
then press `Alt`+`Enter` and go to "Initialize properties" to create that property
and set it:

[[[ code('dc411b838b') ]]]

But there is *one* unique thing with commands. The parent `Command` class has
its *own* constructor, which we need to call. Call `parent::__construct()`: we
don't need to pass any arguments to it:

[[[ code('b41c55961a') ]]]

I can't think of *any* other part of Symfony where this is required - it's a quirk
of the command system. Anyways, right before we print the success message, say
`$this->logger->info()` with: "Casting spell" and then `$spell`:

[[[ code('938188426c') ]]]

Let's make sure this works! Run the command again.

```terminal-silent
php bin/console app:random-spell Ryan --yell
```

Cool, that still works. To see if it logged, we can check the log file directly:

```terminal
tail var/log/dev.log
```

I'll move this up a bit... there it is!

Next, let's "make" *one* more thing with MakerBundle. We're going to create our
own Twig filter so we can parse markdown through our caching system.
