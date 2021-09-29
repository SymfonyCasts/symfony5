# Complex Many Joins

Coming soon...

We decided to change the relationship between `Question` and `Tag` from a true many
many-to-many to a relationship where we have a join entity in between that allows us
to add more fields to this join table

In the database. This didn't actually change much. We basically had the same join
table and foreign keys as before when a PHP, it did change things in `Question` instead
of eight `$tags` property, which returned a collection of `Tag` objects. We now have a
`$questionTags` property, which returns in collection of `QuestionTag` objects. This
change almost certainly broke our front end. We're only running the tags on the
homepage. So let's open up that template `templates/question/homepage.html.twig`
twig. And let's see where Derek `tag in question.tags`. So we don't, that's not
going to work anymore because there is no `tags` property. Instead, that's going to be
`questionTags`. And then this is not going to be a `tag`. This is going to be a
`questionTag` object inside of here. We can not say `questionTag.tag` to reach
across it's relationship, that name. So still fairly straight forward. It's just a
little bit more, uh, code to reach across both relationships. All right. Let's
refresh and see what happens and whoa, semantical error. So tag where Q dot asked
that question has no association named tag. So that sounds like a query air. And sure
enough, if we scroll down, it's coming from our `QuestionRepository`. So let's go up
and up that `src/Repository/QuestionRepository` and perfect. Here it is right here
in order to solve our end plus one problem

Before one question had ate many to many tags relationship. We get join right across
that relationship by saying `q.tags` referencing the `tags` property. But now we need
to do two joins to get to the `tags` table. So no problem we'll change the `q.tags` to
`q.questionTags`, alias that to `question_tag`, and then we'll do an inner join
from `QuestionTag` to `Tag`. So `->innerJoin('question_tag.tag')`, and we'll alias that
to `tag`. And then on here, we're still selecting the tag table. Cool refresh again.
And oh, another error. This one's a bit more confusing. The paired object of entity
result with alias tag was not found the parent alias is questioned tag.

So what this is trying to say is that it doesn't like that weird selecting the tag
data, but we're not selecting the question tag data that kind of confuses things. The
solution is easy enough. We just need to select both. So you can actually pass an
array to add select. And then we'll select both question tag and tag. Alright, try
now. And we're back. Whew. Let's check out what the query looks like. It's this big
first one right here. So this is awesome. So we select from question left during a
question tag, enter, join it over to tag and then exhibit a second question.

Question tag and the tag data right there. Okay. Team. There's just one last topic I
want to cover. And it's actually, I admit not strictly related to relations. Let's
add page nation to our homepage.

