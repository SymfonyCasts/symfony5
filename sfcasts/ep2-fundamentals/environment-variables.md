# Environment Variables

Coming soon...

Go to `sentry.io` if you've never used sentry before. It's a cloud based air
monitoring tool. It's really cool. It's a really great way for you on production to
see what errors you have and handle them. It also has really great integration with
Symfony and it's going to be an awesome way for us to touch on something we haven't
talked about yet, which are environment variables.

so go ahead and sign up for an account. It's free, and ultimately you're going to
land on a page that looks like this, where it's going to tell you a little bit about
how I get started. A select Symfony on the list here and then down here it's going to
tell you how you can install these `sentry/sentry-symfony` package. Before you install this,
make sure that you've committed all of your changes. I'll run 

```terminal
git status
```

You can see
I've already committed all my changes here and I like to do that before because
before I install a package I like have to come out with changes so that if that
package has a recipe, I can easily see what that recipe did. So I'll copy the
composer requirement, move over and run a 

```terminal
composer require sentry/sentry-symfony
```

It's download some packages and interesting, it says the package for this recipe
comes from the contrib repository, which is open to community contributions. Do you
want to execute this recipe? So there are two, two main, there are two places that
recipes come from. There's the main official recipe repository, which is a heavily
guarded for quality. And that's what we've been. And, and uh, we've, we've installed
several packages from that and there's also contributed pository and it's easier for
the community to make a recipe changes there. So the first time that this happens,
it's going to ask you if that, if, if that's okay. You just need to realize that
these may be of lower quality. So I'm going to say yes permanently by saying `p`. but
then once this is finished, I'm gonna run and 

```terminal
git status
```

so I can actually see what
it did. Okay, so `compose.json` and `composer.lock` and `symfony.lock` are
things that we expect from composer and the recipe system. It also updated 
`config/bundles.PHP` which is not S also not a surprise at this point, this insult
`SentryBundle`. So it updated this file to initialize that the two other changes are
interesting. `.env` and an added a new configuration file. Let's go see what's going
on here.

first open up `.env` scroll the bottom. Huh? So there's a new section down here
setting an environment variable called `SENTRY_DSN`

And now if you go into `config/packages/` and look at `sentry.yaml` not surprisingly,
this is probably the configuration file for that bundle. But check this out. They
have a key in here called `dsn:`. It's set to this very strange syntax.
`%env(SENTRY_DSN)%`. So first of all, this kind of looks like a parameter, right?
Cause it has percents on both sides. Similar to how in `cache.yaml` we referenced our
`cache_adapter` parameter and this is a special type of brand, hon, with what's really
happening here is this is a way in Symfony that you can reference an environment
variable. So if you're not very familiar, environment variables are just a a
computer, uh,

Way for a configuration to be passed around. And in Symfony you can read environment
variables using this `%env()%` in the name of the environment. V environment variable
percent syntax. No. A couple of things about why this is being done. The first thing
is that this `SENTRY_DSN` is going to contain uh, some sensitive, sensitive key on it.
We don't want anybody to get our `SENTRY_DSN` value because then they would be able to
send information to our century, uh, system. So this is not a value that we want to
commit to the repository ops. You spin back over to the instructions and we don't
need to enable the bundle because we're using Symfony flex. So basically we can skip
down to this DSN part here. We don't want anybody to get this DSN value, so we don't
actually want to, wouldn't actually want to like for example, copy this, I'll copy it
right now and then paste it right into our DSN cause then this would be committed to
the repository. And that's generally not a good idea to commit sensitive values to
repository. So instead this bundle has correctly decided to use environment variables
so that we can store that sensitive value somewhere else. And then this will just
read the environment variable.

But setting environment variables is kind of a pain in the butt. It is possible, but
uh, you actually, it's, it's a fairly technical thing to get right to set environment
variables. Um, so for that reason Symfony has this `.env` is that in files
automatically? Redmond's Symfony is booting up in any keys inside of here. Become
environment variables. So you don't even have to use this file. But this is a
shortcut way to set environment variables. By the way, if you did set a real
environment variable, it would override any values you passed in here. So environment
variables are a great way to to reference config. And Symfony reads this file to make
it easy, but this, `.env` file is committed to the repository. You can notice it over
here. It's when I ran my get status. So if I pasted my `SENTRY_DSN` here, I would have
the same problem. This would be committed to my repository. So the real purpose of
that end is to store sort of not nonsensitive default environment values, like maybe,
maybe environment values, environment variables that are good for local development.
Once it loads, it loads this, that `.env` file, but it also looks for another file here
called `.env.local`. I'm going to go ahead and create that new file `.env.local`

anything inside of that `.env.local` will override that end. So let's
go right, she over here and I'll say `SENTRY_DSN=...` and I'll paste that value. So now
in that end might have like this a nonsensitive default, which is basically I won't
set the `SENTRY_DSN`, which means don't use century. And in `.env.local`
which is to override that. I have this value here. Now the key thing with that, I
ended up local, the whole point of that in `.env.local` is that if you look in your 
`.gitignore` file, it's being ignored from git. So if I spend over here and say 

```terminal
git status
```

you're not going to see that and that local over here. So that's the nice safe place
that we can put environment, that sensitive environment, uh, variable values, um,
that won't be committed. And in a few minutes we're gonna talk about how we would
store this value for production. I need to explain that better to see this is
working, can actually run over here and do 

```terminal
php bin/console about
```

this is kind of a rare
command and Symfony that just gives you a bunch of information about your Symfony
application. And on the bottom here, it actually shows what environment variables are
being loaded from `.env`. And you can see it's resolving it to the environment
variable that we want. So that is perfect.

All right, so let's actually try it and see if the bundle works. So how this works is
let's go to our show controller and I'm just going to throw a new `\Exception()`
and say bad stuff happened.

As you remember, I've been saying many, many times that the main purpose of a bundle
is to give you services and then it's actually completely true with this century
bundle. But for the most part, the purpose of those services isn't for us to use them
directly inside of our controller. The purpose of them is to work in the background
and do when air, when exceptions happen. So if we go over now and refresh, we get our
bad stuff, have an air. If we go back to the getting started thing, and actually I
should just be able to go to `sentry.io` at this point. Yep. It takes me over to
my SymfonyCasts issues and boom, there you can see it inside there. Exception bad
stuff happened. It is being read.

another way to see the configuration value in use is actually, Oh, Ms. Thomas out
there.

