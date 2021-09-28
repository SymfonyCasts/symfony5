# Many To Many Joins

Coming soon...

Each publish questions now related to zero to five random texts. Cool. Over here on
the homepage, I want to render each tag under the vote for the question under the
vote count doing this is really nothing special using this relationship. There's
really nothing special. Open up the template for this page 
`templates/question/homepage.html.twig`, and let's see down here right after the vote string
area, we can say `{% for tag in question.tags %}`. It's that easy. Our question object
has a `tags` property. We know that that's going to return us all of the related tag
objects. In reality, it's going to need to query across the join table and then the
tag table to get that data. But we don't care. We just need to say `question.tags`
which means give me all the tag objects for this question. This is really no
different than how we could say `question.answers` to get all of the answers for a
question. So inside of here, what we're dealing with is a `Tag` object. So I will
instead of a `<span>` print `{{ tag.name }}`, and then I'll give us a couple of classes so that
it looks kind of cool.

Awesome. Let's try that refresh and the hair we go, but check out the queries on this
page. There are 41 queries. Yikes. If you open this up, we have another N plus one
problem. So this first query here is from the question tables. This is returned to
us. All of the questions. Yay. This second query here is, is, uh, actually selecting
the tagged data for a specific question. This is actually being caused by the
`question.tags` line being called for one of the questions. Then if you keep looking
down, let's skip this one. We then have that same query. The next question and the
same. Where are you for the next question and the same query for the next problem
question. We also have extra queries for the, uh, coming to answer each question, but
you can ignore this, but I want to focus on now is that we have the N plus one
problem. When we try to render the tags for each question and we fixed this
absolutely

We had this problem before on the answers page and we fix it inside of our answer
repository. Here we go by enjoining over, across the question relationship, and then
selecting the question table. We can do the exact same thing in this case. So the
controller for this page is `src/Controller/QuestionController` and its `homepage()`.
So you can see when we fence the questions we're already using a custom query called
custom repository method called `findAllAskedOrderedByNewest()`. So let's open up
the `QuestionRepository` and look at that. Okay, awesome. Here it is. So it's pretty
easy. It just makes sure that The `askedAt` is not no that's this ad is asked
CareerBuilder and then orders it from the, uh, or does it with the newest first.

So all we need to do here is add a joint, but this is interesting in the database. We
need to join from `question` to `question_tag` and then from `question_tag` over to `tag`.
So we actually need two joints, but in doctrine, we get to pretend like that join
table doesn't exist. Doctor wants us to think about, to pretend that there really is
a direct relationship. The database directly from `question` over to `tag`. What I mean
is to do this join. All we need to say is `leftJoin()` Because we want you to get the
many tags for this question,

`q.tags`. So that's it. We referenced the `tags` property on the `question`, and
then doctrine is going to figure out how to join over to that. And that is the second
area of this. I'll put `tag`. This becomes the alias of the data on the tag table. And
then to actually select that data just like before, we're going to say, `addSelect('tag')`
So joining across a many to many relationship is no different than joining
across eight, many to one relationship, except that you kind of have to pretend like
that joined table doesn't exist. You always just, when you join, you always just
reference the name of the property that you want to join across, let doctrine do the
heavy lifting. So let's try it right now. We have 41 queries when we refresh yes.
Down to one, let's open up the profiler and look at that first query. It's pretty
awesome. So what it selects, all of the question data is requiring from question and
then it took care of left joining over the question tag and then left joining again
over to tag and then selecting the tag data. So cool. Next the question tag table
that join table has only two columns on it. Question ID and tag ID one four. Wanted
to add more columns to this, like a tag that add date. There's no entity class for
this table. So is adding a third or fourth column even possible? The answer is yes,
but it does require some changes.

