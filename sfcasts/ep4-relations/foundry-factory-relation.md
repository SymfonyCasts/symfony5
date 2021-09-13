# Foundry: Always Pass a Factory Instance to a Relation

I love Foundry, but using Foundry with Doctrine relationships is probably the
*hardest* part of this library. So let's do something harder. Pretend that, in this
situation, we want to override the `question` value. Right now it grabs *any* random
`Question` from the database. But I want to randomly grab one of these 20 *published*
questions.

## Overriding the question Property

No problem! And this part is pretty manually. Put our callback... back... and return
an array. There actually *is* a way, in Foundry, to say: "please return a random
`Question` *where* some field matches some value. But... in our case, we would
need to say `WHERE askedAt IS NOT NULL` which is too complex for that system to
handle. But no worries! We'll just do this manually.

Above on the `createMany()` call, add a `$questions =` before this. Back down here,
add a `use` to the callback so that the `$questions` variable is accessible...
then use `array_rand()` to grab a random item.

Let's make sure this works! Reload the fixtures and...

```terminal-silent
symfony console doctrine:fixtures:load
```

No errors! We can use a special query to check this:

> `SELECT DISTINCT question_id FROM answer`

```terminal-silent
symfony console doctrine:query:sql 'SELECT DISTINCT question_id FROM answer'
```

Yes! The answers are related to exactly 20 questions.

## Accidentally Creating Extra Relation Objects

That was... manual but simple enough. Now I want to show you a (really) common mistake
when using Foundry with relationships.

In `AnswerFactory`, let's change the default `question` to create a new unpublished
question. We can do this by saying `QuestionFactory::new()` - to create a
`QuestionFactory` object - then `->unpublished()`.

There's no magic here: that's just a method we created in the first tutorial: it
changes the `askAt` value to `null`. Then, to actually *create* the `Question`
from the factory, add `->create()`.

This is *totally* legal: it will create a new unpublished `Question`, save it to
the database and then that `Question` will be used as the `question` key when
creating the `Answer`.

Well, that's what would *normally* happen. But since we're overriding the
`question` key, this change should make absolutely *no* difference in our situation.

Famous last words. Reload the fixtures:

```terminal-silent
symfony console doctrine:fixtures:load
```

No errors... but check out how many questions there are in the database:

> `SELECT * from question`

```terminal-silent
symfony console doctrine:query:sql 'SELECT * from question'
```

We *should* have 20+5: 25 questions. Instead... we have 125!

The problem is subtle... but maybe you spotted it! We're creating 100 answers...
and the `getDefaults()` method is called for *every* one. That's.... good! But
the moment that this `question` line is executed. it creates a new unpublished
`Question` and saves it to the database. Then... a moment later. the `question` is
overridden. This means that the 100 answers *were* all correctly related to the
10 published questions. But it also means that, along the way, 100 extra questions
were created, saved to the database... then never used.

What's the fix? Simple: remove `->create()`.

This means that the `question` key is now set to a `QuestionFactory` object. The
`new()` method returns a new `QuestionFactory` instance... and then the
`unpublished()` method return `self`: so it returns that same `QuestionFactory`
object.

Setting a relation property to a *factory* is totally allowed. In fact, you
should *always* set a relation property to a factory instance if you can. Why?

Because htis allows Foundry to *delay* creating the `Question` object until
later. And in this case, it realizes that the `question` has been overridden, and
so it *avoids* creating the extra object entirely... which is perfect.

Reload the fixtures one more time:

```terminal-silent
symfony console doctrine:fixtures:load
```

And check the `question` table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * from question'
```

We're back to 25 rows.

Next: let's use this new stuff to render answers on the frontend.
