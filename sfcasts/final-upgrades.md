# Some Final Upgrades

While we're doing all of these major upgrades, we might as well make sure *everything* is upgraded. When we run

```terminal
composer outdated
```

it gives us a list of all of the things we still need to update. As I mentioned, we're going to ignore the `knplabs/knp-markdown-bundle`, but if you have that in a real project, you should refactor that to use the new `twig/markdown-extra`. What *I'm* interested in here is `doctrine/dbal`, which has a new major version we can upgrade to. But this begs the question: Why didn't this upgrade *automatically* when we ran `composer up`?  Let's run

```terminal
composer why-not doctrine/dbal 3
```

where `3` is the version number. According to this, we're actually holding it back. It says our project requires `doctrine/dbal (^2.13)`. Whoops...

If we head over to our `composer.json` file... sure enough, there it is - `^2.13`. Let's change that to the latest `^3.3`. Okay, moment of truth. Run

```terminal
composer up
```

and... woo! It updated! If we run

```terminal
composer outdated
```

again, other than the `knp-markdown-bundle`, it's empty. Yay! We just implemented a major version upgrade, so it *does* contain backwards compatibility breaks. You'll want to look into its change log a bit deeper, but I can tell you that it mostly just affects you if you are running `doctrine/dbal` queries directly. Typically, when you're using the Doctrine ORM with entities, you're not doing that. On our site... we seem to be just fine.

All right, now that we've just upgraded from Symfony 5.4 to 6.0, it's possible that some recipes have a new version we can upgrade to. Run:

```terminal
composer recipes:update
```

Oh, whoops! I need to commit my changes:

```terminal
git commit -m 'upgrading doctrine/dbal from 2 to 3'
```

Perfect! *Now* run

```terminal
composer recipes:update
```

and... cool! There are actually two. Start with `symfony/routing`. Okay, it looks like we have a conflict. Run:

```terminal
git status
```

We can see here that it changed `config/routes.yaml`, so let's check that out. Okay, so previously, I commented out this route here, and the update added the `controllers` and `kernel` imports. Let's keep *their* changes. These are actually importing our route annotations or attributes from the `../src/Controller` directory. If you want to, you can also put routes in your `../src/Kernel.php` file. It says `type: annotation` here, but this is actually an *importer* that's able to load annotations *or* attributes. One of the nice things about Symfony 6 is you can load attributes, in particular, without any external library. It's just part of the routing system, so we can put these route imports right in our main `config/routes.yaml`. Let's go ahead and commit that because this is going to make even *more* sense after we upgrade the last recipe. Perfect!

Run

```terminal
composer recipes:update
```

again and, this time, let's update the `doctrine/annotations` recipe. Oh, and check this out. It deleted `config/routes/annotations.yaml`. And if you look closely, that actually contains the two lines we just added. Basically, what happened here is that previously, when we only had annotation routes, we needed the Doctrine Annotations Library enabled to be able to import them. So we only gave you these imports once you installed the Doctrine Annotations Library. But now that we use route *attributes*, that's not true. You don't even need the Doctrine Annotations Library anymore. Just by installing Symfony's routing components, we give you these lines, which are able to route attributes from the classes in our `/Controller` directory. If we look over here, nothing changes on our front end. All of our routes *still* work.

*Finally*, now that we're on Symfony 6, we can remove some code that was only needed to keep things working on Symfony 5. There's not much of this that I'm aware of. The only code I can think of is in `User.php`. As I mentioned earlier, in Symfony 6, the `UserInterface`... I'll click into that... renamed `getUsername()` to `getUserIdentifier()`. In Symfony 5.4, to remove the deprecations but keep your code working, you actually need to have both the new one *and* the old one. But as soon as you upgrade to Symfony 6, you don't need the old one anymore. Just make sure you're not calling it directly in your code somewhere.

One other spot, down here... is `getSalt()`. This is an old method related to how you hash passwords, and it's no longer needed in Symfony 6. Modern password hashing algorithms take care of the salting themselves, so this is a completely unused method. So yay! That's it team! We're done! Our Symfony 6 app is fully upgraded! We upgraded recipes, PHP 8 code, and PHP 8 attributes instead of annotations. That was a *ton* of stuff, and we just modernized our code base *big time*.

I think this deserves a whole pizza to celebrate. Then come right back, because I want to take a quick test drive of a few more features that we haven't talked about. That's next.
