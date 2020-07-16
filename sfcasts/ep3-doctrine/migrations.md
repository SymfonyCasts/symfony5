# Migrations

Coming soon...

We have this beautiful new question, entity class, but there's not actually a
question table in our database yet. We just made this class. Now, in theory, since
doctrine has all of this configuration about this entity doctrine, should in theory,
be able to create this class for us and knows what the table name is and knows what
all the columns are and knows all the types. And actually we can absolutely do that.
We can just say, Hey, doctrine, create this database, great this table for me. And it
will do it the way we do that is via a migration. Here's how it works. We'll return
to terminal and run bin console, make migration that want to run, that that's going
to fail once again, access denied for user DB_user. Anytime you see that, you need to
be thinking, Oh, it's not using my Docker connection because instead of running Ben
console, I need to run Symfony console, make migration run that same command, but
allow the Symfony binary to add our environment variables from Docker. So now we run
Symfony.

Now we're on Symfony consult, make migration and awesome. This generated one new file
inside of a migrations directory. Let's go check it out. So let's see new migrations
directory right here inside open the new file and awesome. You can see as an op
method here with the exact SQL that we need, create table question and all of the
columns on it. This is awesome. What the make migration command actually does is it
compares the actual database, which has zero tables in it right now with all of our
entities and then generates the SQL necessary to make your database, to bring, to
make your database in sync with your entities. So right now it needs because we have
no tables in the database and we have a single question entity. It grades the great
table, uh, for that question table, do, um, execute this. We can run doctrine
migrations migrate, but be careful. Remember we can't run bin console. We're going to
run Symfony console doctrine, migrations migrate, and congratulations. We have a new
question table in the database.

Now, the way the migration system work is really cool. You can run another command
called dr. Migrations list. What this is going to do is give you a list of all of the
migrations that you have in your system, which for us right now is just one. And you
can see this as status migrated. What this does behind the scenes is the migration
system creates a table in the database called doctrine migrations versions. And every
time you've executed migration, it keeps track of the one that you did that you just
ran. It does that. So that later, if you were in dr. Migrations migrate again, it's
not going to run that same. It's not going to execute this migration again because it
looks in that table and sees that you've already done it. So when you deploy, you're
going to run doctrine, migrations migrate, and the migration system is going to be
smart enough to only run new migrations that haven't already been executed.

So this is the workflow that you're going to get into. You're going to create a new
entity. You know what, though? I actually did something wrong. When I created my
question entity, the slug column here, I really need that to be unique in the
database. We can have to slug two identical slugs, because this will be used because
this will be used on the URL or one of the options you can pass the ad or on column
is unique = true. Now, what that does is that doesn't change how our PHP code is
going to behave. That just tells doctrine, Hey, this should have a unique constraint
in the database, but actually make that actually make that happen. We need to
generate another migration and migration that adds that unique constraint. So great.

We can have over here again and run once again, run Symfony console, make colon
migration, this grates, a new second migration file. And if let's go check this out
on the migrations directory. Oh, beautiful. Look it create unique index on question
slug. So it looked in the database compared the question table in the database to the
question, entity determined that the only difference was it was missing the unique
index and generated the SQL to add that unique index. That is awesome. Let's go over
now and execute that with Symfony console doctrine, pulling migrations, colon
migrate, and we now have that unique, uh, column and the database. So that's the
workflow you're going to get into. You're going to make, you're going to generate a
new entity or maybe make a change to an NZ generated migration with make migration,
then execute it. It keeps your database in sync with your entities and you have these
great new migrations that you can execute when you push to production. Next we are
ready. Let's actually start creating some question objects and PHP and see how we can
save those into our question table.

