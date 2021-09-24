# Joining Across a Relationship & The N + 1 Problem

Look at the queries on this page: there are 8... or for you there might be 11, 10
or 9: it depends on how many *unique* questions these 10 answers are related to.

## The N+1 Problem

Whatever your number is, that's a lot of queries for such a simple page! The
*cause* of all of this is the N+1 problem.

Look at the queries in the profiler. The first is for the answers: where status is
approved, ordered by the most votes DESC, limit 10. Simple enough. Then, each time
we render an answer, we *also* render that answer's question. The moment we do
that, Doctrine makes a second query from the `question` table to get that answer's
question data: so in this case `WHERE id = 463`. Then we render the second answer...
and make another query to get *its* question data... which is this third query.

Ultimately, we end up with is 1 query to get the 10 answers plus 10 *more* queries:
one for each answer's question. That's the N + 1 problem. Well, if two answers
share the same question, you might have *less* than 11 queries - but it's still
not great.

This is a classic problem that's *really* easy to trigger when using a nice system
like Doctrine. In `AnswerController`, we simply queried for the answers. Then, as
we looped over them and rendered `_answer.html.twig`, we innocently rendered
`answer.questionText` and `answer.question.slug`. It doesn't look like much, but
*those* lines caused an extra query.

The point is: we end up with a lot of queries on this page and, in theory, we
shouldn't need so many! So let's think: in a normal database, how would we solve
this? Well, thinking about the query, we could select the most popular answers
and then `INNER JOIN` over to the `question` to grab *that* data. Yup, we could
grab all the answer *and* question data in the same, one query.

## Joining in a QueryBuilder

Can we add a join with Doctrine? Of course! Head over here to `AnswerRepository`,
to the `findMostPopular()` method. It's this simple: say
`->innerJoin()` passing this `answer.question` and then `question`.

Remember: `answer` is the alias we're using for our `answer` table. So the
`answer.question` part refers to the `question` *property* on the `Answer` class.
This basically tells Doctrine:

> Hey! I want you to do an inner join across the `answer.question` relationship.

We don't need to tell Doctrine *how* to join like you would in a normal query...
we don't need to say "JOIN question ON answer.question_id = question.id".
Nope! Doctrine looks at the `$question` property on `Answer`, sees that it's a
relationship over to the `question` table and it generating the SQL needed
automatically. It's awesome!

The second argument isn't important yet, but this becomes the "alias" to the question
table, just like how `answer` is the alias to the `answer` table.

## The 2 Reasons to Join

Ok, so let's try this! Close the profiler, refresh and... hmm. We have the same
number of queries! So that didn't work.

Open up the profiler. If you look at our first query... cool! There's the inner
join! And it's perfect: Doctrine generated the exact SQL needed. So then... why
do we still have all the extra queries? Shouldn't Doctrine be able to get all
the question data from the first query?

Yes... but the problem is that we joined over to the `question` table... but didn't
actually *select* any question *data*. It's still only selecting from `answer`.
This is more obvious if we look at the formatted query. It joins to `question`,
but only selects from `answer`.

This leads us to an important point! There are two reasons that you might use a
JOIN in a query. The first is when you want to select more data, and that's our
situation: we want to select all the answer *and* question data at once.

The *second* situation is when you want to join across a relationship... not to
select more data, but to filter or order the results based on something in the
joined table. We'll see that in a minute.

## Selecting Data on a Joined Table

The point is: if you trying to select more data, then you need to actually *say*
that in the query. You do that with `->addSelect()` and then the alias to the
table: `question`.

Now, there are two two important things here. First, notice that I'm not saying
`question.id`, `question.slug` or even `question.*`: I'm just saying `question`.
This tells Doctrine to grab everything from `question`.

The *second* important thing is that, even though we're now selecting more data,
this does *not* change what this method returns: it will *still* return an array
of `Answer` objects. But now, each `Answer` object will *already* have the
`Question` data preloaded into it.

Check this out. Refresh the page. Yup! It still works *exactly* like before,
because that method *still* returns an array of `Answer` objects! *But* our query
count is down to 1!

Since we're now grabbing the `question` data in the first query, when we try to
render the question for each answer, Doctrine realizes that it *already* has that
data and avoids the query. That's the fix for the N+1 problem.

What about the *other* reason for joining... where you want to join across a
relationship in order to filter the results... like to only return answers whose
question is *published*.

Let's talk about that next by adding a search to our most popular answers page.
