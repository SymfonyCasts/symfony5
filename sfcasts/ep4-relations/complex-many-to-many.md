# Complex Many To Many

Coming soon...

Okay. So a many to many relationship is unique in doctrine because doctrine and
creates and handles the question tag, join table for us.

But what we wanted to add more columns to this table, like a tagged at date time
column. Excellent question. And the answer is that's not possible. I'm serious, but
it's by design. As soon as you need even one extra column on this table on this joint
table, you need to stop using a many to many relationship. Instead, you need to
create an actual question tag entity manually and relate it to the question and tag
entities. Well, let's try this. I'll admit it's actually easier to do this from the
beginning than to try to refactor a many to many relationship into that. So before
you create a many-to-many relationship, try to think if you might need extra comms in
the future. And if you do start with the solution that we're going to use anyways,
I'm actually going to back up and in the question entity, I'm going to remove
everything related to tags. So the property, the line, the constructor and the
getter, et cetera, fits inside of the tag and see I'm going to do the same thing for
questions. So I'm going to remove E get her and set her methods and a top or move the
property and we can delete the entire constructor. So we've we saw the question
entity. We saw a tag, unstable. They are no longer related at all.

Okay. Now we're going to sort of put that relationship back, but would they enjoy
where they new entity in between them?

So spend over your terminal Aaron's Symfony console, make entity, let's call this an
entity question tag, and it's going to have at least two properties. We need a
question property. This is going to be a many to one relationship over to question,
but I'll ask you to have relations so we can go to the wizard. This would relate to
the question entity, and we want a many to one relationship. Each question tag
relates to one question. Each question, have many question tag objects. So I'll say
maybe two, one is the property allowed to be nullable? No. And then do we want to add
a new property question? So we can say questionnaire or get questioned tags that
might actually be handy. So I'll say yes. And we'll call that property question tags
and I'll say no to orphan removal. Cool. The other property we're definitely going to
need is a tag property.

And this will definitely be a many to one. That's just how this works and able to
relate it to the tag and state. Um, I'll say no for nullable in this case, I'm
actually going to say no to the, uh, mapping the other side, I'm doing this in part
just so you can see what differences makes. But I think also having a tag object and
saying, get question tags is maybe not going to be convenient. So I'm going to say
no. And perfect. That's the minimum amount that we need on that new question. Tag
entity. We need a many to one relationship to question and a many to one relationship
to tech. Now we can start adding whatever other fields we want. So I'll add a tag at,
and I'll make this be a date time immutable property that can't be known in the
database and perfect. I'll hit enter a one more time to stop there. All right, let's
go check out this new class. So source entity question tack. It looks for us
beautifully boring. There's a question property that's many to one, a question, a
tech company that's many to one to tag and a tag at any tag that property.

And of course inside the question entity by scroll all the way up, because we mapped
the other side. It has a one to many to question tax back in question tag before
where you do the migration, let's give our tag at a default value. So I'll, I'll
create a construct method. And we can just say this->tag that = new /date time
immutable, which will default to right now. Perfect. Okay. So we just made some
change our database. So let's run the Mo let's execute migration, Symfony console,
make migration, and then go check that new migration out. Cause this is really cool.
If you look down here, it looks like there's a lot of queries, but look closely.

All it's doing is altering the question, tag tables. So we already had a question tag
table, so we don't need to drop it and create a new one. All we need to do is tweak
it and you can see it drops to foreign key constraints. It's actually a dropping the
question ID and a tag ID foreign key constraint off the old table, but then it
actually just adds them back down here. So these first two lines basically drop
foreign key. And these last two lines basically re it. So they're kind of doing
nothing. The only real thing that's happening inside of here is altered table.
Question tag is it adds a true ID auto increment column, and it adds are tagged at so
yeah, they had the exact effect that we wanted by creating this new question, tag
entity and giving it a many to one relationship to the two other entities. We
basically recreated the exact same database structure, a many-to-many relationship.
It's really just a shortcut to doing this setup.

All right. So let's try running that migration in the console doctrine, migrations
migrate. We riots, oh, it fails incorrect date, time values 0 0, 0, 0 4 column tagged
at, at row one. So it air and out on the alter table. Question tag, when adding the
tag that column, the reason this happened is that our question tag table already has
data in it. And so when it tries to add this new tag, that column, which does not
allow no of that database, it can't figure out what value it should use for that tag
that, so it kind of explodes if the tagged at table had been empty, this wouldn't
happen.

So if you have, if you haven't actually deployed the tag that table to production
yet, then you don't really need to worry about this. And you could just drop your
entire database and rerun all your migrations. But let's pretend that we have already
deployed are tagged at table to the database and it does already have data in it. So
we want to figure out a way to make this migration actually work when we run it on
production, the fix is actually pretty easy. We're going to modify this migration by
hand. So here it says, tag, add tagged at daytime and not know if you can actually
change it to default. No. So temporarily we are going to say that the tag that
property should allow a no values

[inaudible]

Oh, actually better than that. No, I think about it instead of default and all say,
okay,

The fault now can actually use that. So it actually, uh, add this column and set them
all to the current date. So it's pretty easy. The really complicated thing is
actually testing this migration change. If you run the migrations again, it's when it
fail for a different reason, alter table question tag, drop foreign key. It says,
Hey, that it's, it's basically saying, Hey, that foreign key doesn't exist. So the
problem is that when we ran the migration a second ago, it actually ran these first
two lines successfully and then failed on this third line. So our migration is sort
of half, uh, executed right now. It's kind of like in a weird state, by the way, for
using post-grads. You can actually, uh, roll back the changes. I need to talk and
research about that before I say it.

So kind of makes it hard to test this migration. So here's the fix where she's going
to completely drop our database, run every single migration, except every single
migration. Um, before this reload, the fixtures that our database has real data and
then rerun this migration. So an easy way to do it as is, it's a little weird, but
actually going to drag the soon migration temporarily to my root directory, because
it's there. If I run my migration, now it will only run these migrations and it will
temporarily not see that migration at all. Now my terminal, I'm going to run Symfony
console doctrine, database drop dash dash four. So we're going to completely drop a
database, Create our database And then run since then console doctrine, migrations
migrate. So, as I mentioned, this is going to migrate all the way through all the
migrations in this directory. So it's basically going to restore us to where we were
a second ago before we made all these changes. Now I'm going to run the Symfony
console doctrine fixtures load so that our database structure

[inaudible], [inaudible].

