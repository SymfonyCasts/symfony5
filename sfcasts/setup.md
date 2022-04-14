# Project Setup & The Plan

Hey friends! If you're like me, you probably have a Symfony 5 project... or 10 lying
around and you need to get it upgraded to Symfony 6. Well.. you've come to the right
place! We're going to do *exactly that* in this tutorial! But *more* than that! This
is a *particularly* interesting upgrade, because it also involves updating our code
to use PHP 8. And *that* includes a transformation from using *annotations* to PHP
8 *attributes*. I need to find my monocle, because we're getting *fancy*. It also
includes several other PHP 8 features, which you're *really* going to like. Plus,
for the first time, we're going to use a tool called "Rector" to automate as
much of this as possible. And... because I just *can't* help myself, we'll discover
nice new Symfony 6 features along the way.

## Getting the Project Running

All right! To get this upgrade started, you should *definitely* code along with me.
Download the course code from this page and unzip it to find a `start/` directory
with the same code you see here. Follow this `README.md` file for all the setup
goodies. I've already followed most of these instructions... but I still need
to build my Webpack Encore assets and start my server. So let's do that!

Over in my terminal (this is already opened up to the project), run

```terminal
yarn install
```

or

```terminal
npm install
```

to download the Node packages. I want to get this running properly because we're
going to *upgrade* some of our JavaScript tools a bit later.

Then run:

```terminal
yarn watch
```

or

```terminal
npm run watch
```

to build the front end assets... and then watch for changes.

Ok, last step: open a new terminal tab and get a local web server running. I'm
going to use the Symfony server like normal by running:

```terminal
symfony serve -d
```

And... awesome! That starts a new web server at https://127.0.0.1:8000. I'll click
that and say... "Hello" to Cauldron Overflow! My old friend! This is the site we've
been building throughout our Symfony 5 series. And if you check its `composer.json`
file... and look down here for Symfony stuff... whoa.. it is *old*. All of the
main Symfony libraries are version "5.0". That was *ages* ago. I was so young then!

## The Plan

Here's the strategy for upgrading. Step one: We're going to upgrade our project to
Symfony 5.4. That's safe to do because Symfony doesn't include any backwards
compatibility breaks on *minor* version upgrade. So anytime you upgrade *just* this
middle number - called the "minor" number, like 5.0 to 5.4 - that's always going
to be safe.

Step two: once we're on Symfony 5.4, to prepare our code for Symfony 6, all we need
to do is hunt down and fix all of the deprecations in our code. Once we've fixed
those, it will be safe to go to Symfony 6. To *find* those deprecations, we're
going to use a few tools, like "Rector" to upgrade parts of our code, the new
recipes update system and the tried-and-true Symfony "deprecations reporting".

After *all* of that, once we have a Symfony 5.4 project with no deprecations... we
can just "flip the switch" and upgrade to Symfony 6. Easy peasy!

And at the *very* end, we'll cover a few more new features that you might like.
Are you ready? Great! Let's upgrade our site to Symfony 5.4 next.
