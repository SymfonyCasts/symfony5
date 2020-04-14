# Maker Command

Coming soon...

Congrats on making it this far. I'm serious. You have just invested in your Symfony
skills and unlocked massive potential for everything else that we're going to do
instead of Symfony. So Pat yourself on the back and now let's celebrate a little bit.
One of the best parts of Symfony is that it has a kick butt code generator. You can
generate tons of stuff in Symfony and it's via a bundle called make or bundle. So
find your terminal and let's get it installed. Composer require maker. We can just
use the alias dash dash dev because we don't need the maker bundle in production.

Now as I mentioned, bundles give you services and in this case maker bundle doesn't
give you services that you use like in your controller for example. It gives you
services that power a bunch of new console commands. So when it finishes, I'm gonna
run bin console, make colon. It's a nice little shortcut to show you that you have a
bunch of new make colon commands, make command, make command, make controller, make a
entire crud, make entity, which is going to be a database entity with talk about
later and tons of stuff. I just want to play with a couple of these

now for it. One of the first ones you see is actually called make command because in
Symfony you can hook into anything and the bin console is no exception. You can
actually add your own bin console command, and I do this all the time, so to make
this easier, we're going to run bin console, make command, and it's going to ask us
what command we want, name we want to call it. I like the prefix mine with the app,
I'm going to say app, colon, and then let's say random spell. We'll make a command.
It's going to print this out. A random spells the screen and that's it. We're done.
You can see it created a source command or random spell command. That PHP file. Let's
go look at that and cool. You can see the name of it up here. It's got a description.

A couple of other things we'll talk about in a second and ultimately prints outs and
things in the bottom. We're going to customize this in a second so don't worry too
much about the details. The cool thing is it works instantly. I can run bin console,
app, colon, random spell and it works. It says you have a new command, make it your
own, which is coming from down here on the bottom. By the way, the reason that this
is Symfony instantly notices that this is a command and starts using it is not
because this isn't a command directory. We can rename that to pizza and everything
would work. This is actually coming from our config services .yaml file. Remember
this a little_defaults a thing here. We understand what auto wiring means that says,
please try to guess the arguments to my, to the constructor of my services. But
there's also this little auto configure thing that we didn't talk about much when
auto configure basically does is it says if you ever see a service that extends a
well known class or implements a well known interface,

okay,

I want you to automatically integrate it into that system. So the very fact that we
extend command that auto configure says, well you must want this to be a custom
console command. So I will tell Symfony about your command. It's really cool because
it means we need no extra configuration. It just works. All right, so let's customize
this a little bit. So there's this little description here. We'll say this cast a
random spell and then for the arguments and the options, these are really cool. What
these allow you to do is if you want, if you had two arguments, if you got a two
arguments, you could say food dash bar and options are things that you can do dash
dash on. And if you want, you can even have a dash dash option = so basically the
different ways to specify arguments and the options on that spell. So we're going to
have one argument

called

your name. This is going to be an internal name that we use for that argument. The
user will never actually see this. And then we'll kind of document that over here as
your name. And then option, we're going to have one call and this is going to be that
the users are going to type dash dash yell to activate this option. And over here I'm
going to say yell. And there's more options here. Like you can make an argument
required this value none. You can change that to a, you can change that as well. And
I don't want to go into the full details here. Granted console commands is not that
hard. It's just super fun. All right, so this configures our command and down here is
actually called it calls. Execute. So first thing is I'm going to rename this to your
name and we're actually going to read out the your name arguments. So whatever is
the, if the user passes a first argument, uh, we're going to fetch it down here and
assign it to your name. And then if the user passed a your name argument because it
is optional, then we're going to just say

hi and then your name.

Cool.

Now for the random spell part, I'm going to go down here and clear out this,

well, this option part, I'm going to paste in some code here. This is my array of
spells. I pick a random spell down here. And now remember since we have this yell
option up here, we can actually say if input get option that yell. So if they've
passed a dash dash y'all flag and we'll say spell = S R to upper spell. And finally
down here we'll use this little IO variable, which is this cool Symfony style thing.
It just says lots of really nice ways to, to output tax and even ask interactive
questions. Down here we'll say IO success spell and is that easy for us to do? So if
you spin it back over, now I'm actually going to do my command, but with a dash dash
help option, that's going to tell us everything about our command. It's going to tell
us that there's an argument called your name. You have a dash just yell option, and
then there are a bunch of built in options as well.

So let's say let's just run it without anything. There we go. It gives me a random
spell and if I pass my name at first it's going to say hi Ryan. And of course we can
pass dash dash yell and it's going to do the same thing, but while yelling, super
cool. Now one last thing about this is that like so many things in Symfony, a command
is actually just a good normal, boring service. So what if I needed to, for example,
log something from inside of my console, Amanda or parse markdown? Well, whenever you
are inside of a service and you need access to another service, the way we do it as
always the same, we had a constructor. So public function underscore,_construct. And
let's grab the lager lager interface logger. I'll use my all enter trick, I'll have
escape to unfocus that and I'll do my alt enter trick here and go to initialize
properties to create that property and set it. Now the one trick with commands, and
it's not, and we don't have to do this anywhere else in the system, is that the
command actually has its own constructor. So you actually need to call the parent
construct method. This almost never happens in Symfony, but uh, this is one spot
where it did. So I wanted to show you that. So it didn't even need to pass an
argument to it. We just need to make sure that we call the parent construct.

Okay.

Now down here to see if this is working right before the success will to say
this->logger->info. Keep it simple as that casting spell and then the name of the
spell.

Okay,

cool. So if we go right now, I'll try it once again. There we go, and we don't have,
and if you want to check the log itself, you can actually lock, like I say, tail bar
log Deb, that log, that's where all the logs go to. I'll do that up here and so you
can see that. And you see the last entry here is forecasting spell in Gorgio. All
right, next let's create one more cool thing with makeup on the call, the custom
tweak extension, we're actually to create our own custom twig filter so that we can
parse markdown through our caching system. That's next.

