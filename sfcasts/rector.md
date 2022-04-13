# Automating Upgrades with Rector

Now that we're on Symfony 5.4, our job is simple: Hunt down and update all of our deprecated code. As soon as we do that, it will be safe to upgrade to Symfony 6. That's because the *only* difference between Symfony 5.4 and 6.0 is that all the deprecated code paths are removed. Fortunately, Symfony is amazing and tells us, via the web debug toolbar, *exactly* what code is deprecated. But understanding what all of these mean isn't always easy. So before we even try, we're going to automate as much of this as possible, And we're going to do that with a tool called Rector. Head to `github.com/rectorphp/rector`. This is an awesome command line tool with *one* job: To automate all sorts of upgrades to your code, like upgrading your code from Symfony 5.0 compatible to Symfony 5.4 compatible, *or* upgrading your code to be PHP 8 compatible. This is an incredibly powerful tool, and if you want to read more about it, they even have a book where you can go deeper and also help support the project.

All right, let's get this thing installed! Head over to your terminal and run

```terminal
composer require rector/rector --dev

to install the command line tool. Beautiful! Now, in order for rector to work, it needs a config file and we can boost step one by running rector with:

```terminal
./vendor/bin/rector init
```

Awesome! That creates a `rector.php` file, which we can see over here at the root of our project. Inside of this callback function here, our job is to configure which types of upgrades we want to apply. We're going to start with a set of Symfony upgrades. If you look back in the documentation, you'll see a little link to Symfony where it tells you about a whole bunch of built-in Symfony rules. Down here, I'll copy the inside of their static function and then paste it over what I have. Basically, this sets up Rector and points to a cache file we have that helps it do its job. It tells it that we want to upgrade our code to be Symfony 5.2 compatible and upgrade our code to some Symfony code quality standards. If you want to know a little bit more about what these do, you could open this constant and follow the code.

But we don't want to upgrade our code to Symfony 5.2. We want to upgrade it *all* the way to Symfony 5.4. You might expect me to just put "54" right here, and I *could* do that. Instead, I'm going to run `SymfonyLevelSetList::` and then say `UP_TO_SYMFONY_54`. Oh... it looks like I also need to add a use statement down here for `SymfonySetList::`. Let me retype that and hit "tab". Great!

What `UP_TO_SYMFONY_54` means is that it will include *all* of the updates to upgrade code from 5.1, 5.2, or 5.3 to 5 4. So instead of listing each of those individually, we can say `UP_TO_SYMFONY_54`, and it will take care of *all* of them. And that's it! We're ready to run this, but before we do, I'm pretty interested in what changes this will make, so I'll commit all of my changes and add the message "Upgrading to Symfony 5.4 & installing Rector". Perfect!

To run Rector, say `./vendor/bin/rector` and then `process`. We can also point at a directory to process, so say `src`. You could also point it at the `config` or `templates` directories, but the vast majority of the stuff it's going to do is in the `src` directory.

And... it's working! Awesome! Eight files have been changed by Rector here. Let's scroll all the way up to the top and check out the rule. This is cool, because it shows you the file that was changed *and* the change that was made in it. And below, it even tells you which rules it applied to get there. One thing it changed is `UserPasswordEncoderInterface` to `UserPasswordHasherInterface`, which is a new interface name. It also changed `UsernameNotFoundException` to `UserNotFoundException`. These are just low-level fixes to deprecated code that we may or may not have been aware of. There was also a change to Kernel's use statement there, and then a couple of other similar changes as you go along. And down here, this is where the coding style added a `Response` return type to all of our controllers. So you can see it didn't make a *ton* of changes, but it *did* fix a couple of our deprecations.

You *may* have noticed that it's not perfect. One problem is that, sometimes, rector will mess with your coding style. That's because rector doesn't really understand what your coding style is, so it doesn't even try.

Second, while it *did* change classes like `UserPasswordEncoderInterface` to `UserPasswordHasherInterface`, it in-lined the *whole* namespace here, instead of adding a use statement.

And third, it didn't change any variable names. So even though it changed this argument to `UserPasswordHasherInterface`, the argument is still called `$passwordEncoder` along with the property. Even worse, the `UserPasswordHasherInterface` has a different method on it, and it didn't update the code down here to change that method. Rector is a great starting point to try to catch a bunch of things, but we're going to need to take what we've found here and finish the job. Let's do that next. We're going to do part of that by hand, but the rest we can do automatically with PHP CS Fixer.
