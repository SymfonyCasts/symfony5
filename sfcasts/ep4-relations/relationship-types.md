# Relationship Types

Coming soon...

Oh, officially speaking, there are four types of relations, possible relations and
doctrine, many to one, one to many one-to-one and many to many, but in reality, there
are only two types of relationships. Let me explain. We already know that a many to
one relationship and a one to many relationship are really just the same
relationship, just seen from two different sides. So if many to one in once many of
the same, then our four relationships is really down to just three relationships, but
the one-to-one relationship is also kind of not a real relationship. For example, you
might use a one-to-one relationship from a user class to a profile entity, which
maybe holds more user about that. More information about that user and the database.
Your user table would have a profile_ID form foreign key count, which if you think
about it looks exactly like a many to one relation and it is in reality, a one-to-one
relationship is exactly the same as a many to one, except that doctrine puts a unique
key on that profile ID column to prevent that same profile from being, being linked
to multiple users. But really they're the same thing. And by the way, I don't really
like one-to-one relationships.

I tend to just put everything in one table because it reduces complexity, but it can
make sense. Sometimes if I have a bunch of extra data that you rarely use and are
worried about performance anyways, this means that many to one, one to many in
one-to-one are all just these same relationship that that only leaves many to many
relationship, which is a bit different. So let's build one. Let's imagine that every
question can get tagged with some tax in order to store tags, the database let's make
a tag and Steve, so find your console or on Sydney council make entity, I'll call
this new entity tag and are going to make it real simple. I'll give it a name that
would be a string type 2 55 length,

Not knowing the database and that's it I'll hit enter to finish. Before I run that
migration, let's go open up that tag class because you guys know that I love to use
timestamp entity. Now, if you want it to, you can also add a slug column here. I
won't do that because we already showed an example in the last tutorial of how you
can add a slug. That's automatically generated off of some other property. So I'll
just leave that for you. But we now have a functional tag as a declasse. So let's go
generate a migration for this Symfony console, make migration. Okay, beautiful. And
then go check out that migration to make sure nothing funny snuck into it. And it
looks beautifully Moring, great table tag with an ID and a name and created that
updated at columns. Now that I'm happy, let's go run migration with Symfony console
doctrine, migrations migrate. Awesome. So every question think about every question
could have many texts and one tag could be related to multiple questions. In other
words, this is a many to many relationship. Let's generate that with that next and
see what it looks like.

