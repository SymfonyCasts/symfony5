# Using & Overriding Secrets

Coming soon...

All right. So before we see this in action, we can actually list the keys by saying
secrets list. So we're going to `secret:list`.

```terminal-silent
php bin/console secret:list
```

This is going to run into development
environments and you can see that it has one inside of there and we can do a `--reveal`

```terminal-silent
php bin/console secret:list --reveal
```

And then that will use the um, the decrypt key to actually show us that
value. And you see its value is an empty quote. Ignore this local value thing for a
second. I'm going to talk about that. We can also do the same thing for the prod
environment

```terminal-silent
php bin/console secret:list --env=prod
```

and `--reveal` to see its value.

```terminal-silent
php bin/console secret:list --env=prod --reveal
```

Alright, so let's check this out.
So right now we're in the development environment and Symfony, so that should read
from the development vault. And so the value that it should use should actually be
the empty string. So let's refresh here. Then I'll just go down and put on a cheat.
I'll open my dump and look at the look in the options and huh? It's still using the
production value for some reason. The reason for that. Here's why

I didn't really mention it, but if you go into `config/packages/sentry.yaml` the way
that you re reference environment variables is with the exact same syntax, his
secrets, what Symfony does internally when it sees the syntax is it first looks to
see if there's an environment variable called `SENTRY_DSN`. If there is, it uses it.
If there is not, then it goes and looks for a secret in the vault called `SENTRY_DSN`.
So environment variables take priority over secrets. So as soon as you identify some
environment variable that you want to convert into your secrets vault, you need to
remove it entirely as an environment variable. Never referenced that as an
environment variable anymore because we now want it to be read from the secrets
faults. So now if you go over and refresh, let's go ahead and expand our object. Once
again, client options and perfect look, everything is Nolde out.

It is now reading from our development vault. Okay, let's switch over to production
and check it there. Now normally I would change `APP_ENV` to `prod`, but now, now that we
understand that we have is that that local file, I'm not going to modify that file.
I'm just going to override the app N in my dot and the local file. Then we'll spend
over do our

```terminal
php bin/console cache:clear
```

so we clear the production cache and then move
over and refresh. And you can see our dump on top here. If I expand that, yes it is
using the value from our production vault that works because I have the production
decrypt key in my project. If I didn't have the production decrypted in my project,
that would fail.

All right, so let's take out the `APP_ENV=...` line in `.env.local` to get back to the
development environment. And now inside our `QuestionController`, I'm gonna delete
that `dump()` the lead. The `Exception` are it, half still works and I don't need this hub
interface thing anymore. All right, so I'll spin back over and cool. My page is
working. By the way, the fact that environment variables take precedent over secrets
is actually a really handy thing because what if, for example, in our development
vault, we have, I go over to my terminal and run

```terminal
php bin.console secret:list --reveal
```

in the development environment and my `SENTRY_DSN` is set to an empty string.
Let's say for some reason that while I'm developing, I really did want to set `SENTRY_DSN`
to a real value because I was testing something related to it. It would be kind
of annoying to modify the value inside of the development vaults because then I would
have to, you know, try not to commit those values. So instead if you want to override
something inside of your, I'm going to override something in your vault locally. It's
as simple as adding it to that end, that local. So if I said, `SENTRY_DSN` equal to
`FOO` and I run that same

```terminal
php bin/console secrets:list --reveal
```

can I say http to IO /[inaudible] and go back over and I run that same command
with dash dash revea l.

[inaudible] okay,

so we went over to our [inaudible]. I haven't got a logo that's `SENTRY_DSN` =
and pasted some real value, and I'll make this very obvious that it's a fake value
here by saying `FOO` is our key, and that has been over and run that same command
again,

```terminal
php bin/console secrets:list --reveal
```

you're going to see that it's, it's telling you that the value is actually
empty quotes, but it's being overwritten locally. So this is actually the value that
would be used. So I'll take that out of my `.env.local` vault. But that is a
great way to override local values. All right, next let's talk about something fun.
`MakerBundle`.

Note about the ENV var that you can use for setting the prod key
