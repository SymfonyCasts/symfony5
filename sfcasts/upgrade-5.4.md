# Upgrading to Symfony 5.4

Step one to upgrading our app to Symfony 6 is to upgrade all of the Symfony libraries to 5.4. And that's pretty easy. It's just a composer thing. In `composer.json`, we have *quite a few* libraries that start with `symfony/`. Most of these are part of the main Symfony project and they follow the familiar versioning of Symfony 5.0 to 5.1 to 5.4, and *then* Symfony 6. Those are the ones we're going to focus on upgrading. But a few of these, like `symfony/maker-bundle` for example, follow their own version scheme. We're not going to worry about upgrading those right now, but we *will* make sure that, by the end, we've upgraded everything.

Okay, what we need to do is change all of these `5.0.*` to `5.4.*`. So I'm going to do a "Find & Replace" with `5.0.*`, replace with `5.4.*`, and then hit "Replace All".

Notice that, in addition to all of the libraries, we also need to change this extra little Symfony `require` key. This is a performance optimization from Flex, and it basically makes sure that Flex is only considering Symfony libraries that match this version. Just make sure that you don't forget to update it.

All right. If I scroll up a little bit, you can see it made a number of changes and updated *a lot* of libraries. To make sure we didn't miss anything that was possibly on a different version, I'm going to search for `symfony/` here and scroll down a little bit. The `monolog-bundle` has its own versioning, and... ooh... I actually *did* miss one: `symfony/routing`, for whatever reason, was already at Symfony 5.1. So let's change that to 5.4 as well. I'll look again and... everything else looks okay. It's either upgraded to the right version or it's part of some other versioning strategy that we are not going to worry about right now.

To *actually* update this, over at our terminal, we can try to upgrade *just* the Symfony packages if we want:

```terminal
composer up 'symfony/*
```

There's a good chance that's going to fail because in order to upgrade those packages, some *other* package needs to be upgraded like `symfony/proxy-manager-bridge`. So if you wanted to, you could `composer up` that. And then if *that* didn't work, you could add another library, *or* you could add this `-W` flag here, which tells it to upgrade whatever you've listed here, *plus* any of their dependencies. You can do *that* if your goal is to upgrade as little as possible.

I'm going to upgrade *everything* with

```terminal
composer up
```

In our `composer.json` file, our version constraints on all of our libraries (Symfony and other libraries) are really good. They allow minor version updates, like 4.0 to 4.1, but they don't allow *major* version updates. So if there was a new version 5 of this library, updating composer would *not* allow that. Updating *everything* should be safe, so say:

```terminal
composer up
```

Hello upgrades! Wow! Look at that huge list! Lots of Symfony stuff being upgraded along with other libraries. And... that finishes successfully!

That was a *big* upgrade. Does the site still work? Let's find out. Head over, refresh and... it does! Symfony is amazing.

On this page in Symfony 5.4, we can see the full list of deprecated code. *Your* number will vary and the number can even change occasionally as you refresh the page, but *I* have 71. If I click into this, I can see what all of those are.

So at this point, our job is simple, but not necessarily *easy*. We need to hunt down every single one of these deprecationa, figure out what code needs to change, and then make that change. Some of these will be pretty obvious and some of them *won't*. So before we even attempt to hunt these down manually, let's use a tool called "rector" to automate as many changes to our code as possible. That's next.
