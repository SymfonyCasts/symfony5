# Services

Coming soon...

Somebody is really two different pieces and we've already learned one of those
pieces. The first piece is the route and controller system and I hope you're feeling
pretty comfortable that you create a route. It executes the controller. We returned a
response done the whole second half of Symfony, which will really be the topic of the
next tutorial is all about these many, many useful optional objects that are floating
around that you can use. For example, an example when we render a template, what
we're actually doing is taking advantage of a twig object and asking it to render.
The `render()` method is just a shortcut to use the twig object. There is also an object.
There's a logger object, there's a cache object. And as we keep going, eventually
there will be a database connection object, maybe an object helps us make um, HTTP
calls to external API.

Basically every single thing that Symfony does or that we do is going to be done by
one of these useful objects and Symfony or really object oriented programming gives
these useful objects a name, they're called services. So whenever you hear me talk
about a service, just think that's an object that does some work, like a logger log,
something, a database connection makes a database query. Twig renders twin templates.
So let's see. Let's, let's try to use it. So I'll say that inside of our common
controller, I want to log something. If I would have logged something that needs
means that I need the logger service, how do I get it? Well, fighting terminal and
run bin console. And we're going to run a new `bin/console` command, one of the most
important `bin/console` commands called `debug:autowiring`. 

```terminal-silent
php bin/console debug:autowiring
```

This gives us a list of all of these services instead of Symfony that we can get very, 
very easily to do work for us.

And there's a lot of stuff in here immediately you can see there's something called
`Psr\Log\LoggerInterface`. There's also things inside of here for caching and various
other things. And as we install more bundles and do more stuff, there's going to be
more and more stuff inside of this list. So we just have a lager, but I'm actually
gonna run the SIG event again. `debug:autowiring log` 

```terminal-silent
php bin/console debug:autowiring log
```

and this will filter things down
for lager. Now I noticed there's actually multiple interests here for logger. You can
ignore all these ones down here or you really want to see here is that there's one
called, what's it's telling us here is that there's an interface called 
`Psr\Log\LoggerInterface`. This is the key thing because the way that you get services inside of
Symfony is that you asked for them via a type hint, so you're, here's how you do it
in a controller.

We're going to add a third argument here though it could be the first argument or the
second argument, it makes no difference and I'm the type `LoggerInterface`. Make sure I
get the one from `Psr\Log\LoggerInterface` and then say `$logger`. So just to make sure
you knew what happened. That added a new use statement up here for `Psr\Log\LoggerInterface`
which mass it matches the type hint that `debug:autowiring` gave me.
Thanks. At this type end. When Symfony renders our controller, it's going to know to
pass us the logger service. So there are now two types of arguments you can have.
It's your controller. You can have an argument which matches a wild card, or you can
have an argument which has a type hint of one of the services that you, that is
listed inside of `debug:autowiring`. Like for example, cache interface is another one.

So let's use this. We don't even, the great thing about the type in here is because
we have this type typing, we're coding properly, which means I don't even know what
methods are on the lager, but I can just guess I can say `->` and it's going to give me
an auto complete of all the methods that are onsite of the logger. So let's just say
`$logger->info()` and I'll say voting up a, copy that down here and we'll say voting down.
All right, so let's try this. I'm gonna refresh the page and let's say up, down, up,
doesn't matter. And it's keeping track of the agent's calls down here. So I'm going
to load this one up in a new tab and this is just a really easy way to see all the
logs for that request. So if I go to logs over here and there we go. Voting up. And
this also is getting dumped into a `var/log/dev.log` file.

So the point is Symfony has many, many useful objects and little by little we're
going to start asking for more and more of them via their type it. I'll show you one
other example. The one service that we've already used before this video was the
tweak service. We used it kind of indirectly, we just said `$this->render()`, but in
reality that's using the twigs service behind the scenes. It uses it to render the
template. It then takes that HTML and puts it into a response. So just the challenge,
let's pretend that the render function doesn't exist. We'll do it up here on the
homepage controller. I'm going to comment this out. How could we use twig directly to
render the controller to render a template? Well, let's just find out. I'm going to
go back over here to my terminal run, 

```terminal
php bin/console debug:autowiring twig
```
and lo and behold, apparently there's a class called `Twig\Environment` that we can type into
to get that service. So over here I'll add `Environment`, hit tab that had a view
statement on top, and I'll say `$twigEnvironment`.

Instead of here I'll say `$html = $twigEnvironment`. And once again, I'm not even
reading the documentation, I'm just going to use the type hint and it looks like
there's a method on there called `render()`. I'm going to guess that that's what we want.
And then inside of here, I'll copy the same template name as before. Now when you use
twig directly like this, when you use render, it doesn't put it into Response object.
It just gives you back the string HTML. So now we can say return `new Response()`, the
one from `HttpFoundation` and pass the `$html` in right there. And this is now doing the
exact same thing as the render call. So if I go over here, click the homepage, it
still works. Now in reality, you shouldn't do it this longer way because why do we
want to do more work than is possible?

This is just a fun example using the tweak service directly and if you understand
that, if you understand that services are really the ones doing the work behind the
scenes, this kind of knowledge is going to become very, very useful because someday
you're going to find yourself somewhere that's not in a controller somewhere where
there is no render function and you're going to need your render a template. If you
understand that the twig services the key, you're going to be able to do that and
it's okay if you don't understand what I'm talking about right now. We're going to
see that in future tutorials. So for now I'm gonna put the old return back and
comment out this code up here because of course we're going to do it in a nice,
simple and lazy way. All right, friends, now that we've seen that sneak peek into the
most fundamental part of Symfony, the service system, let's do one last optional
thing. I'm going to refactor our CSS and JavaScript into a more robust system called
a Webpack Encore so that we can really do some nice front end things.

