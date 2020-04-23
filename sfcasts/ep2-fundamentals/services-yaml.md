# All about services.yaml

When Symfony creates its container, it needs to get a big list of *every* service
that should be in the container: each service's id, class name and the arguments
that should be passed to its constructor. It gets this big list from exactly
*two* places. The first - and the biggest - is from *bundles*.

If we run:

```terminal
php bin/console debug:container
```

The *vast* majority of these services come from bundles. Each bundle has a list
of the services it provides, which includes the id, class name and arguments
for each one.

The *second* place the container goes to complete its list of services is our
`src/` directory. We already know that `MarkdownHelper` is in the service
container because we've been able to autowire it to our controller.

## services.yaml Registers *our* Services

So when the container is being created, it asks each bundle for its service list
and then - to learn about *our* services - it reads `services.yaml`.

When Symfony starts parsing this file, *nothing* in the `src/` directory has
been registered as a service in the container. *Adding* our classes to the container
is, in fact, the *job* of this file. And the way it does it is pretty amazing.

## The `_defaults` Key

The first thing under `services` is a special key called `_defaults`. This defines
*default* options that should be applied to *each* service that's added to the
container in this file. Every service registered here will have an option called
`autowire` set to `true` and another called `autoconfigure` set to `true`.

Let me... say that a different way. When you configure a single service - like we're
doing for `MarkdownHelper` - it's totally legal to say `autowire: true` or
`autowire: false`. That's an option that you can configure on *any* service. The
`_defaults` sections says:

> Hey! Don't make me manually add `autowire: true` to every service - make that
> the default value.

## The autowire Option

What *does* the `autowire` option mean? Simply, it tells Symfony's container:

> Please try to guess the arguments to my constructor by reading their type-hints.

We *like* that feature, so it will be "on" automatically for all of our services.
The other option - `autoconfigure` - is more subtle and we'll talk about it
later.

So these 3 lines don't *do* anything: they just set up default config.

## Service Auto-Registration

The next section - these 3 lines starting with `App\` - are the key to *everything*.
This says:

> Hey container! Please look at my `src/` directory and register *every* class
> you find as a service in the container.

And when it does this, thanks to `_defaults`, every service will have `autowire`
and `autoconfigure` enabled. *This* is why `MarkdownHelper` was
*instantly* available as a service in the container and why its arguments are
being autowired. This is called "service auto-registration".

But remember, every service in the container needs to have a unique id. When you
auto-register services like this, the id matches the class name. We can see this!
The *vast* majority of the services in `debug:container` have a snake-case id.
But if you go *all* the way to the top, *our* services are *also* in this list
each service ID is *identical* to its class name.

This is done to keep life simple... but *also* because it powers autowiring. If we
try to autowire `App\Service\MarkdownHelper` into our controller or another service,
in order to figure out what to pass to that argument, autowiring looks in the
container for a service whose id *exactly* matches the type-hint:
`App\Service\MarkdownHelper`.

Anyways, back in `services.yaml`, after the `_defaults` section and this `App\`
block, we have now registered *every* class in the `src/` directory as a service
and told Symfony to autowire each one.

But do we really want *every* class in `src/` to be a service? Actually, no. Not
*all* classes are services and that's what the `exclude:` key helps with. For
example, the `Entity/` directory will eventually store database model classes, which
are not services: they're just classes that hold some data.

So we register *everything* in `src/` as a service, except for things in these
directories. And actually, the `exclude` key is not *that* important. Heck, you
could delete it! If you accidentally registered something as a service that is
*not* a service, Symfony will *realize* that when you never use it, and remove
it automatically from the container. No big deal.

The point is: everything in `src/` is automatically *available* as a service in
the container without you needing to think about it.

And... that's really it for the important stuff! The next section registers
everything in `src/Controller` as a service. But wait... didn't the section above
already do that? Totally! This overrides those in order to add this "tag" thing.
This is here to cover an "edge case" that doesn't apply to us. If we deleted this,
everything would keep working. So... ignore it.

Now that we understand *how* our services are being added to the container, the
config that we added to the bottom of this file will make more sense. Let's talk
about it next and then leverage our new knowledge to learn a *way* cooler way to
pass the `$isDebug` flag to `MarkdownHelper`.
