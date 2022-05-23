# Enhanced Docker Integration

Symfony has had support for Docker for a while. In particular, to help with local web development. For example, I have PHP installed locally. I'm not using Docker for that, *but* my project has a `docker-compose.yml` file that defines a database service. Remember that the local web server we're using comes from the Symfony binary, and it's *smart*. It *automatically* detects that I have `docker-compose.yml` running with a `database` service, reads the connection parameters to this container, and exposes them as a `DATABASE_URL` environment variable.

Check this out! On any page, click into the web debug toolbar, make sure you're on "Request/ Response", then go to "Server Parameters". Scroll down to find `DATABASE_URL` set to (in my case) `127.0.0.1` on port `56239`. The way my `docker-compose.yml` is set up, it will create a new random port every time, and the Symfony binary will figure out *which* random port it is and create this environment variable. Then, just like normal, thanks to our `config/packages/doctrine.yaml` configuration, the `DATABASE_URL` environment variable is used to talk to the database. So the Symfony binary *plus* Docker is a nice way to quickly and easily boot up external services like a database, elastic search, or more.

Recently, Symfony took this to the next level. on Symfony.com, you'll find a blog post called "Introducing Docker support", and the idea is pretty simple. When you install a new package - Doctrine, for example - that package's recipe *may* ship with some Docker configuration. And so, just by installing the package, you can get that Docker configuration *automatically*. Let's see this in action! Since we already have Doctrine installed, let's install Mailer, which comes with the `docker-compose.yml` for something called `mailcatcher`. At your terminal, run:

```terminal
composer require mailer
```

Awesome! It stops us and says:

`This may create/update docker-compose.yml or
update Dockerfile (if it exists). Do you want
to include Docker configuration from recipes?`

I'm going to say `p` for "Yes permanently". If you *don't* want the Docker stuff, you'll want to say "No", or "No permanently" and will never ask you again. And... done! Now we can run

```termional
git status
```

and you'll see that it updated the normal stuff, but it *also* has a new `docker-compose.override.yml`. So I now have a `docker-compose.yml` file (I had this before), and the recipe *also* gave me a new `docker-compose.override.yml` file. If you're not too familiar with the difference between these files, Docker reads both of these, but `docker-compose.override.yml` is meant for service overrides that are specific to your environment.

MailCatcher is a tool for local development. When you run it, it spins up an SMTP server that you can send emails to, and that has a nice little web GUI where you can *review* those emails. This is inside of `docker-compose.override.yml` because we only want this service to be running locally when we're doing *local* development. If you were using Docker to actually send your site to production, you would have different configuration for production.

Anyways, before we even start using this service, let's set up a few things in our app to send emails. First, head over to `src/Controller/RegistrationController.php`. We're going to send a proper verification email after we register. Right now, we're using the SymfonyCasts `verify-email-bundle`, but instead of actually *sending* an email, we're just putting the URL directly into a flash message. It was a shortcut we made during the Security tutorial. But *now*, I'm going to go to the bottom of this and paste some code, which you can get on this page. Then, I'll retype the "e" on `MailerInterface` and hit "tab" to add that use statement, and do the same with the "l" on `Email`. Select the one from `Symfony\Component\Mime`. Perfect!

This will send a very simple verification email that just contains a link to, not surprisingly, *verify* our email.

*All* the way up on the `register()` method, add a new argument at the end: `MailerInterface $mailer`. Perfect! And then, down here, I'll get rid of this `TODO`... and we'll say `$this->sendVerificationEmail()`. We're going to pass this the `$mailer`, `$user`, and also the `signedUrl` that they need to click. And then, in `success`, we can just change this message a little bit to let the user know they should check their email.

Okay, so we have this new `docker-compose.yml` file with MailCatcher. We've not actually *restarted* `docker-compose` to get this running, so we're going to ignore this for a second and see if we can get the emails going.

If you click back to the Register page... whoops! We get an error: `Environment variable not found: "MAILER_DSN"`. Now that we're finally using the `mailer` for the first time, the mailer service needs `MAILER_DSN` to tell it where to send emails, You can find this environment variable in `.env`. When we install `mailer`, it gives us this. It just comments it out in case, for some reason, we never actually need `mailer`. Let's un-comment that.

You can see, by default, it sends us what's called the "null transport", which means that we can send emails, but they will go absolutely nowhere, which is actually a nice setting for development. Check this out! I'll refresh the page - it works now - add a fake email address here, register, and... it worked! Of course, it didn't send an email anywhere, but we can still see, more or less, what the email would look like.

Click any link to go into the Profiler and click "Last 10". Find the POST request for `register` and click into that. Down here, we can click "E-mails" and see what our email look like, including an HTML preview. It's pretty ugly, since I didn't actually do any work on it, but this is a great way to debug your emails. This is a new feature from Symfony 5.4.

Another cool way to debug your emails is using MailCatcher. Let's spin over and restart `docker-compose`. If you don't *already* have a `docker-compose.yml` file, go ahead and make one. All you need to do is have a `version` on top and that's it. That way we have a `docker-compose.yml` file and a `docker-compose.override.yml` file. Head over to your terminal and run:

```terminal
docker-compose up -d
```

I already have `docker-compose` running for my database container, and that will now start my mailer container. This also just started `MailCatcher`, which exposed a new SMTP port we can send emails to, and also a new web GUI that we can check out. So how do we configure `mailer` to point to `MailCatcher`? What port is it running on? The answer is... we *don't know*, and we *don't care*. Watch this. Click back to any page, refresh... and then click back to the Profiler. Go to "Request/Response", then "Server Parameters", and scroll down to `MAILER_URL`. As you can see, the `MAILER_URL` is suddenly set to `smtp://127.0.0.1:65320`. So what happened? When we started the `MailCatcher` service, internally, it exposed the `1025` port of the container, which is the SMTP messages, to a random port on my host. The Symfony binary saw that, read what the random port was, and just like with the database, exposed a `MAILER_URL` environment variable that points to it. In other words, our emails will automatically send to `MailCatcher`.

Let's try it. I'll sign up again with some other email address, agree to the terms and... cool! No error! So it seems like that worked. We could go back into the Profiler like we did a second ago and review that message there. But in theory, if that sent to `MailCatcher`, we *should* be able to go to the `MailCatcher` UI and review the message there. The question is, *where is* the `MailCatcher` UI? What port is *that* running on? Because that's *also* running on another random port.

To help with this, down on this little "Server" thing on the web debug toolbar, you can see some information. It detects `docker-compose` running, it's exposing some environment variables from Docker, and it even detected Webmail. We can click "Open" to head into `MailCatcher`, and *there's* our email! and you can view it in HTML or Plain Text. If you send more messages to this, they're just going to show up here like a nice little inbox. So this is a great tool for helping debug emails locally.

And that's it! Congrats! You've just upgraded your app to Symfony 6! *And* PHP 8! *And* PHP attributes instead of annotations! Cool stuff! There are *a lot* more features that we don't have time to cover, but if you have any questions or encounter any problems during your upgrade that we didn't talk about, we're here for you down in the comments. All right, friends! See you next time!
