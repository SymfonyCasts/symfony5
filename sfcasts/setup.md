# Project Setup & The Plan

Hey friends! If you're like me, you probably have a Symfony 5 project or ten lying around and you need to get it upgraded to Symfony 6. Well, you've come to the right place! We're going to do *exactly that* in this tutorial! But more than that, this is a *particularly* interesting upgrade, because it also involves updating our code to use PHP 8. And that includes a transformation from using *annotations* to PHP 8 *attributes*. I need to find my monocle, because we're getting *fancy*. It also includes several other PHP 8 features, which you're *really* going to like. Plus, for the first time, we are going to use a cool tool called "rector" to automate as much of this as possible. And, because I just *can't* help myself, we'll discover nice new Symfony 6 features along the way.

All right! To get this upgrade started, you should *definitely* code along with me. Download the course code from this page and unzip it to find a start directory with the same code you see here. Follow this `README.md` file for all the setup instructions. I've already ran most of these setup instructions, but I still need to get my Webpack Encore assets set and start my Symfony server. So let's do that! Over in my terminal (that's already opened up to this project), I'll run

```terminal
yarn install
```

or

```terminal
npm install
```

to download the node packages. The reason I'm doing this is because part of the upgrade is going to be upgrading some of the tools that handle our JavaScript front end.

Then run:

```terminal
yarn watch
```

or

```terminal
npm run watch
```

to build our front end assets and then watch for changes.

Last step: Let's open a new terminal tab and get a local web server running. I'm going to use the Symfony server like normal. So run

```terminal
symfony serve -d
```

And... awesome! That starts a new web server at "127.0.0.1:8000". I'll click that to say... "Hello" to Cauldron Overflow! My old friend! This is the site we've been building throughout our Symfony 5 series. And if you check its `composer.json` file and look down here for Symfony stuff... whoa.. it is *old*. You can see for all the Symfony libraries there, "5.0". That was *ages* ago.

Here's the strategy for upgrading. Step one: We're going to upgrade our project to Symfony 5.4. That's safe to do because Symfony doesn't include any backwards compatibility breaks on minor versions. So anytime you upgrade *just* this middle number, like 5.0 to 5.4, that's always going to be safe.

Step two: Once we're on Symfony 5.4, to prepare our code for Symfony 6, all we need to do is hunt down and fix all of the deprecations in our code. Once we've fixed the deprecations, it will be safe to go to Symfony 6. To *find* the deprecations in our code, we're going to use a few tools. We'll use rector to upgrade parts of our code, and we'll also upgrade recipes, upgrade parts of our code to PHP 8, and fix the last few things manually. But Symfony's still going to help us out by telling us what we've missed.

After all of that, we'll have a Symfony 5.4 project with no deprecations and we can just "flip the switch" and upgrade to Symfony 6. Easy peasy!

At the *very* end, we'll cover a few more cool features that you might find useful. Are you ready? Great! Let's upgrade our site to Symfony 5.4 next.
