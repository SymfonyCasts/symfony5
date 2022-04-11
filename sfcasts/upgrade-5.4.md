# upgrading to Symfony 5.4

Coming soon...

Step one to upgrading our app to Symfony six is to upgrade all the Symfony libraries
to 5.4. And that's pretty easy. It's just a composer thing in composer.json, we have
quite a few libraries that start with Symfony /most of these are part of the main
Symfony project and they follow the familiar versioning of Symfony 5.0 to five, one
to five four, and then Symfony six. Those are the ones that we are going to focus on
upgrading, but a few of these, for example, maker bundle, follow their own version
scheme. We're not going to worry about upgrading those right now, but we will make
sure that by the end we've upgraded everything. All right. So what we basically need
to do is change all of these five zero stars to five, four.star. So I'm going to do a
fine and replace with that five zero star 2, 5, 4 star, and then hit replace all.

Now notice that in addition to all of the libraries, we also need to change this
little extra Symfony required key. This is a performance optimizations from flex, and
it basically makes sure that flex is only considering, uh, simply libraries that
match this version. Just make sure that you don't forget to update it. All right. So
if I scroll up a little bit, you can see it made a number of changes, updated a lot
of libraries, just to make sure we didn't miss anything. Um, that was maybe on
different version. I'm going to search for Symfony /here and kind of look down a
little bit. monolog bundle has its own versioning, but Ooh, I actually did miss one
Symfony routing for whatever reason in my project. It was already at Symfony 5.1. So
let's change that to five point as well. And then everything else looks okay. It's
either upgraded and outta the right version or it's part of some other versioning
strategy that we are not going to worry about right now. Okay. To actually update
this over at our terminal, we can try to upgrade just the Symfony packages if we want
composer up Symfony /star,

But it's a good chance that that's going to fail because in order to upgrade those
packages, some other package needs to be upgraded like Symfony proxy, proxy manager
bridge. So if you wanted to, you could composer up that. And then if that didn't
work, you get another library or you could add this-w flag here, which says to
upgrade whatever I've listed here, plus any of their dependencies. So you can do
that. If your goal is to upgrade just as little as possible, but I'm going to
actually just upgrade everything with composer up In our composer at JSON file our
version constraints on all of our libraries Symfony and a, their libraries are really
good. They allow minor version updates, for example, 4.0 to 4.1, but they don't allow
major version upgrades. So if there was a new version, five of this library, updating
composer would not allow that. So updating everything should be safe. So hit composer
up and hello upgrades. Wow. Look at that beautiful, huge list. Lots of Symfony stuff
being upgraded and then other libraries as well, And that finishes successfully. All
right, so that was a big upgrade. Is, does the site still work? Well, it's been over
refresh and,

And It does cuz Symfony is amazing.

Now on this page in other 1 75 0.4, we can see the full list of deprecated code. We
have your number will vary the number even changes sometimes as you refresh the page,
but I have 71. And if I click onto this, I can see what all of those are. So at this
point, our job is simple, but not necessarily easy. We need to hunt down every single
one of these depre, figure out what code needs to change and then make that change.
Some of these are going to be pretty obvious and some of these are going to be not
very obvious. So before we even try hunting down these manually, let's use a tool
called rector to automate as many changes to our code as possible. That's next.
