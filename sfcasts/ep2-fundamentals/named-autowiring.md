# Named Autowiring

Let's start with a challenge: let's pretend that, to help us debug something, we
want to log some messages from inside `MarkdownHelper`. Okay: logging is
work and work is done by services.... so let's go see if our project has a logger!

Find your terminal and run our favorite command:

```terminal
php bin/console debug:autowiring log
```

There it is! We can use `LoggerInterface` to get a service whose id is
`monolog.logger`. Notice that there are a *bunch* of loggers listed here. Ignore
the others for now: we'll talk about them in a few minutes.

In `MarkdownHelper`, how do we get access to a service that we need? It's the
*same* process every time: add another constructor argument:
`LoggerInterface $logger`. To create a new property and set it, I'm going to use a
PhpStorm shortcut. With my cursor on the argument, I'll hit `Alt`+`Enter` and select
"Initialize properties":

[[[ code('7e25a81b56') ]]]

Nice! But it's not magic: that just created the property and set it down here.

In `parse()`, let's add some very important code: if
`stripos($source, 'cat') !== false`, then say `$this->logger` and... let's use,
`->info('Meow!')`:

[[[ code('e2ad61da1b') ]]]

Let's take it for a spin! Move over, refresh... then click any link on the web
debug toolbar to jump into the profiler. In the "Logs" section... there's our
message!

## Multiple Logger Services

The *true* reason we're doing this - other than to practice dependency injection -
is to talk about how we can work with the *many* logger services in the container.
Symfony's logging library - called Monolog - has this concept of logger channels.
They're... kind of like logger categories and their useful because you can send
logs from different channels to different files.

This is what you're seeing inside of `debug:autowiring`: each logger "channel"
is actually its own, unique logger *service*. The question is: we know how to get
the "main" logger service, but how could we autowire one of these *other* loggers
if we needed to?

## Creating a Logger Channel

Logging channels are not a *super* important concept - but it's a *great* example
of this problem. To see how to handle it, let's add our *own* logger channel. The
logger services comes from a bundle called `MonologBundle`. By adding a little
config to that bundle, we can get a shiny new logger channel.

In `config/packages/`, create a new file called `monolog.yaml`. Inside say
`monolog:` and below, set `channels:` to an array. Let's create one new channel
called `markdown`:

[[[ code('0937efd9e0') ]]]

By the way, if you're surprised that there was no `monolog.yaml` file by default,
there actually *is*: there's one in the `dev/` directory and another in `prod/`.
Loggers behave *pretty* differently in `dev` versus `prod`. Thanks to this new file,
the `markdown` channel will exist in *all* environments.

*Anyways*, *now* find your terminal and run `debug:autowiring`:

```terminal-silent
php bin/console debug:autowiring log
```

Yes! The bundle created a new service for us called `monolog.logger.markdown`.

## Named Autowiring

So back to my original question: how can we get access to this logger? Well,
this is already telling us! This says that if we type-hint an argument
with `LoggerInterface` *and* *name* the argument `$markdownLogger`, it will pass
us the `monolog.logger.markdown` service.

Ok, let's try it! Back in `MarkdownHelper`, rename the argument from `$logger` to
`$markdownLogger`... and update the variable name below:

[[[ code('abe6722fda') ]]]

Let's see what difference this makes. When we reload, it still works... but open
up the profiler and go to the Logs section. Yes! There it is! It says "channel":
`markdown`. For this tutorial, I'm not really concerned about how or *why* we would
use a different logger channel. The point is: this *proves* that we just fetched
one of the *other* logger services.

The *whole* reason this works is because MonologBundle is smart: it sets up
"autowiring aliases" for each channel. Basically, it makes sure that we can
autowire the *main* logger with the type-hint *or* any of the other loggers
with a type-hint and argument name combination. It sets all of that up *for* us,
so we can just take advantage of it.

But what if it *hadn't* done that? Or, what if we needed to access one of the *many*
lower-level services in the container that *cannot* be autowired? This is the *last*
missing piece of the autowiring puzzle. Let's talk about it next.
