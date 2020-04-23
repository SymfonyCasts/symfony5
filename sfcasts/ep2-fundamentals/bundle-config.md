# Configuring Bundles

In the show controller, we're using two services: `MarkdownParserInterface` -
from a bundle we installed - and `CacheInterface` from Symfony itself:

[[[ code('8ae4105c51') ]]]

And... this was pretty easy: add an argument with the right type-hint then...
use the object!

But I'm starting to wonder how can I control the *behavior* of these services?
Like, what if I want Symfony's cache service to store in Redis instead of on the
filesystem? Or maybe there are some options that I can pass to the markdown parser
service to control its features.

Let's `dd($markdownParser)` - that's short for `dump()` and `die()` - to see what
this object looks like:

[[[ code('1907bbada9') ]]]

Move over and refresh. This is apparently an instance of some class called `Max`.
And... inside, there's a `$features` property: it kind of looks like you can
turn certain features on or off. Interesting.

If we *did* want to control one of these feature flags, we can't really do that
right now. Why? Because *we* aren't responsible for creating this object: the
bundle just gives it to us.

## Bundle Configuration

This is a *super* common problem: a bundle wants to give you a service... but
*you* want some control over what options are *passed* to that object when
it's instantiated. To handle this, each bundle allows you to pass
*configuration* to it where you *describe* the different behavior that you want
its services to have.

Let me show you *exactly* what I'm talking about. Open `config/bundles.php`
and copy the `KnpMarkdownBundle` class name:

[[[ code('33116de0d6') ]]]

Now, close this file and find your terminal. We're going to run a special command
that will tell us *exactly* what config we can pass to this bundle. Run:

```terminal
php bin/console config:dump KnpMarkdownBundle
```

Boom! This dumps a bunch of example YAML that describes *all* the config
that can be used to control the services in this bundle. Apparently, there's an
option called parser which has an example value of `markdown.parser.max`... whatever
that means.

Go back to the bundle's documentation and search for `parser` - better, search
for `parser:`. Here we go... it says that we can apparently set this `parser`
key to any of these 5 strings, which turn on or off different features. Copy the
`markdown.parser.light` value: let's see if we can change the config to *this* value.

Look back at the YAML example at the terminal. The way you configure a bundle
is via YAML. Well, you can also use PHP or XML - but *usually* it's done via
YAML. We just need a `knp_markdown` key, a `parser` key below that and `service`
below *that*. But what file should this live in?

Open up the `config/packages/` directory. This is *already* full of files that
are configuring *other* bundles. Create a file called `knp_markdown.yaml`. Inside,
say `knp_markdown:`, enter, go in 4 spaces, then we need `parser:`, go in 4
spaces again and set `service` to `markdown.parser.light`:

[[[ code('7a97071807') ]]]

If you're wondering why I named this file `knp_markdown.yaml`, I did that to match
this first key. But actually... the filename doesn't matter! It's the `knp_markdown`
YAML key that tells Symfony to pass this config to *that* bundle. If we renamed
this to `i_love_harry_potter.yaml`, it would work *exactly* the same.

So... what did this change? Well, find your browser and refresh!

Ah! An error! That was a *genuine* Ryan typo... but I love it!

> Unrecognized option `services` under `knp_markdown.parser`. Did you mean `service`?

Why yes I did! Let me change that:

[[[ code('9a32face77') ]]]

This is one of my *favorite* things about the bundle config system: it's validated.
If you make a typo, it will tell you. That's awesome.

Refresh now. Woh! By changing that little config value, it changed the entire
*class* of the service object!

The point is: bundles gives you services and every bundle gives you different
configuration to help you control the *behavior* of those services. For example,
find your terminal and run:

```terminal
php bin/console config:dump FrameworkBundle
```

`FrameworkBundle` is the *main*, core, Symfony bundle and it gives us the most
*foundational* services, like the cache service. This dumps a *huge* list of
config options: there's a lot here because this bundle provides many services.

Of course, if you *really* needed to configure something, you'll probably Google
and find the config you need. But how cool is it that you can run this command
to see the *full* list of possible config? Let's try another one for TwigBundle,
which we installed in the first course:

```terminal-silent
php bin/console config:dump TwigBundle
```

Hello Twig config! Apparently you can create a global Twig variable by adding
a `globals` key. Oh, and this command *also* works if you use the root key,
like `twig`, as the argument:

```terminal-silent
php bin/console config:dump twig
```

That's the exact same list.

Ok! We *now* know that every bundle gives us configuration that allows us to
control its services.

But I'm curious about this `service` config we used for `knp_markdown`. The docs
told us we could use this `markdown.parser.light` value. But what *is* that string?
Is it just some random string that the bundle decided to use for a "light" parser?
Actually, that string has a bit *more* meaning. Let's talk about the *massively*
important "service container" next.
