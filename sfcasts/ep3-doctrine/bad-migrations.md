# Timestampable & Failed Migrations

Ok team: I've got one more mission for us: to add `createdAt` and `updatedAt`
fields to our `Question` entity *and* make sure that these are automatically set
whenever we create or update that entity. This functionality is called timestampable,
and Doctrine Extensions *totally* has a feature for it.

## Activating Timestampable

Start by activating it in the config file: `stof_doctrine_extensions.yaml`.
Add `timestampable: true`.

[[[ code('deea140959') ]]]

Back at the browser, click into the Doctrine Extensions docs and find the
Timestampable page. Scroll down to the example... Ah, this works a lot like
Sluggable: add `createdAt`  and `updatedAt` fields, then put an annotation above
each to tell the library to set them automatically.

## The TimestampableEntity Trait

Easy! But oh, this library makes it even easier! It has a trait that holds the
fields *and* annotations! Check it out: at the top of `Question`, add
`use TimestampableEntity`.

[[[ code('d472cfd5fb') ]]]

That's it. Hold command or control and click to open that trait. How beautiful
is this? It holds the two properties with the `ORM` annotations *and* the
`Timestampable` annotations. It even has getter and setter methods. It's
everything we need.

But since this *does* mean that we just added two new fields to our entity, we
need a migration! At your terminal run:

```terminal
symfony console make:migration
```

Then go check it out to make sure it doesn't contain any surprises. Yup! It looks
good: it adds the two columns.

[[[ code('5d3d714348') ]]]

Back at the terminal, run it with:

```terminal
symfony console doctrine:migrations:migrate
```

And... yikes!

> Invalid datetime format 0000 for column `created_at` at row one.

## When Migrations Fail

The problem is that our database already has rows in the `question` table! And
so, when we add a new `datetime` field that does *not* allow null, MySQL...
kinda freaks out! How can we fix this?

There are two options depending on your situation. First, if you have *not* deployed
your app to production yet, then you can reset your local database and start over.
Why? Because when you eventually deploy, you will *not* have any questions in the
database yet and so you will *not* have this error when the migration runs. I'll
show you the commands to drop a database in a minute.

But if you *have* already deployed to production and your production database
*does* have questions in it, then when you deploy, this *will* be a problem. To
fix it, we need to be smart.

Let's see... what we need to do is first create the columns but make them
*optional* in the database. Then, with a second query, we can set the
`created_at` and `updated_at` of all the existing records to right now. And *finally*,
once that's done, we can execute another alter table query to make the two
columns required. *That* will make this migration safe.

## Modifying a Migration

Ok! Let's get to work. *Usually* we don't need to modify a migration by hand,
but this is *one* rare case when we *do*. Start by changing both columns to
`DEFAULT NULL`.

[[[ code('43a0fd6c61') ]]]

Next call `$this->addSql()` with:

> UPDATE question SET created_at = NOW(), updated_at = NOW()

[[[ code('db60c92d01') ]]]

Let's start here: we'll worry about making the columns required in
another migration.

The *big* question now is... should we just run our migrations again? Not so fast.
That *might* be safe - and would in this case - but you need to be careful. If
a migration has multiple SQL statements and it fails, it's possible that *part*
of the migration was executed successfully and part was *not*. This can leave us
in a, sort of, invalid migration state.

```terminal-status
symfony console doctrine:migrations:list
```

It would *look* like a migration was *not* executed, when in fact, maybe *half*
of it actually *was*! Oh, and by the way, if you use something like PostgreSQL,
which supports transactional DDL statements, then this is *not* a problem. In
that case, if any part of the migration fails, all the changes are rolled back.

## Safely Re-Testing the Migration

Anyways, let's play it extra safe by resetting our database back to its original
state and *then* testing the new migration. Start by dropping the database
completely by running:

```terminal
symfony console doctrine:database:drop --force
```

Then `doctrine:database:create` to re-create it:

```terminal-silent
symfony console doctrine:database:create
```

Next, I'll temporarily comment out the new trait in `Question`. That will allow us
to reload the fixtures using the *old* database structure - the one *before*
the migration. I also need to do a little hack and take the `.php` off of the new
migration file so that Doctrine won't see it. I'm doing this so that I can easily
run all the migrations *except* for this one.

Let's do it:

```terminal
symfony console doctrine:migrations:migrate
```

Excellent: we're back to the database structure *before* the new columns. Now
load some data:

```terminal
symfony console doctrine:fixtures:load
```

Beautiful. Back in our editor, undo those changes: put the `.php` back
on the end of the migration filename. And, in `Question`, re-add the
`TimestampableEntity` trait.

*Now* we can properly test the new version of the migration. Do it with:

```terminal
symfony console doctrine:migrations:migrate
```

And this time... yes! It works perfectly. We can even run:

```terminal
symfony console doctrine:query:sql 'SELECT * FROM question'
```

to see those beautiful new `created_at` and `updated_at` columns.

## Making the Columns Required

The *final* thing we need to do is create another migration to make the two
columns required in the database. And... we can just make Doctrine do this for
us:

```terminal
symfony console make:migration
```

Go check out the new file. Doctrine: you smartie! Doctrine noticed that the
columns were *not* required in the database and generated the `ALTER TABLE` statement
needed to fix that.

[[[ code('dbdb6a855f') ]]]

Run the migrations one last time:

```terminal-silent
symfony console doctrine:migrations:migrate
```

And... got it! These are two *perfectly* safe migrations.

Okay, friends, we did it!. We just unlocked *huge* potential in our app
thanks to Doctrine. We know how to create entities, update entities, generate
migrations, persist data, create dummy fixtures and more! The only big thing
that we have *not* talked about yet is doctrine relations. That's an important
enough topic that we'll save it for the next tutorial.

Until then start building and, if you have questions, thoughts, or want to
show us what you're building - whether that's a Symfony app or an extravagant
Lego creation, we're here for you down in the comments.

Alright friends, seeya next time.
