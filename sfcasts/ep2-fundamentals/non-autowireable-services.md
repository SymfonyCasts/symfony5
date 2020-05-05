# Fetching Non-Autowireable Services

There are *many* services in the container and only a *small* number of them can
be autowired. That's by design: most services are pretty low-level and you will
rarely need to use them.

But what if you *do* need to use one? How can we do that?

To see how, we're going to use our `markdown` channel logger as an example. It
actually *is* autowireable if you use the `LoggerInterface` type-hint *and* name
your argument `$markdownLogger`.

But back in `MarkdownHelper`, to go deeper, let's be complicated and change the
argument's name to something else - like `$mdLogger`.

Excellent! If you refresh the page now, it doesn't break, but if you open the
profiler and go to the Logs section, you'll notice that this is using the `app`
channel. That's the "main" logger channel. Because our argument name doesn't match
any of the "special" names, it passes us the *main* logger.

So here's the big picture: I want to tell Symfony that the `$mdLogger` argument
to `MarkdownHelper` should be passed the `monolog.logger.markdown` service. I
don't want any fancy autowiring: I want to tell Symfony *exactly* which service
to pass to this argument.

And, there are *two* ways to do this.

## Passing Services via Bind

You might guess the first: it's with `bind`, which works *just* as well to pass
services as it does to pass scalar config like parameters.

First, go copy the *full* class name for `LoggerInterface`, paste that under bind
and add `$mdLogger` to match our name. But, what value do we *set* this to?

If you look back at `debug:autowiring`, the `id` of the service we want to use is
`monolog.logger.markdown`. Copy that and paste it onto our bind.

But... wait. If we stopped now, Symfony would *literally* pass us the string
`monolog.logger.markdown`. That's... not helpful: we want it to pass us the
*service* that has this id. To communicate that, prefix the service id with `@`.
That's a super-special syntax to *tell* Symfony that we're referring to a *service*.

Let's try this thing! Refresh, then open the Logs section of the profiler. Yes!
We're back to logging through the `markdown` channel!

The `bind` key is your Swiss Army knife for configuring any argument that can't
be autowired.

## Adding Autowiring Aliases

But there's *one* other way - besides `bind` - that we can accomplish this.
I'm mentioning it... almost more because it will help you understand how
the system works: it's no better or worse than `bind`.

Copy the `LoggerInterface` bind line, delete it, move to the bottom of the file,
go in four spaces so that we're directly under `services` and paste.

*That* will work too. But... this probably deserves some explanation.

This syntax creates a service "alias": it adds a service to the container whose
`id` is `Psr\Log\LoggerInterface $mdLogger`. I know, that's a strange id, but it's
totally legal. If anyone ever asks for this service, they will *actually* receive
the `monolog.logger.markdown` service.

Why does that help us? I told you earlier that when autowiring sees an argument
type-hinted with `Psr\Log\LoggerInterface`, it looks in the container for a service
with that exact id. And, well... that's not *entirely* true. It *does* do that,
but only after it *first* looks for a service whose id is the type-hint + the
argument name. So yes, it looks for a service whose id is
`Psr\Log\LoggerInterface $mdLogger`. And guess what? We just created a service
with that id.

To prove I'm not shouting random information, move over, refresh, and open up
the profiler. Yes! It's *still* using the `markdown` channel. The *super* cool thing
is that, back at your terminal, run `debug:autowiring log` again:

```terminal-silent
php bin/console debug:autowiring log
```

Check it out! Our `$mdLogger` shows up in the list! By creating that alias, we
are doing the *exact* same thing that MonologBundle does internally to set up
the *other* named autowiring entries. These are *all* service *aliases*: there is
a service with the id of `Psr\Log\LoggerInterface $markdownLogger` and it's an
*alias* to the `monolog.logger.markdown` service.

Phew! I promise team, that's as deep & dark as you'll probably ever need to get
with all this service autowiring business. But as a bonus, the autowiring alias
stuff will be *great* small talk for your next Zoom party. Your virtual friends
are going to *love* it. I know I would.

Now that we are service *experts*, let's look back at our controller. Because,
it's a service too!
