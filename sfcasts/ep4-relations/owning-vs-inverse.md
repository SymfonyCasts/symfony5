# Owning Vs Inverse

Coming soon...

There's a kind of complex topic in doctrine relations that we need to talk about is
the owning versus inverse side of a relationship. We know that you can see each
relation from two different sides. Question is a one to many to answers in the same
relation can be seen as an answer is many to one to question. So what's the big deal
we already know that we can read from both sides. We can say answer arrow, get
question, or we can say question arrow, get answers. No problem. But can you set data
from both directions? Well, in answer factory, when we originally started playing
with relationships, we prove that you can say answer arrow, set question to set the
relationship, but now let's try the other direction. I'm going to do this in plain
PHP to playing PHP for clarity.

[inaudible],

I'll paste in some code here. Uh, so very simple. I'm using a question factory to
create one question. I'm just kind of being lazy and letting it do that. Then I'm
creating, creating two different answer objects entirely by hand, and then a
persisting, both of the answers.

[inaudible]

I don't need to persist the question because the question factory takes care of that
for me.

So, so far the, this question and these two answers are not related to each other. So
not surprisingly, if we run the Symfony console doctrine fixtures load, we get our
favorite air, which is that the question ID column can not be no on the answer table.
Cool. So let's relate these, but this time, instead of saying, answer one->set
question, like, would it be for let's say question arrow, add answer, answer one. And
then question arrow. Add, answer, answer to, so we're setting them in the
relationship from the other direction. All right. Try Symfony console, document
fixtures load again, and okay. No errors. It looks like that worked to be sure I'm
going to run Symfony console doctrine, weary, SQL select star from answer. And if we
look beautiful, here is our last two answers right here. Oh, apparently I used answer
one for both of these silly Ryan, but anyways, we can see each of these answers is
correctly related to a question. Alright. So it turns out you can set data from both
sides. The two sides of the relationship apparently behave identically chapter over.

Uh, I wish what you just saw is a bit of a lie inside the question class, find the ad
answer method. This was generated for us by the make entity command. You check this
out it first checks to see if first X to see if the answers property already contains
the answer. Just to make sure it doesn't get added, uh, just to avoid a duplication.
If it's, if this question is not already inside the answers collection, it of course
adds it to the answers collection, but then it calls answer arrows set question. This
that is very important. It's synchronizing or setting the other side of the
relationship.

So if an answer is added to a question, that question is also set onto the answer. So
here's the key thing. Comment out this line and then go reload the fixtures again.
Error con question and D cannot be no, it did not relate the question in the answer
properly. This is what I wanted to talk about. Each relation has two different sides
and these have a name, the owning side and the inverse side for a many to one and one
to many relationship. The owning side is always the many to one side, and it's kind
of easy to remember. The owning side is where the column lives in the database. So
the database would know that the answer table has a question_ID column. So this is
the owning side of the relationship. The one to many is called the inverse side. This
is important because when you save doctrine only looks for the data on the owning
side of the relationship. It only looks at the question property on the answer
entity, when it figures out how to say this stuff, it completely ignores any of the
data on the inverse side. The inverse side of the relationship solely exists for the
convenience of us reading that data. So right now we are only setting the inverse
side of in the relationship. And so when it saves the answer, it does not link the
answer to this question.

And in general, the inverse side of a relationship is entirely optional. The make
entity command asked us if we wanted to map this side of the relationship, we can
delete everything inside this class related to answers, and the relationship would
still be set up in the database and we could still use it. We just wouldn't be able
to say, questionnaire I'll get answers anymore. I'm telling you all this so that you
can avoid potential WTF moments if you relate objects, but they mysteriously don't
actually safe. Fortunately, the make entity command takes care of all this ugliness
for us by generating really smart, add answer, and remove answer methods that
synchronize the owning side of the relationship. Let's put back the answer->set
question so that we can, once again, safely set the data from either side back in the
fixtures. Now that we've learned all of this, let's delete all of our custom code and
I'm going to head back over and one more time, just get a fresh set of fixtures. All
right, next, when we call question arrow, get answers, which we're currently doing
inside of our template. What order is it returning those answers? And can we control
that order? Plus we'll learn a config trick to optimize what query is made. When all
we need to do is count the number of items in a relation.

