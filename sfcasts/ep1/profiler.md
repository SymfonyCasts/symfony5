# Profiler

Coming soon...

All right, we're making some pretty awesome progress, sovereign and get status and
let's commit get ad that looks good and Kim get commit dash

because now I want to install a really awesome debugging tool. We're going to use
another flex alias, say composer require profiler dash dash dev using dash dash dev
here because profiler is a tool that we own the need them develop an environment so
that we'll make sure that it's added to the dev section of my uh, composing that JSON
file. Not that important, but it's a best practice as usual. This configures a recipe
and if you want to get status, Oh, it's awesome. It's actually had three
configuration files. None of those contain anything that we really care about that
much, but they're going to get this feature to work instantly. Check this out. I want
to move over. Go back to my page refresh and hello web debug toolbar on the Bob. This
is one of the absolute best features of Symfony over here and tells you the status
code.

It tells you which controller and routed matched has information about the tow speed,
the amount of memory used, twig calls, and a lot more. The best part of this is that
you can hover over any of these icons down here. Click well. It was fine here instead
of here, there's tons of information, lots of information about the request itself,
including a bunch of internal things, the response that you returned. But the best
one here is probably performance. We're talking more about this later, but this
actually shows you performance things about what's actually going on in your
application. It's a great place to know how things are slow, but even a better way to
figure out just what's going on behind the scenes. With Symfony, you also have, um,
about twig configuration, uh, caching. Once we get to caching in this section,
there's going to be more and more stuff added to this as we install things like
database queries are going to show up here as soon as we install a database layer.

His profile also gave us a really cool debugging feature called dump. So I'm gonna
click, uh, the link here to kind of go back to my homepage because that changed the
URL. And let's go over here to our source controller question controller. And just to
show you how this works, right in the middle here, I'm going to use dump. That's a
function that was just added after installing the profiler and we can just, it
basically is a replacement for martyrdom. So let's dump the slog in pack. Let's also
know this object itself. When we do that in refresh, awesome. You see it's just like
bar none, but it's super beautiful and it's really good at printing objects. This
object has a container property. We can open that up to see even more properties. Uh,
this is all super low technical stuff, but you can see how useful this is, uh, to get
lots and lots of deep information, print it out very, very nicely. If you're really
lazy, you can also use a DD that's called a dumb and die. I'm refreshing that it also
kills the entire page.

So I'll change that back to dump. And let's dump just the controller. Go over and
refresh. There it is. There's one other library we can install the help with
debugging. It's not quite as important, but it's still interesting that has spin over
and running. Composer require debug and notice I'm not using the dash, dash and dev
flag here. That's because this is going to install a few things. Uh, somebody called
the debug bundle, but also it's going to stall. monolog. monolog is actually a
logging library and we're going to want to have a walking library available during
development but also during production. Now also notice that when we said composer
require debug this and called something installed, installed something called the
debug of pack. It's not the first time we've seen a library called a pack. It's the
first time we've talked about it. A pack is a special concept in Symfony that's sort
of a fake package whose only job is to help you grab a bunch of packages at once. So
check this out. I'm going to copy this package name will spin over and then I'm going
to go and get home.com/Symfony/debug pack and you can see reality. The depo pack is
nothing more than a license and a composer. That JSON file, it's really just a
composer file and its only job is to help you require other packages. So it was a
really easy way for us to get this debug bundle, this monolog bundle and a couple of
other packages.

So thanks this. We now have two major things in our application. The first thing is
we now have logging, so if I refresh this page and click in the profiler, I can go to
the logs here and there are logs being saved behind the scenes. These are also all
being saved to a VAR log and dev dot log file. So Hey, we have logging. The second
thing, and you may have noticed it already, is that [inaudible] when I go to my page,
my dump is gone. This added some extra dump can dump integration where now if you
simply dump a variable without dying, it actually gets down here inside the web.
Debug Tobruk two of art and you can click this to get into the profile. Not that
important, but you can see how adding that new library kind of integrated this better
into Symfony. There's also a really cool feature inside of Symfony, um, called the
server dump.

What you can do here is if you want, you can actually have the variables dumped into
your command line and said, so you can say Ben, you can say PHP bin console server
dump and that cop actually starts to sort of like fake little web server in the
background and then automatically going to be refreshed over here. You can still see
your dumped down here on the bottom but also gets dumped out right here so you can
actually dump from anywhere in your code and then have this nice central spot even if
it's something that's getting dumped away in the background and Ajax call or
something like that and gets dumped right here. It's not that boring. It's super
useful in some cases. I wanted to point it out. I'll hit control C to stop that. The
last thing I want to talk about is again with these packs, so if you opened your
composure that is on file because we just installed, we just installed the Symfony
debug pack and he sees on version 1.0 the problem with PAX is that it doesn't allow
you to control the ver the underlying versions of the packages very well.

You just sort of gets whatever version of the packages are allowed in. Here is what
you get. So if you want to control these package versions a little bit better, you
can do that by use. You can do that by saying composer unpack Symfony /debug pack,
unpack as a command that's added by Symfony flex and super simple. It actually
removes the debug pack and instead adds all of the underlying packages here
automatically. So an out at a debug bundle. You can see the monolog model down here.
It just added all of those things for you.

And in this case, because the profiler pack we installed earlier is actually a
dependency in this. We know how the profiler pack kind of up here and also down
there. So we don't need that. I'm just going to move it from up there and keep down
there and required dev. So PACS are really, uh, kind of a simple way to get a lot of
packages at once for something. We'll use them all the time and if you need, and I
don't usually do it immediately, but if you ever need to control the package versions
more specifically, you can use that handy unpack command. So this was a long way of
saying that by installing two packages, we now have all whole giant set of beautiful
debugging tools for our application.

