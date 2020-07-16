# Entity

Coming soon...

Doctrine is an ORM object, relational mapper, which is a really fancy way of saying
that for each table that you'll have in the database, you will have a corresponding
class in PHP. And for each column on that table, you'll have a property in that
class, the fairly simple concept. So if you want to create a database table, the
first way you actually do that in doctrine is by creating that class. And these
classes that nap to a table in the database are given a special name and entity
class. You can totally create these entity classes by hand, but like many times we're
going to cheat. We're going to cheat by generating it. So I'm going to run bin
console, make entity. One of my absolute favorite commands.

It's going to ask us the class name of the entity we want to create. Now remember the
whole point of our site is for people to be able to ask questions and then post
answers below. So the very first thing we're going to need at our site is probably a
question entity. So we have a question table and the database, it's a macro here. I'm
going to answer the question and it immediately starts asking what properties we
want, which really sort of means what columns we want the table. So let's add a few
of them. I'm going to add one, call the name. This would actually be the kind of
short name here, like reversing a spell, sweat, a name property. It's going to ask us
what type we want. Now doctrine has its own type system. So I'm going to hit question
Mark here.

And it's going to show you all the different doctrine types you have. These are
different than for example, my SQL types, but they map to them. So for example, a
string masturbate VAR char field and the database, and there are a number of other
types inside of here. So string I'm use string. That's what you want for anything
that's less than 250 characters. So I'll say string. And then for length, 255 is
fine. Then finally it says, can this field be nullable in the database? I'm going to
say no, which means it is. If it's not normal, it is required in the database. I'm
going to need a name. Alright. And that's it. We just added a property. So let's add
a couple more. Let's add another one called slug. This will be the fancy URL, fancy
part of the URL offensive part fancy string that we see in the URL.

This will also be a string. Let's say 100. Maybe we want to make sure that you stay
somewhat short. And once again, I'll say no to novel. And then for the actual body of
the question, let's call that question. Now, in this case, the body of the question,
it's going to be kind of a long part here. This could actually be quite long, so we
don't want to use just a normal string type. We want something to be longer. So for
that, we can use a type called text and we also want this to be required in the
database. All right, last field here, I'm going to add one called asked at this is
going to be a date field. That's kind of like a published date. So as soon as they
hit it, you can see it actually recommends. It sees the Atlas ending at a recommends
a date time type, which is exactly what we want.

So I'll hit enter to accept a date time type. And this time I'm going to say yes to
nullable. The idea is that you can maybe start your question and save it to the
database, but we don't actually set the asked to add property until you finally
publish it onto the site. So it is okay for that to be known and we're done. So I'm
just going to hit enter here and we are finished. Now. I just want to be clear. This
made absolutely no changes to our database at all. The only thing this did and I'll
actually scroll up to the top of the command is he created two files, source entity
question and source repository, question repository by PHP for now. I want you to
completely ignore this repository class. It is not important yet. We will talk about
it later. This entity class, however, is very important. So let's bend over and open
that source entity question dot the PHP.

Now, as I mentioned with doctrine ORM, we're going to have one class per database
table. And the first thing I want you to notice about this insti class is that
there's nothing special about it. It's just a very boring normal class. It's called
question. It doesn't even extend the base class. And then it just has a number of
private properties on it to access those properties. We have a bunch of getters and
setters, like get name, get slugs, set, slug, and so on. So it's just about the most
boring class that you'll ever see. Now, of course, if doctrine is going to use this
class to store something in the database, it kind of needs to know which destroys me
a table kind of needs to know some configuration about that. For example, it needs to
know that the name field, the name property is a string type.

So the way that doctrine does configuration is via annotations. So this, our, an anti
thing up here, this is actually the key that tells doctrine, Hey, this is not just a
normal, boring PGB class. This is an insti class. So you should store. And this is an
entity class. This is something that we want to be stored into a question table. And
then the ad RM column, you see above all the properties, same thing. This is how it's
out, knows that this isn't just a random property where she want this property to
store in a column in that table. Now, there are lots of ways to configure the
annotations above the class and above the properties. And I'm not going to go into
them. I haven't to point you to a little reference. If you search for a doctrine,
annotations, a reference, you'll find a really nice spot on their site where you can
actually see a list of all of the different, uh, uh, annotations you have in there
for.

So for example, at column, it's going to tell you all the different options that you
have on the column, like a name option. Uh, so for example, if you wanted to control
the name of the slug field and here, um, you can do that via name option. You don't
have to do that because if you don't have a name option, it's just going to guess a
nice one for you. One of the other annotations that you'll see on here is, um, at
table. Now notice one, this is what you can do to control the name of the table. If
you want to know, notice in the doctrine and annotations, you see things like at
table and that column inside Symfony, it's always going to be at or M /column, or for
example, up here, if we wanted to control the table name, we can say at table, at RM
/table and then name = and, uh, you know, some table name.

But again, I'm not going to do that here because it's going to guess a table name for
us. And we're just going to L we don't need to be difficult and threw something. Oh,
and you notice the auto completion that we got on that that's things to the Peachtree
storm annotations plugin. Okay. So thanks to our new make entity command. We were
able to interactively answer some questions, any created this class for us, but it
did not talk to the database. There is no question table in the database. It just
created this file right here. Next let's generate a migration to automatically create
this table in the database. It turns out the migration system and doctrine is
amazing. And it's even going to allow us to do table updates with basically no
effort. Let's do that next. Okay.

