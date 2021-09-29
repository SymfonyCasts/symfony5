# Broken Migration

Coming soon...

Our new migration is kind of cool. We created an entirely new entity `QuestionTag`
with the relationship to `Question` and in relationship to `Tag`, but in reality, doing
this didn't change much in the database. This migration basically just adds a new `id`
column to the `question_tag` table, add a new `taggedAt`, come to the `question_tag` table
on. Unfortunately, when we executed the migration, it blew up in our face. The reason
is that right now, the `question_tag` table already has data in it. And so when we told
the `question_tag` a table to add a new `tagged_at` daytime column, that can't be `NULL`, it
didn't know what value to use for those existing rows in the table.

If you haven't actually, uh, deployed your, uh, question tag tables in the database
yet, then this isn't actually a problem because your `question_tag` table wouldn't have
any data in it, the moment that this executes. And so if you want to fix this, you
can basically drop your database, recreate your database, and run all of your
migrations. And you'd be happy. But I want to pretend like our `question_tag` table has
been deployed to the database and it does have, uh, data in it. And I want this
migration to actually work when we run it on production. So for the fix for this is
actually fairly simple. When we add the tag that instead of saying `DATETIME NOT NULL`
know, say `DATETIME DEFAULT NOW()` we're doing this temporarily. So temporarily, we're
going to, uh, have it default, all those values to whatever the current data is.

The question now is how do we test that change? If you go and run the migration
again, 

```terminal
symfony console doctrine:migrations:migrate
```

it's going to fail for a different reason. Alter table question tag, drop form
key fail. So the problem is that a second ago, when it first failed, it ran these
first two lines successfully and then failed on the third line. This means that our
migration is in a very strange state. It's sort of half run. Now, if we're using
Postgres, this isn't a problem. And I'll explain why. In our case, it is a problem
three years, what I want to do just to be totally safe. Here's my plan. I want us to
put the database back to exactly where it was a second ago before we made any of the
changes to our entities or ran this migration. Once we've done that, then we'll run
this migration to make sure that this full migration works.

So check it out. I'm going to have him run terminal and run,

```terminal
git status
```

So I committed before we started making all the changes to our question tag entity. I'm
going to add everything to git. 

```terminal-silent
git add src migrations/
```

You can see it's ready to be committed, 

```terminal
git status
```

but then I want to say,

```terminal
git stash
```

If we're not familiar with that command, that's actually
going to remove all of these changes entirely from my project temporarily to watch me
go over here. I see the migration has gone. Our new joint entity is completely gone.
I'm doing this because now we can put the database back to where it was a second ago.
So I'll say 

```terminal
symfony console doctrine:database:drop --force
```

completely dropped the database. We'll create completely recreated anyways, 

```terminal-silent
symfony console doctrine:database:create
```

and then run it.

```terminal
symfony console doctrine:migrations:migrate
```

that executes all the migrations up to this point, which
is back when we had a many to many relationship finally, to mimic production let's
run

```terminal
symfony console doctrine:fixtures:load
```

So that our `question_tag` take join table
has data in it. Perfect. Now it's what back all of our agendas by again, saying 

```terminal
git stash pop
```

awesome. Everything is back.

So now let's try this entire migration again with our change to default now. So

```terminal
symfony console doctrine:migrations:migrate
```

and it works. So it added that new
column without actually failing. The only kind of small problem is is that the small
problem is that thanks to this change right now in the database, the `tagged_at` column
is no is not required. So we're going to run right, run one more migration to fix
this throw on 

```terminal
symfony console make:migration
```

This is really cool. It's going to
look at our new `QuestionTag` entity realized that the `taggedAt` column does isn't
quite set up correctly and it generates a new migration that's altered table.
Question tag, change, tag that to daytime. Not no, and this is fine. This is safe.

```terminal-silent
symfony console doctrine:migrations:migrate
```

You're on this time because we have already given all the existing rows a real date.
So it works. Okay.

So re factoring our relationship between `Question` and `Tag` to a new `QuestionTag`
entity was fairly straightforward though. The migration was a little bit tricky, but
thanks to this change, how we save and use this relationship has just changed. So
next let's update our fixtures to get those working while doing that. We're going to
do some crazy stuff with Foundry.

