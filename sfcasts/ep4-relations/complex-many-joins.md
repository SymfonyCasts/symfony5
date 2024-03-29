# JOINing Across Multiple Relationships

We decided to change the relationship between `Question` and `Tag` from a true
`ManyToMany` to a relationship where we have an entity in between that allows
us to add more fields to the join table.

In the database... this didn't change much: we have the same join table and foreign
keys as before. But in PHP, it *did* change things. In `Question`, instead of a
`$tags` property - which returned a collection of `Tag` objects - we now have a
`$questionTags` property that returns a collection of `QuestionTag` objects.
This change almost *certainly* broke our frontend.

We're only rendering the tags on the homepage.... so let's open up that template
`templates/question/homepage.html.twig`. Here it is: for `tag in question.tags`.
That's not going to work anymore because there *is* no `tags` property. Though,
if you want to be clever, you *could* create a `getTags()` method that loops over
the `questionTags` property and returns an array of the related `Tag` objects.

Or... you can fix it here to use `questionTag in questionTags`. Then say
`questionTag.tag` to reach across that relationship.

[[[ code('a1eeb24b8f') ]]]

So still fairly straightforward... just a bit more code to go across both
relationships.

Let's refresh and see what happens. And... whoa!

> Semantical error: near `tag WHERE q.askedAt`: Class `Question` has no association
> named `tags`.

So... that sounds like a query error... but let's look down the stack trace. Yup!
It's coming from `QuestionRepository`.

## Joining Across Two Entities

Go open that up: `src/Repository/QuestionRepository.php`... here it is. To solve
the N+1 problem, we joined directly across the previous `q.tags` relationship.
Now we're going to need *two* joins to get to the `tag` table.

No problem: change `q.tags` to `q.questionTags` and alias that to `question_tag`.
Then do an inner join from `QuestionTag` to `Tag` - `->innerJoin('question_tag.tag')` -
and alias that to `tag`.

[[[ code('28d2abb971') ]]]

Cool! And we're still selecting the `tag` data... so that looks good to me.

Refresh again and... another error! This one... is even more confusing.

> The parent object of entity result with alias `tag` was not found. The parent
> alias is `question_tag`.

This is trying to say that it doesn't like that we're selecting the `tag`
data... but we're *not* selecting the `question_tag` data that's *between*
`Question` and `Tag`. Doing that *is* legal in SQL... but it messes up how
Doctrine creates the objects, so it doesn't allow it.

The solution is easy enough: select both. You can actually pass an array to
`addSelect()` to select `question_tag` *and* `tag`.

[[[ code('6158efe8d7') ]]]

Try it now. And... we're back! Woo! Check out what the query looks like... it's
this big first one. So cool: we select from `question` left join to `question_tag`,
inner join over to `tag`... and grab all of that data.

Okay team: there's just *one* last topic I want to cover... and, I admit, it's not
*strictly* related to relations. Let's add pagination to our homepage.
