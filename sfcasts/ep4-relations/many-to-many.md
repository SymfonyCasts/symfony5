# Many To Many

Coming soon...

Okay. So each question is going to be able to have many tags. You can almost imagine
them being rendered at below the question, but then each tag could be related to many
questions. O M G we need a many to many relationship, but don't take my word for it.
Let's pretend we haven't figured this out yet. We just know that we want to be able
to set tag objects onto a question object. In other words, we want our question class
to have a tags property. Well, as add that, find your terminal in Symfony console,
make entity for which entity to edit. You could actually choose question or tag. It
really won't make much difference, but conceptually, we're thinking that we want to
edit the question and state so that we can add a new property called texts. Let's
once again, use the fake, uh, field type called relationship. So it'll walk us
through the process. Okay. What class should this anti-gay be related to? This is
going to be related to the tag entity. And just like before we see our big, a big
table, you're describing the relationship, this is what can help you figure out which
type you need. So if you zoom in on many to many here, it says, each question can
have many tag objects and each tag can also relate to many question objects that
describes our situation perfectly.

So let's answer many too many and then asks us just like with our other relationship.
Do we want to add a new property to tag so that we can access or update question
objects from it? It's basically saying, Hey, would it be convenient for you to have a
tag arrow, get questions, method, and maybe a water. Maybe it wouldn't, but let's say
yes, this will make a generate the other side of the relationship. We'll see that in
a second. What field? What problem? What's the name of the prop? Which would that
property name be called? Question sounds perfect. So I'll leave it and done. You can
say updated both the question and tag classes and I'll hit enter to exit the wizard.
All right, let's go check out the entities. Start in question. Awesome. No surprise.
It added a new tags property, which will hold a collection of tag objects.

And as we mentioned before, whenever you have a relationship, a doctrine that holds a
collection of things, whether that's a collection of answers or a collection of tags
in the construct method, you need to initialize it to an array collection that's
taken care of for us. I just wanted to point that up. Now have above this. It says,
if they may need the money that targets the tag class, if you scroll down to the
bottom, it really looks a lot like the answers, uh, relation. There's a good tags
method and then an ad tag and a remove tag. If you look over at the tag and see
things look pretty much the same, we have a questions property, which is in this lies
to an array collection. It is also a many to many, and it points that the question
class you focus on the class. It has good questions. Add question and remove
question. Okay, Well, let's see how this is going to look in the database to find
your terminal and generate the migration with Symfony console and make migration.
Once it finishes, spin over and open that new file, let's see wall. It creates a
brand new table called a question tag that new table has only two columns, eight
question ID, foreign key, and a tag ID foreign key. That is it.

Even how side of doctrine. This is how you build a many to many relationship, any re
in a database. You do it with what's called a join table

With doctrine. It's no different, except that doctrine is going to handle the heavy
lifting of inserting and removing records on this table. For us, I'll show you, but
first let's spin back over to our terminal Iran, Symfony console doctrine,
migrations, migrate to add that new joint table. Okay, let's see how we can relate
these objects in action. So open up our source data fixtures at fixers dot PHP class.
We're going to discrete a couple of objects by hand. So first I'll say question =
question factory colon call and create one. So I'll kind of create a question, the
lazy way using my factory. Then I'm going to create two tag objects. I'll just paste
their code here

To tag objects for something that I spend a lot of time thinking about along with my
four year old. And then to actually say these on your own call manager, Aero persist,
uh, Taiwan and manager->persists tag two. Awesome. So right now it's going to great.
One new question and two new tags, but they're not going to be related to the
database. So how do we relate them? Well, don't think at all about this join table
that was created almost pretend like that doesn't even exist. Just think I want to
relate these two tag objects to this question.

And so the way to do this is by saying question arrow, add tag tag one questionnaire,
add tag tag two. That's it let's go over that are fixtures, Symfony console doctrine,
fixtures load, and no errors. What's up in the database doctrine query SQL let's
first select star from tech. No surprise. We have two entries inside of that table.
Now select star from the joint from question tag, the join table inside of there.
Yes, it actually is. When we, we have two rows inside of here, this is this first one
is relating the first tag to that question. And this is relating the second tag to
that question. How cool is that? We simply relate the objects in PHP in doctrine
handles inserting the rows as needed into the joint table. If we saved all this stuff
and then down here, it said, question arrow, remove tag tab one, and saved again.
This would actually cause doctrine to delete that this first row in that table, by
the way, like with many to one and one to many relationships, a many to many has an
owning side.

And in inverse side, because we originally modified the question entity and added a
tags property. This is the owning side. It's actually determined because you can see
that it's pointing to the other side by saying inversed by. So it's pointing to the
inverse side of the relationship. Then over in tag, this is the inverse side of the
relationship. And you can see it's saying mapped by = tax is basically saying to find
the owning side, go look at the tags property in question. This means that the fact
that this has an owning an inverse side of the relationships, it means that
technically speaking, when we want to relate a tag and question me only way to do it
is by setting the question tags property.

If we changed this logic to be tag one arrow, add question, question, and tag to air.
Add question question. So only. So set the Inver side that wouldn't work well,
actually it will work for the same reason that we saw before, but let's try it. So
reload the fixtures and oh, we actually get an area this is related to Foundry. So it
says tag, add question argument. One question. It must be a type question proxy
given. So when you create an object with a Foundry, like up here, it actually returns
a proxy object that wraps your two true question object. It doesn't normally matter,
but if you start mixing Foundry code with non Foundry code, sometimes you can get
that air anyways in con object method. And now this will be a pure question object.
Anyways, wondering we reload the fixtures again, it works. And more importantly, if
we created a joint table, we still have two rows in there, meaning that we were able
to relate tag and questions by setting the inverse side, which is exactly the
opposite of what I said.

But this only works because our entity code was generated smart. If you look at any
tag and state and go down to the ad question method. Yep. It calls question. Add tag
this. We saw this exact same thing with the question, answer relationship. When we
call, add question, it sets the owning side of the relationship. That is why this
saved. Watch. If we commented this line out, then reload. The fixtures. This time he
joined table is empty. We do have to tag objects. It's just that when they were, they
weren't ever related to the database because the owning side of their relationship
was never set. So let's put that back again. Thanks to the generated code for make
and state. You shouldn't ever really need to think about this. I just want you to
keep it in mind next. Let us do something. I'm not sure what it is back. Mm.

