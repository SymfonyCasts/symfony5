# Bad Migrations

Coming soon...

Okay, Dean, I've got one more mission for us in this tutorial to add, create that and
updated that fields to our question entity and make sure these are set automatically
when we create or update or entity. This functionality is called time. Stackable and
doctrine. Extensions totally has a feature for it. Activate it in the config file.
Stop document, extension dynamo, add time stamp bubble.

Sure.

If you click into the doctrine extensions docs and then find time bubble and scroll
down to the example, you'll see that this works a lot. Like slugable erratic created
that and updated that fields. Then add an annotation to tell the library to set them
automatically simple, but Oh, this library makes it even easier. It includes a trait
that holds the fields and annotations. Check it out at the top of the question.
That's the ad used time. Stackable entity. That's it. Well almost hold command or
control and click to open that trait. How beautiful is this? It holds the two
properties with the ORM annotations and the time stable annotations. It also has
getter and setter methods for each.

Okay.

It has everything we need.

Okay.

But since this does mean that we just added two new fields to our entity, we need to
make a migration at your terminal run Symfony console.

Okay.

Symfony console make colon migration.

Okay. Let's check that out to make

Sure it doesn't contain any surprises. Yup. It looks perfect. It adds the two columns
back of the terminal. Run it with Symfony console doctrine, colon migrations, colon
migrate, and eye explosion. Invalid date, time format zero zero, zero, zero four
column created at, at row one. Uh, the problem is that our database already has
questions in it. And so when we add a new date time field, that does not allow no, my
SQL kind of freaks out. So how can we fix this? There are two options, depending on
your situation. First, if you haven't deployed your application to production yet,
then you can just drop your database and start over. Basically, whenever you
eventually deploy, you won't have any questions in the database yet. And so this
simply won't be a problem. I'll show you the commands to drop a database in a minute.
But if you have deployed to production already and your production database does have
questions in it, then when we deploy, we will have this problem. So what's the fix.
We need to be smart. Let's see what we need to do is first create the columns, but
make them optional in the database. Then we'll set the, created that and update it,
update to that of all the records to be right now. And finally, we can make another
up another alter table statement to make the two columns required that will make this
migration safe. So usually a migration is perfect, but sometimes you need to update
them by hand change the nitinol to default Knoll on both columns.

Next call this arrow, add SQL again, to set both columns update question set created
at equals. Now comma updated at hat at equals. Now let's start here. We'll worry
about changing the columns to be required after this in a second in another
migration. So should we just run our migrations again? Not so fast, that would be
safe in this case, but you have to be careful if a migration has multiple SQL
statements and it fails. It's possible that part, the migration was executed
successfully. In part wasn't. This can leave us in a sort of weird invalid migration
state.

It would look like immigration wasn't executed when in fact, maybe half of it was so
to be extra safe, let's reset the database, completely do that with Symfony console
doctrine, colon database, colon drop dash dash force to completely drop a database,
then doctrine database create to recreate it. Now I'll temporarily comment out the
new trait in question that will let us reload the fixtures so that we have data when
we run the new migration. So Symfony console doctrine, colon fixtures, colon load,
Oh, after I unkind comment out timestamp of what entity I'm going to do a little hack
here where I actually go to refactor rename, and I'm actually going to take the dot
PHP off the end of this file temporarily. That's a little hack because we don't want
to do is I want to run only these first three migrations to get my system back to
where it was before. So now I'll run Symfony console doctrine and colon migrations,
colon migrate.

Perfect. So we're back to the situation before we had created that and updated that
properties and now to make things more realistic, I'll run Symfony console doctrine,
calling fixtures, calling load. Beautiful. All right, let's go back and undo those
things. So I'll go back to refactor rename. I have the bat PHP on the end, so that
doctrine migrations sees that and let's uncomment out our use timestamp of state. So
we're back right where we were a second ago. And we're going to try to run the new
migration, do that with a Symfony console doctrine, colon migrations, colon migrate,
and this time, yes, it works perfectly.

We can even run Symfony console doctrine at colon query, colon SQL select star from
question to see those beautiful new created that and updated that columns set.
Finally, the last thing we needed to do is make another migration to make these two
columns created in the database. And we can just ask doctrine to generate that
migration for us. Symfony console, make colon migration. Let's go check that one out,
open it up and beautiful doctrine noticed that the columns weren't required in the
database and generated the alter table statement. Fix that. Run the migrations one
last time. Symfony doctrine, colon migration, console doctrine, migrations migrate
and got it. This, these are two safe migrations. Okay. Friends, that's it. You've
just unlocked some huge potential in your application with doctrine. We know how to
create entities, update entities, generate migrations, persist, data, create dummy
fixtures and much more. The one big thing that we have not talked about yet is
doctrine relations. That's a big enough topic that we'll save it for the next
tutorial until then start building. If you have any questions, thoughts, or want to
show us what you're building. That's awesome. We are here for you down in the
comments. All right, friends. See you next time.

