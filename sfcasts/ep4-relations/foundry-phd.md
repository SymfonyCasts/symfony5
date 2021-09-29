# Doing Crazy things with Foundry & Fixtures

Coming soon...

We want to take. Well, we
actually want is, are the published questions were down or created down here to be
related to some random tags. We don't want to create more random questions up here.
So I'm going to believe the return save and add that `QuestionTagFactory` line. So
the way we were doing this before is we had this call back and we said, okay, set
the tags property to a zero to five random tag objects. But our question entity does
not have a `tags` property anymore. Our question into now is a `questionTags`
property. Okay. So let's change this to how about `questionTags` And then is set
to, and we could say a `QuestionTagFactory::randomRange()` here, but that would
require us to create those question tags above here first, which I don't really want
to do. So I'm gonna say `QuestionTagFactory::new()`. So we're going to set the
`questionTags` property to a `QuestionTagFactory` that this isn't making sense yet.
It's okay. Stick with me


There is one small problem with this, but this is mostly correct. So what this is
going to do is it's going to tell Foundry to use this `QuestionTagFactory` instance,
to create a new `QuestionTag` object, but because we're doing this from inside the
`QuestionFactory` creation, when it creates this `QuestionTagFactory`, instead of
creating a new `Question`, the question attribute is actually going to be overridden by
whatever question is currently being created. So in other words, this will not cause
a new question to be created in the database. It will relate it to, to whatever
question object is currently being created. Now I said, there is one small problem
with this and we'll see it right here.

```terminal-silent
symfony console doctrine:fixtures:load
```

If we ate, yes, we get something that says
they property question tags. Uh, Okay. Kind of a weird air from the property accessor
about question tags can set attribute question tags. This is a little bit hard to
read, but what's happening here is this is grading eight single question tag object,
and then trying to set it onto the question, tags property. All we need is an array.
So what I'm going to do here is say `->many()` what this basically says, we still have a
`QuestionTagFactory` instance, more or less, but it's configured to return many items
now onto this property.

25 living the fixtures now.

```terminal-silent
symfony console doctrine:fixtures:load
```

Oh, and they'll tell us how many we want. Well, we can
actually give it a random range here or, uh, create anywhere from one to five new
question tag objects, somebody go over now and run the fixtures.

```terminal-silent
symfony console doctrine:fixtures:load
```

It works

And he was a really cool thing. If we `SELECT * FROM question`,

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question'
```

we only have 25
entries in here. That's the correct amount. That's the 20 up here and then a five
down here. So this question tag factory did not create new questions like you did a
second ago. All the new question tags are related to these 20 questions. We can see
that by queering. `SELECT * FROM question_tag`.

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

And you can say each question tag
there. This is a related question. I'd be 57, 57, 57 57. The next one is 56, 56 and
then 55. So a random number. Each question is random number.

Unfortunately this line here is somewhere on this line. It is still creating a new
random tag. So if you say `SELECT * FROM tag`

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM tag'
```

you would hope that we have a
hundred, because what we really want to do is when these question tags are created
and we want it to use one of these 100 up here, but instead of having just a hundred,
we have 160, it creates these a hundred up here. And then each for each question tag
factory, it's still creating a new tag behind the scenes. Okay? So no problem. It's
kind of nuts. But what we can do here is we can just pass. We can override the `tag`
for this instead of to `TagFactory::random()` to grab one existing random
`Tag`.

So for reload fixtures now,

```terminal-silent
symfony console doctrine:fixtures:load
```

and then query for tag table,

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM tag'
```

as we're back to just 99 tags,
but there's still one tiny problem. And maybe you saw it's a little bit subtle. If we
select from question tag,

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

you can see that down here. These last two tags are both
related to the question ID, uh, with 82. And in fact, so is this one right here?
That's great. Every question is going to have anywhere from one to five question
tags, but all three of these tags are related to the same. Uh, the same tag one, each
question is created. It calls this call back. So this callback is ultimately called
20 times. Then when the question then when each question tag is creative, that
question, it actually is going to find a random tag, but then use that for all the
question tags for this question. So the tags are being reused in the same way. This
is the same situation we've seen before. We knew as refactor to use A call back. Now,
if we reload the fixtures

```terminal-silent
symfony console doctrine:fixtures:load
```

And then the square from question tag.

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

Yes. So you can see that these last two have
the same question ID and they also, but they have different tag IDs. This has
accomplished our mission. Now this is the most insane thing that you can do with
Foundry. This says, create 20 questions for each question. The question tags should
be set to a new question tag, except I want that question tag to be assigned to this
question. Cause since it's inside the, that call back to that question and I would
override it's tag, it should be one of these random tags here. Pru regulations. Do
you not have your PhD in using Foundry? Now you do not need to make it this
complicated. I mostly did this just to prove and show like the deepest, darkest parts
of Foundry, An easier way to do this would have been to create a hundred tags, 20
published questions. And then down here, Use the question tag factory to create, For
example, a hundred question tags Were each one Is related to a random tag And also a
random question. So if you did this, then you can actually simplify things a whole
lot.

So if we try this

```terminal-silent
symfony console doctrine:fixtures:load
```

No errors, and if you look inside of the question tag table,

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

we get
basically the same result. We get a hundred question tags and each of these is
related to a random question and a random tag. All right, next, let's fix the front
end where we use this relationship. Now that we've changed it.
