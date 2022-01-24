# Environments

Your app - the PHP code you write - is a machine: it does whatever
interesting thing you told it to do. But that doesn't mean your machine always
has the same behavior: by giving that machine different config, you can make it
work in different ways. For example, during development, you probably want
your app to display errors and your logger to log *all* messages. But on
production, you'll probably want to pass configuration to your app that tells
it to *hide* exception messages and to only write *errors* to your log file.

To help with this, Symfony has a powerful concept called "environments". This has
nothing to do with *server* environments - like your "production environment"
or "staging environment". In Symfony, an environment is a set of configuration.
And by default, there are two environments: `dev` - the set of config that logs
everything and shows the big exception page - and `prod`, which is optimized for
speed and hides error messages.

And we can *see* these environments in action! Open up `public/index.php`:

[[[ code('a719ddbee8') ]]]

This is your "front controller": a fancy way of saying that it's the file
that's always executed first by your web server.

## Where the Environment String is Set

If you scroll down a bit - most things aren't too important - this eventually
instantiates an object called `Kernel` and passes it `$_SERVER['APP_ENV']`:

[[[ code('9892d60aaf') ]]]

That `APP_ENV` thing is configured in another file - `.env` - at the root of your
project:

[[[ code('b62f5c244b') ]]]

There it is: `APP_ENV=dev`:

[[[ code('a10484856f') ]]]

So right now, *we* are running our app in the `dev` environment. By the way,
this entire file is a way to define *environment variables*. Despite the similar
name, environment variables are a *different* concept than *Symfony* environments...
and we'll talk about them later.

Right now, the important thing to understand is that when this `Kernel` class is
instantiated, we're currently passing the string `dev` as its first argument:

[[[ code('4cf2c7db52') ]]]

If you want to execute your app in the `prod` environment, you would change
the value in `.env`:

[[[ code('51fe2fc820') ]]]

We'll do *exactly* that in a few minutes.

## Kernel: How Environments Affect things

*Anyways*, this `Kernel` class is actually *not* some core class hiding deep in
Symfony. Nope! It lives in *our* app: `src/Kernel.php`. Open that up:

[[[ code('61ecc67579') ]]]

The `Kernel` is the *heart* of your application. Well, you won't need to look
at it often... or write code in it... maybe ever, but it *is* responsible for
initializing and tying everything together.

What does that mean? You can kind of think of a Symfony app as just 3 parts.
First, Symfony needs to know what bundles are in the app. That's the job of
`registerBundles()`:

[[[ code('dc8770e4b2') ]]]

Then, it needs to know what config to *pass* to those bundles to help them
configure their services. That's the job of `configureContainer()`:

[[[ code('ebfd960951') ]]]

And *finally*, it needs to get a list of all the routes in your app.
That's the job of `configureRoutes()`:

[[[ code('01d9844622') ]]]

By the way, if you start a Symfony 5.1 app, you probably won't see a
`registerBundles()` method. That's because it was moved into a core trait, but
it has the *exact* logic that you see here.

## registerBundles()

Back up in `registerBundles()`, the flag that we passed to `Kernel` - the `dev`
string - eventually becomes the property `$this->environment`:

[[[ code('59fd757c40') ]]]

This methods uses that. Open up `config/bundles.php`:

[[[ code('cffc49a8d3') ]]]

Notice that all of the bundles classes are set to an array, like `'all' => true`
or some have `'dev' => true` and `'test' => true`. This is declaring which
*environments* that bundle should be enabled in. *Most* bundles will be enabled
in *all* environments. But some - like `DebugBundle` or `WebProfilerBundle` - are
tools for development. And so, they are *only* enabled in the `dev` environment.
Oh, and there is *also* a third environment called `test`, which is used if you
write automated tests.

Over in `registerBundles()`, this loops over the bundles and *uses* that info
to figure out if that bundle should be enabled in the current environment or not:

[[[ code('c981470c75') ]]]

*This* is why the web debug toolbar & profiler won't show up in the `prod`
environment: the bundle that powers those isn't enabled in `prod`!

## configureContainer: Environment-Specific Config Files

Anyways, bundles give us *services* and, as we've learned, *we* need the ability
to pass config *to* those bundles to *control* those services. That's the job
of `configureContainer()`:

[[[ code('3e068aa54b') ]]]

I *love* this method. It's completely responsible for loading *all* the config
files inside the `config/` directory. Skip past the first 4 lines, if you
have them, which set a few low-level flags.

The *real* magic is this `$loader->load()` stuff, which in a Symfony 5.1 app
will look like `$container->import()`... but it works the same.
This code does one simple thing: loads config files. The first line loads all
files in the `config/packages/` directory. That `self::CONFIG_EXTS` thing refers
to a constant that tells Symfony to load any files ending in `.php`, `.xml`,
`.yaml`, `.yml`. Most people use YAML config, but you can also use XML or PHP.

*Anyways*, *this* is the line that loads all the YAML files inside `config/packages`.
I mentioned earlier that the *names* of these files aren't important. For example,
this file is called `cache.yaml` even though it's technically configuring the
`framework` bundle:

[[[ code('db17cb2f50') ]]]

This shows why:

[[[ code('43cab63632') ]]]

Symfony loads *all* of the files - regardless of their name - and internally
creates one giant, array of configuration. Heck, we could combine *all* the YAML
files into one *big* file and everything would work fine.

But what I *really* want you to see is the *next* line. This says: load everything
from the `config/packages/` "environment" directory:

[[[ code('66b23cd0ec') ]]]

Because we're in the `dev` environment, it's loading the 4 files in
`config/packages/dev`. This allows us to *override* configuration in *specific*
environments!

For example, in the `prod/` directory, open the `routing.yaml` file. This
configures the router and sets a `strict_requirements` key to `null`:

[[[ code('1a6643fbab') ]]]

It's not really important *what* this does. What *is* important is that the
*default* value for this is `true`, but a better value for production is `null`.
This override accomplishes that. I'll close that file.

So this *whole* idea of environments is, ultimately, nothing more than a configuration
trick: Symfony loads everything from `config/packages` and *then* loads the files
in the environment subdirectory... which lets us override the original values.

Oh, these last two lines load `services.yaml` and `services_{environment}.yaml`:

[[[ code('2832f552b0') ]]]

That's where we add our *own* services to the container and we'll talk about them
soon.

## configureRoutes()

Ok, we've now initialized our bundles and loaded config. The *last* job of
`Kernel` is to figure out what routes our app needs. Look down
at `configureRoutes()`:

[[[ code('6eed15f550') ]]]

Ah, it does... pretty much the exact same thing as `configureContainer()`:
it loads all the files from `config/routes` - which is just one `annotations.yaml`
file - and *then* loads any extra files in `config/routes/{environment}`.

Let's look at one of these: `config/routes/dev/web_profiler.yaml`:

[[[ code('32e429b287') ]]]

*This* is what's responsible for importing the web debug toolbar and profiler
routes into our app! At your terminal, run:

```terminal
php bin/console debug:router
```

Yep! These `/_wdt` and `/_profiler` routes are here thanks to that file. This
is *another* reason why the web debug toolbar & profiler won't be available in
the `prod` environment.

Next, let's *change* environments: from `dev` to `prod` and see the difference.
We're also going to use our new environment knowledge to *change* the cache
configuration *only* in the `prod` environment.
