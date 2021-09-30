# Relation OrderBy & fetch=EXTRA_LAZY

You know what? On this page, we're missing the "created at" for each answer: I
want to be able to see *when* each answer was posted. Let's fix that.

Head over to the template - `show.html.twig` - and, down here... right before the
vote arrows, add a `<small>` tag and then `{{ answer.createdAt }}`. Of course, that
will give us  a `DateTime` object... and you can't just print a `DateTime`. But
you *can* pipe it to the `date()` filter. Or in the last tutorial, we installed a
library that allows us to say `|ago`.

[[[ code('4629aa6ee4') ]]]

When we refresh now... oh! We get an error:

> The `Question` object cannot be found by the `@ParamConverter` annotation.

That's a fancy way of saying that no `Question` for the `slug` in the URL could be
found in the database. And *that's* because I reloaded my fixtures. Go to
the homepage, refresh... and click into a fresh question. Actually, let me try a
different one... I want something with several answers. Perfect. And each answer
*does* display how long ago it was added.

## Ordering $question->getAnswers() with ORM\OrderBy

But this highlights a small problem... or question: what *order* are these answers
being returned from the database? Right now... there's *no* specific order. You can
see that in the query for the answers: it just queries for all the answers where
`question_id = ?` this question... but there's no `ORDER BY`.

At first, it seems like this is one of the downsides of using the convenience methods
for a relationship like `$question->getAnswers()`: you don't have a lot of control
over the results. But... that's not entirely true.

The easiest thing that you *can* control is how the answers are ordered. Go into
the `Question` class and scroll up to the `$answers` property. To control the order
add `@ORM\OrderBy()` and pass this an array with `{"createdAt" = "DESC"}`.

[[[ code('0043abcee5') ]]]

That's it! Go back, refresh and... perfect! These are now ordered with the
newest first!

## Optimizing The Query to Count a Relation: EXTRA_LAZY

Let's learn another trick. On the homepage, we show the number of answers
for each question. Well... kind of: they all say 6 because that number is still
hardcoded. Let's fix that.

Open the template for this: `templates/question/homepage.html.twig`... and I'll
search for "6". Here it is. Replace this with `{{ question.answers|length }}`

[[[ code('b1e2f8233b') ]]]

So we get the collection of answers and then count them. Simple enough! And if we
try it... this works: two answers, six answers, eight answers.

But check out the web debug toolbar. Woh! We suddenly have a *lot* of queries.
Click to open Doctrine's profiler. The first query is still for all of the question
objects. But then, one-by-one it selects `FROM answer WHERE question_id = ?` a
specific question. It does this for the first question, then it selects the answers
for the next question... and the next and the next.

This is called the N+1 problem: We have 1 query that gives us all of the questions.
Then, for each of the the N questions, when we ask for its answers, it makes
*another* query. The total query count is the number of questions - N - plus 1
for the original.

We're going to talk more about the N+1 problem later and how to fix it. But
there's kind of a *bigger* problem right now: we're querying for *all* of
the answer data.... simply to count them! That's *total* overkill!

As soon as we access this `answers` property, Doctrine queries for all the data
so that it can return all of the `Answer` objects. Normally, that's great - because
we *do* want to use those `Answer` objects. But in this case... all we want to do
is count them!

If you find yourself in this situation, there *is* a solution. In the `Question`
class, at the end of the `OneToMany()`, pass a new option called `fetch=""` set
to `EXTRA_LAZY`.

[[[ code('351175cd84') ]]]

Watch what happens. Right now we have 21 queries. When we refresh, we *still* have
21 queries. But open up the profiler. The first query is still the same. But
every query *after* just selects `COUNT() FROM answer`! Instead of querying
for all of the `answer` data, it only counts them!

*This* is what `fetch="EXTRA_LAZY"` gets you. If Doctrine determines that you're
accessing a relation... but you're only *counting* that relation - not *actually*
trying to use its data - then it will create a "count" query instead of grabbing
all the data.

That's awesome! *So* awesome that you might be wondering: why isn't this the
*default* behavior? If I'm counting the relation, why would we *ever* want Doctrine
to query for *all* of the data?

Well... `EXTRA_LAZY` isn't *always* a good thing. Go to a question show page. Having
the `EXTRA_LAZY` actually causes an *extra* query here. Before that change, this
page required 2 queries. Now it has *3*. Check them out. First, it selects the
question data. Then it counts the answers. And *then* it re-does that query to
grab all the data for the answers. That second `COUNT` query is new... and,
in theory, shouldn't be needed.

The problem is the order of the code in the template. You can see this in
`show.html.twig`: *before* we loop over the answers and use their data, we *first*
count them. So at this moment Doctrine says:

> Hey! You want to count the answers! I'll make a quick COUNT query for that.

Then, a millisecond later, we loop over all the answers... and so we need their
data anyways. This causes Doctrine to make the full query.

If we reversed the order of this code - where we loop and use the data *first* -
Doctrine would *avoid* the extra COUNT query because it would already know how
many answers it has because it just queried for their data.

All of this is probably not *too* important and I'm going to leave it. In general,
don't overly worry about optimizing. In the real world, I use Blackfire on
production to find what my *real* performance issues are.

Next: in addition to changing the order of the answers when we call
`$question->getAnswers()`, we can also *filter* this collection to, for example,
only return *approved* answers. Let's get that set up next.
