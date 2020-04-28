# Playing with a Custom Console Command

Coming soon...

All right, so let's customize
this a little bit. So there's this little description here. We'll say this cast a
random spell and then for the arguments and the options, these are really cool. What
these allow you to do is if you want, if you had two arguments, if you got a two
arguments, you could say `foo` dash `bar` and options are things that you can do `--`
dash on. And if you want, you can even have a `--option=` so basically the
different ways to specify arguments and the options on that spell. So we're going to
have one argument

called

`your-name`. This is going to be an internal name that we use for that argument. The
user will never actually see this. And then we'll kind of document that over here as
your name. And then option, we're going to have one call and this is going to be that
the users are going to type `yell` to activate this option. And over here I'm
going to say yell. And there's more options here. Like you can make an argument
required this value none. You can change that to a, you can change that as well. And
I don't want to go into the full details here. Granted console commands is not that
hard. It's just super fun. All right, so this configures our command and down here is
actually called it calls. Execute. So first thing is I'm going to rename this to
`$yourName` and we're actually going to read out the `your-name` arguments. So whatever is
the, if the user passes a first argument, uh, we're going to fetch it down here and
assign it to `$yourName`. And then if the user passed a `your-name` argument because it
is optional, then we're going to just say

hi and then your name.

Cool.

Now for the random spell part, I'm going to go down here and clear out this,

well, this option part, I'm going to paste in some code here. This is my array of
spells. I pick a random spell down here. And now remember since we have this yell
option up here, we can actually say if input get option that `yell`. So if they've
passed a `--yell` flag and we'll say `$spell = strtoupper($spell)`. And finally
down here we'll use this little IO variable, which is this cool Symfony style thing.
It just says lots of really nice ways to, to output tax and even ask interactive
questions. Down here we'll say `$io->success($spell)` and is that easy for us to do? So if
you spin it back over, now I'm actually going to do my command, but with a `--help`
option,

```terminal-silent
php bin/console app:random-spell --help
```

that's going to tell us everything about our command. It's going to tell
us that there's an argument called `your-name`. You have a `--yell` option, and
then there are a bunch of built in options as well.

So let's say let's just run it without anything.

```terminal-silent
php bin/console app:random-spell
```

There we go. It gives me a random
spell and if I pass my name at first

```terminal-silent
php bin/console app:random-spell Ryan
```

it's going to say hi Ryan. And of course we can pass `--yell`

```terminal-silent
php bin/console app:random-spell Ryan --yell
```

and it's going to do the same thing, but while yelling, super
cool. Now one last thing about this is that like so many things in Symfony, a command
is actually just a good normal, boring service. So what if I needed to, for example,
log something from inside of my console, Amanda or parse markdown? Well, whenever you
are inside of a service and you need access to another service, the way we do it as
always the same, we had a constructor. So public function `__construct`. And
let's grab the lager `LoggerInterface $logger`. I'll use my all enter trick, I'll have
escape to unfocus that and I'll do my Alt + Enter trick here and go to "Initialize
properties" to create that property and set it. Now the one trick with commands, and
it's not, and we don't have to do this anywhere else in the system, is that the
command actually has its own constructor. So you actually need to call the parent
construct method. This almost never happens in Symfony, but uh, this is one spot
where it did. So I wanted to show you that. So it didn't even need to pass an
argument to it. We just need to make sure that we call the `parent::__construct()`.
Now down here to see if this is working right before the success will to say
`$this->logger->info()`. Keep it simple as that casting spell and then the name of the
spell.

cool. So if we go right now, I'll try it once again.

```terminal-silent
php bin/console app:random-spell Ryan --yell
```

There we go, and we don't have,
and if you want to check the log itself, you can actually lock, like I say,

```terminal
tail var/log/dev.log
```

tail bar
log Deb, that log, that's where all the logs go to. I'll do that up here and so you
can see that. And you see the last entry here is forecasting spell in Gorgio. All
right, next let's create one more cool thing with makeup on the call, the custom
tweak extension, we're actually to create our own custom twig filter so that we can
parse markdown through our caching system. That's next.
