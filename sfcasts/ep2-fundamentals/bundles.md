# Bundles

Coming soon...

Hey friends, welcome to Symfony five at fundamentals. I cannot stress to you how
important this course is and honestly I think how much you're going to love it
because we're really going to be talking about how features inside Symfony actually
work, how services work, how configuration works, how environments work. These are
going to be all the tools that you're going to use for everything else that you do in
Symfony. Everything else is going to be easier after you invest a little bit of time
going through this course and figuring this stuff out. So I hope you're as excited
about I am because you were about to unlock some serious potential. As always, if you
want to kick the most button Symfony, download the course code from this page and
code along with me. After you unzip the course code, you'll find a `start/` directory
with the same code that CU that you see here. Head down to this fancy. `README.md`
file for all the details on how to get the project up and running.

The last step will be to find a terminal, move into the project and use the `symfony` a
executable to start a nice handy built in web server. So I'm gonna run it 

```terminal
symfony serve -d
```

and I usually run with that `-d` option, which means run as a Damon. So
that's going to start a server in the background at `localhost:8000` and it's
going to give me my terminal back. You can run `symfony server:stop`
later if you actually want to stop that, but I'll just leave that for now.

now I can spit over and go to `localhost:8000` to see cauldron overflow are
specialized stack overflow specifically for witches and wizards because somebody else
already built stack overflow. And the first course in this series, we already have
the quite a bit of work with Twig and other things. Now, one of the things we
learned at the end of the first course is that everything is Symfony's done with a
service. So the routing layers, um, it's done by a useful object. So everything is
Symfony routing, rendering a template, logging something, making database queries,
making API calls, everything, every piece of work that you do. And Symfony is done by
a useful object called a service. So there's a logger service and there is eight
router service and there's a service for rendering templates

and these services are just floating around in Symfony and if you know how to get
them then you're very, very powerful because services are tools. The way we get
services is primarily by something called autowiring. So we've got a
`src/Controller/QuestionController.php` right here. This is the homepage controller and you
can see we commented it out, but we actually type hinted an argument with `Environment`
and that was a signal to Symfony to pass us the twig environment service, which is
the twig rendering service. And then I had an example down here of how you could use
that to render a template. Better examples probably Nope.

And how can I figure out how did we know to use this `Environment` type hint and what
other services are floating around? We learned that there's a very handy the 

```terminal
php bin/console debug:autowiring
```

command that we can run to list all of the services
available. And it's actually not all of the services, but it's all the most common
ones that you're going to need to worry about. So for example, I'm here near the
bottom. You can see that if you type in an argument of `Twig\Environment`, it gives
you this twig service. There's also other things that we're going to use in this like
a `CacheInterface` tip, face tip height if you need a cache object. So these are the
lists of the useful objects floating around and these are the type hints that you can
use to indicate a Symfony that that's the service that you want.

But where do these services come from? Like who added these to the system, where they
configure what? Where does it say that there's a `CacheInterface` service that I can
get? The answer to that is bundles. So if you go over your project and go to a
config, open a `config/bundles.php` file, this file just returns off a simple
array. But you can see that an inter returns about one, two, three, four returns by
eight bundles. There's two important things I want to say about this. First, bundles
are first when you install a bundle, the the S the flex recipe system automatically
update this file for you. So this is not normally a file that you need to worry
about. But if you install a new bundle like last time we installed this 
`WebpackEncoreBundle`, it's recipe automatically added this line here, this initializes the
bundle. Second bundles are Symfony plugins, plain and simple. They are Symfony
plugins

and the main reason that you install a bundle is because bundles give you more
services and services are tools. In fact, every single service that you see over here
on this list came from one of these eight bundles. So we can kind of guess that the
`Twig\Environment` service down here came from the `TwigBundle`. So if I remove that
line right here and ran that command again, that twig service would be gone. And yes,
bundles can give you other things that bundles can give you routes and controllers
and translations and other things. But the main point of a bundle is that it gives
you more services, more tools in your application. Want more tools to do something in
your app. If you need a new tool to do something in your app that you don't have, one
of the ways you can do that is by installing a new bundle that gives you that tool.
We're going to do that next by installing a library that'll allow us to parse
markdown. That's next.

