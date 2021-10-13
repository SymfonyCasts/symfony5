# Doing Crazy things with Foundry & Fixtures

We *are* able to create new `QuestionTag` objects with its factory... but when
we do that, it creates a brand *new* `Question` object for each new `QuestionTag`.
That's... not what we want! I want what we had before... where we create our 20
published questions and relate *those* to a random set of tags.

Delete the `return` statement and the `QuestionTagFactory` line. Right now,
this says:

> Create 20 questions. And, for each one, set the `tags` property to 5 random
> `Tag` objects.

## Setting the questionTags Property on Question

The problem is that our `Question` entity doesn't *have* a `tags` property anymore:
it now has a `questionTags` property. Okay. So let's change this to `questionTags`.
We *could* set this to `QuestionTagFactory::randomRange()`. But that would require
us to create those `QuestionTag` objects up here... which we *can't* do because
we need the *question* object to exist first. Well, we *could* do that, but we
would end up with extra questions that we don't really want.

By the way, we're about to see some *really* cool, really advanced stuff in
Foundry. But at the end, I'm also going to show a simpler solution to creating
the objects we need.

## Foundry Passes the Outer Object to the Inner Factory

Anyways, set `questionTags` to `QuestionTagFactory::new()`. So, to an *instance*
of this factory.

There *is* a problem with this... but it's *mostly* correct. And... it's kind of
crazy! This tells Foundry to use this `QuestionTagFactory` instance to create a new
`QuestionTag` object. *Normally* when we use `QuestionFactory`, it creates a
*new* `Question` object. But in this case, that *won't* happen. Because we're
calling this from *inside* the `QuestionFactory` logic, the `question` attribute
that's passed to `QuestionTagFactory` will be overridden and set to the
`Question` object that is currently being created by its factory.

In other words, this will *not* cause a new, extra `Question` to be created in the
database. Instead, the new `QuestionTag` object will be related to whatever Question
is currently being created. Foundry does this by *reading* the Doctrine relationship
and smartly overriding the `question` attribute on `QuestionTagFactory`.

But... I *did* say that there was a problem with this. And... we'll see it right
now:

```terminal-silent
symfony console doctrine:fixtures:load
```

This gives us a weird error from `PropertyAccessor` about how the `questionTags`
attribute cannot be set on `Question`. The `PropertyAccessor` is what's used by
Foundry to *set* each attribute onto the object. And while it's true that
we don't have a `setQuestionTags()` method, we *do* have `addQuestionTag()` and
`removeQuestionTag()`, which the accessor is smart enough to use.

So, the *real* problem here is simpler: `QuestionTagFactory::new()` says that
we want to create a *single* `QuestionTag` and set it onto `questionTags`. But we
need an *array*. *That* confused the property accessor. To fix this, add `->many()`.

This "basically" returns a factory instance that's now configured to create
*multiple* objects. Pass 1, 5 to create anywhere from 1 to 5 `QuestionTag` objects.

Try the fixtures again:

```terminal-silent
symfony console doctrine:fixtures:load
```

No errors! And if we `SELECT * FROM question`:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question'
```

We only have 25 rows: the correct amount! That's the 20 published... and
the 5 unpublished. This proves that the `QuestionTagFactory` did *not* create new
question objects like it did before: all the new question tags are related
to these 20 questions. We can see that by querying: `SELECT * FROM question_tag`

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

60 rows seems about right. This is related to question 57, 57, 57, 57... then 56,
56 and then 55. So each question has a random number of question tags.

## Overriding the tag Attribute

Unfortunately this line *is* still creating a new random `Tag` each time.
Check the `tag` table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM tag'
```

We *want* there to be 100 rows... from the 100 in our fixtures. We don't want
*extra* tags to be created down here. But... we get 160: 100 plus 1 more for
each `QuestionTag`.

And... this make sense... thanks to the `getDefaults()` method.

The fix... is both nuts and simple: pass an array to `new()` to override the
`tag` attribute. Set it to `TagFactory::random()` to grab `one` existing random
`Tag`.

Reload the fixtures again:

```terminal-silent
symfony console doctrine:fixtures:load
```

And query the tag table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM tag'
```

We're back to 100 tags! But... I made a mistake... and maybe you saw it. Check
out the `question_tag` table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

These last two are both related to question id 82... actually the last 3.
And that's fine: each `Question` will be related to 1 to 5 question tags. The
problem is that all of these are *also* related to the same `Tag`!

In the fixtures, each time a `Question` is created, it executes this callback.
So it's executed 20 times. But then, when the 1 to 5 `QuestionTag` object are
created, `TagFactory::random()` is only called *once*... meaning that the *same*
`Tag` is used for each of the 1 to 5 question tags.

Yup, this is the *same* problem we've seen multiple times before... I'm trying to
make this mistake a *ton* of times in this tutorial, so that you *never* experience
it.

Refactor this to use a callback. Then, reload the fixtures:

```terminal-silent
symfony console doctrine:fixtures:load
```

And check the `question_tag` table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

Yes! These last 2 have the same question id... but they have *different* tag ids.
Mission accomplished! And... this is probably the most *insane* thing that you'll
ever do with Foundry. This says:

> Create 20 questions. For each question, the `questionTags` property should be
> set to 1 to 5 new `QuestionTag` objects... except where the `question` attribute
> is overridden and set to the new `Question` object. Then, for each `QuestionTag`,
> select a random `Tag`.

Congratulations, you now have a PhD in Foundry!

## The Simpler Solutions

But... you do *not* need to make it this complicated! I did this mostly for the
*pursuit of learning*! To show off some advanced stuff you can do with Foundry.

An easier way to do this would be to create 100 tags, 20 published questions
and *then*, down here, use the `QuestionTagFactory` to create, for example, 100
`QuestionTag` objects where each one is related to a random `Tag` and also a random
`Question`.

Then, above, when we create the Questions... we can just create normal, boring
`Question` objects... because the `QuestionTag` stuff is handled below.

If we try this:

```terminal-silent
symfony console doctrine:fixtures:load
```

No errors. And if you look inside the `question_tag` table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

We get 100 question tags, each related to a random `Question` and a random `Tag`.
It's not *exactly* the same as we had before, but it's probably close enough,
and *much* simpler.

Next: let's fix the frontend *and* our JOIN to use the refactored
`QuestionTag` relationship.
