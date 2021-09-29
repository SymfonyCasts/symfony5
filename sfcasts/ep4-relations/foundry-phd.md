# Doing Crazy things with Foundry & Fixtures

We *are* able to create new `QuestionTag` objects with its factory... but when
we do that, it creates brand *new* `Question` objects. That's... not what we
want! I want what we had before... where we create our 20 published questions
and relate *those* to a random set of tags.

Delete the `return` statement and the `QuestionTagFactory` line. Right now,
this says:

> Create 20 questions. And, for each one, set the `tags` property to 5 random
> `Tag` objects.

## Setting the questionTags Property on Question

The problem is that our `Question` entity doesn't *have* a `tags` property anymore:
it now has a `questionTags` property. Okay. So let's change this to `questionTags`.
We *could* set this to `QuestionTagFactory::randomRange()`. But that would require
us to create those `QuestionTag` objects up here... which we *can't* do because
we need the *question* objects to exist first.

By the way, we're about to see some *really* cool, really advanced stuff in
Foundry. But at the end, I'm also going to show a simpler solution to creating
the objects we need.

## Foundry Passes the Outer Object to the Inner Factory

Anyways, set `questionTags` to `QuestionTagFactory::new()`. So, to an *instance*
of this factory.

There *is* a problem with this... but it's *mostly* correct. And... it's kind of
crazy! This tells Foundry to use this `QuestionTagFactory` instance to create a new
`QuestionTag` object. But because we're doing this from *inside* the `QuestionFactory`
the `question` attribute that's passed to `QuestionTagFactory` will be overridden
and set to whatever `Question` object is currently being created.

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
attribute cannot be set on `Question`. The `PropertyAccessor` is what's used to
*set* each attribute from Foundry onto the object. And, while it's true that
we don't have a `setQuestionTags()` method, we *do* have `addQuestionTag()` and
`removeQuestionTag()`, which the accessor is smart enough to use.

So, the problem is simpler: `QuestionTagFactory::create()` sys that we want
to create a *single* `QuestionTag` and set it onto `questionTags`. But we need
an *array*. To fix this, add `->many()`.

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

We only have 25 rows: that's the correct amount! That's the 20 published... and
the five unpublished. The point is: the `QuestionTagFactory` did *not* create new
question objects like it did a second ago: all the new question tags are related
to these 20 questions. We can see that by querying: `SELECT * FROM question_tag`


```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

60 rows seems about right. This is related to question 57, 57, 57, 57... then 56,
56 and then 55. So each question has a random number.

## Overriding the tag Attribute

Unfortunately this line *is* still creating a new random `Tag` object each time.
Check the `tag` table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM tag'
```

We *want* there to be 100 rows... from the 100 in our fixtures. We don't want
*extra* tags to be created down here. But... we get 160: 100 plus 1 more for
each `QuestionTag`.

And... this make sense, thanks to the `getDefaults()` method.

The fix... is both nuts and simple: pass an array to `new()` to override the
`tag` attribute. Set it to `TagFactory::random()` to grab `one` existing random
`Tag`.

Reload fixtures now:

```terminal-silent
symfony console doctrine:fixtures:load
```

And query the tag table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM tag'
```

We're back to 100 tags! But I made a mistake... and maybe you saw it. Check
out the `question_tag` table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

These last two are both related to the question id 82... actually the last 3.
And that's fine: each `Question` will be related to 1 to 5 question tags. The
problem is that all of these are *also* related to the same `Tag`!

In the fixtures, each time a `Question` is created, it executes this callback.
So it's executed 20 times. But then, when the 1 to 5 `QuestionTag` object are
created, `TagFactory::random()` is only called *once*... meaning that the *same*
tag is used for each `QuestionTag`. In other words, this is the same problem
we've seen multiple times before... I'm trying to make this mistake as *many*
times in this tutorial, so that you *never* experience it.

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
do with Foundry. This says:

> Create 20 questions. For each question, the `questionTags` property should be
> set to 1 to 5 new `QuestionTag` objects... except where its `question` attribute
> is overridden to be set to the new `Question`. Then, for each `QuestionTag`,
> select a random `Tag`.

Congratulations, you now have a PhD in Foundry!

## The Simpler Solutions

But... you do *not* need to make it this complicated! I did this mostly for the
pursuit of learning! To show off the most advanced stuff you can do with Foundry.

An easier way to do this would be to create a 100 tags, 20 published questions
and *then*, down, use the `QuestionTagFactory` to create, for example, 100
`QuestionTag` objects where each one is related to a random `Tag` also a random
`Question`.

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
and much simpler.

Next: let's fix the frontend to use the refactored `QuestionTag` relationship.
