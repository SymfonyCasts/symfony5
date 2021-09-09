# The Answer Entity

Coming soon...

New friends. Welcome back to part two of our doctrine in Symfony series. I can see
that you didn't get enough. So last time we mastered the basics, creating an entity,
migrations fixtures, saving entities, all that good stuff. This time, we're going to
do some mega study on doctrine relations. So let's get our project set up to maximize
your foreign key fund. Download the course code from this page to code along with me
after unzipping the file, you will find a start directory with all the fancy files
that you see here. Check out this.md file for all the fun details on how to get this
project running. The last step will be to find the terminal, move into the project
and run the Symfony serv-D. I'm using the Symfony binary to start a local web server.
Let's go see our site spin over your browser.

I'll find it at one through seven.

That is zero.zero.one,:8,000. Oh, Hey, they're called turnover flow. This is a site
where the budding industry of which is in wizards can come to ask questions. After
they prematurely shipped, shipping their spells to production and turning their
clients into small adorable frogs. These questions here are coming from the database.
We built a question entity in the first tutorial, but if you click into a question,
these answers down here. Yeah, these are totally hard-coded time to change that. So
forget about the relationship part entirely between questions and answers for a
second. It's really simple. Our site has answers. And so if we want to be able to
store answers in the database, we need an answer entity. So you're in terminal, let's
generate it. Runner Symfony console, make instigate. Now as a reminder, Symfony
console is just a fancy way

Of saying bin console. If you're using,

Uh, the Docky Docker and Symfony web server set up, set up, like I am, it's something
we talked about in our first Symfony tutorial, 75 degrees, then using a Symfony
console instead, make sure that your conflict man can communicate with your Docker
services for us. That means they can talk to our database, which isn't technically
needed for this command, but will be needed for other commands.

Anyways, classmate

For Anthony, how about answer? And then we'll start adding a couple of basic
properties to it. So I'll probably want a property called content to actually store
the content of the answer itself. This is going to be a text to type strings are 2
55. Our last texts can hold a lot of content.

So text,

This can not be known the database, so it will be required. And it added that
property. Let's also have a username property, which is going to be a string
eventually in our security tutorial, we'll make this a relationship over to
somebody's user and see, but for now, I'm just going to do a string username, 25, not
all.

And then one more, I'm going

To add a vote property, uh, cause you can upvote or downvote questions. So this will
be an integer and we'll also make that not knowing a database and then done. So, and
at one more time, boom, we should have a new answer entity before we generate the
migration. Like it recommends let's go open up that class. There it is. Or entity
answered at BHP. And so far there's nothing special here yet. It looks just like our
other entity, by the way, if you're using a PHP eight

And then the command may

Have generated Peachtree attributes instead of annotations, I'm still using
annotations here just in case some people are using PHP seven, the annotations or
attributes makes no difference whatsoever. All right. Well, okay. Do you want to add,
here is I'm going to say use timestamp of today. We talked about that in the last
story, will it'll add a nice created that and updated that properties to this entity,
which will automatically be updated. Oh, and one of the things I want to do since our
votes is not, no, let's say votes = zero. So initialize votes two zero. Now let's
generate the migration. So I'll run Symfony make migration because my database is.
And as a reminder, this will actually look at your entities and do a diff between
your entities. So for us, the question, the answer entity and the database, and
generate the SQL needed to bring your database up to date. So I run that. Perfect.
Generate a new file. Let's go check that out. It's in the migrations folder

And perfect

Create table answer. And then it adds all of our columns are there. Okay. We'll run
it by saying Symfony console doctrine, migrations

Migrate.

Yes. And useful. Cool. So we have a question table and an answer table. Next let's
relate them.

[inaudible].

