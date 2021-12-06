# Making Questions owned by Users

Our site has users and these questions are created by those users. So in the
database, each `Question` needs to be related to the `User` that created it
via a Doctrine relationship. Right now, if you open `src/Entity/Question.php`,
that is *not* the case. There's nothing that relates this back to the `User` that
created it. Time to fix that. We'll need this so we can properly talk about voters!

## Generating the Relationship

Find your terminal and run:

```terminal
symfony console make:entity
```

We're going to modify the `Question` entity and add a new property called `owner`,
which will be the "user" that *owns* this `Question`. We need a ManyToOne
relationship. If you're ever not sure, just type "relation" and it will guide
you through a wizard to help. This will be a relation to the `User` class... and
the `owner` property will *not* be nullable: every question *must* be owned by some
user.

Next it asks if we want to map the other side of the relationship so that we can
say `$user->getQuestions()`. That might be handy, so let's say yes. And call
that property `questions`. Finally, I'm going to say no to orphan removal. And...
done!

If you went through our Doctrine relationships tutorial, then you know that there's
nothing special here. This added a `ManyToOne` relationship above a new `$owner`
property... and made getter and setter methods at the bottom:

[[[ code('8b4029a4c4') ]]]

Over in the `User` class, it also mapped the *inverse* side of the relationship:

[[[ code('adf96c33e7') ]]]

Let's go make a migration for this change:

```terminal
symfony console make:migration
```

And... as usual, we'll run over to the new migration file... to make sure it
contains *only* the stuff we expect. Yep: `ALTER TABLE question`, add `owner_id`
and then the foreign key stuff:

[[[ code('d8e644dca1') ]]]

## Fixing the Migration

Let's run that:

```terminal
symfony console doctrine:migrations:migrate
```

And... it failed! That's okay. It fails because there are already rows
in the `question` table. So adding a new `owner_id` `NOT NULL` makes those existing
records... explode. In the Doctrine relations tutorial, we talked about how to
responsibly handle, fix, and test failed migrations. Because we already talked about
it there, I'm going to take the easy route here and just drop our database:

```terminal
symfony console doctrine:database:drop --force
```

Then create a fresh database:

```terminal
symfony console doctrine:database:create
```

And migrate again.

```terminal-silent
symfony console doctrine:migrations:migrate
```

*Now* it works. Reload the fixtures:

```terminal
symfony console doctrine:fixtures:load
```

## Assigning Owners in the Fixtures

And... that exploded too! Come on! The insert into question is failing because
`owner_id` cannot be null. That makes sense: we haven't - yet - gone into our
fixtures and given each question an owner.

Let's do that. Open `src/Factory/QuestionFactory.php`. Our job in `getDefaults()`,
is to supply a default value for every *required* property. So I'm now going to
add an `owner` key set to `UserFactory::new()`:

[[[ code('4685cbb39a') ]]]

Thanks to this, if we execute `QuestionFactory` *without* overriding any
variables, this will create a brand new user for each new question.

But inside of *our* fixtures, that's... not exactly what we want. Head down to the
bottom where we create the users. What I want to do is create these users first.
And then, when we create the questions up here... oh actually right here, I want
to use a random user from the ones that we already created.

To do this, we first need to move our users up to the top so that they're created
first:

[[[ code('d1a4effae6') ]]]

Then, down here for our main questions, pass a function to the second argument
and return an array... so that we can override the `owner` property. Set it to
`UserFactory::random()`:

[[[ code('05bd527622') ]]]

I'm not going to worry about also doing this for the unpublished questions down
here... but we could.

Ok: let's try the fixtures again:

```terminal
symfony console doctrine:fixtures:load
```

This time... they work!

Cool! So let's leverage the new relationship on our site to print the *real* owner
of each question. We're also going to start a question edit page and then... have
to figure out how to make it so that only the *owner* of each question can access
it.
