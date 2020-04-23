# Binding Global Arguments

In this file, we've registered everything in `src/` as a service and told each to
autowire its dependencies. That's *all* you need... *most* of time. But sometimes,
one of our services needs a little bit *more* configuration.

*That's* what we're doing at the bottom for `MarkdownHelper`. This service *is*
registered above thanks to auto-registration. Down here, we're *overriding* that
service: we're *replacing* the auto-registered one with our own so that we can
add the extra `bind` config. This *still* has `autowire` and `autoconfigure`
enabled on it, thanks to the `_defaults` section, but we can now add any
*extra* config that we need to this *one* service.

## Moving bind to `_defaults`

But when you have an argument that can't be autowired, there is actually another,
*easier* way to fix it. Our custom config says that we want the `$isDebug` argument
to `MarkdownHelper` - that's the third argument - to be set to the `%kernel.debug%`
parameter. What if we moved this up to the `_defaults` section?

Do that: copy the bind lines, delete that service *entirely*, and then, up under
`_defaults`, paste.

Let's see if it works! When we refresh, no errors. And the `$isDebug` flag that
we're dumping is *still* true!

When you add a bind to `_defaults`, you setup up a global *convention*: we can
now have an `$isDebug` argument in *any* of our services and Symfony will automatically
know to pass the `kernel.debug` parameter. Thanks to this, we no longer need to
override the `MarkdownHelper` service to add the bind: it will already have it!
*This* is how I typically handle non-autowireable arguments.

## Adding a Type to the Bind

Oh, and if you want, you can add the *type* to the bind - like `bool $isDebug`.
This will *still* work because we have this *exact* argument in MarkdownHelper.
When we refresh, yep! No errors.

But now, remove the `bool` type-hint a refresh again. Error!

> Cannot autowire `MarkdownHelper`: argument `$isDebug` has no type-hint, you
> should configure its value explicitly.

Pretty cool. Let's put our `bool` type-hint back so it matches our bind *exactly*.
And... now that it's working, I'll remove the `dump()` from `MarkdownHelper`.

Here's the big picture: most arguments can be autowired. If you have one that
*can't*, you can set a bind on the specific service *or* set a global bind,
which is the quickest option.

Next, let's talk about what happens when there are *multiple* services in the
container that implement the same interface. How can we choose which one we want?
And what if I need to use a lower-level service that is *not* autowireable?
