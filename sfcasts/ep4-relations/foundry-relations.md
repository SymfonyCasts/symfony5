# Relations in Foundry

We're using a library called Foundry to help us generate rich fixtures data.
Right now, it's creating 25 questions. Let's use Foundry to *also* add some
answers.

## make:factory Answer

Start by generating the factory class. At your terminal, run:

```terminal
symfony console make:factory
```

Yup: we want to generate a factory for the `Answer` entity. Beautiful! Let's go check
that out: `src/Factory/AnswerFactory.php`.

Cool.The only work we need to do immediately is inside `getDefaults()`: the goal
here is to give every *required* property a default value... and we even have
Faker available here to help us generate random data.

Let's see: for `username`, we can use a `userName()` fake method. And for votes,
instead of random number, use `numberBetween` -20 and 50. I'll delete
`updatedAt`... but keep `createdAt` so we can fake answers with a `dateTimeBetween()`
`-1 year` and now, which is the default 2nd argument. That period is a typo - future
me will find it.

Head back to `AppFixtures`. Let's remove *all* of this manual `Answer` and `Question`
code. Replace it with `AnswerFactory::createMany(100)` to create 100 answers.

## Populating the Answer.question Property

Over in `AnswerFactory`... let's fix that typo. Notice that, in `getDefaults()`,
we are *not* setting the `question` property yet. And so, if you spin over to
your terminal and run:

```terminal
symfony console doctrine:fixtures:load
```

... we get our favorite error: `question_id` column cannot be null.

To fix this, in `AppFixtures`, pass a 2nd argument to `createMany()`: an array
with a `question` key set to `QuestionFactory::random()`, which is a *really* cool
method.

With this setup, when we call `createMany()`, Foundry will first call `getDefaults()`,
grab this array, add `question` to it, then will ultimately try to create the
`Answer` using *all* of those values.

The `QuestionFactory::random()` method does what it sounds like: it grabs a random
`Question` from the database. So yes, it *is* important that we create the
questions first and then the answers after.

Let's try this:

```terminal
symfony console doctrine:fixtures:load
```

Ok... no errors. Look at the database:

```terminal
symfony console doctrine:query:sql 'SELECT * FROM answer'
```

## Passing a Callback to Randomize Every Answer's Data

And... sweet! We have 100 answers full of a lot of nice random data from Faker.
But... if you look closely, we have a teensy problem. This answer has `question_id`
140... and so does this one... and this one! In fact, *all* 100 answers are related
to the *same* `Question`. Whoops!

Why? Because the `QuestionFactory::random()` method is called just *once*. It
*did* fetch a random `Question`... and then immediately used that random question
for all 100 answers.

If you want a different value *per* `Answer`, you need to pass a callback function
to this second argument instead of an array. That function will then *return*
the array of data to use.

Try it again: reload the fixtures:

```terminal-silent
symfony console doctrine:fixtures:load
```

Then query the `answer` table:


```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM answer'
```

Much better! 100 answers where *each* was related to a random question.

## Moving the "question" into getDefaults()

But to make life easier, we can move this `question` value directly into the
`AnswerFactory`. Copy this `question` line here and then change the fixtures
code back to the very simple `AnswerFactory::createMany(100)`.

Now in `AnswerFactory`, paste `question` set to `QuestionFactory::random()`.
This works because the `getDefaults()` method is called 100 times, once for *each*
answer.

Next: let's discover a key rule when using Foundry and relationships. A rule that,
if you forget to follow it, can result in a bunch of random extra records in
your database.
