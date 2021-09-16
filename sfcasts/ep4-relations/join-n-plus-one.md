# Join N Plus One

Coming soon...

Look at the queries on this page, they're either of them, or maybe for you, there
might be 11 or eight or nine. It actually depends on how many unique questions these
10 answers are related to. That's a lot of queries for such a simple page and the
culprit behind this, what we're seeing is the N plus one problem. If you look at the
queries, the first query is for all of the most popular answers where status is
approved, ordered by the most boats on top of limit 10, simple enough. The problem
then is that each time it renders an answer, we print the question data for that
answer. So at the moment that we print this question here, doctrine makes a second
query from the question table for that specific question. So in this case where ID =
463, then it goes on to the second answer. And when it renders its question, it makes
another query, which is this third query down here. So we ended up with is one query
to get the 10 answers. Plus 10 more queries down here, one query for each question,
one query to get the question data for each answer. This is called an N plus one, we
have end results, 10 results. We end up with 10 queries down here, plus the one up
here.

This is a classic problem with this is a really easy problem to happen when you're
using doctrine. Thanks to the lazy loading in our answer controller. We just queered
for the answers. Then as we're looping over those answers and rendering_answer that
HTML twig. We simply sent, answered that question text and answer that question about
slug at this moment. That's when it made that extra query for the question data
related to this answer, we didn't even realize it. We actually caused a second year
or really a second query per answer. That's a terrible explanation.

The point is we end up with a lot of queries on this page and in theory, we shouldn't
need so many queries and maybe it's not really a problem, but if you can, but
avoiding extra queries when you can, is always a good thing. So let's think about a
normal database. How would we solve this? Well, just thinking about the query, what I
would do is I would, so when I select all the most popular answers, I would do an
inner join over to the question table and also grab the question data at the same
time. In other words, we can make a single query here that will grab all of the
answers data and the question data all with one query. And we add a join with
doctrine, absolutely head over here to answer repository and trying to find most
popular method.

It's this simple. We want to do an inner join. So let's say arrow, inner join. And
then you just say, answer that question. So you just answered that question with
comma question. So you do here is you basically tell doctrine, Hey, I want you to
join a cross the answer dot question relationship. You don't need to tell it how to
join like you would do in a normal query cause doctrine didn't figure that out for
us. It looks at the question property and answer realizes that that's a relationship
over to the question table and we'll handle creating this, uh, generating the SQL for
this. Join for us.

Now, the second argument here, isn't really important yet, but this will become the
alias to the question results. If we need it further in the query in the same way
that answers the alias to the answer table up here. All right, so let's try it. I'll
close the profiler refresh and we still have a queries that didn't work. Let's open
up the profiler. Let's see here. If you look at our first query, there is the inner
join. It does say inner join over to question. And of course it set up the on
question ID, uh, stuff for us, what it did, but we still have all the extra queries.
The problem is that this joined over to the question table, but it didn't actually
select any question data. It's still only selecting the, uh, answer data. Let me hit
view format it query. So you can see this a little bit better.

There is our joint over to question, but it's still only actually selecting data from
the answer table. So there are really two purposes of a joint. The first is when you
want to select more data and that's the situation we want to select all the answer
and question data all at once. The second situation is when you want to join over to
across relationship so that you can filter the results or order the query based on
something in that joint table. And we're going to see that in a minute. The point is,
if you trying to select more data, then you need to actually say that in the query.
And you do that by saying, add select. And then you reference the alias to the table.
You want to select, so question now, two things about this known, as I'm not saying a
question that ID or a question that's a slug. I'm just saying question, which means
grab every firm thing from the question table that I kind of confused anything about
this is that this isn't going to change what this method returns. This method is
still going to return an array of answer objects, but that each answer object is
already going to have the question data preloaded onto it. So check this out. If I
refresh the page still works exactly like before, because that method still returns
an array of answer objects, but our query is down to one.

Since we're now grabbing all of the data that we need with that one original query.
Once we start trying to render the question for each answer, doctor realizes that
that data is already available and uses it instead of making extra queries. That is
the fixed to the N plus one problem. What about the other situation where you want to
join across the tables that we can filter the results based on one of the columns in
the question table? Well, let's talk, let's look that next by adding a search to our
most popular answers page.

