# Named Autowiring

Coming soon...

Let's do a little exercise. Let's pretend that maybe to help us debug things, we want
to log some messages from inside markdown helper. Okay, logging is work, so therefore
logging must be done by a service. So if our project has a logger logging
capabilities in it right now, it means that it must have a logger service. So let's
bend over and run our trusty bin console, debug auto wiring and I will search for
lock and there it is. We can use the logger interface to give us a service whose
ideas monolog that logger and you'll notice there's a bunch of other loggers down
here. Ignore those for now. That's exactly what I want to talk about. Let's go ahead
and use this logger interface. So I'll add a fourth argument here. I'll log or
interface,

okay,

logger and then I'm actually going to use a shortcut here. I'm going to hit alt enter
and go to initialize properties, but that's going to do is create that property and
set it down there. So it was just a shortcut to create that property and set it down
here. We'll add some very important code that says if SDI POS of source and cat does
not equal false, then we will say this air logger->and how about let's use info. Of
course we will say, yeah,

perfect.

Let's try that. Move over, refresh, no airs and I can click any link down here to
jump into the wet end of the profiler. I would have logs and there is our log
message. Okay, awesome. Now the logging system inside of Symfony has this concept of
lager channels. They're kind of like lager categories and the cool thing about the
lager channels is that if you want to, you can send logs that go to different lager
channels to different files and actually that's what you're seeing inside of the
debug auto wiring. You're seeing individual loggers for all the different logger
channels that exist inside of our application. So for example, if you wanted to, you
could send all of your request to channel loggers to one log file and all of your
router logger channels to another file. The way this is done inside of the logging
system is that there is actually an individual logger service for every single
channel.

So this is the first time where we don't just have one logger, we actually have nine
loggers in the system. So the question is how can I get one of these other loggers to
show you how to do that? We're actually going to create our own logging channel just
for the heck of it. The way you can do that, the lager service is actually provided
us to us by a bundle called monolog bundle. So we can big packages. I'm gonna create
a new file called monolog.yaml and instead of here, we'll say monolog and below there
we're allowed to say channels and then an array. And then we can say markdown. By the
way, you don't see a monolog that yam will fly out here right now because, uh, the
monolog configuration is actually in the dev directory and in the prod directory, uh,
development. And, uh, production logging is so different that by default they don't
actually have any shared configuration. Um, they just do everything different. So now
we actually do have a little bit of share configuration that says we want a markdown,
a channel logger in all environments. So as soon as we have this config, the bundle
is gonna add a new service for us called monolog about lager dot markdown.

Okay.

All right, so how can we get access to this logger? Well, this is actually telling
us, it tells us that if we use the longer interface, but name our argument markdown
logger, then it will give us that service. So let's try that spin over to markdown
helper and let's rename the argument from lager to markdown lager up here, and also
name it three names in our controller in our constructor. Alright, let's try it.
Refresh it works. And if you click any link in the web, Debo jewel bar to open the
profiler and go to laws. Yes, here it is. Look at channel markdown that just logged
through the markdown channel to prove it even more. Spin over to your terminal and
let's run it been a console debug container. Remember, that's the service. That's the
command that lists all of the services, that container, you can also use it to get
more information about a specific service. So I'm actually going to say dash dash
show, dash arguments. That's gonna sh show me the arguments to a service and then on
a search for markdown. So that I can do here is select a zero because I want more
information about my markdown service. And then there it is, you can see down here it
says it shows our four different arguments and it shows that the fourth argument is
monolog dot logger dot markdown. Awesome.

So the reason this works is basically because every time you add a new lager channel,
the monolog bundle is really, really smart and it makes sure that it sets up one of
these auto wiring aliases for you. But if it didn't do that, how could we do it
ourselves? And when I really want to show you is how the auto wiring works behind the
scenes. And ultimately I'd probably need to make sure that I've talked about this a
little bit before

Wellsy.

So let's go back to our markdown helper and let's be complicated. I'm going to change
this and change our argument to be called MD logger in the constructor and then down
below as well. Perfect. Now if we go back and refresh, that's not going to break our
page, but if you jump into the profiler and go to the log section, you'll notice
that, well, once again, a log in through the app channel. And that's basically
because if it doesn't match your argument and it doesn't match with one of these,
then it's going to give you the default one. So, and I'm doing this on purpose to be
even more difficult. So how can we fix this ourselves? Like let's say for some reason
we really do want to call this MD logger. Well there are two ways both of them are in
config services.yaml.

The first way is we could use a global bind. It works exactly like our is debug. So
I'm gonna go back here and actually copied type in logger interface. Let's actually
get the full a use statement for that full class name for that. So I'll copy PSR, log
log or interface like that and then we'll say dollar sign MD logger. Cause that's
what I called it. And then the key thing is here is now we're going to put the ID to
the service. So if you go and look at our debug Ottawa and you can see that the idea
of service as monolog, that lager, that markdown. So I'm going to copy that and then
paste it here. But wait, because if we just did this Symfony would think that we
wanted to pass that string. What we actually want to pass a service with that ID when
you're referencing a service inside of one of these files, the secret here is to
prefix it with an ask symbol that has a special syntax that says we're not referring
to the monolog, that log are not markdown string. I want that service. Now if we go
back and refresh it works and actually to prove that this is working, let's go back
and run our debug container dash dash show argument's markdown.

Actually let's not do that.

And if you click to open the profiler, go back to logs. Yes it is logging through the
markdown channel but there's actually even a slightly more um correct way to to to
set up a global binds for services, cover the entire bind, go to the bottom of this
file going for spaces and paste. What this does is it actually creates a new service
whose ID is PSR log log, Rainer, face space and the lager. I know it's a strange
service ID and it's not a real service but it is. It's actually an alias, kind of
almost like a symbolic link to the service who's ID is a monolog that log are not
markdown because remember the way that auto wiring works is that when Symfony at an
argument called lager interface MD logger, the first thing it's going to do is look
to see if there is a service in the container whose name is PSR log lager interface
and the logger. If there is, it's going to use this service as that argument and
since the service is an alias to monolog, that lager that markdown, it's effectively
get to use that service. Phew.

So if we go back over and refresh, it still works. I'll open up a new tab, go down to
logs, and yes, it is still using markdown. The really cool thing about this is that
if you spin back over and run our debug auto wiring log again, you can see our MD
longer actually shows up here. By creating that alias, we are actually doing the
exact same thing that the core did that the co, that model I bundled us well my Mongo
does is it actually creates an alias from PSR log lager interface, and then the name
of each channel to that specific service. That's how auto wiring works. Next, let's
talk about something else.

