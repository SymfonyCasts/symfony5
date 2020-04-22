# All about services.yaml

When Symfony creates its container, it needs to create a big list of *every* service
that should be in the container and the constructor arguments for each one. It
gets this big list from exactly *two* places. The first - and the biggest - is
from *bundles*.

If we run:

```terminal
php bin/console debug:container
```

The *vast* majority of the services in this list come from bundles. Each bundle
contains a list of the services it provides, which includes the id of the services,
its class and what arguments should be passed to the constructor.

The *second* place the container goes to complete its list of services is our
`src/` directory. We already know that the `MarkdownHelper` is in the service
container because we've been able to autowire it inside of our controller.

## services.yaml Registers *our* Services

So when the container is being created, it asks each bundle for its service list
and then - to learn about *our* services - it reads `services.yaml`. Because,
at the beginning of this file, *nothing* in our `src/` directory is registered as
a service in the container. *That* is, in fact, the *job* of this file. And the
way it does that is pretty amazing.

## The `_defaults` Key

The first thing under `services` is a special key called `_defaults`, which defines
*default* options that should be applied to *every* service that's registered in
this file. Specifically, every service will have an option called `autowire` set
to `true` and another called `autoconfigure` set to `true`.

Let me say that a different way. When you configure a single service - like we're
doing for `MarkdownHelper` - it's totally legal to say `autowire: true` or
`autowire: false`. That is an option that's on *every* service. The `_defaults`
sections says:

> Hey! Don't make me manually add `autowire: true` to every service - make that
> the default value.

## The autowire Option

What *does* the `autowire` option mean? Simply, it tells Symfony's container:

> Please try to guess the arguments to my constructor by reading their type-hints.

We *like* that feature, so it will be on automatically for all of our services.
The other option - `autoconfigure` - is a bit more subtle and we'll talk about
it later.

So these 3 lines don't *do* anything: they just setup default values.

## Service Auto-Registration

The next section - these 3 lines starting with `App\` are the key to *everything*.
This says:

> Hey container! Please look at my `src/` directory and automatically register
> *every* class you see as a service.

And when it does this, thanks to the `_defaults` section, every service will
have `autowire` and `autoconfigure` enabled. *This* is why `MarkdownHelper` was
*instantly* available as a service in the container and why its arguments are
being autowired. This is called "service auto-registration".

But remember, every service in the container needs to have a unique id. When you
auto-register services like this, the id matches the class name. We can see this!
The *vast* majority of the services in `debug:container` have a snake-case id.
But if you go *all* the way to the top, *our* services are *also* in this list
each service ID is *equal* to the class name.

This is done to keep life simple... but it *also* powers autowiring. If we
try to autowire `App\Service\MarkdownHelper` into our controller or another service,
to figure out what to pass, Symfony looks in the container for a service whose
id is *exactly* `App\Service\MarkdownHelper`.

Back in `services.yaml`, after the `_defaults` section and this `App\` block,
we have now registered *every* class in the `src/` directory as a service and told
Symfony to autowire each one.

Do we really want *every* class in `src/` to be a service? Actually, no. Not
*all* classes are services and that's what the `exclude:` key helps with. For
example, the `Entity/` directory will eventually store database classes, which
are not services: they're just classes that hold some data.

So we register *everything* in `src/` as a service, except for things in these
directories. And actually, the `exclude` key is not *that* important. Heck, you
could delete it! If you accidentally registered something as a service that is
*not* a service, Symfony will *realize* that when you never use it, and remove
it automatically from the container.

The point is: everything in `src/` is automatically *available* as a service in
the container without you needing to think about it.

And... that's really it for the important stuff! The next section registers
everything in `src/Controller` as a service. But wait, didn't the section above
this already do that? Totally. This overrides those and adds this "tag" thing.
This is here just to cover an "edge case" and if we deleted it in our app, everything
would keep working. So... ignore it.

Now that we understand *how* our services are being added to the container, this
*next* part will make more sense. Let's talk about it and then leverage our new
knowledge to see a *way* cooler way to pass the `$isDebug` flag to `MarkdownHelper`.
