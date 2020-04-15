# Bundles!

Hey friends! Welcome to Symfony 5 Fundamentals. I *cannot* emphasize enough,
how *important* this course if you want to be productive in Symfony. And, well,
I think you're also going to love it because we're going to *really* explore how
your app works: services, configuration, environment, environment variables! These
are the tools that you'll need for *anything* else that you'll do in Symfony.
After putting in some work now, everything else is going to feel *much* easier.

Ok! Let's go unlock some potential! The *best* way to do that - of course - is to
download the course code from this page and code a long with me. If you followed
our first course, the code is basically where that course finished. But I
recommend downloading the new code because I *do* make a few small tweaks.

After you unzip the download, you'll find a `start/` directory with the same code
that you see here. Head down to the fancy `README.md` for all the instructions on
how you get your project set up... *and*, of course, a poem about magic.

The last step in the setup will be to find a terminal, move into the project and
use the `symfony` executable to start a nice handy built in web server. If you
don't have this `symfony` command, you can download it at https://ymfony.com/download.
I'll run:

```terminal
symfony serve -d
```

To start a web server at `localhost:8000`. The `-d` means run as a "daemon" - a
fancy way of saying that this runs in the background and I can keep typing at my
terminal. You can run `symfony server:stop` later to stop it.

Ok! Spin over to your browser and go to https://localhost:8000 to see... Cauldron
Overflow! Our question & answer site dedicated to Witches and Wizards.

## Services do Everything

One of the things we learned at the end of the first course is that all the work
in a Symfony app - like executing the routing, rendering a template, logging
something, executing database queries, making API calls - everything is done by
one of many useful objects floating around. We call these objects services. There's
a router service, logger service, service for rendering Twig templates and many more.

Because services do work, they're *tools*: if you know how to get access to them,
then you're very, very powerful. How *do* we access them? The primary way is by
something called autowiring. Open up `src/Controller/QuestionController.php` and
find the `homepage()` method. We commented out the code that used it, but by adding
an argument type-hinted with `Environment`, we signaled to Symfony that we wanted
it to pass us the Twig service object.

And how did we know to use this exact `Environment` type hint to get the Twig service?
And what *other* service objects are floating around waiting for us to use them?
Find your terminal. We learned *all* of that by running a very handy command:

```terminal
php bin/console debug:autowiring
```

Boom! *This* is our guide. Near the bottom, this says that if you type-hint a
controller argument with `Twig\Environment`, it will give us the Twig service.
Another one is `CacheInterface`: use that type-hint to get a useful caching object.
This is your *menu* of what service objects are available and what type-hint to
use in a controller argument to get them.

## Hello Bundles!

But where do these services come from? Like, who added these to the system? The
answer to that is... *bundles*. Back in your editor, open up a new file:
`config/bundles.php`. We'll see who uses this file later, but this returns an array
with 8 class names that all have the word "Bundle" in them.

First, whenever you install one of these "bundle" things, the Flex recipe system
automatically updates this file for you and adds the new bundle. For example, in
the first course, we installed this `WebpackEncoreBundle` and its recipe added
this line. The point is, this is *not* a file that you need to normally even
*think* about.

But... what *is* a bundle? Very simply: bundles are Symfony *plugins*. They're
PHP libraries with special integration with Symfony.

And, the *main* reason that you install a bundle is because bundles give you
services! And services are tools. In fact, *every* single service that you see in
the `debug:autowiring` list comes from one of these eight bundles. You can kind of
guess that the `Twig\Environment` service down here comes from `TwigBundle`. So if
I removed that `TwigBundle` line and ran that command again, the Twig service would
be gone.

And yes, bundles can give you other things like routes, controllers, translations
and more. But the *main* point of a bundle is that it gives you more services.

Need a new tool in your app to talk to an API or parse Markdown into HTML? If you
can find a bundle that does that, you can get that tool for free.

In fact, let's do *exactly* that next.
