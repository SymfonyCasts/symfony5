# Saving Relations

Our `answer` table has a new `question_id` column. The question is: how do we
*populate* that column? How do we relate an `Answer` to a `Question`? This is actually
pretty easy... but it might feel weird if you're used to working *directly* with
databases.

Open up `src/DataFixtures/AppFixtures.php`. We're using Foundry to add rich fixtures,
or fake data, into our project. But to see how relationships work, let's do some
good ol' fashioned manual coding.

## Creating some Dummy Question and Answer Objects

Start by creating a new `Answer` object... and I'll populate it with enough data
to get it to save. Repeat this to create a new `Question` object... and also give
it some data.

Yup, we have a boring `Answer` object and a boring `Question` object. To save these
to the database, call `$manager->persist()` on both of them.

Cool. If we stop now, these objects won't be related... and the `Answer` won't
even save! Try it:

```terminal
symfony console doctrine:fixtures:load
```

And... woh! Whoops! Ryan! We generated a migration in the last chapter, and then
I totally forgot to run it! Time to do that:

```terminal
symfony console doctrine:migrations:migrate
```

*Now* try the fixtures:

```terminal-silent
symfony console doctrine:fixtures:load
```

That's the error I expected:

> `question_id` cannot be null on the `answer` table

That's because we made `question_id` required - it was one of the questions that
`make:entity` asked us. Oh, and I can show you where this is configured. Open
up the `Answer` entity and find the `question` property. It's this
`JoinColumn(nullable=false)`: that makes the `question_id` column required.

# Relating an Answer to a Question

Anyways, the thing we want to know is: how can I relate this `Answer` to this
`Question`? How do we say that the `Answer` belongs to this `Question`? It's as
simple as `$answer->setQuestion($question)`.

Notice that we do *not* say `$question->getId()`. We're not passing the *ID* to the
`question` property, we're setting the entire `Question` *object* onto the answer
property. Doctrine will be smart enough to save these in the correct order : it'll
save the `question` first, grab its new id, and use that to save the `Answer`.

To prove it, reload the fixtures:

```terminal-silent
symfony console doctrine:fixtures:load
```

Ok,no errors. Let's see what the database looks like. We can use the
`doctrine:query:sql` command as an easy way to do this: `SELECT * FROM answer`.

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM answer'
```

Yes! We have `one` answer in the database and its `question_id` is set to 103.
Let's query for that question:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM answer'
```

And... there it is!

The big takeaway here is this: in PHP, we *just* think about objects. We think:

> Hey! I'd really like to relate this `Answer` object to this `Question` object.

Then, when we save these, Doctrine handles all the details of figuring out how
to represent this in a relational database. We're, sort of *not* supposed to really
worry about that stuff most of the time. The database is almost an implementation
detail.

Next: now that we've seen how to relate objects, let's update our fixtures
to use Foundry. That will let us create a *ton* of fake questions and answers and
relate them with very little code.
