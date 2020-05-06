# Service Config & Non-Autowireable Argumens

At your terminal, run

```terminal
php bin/console debug:container --parameters
```

Most parameters are low-level values that probably aren't useful to us.
But there are several that start with `kernel.` that *are* useful. These are
added by Symfony itself. Need to know the current environment? You can use `kernel.environment`. Oh, and I use `kernel.project_dir` pretty frequently: if
you ever need to point to a file path from a config file, *this* is super handy.

But what the one I want to use right now is `kernel.debug`, which is currently
set to true. Basically when you're in the `dev` or `test` environments, this is
`true`. When you're in `prod`, it's false.

Here's the challenge: let's pretend that we're trying to customize the
markdown-parsing logic itself: we're making changes to the HTML it outputs somehow.
But because we're caching the Markdown, each time we make a change to the parser,
we need to clear the cache before we can see it. To make life nicer, let's use
this flag to *disable* markdown caching when `kernel.debug` is set to true.

## Dependency Injection with Scalar Values

Open up `MarkdownHelper`. In the same way that this class needs the
`MarkdownParserInterface` and `CacheInterface` services to do its job, it now
*also* needs to know whether or not we're in debug mode. What do we do when
we're inside a service and need access to a service or some config that
we don't have?

The answer is always the same: create a `__construct()` method if you don't have
one already, add an argument, set that argument on a new property, then use it.
*Usually* the "thing" we need is another service. But occasionally you'll need
some configuration - like a `debug` boolean or maybe an API key. Even in those
cases, we use this dependency injection flow.

Add a new argument called, how about, `bool $isDebug`. Create a property for this -
`private $isDebug` - and set that in the constructor: `$this->isDebug = $isDebug`:

[[[ code('6758fbe9af') ]]]

Down in parse, use it: if `$this->isDebug`, then copy the `return` statement
from below and paste it here:

[[[ code('ccd8f26845') ]]]

Go team!

## Non-Autowireable Arguments

So far, each time we've added an argument to a constructor, Symfony has known
what to pass to it thanks to autowiring. But what about now? Do you think that,
when Symfony tries to instantiate our service, it will know what value to pass to
this `$isDebug` argument?

Let's find out! Move over and refresh. Doh! Syntax error! Come on Ryan! I'll
add my missing semicolon and... drum roll... refresh!

The answer is no: Symfony does *not* know what to pass to `$isDebug`. But we get
an awesome error: "cannot resolve argument `$markdownHelper` of
`QuestionController::show()`" - that's telling us which controller this all starts
with - and then:

> Cannot autowire service `MarkdownHelper`: argument `$isDebug` of method
> `__construct` is type-hinted bool. You should configure its value explicitly.

Yep, autowiring *only* works with class or interface type-hints. And that makes
sense: how could Symfony *possibly* guess what we want for this argument? It's
not, fortunately, *that* magic.

## Adding Extra Service Config to services.yaml

This is our first example of a constructor argument that can't be autowired. When
this happens, it's no problem: we just need to give Symfony a little "hint" about
what we want.

How? Open up `config/services.yaml`. At a high level, this is where we configure
our *own* services and parameters. For now, skip passed all the stuff on top - we're
going to explore what that does soon. At the bottom of the file, indent four
spaces so that you're under the `services` key, then type the full class name to
our service: `App\Service\MarkdownHelper:`. Below this, we can pass configuration
to help Symfony instantiate the object. Do that by saying `arguments:` and, beneath
that, `$isDebug` set to, for now, just `true`:

[[[ code('07f9a47e50') ]]]

Yep, we're *literally* saying:

> Hey Symfony! If you see an argument named `$isDebug` in the constructor,
> pass `true`. But please keep autowiring the *other* arguments, because
> that rocks.

So... that *should* be enough to get it working! Try it! When we refresh... it's
back! Let's *really* make sure it's doing what we want: inside `MarkdownHelper`,
add `dump($isDebug)`:

[[[ code('af423c71e3') ]]]

This time when we reload... there it is: `true`.

## Referencing %kernel.debug%

Of course, we don't *really* want to hardcode `true`: we want to reference
the `kernel.debug` parameter. No problem: in `services.yaml`, add quotes then
`%kernel.debug%`:

[[[ code('41797d52d6') ]]]

When we try the page, it should still be true... and it is! Let's double-check
the `prod` environment. Find the `.env` file, change `APP_ENV` to `prod`:

[[[ code('d11f1617c6') ]]]

Then go clear the cache:

```terminal-silent
php bin/console cache:clear
```

When that's done, find your browser and take it for a spin. Yep! Up on top, it
prints `false`. The power! Change the environment back to `dev`:

[[[ code('65ccce9464') ]]]

## The Amazing (but not yet impressive) bind

Before we keep going, head back to `services.yaml`. There *are* other config
keys we can use below a service to control how it's instantiated, but most of
them aren't too important or common. However, there *is* one I want to show you.
Rename `arguments` to `bind`:

[[[ code('cd9370e625') ]]]

If you move over and refresh... that makes no difference at all. In fact, `arguments`
and `bind` are *almost* identical. Really, they're *so* similar, that I'm not
even going to explain the *subtle* difference. Just know that `bind` is *slightly*
more powerful and it's what I typically use.

Next: I want to demystify what this file is doing on top so that we can
*really* understand how services are being added to the container and how we
can control them.
