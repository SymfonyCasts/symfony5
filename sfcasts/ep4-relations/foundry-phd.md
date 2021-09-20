# Foundry Phd

Coming soon...

We no longer have a many to many relationship between a question and tag. Instead,
each question has many question tag objects in each question, tag object is related
to one tag. This means that setting any using this relation, the relationship between
question and tag just changed a bit. Let's update the fixtures to reflect this first.
Since we now have a question tag entity, we are going to be creating and persisting
question tag objects directly. So let's generate a Foundry factory for it at your
terminal run Symfony console, make factory to generate the question tag factory.
Awesome. Go open that up. Source and factory question tag factory and in get the
faults as usual. Our job is to add all the required fields. So a lot to do here. It's
a set question to question factory, colon, colon new, and I'm actually going to do
the same thing for tag setting that to tag factory colon, colon new. So as a
reminder, the new method describes a new instance of the question factory object. So
we're assigning the question attribute to the question factory to a question factory
instance. We talked earlier about how, about how that's better than doing something
like create one, because when you set a relationship property to a factory instance,
you won't actually create a question until it needs to.

So with the setup, what I'm saying is if someone creates a question tag, somebody
uses the question tag factory and doesn't override any of the attributes. What this
will do is create a brand new question and a brand new tech watch. You can see us,
let's go into our fixtures. And we'll just, we'll say a question tag factory create
many, 10. So a great quiet 10 question, factory objects. And I'm going to put a
return statement here because some of this code down here is currently broken. All
right. So let's try to fix here. Symfony console doctrine, fixtures load to see if
this works and it doesn't, but for kind of an unrelated reason, check this out. It
says, question tag set, tagged at argument. One must be a type of date, time
immutable, date time given. So this is a little bit subtle and it's kind of related
to faker.

So in faker, when you say self calling call on faker arrow, date time, that gives you
a date time object. But if you look at our question tag and state, when we generated
our tag, that field, we be sent to a doctrine, daytime immutable type. Basically what
that means is instead of, uh, that property being a date time object, it's going to
be a daytime immutable object, really the same thing, except that daytime immutables,
can't be changed. It's not that important. Anyways, the point is our type and on our
setter is daytime immutable, but we're trying to pass in a daytime instance, which
isn't the same. So the easiest way to fix this is to just update our fixtures to be a
little smarter. So we can say eight time immutable, colon colon create from mutable,
which is a method just from the situation where you can pass it a daytime immutable,
and it will create a daytime and I'll create a daytime immutable from it. Anyways, if
we reload the fixtures now, no airs run Symfony console doctrine, query SQL select
star from question tag and awesome. You can see 10 entries inside of that table and
to prove that it was creating.

And if you, the question table, you could see 10 entries in there as well. That
proves that each time we created a question tag, it's creating a brand new question,
because if you look over at fixtures at, at this point, we haven't actually created
any questions. So this works, but that's not really what we want. We want to take.
Well, we actually want is, are the published questions were down or created down here
to be related to some random tags. We don't want to create more random questions up
here. So I'm going to believe the return save and add that question tag factory line.
So the way we were doing this before is we had this call back and we said, okay, set
the tags property to a zero to five random tag objects. But our question entity does
not have a tags property anymore. Our question into now is a question tags property.
Okay. So let's change this to how about question tags And then is set to, and we
could say a question tag, factory call and call on random range here, but that would
require us to create those question tags above here first, which I don't really want
to do. So I'm gonna say question tag, colon, colon new. So we're going to set the
question, tags property to a question tag factory that this isn't making sense yet.
It's okay. Stick with me.

[inaudible]

There is one small problem with this, but this is mostly correct. So what this is
going to do is it's going to tell Foundry to use this question tag factory instance,
to create a new question tag object, but because we're doing this from inside the
question factory creation, when it creates this question tag factory, instead of
creating a new question, the question attribute is actually going to be overridden by
whatever question is currently being created. So in other words, this will not cause
a new question to be created in the database. It will relate it to, to whatever
question object is currently being created. Now I said, there is one small problem
with this and we'll see it right here. If we ate, yes, we get something that says
they property question tags. Uh, Okay. Kind of a weird air from the property accessor
about question tags can set attribute question tags. This is a little bit hard to
read, but what's happening here is this is grading eight single question tag object,
and then trying to set it onto the question, tags property. All we need is an array.
So what I'm going to do here is say->many what this basically says, we still have a
question tag factory instance, more or less, but it's configured to return many items
now onto this property.

25 living the fixtures now. Oh, and they'll tell us how many we want. Well, we can
actually give it a random range here or, uh, create anywhere from one to five new
question tag objects, somebody go over now and run the fixtures. It works

[inaudible]

And he was a really cool thing. If we select star from question, we only have 25
entries in here. That's the correct amount. That's the 20 up here and then a five
down here. So this question tag factory did not create new questions like you did a
second ago. All the new question tags are related to these 20 questions. We can see
that by queering. It's like starving question tag. And you can say each question tag
there. This is a related question. I'd be 57, 57, 57 57. The next one is 56, 56 and
then 55. So a random number. Each question is random number.

Unfortunately this line here is somewhere on this line. It is still creating a new
random tag. So if you say select star from tag, you would hope that we have a
hundred, because what we really want to do is when these question tags are created
and we want it to use one of these 100 up here, but instead of having just a hundred,
we have 160, it creates these a hundred up here. And then each for each question tag
factory, it's still creating a new tag behind the scenes. Okay? So no problem. It's
kind of nuts. But what we can do here is we can just pass. We can override the tag
for this instead of to tag factory colon, colon random to grab one existing random
tech.

So for reload fixtures now, and then FinTech table, as we're back to just 99 tags,
but there's still one tiny problem. And maybe you saw it's a little bit subtle. If we
select from question tag, you can see that down here. These last two tags are both
related to the question ID, uh, with 82. And in fact, so is this one right here?
That's great. Every question is going to have anywhere from one to five question
tags, but all three of these tags are related to the same. Uh, the same tag one, each
question is created. It calls this call back. So this callback is ultimately called
20 times. Then when the question then when each question tag is creative, that
question, it actually is going to find a random tag, but then use that for all the
question tags for this question. So the tags are being reused in the same way. This
is the same situation we've seen before. We knew as refactor to use A call back. Now,
if we reload the fixtures

And then the square from question tag. Yes. So you can see that these last two have
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

So if we try this No errors, and if you look inside of the question tag table, we get
basically the same result. We get a hundred question tags and each of these is
related to a random question and a random tag. All right, next, let's fix the front
end where we use this relationship. Now that we've changed it.

