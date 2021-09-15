# Fetching Relations

Each *published* `Question` in the database will now be related to approximately
5 answers. Head to the homepage and click into a question. Time to replace this
hardcoded craziness with *real*, dynamic answers.

## Querying for Answers with findBy()

This means that we need to find all the answers for this specific `Question`. How
can we do that? When we ran the `make:entity` command to create the `Answer`
entity, it *also* generated an `AnswerRepository` class. And you might remember from
the *last* tutorial that these repository classes have some nice, built-in methods
for querying, like `findBy()` where we can find all the answers in the database that
match some criteria, like `WHERE votes = 5` *or* `WHERE question_id =` the id of
some question.

Open the controller for this page: `src/Controller/QuestionController.php`...
it's the `show()` action. Autowire the `AnswerRepository` service as an argument.
Then, below, say `$answers = $answerRepository->findBy()` and pass this an array
that should be used to build the `WHERE` statement in the query. To find all the
answers `WHERE` the `question_id` matches this question, pass `question` set to
the `$question` *object*. Remember: by this point, Doctrine has *already* used
the `slug` in the URL to query for the `Question` object.

The important thing here is that, when we call `findBy()`, we *don't*
say `'question_id' => $question`... or `'question' => $question->getId()`.
No! With Doctrine, we need to stop thinking about the database: we need to think
only about the *objects*. We want to find all the `Answer` objects whose `question`
property equals this `$question` *object*.

Behind the scenes, Doctrine will be smart enough to query `WHERE` the
`question_id` column matches the `id` from this object.

Let's dump & die the `$answers` variable... and go see what it looks like. Refresh.
Yes! This dumps an array of answers! Apparently this question is only related
to *two* answers. Let's go pick a different one with more answers... cool!
This question is related to *four* answers. That's, checks math, twice as interesting.

So... yay! Want to fetch all the `Answer` objects related to a `Question`? We
just saw that you can do that by querying for the `Answer` entity and treating
the `question` property like any *normal* property... except that you pass an
entire `Question` *object* into the query.

## Using the $question->getAnswers()

Now that we've done that... let's do something easier! Remove the `AnswerRepository`
argument entirely... and instead say `$answers = $question->getAnswers()`. I'll
put the `dd($answers)` back.

When we ran the `make:entity` command, it asked us if we wanted to *also* add an
`$answers` property to the `Question` class. We said yes, which generated some
code that allows us to use this handy shortcut.

## PersistentCollection & ArrayCollection

Over at the browser, when we refresh, we *should* see the same list of answers.
And... we don't!? We get some `PersistentCollection` object. And, even stranger,
I don't see the `Answer` objects anywhere *inside* of this collection. Dude, where's
my answers?

Excellent question! Two important things here. First, remember that, inside the
`Question` entity, the `$answers` property will *not* be a true *array* of `Answer`
objects. Nope, it will be some sort of Doctrine collection object. It may be an
`ArrayCollection` object *or* this `PersistentCollection` object... just depending
on the situation. It doesn't *really* matter because both of these classes implement
the same `Collection` interface... and both look and act like a normal array. The
point is: that `PersistentCollection` is just an array-like wrapper around the
answers... and not something we'll think about much.

## Relations are Lazy-Loaded

The second thing to know is that when we query for a `Question`, Doctrine basically
executes a `SELECT * FROM question` query. It grabs *all* the data from the
`question` table and puts it onto the properties of the `Question` object. *But*,
it does *not* immediately query the *answer* table for the related answers data.
Nope, Doctrine doesn't query for the answers until - and unless - we actually *use*
the `$answers` property. So, at this moment, it has *not* yet made the query for
the answers data... which is why you don't see them inside this collection object.
This feature is called "lazy loading".

Check this out: back in `QuestionController`, remove the `dd()`... and `foreach`
over the `$answers` collection. Inside, do a normal `dump()` of the `$answer` variable.

It's pretty crazy, but the moment that we `foreach` over the `$answers` collection -
so the moment that we actually start *using* the answers data - Doctrine will
query for that data.

We can see this! Refresh. Because we don't have a `die()` statement, the `dump()`
shows up down in the web debug toolbar. And... yes! It found the same 4 answers!

Click the Doctrine icon on the toolbar to jump into its profiler... and look at the
queries. There are two. First Doctrine queries for the `question` data. Then a
moment later - at the moment the `foreach` line is executed - it queries `FROM answer`
`WHERE question_id =` the `id` of this specific question. So, Doctrine *lazily*
loads the answers data: it only makes the query once we *force* it to.

*Anyways*, we have answers! So next, let's pass these into the template, render
their data, find an even *easier* way to do this *and* finally bring our
answer-voting system to life by saving *real* vote totals to the database.
