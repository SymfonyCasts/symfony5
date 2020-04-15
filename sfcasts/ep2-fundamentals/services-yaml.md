# Services Yaml

Coming soon...

When Stephanie is booting up its container, it has to try and figure out what all of
these services are across the whole system and it gets services from two places. The
biggest place is from other bundles. We install other bundles in those bundles.
Describe the services that we need. For example, if we were on bin console, debug
container, we know that there's a giant list inside of here and the vast number of
vast majority of these come from third party bundles. There's third party bundles to
tell you everything and when they register a service they tell, they tell the
container everything about that service. They tell them the idea of the service, the
exact class of that service and what arguments should be passed to the constructor
because ultimately the container is responsible for instituting that class so it
needs to know everything about that service.

The second place that the container gets services from is our source directory. We
already know that because the markdown helper is, we know that the markdown helper is
in the service container because we've been able to auto wire it inside of our
controller and the container is what's handling that behind the scenes. Now when
Symfony is containers booting up, it loads all of those third party bundles that gets
all of their services in. Then it reads our services. That Yama file at the beginning
of this file. Nothing in our source directory is registered as a service in the
container, nothing. The job of this, this file is to register every single class
inside of our source directory as a service, which means to find what its service ID
is, its class name and all of its constructor arguments. The way it does that is kind
of amazing and that's what I want to talk about. So the first thing you see under
services is a special key called_defaults. This is a totally magic value. This_to
faults and what this says is it says, any services that are defined in this file,
each service that's defined in this file

should have a property on. It's called auto wire set to true and another one called
the auto configures. That's a true, so these are basically default configuration
values that should automatically be applied to any other services that are registered
in this file.

Yeah.

Which means if you register a service individually, like what we're doing down here,
it is actually totally legal to say Ottawa or true or our Ottawa are false down here
on an individual service. So up here we're just setting some defaults. Now what auto
wire true says is that tells Symfonys container. Please try to guess the arguments to
my constructor by reading the Taipans. So that's something that's on in simply, but
you can actually technically turn it off. Auto configure is a little bit more subtle.
We'll talk more about it later. But this basically a way of, if you create a certain
type of class that is a plugin for our part of Symfony, Symfony will automatically
recognize it and start using it. We're going to see that at the end of the tutorial
when we create a tweak extension. So these three lines here do nothing. They just
specify some default values that should be used for the rest of the services
registered in this file. This next line is the key part. This fancy little syntax
here says, please look in my source directory and register every single class you
find in. It's as a service in the container

and of course when it does that, thanks to the defaults up here, it's going to set
every single service to auto wire true in auto configure. True. This line here is
actually why our markdown helper is a service and thanks to the auto wire up here.
It's not only a service, but Symfony knows that it should try to auto wire the
arguments to its constructor. Now, when it does this, when it does this auto
registration, remember how I said that? Every service and the container has an ID.
When you do auto registration like this, the IB is actually equal to the class name.
In fact, we can see this. The vast majority of the services and debug container have
some ID that looks like kind of snake case. But if you go all the way to the top
here, you're going to see that our services and yes they do show up in this list,
there are service ID is equal to their class name.

Okay.

And we do this primarily for [inaudible] to keep life simple.

[inaudible]

so after these two sections here, we've now registered every single thing in the
source directory as a service and told us the auto wire. Now you will notice there's
a little exclude key here which says to exclude certain directories, not everything
in your source directory is going to be a service. You might have a test classes or
entities which are um, database classes which are not actually services. They're
really a simple model objects. So you don't want them registered services. But
actually this exclude key is not that important. This just gives you a micro
optimization, um, in the development environment. You could actually delete this if
you want it to and everything would work just fine.

Why? Well, even if you accidentally put something somewhere in your source directory,
even even if you put something in your [inaudible] that wasn't a service and it
accidentally got registered as a service, that's fine. As long as you never tried to
use it as a service, as long as you never tried to. For example, auto wire, a model
class into an argument to a controller, um, the container is just going to discard
it. And so it gets registered as a service for a second, but then it looks around and
says no one's using this. And so then it just removes it. So they exclude here is
nice. It makes the things a little bit faster, but it's really not that big of a
deal. Now the next section is interesting. It actually registers everything. It needs
source controller directory as a service, which should seem weird to you because
didn't it just do that with this above part? And the answer is it did. This section
down here is here just for an edge case situation. And actually if I just deleted the
entire thing and refreshed, everything works just fine. So basically ignore this
import right here.

Okay, so we've registered everything in the store as directors of service and we've
told it to auto wire. Now down here

we get to the situation where sometimes you need to give Symfony's container a little
more information about a service. So that's what we've done here by putting our this
services ID or we're doing is we're overriding that service. So this markdown helper
is actually registered up here, but we immediately override it down here and add a
bind for his debug set to Colonel that debug this also automatically has auto wire
true on it. We don't have to put that because it's automatically there thanks to the
defaults above. So this is a long way of saying that everything in your source
directory is automatically made available as a service in the container and its
arguments are automatically auto wired. And if you add need to add more
configuration, you just put the class of the service down here, which is actually the
ID and that overrides that. And then you can specify whatever config you actually
need. There's some complexity, get the thing work behind the scenes, but it's a kind
of beautiful end product. Now that we know this, we can do something really cool. So
down here, notice we've said that we want the is debug argument to our markdown
helper.

There's third argument here to be set to the kernel dot debug parameter. But I just
told you that there's this cool thing called underscored the false up here that
specifies default values for any service red student's container. So we can actually
do is copy that bind, delete that service entirely, and then go up under_to faults
and paste it there. I forgot where, and refresh no errors. And you can see that the
is debug flag down here. We're dumping is still true. What this done is we've now set
up a global convention. I can not use an is debug argument in any service anywhere in
my application and it's automatically going to be set to the Colonel. Dot. Debug, uh,
uh, parameter. That is awesome.

Okay.

Another thing you can optionally do here and it looks a little bit weird, is you can
actually put the type hint on there. So in this case, the pool is debug matches. The
pool is debug. I have instead of my Mark on helper, so if I refresh, this still
works, but if I didn't have that bul type and on there, I would actually get that air
cannot. A auto wire argument is debug, has no type it, you should configure its value
explicitly. So that's pretty cool. So I'll put that is debug flag back right there
and now it works again and now it's this working. I'll take out, this is debug flag
right here. So this is really how I primarily read what I, this is usually what I do.
Um, by Symfony can auto wire almost everything inside of the container and a few
things that it can't. Auto wire I typically set up as global binds and this is
basically as complicated as your configuration file needs to get. Next, let's talk
about something else named auto wiring on the logger.

