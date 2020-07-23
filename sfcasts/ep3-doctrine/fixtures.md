# Fixtures

Coming soon...

Art `/question/new` page was a nice, simple way for us to create and save some dummy
questions into the database. It gave us an us, it gave us enough data. It gave us
enough data to work on the homepage and also to work on the individual question, show
pages, having a nice set of data to work with while you're developing is super
important. If you want to be able to jump in and start coding this set of dummy data
has a special name, data fixtures. And instead of creating them in a random
controller like `src/Controller/QuestionController`, we can install a bundle to
help us find a terminal and run 

```terminal
composer require orm-fixtures --dev
```

This is another flex alias `orm-fixtures` installs `doctrines/doctrine-fixtures-bundle`

When this finishes installed a recipe, I committed all my changes before recording
this chapter, sovereign

```terminal
git status
```

to see what it did, get updated, the normal
`composer.json` `composed.lock` and `symfony.lock` files. It also enabled the
new bundle and created a source `src/DataFixtures/` directory. Let's go see what sends
inside their `src/DataFixtures/`. We have a shiny new `AppFixtures.php` the
`doctrine-fixtures-bundle` that we just installed is a beautifully simple bundle.
First, we create one or more of these fixture files, classes, classes that extend
`Fixture` and have this `load()` method. Second inside load. We write normal PHP code to
create as much dummy data as we want. And third we'll run a new console command that
we'll call the load method on all our fixture classes. But before we start, see how
Peter storm is kind of mad, the details aren't too important, and the code would work
how it is now, but the lead, the `ObjectManager`, use statements, and replace it with
one from `Doctrine`, with the one from `Doctrine\Persistence`. This will make your
fixture class compatible with newer versions of doctrine. Anyway, let's see this in
action. Find the new method in the controller. Copy all of its question, creating
code and delete it since we'll regrade this page properly. When we talk about forms
and a future tutorial, let's just render sounds like a great feature for V two back
in app fixtures paste that code and notice PhDs aren't as smart enough to see we're
using a `Question` class and it asks us if we want to import that use statement. We
definitely do.

So. The only problem now is that we don't have an `$entityManager` variable, but see
that `$manager` variable that's passed the load method. That is actually the entity
manager in disguise. So change the `persist()` call to `$manager`, and we only need one
flesh and we're done well. This isn't a very interesting fixture class. You'd only
crazy one question and probably will want more than just one to make life
interesting, but let's see if it works, find your terminal. The new bundle gave us a
one new command `doctrine:fixtures:load`, execute that through the 

```terminal
symfony console doctrine:fixtures:load
```

It asks us to confirm because each time we run this command, it will completely empty
our database before loading the new data. And I think it worked. Let's go check out
the homepage refresh and yes, it shows the one question from the fixture file. Not
too interesting yet, but you can see how it works. If you don't see anything on this
page, it's probably because you are one question asked at is no. And so it's being
hidden. Try rerunning the command to get a fresh question. So what I love about
`doctrine-fixtures-bundle` is that I have a simple function load where I can create and
save as many objects as I want. I can even create multiple fixtures classes and you
can control what order they w they're running. What I hate about doctrine fixtures
Bumble is that I need to do all that work by hand. If you start creating a lot of
objects, these classes can get ugly fast. Next let's use a brand new shiny library,
Foundry called Foundry to great numerous beautiful dummy data.
