# Using & Overriding Secrets

We have successfully added the `SENTRY_DSN` secret value to both the `dev`
and `prod` vaults.

## Listing the Secrets

How can I *prove* that? By running:

```terminal
php bin/console secrets:list
```

Because we're in the `dev` environment, this reads the `dev` vault. There's our
one secret. To see its value, add `--reveal`:

```terminal-silent
php bin/console secrets:list --reveal
```

Behind-the-scenes, that used the dev "decrypt" key to decrypt the value: it's
an empty string. Ignore this "local value" thing for a minute.

We can do the same thing for the `prod` vault by passing `--env=prod`:

```terminal-silent
php bin/console secrets:list --env=prod
```

Including adding `--reveal` to *see* the value.

```terminal-silent
php bin/console secrets:list --env=prod --reveal
```

## Reading Secrets in your App

Ok: because we're in the `dev` environment, the `dev` secret - the empty string -
is the one that should be used. Refresh the page, check the dump, and expand it
a few times. It's *still* using the production value.

Go back into `config/packages/sentry.yaml`. We're *still* using the syntax
for reading *environment* variables. How can we tell it to read the
`SENTRY_DSN` secret instead? Surprise! To tell Symfony to read
a `SENTRY_DSN` *secret*, we use the *exact* same syntax.

## Environment Variables vs Secrets

Let me explain: when Symfony sees the `%env()%` syntax, it *first* looks to
see if an environment variable called `SENTRY_DSN` exists. If it does, it uses it.
If there is *not*, it *then* looks for a secret in the vault called `SENTRY_DSN`.
So reading environment variables and secrets uses the same syntax, but environment
variables take priority.

This means one important thing: when you identify an environment variable that
you want to convert into a secret, you need to *remove* it entirely as an
environment variable. Set a value as an environment variable *or* a secret, but
not both. Delete the `SENTRY_DSN` entry from `.env` and `.env.local`.

*Now* Symfony should be read from our `dev` vault. Refresh... expand the object
and... yes! All the values are `null`! It works!

Let's try out production. Until now, to switch to the `prod` environment, I've
been updating the `.env` file. But now that we understand `.env.local`, let's
add `APP_ENV=prod` there instead.

Next, clear your cache:

```terminal
php bin/console cache:clear
```

Then spin back to your browser and refresh. This time the dump is on top. If I
expand it... yes! It's using the *production* values. Booya! That works because
my project has the prod decrypt key. If that was *not* there, we would get an
error.

Go ahead and take out the `APP_ENV=` line in `.env.local` to get back to the
`dev` environment. And in `QuestionController`, let's cleanup: remove the `dump()`,
the `new Exception` and the `HubInterface` argument.

After this... things are working again.

## Overriding Secrets Locally

You are now *ready* to use Symfony's secrets system. But! The fact that
environment variables take *precedent* over secrets is something that we can
use to our advantage.

Find your terminal and run:

```terminal
php bin.console secrets:list --reveal
```

In the `dev` environment, the `SENTRY_DSN` value is set to an empty string.
Let's pretend that, while developing, I want to temporarily set `SENTRY_DSN`
to a *real* value so I can test that integration.

We *could* use `secrets:set` to override the value... but that would update the
secrets file... and then we would have to be super careful to avoid committing
that change.

There's a better way. In `.env.local`, set `SENTRY_DSN` to the real value. Well,
I'll put "FOO" here so it's obvious when this value is being used.

Now run that command again:

```terminal
php bin/console secrets:list --reveal
```

The "Value" is still empty quotes, but now it has a "Local Value" set to the
string we just used! The "Local Value" is the one what will be used. Why? Because
our new environment variable *overrides* the secret: environment variables *always*
win over secrets. This "Local Value" is a fancy way of saying that.

I'll take that value out of `.env.local` so that my secret is once again used.

Next: let's have some fun! We're going to install MakerBundle and start generating
some code!
