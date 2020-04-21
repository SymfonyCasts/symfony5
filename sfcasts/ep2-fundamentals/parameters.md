# Parameters

We know there are lots of useful service objects floating around that, internally,
Symfony keeps them inside something called a container. But this container thing
can *also* hold something *other* than services: it can hold scalar configuration
called *parameter*. You can use these to do some cool stuff.

## debug:container --parameters

Earlier, we learned that you can get a list of *every* service in the container
by running `debug:container`.

```terminal-silent
php bin/console debug:container
```

*Big* giant list. To get a list of the "parameters" in the container, add a
`--parameters` flag:

```terminal-silent
php bin/console debug:container --parameters
```

You can see that there are a *bunch* of them. But most of these aren't very
important - they're values used internally by low-level services. For example,
one parameter is called `kernel.charset`, which is set to `UTF-8`. That's probably
used in various places internally.

## Adding Parameters

The point is: the container can *also* hold scalar config values and it's sometimes
useful to add your *own*. How could we do that?

Go into `config/packages/` and open *any* config file. Let's open `cache.yaml`
because we're going use parameters for a little caching trick. Add a key called
`parameters`. We know that the `framework` key means that the config below it will
be passed to FrameworkBundle. The `parameters` is special: it means that we're
adding parameters to the container. Invent a new one called, how about,
`cache_adapter`. Set it to `cache.adapter.apcu`.

Thanks to this, there *should* be a new parameter in the container called
`cache_adapter`. We're not *using* it anywhere... but it should exist.

## Reading a Parameter in a Controller

How *do* we use it? There are two ways. First, you could read it in a controller.
Open `src/Controller/QuestionController.php` and find the `show()` method. Inside,
we can use a new shortcut method `dump($this->getParameter('cache_adapter'))`.

If we move over and refresh the show page... there it is! The string
`cache.adapter.apcu`.

## Reading Parameters in Config Files

But this is *not* the most common way to use parameters. The *most* common way
is to *reference* them in *config* files. Once a parameter exists, you can *use*
the parameter in *any* config file with a special syntax. Down below in `cache.yaml`,
remove the `cache.adapter.apcu` string and replace it with quotes, then
`%cache_adapter%`.

Let's try it! Move over and refresh. Yes! Things are still working.

The *key* is that when you surround something by `%` signs, Symfony realizes that
you are referencing a *parameter*. These parameters sort of work like variables
inside of config files. Oh, and quotes are *normally* optional in YAML, but they
*are* needed when a string starts with `%`. If you're ever not sure if quotes are
needed around something, just play it safe and add them.

## Overriding a Parameter in Dev

But so far... this isn't *that* interesting: we're basically setting a variable
up here and using it below... which is fine I guess, but not really that useful
yet.

However, we can use parameters to do our "cache adapter override" in a smarter
way. Remember, in `dev/cache.yaml`, we're overriding the `framework.cache.app`
key to be `cache.adapter.filesystem`. Now, instead of overriding that config,
we can override the *parameter*.

Add `parameters:` and then use the same name as the other file: `cache_adapter:`
set to `cache.adapter.filesystem`.

Ok, in the main `cache.yaml`, we're setting the `app` key to the `cache_adapter`
parameter. This is initially set to `apcu`, but we override it in the `dev`
environment to be `filesystem`. This works because the *last* value wins: Symfony
doesn't resolve the `cache_adapter` parameter until *all* the config files have
been loaded.

We can see this in the terminal. Run:

```terminal
php bin/console debug:container --parameters
```

And... yes! The value is `cache.adapter.filesystem`. How would this parameter
look in the `prod` environment? We could change the environment in the `.env`
file and re-run this command. *Or*, we can use a trick: re-run the command
with `--env=prod`. This works for *any* command:

```terminal-silent
php bin/console debug:container --parameters --env=prod
```

*This* time, it's `cache.adapter.apcu`. Oh, and I didn't clear my cache before
running this, but you really *should* do that before doing *anything* in the
`prod` environment.

## Parameters Usually Live in services.yaml

So... those are parameters! Simple config variables to help you kick butt.

But I *do* want to change one thing. By convention, files in the `config/packages`
directory hold bundle configuration - like for  `FrameworkBundle` or `TwigBundle`.
For services and parameters that *we* want to add to the container directly,
there's a different file: `config/services.yaml`.

Copy the parameter from `cache.yaml`, remove it, and paste it here.

Now, *technically*, this makes no difference: Symfony loads the `config/packages`
files and `services.yaml` at the same time: any config can go in any file. But
defining all of your parameters in one spot is nice.

## Creating services_dev.yaml

Of course, you might now be wondering: what about the parameter in
`config/packages/dev/cache.yaml`? Remember: the class that loads these files
is `src/Kernel.php`. It loads all the files in `packages/`, `packages/{environment}`
and then `services.yaml`. Oh, but there is *one* more line: it *also* tries to
load a `services_{environment}.yaml` file. If need to override a parameter or
a service - more on that soon - in the `dev` environment only, this is the key.

Create that file: `services_dev.yaml`. Then copy the config from `dev/cache.yaml`
and paste it here. We can now completely *delete* the old `cache.yaml` file.

That's it! We set the `cache_adapter` parameter in `services.yaml`, override it
in `services_dev.yaml` and reference the final value in `cache.yaml`.

Next, let's leverage a *core* parameter to disable caching in the dev environment.
The trick is: how can we access configuration from inside our `MarkdownHelper`
service?
