# Binding Global Arguments

In this file, we've registered everything in `src/` as a service and activated
autowiring on all of them. That's *all* you need... *most* of time. But sometimes,
a service needs a bit *more* configuration.

*That's* what we're doing at the bottom for `MarkdownHelper`:

[[[ code('f24c332df6') ]]]

This service *is* registered above thanks to auto-registration. But down here,
we're *overriding* that service: we're *replacing* the auto-registered one with
our own so that we can add the extra `bind` config. This *still* has `autowire`
and `autoconfigure` enabled on it, thanks to the `_defaults` section:

[[[ code('4ead9d2d12') ]]]

But we can now add any *extra* config that we need on this *one* service.

## Moving bind to `_defaults`

When you have an argument that can't be autowired, there's actually another,
*easier* way to fix it. Our custom config says that we want the `$isDebug` argument
to `MarkdownHelper` - that's the third argument - to be set to the `kernel.debug`
parameter. What if we moved this up to the `_defaults` section?

Do that: copy the bind lines, delete that service *entirely*:

[[[ code('ae101c932e') ]]]

And then, up under `_defaults`, paste:

[[[ code('d25a2f50ae') ]]]

Let's see if it works! When we refresh, no errors... and the `$isDebug` flag that
we're dumping is *still* true! This is awesome!

When you add a bind to `_defaults`, you're setting up a global *convention*: we can
now have an `$isDebug` argument in *any* of our services and Symfony will automatically
know to pass the `kernel.debug` parameter. Thanks to this, we no longer need to
override the `MarkdownHelper` service to add the bind: it's already there!
*This* is how I typically handle non-autowireable arguments.

## Adding a Type to the Bind

Oh, and if you want, you can add the *type* to the bind - like `bool $isDebug`:

[[[ code('cce4e8e0b6') ]]]

This will *still* work because we have the `bool` type-hint in `MarkdownHelper`.
When we refresh, yep! No errors.

But now, remove the `bool` type-hint and refresh again. Error!

> Cannot autowire `MarkdownHelper`: argument `$isDebug` has no type-hint, you
> should configure its value explicitly.

Pretty cool. Let's put our `bool` type-hint back so it matches our bind *exactly*.
And... now that it's working, I'll remove the `dump()` from `MarkdownHelper`:

[[[ code('6c9e0a59a1') ]]]

Here's the big picture: most arguments can be autowired. And when you have one that
*can't*, you can set a bind on the specific service *or* set a *global* bind,
which is the quickest option.

Next, let's talk about what happens when there are *multiple* services in the
container that implement the same interface. How can we choose which one we want?
