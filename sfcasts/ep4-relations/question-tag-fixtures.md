# QuestionTag Fixtures & DateTimeImmutable with Faker

We no longer have a `ManyToMany` relationship between `Question` and `Tag`. Instead,
each `Question` has many `QuestionTag` objects and each `QuestionTag` object is related
to one `Tag`. This means that setting and *using* this relation - the relationship
between `Question` and `Tag` - just changed. Let's update the fixtures to *reflect*
this.

## Generating & Configuring the QuestionTag Factory

First, since we now have a `QuestionTag` entity, we are going to be creating
and persisting `QuestionTag` objects directly. So let's generate a Foundry factory
for it. At your terminal, run:

```terminal
symfony console make:factory
```

And choose `QuestionTag`. Go open that up: `src/Factory/QuestionTagFactory.php`.

[[[ code('7a4699feea') ]]]

In `getDefaults()`, our job, as usual, is to add all the required fields. Set
`question` to `QuestionFactory::new()` and do the same thing for `tag`, setting that
to `TagFactory::new()`.

[[[ code('3cc2d7e0b6') ]]]

As a reminder, the `new()` method returns a `QuestionFactory` instance. So we're
assigning the `question` attribute to a `QuestionFactory` object. We talked
earlier about how this is better than calling `createOne()` because, when you
set a relationship property to a *factory* instance, Foundry will *use* that
to create the `Question` object... but only if it *needs* to.

*Anyways* with this setup, when we use this factory, it will create a brand new
`Question` and a brand new `Tag` each time it makes a `QuestionTag`.

We can see this. Open up the fixtures class and say
`QuestionTagFactory::createMany(10)`. I'm going to put a `return` statement here
because some of the code below is currently broken.

[[[ code('fcd528fde7') ]]]

Let's try this:

```terminal
symfony console doctrine:fixtures:load
```

## Handling DateTimeImmutable & Faker

And... it fails! But... for an unrelated reason. It says:

> `QuestionTag::setTaggedAt()` argument 1 must be a `DateTimeImmutable` instance,
> `DateTime` given.

This is subtle... and related to Faker. In Faker, when you say
`self::faker()->datetime()`, that returns a `DateTime` object. No surprise!

But if you look at the `QuestionTag` entity, the `taggedAt` field is set to a
`datetime_immutable` Doctrine type. This means that, instead of that property
being a `DateTime` object, it will be a `DateTimeImmutable` object. Really...
the same thing... except that `DateTimeImmutable` objects can't be changed.

The point is, the type-hint on the setter is `DateTimeImmutable`... but we're trying
to pass a `DateTime` instance... which isn't the same. The easiest way to fix
this is to update the fixtures. Wrap the value with
`DateTimeImmutable::createFromMutable()`... which is a method that exists *just*
for this situation.

[[[ code('b6f66eeffb') ]]]

And if we reload the fixtures now...

```terminal-silent
symfony console doctrine:fixtures:load
```

No errors! Run:

```terminal
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

And... cool! We have 10 rows. Now query the question table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question'
```

And this *also* has 10 rows. That proves that, each time the factory creates a
`QuestionTag`, it creates a brand new `Question` to relate to it.

So... this works... but it's not really what we want. Instead of creating *new*
questions, we want to relate each `QuestionTag` to one of the *published* questions
that we're creating in our fixtures.

Let's do that next, by doing some *seriously* cool stuff with Foundry.
