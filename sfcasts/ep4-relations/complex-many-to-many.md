# ManyToMany... with Extra Fields on the Join Table?

The `ManyToMany` relationship is unique in Doctrine because *Doctrine* actually
creates & manages a table - the join table - for us. This is the *only* time
in Doctrine where we have a table *without* a corresponding entity class.

But what if we needed to add more *columns* to this table? Like a `tagged_at`
`DateTime` column? Excellent question! And the answer is... that's not possible!
I'm serious! But, it's by design. As soon as you need even *one* extra column on
this join table, you need to *stop* using a `ManyToMany` relationship. Instead,
you need to create an *entity* for the join table and manually relate that entity
to `Question` and `Tag`.

Let's see what this looks like. But, it's actually easier to do this from the
beginning than to try to refactor an existing `ManyToMany` relationship.
So before you create a `ManyToMany`, try to think if you might need extra columns
in the future. And if you *will* need them, *start* with the solution that we're
about to see.

## Undoing the ManyToMany

Ok, step 1: I'm actually going to hit the rewind button on our code and *remove*
the `ManyToMany`. In `Question`, delete everything related to tags. So, the property,
the constructor and the getter and setter methods.

Inside of `Tag`, do the same thing for questions: delete the methods and, on top,
the property and the entire constructor.

So we *still* have a `Question` entity and a `Tag` entity... but they're no longer
related.

## Generating the Join Entity

*Now* we're going to put this relationship *back*, but with a new entity that
represents the join table. Find your terminal and run:

```terminal
symfony console make:entity
```

Let's call this entity `QuestionTag`, but if there's a more descriptive name for
your situation, use that. This entity will have at *least* two properties: one
for the relation to `Question` and another for the relation to `Tag`.

Start with the `question` property... and use the `relation` type to trigger the
wizard. This will relate to the `Question` entity... and it's going to be a
`ManyToOne`: each `QuestionTag` relates to one `Question` and each `Question`
could have many `QuestionTag` objects.

Is the property allowed to be nullable? No... and then do we want to add a new
property to `Question` so we can say `$question->getQuestionTags()`? That
*probably* will be handy, so say yes. Call that property `$questionTags`. Finally,
say "no" to orphan removal.

Cool! The other property - the `tag` property - will be exactly the same: a
`ManyToOne`, related to `Tag`, say "no" for nullable and, in this case, I'm
going to say "no" to generating the *other* side of the relationship. I'm doing
this mostly so we can see an example of a relationship where only *one* side
is mapped. But we also aren't going to need this shortcut method for what we're
building. So say "no".

And... perfect! That is the *minimum* needed in the new `QuestionTag`
entity: a `ManyToOne` relationship to `Question` and a `ManyToOne` relationship
to `Tag`. So *now* we can start adding whatever *other* fields we want. I'll
add `taggedAt`... and make this a `datetime_immutable` property that is not
nullable in the database. Hit enter a one more time to finish the command.

Ok! Let's go check out the new class: `src/Entity/QuestionTag.php`. It looks...
beautifully boring! It has a `question` property that's a `ManyToOne` to
`Question`, a `tag` property that's a `ManyToOne` to `Tag` and a `taggedAt`
date property.

[[[ code('30bf8adc87') ]]]

Inside `Question`... scroll all the way up. Because we also decided to map *this*
side of the relationships, this has a `OneToMany` relationship to the join
entity. 

[[[ code('30bf8adc87') ]]]

But there were *no* changes to the `Tag` entity, since we decided *not*
to map the other side of *that* relationship.

Back in `QuestionTag`, before we generate the migration, let's give our `$taggedAt`
a default value. Create a `public function __construct()` and, inside, say
`$this->taggedAt = new \DateTimeImmutable()` which will default to "now".

[[[ code('a0c72969f1') ]]]

## How this Looks Different / the Same in the Database

Ok - migration time! At your terminal, make it:

```terminal
symfony console make:migration
```

And then go open up the new file... cause this is really cool! It *looks* like
there are a lot of queries to change from the old `ManyToMany` structure to our
*new* structure.

[[[ code('f04b631b37') ]]]

But look closer. We *already* had a `question_tag` table thanks to the
`ManyToMany` relationship. So we don't need to drop that table and create a new
one: all the migration needs to do is *tweak* it. It drops the `question_id` and
`tag_id` foreign key constraint from the table... but then adds them back down
here. So the first two lines and last two lines cancel each other out.

This means that the only *real* change is `ALTER TABLE question_tag` to add a
true `id` auto-increment column and the `tagged_at` column. Yup, we just
did a *massive* refactoring of our entity code - replacing the `ManyToMany` with
a new entity and two new relationships - but in the database... we have almost
the exact same structure! In reality, a `ManyToMany` relationship is just a
shortcut that allows you to have the join table *without* needing to create an
*entity* for it.

So now that we understand that, from the database's perspective not much is
changing, let's run the migration to make those tweaks:

```terminal
symfony console doctrine:migrations:migrate
```

And... it fails! Rut roo. Next: let's find out why this migration failed. And,
more importantly, how we can fix it and safely *test* it so that we confidently
know that it will *not* fail when we deploy to production.
