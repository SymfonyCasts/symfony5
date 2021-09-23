# Owning Vs Inverse Sides of a Relation

There's a, kind of, complex topic in Doctrine relations that we need to talk about.
It's the "owning versus inverse side" of a relationship.

We already know that any relation can be seen from two different sides: `Question`
is a `OneToMany` to `Answer`... 

[[[ code('f6c15afd22') ]]]

and that same relation can be seen as an `Answer` that is `ManyToOne` to `Question`.

[[[ code('d223381ad5') ]]]

So... what's the big deal? We already know that we can *read* data from both sides:
we can say `$answer->getQuestion()` and we can also say `$question->getAnswers()`.

## Setting the Other Side of the Relation

But can you *set* data from both sides? In `AnswerFactory`, when we originally
started playing with this relationship, we proved that you can say
`$answer->setQuestion()` and Doctrine *does* correctly save that to the database.

Now let's try the *other* direction. I'm going to paste in some plain PHP code
to play with. This uses the `QuestionFactory` to create one `Question` - I'm
using it because I'm kinda lazy - and then creates two `Answer` objects by hand
and persists them. We don't need to persist the `Question` because the
`QuestionFactory` saves it entirely.

[[[ code('6fb83958c7') ]]]

At this point, the `Question` and these two answers are *not* related to each other.
So, not surprisingly, if we run:

```terminal
symfony console doctrine:fixtures:load
```

we get our favorite error: the `question_id` column cannot be null on the `answer`
table. Cool! Let's relate them! But this time, instead of saying,
`$answer1->setQuestion()`, do it with `$question->addAnswer($answer1)`...
and `$question->addAnswer($answer2)`.

[[[ code('085a87f361') ]]]

If you think about it... this is *really* saying the same thing as when we set
the relationship from the other direction: this `Question` *has* these two answers.

Let's see if it saves! Run the fixtures:

```terminal-silent
symfony console doctrine:fixtures:load
```

And... no errors! I think it worked! Double-check with:

> SELECT * FROM answer

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM answer'
```

Let's see... yea! Here are the new answers. Oh, apparently I called them *both*
"answer 1" - silly Ryan. But more importantly, each answer *is* correctly
related to a `Question`.

Ok! so it turns out you *can* set data from both sides. The two sides of the
relationship apparently behave identically.

Now, at this point, you might be saying to yourself:

> Why is this guy taking so much time to show me that something works
> exactly like I expect it too?

## The "setters" Synchronize the Other Side of the Relation

Great question! Because... this *doesn't* really work like we just saw. Let me
show you.

Open the `Question` class and find the `addAnswer()` method. 

[[[ code('4eafd16798') ]]]

This was generated for us by the `make:entity` command. It first checks to see 
if the `$answers` property *already* contains this answer.... just to avoid 
a duplication. If it does *not*, it, of course, *adds* it to that property. 
But it *also* does something else, something very important: 
`$answer->setQuestion($this)`. Yup, it sets the *other* side of the relation.

So if an `Answer` is added to a `Question`, that `Question` is *also* set *onto*
that `Answer`. Now, watch what happens if we comment-out this line... 

[[[ code('6fe86bbd49) ]]]

and then go reload the fixtures:

```terminal-silent
symfony console doctrine:fixtures:load
```

An error! The `question_id` column cannot be null on the `answer` table! It
did *not* relate the `Question` to the `Answer` properly!

## Owning vs Inverse

*This* is what I wanted to talk about. Each relation has two different sides and
these sides have a name: the owning side and the inverse side. For a `ManyToOne`
and `OneToMany` relationship, the owning side is always the `ManyToOne` side. And
it's easy to remember: the owning side is where the foreign key column lives in the
database. In this case, the `answer` table will have a `question_id` column so
*this* is the "owning" side.

The `OneToMany` side is called the inverse side.

Why is this important? It's important because, when Doctrine saves an entity, it
*only* looks at the data on the *owning* side of a relationship. Yup, it looks
at the `$question` property on the `Answer` entity to figure out what to save
to the database. It completely *ignores* the data on the inverse side. Really,
the inverse side exists *solely* for the convenience of us reading that data:
the convenience of being able to say `$question->getAnswers()`.

So right now, we are *only* setting the inverse side of the relationship. And so,
when it saves the `Answer`, it does *not* link the `Answer` to this `Question`.

## Inverse Side is Optional

And actually, the inverse side of a relationship is entirely *optional*. The
`make:entity` command asked us if we wanted to map this side of the relationship.
We could delete *everything* inside of `Question` that's related to answers, and
the relationship would *still* be set up in the database and we could *still* use
it. We just wouldn't be able to say `$question->getAnswers()`.

I'm telling you all this so that you can avoid potential WTF moments if you relate
two objects... but they mysteriously don't save. Fortunately, the `make:entity`
command takes care of all this ugliness *for* us by generating really smart
`addAnswer()` and `removeAnswer()` methods that synchronize the owning side of the
relationship. So unless you don't use `make:entity` or start deleting code, you
won't need to think about this problem on a day-to-day basis.

Put back the `$answer->setQuestion()` code so that we can, once again, safely set
the data from either side. 

[[[ code('9c9d7805be') ]]]

Back in the fixtures, now that we've learned all of this, delete the custom code. 

[[[ code('3458f1064e') ]]]

And then, let's reload our fixtures:

```terminal-silent
symfony console doctrine:fixtures:load
```

Next: when we call `$question->getAnswers()`... which we're currently doing inside
of our template, what *order* is it returning those answers? And can we *control*
that order? Plus we'll learn a config trick to optimize the query that's made when
all we need to do is *count* the number of items in a relationship.
