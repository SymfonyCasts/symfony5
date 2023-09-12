# Automating Upgrades with Rector

Now that we're on Symfony 5.4, our job is simple: hunt down and update all of our
deprecated code. As soon as we do that, it will be safe to upgrade to Symfony 6.
That's because the *only* difference between Symfony 5.4 and 6.0 is that all the
deprecated code paths are removed.

Fortunately, Symfony is amazing and tells us - via the web debug toolbar - *exactly*
what code is deprecated. But understanding what all of these mean... isn't always
easy. So before we even try, we're going to automate as much of this as possible.
And we're going to do that with a tool called Rector.

## Installing Rector

Head to https://github.com/rectorphp/rector. This is an *awesome* command-line tool
with *one* job: to automate all *sorts* of upgrades to your code, like upgrading
your code from Symfony 5.0 compatible code to Symfony 5.4 compatible code. *Or*
upgrading your code to be PHP 8 compatible. It's a powerful tool... and if you want
to learn more about it, they even released a book where you can go deeper... and
also help support the project.

All right, let's get this thing installed! Head over to your terminal and run:

```terminal
composer require rector/rector --dev
```

Beautiful! In order for Rector to work, it needs a config file. And we can bootstrap
one by running rector with:

***TIP
In newer versions of Rector, instead of `./vendor/bin/rector init`, just run
`./vendor/bin/rector` to do the same thing.
***

```terminal
./vendor/bin/rector init
```

Awesome! That creates the `rector.php` file... which we can see over at the
root of our project.

***TIP
The latest version of Rector will generate config that looks a bit different than this. But don't worry,
it still works exactly the same.
***

Inside of this callback function, our job is to configure
which *types* of upgrades we want to apply. These are called "rules" or sometimes
"set lists" or rules. We're going to start with a set of Symfony upgrades.

[[[ code('78b4802847') ]]]

## Configuring Rector for the Symfony Upgrade

If you look back at the documentation, you'll see a link to a
[Symfony repository](https://github.com/rectorphp/rector-symfony) where it tells
you about a bunch of Symfony "rules" - fancy word for "upgrades" - that they've
already prepared! That was nice of them!

***TIP
The config on this page will now look different than in the video. But, it still works the same. Copy
the latest version into your app.
***

Below, copy the inside of their callback function... and paste it over what we have.

[[[ code('823e1917b2') ]]]

This points Rector to a cache file that helps it do its job... and most importantly,
it tells Rector that we want to upgrade our code to be Symfony 5.2 compatible, as
well as upgrade our code to some Symfony code quality standards and "constructor"
injection. If you want to know more about what these do, you could follow the
constants to check out the code.

But, wait, we don't want to upgrade our code to Symfony 5.2! We want to upgrade it
*all* the way to Symfony 5.4. You might expect me to just put "54" here. And
we *could* do that. But instead, I'm going to use
`SymfonyLevelSetList::UP_TO_SYMFONY_54`. Oh... it looks like I also need to add a
`use` statement for `SymfonySetList::`. Let me retype that, hit "tab" and... great!

[[[ code('70d7fc2a83') ]]]

Anyways. We need to upgrade our code from 5.0 to 5.1... then 5.1 to 5.2.. and so
on *up* to Symfony 5.4. That's what `UP_TO_SYMFONY_54` means: it will include *all*
of the "rules" for upgrading our code to 5.1, 5.2, 5.3 and finally 5.4.

And... that's it! We're ready to run this. But before we do, I'm curious what
changes this will make. So let's add all of the changes to git... and commit.
Perfect!

## Running Rector

To run Rector, say `./vendor/bin/rector process src/`. We could also point this
at the `config/` or `templates/` directories... but the vast majority of the changes
it will make apply to our classes in `src/`:

```terminal-silent
vendor/bin/rector process src/
```

And... it's working! Awesome! Eight files were changed by Rector. Let's
scroll to the top. This is cool: it shows you the file that was changed, the
actual *change* and, below, which *rules* caused that change.

One modificiation it made is `UserPasswordEncoderInterface` to
`UserPasswordHasherInterface`. That's a good change: the old interface is deprecated
in favor of the new one. It also changed `UsernameNotFoundException` to
`UserNotFoundException`. Another good, low-level update to some deprecated code.

There was also a change to a class in `Kernel`... and a few other similar things.
Near the bottom, the Symfony code quality set list added a `Response` return type
to every controller. That's optional... but nice!

So it didn't make a *ton* of changes, but it *did* fix a few deprecations without
us needing to do *anything*.

Though... it's not perfect. One problem is that, sometimes, Rector will mess with
your coding style. That's because Rector doesn't really understand what your coding
style is... and so it doesn't even try. But that's by design and will be easy
to fix.

Second, while it *did* change the interface from `UserPasswordEncoderInterface` to
`UserPasswordHasherInterface`, it inlined the *whole* class name... instead of
adding a `use` statement.

[[[ code('56251b8246') ]]]

And third, it didn't change any variable names. So even though it changed this
argument to `UserPasswordHasherInterface`, the argument is still called
`$passwordEncoder`... along with the property. Worse, the
`UserPasswordHasherInterface` has a different *method* on it... and it didn't update
the code down here to *use* that new method name.

[[[ code('e8ad63ade3') ]]]

So Rector is a *great* starting point to catch a bunch of changes. But we're
going to need to take what we've found and finish the job. Let's do that next.
We'll do part of that by hand... but a lot of it automatically with PHP CS Fixer.
