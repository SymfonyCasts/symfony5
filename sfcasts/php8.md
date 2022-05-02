# PHP 8

Let's keep track of our goal. Now that we've upgraded to Symfony 5.4, as soon as we remove all of these deprecations, we can *safely* upgrade to Symfony 6. *But* Symfony 6 requires PHP 8, and I've been building this project in PHP 7. So the next step is to update our code to be PHP 8 compatible. For the most part, that actually means updating some of our code to use some of the cool new PHP 8 features. Woo! This is another spot where Rector can help us.

Start by opening up the `rector.php` file and remove the three Symfony upgrade lines here. Instead, replace it with `LevelSetList::UP_TO_PHP_80`. Just like with Symfony, you can upgrade *specifically* to PHP 7.3 or 7.4, but they have these nice `UP_TO_[...]` statements that will upgrade our code across all versions of PHP *up to* PHP 8.0. And that's all we need!

Over at the terminal, as a reminder, we've committed all of our changes, except for the one we just made. So now we can run:

```terminal
vendor/bin/rector process src
```

Nice! Now we can walk through some of these changes. If you want to look even deeper, you can search for a gitrector.org blog post, which shows you how to do what we just did, but *also* gives you more information about what Rector did behind the scenes. For example, one of the changes that it makes is replacing `switch()` statements with a new PHP 8 `match()` function. It explains a ton of other instances just like this one, so if you're interested, I recommend checking this out.

The most important change, which is *coincidentally* the most common, is something called "Promoted Properties". This is one of my favorite features in PHP 8, and you can see it right here. In PHP 8, you can actually put a `private`, `public`, or `protected` keyword right before an argument of the constructor, and that creates and sets the property. So you no longer need to create a property manually or set it below. Just adding *that* creates the property and sets it all at once, making your constructors easier to read.

The vast majority of the changes in this file are exactly that. Here's another example in `MarkdownHelper`. Most of the other changes are *pretty* small. It alters some of our callback functions to use the new short `=>` syntax, which is actually from PHP 7.4. You can also see, down here, an example of refactoring `switch()` statements to use the new `match()` function. All of this is optional, but it's nice that our code has been updated to use some of these new features. If I scroll down just a little more, you'll see more of the same types of changes.

All right, inside of our entity, you may notice that, in some cases, it added property types. In the case of `$roles`, our property was initialized to an array. Rector *realized* it's an array, so it added the array typend. In other cases, like this `$password`, it saw that it had PHPDoc on it, so it added this as well. Though, this is a little questionable here. This `$password` should actually be *nullable*. Let's open up `/src/Entity/User.php` and scroll down to `$password`.

Right now, this has a string type, but it's not accurate. At first, this is going to be null. If you look at the constructor down here, we don't initialize `$password` to any value, which means it's null. So the *correct* type for this is a nullable `?string`. The reason Rector did this wrong is because I had a bug in my documentation up here. This should be `string|null`.

One of the biggest changes that I've been doing in my code over the past year or so, since PHP 7.3 was released, was adding property types like this, both in my entity classes and also my service classes. If this was a little confusing, don't worry. We're going to talk more about property types in a few minutes. You can see that Rector added *some* of them, but a lot of our properties are still missing them, so we'll add them by hand. It's going to make our code a little cleaner.

Okay, our code is *now* ready for PHP 8. Yay! So let's go upgrade our *dependencies* for PHP 8. In `composer.json`, under the `require` key, it currently says that my project works with PHP 7.4 or 8. I'm going to change that to just say `"php": "^8.0.2"`, which is the minimum version for Symfony 6.0. By the way, Symfony 6.1 requires PHP 8.1, so if you're going to upgrade to that pretty soon, you could go ahead and do all of these upgrades all the way to PHP 8.1.

There's one other thing I have down here near the bottom. Let's see... here we go. On our `config` `platform`, I have PHP set to 7.4. That basically ensured that if someone using PHP 8 was using my project, when they downloaded the new dependencies, it doesn't download dependencies that were compatible with PHP 8. It *instead* downloads dependencies that are compatible with 7.4. We'll change this to `8.0.2`. Great! And now, because we're using a new version of PHP in our project, there's a good chance some dependencies will be eligible for updates. Let's run:

```terminal
composer up
```

And... yeah! There are several. It looks like `psr/cache`, `psr-log`, and `symfony/event-dispatcher-contracts` all upgraded. I'm guessing that all of these new versions require PHP 8. We couldn't upgrade before, but now we *can*. If we go over to our page and reload... everything still works! And *hopefully* we have a few less deprecations. Maybe we do, maybe we don't. But our code is a little more ready.

One other thing in `composer.json` is Symfony Flex itself. Symfony Flex uses its own version scheme, and the latest version is 2.1.At the moment, this version is actually the *same* as version 1, but version 2.1 requires PHP 8. Since we're using PHP 8 now, let's upgrade to that. Change this to `^2.1`, then head back to your terminal and run

```terminal
composer up
```

one more time. Beautiful!

All right, team! Our project is now using PHP 8. To celebrate, let's refactor from using annotations on our site to PHP 8 native attributes - a change that I love and one that Rector is going to make *very* easy.
