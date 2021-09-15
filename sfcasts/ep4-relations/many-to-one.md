# The ManyToOne Relation

Okay: we have a `Question` entity and table. We have an `Answer` entity and table.
Yay for us! But what we *really* want to do is *relate* an `Answer` to a `Question`.

To do this... well... *forget* about Doctrine for a second. Let's just think about
how this would look in a database. So: each answer belongs to a single question.
We would normally model this in the database by adding a `question_id` column to
the `answer` table that's a foreign key to the question's `id`. This would allow
each question to have many answers and each answer to be related to exactly one
question.

Ok! So... we need to add a new column to the `answer` table. The way we've done
that so far in Doctrine is by adding a *property* to the entity class. And adding
a relationship is *no* different.

## Generating the Answer.question ManyToOne Property

So find your terminal and run:

```terminal
symfony console make:entity
```

We need to update the `Answer` entity. Now, what should the new property be
called... `question_id`? Actually, no. And this is one of the coolest, but trickiest
things about Doctrine. Instead, call it simply `question`... because this property
will hold an entire `Question` *object*... but more on that later.

For the type, use a "fake" type called `relation`. This starts a wizard that will
guide us through the process of adding a relationship. What class should this new
property relate to? Easy: the `Question` entity.

Ah, and *now* we see something awesome: a big table that explains the four types
of relationships with an example of each of one. You can read through all of these,
but the one *we* need is `ManyToOne`. Each `Answer` relates to one `Question`.
And each `Question` can have many answers. That's... exactly what we want. Enter
`ManyToOne`. This is actually the *king* of relationships: most of the time,
this will be the one you want.

Is the `Answer.question` property allowed to be null? This is asking if we should
be allowed to save an `Answer` to the database that is *not* related to a `Question`.
For us, that's a "no". Every `Answer` *must* have a question... except... I guess...
in the Hitchhiker's Guide to the Galaxy. Anyways, saying "no" will make the new column
*required* in the database.

## Mapping the "Other" Side of the Relation

This next question is *super* interesting:

> Do you want to add a new property to `Question` so you can access/update `Answer`
> objects from it.

Here's the deal: every relationship can have two sides. Think about it: an `Answer`
is related to one `Question`. But... you can also view the relationship from the
other direction and say that a `Question` has many answers.

Regardless of whether we say "yes" or "no" to this question, we *will* be able
to get and set the `Question` for an `Answer`. If we *do* say "yes", it simply means
that we will *also* be able to access the relationship from the *other* direction...
like by saying `$question->getAnswers()` to get all the answers for a given
`Question`.

And... hey! Being able to say `$question->getAnswers()` sounds pretty handy!
So let's say yes. There's no downside... except that this will generate a little
bit more code.

What should that new property in the `Question` entity be called? Use the default
`answers`.

*Finally* it asks a question about `orphanRemoval`. This is a bit more advanced...
and you probably don't need it. If you *do* discover later that you need it, you
can enable it manually inside your entity. I'll say no.

And... done! Hit enter one more time to exit the wizard.

## Checking out the Entity Changes

Let's go see what this did! I committed before recording, so I'll run

```terminal
git status
```

to check things out. Ooo, *both* entities were updated. Let's open `Answer`
first... and... here's the new `question` property. It *looks* like any other
property except that instead of having `ORM\Column` above it, it has `ORM\ManyToOne`
and targets the `Question` entity.

[[[ code('20254f6f4b') ]]]

Scroll to the bottom. Down here, it generated a normal getter and setter method.

[[[ code('44a21d1360') ]]]

Let's go look at the `Question` entity. If we scroll... beautiful: this now has
an `answers` property, which is a `OneToMany` relationship.

[[[ code('6cdac9c530') ]]]

And... all the way at the bottom, it generated a getter and setter method. Oh,
well, instead of `setAnswers()`, it generated `addAnswer()` and `removeAnswer()`,
which are just a bit more convenient, especially in Symfony if you're using the
form component or the serializer.

[[[ code('645af7f557') ]]]

## The ArrayCollection Object

Head back up near the top of this class. The command *also* generated a
constructor method so that it could initialize the `answers` property to some
`ArrayCollection` object.

[[[ code('c62f5af78d') ]]]

Ok, so we know that each `Question` will have many answers. So we know that the
`answers` property will be an array... or some sort of collection. In Doctrine...
for internal reasons, instead of setting the `answers` property to an array, it
sets it to a `Collection` object. That's... not *too* important: the object
looks an acts like an array - like, you can `foreach` over it. But it *does* have
a few extra useful methods on it.

Anyways, whenever you have a relationship that holds a "collection" of other
items, you need to initialize that property to an `ArrayCollection` in your
constructor. If you use the `make:entity` command, this will always be done for
you.

## ManyToOne vs OneToMany

Oh, and I want to point something out. We generated a `ManyToOne` relationship. We
can see this in the `Answer` entity. But... in the `Question` entity, it says
`OneToMany`.

This is a *key* thing to understand: a `ManyToOne` relationship and a `OneToMany`
relationship are *not* actually two different types of relationships. Nope: they
described the *same* relationship... just from the two different sides.

Think about it: from the perspective of a `Question`, we have a "one question
relates to many answers" relationship - a `OneToMany`. From the perspective of
the `Answer` entity, that *same* relationship would be described as "many answers
can relate to one question": a `ManyToOne`.

The point is: when you see these two relationships, realize that they are *not*
two different things: they're the same *one* relation seen from opposite sides.

## The answer_id Foreign Key Column

*Anyways*, we ran `make:entity` and it added one property to each class and a few
methods. Nothing fancy. Time to generate the migration for this:

```terminal
symfony console make:migration
```

Let's go peek at the new file! How cool is this??? 

[[[ code('26741d9731') ]]]

It's adding a `question_id` column to the `answer` table! Doctrine is smart: 
we added a `question` property to the `Answer` entity. But in the database, 
it added a `question_id` column that's a foreign key to the `id` column 
in the `question` table. In other words, the table structure looks *exactly* 
like we expected!

The tricky, but honestly *awesome* thing, is that, in PHP, to relate an `Answer`
to a `Question`, we're *not* going to set the `Answer.question` property to an
integer `id`. Nope, we're going to set it to an entire `Question` *object*.
Let's see exactly how to do that next.
