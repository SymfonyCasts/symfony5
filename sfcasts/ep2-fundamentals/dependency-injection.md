# Autowiring Dependencies into a Service

Coming soon...

Our `MarkdownHelper` service is... sort of working. We can call it from the
controller... but we're trying to two services - cache and markdown parser -
that we don't have access to. How can we get those objects?

Real quick: I've said many times that there are many service objects "floating
around" in Symfony. But even though that's true, you *can't* just grab them out
of thing air. There's no, like, `Cache::get()` static call or something that
will magically give us that object. And that's *good* - that's a recipe to writing
bad code.

So how *do* we get services? Currently, we only know one way: by autowiring them
into our controller methods.

## Passing Dependencies to the Method?

what I'm about to show you is not actually the correct solution, but I want to take
things one step at a time knowing what we know. Now, one option is that we can
actually pass the markdown parser and cache from our controller into the `parse()`
function. So let's actually do that. I'm going to add two new arguments here.
`MarkdownParserInterface $markdownParser`, and then `CacheInterface` from
`Symfony\Contracts`, `$cache` and good, just as simple as that. This is now happy. All the
variables are defined and in `QuestionController`, we're not going to need to pass
this `$markdownParser` and `$cache`. Cool, so let's see if that works. We've over
refreshed and it does. Now I mentioned this is not the final solution and here's why.
If you think about it, the markdown parser object and the cache object aren't really,

aren't really input to the parse function. What I mean is it made sense when we made
the parts function to make the `$source` in arguments. Of course you have to pass into
the source that you want parsed, but these next two arguments don't really control
how this function behaves. They're not really arguments that you would normally put
on a parse function. Instead, they're really dependencies that this service needs in
order to do its work. It's just stuff that needs to be available so that it can get
its job done. And for dependencies like this, for objects or configuration that your
service just needs in order to get his job done, instead of passing them through the
individual functions, we instead pass them through the constructor. So we're going to
create a new public function `__construct()`, and I'm actually going to move
those two arguments.

I will delete them from our function down there and move them up here. Now, first
thing I want you to know before I finish this is that auto wiring works in two places
in Symfony. It works in the construct method of your services and in the methods to
your controller and actually the construct method of your service. This is actually
the main place that auto wiring works is the main place it's supposed to work. It
also works. Uh, auto wiring also works on the methods of your, uh, controller, but
that's a special superpower only for your controller. So for example, we wouldn't,
uh, be able to put like `MarkdownParserInterface` here and expect Symfony to auto
wire that because we are the ones that are actually choosing what arguments to pass
to that function. So it's auto wiring works in the constructor. Now what are we going
to do with those arguments?

We're going to do is we're actually going to create two private properties for them,
`$markdownParser` and another private property called `$cache`. Then down here we're going
to say `$this->markdownParser = $markdownParser`. And `$this->cache = $cache`. So
we're doing is we're saying whenever, whenever we are instantiated and Symfony is
going to instantiate us, Symfony will pass us the markdown parser, the cache service.
All we're going to do in the construct method is just store them on a property. We're
not going to do anything else. Just put them on a property. So later when our code
then calls this parse function, we know that these two properties will hold those
objects. So we can use them down here, `$this->cache`, and then we don't need to pass
the `$markdownParser` to the `use` because down here we can say `$this->markdownParser`
that is now a perfect service. We've auto wire our dependencies to the constructor
and then use, set them on properties and then use them down below. So in
`QuestionController`, we can remove these two arguments. They're not, they don't even exist
anymore.

And when we move over, it works.

If this didn't feel totally comfortable yet, don't worry. This process of creating
services is something that we're gonna do, uh, over and over again. But we now have
this beautiful new service, this new tool that we can use from anywhere in our
application. We pass it the markdown. We want eight takes care of the caching and the
markdown processing. We don't need to worry about it at all. So to celebrate in
`QuestionController`, we don't need to have these arguments anymore. Actually want to
delete the second and third argument. Look how simple it is. I even go up the top
here and oops, even though it doesn't hurt anything, I will delete those to you
statements.

Next, let's talk about something else. Maybe services.yaml. I'm not sure.
