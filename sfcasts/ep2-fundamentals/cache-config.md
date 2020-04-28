# Configuring the Cache Service

At your terminal, get a list of *all* the services in the container matching
the word "markdown" by running:

```terminal
php bin/console debug:container markdown
```

Ah, recognize `markdown.parser.light`? *That* was what we used for our `parser` key!
Select "1" and hit enter to get more info. No surprise: its class name is `Light`,
which is the *exact* class that's being dump back in our browser, from our controller.

So, on a high level, by adding the parser config, we were basically telling the
bundle that we want the "main" markdown parser service to be *this* one. In
other words: when we autowire with `MarkdownParserInterface`, please give us
`markdown.parser.light`.

## Figuring out how to Configure the Cache

Anyways, one of our initial goals was to figure out how we could change the
cache service to *stop* caching on the filesystem and instead cache somewhere
else. In our controller, replace the `dd()` with `dump($cache)`:

[[[ code('6046e3c670') ]]]

I'm using `dump()` so that the page still renders - it'll make things easier.

Now, move over, refresh and... interesting. The cache object is an instance of
`TraceableAdapter` but inside it... ah, there's something called `FilesystemAdapter`.
So that kind of proves that the cache is being stored *somewhere* on the filesystem.

Ok, so how can we control that? In reality... you'll probably just Google that
to find what config you need. But let's see if we can figure this out ourselves.
But, hmm, we don't really know which *bundle* this service comes from.

Open up `config/bundles.php`. When we started the project, the *only* bundle here
was `FrameworkBundle` - the core Symfony bundle:

[[[ code('1a8810585b') ]]]

*Every* other bundle was installed by us. And... since I don't really see any
"CacheBundle", it's a good guess that the cache service comes from `FrameworkBundle`.

Let's test that theory! Find your terminal, pet your cat, and run:

```terminal
php bin/console config:dump FrameworkBundle
```

Search this *giant* config for `cache`... I'm looking to see if there is maybe
a `cache` section. Here it is! Under `framework`, this bundle has a sub-key
called `cache` with quite a lot of example config. Because this is a bit hard
to read, re-run this command with `FrameworkBundle cache`.

```terminal-silent
php bin/console config:dump FrameworkBundle cache
```

This *only* shows the `cache` section beneath `framework`.

So... this give us *some* nice information: we can see a key called `app`
set to `cache.adapter.filesystem`... that *kind* of looks like something we
might want to tweak... but I'm not sure... and I don't know what I would change
it *to*.

So this is *helpful*... but not *that* helpful.

## The debug:config Command

Another way that you can look at bundle configuration is to pass the *exact*
same arguments to another command called `debug:config`:

```terminal-silent
php bin/console debug:config FrameworkBundle cache
```

The difference is subtle: `config:dump` shows you *examples* of all possible
config whereas `debug:config` shows you *your* real, current values. Let's rerun
this without the `cache` argument to see *all* our `FrameworkBundle` config:

```terminal-silent
php bin/console debug:config FrameworkBundle
```

Seeing our real values is cool... and we can see that under `cache`, the `app`
key *is* set to `cache.adapter.filesystem`. But... we still don't really know
what config we should change... or what to change it to!

## Changing the Cache Adapter to APCu

Let's go see if the config file for this bundle can help. Logically, because we're
configuring the `framework` key, open up `config/packages/framework.yaml`:

[[[ code('ba9e846a80') ]]]

Huh, I don't see a `cache` key! And it's *possible* that there *is* no `cache`
key in our config and that the values *we* saw were the bundle's defaults. But
actually, we *do* have some `cache` config... it's just hiding in its own file:
`cache.yaml`. Inside, it has `framework` then `cache`:

[[[ code('3d5dea7f15') ]]]

It's not very common for a bundle's config to be separated into two files like
this, but it *is* totally legal. Remember: the names of these files are *not*
important at all. The cache config was separated because it's complicated enough
to have its own file.

*Anyways*, this file is *full* of useful comments: it tells us how we could use
Redis for cache *or* how we could use APCu, which is a simple in-memory cache.
Let's use that: uncomment the `cache.adapter.apcu` line:

[[[ code('aff30bd918') ]]]

Before we even *try* that, find your terminal and run the `debug:config` command
again:

```terminal-silent
php bin/console debug:config FrameworkBundle
```

Scroll up to the `cache` section: yes! This sees our new config! But... what
difference does that make in our app? Find your browser, refresh, then
hover over the target icon on the web debug toolbar to see the dump. *This* time
the adapter object inside is `ApcuAdapter`! It's caching in memory! We made
one little tweak and FrameworkBundle did all the heavy lifting to change the
behavior of that service.

Oh, and if you get the error:

> APCu is not enabled

It means you need to install the APCu extension. *How* you do that varies on
each system but it's *usually* installed with `pecl` - like:

```terminal
pecl install apcu
```

After you install it, make sure to restart your web server. You can do that by
running

```terminal
symfony server:stop
```

And then re-run the command to start the server:

```terminal-silent
symfony server:start
```

If installing this is causing you problems, don't worry about it. For example
purposes, you can use the key `cache.adapter.array` instead. That's a service
that actually does *no* caching, but it will allow you to see how the class changes.

Next, we've started to modify files in this `config/packages/` directory.
Now I want to talk more about the structure of this directory - *specifically* about
Symfony *environments*, which will explain these `dev/`, `prod/` and `test/`
sub-folders.
