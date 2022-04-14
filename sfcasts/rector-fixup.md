# Post-Rector Cleanups & Tweaks

Rector just automated several changes to our app that are needed to remove deprecations on Symfony 5.4. *Plus* it added some nice bonus features like adding the optional `Response` return type on my controllers. But as nice as that is, it's not a *perfect* tool. All the class names are inline instead of having a use statement. And even though it renamed some interfaces, it didn't necessarily rename the methods that we call to reflect those changes. No need to worry, though. Rector is a great start and it helped highlight several changes that we need to make.

Now it's time for us to finish what we started. First, for these long class names with no use statement, and in general for coding styles, Rector doesn't know what coding style you prefer, so it doesn't even try to format things correctly. The official recommendation is to use a tool in your project like PHP CS Fixer to reformat the code after you run Rector. PHP CS Fixer is a great tool anyway, so let's get it installed and have it help us along.

You can install PHP CS Fixer a couple of different ways, but oddly enough, the *recommended* way and the way that I like to do it is one and the same - to create a new directory:

```terminal
mkdir -p tools/php-cs-fixer
```

There's nothing special here - just a new `/tools` directory with `/php-cs-fixer` inside.

Now we can *actually* install it into that directory by running:

```terminal
composer require --working-dir=tools/php-cs-fixer
```

Basically, even though I'm running from *this* directory, we're going to pretend like we're running it from *that* directory.And then we're going to require:

```terminal
friendsofphp/php-cs-fixer
```

If you're wondering why I'm not just installing this directly into my main dependencies, well... that's a bit tricky. PHP CS Fixer is really meant to just be a standalone tool. If I installed it into *my* dependency, then I would need to make sure that it couldn't just cause random problems sometimes. For instance, maybe PHP CS Fixer has *some* versions of *some* dependencies that are incompatible with your project. It's hard to install it and we don't really *need* it to be integrated into our project. It's just a standalone executable that we run. For that reason, we install it into this sub-directory.

As you can see, we have a `composer.json` and `composer.lock` file inside of here, and when we run `/vendor/bin/php-cs-fixer`, *there's* our executable. Because we have a new `/vendor` directory inside of here, I'm going to open up my `.gitignore` file and, at the bottom, let's actually *ignore* that. Say `/tools/php-cs-fixer/vendor` to ignore that directory. While we're here, let's also ignore `/.php-cs-fixer.cache`. That's the little file that PHP CS Fixer is going to create and we don't need to commit that either.

All right, the last thing we need to get PHP CS Fixer to run is a configuration file. Up here, create a new file called `php-cs-fixer.php`. Inside our new file, I'm just going to paste in about 10 lines of code. This is very simple. I tell PHP CS Fixer where to find my `/src` files, and down here, I tell it what rules to apply. I'm using a pretty standard Symfony set of rules.

Okay, now we're ready to run this. To see what it did, over in the command line, I'm going to add all my changes with

```terminal
git add .
```

and then

```terminal
git status
```

but I'm not going to *commit* them yet. I still want to be able to review the changes that Rector made before I finally commit them. But at least *now* I'll be able to see what PHP CS Fixer does.

Let's run it:

```terminal
./tools/php-cs-fixer/vendor/bin/php-cs-fixer fix
```

And... nice! It modified six files. Let's check this out. Say

```terminal
git diff
```

and... awesome! Basically, what it did in our case is take out those long use statements for the `Response` class across our code base. It also removed a couple of old use statements that we don't need. So the code from Rector still isn't perfect, but that was a nice step forward towards making it better.

*Finally*, let's fix a few things manually. Dig into the changes that were made by Rector one by one. I'll help us out a little bit by zooming into some places that we need to look at. The first one is `RegistrationController.php`. Go to `/src/Controller/RegistrationController.php`. This one of the places it changed from `UserEncoderInterface` to `UserPasswordHasherInterface`. You'll notice that PHP CS Fixer *did* fix a lot of our missing use statements, but not *all* of them, so I'm going to fix this one by hand. I'll hover over this and hit "alt" + "enter" and then go to "Simplify FQN" and it will take that out of the use statement up there for me. The only problem is that, if we trace down to where this was used, previously we were calling `->encodePassword()` on this, but that method doesn't exist on this interface. We need to call `->hashPassword()` instead. So that's a case where Rector didn't *quite* make all the changes we needed.

I'm also going to rename this argument. I'll go to "Refactor" then "Rename" and call it `$userPasswordHasher`, just because that's a more fitting name.

The next thing we need to check out is very similar. It's in `/Factory/UserRepository.php`. Scroll down and... once again, we have a long use statement. Hit "alt" + "enter" and go to "Simplify FQN" to add that use statement, and then I'm going to rename a couple of things again. Go to "Refactor" then "Rename" to call this `$passwordHasher`. And then let's also rename this one. Go to "Refactor" then "Rename" again, and call this `$passwordHasher` as well. Before we go, down here, we need to call this `->hashPassword()` instead of `->encodePassword()`. Perfect!

There's *one more* spot that needs a similar change down here in `/Security/LoginFormAuthenticator.php`. We're going to refactor this class later anyway to have the new security system, but let's at least get it working. Find the `UserPasswordHasherInterface` argument, and simplify that with "Simplify FQN". Then rename the argument `$passwordHasher`, and rename the property `$passwordHasher` as well.

Then we can check to see where that's used. It's used all the way down on the bottom, so if we search for "hasher"... there we go! If you look down here on line 84, this `->isPasswordValid()` actually *does* exist on the new interface, so this is one case where we don't need to change that.

One last change I want to make in here is the `UserNotFoundException`. It has the long line here, so let's click on that and hit "Simplify FQN" again. Beautiful! That should be everything.

The big question now is: "Does our app work?" If we go back to the Homepage... it *doesn't*. We're back on the Welcome page? That's weird...

If you spin back over to your terminal and run

```terminal
./bin/console debug:router
```

you'll see that, in fact, all of our routes are *gone*. This was one other change that Rector made that I need to pay close attention to. It's inside of our `Kernel` class. We're going to talk more about this later when we upgrade our recipes. It changed this use statement here to `RoutingConfigurator`, but it didn't *then* update the code correctly below. So again, Rector is really good for picking some of these things out, but it doesn't always do a perfect job. Fortunately, the entire `configureRoutes()` method has been moved into this `MicroKernelTrait`. So we don't even need to have it in our class anymore. As soon as I delete that method, the *parent* class now holds the correct version, my routes are back, and the page works! Woohoo! And it *hopefully* has a *little* less deprecation than before. I now see 58. Progress!

So what's next after upgrading? We've upgraded our dependencies and we've automated some of the changes with Rector. Well, there's still *one more* thing thing we can do before we start going through all of these deprecations manually, and that's updating the recipes for each of our packages. And this has gotten a whole heck of a lot easier than the last time you upgraded. That's next.
