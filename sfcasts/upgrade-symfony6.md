# Upgrading to Symfony 6.0

Time to upgrade to Symfony 6! Woo! This is a simple composer trick really, but first, just in case, let's run Rector one more time and focus on our code for Symfony. Let's go back to Rector's repository, click the Symfony link, and we're going to steal some code that we had from earlier. Paste that into our `rector.php` file. Then, just like we did for Symfony 5.4, change `SymfonySetList` to `SymfonyLevelSetList`, and this time, say `UP_TO_SYMFONY_60`.

In theory, there shouldn't really be many, if any changes between what your code looks like for Symfony 5.4 and Symfony 6, but let's run this and see what happens. Say `vendor/bin/rector process src` and... hm... okay. It made one change. This is to `EventSubscriber` and it added an `array` return type. This was added because, in the future, this interface may add this `array` return type. So now our code is *future* compatible.

All right, with that done, let's upgrade things one more time. We need to find all of these main Symfony libraries and change the version from `5.4.*` to `6.0.*`. We can do that easily with a little "Find & Replace". Done! Of course, we're not touching any Symfony libraries that have their own versioning scheme. We're just worried about the main stuff. At the bottom, this also changed my extra `symfony` `require` to `6.0.*`.

I think we're ready! As I mentioned before, we could say

```terminal
composer up 'symfony/*'
```

*but* I'm not going to bother with that. Let's update *everything* with just

```terminal
composer up
```

And... it fails! Check this out! One of the libraries I'm using is `babdev/pagerfanta-bundle`, and it says that it requires PHP 7.2, but we are using PHP 8. If you look further down here, there's some errors about `pagerfanta-bundle[v2.8.0]` requiring `symfony/config ^3.4 || ^4.4 || ^5.1`, but not 6. So what's happening here? Turns out, `pagerfanta-bundle[v2.8.0]` does *not* support Symfony 6. If you run

```terminal
composer outdated
```

we can see what our outdated packages are. *Fortunately*, `babdev` has a new `v3.6.1`. Let's go into `composer.json` and find that. Here it is! We'll change to `^3.6`. That's a major version upgrade, so it *may* have some backwards compatibility changes we need to look into. We'll check that out in a second. Try

```terminal
composer up
```

again and... yay! This was a *huge* upgrade, and now everything is upgraded to Symfony 6. And then... at the bottom... it *exploded* while clearing the cache. Uh oh... I think we may have missed a deprecation when we were upgrading our code.

It says in `\UserRepository`, `upgradePassword([...]): void must be compatible with [...]\PasswordUpgraderInterface`. If you want to see this in color, you can refresh the homepage and see the same thing. By the way, one cool thing is that if you have your configuration correct, there's this new thing in Symfony 5.4 where we can actually click this icon here to copy that entire path to your clipboard. So now, if I go back over to my editor, hit "shift" + "shift" and paste, it'll actually copy me straight to that class and the exact method where the problem is happening.

You can see here by this underline that it is *not* happy. And the reason is that `upgradePassword` changed from requiring a `UserInterface` to requiring a `PasswordAuthenticatedUserInterface`. So we just need to change that and... that's it! Nothing else needs to change in here. Back at our terminal, if we run

```terminal
php bin/console cache:clear
```

*now* it's happy. We're still getting some deprecations down here from a different library, but I'm going to ignore those. These actually come from a deprecated package that I really just need to remove from this project entirely. We'll see that in a second.

Let's see if the homepage works now that we've changed some things and... it *doesn't*. We get `Attempted the load class "QueryAdapter" from namespace "Pagerfanta\Doctrine\ORM`. It shouldn't be a surprise, since we *did* upgrade from `pagerfanta-bundle[v2.8.0` to `pagerfanta-bundle[v3.6.1]`. This is a situation where you're going to want to find the GitHub page for that, and *hopefully* they'll have an upgrade document. This actually *does* have an upgrade 3.0, and it's going to tell you some information about what types of things changed. If you read this, what you would discover is that *previously*, you got a whole bunch of classes from the Pagerfanta library that have now been broken down into a bunch of *smaller* libraries. So if you want to use this `QueryAdapter`, you need to install a separate package. We can do that with:

```terminal
composer require pagerfanta/doctrine-orm-adapter
```

Awesome! If we refresh now... another error? This one's actually even better: `Unknown function "pagerfanta". Did you forget to run "composer require pagerfanta/twig" in "question/homepage.html.twig"?`. The twig integration was *also* moved to its own package, so we need to run that command as well. And... after that's done... it's *alive*! We have a Symfony 6 project! Woohoo! If we click around, things seem to be working just fine. We did it!

Over at our command line, if you run

```terminal
composer outdated
```

to see all of the outdated packages we have, our list is now *very* short. One thing I want to highlight here is `knplabs/knp-markdown-bundle`, which *is* fully upgraded, but it's been abandoned. And if you *are* using this in a real project, you should refactor it to use `twig/markdown-extra`. I'm not going to bother doing that, but that's why that's showing up here. The big thing here is that `doctrine/dbal` has a new *major* version. So hey! While we're here upgrading things, let's upgrade that!

Next, we're going to upgrade `doctrine/dbal` to its *latest* version. We're also going to double check our recipe and do one final cleanup.
