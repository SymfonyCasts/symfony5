# Final Upgrades & Cleanups

While we're doing all of these major upgrades, we might as well make sure
*everything* is upgraded. When we run

```terminal
composer outdated
```

it gives us a list of all of the things we still need to update. As I mentioned,
we're going to ignore `knplabs/knp-markdown-bundle`. But if you have that in a
real project, refactor it to use `twig/markdown-extra`.

## Upgrading doctrine/dbal to v3

What *I'm* interested in is `doctrine/dbal`, which has a new *major* version we can
upgrade to. But... this begs the question: Why didn't this upgrade *automatically*
when we did `composer up`? Run

```terminal
composer why-not doctrine/dbal 3
```

to find out what is preventing us from upgrading to version *3* of this package.
Of course! *We're* holding it back. It says that *our* project requires
`doctrine/dbal (^2.13)`. Whoops...

Head over to `composer.json` and... sure enough: `^2.13`. Change that
to the latest `^3.3`. Moment of truth. Run

[[[ code('b11850acb9') ]]]

```

```terminal
composer up
```

And... woo! It updated! Do

```terminal
composer outdated
```

again. Alright! Other than `knp-markdown-bundle`, this is empty.

We *did* just perform a *major* version upgrade. So the new version *does* contain
backwards-compatibility breaks. You'll want to look into the library's CHANGELOG
a bit deeper to make sure you're not affected. *But*, I can tell you that most
of the changes relate to if you're using `doctrine/dbal` directly, for example
to make queries direclty in DBAL. Typically, when you're working with the Doctrine
ORM & entities - even if you're making custom queries - you're not doing that.
On our site... we seem to be just fine.

## Final Recipe Upgrades

Now that we've upgraded from Symfony 5.4 to 6.0, it's *possible* that some recipes
have new versions we can update to. Run:

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

and... cool! There are *two*. Start with `symfony/routing`. And... we have conflicts!
Run:

```terminal
git status
```

## Moving Route Attribute Loading

The problem is in `config/routes.yaml`. Let's check that out. Ok, so previously,
*I* commented out this route. 

[[[ code('a045dab4ee') ]]]

The recipe update added the `controllers` and `kernel` imports. Let's 
keep *their* changes. These are actually importing our route annotations 
or attributes from the `../src/Controller` directory... and also allowing
you to add routes and controllers directly to your `Kernel.php` file.

[[[ code('06b59dcc73') ]]]

It says `type: annotation`... but that importer is able to load annotations *or*
PHP 8 attributes. One of the nice things about Symfony 6 is that you can load
route *attributes* without *any* external library. It's just... part of the routing
system. For that reason, these route imports were added to our main
`config/routes.yaml` file when we install `symfony/routing`.

Go ahead and commit that. This change will make even *more* sense after we upgrade
the *final* recipe.

Run

```terminal
composer recipes:update
```

again and, this time, let's update the `doctrine/annotations` recipe. Interesting.
It *deleted* `config/routes/annotations.yaml`. If you look closely, that actually
contained the two lines that were added by the *previous* recipe update!

Here's the deal. Back before PHP 8 - when we only had annotation routes - the
`doctrine/annotations` library was *required* to import route annotations. So we
only *gave* you these imports lines once you *installed* that library.

But now that we use  *attribute* routes, that's no longer true! We do *not* need
the `doctrine/annotations` package anymore. For that reason, we now *immediately*
give you these attribute route import lines as *soon* as you install the routing
component.

If we look over here, nothing changes on our front end. All of our routes *still*
work.

## Removing Un-needed Code

*Finally*, now that we're on Symfony 6, we can remove some code that was only needed
to keep things working on Symfony 5. There's not much of this that I know of...
the only I can think of is in `User.php`.

As I mentioned earlier, in Symfony 6, `UserInterface`... I'll click into that...
renamed `getUsername()` to `getUserIdentifier()`. In Symfony 5.4, to remove the
deprecations but keep your code working, we need to have *both* of these methods.
But as soon as you upgrade to Symfony 6, you don't need the old one anymore! Just
make sure that you're not calling this directly from *your* code.

[[[ code('1f9ea6bbee') ]]]

Another spot down here... is `getSalt()`. This is an old method related to how you
hash passwords, and it's no longer needed in Symfony 6. Modern password hashing
algorithms take care of the salting themselves, so this is completely useless.

And... that's it team! We're done! Our Symfony 6 app is fully upgraded! We
upgraded recipes, updated to PHP 8 code, are using PHP 8 attributes instead of
annotations and more. That was a *ton* of stuff... and we just modernized our
codebase *big time*.

I think this deserves a *whole* pizza to celebrate. Then come right back, because
I want to take a quick test drive of a few more new features that we haven't talked
about. Those are next.
