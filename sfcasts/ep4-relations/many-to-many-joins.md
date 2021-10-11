# Joining Across a ManyToMany

Each published question now relates to 0 to 5 random tags. Over on the homepage, let's
render the list of tags for each question under its vote count.

## Rendering the ManyToMany Relation

And I'm happy to report that *using* a ManyToMany relationship... isn't anything
special. Open up the template for this page: `templates/question/homepage.html.twig`.
Down here... right after the vote string, add `{% for tag in question.tags %}`.

[[[ code('4588a437be') ]]]

It's that easy: our `Question` object has a `tags` property that will return a
collection of all the related `Tag` objects. Behind the scenes, to *get* this
data, Doctrine will need to query across the join table *and* the `tag` table.
But... we don't really care about that! We just get to say `question.tags` and
that returns all the `Tag` objects for this `Question`. It's really no different
than how we could say `question.answers` to get all of the answers for a question.

So inside the loop, we're dealing with a `Tag` object. Add a span, print
`{{ tag.name }}`... and then I'll give this a couple of classes to make it look
cool.

[[[ code('9f63fbe17d') ]]]

Let's try this thing! Refresh and... done! We're *awesome*.

## Joining in a Query with a ManyToMany

But check out the queries on this page: there are 41! Yikes! If you open this up,
we have another N+1 problem. This first query is from the `question` table: it
returns all of the questions. This second query selects the `tag` data for a
*specific* `question`... this is triggered when the `question.tags` line is executed.
Then... if you keep looking down - skip this one - we have that same query for the
next question... and the same query for the next... and the next. We *also* have
extra queries for counting the answers for each question, but ignore those right now.

So... when we render the tags for each question, we have the N+1 query problem!
When we had this problem before on the answers page, we fixed it inside of
`AnswerRepository`... by joining across the `question` relationship and then
*selecting* the `question` data. We can do the *exact* same thing again.

The controller for this page is `src/Controller/QuestionController.php`... it's
the `homepage()` method. 

[[[ code('3464f2faa3') ]]]

To fetch the questions, we're already calling a custom repository method 
called `findAllAskedOrderedByNewest()`.

Let's go find that: open up `QuestionRepository`. Here it is. So far, it's pretty
simple: it makes sure that the `askedAt` is not null - that's this
`addIsAskedQueryBuilder()` part - and then orders the newest first.

[[[ code('44043eee38') ]]]

To fix the N+1 problem, we need to add a join. And *this* is where things get
interesting. In the database, we need to join from `question` to `question_tag`...
and then join from `question_tag` over to `tag`. So we actually need *two*
joins.

But in Doctrine, we get to *pretend* like that join table doesn't exist: Doctrine
wants us to pretend that there is a *direct* relationship from `question` to `tag`.
What I mean is, to do the join, all we need is `->leftJoin()` - because we want
to get the *many* tags for this question - `q.tags`, `tag`.

[[[ code('8c4beae393') ]]]

That's it. We reference the `tags` property on `question`... and let *Doctrine*
figure out how to join over to that. The second argument - `tag` - becomes the
alias to the data on the `tag` table. We need that to select its data:
`addSelect('tag')`.

[[[ code('5ba8368244') ]]]

So... yup! Joining across a `ManyToMany` relationship is *no* different than joining
across a `ManyToOne` relationship: you reference the relation property and Doctrine
does the heavy lifting.

Try it now. We have 41 queries and... when we refresh... yes! Down to 21! Open up
the profiler and look at that first query... it's pretty awesome. It selects all
of the `question` data... and then took care of left joining over to `question_tag`,
left joining *again* over to `tag` and *then* selecting the tag data. *So* cool!

Next: the `question_tag` table - the join table - only has 2 columns: `question_id`
and `tag_id`. What if we wanted to add more columns to this? Like a `taggedAt`
date column? There's no entity class for this table... so is adding a 3rd or 4th
column even possible? The answer is yes: but it *does* require some changes.
