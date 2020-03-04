# Service Objects

Symfony is really two parts... and we've already learned *one* of them.

The first part is the route and controller system. And I hope you're feeling
pretty comfortable: create a route, it executes a controller function, we return
a response.

The *second* half of Symfony is all about the many "useful objects" that are
floating around inside Symfony. For example, when we render a template, what
we're *actually* doing is taking advantage of a twig object and asking it to render.
The `render()` method is just a shortcut to use that object. There is also
a logger object, a cache object and many more, like a database connection object
and an object that helps make HTTP requests to other APIs.

Basically... *every single thing* that Symfony does - or that *we* do - is
*actually* done by one of these useful objects. Heck, even the *router* is an
object that figures out which route matches the current request.

In the Symfony world - well, really, in the object-oriented programming world -
these "objects that do work" are given a special name: services. But don't let
that confuse you: when you hear "service", just think:

> Hey! That's an object that does some work - like a logger object or a database
> object that makes queries.

## Listing All Services

Inside `CommentController`, let's log something. To do that work, we need the
"logger" service. How can we get it?

Find your terminal and run:

```terminal
php bin/console debug:autowiring
```

Say hello to one of the *most* important `bin/console` commands. This gives us
a list of *all* the service objects in our app. Well, ok, this isn't *all* of
them: but it *is* a full list of all the services that you are *likely* to need.

Even in our small app, there's a lot of stuff in here: there's something called
`Psr\Log\LoggerInterface`, there's stuff for caching and plenty more. As we
install more bundles, this list will grow. More services, means more tools.

To find which service allows us to "log" things, run:

```terminal
php bin/console debug:autowiring log
```

This returns a *bunch* of things... but ignore all of these down here for now
and focus on the top line. This tells us that there is a logger service
object and its class implements some `Psr\Log\LoggerInterface`. Why is that
important? Because if you want the logger service, you *ask* for it by using
this type-hint. It's called "autowiring".

## Autowiring the Logger Service

Here's how you get a service from inside a controller. Add a third argument to
your method - though the argument order doesn't matter. Say `LoggerInterface` -
auto-complete the one from `Psr\Log\LoggerInterface` - and `$logger`.

This added a `use` statement above the class for `Psr\Log\LoggerInterface`,
which *matches* the type-hint that `debug:autowiring` told us to use. Thanks
to this type-hint, when Symfony renders our controller, it will know that we
want the logger service to be passed to this argument.

So... yea: there are now *two* types of arguments that you can add to your
controller method. First, you can have an argument whose *name* matches a wildcard
in your route. And second, you can have an argument whose *type-hint* matches one
of the class or interface names listed in `debug:autowiring`. `CacheInterface`
is another type-hint we could use to get a *caching* service.

## Using the Logger Service

So... let's use this object! What methods can we call on it? I have no idea!
But because we properly type-hinted the argument, we can say `$logger->` and
PhpStorm tells us *exactly* what methods it has. Let's use `$logger->info()`
to say "Voting up!". Copy that and say "Voting down!" on the else.

Testing time! Refresh the page and... let's click up, down, up. It... at least
doesn't look *broken*.

Hover over the AJAX part of the web debug toolbar and open the profiler for one
of these requests. The profiler has a "Logs" section , which is the *easiest* way
to see the log entries for a single request. There it is! "Voting up!". You could
also find this in the `var/log/dev.log` file.

The point is: Symfony has many, *many* useful objects, I mean "services". And
little-by-little, we're going to start using more of them... each time by adding
a *type-hint* to tell Symfony which service we need.

## Autowiring & Using the Twig Service

Let's look at one other example. The *first* service that we used in our code was
the *Twig* service. We used it... kind of "indirectly" by saying `$this->render()`.
In reality, that method is a shortcut to use the Twig *service* behind the scenes.
And that should *not* surprise you. Like I said, *everything* that's done
in Symfony is *actually* done by a service.

As a challenge, let's pretend that the `render()` function doesn't exist. Gasp!
In the `homepage()` controller, comment-out the `render()` line.

So... how can we use the Twig service directly to render a template? I don't
know! We could *definitely* find some documentation about this... but let's
see if we can figure it out by ourselves with the help of the `debug:autowiring`
command:

```terminal
php bin/console debug:autowiring twig
```

And, voilà! There is apparently a class called `Twig\Environment` that we can
use as a "type-hint" to get a Twig service. In our controller, add `Environment`
and hit tab to add the `use` statement on top. I'll call the argument
`$twigEnvironment`.

Inside, add `$html = $twigEnvironment->`. Once again, without reading *any*
documentation, thanks to the fact that we're coding responsibly and using
type-hints, PhpStorm shows us *all* the methods on this class. Hey! This `render()`
method looks like it might be what we need! Pass the same template name as
before.

When you use twig directly, instead of returning a Response object, it
returns a *string* with the HTML. No problem: finish with
`return new Response()` - the one from `HttpFoundation` - and pass `$html`.

This is now doing the *exact* same thing as `$this->render()`. To prove it, click
the homepage link. It still works.

Now in reality, other than being a "great exercise" to understand services, there's
no reason to do this the *long* way. I just want you to understand that services are
*really* the "things" doing the work behind the scenes. And if you want to do
something - like log or render a template - what you *really* need is to find out
which *service* does that work. Trust me, *this* is the key to unlocking your
full potential in Symfony.

Let's put the old, shorter code back, and comment out the longer example.

Ok, you've *almost* made it through the first Symfony tutorial. You rock!
As a reward, we're going to finish with something fun: an introduction into a
system called Webpack Encore that will allow you to do *crazy* things with
your CSS and JavaScript.
