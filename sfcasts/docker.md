# Enhanced Docker Integration & Testing Emails

Symfony has had Docker support for a while, in particular, to help with local
web development. For example, I have PHP installed locally. So I'm not using Docker
to get PHP itself. *But* my project has a `docker-compose.yml` file that defines
a database service. Remember that the local web server we're using comes from the
Symfony binary... and it's *smart*. It *automatically* detects that I have
`docker-compose` running with a `database` service... and so it reads the connection
parameters from this container and exposes them as a `DATABASE_URL` environment
variable.

Check this out! On any page, click into the web debug toolbar. Make sure you're on
"Request/ Response", then go to "Server Parameters". Scroll down to find
`DATABASE_URL` set to (in my case) `127.0.0.1` on port `56239`. The way my
`docker-compose.yml` is set up, it will create a new random port each time it starts.
The Symfony binary will then figure out *which* random port it is and create the
environment variable accordingly. Finally, just like normal, thanks to our
`config/packages/doctrine.yaml` configuration, the `DATABASE_URL` environment variable
is used to talk to the database. So the Symfony binary *plus* Docker is a nice way
to quickly and easily boot up external services like a database, elastic search,
or more.

## New Docker Integration with Flex Recipes

Recently, Symfony took this to the next level. On Symfony.com, you'll find a blog
post called [Introducing Docker support](https://symfony.com/blog/introducing-docker-support).
The idea is pretty simple. When you install a new package - Doctrine, for example -
that package's recipe *may* ship with some Docker configuration. And so, just by
installing the package, you get Docker configuration *automatically*.

Let's see this in action! Since we already have Doctrine installed, let's install
Mailer, which will come with `docker-compose` config for a service called
MailCatcher. At your terminal, run:

```terminal
composer require mailer
```

Awesome! It stops us and asks:

> The recipe for this package contains some Docker configuration.
> Do you want to include Docker configuration from recipes?

I'm going to say `p` for "Yes permanently". If you *don't* want the Docker stuff,
no worries! Answer no or "No permanently" and it will never ask you again.

And... done! Now we can run

```termional
git status
```

to see that it updated the normal stuff, but *also* gave us a new
`docker-compose.override.yml`. If you're not familiar, Docker will first read
`docker-compose.yml` and *then* will read `docker-compose.override.yml`. The purpose
of the override file is to *change* configuration that is specific to your machine.
In this case, our local machine.

The new file adds a service called `mailer`... which boots up something called
MailCatcher. MailCatcher is a local debugging tool that starts an SMTP server that
you can send emails *to*. And then it gives you a web GUI where you can *review*
those emails... inside a pretend inbox.

This service lives inside of `docker-compose.override.yml` because we only want
this service to be running locally when we're doing *local* development. If you're
using Docker to *deploy* your site, you'll have a different local configuration for
production. If you're *not* deploying with Docker, all of this config could live
in your main
`docker-compose.yml` file if you want.

## Testing MailCatcher

Anyways, before we even start using this service, let's get set up to send an email.
Open up `src/Controller/RegistrationController.php`. We're already using
`symfonycasts/verify-email-bundle`... but instead of actually *sending* the
verification email, we're just putting the verification URL directly into a flash
message. It was a shortcut I made during the Security tutorial.

But *now*, let's send a *real* email. I'll go to the bottom of the class and paste
a new private function, which you can get from the code blocks on this page. Retype
the "e" on `MailerInterface` and hit "tab" to add that `use` statement... and do
the same with the "l" on `Email`. Select the one from `Symfony\Component\Mime`.

Perfect! This will send a very simple verification email that just contains the
verification link.

Now, *all* the way up on the `register()` method, add a new argument at the end:
`MailerInterface $mailer`. Then, down here, remove the `TODO`... and replace it
with `$this->sendVerificationEmail()` passing `$mailer`, `$user`, and `$signedUrl`.
Finally, in the `success` flash, change the message to tell the user that they
should check their email.

Okay, so we have this new `docker-compose.override.yml` file with MailCatcher.
However, that container isn't actually *running* yet. But, ignore that for a minute...
and let's see if we can get the email working.

Click back to the Register page... whoops! We get an error:

> Environment variable not found: "MAILER_DSN".

Of course! The mailer service needs this environment variable to tell it
*where* to send emails. You can find this inside `.env`: the mailer recipe gave
us the `MAILER_DSN` env var, but it's commented-out. *Un-comment* that.

By default, it sends emails to what's called the "null transport"... which means
that when we send emails... they go absolutely nowhere. They're not *actually*
delivered... which is a nice setting for development.

Refresh, add a fake email address, register, and... it worked! Of course, it didn't
*send* the email anywhere... but we can still see, more or less, what the email would
look like.

How? Click any link to go into the Profiler, click "Last 10", find the POST
request for `/register` and click into that. Down here, go to the "E-mails" section
and... voilà! It shows our email including an HTML preview. And *wow* is it
ugly... but that's my fault. Btw, the HTML preview is a new feature in Symfony 5.4.

## Starting up the MailCatcher Service

Ok that's cool. But let's see how MailCatcher can *also* help us debug emails. First,
if you do *not* already have a `docker-compose.yml` file, create one. All you need
is the `version` line on top. That way we have a `docker-compose.yml` file *and* a
`docker-compose.override.yml` file.

Now, find your terminal and run:

```terminal
docker-compose up -d
```

I already have `docker-compose` running for my database container, but this will
now start the `mailer` container, which will initialize a new mailcatcher SMTP server.

Ok... so how do we configure `mailer` to *deliver* to this smpt server from
MailCatcher? What port is that SMTP server running on anyways? The answer is... we
*don't know*! And we *don't care*.

Watch this. Go back to any page, refresh... and then click into the Profiler. Once
again, make sure you're on the "Request/Response" section then go to "Server
Parameters". Scroll down to `MAILER_URL`.

Woh! `MAILER_URL` is suddenly set to `smtp://127.0.0.1:65320`!

Here's what happened. When we started the `mailer` service, Docker exposed port
`1025` of that container - which is the SMTP server - to a *random* port on my
host machine. The Symfony binary *saw* that, *read* the random port, and then,
just like with the database, exposed a `MAILER_URL` environment variable that
*points* to it. In other words, our emails will already send to MailCatcher!

Let's try it! I'll sign up again with some other email address, agree to the terms
and... cool! No error! To see the email, we *could* go back into the Profiler like
we did a minute ago. But in theory, if that sent to MailCatcher, we *should* be able
to go to the MailCatcher UI and review the message *there*. The question is,
*where is* the `MailCatcher` UI? What port is *that* running on? Because that's
*also* running on a random port.

To help with this, hover over the  "Server" section of the web debug toolbar. You
can see that it detects that `docker-compose` is running, it *is* exposing some
environment variables from Docker, and it even detected Webmail! Click "Open"
to head into MailCatcher... and *there's* our email!

If you send *more* emails, they'll show up here like a little inbox.

And... that's it! Congrats! You've just upgraded your app to Symfony 6! *And* PHP 8!
*And* PHP attributes! Such cool stuff!

If you have any questions or run into any problems during your upgrade that
*we* didn't talk about, we're here for you down in the comments. All right,
friends, seeya next time!
