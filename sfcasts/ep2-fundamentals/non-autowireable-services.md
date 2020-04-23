# Fetching Non-Autowireable Services

Coming soon...

automatically sets up
"autowiring aliases" for each channel. Let me back up: let's remember how
autowiring works. When autowiring sees an argument type-hinted with
`Psr\Log\LoggerInterface`, it looks in the container for a service with this
*exact* id. So yes, there is a service in the container whose id is literally
`Psr\Log\LoggerInterface`. Well it's really a service "alias" that points to
`monolog.logger`.




So the reason this works is basically because every time you add a new lager channel,
the `MonologBundle` is really, really smart and it makes sure that it sets up one of
these auto wiring aliases for you. But if it didn't do that, how could we do it
ourselves? And when I really want to show you is how the auto wiring works behind the
scenes. And ultimately I'd probably need to make sure that I've talked about this a
little bit before

Wellsy.

So let's go back to our `MarkdownHelper` and let's be complicated. I'm going to change
this and change our argument to be called `$mdLogger` in the constructor and then down
below as well. Perfect. Now if we go back and refresh, that's not going to break our
page, but if you jump into the profiler and go to the log section, you'll notice
that, well, once again, a log in through the `app` channel. And that's basically
because if it doesn't match your argument and it doesn't match with one of these,
then it's going to give you the default one. So, and I'm doing this on purpose to be
even more difficult. So how can we fix this ourselves? Like let's say for some reason
we really do want to call this `$mdLogger`. Well there are two ways both of them are in
`config/services.yaml`.

The first way is we could use a global `bind:`. It works exactly like our `$isDebug`. So
I'm gonna go back here and actually copied type in `LoggerInterface`. Let's actually
get the full a use statement for that full class name for that. So I'll copy
`Psr\Log\LoggerInterface` like that and then we'll say `$mdLogger`. Cause that's
what I called it. And then the key thing is here is now we're going to put the ID to
the service. So if you go and look at our `debug:autowiring` and you can see that the idea
of service as `monolog.logger.markdown`. So I'm going to copy that and then
paste it here. But wait, because if we just did this Symfony would think that we
wanted to pass that string. What we actually want to pass a service with that ID when
you're referencing a service inside of one of these files, the secret here is to
prefix it with an ask symbol that has a special syntax that says we're not referring
to the monolog, that log are not markdown string. I want that service. Now if we go
back and refresh it works and actually to prove that this is working, let's go back
and run our debug container dash dash show argument's markdown.

Actually let's not do that.

And if you click to open the profiler, go back to logs. Yes it is logging through the
markdown channel but there's actually even a slightly more um correct way to to to
set up a global binds for services, cover the entire bind, go to the bottom of this
file going for spaces and paste. What this does is it actually creates a new service
whose ID is `Psr\Log\LoggerInterface $mdLogger`. I know it's a strange
service ID and it's not a real service but it is. It's actually an alias, kind of
almost like a symbolic link to the service who's ID is a `monolog.logger.markdown`
markdown because remember the way that auto wiring works is that when Symfony at an
argument called `LoggerInterface $mdLogger`, the first thing it's going to do is look
to see if there is a service in the container whose name is `Psr\Log\LoggerInterface $mdLogger`
 If there is, it's going to use this service as that argument and
since the service is an alias to `monolog.logger.markdown`, it's effectively
get to use that service. Phew.

So if we go back over and refresh, it still works. I'll open up a new tab, go down to
logs, and yes, it is still using `markdown`. The really cool thing about this is that
if you spin back over and run our `debug:autowiring log` again,

```terminal-silent
php bin/console debug:autowiring log
```

you can see our
$mdLonger actually shows up here. By creating that alias, we are actually doing the
exact same thing that the core did that the co, that model I bundled us well my Mongo
does is it actually creates an alias from PSR log lager interface, and then the name
of each channel to that specific service. That's how autowiring works. Next, let's
talk about something else.
