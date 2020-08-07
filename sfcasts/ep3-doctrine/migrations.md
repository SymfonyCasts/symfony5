# Migrations

We have a beautiful new `Question` entity class that is *supposed* to map to a
`question` table in the database. But... that table does *not* exist yet.
How can we create it?

Well, because Doctrine has all of this configuration about the entity, like
the fields and field types, it should - in theory - be able to create the table
*for* us. And... it absolutely *can*!

## Hello make:migration

The mechanism we use to make database *structure* changes is called migrations.
At your terminal, run:

```terminal
php bin/console make:migration
```

And... that fails:

> Access denied for user db_user.

Of course: the command doesn't have access to the Docker environment variables.
I *meant* to run:

```terminal
symfony console make:migration
```

This time... cool! It generated a new *file* inside of a `migrations/` directory.
Let's go check it out! In `migrations/` open the one new file and... awesome! It
has an `up()` method with the *exact* SQL we need!

> CREATE TABLE question...

and then all of the columns.

The `make:migration` command is *smart*: it compares the *actual* database - which
has zero tables at the moment - with all of our entity classes - just one right now -
and then generates the SQL needed to make the database *match* those entities.

It saw the one `Question` entity... but no `question` *table*, and so, it generated
the `CREATE TABLE` statement.

## Executing Migrations

But this query has *not* been *executed* yet. To do that, run:

```terminal
php bin/console doctrine:migrations:migrate
```

Ah, but be careful: we can't use `bin/console` directly. Instead run:

```terminal
symfony console doctrine:migrations:migrate
```

And... congratulations! We have a new `question` table in the database!

## How Executed Migrations are Tracked

The way the migration system works is really cool. Run another command:

```terminal
symfony console doctrine:migrations:list
```

This shows all the migrations in your app, which is just one right now. Next
to that migration is says "Status Migrated". How does it know that?

Behind the scenes, the migration system created a table in the database called
`doctrine_migration_versions`. Each time it executes a migration file, it adds
a new row to that table that *records* that it was executed.

That means that later, if you run

```terminal
symfony console doctrine:migrations:migrate
```

again... it's smart enough to *not* execute the same migration twice. It looks
at the table, sees that it already ran this, and skips it.

When you deploy to production, you'll *also* run `doctrine:migrations:migrate`.
When you do that, it will check the `doctrine_migration_versions` table in the
*production* database and execute *any* new migrations.

## Making a Column Unique

Before we keep going, you know what? When we created the `Question` entity, I
forgot to do something. The `slug` column should *really* be unique in the
database because we will eventually use that part of the URL to query for
the *one* `Question` that matches.

One of the options you can pass to `@ORM\Column()` is `unique=true`.

That won't change how our *PHP* code behaves - this doesn't relate to form validation
or anything like that. This *simply* tells Doctrine:

> Hey! I want this column to have a unique constraint in the database

Of course... just making this change did *not* somehow magically add the unique
constraint to the database. To do that, we need to generate another migration.

Cool! At your terminal, once again run:

```terminal
symfony console make:migration
```

to generate a *second* migration file. Let's go check it out. And... woh!
It's a `CREATE UNIQUE INDEX` statement for the `slug` column! The
migrations system compared the `question` table in the database to the `Question`
entity, determined that the only difference was a missing unique index and then
generated the SQL to add it. Honestly, that's amazing.

Let's go run it:

```terminal
symfony console doctrine:migrations:migrate
```

This sees *both* migrations, but only runs the *one* that hasn't been executed
yet. The `slug` column is now unique in the database.

So this is the workflow: create a new entity or change an existing entity, run
`make:migration`, and then execute it with `doctrine:migrations:migrate`. This
keeps your database in sync with your entity classes *and* give you a set of
migrations that you can run when you deploy to production.

Next: it's time to create some `Question` objects in PHP and see how we can
save those to the question table.
