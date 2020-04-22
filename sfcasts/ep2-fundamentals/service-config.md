# Service Config & Non-Autowireable Argumens

At your terminal, run

```terminal
php bin/console debug:container --parameters
```

As I mentioned, most parameters are low-level config that aren't useful to us.
But there *are* a set of these that start with `kernel.` These are added by
Symfony itself, and several of them *are* useful. For example, if you ever need
to know the current environment, you can use `kernel.environment`. One I use
frequently is `kernel.project_dir`. If you ever need to point to a file in a
config file, this is a *super* handy way to do that.

But what the one I want to use right now is `kernel.debug`, which is currently
set to true. Basically when you're in the `dev` or `test` environments, this is
set to `true`. When you're in `prod`, it's false.

Let's pretend that we're trying to customize the markdown-parsing logic itself:
we're making changes to the HTML it outputs. But because we're caching Markdown
in dev, each time we make a change to the parser, we need to clear the cache
before we can see it. To make life nicer, let's see if we can use this flag to
*disable* markdown caching entirely when `kernel.debug` is set to true.

## Dependency Injection with Scalar Values

Open up `MarkdownHelper`. In the same way that this class needs the
`MarkdownParserInterface` and `CacheInterface` services to do its job, it now
*also* will need to know whether or not we're in debug mode. What do we do when
we're inside a service and need access to a service or some configuration that
we don't have?

The answer is always the same: add a `__construct()` method if you don't have
one already, add an argument, set that argument on a new property, then use it.
*Usually* the "thing" we need is another service. But occasionally what you'll
need is just some configuration - like a `debug` boolean or maybe an API key.
Even in those cases, the solution is the same.

Add a new argument called, how about, `bool $isDebug`. Create a property for this -
`private $isDebug` - and set that in the constructor: `$this->isDebug = $isDebug`.

Down in parse, let's use it: if `$this->isDebug`, then let's copy the `return`
statement from below and paste it here. We'll return immediately. Go team!

## Non-Autowireable Arguments

So far, every time we've added an argument to a constructor, Symfony has known
what to pass thanks to autowiring. But what about now? Do you think that, when
Symfony tries to instantiate our service, it will know what value to pass to
this `$isDebug` argument?

Let's find out! Move over and refresh. Doh! Syntax error! Come on Ryan! I'll
add my missing semicolon and... drum roll... refresh!

The answer is no: Symfony does *not* know what to pass to `$isDebug`. But we get
an awesome error: "cannot resolve argument `$markdownHelper` of
`QuestionController::show()`" - that's telling us which controller this all starts
with - and then:

> Cannot autowire service `MarkdownHelper` argument "$isDebug of method
> `__construct` is type-hinted bool. You should configure its value explicitly.

Yep, autowiring *only* works with class or interface type-hints. And that makes
sense: how could Symfony *possibly* guess what we want for this argument?  It's
not, fortunately, *that* magic.

## Adding Extra Service Config to services.yaml

This is our first example of a constructor argument that can't be autowired. When
this happen, it's no problem: we just need to give Symfony a little "hint" about
what we want.

How? Open up `config/services.yaml`. At a high level, this is where we configure
our *own* services and parameters. For now, skip passed all the stuff on top - we're
going to explore what that all does soon. At the bottom of the file, indent four
spaces so that you're under the `services` key then type the full class name to
our service: `App\Service\MarkdownHelper:`. Below this, we can pass configuration
to help Symfony instantiate the object. Do that by saying `arguments:` and, beneath
that, `$isDebug` set to, for now, just `true`.

Yep, we're *literally* saying:

> Hey Symfony! If you see an argument called `$isDebug` in the constructor,
> pass `true`. And please keep autowiring the rest of my arguments, because
> that rocks.

So... that *should* be enough to get it working! Try it! When we refresh... it's
back! Let's *really* make sure it's working: inside `MarkdownHelper`, add
`dump($isDebug)`.

This time when we reload... there it is - `true`.

## Referencing %kernel.debug%

Of course, we don't *really* want to hardcode `true` here: we want to reference
the `kernel.debug` parameter. No problem: in `services.yaml`, add quotes and say
`%kernel.debug%`.

When we try the page, it should still be true... and it is! Let's double-check
the `prod` environment. Find the `.env` file, change `APP_ENV` to `prod`, then
go clear the cache:

```terminal-silent
php bin/console cache:clear
```

When that's done, find your browser and give it a try. Yep! Up on top, it prints
`false`. The power! Let's change back to `dev` environment.

## The Amazing (but not yet impressive) bind

Before we keep going, head back to `services.yaml`. There *are* a bunch of other
keys we can use below a service to configure hot it's instantiated, but most of
them aren't too important or common. However, there *is* one I want to try. Rename
`arguments` to `bind`.

If you move over and refresh... that makes no difference at all. In fact, `arguments`
and `bind` are *almost* identical. Really, they're *so* similar, that I'm not
even going to explain the subtle difference. Just know that `bind` is *slightly*
more powerful and it's what I typically use.

Next: I want to demystify what this file is doing up on top so that we can
*really* understand how our services are being added to the container.
