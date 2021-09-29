# When a Migration Falls Apart

Our new migration file is pretty cool! We created an *entirely* new entity -
`QuestionTag` - with a relationship to `Question` and a relationship to `Tag`.
But this massive change in PHP didn't translate into much in the database: the
migration basically adds a new `id` column add a new `taggedAt` column to the
`question_tag` table.

Unfortunately... when we *executed* that migration, it blew up in our face! The reason
is that, right now, the `question_tag` table already has data in it! And so when
we told the `question_tag` table to add a new `tagged_at` `DATETIME` column that
can't be `NULL`... it didn't know what value to *use* for the existing rows in the
table! And so... it exploded!

If you haven't actually deployed your `question_tag` table to production, then
this isn't a real problem... because, when you *do* finally deploy, this table
won't have any data in it the moment that this executes. In that case, all you
need to do is fix your local setup. You can do this dropping your database,
recreating it... and running all of your migrations from the beginning. We'll
see how to do that in a minute.

But... I want to pretend like our `question_tag` table *has* been deployed to the
database and it *does* have data in it. And I want to fix this migration so that
it does *not* explode when we run it on production.

## Fixing the Migration

The fix for the migration is fairly simple. When we add the `tagged_at` column,
instead of saying `DATETIME NOT NULL`, say `DATETIME DEFAULT NOW()`.

This is a *temporary* change: it will allow us to add that new column and give the
existing rows a default value. Then, in a separate migration that we'll create
in a few minutes, we can *then* safely make that column `NOT NULL`.

## How to Test a Half-Executed Migration?

*Anyways*, now that we've fixed the migration, how can we run it again? Well,
try the obvious:

```terminal
symfony console doctrine:migrations:migrate
```

It fails again! But for a different reason: `ALTER TABLE question_tag`, dropping
the foreign key failed.

Here's the problem. When we *first* ran this migration, these first two lines
*did* executed successfully. And then the *third* line failed. This means that our
migration is in a very strange state... it's sort of "half" executed.


Now, if we're using PostgreSQL, this is *not* a problem. Each migration is wrapped
in a transaction. This means that, if *any* of the queries fail, they will *all*
be reverted. Unfortunately, while this works *great* in PostgreSQL, MySQL does
*not* support that coolness. So if you *are* PostgreSQL, you rock and the migration
command we ran a minute ago *did* work for you.

Ok, but back to *our* reality. To test test this migration, we need to do a, sort
of, "manual" rollback: we're going to put our database back into the state it
was *before* we made any changes to our entities or ran this migration.
Once we've done that, *then* we'll run this migration to make sure it works.

At your terminal, run;

```terminal
git status
```

Before we created the `QuestionTag` entity, I committed everything to `git`.
Add the new files:

```terminal-silent
git add src migrations/
```

And run:

```terminal
git status
```

again. Yup: everything is ready to be committed. Now, *remove* these changes
with:

```terminal
git stash
```

If you're not familiar with that command, it removes all of the changes from your
project and "stashes" them somewhere so we can put them back later. If we check
the code... the migration is gone... and so is the new entity. Now that our
code is back to its "old" state, we can reset the database.

Start by dropping it entirely:

```terminal
symfony console doctrine:database:drop --force
```

And then re-recreate it:

```terminal-silent
symfony console doctrine:database:create
```

And *then* migrate:

```terminal
symfony console doctrine:migrations:migrate
```

This executes all the migrations up to this point, which is back when we had the
`ManyToMany` relationship. Finally, to mimic production where we have data in
the join table, run:

```terminal
symfony console doctrine:fixtures:load
```

Perfect! *Now* bring back all of our changes by saying:

```terminal
git stash pop
```

Awesome! Everything is back! Finally, we can *now* test the new migration again:

```terminal
symfony console doctrine:migrations:migrate
```

## Migrating Again to add NOT NULL

And... it works! It added that new column *without* failing. The only small problem
is that, right now, in the database, the `tagged_at` column is *not* required:
it *allows* null... which is not what we want. But fixing this is easy: ask
Doctrine to generate one more migration:

```terminal
symfony console make:migration
```

This is really cool: it looked at the new `QuestionTag` entity, *realized* that
the `tagged_at` column isn't set up correctly, and generates a new migration
with `ALTER TABLE question_tag CHANGE tagged_at` to `NOT NULL`. Run this:

```terminal-silent
symfony console doctrine:migrations:migrate
```

And... it works!

So refactoring the relationship between `Question` and `Tag` to include a new
`QuestionTag` entity didn't *really* change the structure of the database... though
this migration *did* cause a headache. However, in PHP, how we save and *use*
this relationship *did* change substantially. So next, let's update our fixtures
to work with the new structure. To do this... we're going to do some *crazy*
stuff with Foundry to turn you into a fixtures expert.
