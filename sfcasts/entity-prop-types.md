# Adding Property Types to Entities

Coming soon...

A new feature snuck into doctrine a while back. And it's super cool. And I want to
take advantage of it. Doctrine can now guess some configuration about a property Via
it's type in. This is pretty cool. Let's start with the relationship properties, But
first I want to make sure that my database is in sync with my entities. So I'm going
to run Symfony console Doctrine, scheme, uh, Update dump SQL, Just to prove that yes,
my database does right now. Look like my entities, by the way, looking at all these
depre down there, these are things we still need to fix, and we will fix them event
chili. We're going to run this command again later after we make a bunch of changes
because our goal isn't actually to change any of our database configuration. It's
just to simplify it. All right. So here's change number one. This question property
here holds a question object. So I'm going to add question as a type in, but we have
to be careful. It's technically a nullable question. Even if this is required in the
database, after we instantiate the object, it's possible that it will be that object
will instantiated, but it won't have a, but the question property will still be null.
You'll see me do this with all of my type hints on my property types on my entities.
I'm going to be very honest, even if I feel this technically required the database,

If it's not required, if it's possible that it's no and PHP, I'm going to have it be
null. I'm also going to set this to = null that way. If I reference the question
property before it's set, instead of getting an error, it will just return null. Now
that change had nothing to do with doctrine. That's just adding property types. The
cool thing is now that we don't have to this target entity anymore, because doctor's
going to be able to figure that out for us. So up, we get to make our configuration a
little bit simpler. All right, let's head to the next entity, which is question. And
we're going to do the same thing I'm looking specifically for our Relationship feels.
Now this one here is a to many, which hold a collection of answers. Um, we are going
to add a type in here in a second, but it's going to be a collection object, a
collection instance. So when we do that, that's not going to allow us to get rid of
the target entity, cuz all we're going to be type ending down here is just
collection. So I'm going to skip this one for now and we'll come back. We're just
going to focus on the, the many to one

Relationships. So down here for owner, Uh, let's be a noble user object and then
owner = null. Then we can get rid of that target entity. And then over in question
tag, same thing, noble question = null, Sell back, get it celebrate by getting rid of
the target entity and same thing down here, nullable tag = Nu and then get rid of the
target entity.

So

Yeah, kind of a nice change. It's just easier to write our relationships. So make
sure I didn't mess anything up. I'll rerun that scheme update command and we're still
clean. All right, now let's go further and add property types to every property. So
this is going to be a little bit more work, but it's really nice. So same thing ID
year, that is going to be a noble in And I'm going to initialize this to know, but
because of that, I don't have the tab. I don't have to have the type integer anymore
Down here for content, same thing. This is going to be a noble string and I'll say =
no,

But in this case I do need to keep type text type text means it holds a lot of text.
If you type hint something with, if you use the string property type doctrine is by
default going to, um, guess that as the type string. So this case I want type text.
So I am going to leave it by the way. Some of you might be wondering why I don't have
like, you know, string content = empty quotes. And then just remove the question
mark. The reason is that this field is required in the database. If I did this and
then I forgot, I had a bug in my code where I forgot to set the content property, it
would successfully save into the database with empty quotes for this content field.
So by initializing it to Noel, if I forget to save it, that's actually going to
explode when enters a database and then I can become aware of my bug and fix it
instead of it just having the silent bug. All right. So let's keep going here. A lot
of this is going to be Busy work. I can get rid of type string. Um, and actually I
can get rid of the length. Also.

The default has always been 2 55 in the votes already looks good, but I can get rid
of the type integer. And then down here on the status, this already has the string
type. So I'll just move type string. But I do need to keep the length if I want it to
be shorter. All right, let's keep going in the question. Entities. This is going to
be a lot of the same stuff here. So no will end on ID = no Remove the type Update
name And make that much simpler. Repeat the same thing for slug. Now notice this
still has uses an annotation from GMO slug. We're going to fix that in a minute, but
I want to finish all this cool property types. First

<affirmative>

Update question Then update, ask at this is a type date time. So that's going to hold
a nullable date time instance. And I will also initialize that to, And then next down
here is the one to many relationship. This is actually, if you look down here, it's
actually initialized in the construction to an array collection.

So you might think we would put an array collection here, but we're actually going to
a collection here. That's an interface from doctrine that array collection
implements. And we need to use collection here because when we query for, for, from
the, uh, question from the database, and then we fetch the answers property, it's
actually a different object called a persistent collection. So this property could
actually be a collection and array collection or persistent collection. But in all
cases, it's going to implement this collection interface and this doesn't need to be
nullable because it's initialized inside the construction. And then I'll do the same
thing right below For question tAJAX. All right, I'm making good progress. I'm going
to go to question tag. I'll go through some of the repetitive changes quickly.
Perfect. Down here from tagged at this is a date time imutable so I'm going to put
date time. Imutable here. Notice that I Did not make this nullable and I'm not
initializing that to no, that's very simply because we are setting this in the
construction. So I'm guaranteed to have a date time imutable instance. It does not
need will never be Nolan. It doesn't need to be initialized to Nole.

All right, over in tag, we'll make the easy changes quickly. And actually I forgot to
remove that Type. Integer wouldn't hurt anything, but in question tag, but we don't
need that anymore. Perfect. And also my type date coming. Imutable Lots to keep track
of on this. All right. Back in tag, let's keep going. We'll set the name, property
and simplify its config. And then one more class user Simplify. We'll set the
property type on end Update the email property Down here for hashed password. We can
remove type string. I'm also going to remove the peach doc on this cause we can
already guess that it's a String or null from the property type. All do the same
thing down here for my plain password Actually should be a string or null. And then I
have a number of kind of other normal feeds fields out update first name At
collection for questions. And We can remove the type of boo in for is verified PH.
Okay. That is so much better, little bit tricky. It'd be much easier doing that, uh,
going forward to make sure we didn't mess anything up. And this is what's so great
about that command. We run doctrine came update again and it is clean. So if we had
messed something up or accidentally changed our config, this would show us some
queries we needed to run to update our database. And that would signal that something
was wrong with that property. And we needed to take a closer look.

All right, there was one last annotation that we needed to fix. And this one we're
just going to fix by hand it's in the question, entity above the slug field and it
comes from the doctrine extensions library. So it's really simple. As long as you
have doctrine extensions, 3.6 or higher, you can use this as a attribute solu, and
then we'll say fields, you can audit complete that for me. And then we need to set
this two array. The cool thing about PHP attributes is it's just PHP code. So array
is a PHP array inside. We need name of quotes. So I use single quotes, just like PHP
and we are good. Whew. All right team, we just took our code base a huge step
forward. So next let's actually focus in on these remaining depre and squashing these
so we're ready for Symfony six. We're going to start with the elephant in the room,
Which is upgrading our security system, Converting to the new security system. But
don't worry. It's going to be much easier than you're probably imagining.
