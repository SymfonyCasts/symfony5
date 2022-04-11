# Project Setup & The Plan

Coming soon...

Yo friends. So if you're like me, you probably have a Symfony five project or 10
lying around and you need to get it upgraded to Symfony six. Well, you've come to the
right play. We are going to do exactly that in this tutorial. But more than that,
this is a particularly interesting upgrade, cuz it also involves updating our code to
use PHP eight. And that includes a transformation from using annotations to PHP eight
attributes. Ooh. And it also includes several other PHP, eight features, which you
are going to really like. Plus for the first time we are going to use a cool tool
called rector to automate as much of this as possible. And because I can't help
myself, we'll discover nice new Symfony, six features along the way.

All right, to upgrade your skills, a major version, you should definitely code along
with me. Download the course code from this page on zip it to find a start directory
with the same code you see here, follow this, read me MD file for all the setup
instructions I've already ran most of these setup instructions, but I still need to
get my Webpack Encore assets set and start my Symfony server. So let's do that over
here in my terminal. That's already opened up to this project. I'll run yarn or NPM
install to download the node packages. The reason I'm doing this is because part of
the upgrade is going to be upgrading some of the tools that handle our JavaScript
front end and then run ya and watch or NPM run, watch To build our front end assets
and then for changes. All right, last step, let's open a new terminal tab and get our
Sy. Get our web local, get a local web server running. I'm going to use the Symfony
server like normal. So run Symfony server-D, And that awesome open starts a new web
at 1 27 0 1:8,000. I'll click that too. Say hello to cadre overflow. My old friend,
this is the site that we've been building throughout our Symfony five series. And if
you check its `composer.json` file and look down here for Symfony stuff, whoa, it is
old. You can see for all the Symfony libraries there. Five zero.

True. All right. So here's the strategy big picture for upgrading first. We are
going to upgrade our project to Symfony 5.4. That's safe to do Because Symfony
doesn't include any backwards compatibility breaks on minor version. So anytime you
upgrade just this middle number, like 5.0 to 5.4, that's always going to be safe. All
right, step two. Once we're on Symfony 5.4 To prepare our code for Symfony six, all
we need to do is hunt down and fix all of the depre on our code. Once we've fixed the
depre in our code, then we know it's going to be safe to go to Symfony six now to
find the deprecations in our code, we're going to use a few tools. We're going to use
rector to upgrade parts of our code. We're also going to upgrade recipes, Upgrade
parts of our code to pH P eight and then fix ask few things manually, but Symfony's
still going to help us out by telling us what things we've missed. At that point, we
will have a Symfony 5.4 project with no depre and we'll finally flip the switch and
upgrade to Symfony six. And then at the very end, we'll cover a couple, couple more
cool features before we go. All right, got it. In that case, let's do this next.
We'll upgrade our site to Symfony 5.4.
