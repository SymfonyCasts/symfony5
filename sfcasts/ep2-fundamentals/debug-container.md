# The Service Container & Autowiring

We found out that the KnpMarkdownBundle allows us to control some of the *features*
of the markdown parser by using this `knp_markdown.parser.service` key. We used
their documentation to learn that there were a *few* valid values for this
`service` config.

But what *is* this? What does `markdown.parser.light` *mean*? Is just a string
that someone invented when they were designing the config for this bundle?

Not exactly: `markdown.parser.light` is the *id* of a service in the container.

## Hello Service Container

Let's... back up. We know that there are many useful objects - called services -
that are floating around in Symfony. What I *haven't* told you yet is that,
behind the scenes, Symfony puts all of these services inside something called
the "service container". You can think of the service container as *basically*
an associative array of services, where each object has a unique service id.

How can we see a list of *all* of these services in the container and their IDs?
Just run `debug:autowiring`, right? Actually, not quite. Find your terminal and
run a *new* command called:

```terminal
php bin/console debug:container
```

And wow! *This* is the *full* list of *all* the services inside the service
container. On the left is the service's id or "key" - like `filesystem` and
on the right is the type of object you would get if you asked for this service.
The `filesystem` service is an instance of
`Symfony\Component\Filesystem\Filesystem`.

You can see that this is a *really* long list. But the truth is that you will
probably only ever use a very *small* number of these. *Most* of them are low-level
service objects that just help *other* more important services do their work.

## Not all Services are Autowireable

Because of this, *many* of these services *cannot* be accessed via autowiring.
What I mean is, for most of these services, there is *no* type-hint that you could
use in a controller to fetch that service. So how *would* you access a service
if it can't be autowired? Don't worry about that yet, we'll talk about how later.

The point is: not all services can be autowired but the *most* useful services
*can*. To get that, shorter, list, we run:

```terminal
php bin/console debug:autowiring
```

This is not the *full* list of services, but it's *usually* all you'll need to
worry about.

## How Autowiring Works

While we're looking at this list, I want to talk about *how* autowiring works.
In this list, we know that we can use the type-hint on the left to get the service
with the id that you see on the right. For example, we can use this
`AdapterInterface` type-hint to fetch some `cache.app` service.

Cool. But... how does that *work*? How does Symfony know that the `AdapterInterface`
should give us *that* exact service? When Symfony sees an argument type-hinted with
`Symfony\Component\Cache\Adapter\AdapterInterface`, does it loops over *every*
service in the container and look for one that implements this interface?

Fortunately, no. The way autowiring works is *so* much simpler. When Symfony sees
an argument type-hinted with `Symfony\Component\Cache\Adapter\AdapterInterface`,
to figure out *which* service to pass, it does one simple thing: it looks for
a service in the container with *this* exact id. Yes, there is a service in the
container that has this long interface name as its id!

Let me show you. Once again, run:

```terminal
php bin/console debug:container
```

*Most* of the service ids have snake-case names: lower case letters and periods.
But if you scroll up to the top, there are *also* some services whose ids are
class or interface names. And... yea! Here's a service whose id is:
`Symfony\Component\Cache\Adapter\AdapterInterface`! On the right, it says that
it's an *alias* to `cache.app`.

Ok, so there are two important things. First, when you type-hint an argument
with `Symfony\Component\Cache\Adapter\AdapterInterface`, Symfony figures out
which services to pass to you by looking for a service in the container with
*that* exact id. If it finds it, it uses it. If it doesn't, you get an error.
Second, some services - like this one - aren't *real* services: they're *aliases*
to another service. If you ask for the `AdapterInterface` service, Symfony will
*actually* give you the `cache.app` service - it's kind of like a symlink.

*This* is primarily how the autowiring system works. Bundles add services to the
container and usually use this snake-case naming scheme, which means the services
*can't* be autowired. Then, to add autowiring support for the most important
services, they register an alias from the class or interface *to* that service.

If this went over your head... don't sweat it too much. The most important thing
is this: autowiring isn't magic. When you add a type-hint to a service for
autowiring, Symfony *simply* looks for a service in the container with that id.
If it finds one, life is good. If not... error!

Next, let's use our bundle-config skills to figure out how to control where
Symfony stores the cache.
