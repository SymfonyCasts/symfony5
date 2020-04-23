# Bundles!

Hey friends! Welcome to Symfony 5 Fundamentals! I *cannot* emphasize enough,
how *important* this course is to make you *super* productive in Symfony. And, well,
I *also* think you're going to love it. Because we're going to *really* explore how
your app works: services, configuration, environment, environment variables and
more! These will be the tools that you'll need for *everything* else that you'll do
in Symfony. After putting some work in now, anything else you build will feel
*much* easier.

Ok! Let's go unlock some potential! The *best* way to do that - of course - is to
download the course code from this page and code along with me. If you followed
our first course, you rock! The code is basically where that course finished. But I
recommend downloading the *new* code because I *did* make a few small tweaks.

After you unzip the download, you'll find a `start/` directory with the same code
that you see here. Head down to the fancy `README.md` for all the instructions on
how you get your project set up... *and*, of course, a poem about magic.

The last step in the setup will be to find a terminal, move into the project and
use the `symfony` executable to start a handy development web server. If you
don't have this `symfony` binary, you can download it at https://symfony.com/download.
I'll run:

```terminal
symfony serve -d
```

to start a web server at `localhost:8000`. The `-d` means run as a "daemon" - a
fancy way of saying that this runs in the background and I can keep using my
terminal. You can run `symfony server:stop` later to stop it.

Ok! Spin over to your browser and go to https://localhost:8000 to see... Cauldron
Overflow! Our question & answer site dedicated to Witches and Wizards. It's a
*totally* untapped market.

## Services do Everything

One of the things we learned at the end of the first course is that all the work
in a Symfony app - like rendering a template, logging something, executing
database queries, making API calls - *everything* is done by one of many useful
objects floating around. We call these objects *services*. There's a router
service, logger service, service for rendering Twig templates and many more.
Simply put, a service is a fancy word for an object that does work.

And because services do work, they're *tools*! If you know how to get access to
these objects, then you're very powerful. How *do* we access them? The primary way
is by something called autowiring. Open up `src/Controller/QuestionController.php`
and find the `homepage()` method:

[[[ code('e976b4bd7f') ]]]

We commented out the code that used it, but by adding an argument type-hinted
with `Environment`, we signaled to Symfony that we wanted it to pass us
the Twig service object:

[[[ code('1c2a3e4bbb') ]]]

That's called autowiring.

And how did we know to use this exact `Environment` type hint to get the Twig service?
And what *other* service objects are floating around waiting for us to use them
and claim ultimate programming glory? Find your terminal and run:

```terminal
php bin/console debug:autowiring
```

Boom! *This* is our guide. Near the bottom, it says that if you type-hint a
controller argument with `Twig\Environment`, it will give us the Twig service.
Another one is `CacheInterface`: use that type-hint to get a useful caching object.
This is your *menu* of what service objects are available and what type-hint to
use in a controller argument to get them.

## Hello Bundles!

But where do these services come from? Like, who added these to the system? The
answer to that is... *bundles*. Back in your editor, open a new file:
`config/bundles.php`:

[[[ code('b722ef1127') ]]]

We'll see who uses this file later, but it returns an array with 8 class names
that all have the word "Bundle" in them.

Ok, first, whenever you install one of these "bundle" things, the Flex recipe system
automatically updates this file *for* you and adds the new bundle. For example, in
the first course, when we installed this `WebpackEncoreBundle`, its recipe added
this line:

[[[ code('75c57feca9') ]]]

The point is, this is *not* a file that you *normally* need to think about.

But... what *is* a bundle? Very simply: bundles are Symfony *plugins*. They're
PHP libraries with special integration with Symfony.

And, the *main* reason that you add a bundle to your app is because bundles give you
services! In fact, *every* single service that you see in the `debug:autowiring`
list comes from one of these eight bundles. You can kind of guess that the
`Twig\Environment` service down here comes from `TwigBundle`:

[[[ code('9f3885687b') ]]]

So if I removed that `TwigBundle` line and ran the command again, the Twig service
would be gone.

And yes, bundles can give you other things like routes, controllers, translations
and more. But the *main* point of a bundle is that it gives you more services,
more *tools*.

Need a new tool in your app to... talk to an API or parse Markdown into HTML? If
you can find a bundle that does that, you get that tool for free.

In fact, let's do *exactly* that next.
