# Cache Service

Parsing markdown on *every* request is going to make our app unnecessarily slow.
So... let's cache it! Of course, caching something is "work"... and as I *keep*
saying, all "work" in Symfony is gone by a service.

## Finding the Cache Service

So let's use our trusty `debug:autowiring` command to see if there are any services
that include the word "cache". And yes, you can *also* just Google this and read
the docs - we're learning how to do things the hard way to make you dangerous:

```terminal-silent
php bin/console debug:autowiring cache
```

And... cool! There is *already* a caching system in our app! Nice! And apparently,
there are *several* to choose from. But, as we talked about earlier, the blue text
is the "id" of the service. So 3 of these type-hints are just different ways to
get the *same* service object, one of these - is actually a logger, not a cache -
and the last one - the `TagAwareCacheInterface` *is* a different cache - a more
powerful one if you want to do something called "tag-based invalidation". If you
don't know what I'm talking about, no worries.

For us, we'll use the normal cache service - and the `CacheInterface` is my
favorite interface to use because its methods are the easiest to work with.

## Using the Cache Service

Head back to the controller and add another argument: `CacheInterface` - the one
from `Symfony\Contracts` and call it `$cache`.

This object makes caching fun. Here's how it works: say
`$parseQuestionText = $cache->get()`. Every cache system has a `get()` method like
this where you give it some "cache key". For the key, let's pass `markdown_` and
then an `md5()` of `$questionText`. That will give every unique markdown text its
own cache key.

Now, you *might* be thinking:

> Hey Ryan! Don't you need to *first* check to see if this key is *in* the cache
> already? Like, some: `if ($cache->has())` function call?

Yes... but no. This object works a bit different - the `get()` function has a
*second* argument - a callback function. Here's the idea: *if* this key is
already in the cache, the `get()` method will return it immediately. But if it's
*not* - that's a cache "miss" - then it will call our function, *we* will return
the parsed HTML, and it will *store* that in the cache.

Copy the markdown-transforming code, paste it inside the callback and return it.
You can see we have two undefined variables. We need to get this into "scope". Do
that by adding `use ($questionText, $markdownParser)`.

It's happy! I'm happy! Let's try it! Move over and refresh. Ok... it didn't *break*.
Did it cache? Down on the web debug toolbar, for the *first* time, the cache icon -
these 3 little boxes - shows a "1" next to it. It says: cache hits 0, cache writes 1.
Right click that and open the profiler in a new tab.

Cool! Under `cache.app` - that's the "id" of the cache service - it shows one `get()`
call to our `markdown_` key. It was a cache "miss" because it didn't already exist
in the cache. Close this then refresh again. This time on the web debug toolbar...
yea! We have 1 cache hit! It's alive!

## Where is the Cache Stored?

Oh, and if you're wondering *where* the cache is being stored, the answer is on
the filesystem - in a `var/cache/dev/pools/` directory. But we're going to talk
more about that in a little while.

In the controller, make a tweak to our question - some asterisks around "thoughts".
If we refresh now and check the toolbar... yea! The key changed, it was a cache
"miss" and the new markdown rendered.

So the cache system *is* working and it's storing things inside a
`var/cache/dev/pools/` directory. But... that leaves me with a question. Having
these "tools" - these services - automatically available is *awesome*. We're getting
a lot of work done quickly.

But because something *else* is instantiating these objects, we don't really have
any control of them. Like, what if, instead of caching on the filesystem, I wanted
to cache this in Redis or APCu? How can we do that? More generally, how can we
control the *behavior* of the services that are given to us by bundles.

*That* is what we're going to discover next.
