# Configuring the Cache Service

This is
a list of all the services Nicotiana that are auto wire, BL, which usually all the
services that you need to worry about in your application. These are the ones that
you typically want to use, but in reality there are many, many more. So I'll run diva
container again and I'm actually going to search it for a markdown and check it out.

```terminal-silent
php bin/console debug:container markdown
```

Look at `markdown.parser.light` is the ID of a service in the container. And if you
click it, it's class name is `Light` as the exact same thing that we were seeing dumped
out over here. So what we're actually doing internally is we were telling the bundle
that we want the main markdown parser service to now be this service inside of a
container.

We're going to keep talking about this as we go along, but the big takeaway now for
now is that there are many services in that container. They all have a unique name
and some of them the most useful are auto wire verbal.

Okay. So one of our initial goals here was to figure out maybe how would he get this
cache service to stop caching on the filesystem. So down here I'm going to replace
the `dd()` with a `dump($cache)`. Uh, I don't want it to kill the page anymore. It'll just
be a little bit easier. I'll go back over here and refresh. And the dump shows up
down here on the web, Debo, two of our, so you can see it's an instance of something
called `TraceableAdapter`, um, which is just a little rapper object, but inside of it
you can see something called the `FilesystemAdapter`. So that's kind of an indication
that this is caching to the filesystem. So once again, how can we control that? How
could we tell whatever bundle is giving us this service, um, that we want to cache
somewhere else. And of course the real answer is you Google it, you go to
documentation, it's going to tell you exactly what kind of config T that you need to
use, uh, to modify this. But let's see if we configure it out ourself. First thing is
we don't really know what bundle this comes from.

But if you'll look in `config/bundles.php` when we started the project, the only
bundle we had was `FrameworkBundle`. That's the core bundle inside of Symfony. Every
other bundle here we have installed. So you can see there's not a bundle here for
cache and bundle or something like that. This, that's a, that's a functionality that
actually comes from that core `FrameworkBundle`. Okay, so let's run over here and
let's run our trusty

```terminal
php bin/console config:dump FrameworkBundle
```

and here, cause this is a giant list of config, lesser for `cache` and I'll keep for
maybe a cache section and there it is cache configuration. So you can see that
there's a under framework, there's a key called `cache` and here it has a whole bunch
of example configuration of things that you can use. Since it's a little bit hard to
see. What we can actually do is run this again with `FrameworkBundle cache`.

```terminal-silent
php bin/console config:dump FrameworkBundle cache
```

So that will give us only the cache sub key under neath the framework.

so let's give us lots of good information. And you can even see a key here called
`app`, um, which we don't really know what that means, but you can see it's set to
cacheed out of that product filesystem. So kind of looks like that might be something
that we need to tweak, but we don't really know what value we would set it to. We
could kind of guess that there's `cache.adapter.redis` for example, but
we're not sure about that

by the way. Another way that you can look at your configuration is instead of config
dump is you can actually pass the same arguments to debug config. The subtle
differences that `config:dump` shows you an example tree of all the config
`debug:config` will actually show you what your real settings are. In fact, let's rerun that
without the `cache` parts. We can see all a `FrameworkBundle`.

```terminal-silent
php bin/console debug:config FrameworkBundle
```

So these are our real
`FrameworkBundle` settings in our application. You can see here under cache that `app`
key is said to `cache.adapter.filesystem`. So in this case, um, we still
know exactly what to change this to if we want to cache somewhere else. Uh, but in
this case, the configuration file itself is going to help us. So because we're under
the `framework` key here logically, I'm going to go over here and find a config and
packages `framework.yaml` key a file. But you notice you actually don't see the cache
stuff in here. cache is complex enough that it's separated into its own file right
next to your called `cache.yaml`

and you can see it still starts that `framework`. And then `cache` key. This is a little,
I give you a little hint earlier that said that the names of these files aren't
actually important and we're seeing evidence of that even though this has a root key
called `framework`, it doesn't need to be called `framework.yaml`. You can actually split
these files out however you want. The important thing is is it has `framework`. So it's
going to pass this configuration to `FrameworkBundle` and we're configuring the cache
system under `FrameworkBundle`. And this has a bunch of comments in here that help us.
It tells us how to use Retis for our cache. It tells us how to use APCu for our
cache, which is actually what I'm going to use. APCu is a little in-memory cache.

You do need to install it as a eight is a PHP extension. I'll talk about that in a
second, so I'm going to uncomment out `apcu`.

It's not surprisingly, before I even try that, we'd go over and run our debug config
again and I'll scroll up to the `cache` section. We can not see that we have changed
that value from `app` to `cache.adapter.apcu`. What difference does that make? Well,
when you go over here and refresh, look down here. Yes, you can see now see that we
are using something called the `ApcuAdapter`. It's actually cacheing in memory, so we
have successfully by looking at what configuration the bumbles giving us made a
little tweak and it's taken care of all the rest for us. By the way, if you get a
APCU is not enabled air here, it means you need to install the APCU extension. You
can skip that if you really want to. Um, that varies on systems, but oftentimes you
install with pecl

```terminal
pecl install apcu
```

and because that's a PHP extension, after
you install it, you'll want to go over here to your, uh, terminal and run

```terminal
symfony server:stop
```

hit enter, and then run a command to restart the server again. Then
you should be working with APCU once again.

All right. Next we've, we've started the modify some files in this `config/packages/`
directory, the XAML files. I want to talk more about the entire structure of this,
including these other other directors here called `dev/` `prod/` and `test/`.
