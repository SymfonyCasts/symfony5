# Upgrading to Symfony 6.0

Finally, it's time to upgrade to Symfony 6! Woo!

## Rector Upgrades to 6.0

But first, just in case, let's run Rector *one* more time. Go back to Rector's
repository, click the Symfony link, and... steal the same code that we had
earlier. Paste that into our `rector.php` file. Then, just like we did for Symfony
5.4, change `SymfonySetList` to `SymfonyLevelSetList`, and this time, say
`UP_TO_SYMFONY_60`.

[[[ code('8ba578b07b') ]]]

In theory, there shouldn't be *any* code differences needed between Symfony 5.4
and 6.0... though sometimes there are minor cleanups you can do once you *have*
upgraded.

Let's run this and see what happens. Say:

```terminal
vendor/bin/rector process src/
```

And... okay. It made one change. This is to our event subscriber: it added an `array`
return type. This was done because, in the future, this interface may add an
`array` return type. So now our code is *future* compatible.

[[[ code('469b470d19') ]]]

## Upgrading via Composer

With that done, let's upgrade! In `composer.json`, we need to find the main Symfony
libraries and change their version from `5.4.*` to `6.0.*`. Let's take the lazy
way out and do that with a "Find & Replace".

[[[ code('b20f0683ca') ]]]

Awesome! Like before, we're not touching any Symfony libraries that are *not* part
of the main package and which follow their *own* versioning scheme. Oh, and at
the bottom, this *did* also change `extra.symfony.require` to `6.0.*`.

So, we're ready! Just like before, we *could* say:

```terminal
composer up 'symfony/*'
```

*But*... I'm not going to bother with that. Let's update *everything* with just:

```terminal
composer up
```

And... it fails! Hmm. One of the libraries I'm using is
`babdev/pagerfanta-bundle`... and apparently it requires PHP 7.2... but we're using
PHP 8. If you look further, there are some errors about
`pagerfanta-bundle[v2.8.0]` requiring `symfony/config ^3.4 || ^4.4 || ^5.1`, but not
Symfony 6. So what's happening here? It turns out that `pagerfanta-bundle[v2.8.0]`
does *not* support Symfony 6. Gasp!

Run

```terminal
composer outdated
```

to see a list of outdated packages. Oooh! `babdev/pagerfanta-bundle` has a new
version `3.6.1`. Go into `composer.json` and find that... here it is! Change its
version to `^3.6`.

[[[ code('2ac1f8804a') ]]]

This *is* a *major* version upgrade. So it *may* contain some backwards compatibility
breaks. We'll check into that in a minute. Try:

```terminal
composer up
```

again and... it's doing it! Everything just upgraded to Symfony 6!

## Fixing PasswordUpgraderInterface::upgradePassword()

And then... to celebrate... it immediately *exploded* while clearing the cache.
Uh oh... I think we may have missed a deprecation:

> In `UserRepository`, `upgradePassword([...]): void` must be compatible with
> `PasswordUpgraderInterface`.

If you want to see this in color, you can refresh the homepage to see the same thing.

By the way, in Symfony 5.4, we can now click this icon to copy the file path to
our clipboard. Now, if I go back over to my editor, hit "shift" + "shift" and
paste, I jump *directly* to the file - and even the *line* - where the problem is.

And... phew! PhpStorm is *not* happy. That's because the `upgradePassword()` method
changed from requiring a `UserInterface` to requiring a
`PasswordAuthenticatedUserInterface`. So we just need to change that and... done!

[[[ code('936b7a4e9f') ]]]

Back at our terminal, if we run:

```terminal
php bin/console cache:clear
```

*Now* it's happy. We're still getting some deprecations down here from a different
library... but I'm going to ignore those. These come from a deprecated package
that... I really just need to remove from this project entirely.

## PagerFanta Updates

Let's go make sure the homepage works. It... doesn't!? We get

> Attempted the load class `QueryAdapter` from namespace "`Pagerfanta\Doctrine\ORM`.

This shouldn't be a surprise... since we *did* upgrade pagerfanta-bundle from
2.8 to 3.6.

This is a situation where you need to find the GitHub page for the library and
*hope* that they have an upgrade document. This one actually *does*. If you read
this closely, you'd discover that a bunch of classes that were *previously* part
of Pagerfanta have now been broken into *independent* libraries. So if we want
to use this `QueryAdapter`, we need to install a separate package. Do that with:

```terminal
composer require pagerfanta/doctrine-orm-adapter
```

Cool... and if we refresh now... another error? This one's even better:

> Unknown function `pagerfanta`. Did you forget to run
> `composer require pagerfanta/twig` in `question/homepage.html.twig`?.

The Twig integration was *also* moved to its own package... so we need to run that
command too:

```terminal-silent
composer require pagerfanta/twig
```

And... after that's done... it's *alive*! We have a Symfony 6 project! Woohoo! If
we click around, things seem to be working just fine. We did it!

## Checking for Outdated Packages

Over at our command line, run

```terminal
composer outdated
```

to see all of the outdated packages we have left. The list is now *very* short. One
package is `knplabs/knp-markdown-bundle`, which *is* fully upgraded... but it's
been abandoned. If you have this in a real project, refactor it to use
`twig/markdown-extra`. I'm not going to bother, but that's why it's
on this list.

The biggest thing here is that `doctrine/dbal` has a new *major* version!
So hey! While we're here upgrading things, let's upgrade it too! That's next, along
with some final cleanups.
