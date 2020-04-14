# Cache Service

Coming soon...

Person markdown on every single request can be a little bit slow. So let's cache it.
Of course. Caching is work and work is done by a service. So the first thing I'm
going to do is run over and run bin console, debug auto wiring

cache

without the E in case there's a word caching.

No, it's all good.

And yeah, there is a caching system already in Symfony and actually here you can see
that there are a number of different um, of services. But as I mentioned earlier,
this little part here is actually the ID of the service. So you can even see that
three of these services are actually just different interfaces to get, uh, the same
exact service. This went down, this one down here, cache log or something different.
That's a logger. And this last one down here is really cool. It's actually a, a, a
more powerful cache service if you need to do tag based in validation. If you don't
know what I'm talking about, you probably don't need it. So it doesn't matter which
of these you choose. cache interface is my favorite. It's just the nicest to work
with the methods on the interface, the nicest to work with. So let's go use it. Send
back over to our controller and let's add another uh, argument. Cache interface makes
you get the one from Symfony contracts

cache

and here his how caching works. Here's how this object works. I'm going to say parse
question. Tax = cache->get. So every cache system has a get method where you pass it
a cache key. In this case for the cache key, let's pass it markdown because we're
[inaudible] to indicate that this is a kind of a markdown cache and then MD five of
our question text. So that'll give us a unique fingerprint for the question tech. So
if we ever update the question text, they'll update the key and it'll automatically
invalidate. Now if this is funny to you, now you might be expecting before this line,
I need to actually check to see if this key is inside of a cache. Uh, with Symfonys
cache system. The way you, it's actually a little bit different. You pass a second
argument to get, which is a callback function. So the idea is that if this key is
inside the cache Symfonys, cache system's going to return it immediately. If it's not
in the cache, say cache MIS, then it's going to call our function and our functions
going to return the value that we need. So this is where I'm actually going to take
our transform markdown stuff and inside that call back function, we will return that.
Now you can see I have two undefined here. I need to actually use, I need to get
those into my scope.

So I'm going to use the question tax and the markdown parser. Those are the two
things that I need to have in scope and that's it.

We're set up. All right, let's go check it. So move over, refresh and it didn't
break. Did it work? We'll look down here on the web debug tool or for the first time
we have a cache call and can see cache hits zero out of one cache writes one. I'm
going to actually, uh, right click and open that up in a new tab so we can see that
in a little bit more detail. So you can see under our cache app system here, uh, that
we had one call for our markdown key here and it was a cache miss because it didn't
already exist in cache. So now we can refresh this again and this time you can see it
was a cache hit. So it is working behind the scenes, which is awesome. Where is it
storing right now? It's actually storing on the filesystem or we're going to talk a
little bit more about that in a little while. It's actually storing in the sub
filesystem and a VAR cache dev pools directory. But we're going to talk more about
that in a little while I and to really make sure this is working. Let's put little
asterix around the thoughts part.

Okay.

That shouldn't change. Change the [inaudible] and we refresh. Yup. You can see cache
it missed and refreshed again. It was a cache hit. So out of the box, the cache
system is working perfectly.

So how, but that does leave me with a question. As I mentioned a second ago, this is
being stored on the filesystem in a VAR cache dev pools directory. One of the
problems with having these be these built in services that are just given to you is
that a lot of times you need to be able to control them. What if we don't want to
cache in our filesystem? What if we want to cache in Reddis because that's faster and
can be shared across multiple servers? How can we change the behavior of the service?
That's exactly what we're going to talk about next.

