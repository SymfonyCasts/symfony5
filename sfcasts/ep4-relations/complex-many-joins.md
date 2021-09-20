# Complex Many Joins

Coming soon...

[inaudible]

We decided to change the relationship between question and tag from a true many
many-to-many to a relationship where we have a join entity in between that allows us
to add more fields to this join table

In the database. This didn't actually change much. We basically had the same join
table and foreign keys as before when a PHP, it did change things in question instead
of eight tags property, which returned a collection of tag objects. We now have a
question tags property, which returns in collection of question tag objects. This
change almost certainly broke our front end. We're only running the tags on the
homepage. So let's open up that template templates, question homepage that HTML that
twig. And let's see where Derek tag in question dot tag. So we don't, that's not
going to work anymore because there is no tags property. Instead, that's going to be
questioned tags. And then this is not going to be a tag. This is going to be a
question tag object inside of here. We can not say question tag that tag to reach
across it's relationship, that name. So still fairly straight forward. It's just a
little bit more, uh, code to reach across both relationships. All right. Let's
refresh and see what happens and whoa, semantical error. So tag where Q dot asked
that question has no association named tax. So that sounds like a query air. And sure
enough, if we scroll down, it's coming from our question repository. So let's go up
and up that service repository question repository and perfect. Here it is right here
in order to solve our end plus one problem

[inaudible]

Before one question had ate many to many tags relationship. We get join right across
that relationship by saying Q dot tags referencing the tags property. But now we need
to do two joins to get to the tags table. So no problem we'll change the cute tags to
cute app question tags, alias that to question_tag, and then we'll do an inner join
from question tag to tech. So->inner join question tag that tag, and we'll alias that
to that. And then on here, we're still selecting the tag table. Cool refresh again.
And oh, another error. This one's a bit more confusing. The paired object of entity
result with alias tag was not found the parent alias is questioned tag.

So what this is trying to say is that it doesn't like that weird selecting the tag
data, but we're not selecting the question tag data that kind of confuses things. The
solution is easy enough. We just need to select both. So you can actually pass an
array to add select. And then we'll select both question tag and tag. Alright, try
now. And we're back. Whew. Let's check out what the query looks like. It's this big
first one right here. So this is awesome. So we select from question left during a
question tag, enter, join it over to tag and then exhibit a second question.

[inaudible]

Question tag and the tag data right there. Okay. Team. There's just one last topic I
want to cover. And it's actually, I admit not strictly related to relations. Let's
add page nation to our homepage.

