# The Secrets Vault

How do does *deployment* work with environment variables? Because, in a real app,
we're going to have a *bunch* of sensitive environment variables - like database
username & password, API keys and more.

## Deployment 101

I don't want to get *too* far into the topic of deployment right now, but here's
the general idea. Step 1: get your code onto your production machine and run
`composer install` to populate the `vendor/` directory. Step 2, *somehow* create
a `.env.local` file with all your production values. And step 3, run:

```terminal
php bin/console cache:clear
```

to clear the production cache. The Symfony documentation has more details, but...
it's *basically* that simple.

The *trickiest* part is step 2: creating the `.env.local` file. *Somehow*, your
deployment system needs to have access to the sensitive environment variable
values so it can populate this file. But, since we're not committing those to our
repository... where *should* we store them?

## Hello Secrets Vaults

To solve this problem, a concept called a "Secrets Vault" has been invented.
And there are actually several *cloud-based* vaults where you can store your
secrets in *their* system, then securely read them while you're deploying. Those
are *excellent* options.

Symfony *also* comes with its *own* secrets vault, which is *super* cool because
it allows us to commit our sensitive values - called secrets - into Git!

## Dumping the Sentry Connection Details

To help us see this, in `QuestionController::show()`, add a third argument:
`HubInterface $sentryHub`. Below, `dump($sentryHub)`:

[[[ code('ac57a3310e') ]]]

The *main* purpose of SentryBundle's services is *not* for us to interact with
them directly like this. But this will be a handy way to *quickly* see our
`SENTRY_DSN` value. By the way, I *found* this interface, of course, by using
`debug:autowiring`.

Check it out: back on your browser, I'll close the sentry.io tab and refresh.
Down on the web debug toolbar, it dumps a `Hub` object. If you expand the
`stack` property... and expand again, again, and *again*, there it is! By
digging, we can see that our production `SENTRY_DSN` value is being used.

## Creating the Vault

Here's the goal: we're going to *move* the `SENTRY_DSN` environment value *into*
our vault. A vault is basically a collection of *encrypted* values. And in
Symfony, you'll have *two* vaults: one for the `dev` environment - which will
contain non-sensitive default values - and a *separate* one for the `prod`
environment with the *real* values.

So, each "secret" will need to be set in *both* vaults. Let's start by putting
`SENTRY_DSN` into the `dev` vault. How do we do that? Find your terminal and run
a shiny new command:

```terminal
php bin/console secrets:set SENTRY_DSN
```

Because we're *in* the `dev` environment, this will populate the `dev` vault.
And, a good value in `dev` is actually an empty string. If `SENTRY_DSN` is empty,
Sentry is disabled.

So, just hit "Enter". Ah!

> Warning: No value provided, aborting.

This is a bug in Symfony where it doesn't allow an empty secret. It's already
been fixed and an empty value *is* allowed in Symfony 5.0.8. So hopefully,
you won't get this.

If you *do*, we can work around it: re-run the command with a `-` on the end,
which tells Symfony to read from STDIN.

```terminal-silent
php bin/console secrets:set SENTRY_DSN -
```

Then, as *crazy* as it sounds, hit `Control`+`D` - as in "dog". That was *just* a
fancy way to set `SENTRY_DSN` to an empty string.

## The config/secrets/ Public And Private Key Files

Because this was the *first* secret that we set into the `dev` vault, it
automatically *initialized* the vault. It says:

> Sodium keys have been generated at `config/secrets/dev/`

Let's go check that out! Open up the *new* `config/secrets/` directory. *Excellent*:
this has a `dev/` sub-directory because we just created the `dev` vault.

The `dev.encrypt.public.php` file returns the key that's used to add or update
secrets:

[[[ code('135662b7cf') ]]]

It's used to *encrypt* secrets. The `dev.decrypt.private.php` file does
the opposite: its value is used to *decrypt* the secrets so that our app can read
them:

[[[ code('0771b303ee') ]]]

The decrypt key is *usually* a sensitive value that we would *not* commit to the
repository. However, we usually *do* commit the decrypt key for the *dev* vault
for two reasons. First, the values in the `dev` vault are hopefully not very
sensitive. And second, we *do* want other developers on our team to be able
to decrypt the `dev` secrets locally. Otherwise... their code won't work.

This directory will also contain one file per secret. We *will* commit this because
it's encrypted.

## Creating the prod Vault

Let's repeat the same process to put `SENTRY_DSN` into the `prod` vault. Run the
command again but *also* pass `--env=prod`:

```terminal-silent
php bin/console secrets:set SENTRY_DSN --env=prod
```

For the value, open `.env.local`, copy the long DSN string, then paste here. You
won't *see* the value because the command is hiding it for security purposes.

And... boom! This generated the `prod` vault and encrypted the secret. Check out
`config/secrets/prod`. It has the same files, but the output had one extra,
*angry* looking note:

> DO NOT COMMIT THE DECRYPTION KEY FOR THE PROD ENVIRONMENT

It's talking about `prod.decrypt.private.php`. This file *does* need to be
here in order for our app to decrypt & read the `prod` secrets. But we are *not*
going to commit it. This is the *one* sensitive value that your deploy script
will need to know about.

***TIP
Instead of creating the `prod.decrypt.private.php` file when deploying, you can
*also* set the key on a `SYMFONY_DECRYPTION_SECRET` environment variable. See
[Production Secrets](https://symfonycasts.com/screencast/symfony5-upgrade/prod-vault#deploying-with-the-decrypt-key)
for more info.
***

And notice how this is a different color in my editor? That's because... in our
`.gitignore` file, we are *already* ignoring the `prod.decrypt.private.php` file:

[[[ code('f9591e389f') ]]]

## Committing the Secrets Vaults

Cool! Let's commit them! At your terminal... run:

```terminal
git add config/secrets
```

And then:

```terminal
git status
```

Yes! This added the encrypted secret values themselves, both the encrypt *and*
decrypt keys for the `dev` environment, but *only* the encrypt key for `prod`.
Other developers will be able to add *new* keys for `prod`, but not *read* them.
Isn't encryption cool?

Now that our vaults are set up, let's *use* these secret values in our app! Doing
that will be easier than you think. Let's tackle it next.
