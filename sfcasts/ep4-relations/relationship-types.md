# The 4 (2?) Possible Relation Types

Officially, there are *four* types of possible relations in Doctrine: `ManyToOne`,
`OneToMany`, `OneToOne` and `ManyToMany`. But... I say that's a lite! In reality,
there are only *two* types.

Let me explain. We already know that a `ManyToOne` relationship and a `OneToMany`
relationship are really just the *same* relationship seen from the two different
sides. So that means that instead of four different types of relations, there
are really only three.

## OneToOne is ManyToOne in Disguise

But... the `OneToOne` relationship is... kind of *not* a real relationship.

For example, you might use a `OneToOne` relationship from a `User` entity to a
`Profile` entity... which maybe holds *more* data about that user. If you did this,
in the database, your `user` table would have a `profile_id` foreign key column.
But wait: isn't that *exactly* how a `ManyToOne` relation looks like?

Yup! In reality, a `OneToOne` relationship is the same as a `ManyToOne`, except
that Doctrine puts a unique key on that `profile_id` column to prevent a single
profile from being being linked to multiple users. But... that's really the only
difference!

And, by the way, I try to avoid `OneToOne` relationships. Instead of splitting user
data across two different entities, I tend to just put them all in one to reduce
complexity. Splitting into two different entities *could* help performance, but
I think it's almost always more of a bother than a help. Wait until you have
performance problems and *then* debug the cause.

## Generating the Tag Entity

Anyways, this means that `ManyToOne`, `OneToMany` and `OneToOne` are all just the
same relationship. And so *that* leaves only `ManyToMany`, which *is* a bit different.
So let's build one! Imagine that every `Question` can get tagged with text
descriptors.

In order to store tags in the database, let's make a `Tag`. Spin over to your
console and run:

```terminal
symfony console make:entity
```

Call the new entity `Tag`... and it's going to be *real* simple: a single field
called `name` that will be a `string` type, `255` length, not nullable. Hit
enter again to finish up.

Before I run that migration, open up the new `Tag` class... because you *know*
that I love to use `TimestampableEntity`.

We could also add a `slug` column if we wanted to be able to go to a nice url
like `/tags/{slug}` to show all the questions related a slug. I *won't* do that
mostly because we shows how to do that in the last tutorial, how to generate a
`slug` automatically from some other property.

*But*, we now have a functional `Tag` entity. So let's generate a migration for this:

```terminal
symfony console make:migration
```

Beautiful! Go give it a quick peek to make sure nothing funny snuck in. Nope!
That looks boring: `CREATE TABLE tag` with `id`, `name` and the date fields.
So go run it:

```terminal
symfony console doctrine:migrations:migrate
```

Awesomesauce. So let's think about our goal: each `Question` could have many tags...
and each `Tag` could be related to maany questions. In other words, this is a
*many* to *many* relationship. Next: let's generate that and see what it looks like!
