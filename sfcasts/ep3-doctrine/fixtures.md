# Data Fixtures

Our `/questions/new` page is nice... it gave us a simple way to create and save
some dummy data, so that we could have enough to work on the homepage & show page.

Having a rich set of data to work with while you're developing is *pretty* important.
Without it, you're going to spend a lot of time constantly setting up your database
before you work on something. It's a *big* waste in the long-run.

## Installing DoctrineFixturesBundle

This "dummy data" has a special name: data fixtures. And instead of creating them
in a random controller like `QuestionController`, we can install a bundle to
do it properly. Find your terminal and run:

```terminal
composer require orm-fixtures --dev
```

This is another flex alias: `orm-fixtures` installs `doctrine/doctrine-fixtures-bundle`

When this finishes... it installed a recipe! I committed all of my changes before
recording, so I'll run:

```terminal
git status
```

to see what it did. Ok: it updated the normal `composer.json`, `composed.lock`
and `symfony.lock` files, it enabled the bundle *and* ooh: it created a new
`src/DataFixtures/` directory! Let's go see what's inside `src/DataFixtures/` -
a shiny new `AppFixtures` class!

The DoctrineFixturesBundle that we just installed is a *beautifully* simple bundle.
First, we create one or more of these fixture classes: classes that extend
`Fixture` and have this `load()` method. Second, inside `load()`, we write normal
PHP code to create as many dummy objects as we want. And third, we run a new
console command that will call the `load()` method on every fixture class.

## Fixing the Type-Hint

Before we get to work, PhpStorm is mad! The details aren't too important and
this code *would* work... despite what PhpStorm is saying. But to remove the warning
and make our code future-proof with newer versions of Doctrine, find the
`ObjectManager` type-hint and replace it with one from `Doctrine\Persistence`.

## Creating Dummy Data

Anyways: let's see this bundle in action. Find the `new()` method in the controller,
copy *all* of the question-creating code and delete it. We'll *properly* create
this page in a future tutorial when we talk about forms... so let's just render
that: this sounds like a *great* feature for V2!

Back in `AppFixtures`, paste the code and... check it out! PhpStorm was smart enough
to *see* that we're using the `Question` class and ask us if we want to import
its `use` statement. We definitely do!

The only problem now is that we don't have an `$entityManager` variable. Hmm,
but we *do* have a `$manager` variable that's passed to the `load()` method - it's
an `ObjectManager`?

This is *actually* the entity manager in disguise: `ObjectManager` is an interface
that it implements. So change the `persist()` call to `$manager`... and we only
need one `flush()`.

Done! Well, this isn't a very interesting fixture class... it's only going to create
*one* `Question`.... but it's a good start. Let's see if it works!

## Executing the Fixtures

Head over to your terminal. The new bundle gave us one new command:
`doctrine:fixtures:load`. Execute that through the symfony binary:

```terminal
symfony console doctrine:fixtures:load
```

It asks us to confirm because *each* time we run this command, it will *completely*
empty the database before loading the new data. And... I think it worked! Go check
out the homepage. Refresh and... yes! We have the *one* question from the fixture
class.

This isn't *that* useful yet, but it gave us a chance to see how the bundle works.
Oh, and if you don't see *anything* on this page, it's probably because the *one*
`Question` that was loaded has an `askedAt` set to null... so it's not showing up.
Try re-running the command once or twice to get a fresh `Question`.

So what I *love* about DoctrineFixturesBundle is how simple it is: I have a
`load()` method where I can create and save as many objects as I want. We can even
create *multiple* fixtures classes to organize better and we can control the
*order* in which each is called.

What I *hate* about DoctrineFixturesBundle is that... I need to do all this work by
hand! If you start creating a *lot* of objects - especially once you have database
relationships where objects are linked to *other* objects... these classes can
get ugly fast. And they're not much fun to write.

So, next: let's use a shiny new library called Foundry to create numerous, random,
rich dummy data
