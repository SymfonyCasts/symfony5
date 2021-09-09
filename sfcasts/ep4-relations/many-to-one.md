# The ManyToOne Relation

Coming soon...

Okay. We have a question and to the table, we have an insert entity and they will

Cool. But

What we really want to do is relate an answer to a question. So forget about doctrine
for a second. Let's just think how this would look in a database.

No,

Each answer belongs to a single question. We would normally model this in the
database by adding a question ID column to the answer table. That's a foreign key to
a question. This will allow each question to have that many answers and each answer
to be related to exactly one question. Okay. Ultimately, that's exactly what our
database is going to look like, but we'll get there in a slightly different kind of
simpler way. All right. So now back to thinking about doctrine so far, whenever we
want to add a column to a table, we add a property to that entity and with the
relationship, this is still true. We need to add a new property to answer. All right.
So let's do it all. Run at the Symfony console,

Make entity.

When it asks us to which entity you want, update, update, answer. Now, what should
the new property name be? Question ID actually, no, and this is one of the coolest,
but trickiest things about doctrine. Instead, just

Use question.

We'll see why soon

For the type I'm going

To answer with a sort of fake relation to type. This starts a wizard that will guide
us through the process of adding a relationship. All right. What classes should this
entity to relate it to? So an answers, should it be related to a question?

Awesome.

Now it explains the four types of relationships and give some examples of each of
them. So you can read through all of these, but in this case, the one we want is many
to one. Each answer relates to one question. Each question can have many answers.
That's perfect. I'm going to select many to one, which is kind of the king of
relationships. All right. Is the answer to that question of property allowed to be
no. So can you have an answer that has no question? I'm going to say no. In other
words, that's going to be required in the database.

Okay. Ask him, do you want to

Add a new property to question so you can access, update, answer objects from it. Now
this really important. Each relationship can have two sides. If you think about it.
So an answer has one question, but you can also view the relationship from the other
direction and say that a question has many answers. No matter what we answer to this
question, we will be able to get and set the question for an answer. If we say yes
here, it simply means that we will also be able to say something like question-> get
answers, to get all the answers for a given question.

Hey, that sounds pretty convenient.

No, here in everything, we worked fine. But since being able to save the
questionnaire, get answers seems pretty useful. Let's say, yes, there's no downside,
except that it will generate a bit more finally. And then it says, what's the mission
of the new field. Maybe instead of questions, instead of the question, that's easy.
It suggests answers. Let's use that. And finally it asks you, if you wanted this
thing called an orphan removal, this is a little bit more advanced and deals with
like forum questions. You probably don't need it. So I'll say no, you can always
change this later, directly in your entity and done. Okay. So we hit enter one more
time to exit the wizard. All right, let's go look at the entities I committed before
hitting recording for recording. Cause I'm going to get status. Ah, so both entities
were updated. Let's open the answer entity first.

Okay. Oh, and editing a new question property. But instead of having at, or I'm slack
or I'm /column, it has RM /many to one, which then describes it. This is related to
the question entity. And if you scroll to the bottom, it has just normal and get her
in center methods. One key thing you'll notice. And we'll talk more about this in the
next chapter. Is that when you send a question, you actually pass an object. Not just
the idea, that question anyways, once go check out the question entity. All right. So
if we scroll down all the way to here, beautiful. So question now has an answers
property, which is a one to many relationship.

And then down at the bottom

That has to get her and set setter methods like get answers. Oh, except instead of
having a set answers method, it has an add answer method and a remove answer method,
which are just a little bit more convenient than having a set answers method. And
there's one more thing this did up near the top of the class. It created a
constructor and an initialize, the answers property to an array collection. So a high
level, a question is going to have many answers. So we know that this is going to be
an array or like a collection in doctrine for internal reasons. Instead of having
answers, be an array, it's this array collection object. And then it's not too
important. Or Ray collection looks and acts like an array. You can loop, for example,
you can loop over it, but it has a couple of nice extra methods on it. But anyways,
anytime you have any time, you have a relationship that whole is a collection of
other items. You need to initialize it in your constructor. Like you see here, if you
use them against the command that will be done for you. All right. So now I kind of
want to point something out that we just saw. We generated a many to one
relationship. We saw this on the answer entity,

But

In the question entity, it says one

To many.

This is a key thing to understand a many to one relationship and a one to many
relationship. Aren't two different types of relationships. They described the same
tight relationship just from the two different sides. From the perspective of a
question as a one to many, to the answer entity from answering to these eight, many
to one to question, the point is when you see these two relationships, they're not
really two different things. They're just the same thing. Seeing from two different
directions. All right. So we have added as a new stuff to answer these. So let's go
make a migration, current and Symfony consult make migration. And when that finishes
it's been over and open up that new file. Okay. Let's check it out. Oh, beautiful.
Check it out to table answer. Add question ID. So relationships were really cool
because in the answer entity, we have a question property, but doctrine is smart
enough when it creates the migration to turn it into a question I D column that will
hold an integral, hold the, uh, ID because that's a foreign key to the ID property on
question. In

Other words, the, all the, the

Table structure ultimately looks exactly like we expected. So the looks exactly like
we expected the tricky, but honestly, awesome part is that in PHP

To relay

An answer to a question, we'll do that by setting an entire question object onto the
question property, not an energy ID. Let's see exactly how to do that next.

