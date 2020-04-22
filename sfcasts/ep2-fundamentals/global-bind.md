# Binding Global Arguments

Coming soon...

Okay, so we've registered everything in the store as directors of service and we've
told it to autowire. Now down here

we get to the situation where sometimes you need to give Symfony's container a little
more information about a service. So that's what we've done here by putting our this
services ID or we're doing is we're overriding that service. So this markdown helper
is actually registered up here, but we immediately override it down here and add a
bind for `$isDebug: '%kernel.debug%'` this also automatically has autowire
true on it. We don't have to put that because it's automatically there thanks to the
defaults above. So this is a long way of saying that everything in your source
directory is automatically made available as a service in the container and its
arguments are automatically auto wired. And if you add need to add more
configuration, you just put the class of the service down here, which is actually the
ID and that overrides that. And then you can specify whatever config you actually
need. There's some complexity, get the thing work behind the scenes, but it's a kind
of beautiful end product. Now that we know this, we can do something really cool. So
down here, notice we've said that we want the `$isDebug` argument to our
`MarkdownHelper`.

There's third argument here to be set to the `%kernel.debug%` parameter. But I just
told you that there's this cool thing called `_defaults:` up here that
specifies default values for any service red student's container. So we can actually
do is copy that bind, delete that service entirely, and then go up under `_defaults`
and paste it there. I forgot where, and refresh no errors. And you can see that the
`$isDebug` flag down here. We're dumping is still true. What this done is we've now set
up a global convention. I can not use an `$isDebug` argument in any service anywhere in
my application and it's automatically going to be set to the `kernel.debug`, uh,
uh, parameter. That is awesome.

Another thing you can optionally do here and it looks a little bit weird, is you can
actually put the type hint on there. So in this case, the `bool $isDebug` matches. The
`bool $isDebug`. I have instead of my `MarkdownHelper` so if I refresh, this still
works, but if I didn't have that bul type and on there, I would actually get that air
cannot. A auto wire argument $isDebug, has no type it, you should configure its value
explicitly. So that's pretty cool. So I'll put that is debug flag back right there
and now it works again and now it's this working. I'll take out, this `$isDebug` flag
right here. So this is really how I primarily read what I, this is usually what I do.
Um, by Symfony can auto wire almost everything inside of the container and a few
things that it can't. Auto wire I typically set up as global binds and this is
basically as complicated as your configuration file needs to get. Next, let's talk
about something else named auto wiring on the logger.
