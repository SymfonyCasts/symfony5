# The Answer Entity

Oh hey there friends! Welcome back to part 2 of our Doctrine in Symfony series...
you wonderful database nerds you.

Last time we mastered the basics, but good stuff! Creating an entity, migrations,
fixtures, saving, querying and making the perfect omelette... I think. *This* time,
we're going to do some *mega* study on Doctrine *relations*.

## Project Setup

So let's get our project rocking. To avoid foreign key constraints in your brain
while watching the tutorial, I recommend downloading the course code from this page
and coding along with me. After unzipping the file, you'll find a `start/` directory
with all the fancy files that you see here. Check out the `README.md` file for all
the fun details on how to get this project running.

The last step will be to find a terminal, move into the project and run:

```terminal
symfony serve -d
```

I'm using the Symfony binary to start a local web server. Let's go see our site.
Spin over to your browser and head to https://127.0.0.1:8000.

Oh, hey there Cauldron Overflow! This is a site where the budding industry of witches
and wizards can come to ask questions... after - sometimes - prematurely shipping
their spells to production... and turning their clients into small adorable frogs.
It could be worse.

The questions on the homepage *are* coming from the database... we rock! We built
a `Question` entity in the first tutorial. But if you click *into* a question...
yea. These answers? These are *totally* hard-coded. Time to change that.

## Making the Answer Entity

I want you to, for now, forget about any potential relationship between
questions and answers. It's really simple: our site has answers! And so, if we want
to *store* those answers in the database, we need an `Answer` entity.

At your terminal, let's generate one. Run:

```terminal
symfony console make:entity
```

Now, as a reminder, `symfony console` is just a fancy way of saying `php bin/console`.
*I'm* using the Docker & Symfony web server integration. That's where the Symfony web
server reads your `docker-compose.yaml` file and exposes environment variables to
the services inside of it. We talked about that in the first Symfony 5 tutorial.
By using `symfony console` - instead of running `bin/console` directly - my commands
will be able to talk to my Docker services... which for me is just a database.
That's not needed for *this* command, but it will be for others.

Anyways, run this and create a new entity called `Answer`. Let's give this a few
basic properties like `content` which will store the answer itself. Set this to a
`text` type: the `string` type maxes out at 255 characters. Say "no" to nullable:
that will make this column required in the database.

Let's also add a `username` property, which will be a string. Eventually, in the
security tutorial, we'll change this to be a relationship to a `User` entity.
Use the 255 length and make it not nullable.

Oh, and one more: a `votes` property that's an `integer` so that people can up vote
and down vote this answer. Make this not nullable and... done! Hit enter one more
time to finish.

## Timestampable and Default votes Value

Before we generate the migration, go open up that class: `src/Entity/Answer.php`.
So far... there's nothing special here! It looks pretty much like our other entity.
Oh, but if you're using PHP 8, then the command *may* have generated PHP 8
attributes instead of annotations. That's great! They work exactly the same and
you should use attributes if you can.

At the top of the class, add `use TimestampableEntity`. We talked about that in the
last tutorial: it adds nice `createdAt` and `updatedAt` properties that will be set
automatically.

Oh, and one other thing: default the votes to zero. I made this column *not* nullable
in the database. Thanks to this `= 0`, if we do *not* set the votes on a new
answer, instead of getting a database error about `null` not being allowed,
the `Answer` will save with `votes = 0`.

## Making the Migration

*Now* let's generate the migration. Find your terminal and run:

```terminal
symfony console make:migration
```

As a reminder, this command is smart: it looks at all of your entities *and* your
*actual* database structure, and generates the SQL needed to make them match.
Go check out that new file... it's in the `migrations/` directory. And... perfect!
`CREATE TABLE answer`... and then it adds all of the columns.

Run the migration with:

```terminal
symfony console doctrine:migrations:migrate
```

All good! Our database now has a `question` table *and* an `answer` table.
Next, let's relate them.
