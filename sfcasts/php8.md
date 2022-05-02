# Upgrading to PHP 8

Let's keep track of our goal. Now that we've upgraded to Symfony 5.4, as soon as
we remove all of these deprecations, we can *safely* upgrade to Symfony 6. *But*
Symfony 6 requires PHP 8, and I've been building this project in PHP 7. So the *next*
step is to update our code to be PHP 8 compatible. In practice, that means updating
parts of our code to use some cool new PHP 8 features. Woo! And this is another spot
where Rector can help us.

## Rector Upgrading To PHP 8!

Start by opening up `rector.php` and removing the three Symfony upgrade
lines. Replace these with `LevelSetList::UP_TO_PHP_80`. Just like with Symfony, you
can upgrade *specifically* to PHP 7.3 or 7.4, but they have these nice `UP_TO_[...]`
statements that will upgrade our code across all versions of PHP *up to* PHP 8.0.

And... that's all we need!

Over at your terminal, I've committed all of my changes, except for the one we just
made. So now we can run:

```terminal
vendor/bin/rector process src
```

Cool! Let's walk through some of these changes. If you want to go deeper,
search for a [getrector.org blog post](https://getrector.org/blog/2020/11/30/smooth-upgrade-to-php-8-in-diffs),
which shows you how to do what we just did... but *also* gives you more information
about what Rector did and *why*.

For example, one of the changes that it makes is replacing `switch()` statements
with a new PHP 8 `match()` function. This explains *that*... and many other
changes. Oh, and the vast majority of these changes aren't *required*: you don't
*have* to do them to upgrade to PHP 8. They're just nice.

## PHP 8 Property Promotion

The most important change, which is *coincidentally* the most common, is something
called "Promoted Properties". This is one of my favorite features in PHP 8, and you
can see it right here. In PHP 8, you can add a `private`, `public`, or
`protected` keyword right before an argument in the constructor... and that will
both *create* that property and *set* it to this value. So you no longer need to
add a property manually or set it below. Just add `private` and... done!

The vast majority of the changes in this file are exactly that... here's another
example in `MarkdownHelper`. Most of the *other* changes are minor. It altered
some callback functions to use the new short `=>` syntax, which is actually
from PHP 7.4. You can also see, down here, an example of refactoring `switch()`
statements to use the new `match()` function. All of this is optional, but it's nice
that our code has been updated to use some of the new features. If I scroll down
just a little more, you'll see more of these.

## Entity Property Types?

Oh, and inside of our entities, notice that, in some cases, it added property types!
For `$roles`, this property is initialized to an array. Rector *realized*
that... so it added the `array` type. In other cases, like `$password`, it saw
that we have PHPDoc above it, so it added the type there as well. Though, this
is a little questionable. The `$password` *could* also be null.

Open up `src/Entity/User.php` and scroll down to `$password`. Rector gave this
a `string` type... but that's wrong! If you look at the constructor down here, we
don't initialize `$password` to any value... which means it will *start* `null`.
So the *correct* type for this is a *nullable* `?string`. The reason Rector did
this wrong is... well.. because *I* had a bug in my documentation!. This should be
`string|null`

One of the biggest changes that I've been doing in my code over the past year or so
since PHP 7.3 was released, has been adding property types like this, both in my
entity classes and also my service classes. If this was a little confusing, don't
worry. We're going to talk more about property types inside of *entities* in a few
minutes. You can see that Rector added *some*, but a lot of our properties
are still missing them.

## Setting PHP 8 in composer.json

Okay, our code *should* now be ready for PHP 8. Yay! So let's go upgrade our
*dependencies* for PHP 8. In `composer.json`, under the `require` key, it currently
says that my project works with PHP 7.4 or 8. I'm going to change that to just say
`"php": "^8.0.2"`, which is the minimum version for Symfony 6.0. By the way, Symfony
6.1 requires PHP 8.1. So if you're going to upgrade to that pretty soon, you could
jump straight to 8.1.

There's one other thing I have down here near the bottom. Let's see... here we go. On
`config`, `platform`, I have PHP set to 7.4. That ensures that if someone is using
PHP 8, Composer will *still* make sure it downloads dependencies compatible with
PHP 7.4. Change this to `8.0.2`.

Sweet! And now, because we're using PHP 8 in our project, there's a good chance
some dependencies will be eligible for updates. Run:

```terminal
composer up
```

And... yeah! There are several. It looks like `psr/cache`, `psr/log`, and
`symfony/event-dispatcher-contracts` all upgraded. Most likely all of these new
versions require PHP 8. We couldn't upgrade before, but now we *can*. If we go over
to our page and reload... everything still works!

## Updating Symfony Flex

One other thing in `composer.json` is Symfony Flex itself. Flex uses its own
version scheme, and the latest version is 2.1. At this moment, Flex version 2
and Flex version 1 are identical... except that Flex 2 requires PHP 8. Since we're
using that, let's upgrade! Change the version to `^2.1`... then head back to your
terminal and run:

```terminal
composer up
```

one more time. Beautiful!

All right, team! Our project is now using PHP 8. To celebrate, let's refactor from
using annotations to PHP 8 native attributes. OOOoo. I love this change... in part
because Rector makes it *super* easy.
