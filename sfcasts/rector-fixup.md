# Post-Rector Cleanups & Tweaks

Rector just automated several changes to our app that are needed to remove
deprecations on Symfony 5.4. *Plus* it did some bonus refactoring, like adding the
optional `Response` return type on our controllers.

But as nice as that is, it's not *perfect*. All the class names are inlined,
instead of having a `use` statement. And even though it renamed some interfaces, it
didn't rename the methods that we *call* on those objects to reflect the change.
No need to worry, though. Rector gave us a great start and helped highlight several
changes that we need to make. Now, let's finish the job.

## Installing php-cs-fixer

First, for these long class names with no `use` statement and, in general for coding
styles, Rector doesn't know what coding style we prefer, so it doesn't even try
to format things correctly. The official recommendation is to use a tool in your
project like PHP CS Fixer to reformat the code *after* running Rector. PHP CS Fixer
is a great tool anyway... so let's get it installed so it can help us along
our journey.

You can install PHP CS Fixer a few different ways, but oddly enough, the
*recommended* way - and the way that I like - is to install it via Composer into
its own directory. Run:

```terminal
mkdir -p tools/php-cs-fixer
```

There's nothing special here: just a new `tools/` directory with `php-cs-fixer/`
inside. Now install it *into* that directory by running
`composer require --working-dir=tools/php-cs-fixer` - that tells Composer to behave
like I'm running it from inside of `tools/php-cs-fixer` - and then
`friendsofphp/php-cs-fixer`.

If you're wondering why we're not just installing this directly into our *main*
`composer.json` dependencies, well... that's a bit tricky. PHP CS Fixer is a
standalone executable tool. If I install it into our *app's* dependencies, then
it could cause problems if some of *its* dependencies don't match versions that
we have already in our app. Well, really, this is a potential problem whenever you
install *any* library. But since all we need is a standalone binary... there's no reason to mix it into our app. We could have done the same thing with Rector.

This gives us, in that directory, `composer.json` and `composer.lock` files. And
in *its* `vendor/bin` directory... yes: `php-cs-fixer`. *That's* the executable.

And because we have a new `vendor/` directory, open up the root `.gitignore` file
and, at the bottom, *ignore* that: `/tools/php-cs-fixer/vendor`. And while we're
here, let's also ignore `/.php-cs-fixer.cache`. That's a cache file that PHP CS
Fixer will create when it does its work.

[[[ code('1915cbf8cc') ]]]

## Adding php-cs-fixer Config

The *last* thing we need to do is add a config file. Up here, create a new file called
`.php-cs-fixer.php`. Inside, I'm going to paste about 10 lines of code. This is
pretty simple. It tells PHP CS Fixer where to find our `src/` files... then,
below, which *rules* to apply. I'm using a pretty standard Symfony set of rules.

[[[ code('235dd5df15') ]]]

And... we're ready to run this! To see what it does, over at the command line,
add all the changes to git with:

```terminal
git add .
```

Then check on them:

```terminal-silent
git status
```

But don't *commit* them yet. I still want to be able to review the changes
that Rector made before we *finally* commit. But at least, *now*, we'll be able to
see what PHP CS Fixer does.

Let's run it:

```terminal
./tools/php-cs-fixer/vendor/bin/php-cs-fixer fix
```

And... nice! It modified 6 files. Let's check them out!

```terminal
git diff
```

Awesome! It removed the *long* class names for `Response` across our entire codebase!
It also deleted a few old `use` statements that we don't need. So the code from
Rector still isn't perfect, but that was a nice step towards making it better!

## Fixing the Password Hasher Code

For the final fixes, we'll do them manually by digging into the changes that Rector
made, one by one. I'll help out by zooming us into the places that need updates.

The first is `RegistrationController`: `src/Controller/RegistrationController.php`.
This is one of the places where it changed `UserPasswordEncoderInterface` to
`UserPasswordHasherInterface`. Notice that PHP CS Fixer *did* fix a lot of
the *long*, inlined class names... but not *all* of them. It depends on if there
was already a `use` statement for that class or not.

So let's fix this by hand. Hover over the class, hit "alt" + "enter" and then
go to "Simplify FQN". That shortens it and adds the `use` statement on top.

[[[ code('ef0afb3c2f') ]]]

But there's another problem. If we trace down to where this is used, previously
we were calling `->encodePassword()`. But... that method doesn't exist on the
new interface! We need to call `->hashPassword()`.

I'm also going to rename the argument. Go to "Refactor" then "Rename" and call
it `$userPasswordHasher`... just because that's a more fitting name.

[[[ code('26d91653ae') ]]]

Next up is `src/Factory/UserFactory.php` for the *same* change. Scroll down and...
once again, we have a long class name. Hit "alt" + "enter" and go to "Simplify
FQN" to add that `use` statement. Then... let's "Refactor" and "Rename" the
argument to `$passwordHasher`... good... and "Refactor", "Rename" the property
*also* to `$passwordHasher`.

[[[ code('3d7190c49d') ]]]

Finally, below, we need to call `->hashPassword()` instead of `->encodePassword()`.

[[[ code('b12a0bd471') ]]]

Done!

Just *one* more spot where we need this same change:
`src/Security/LoginFormAuthenticator.php`. We're going to refactor this class later
to use the new security system... but let's at least get it working. Find the
`UserPasswordHasherInterface` argument, shorten that with "Simplify FQN"... then
rename the argument to `$passwordHasher`... and rename the property to
`$passwordHasher`.

[[[ code('20582a68fc') ]]]

Then we check to see where this is used... I'll search for "hasher"... there
we go! Down on line 84, the `->isPasswordValid()` actually *does*
exist on the new interface, so this is one case where we *don't* need to change
anything else.

[[[ code('4e44da103d') ]]]

Oh, but while we're in here, the `UserNotFoundException` is another *long* class
name. Hit "Simplify FQN" again.

Beautiful! That should be everything.

The big question *now* is: does our app work? If we go back to the Homepage... it
*doesn't*. We're back on the Welcome to Symfony page? That's weird...

Spin back over to your terminal and run:

```terminal
php bin/console debug:router
```

Wow. In fact, *all* of our routes are *gone*. This is due to one other change
that Rector made that we need to pay close attention to. It's inside of our `Kernel`
class. We're going to talk more about this class later when we upgrade our recipes.
Rector changed the argument to `RoutingConfigurator`, but it didn't update the
code below. 

[[[ code('338cffd1cf') ]]]

So again, Rector is really good for finding some of these changes,
but you should always double-check the final result.

Fortunately, the entire `configureRoutes()` method has been moved into this
`MicroKernelTrait` - a fact I'll talk about more soon. So we don't need this
method in our class at *all* anymore. As soon as we delete it, the correct
version from the trait is used... our routes are back.... and the page works!
Woohoo!

And *hopefully* we have a *few* less deprecations than before. I now see 58.
Progress!

So what's next? We've upgraded our dependencies and automated *some* of the changes
we need with Rector. Well, there's still *one more* thing we can do before
we start going through each deprecation manually: updating our *recipes*. And this
has gotten a *whole* heck of a lot easier than the last time you upgraded. Let's
find out how next.
