# The 4 (2?) Possible Relation Types

Officially, there are *four* types of relations in Doctrine: `ManyToOne`,
`OneToMany`, `OneToOne` and `ManyToMany`. But... that's kind of a lie! In reality,
there are only *two* types.

Let me explain. We already know that a `ManyToOne` relationship and a `OneToMany`
relationship are really just the *same* relationship seen from the two different
sides. So that means that instead of four different types of relations, there
are really only three.

## OneToOne is ManyToOne in Disguise

But... the `OneToOne` relationship is... kind of *not* a different relationship.

For example, you decide to add a `OneToOne` relationship from a `User` entity to a
`Profile` entity... which would hold *more* data about that user. If you did this,
in the database, your `user` table would have a `profile_id` foreign key column.
But wait: isn't that *exactly* what a `ManyToOne` relationship looks like?

Yup! In reality, a `OneToOne` relationship is the same as a `ManyToOne`, except
that Doctrine puts a unique key on the `profile_id` column to prevent a single
profile from being being linked to multiple users. But... that's really the only
difference!

And, by the way, I try to avoid `OneToOne` relationships. Instead of splitting user
data across two different entities, I tend to put it all in one class to reduce
complexity. Splitting into two different entities *could* help performance, but
I think it's almost always more of a bother than a help. Wait until you have
*real* performance problems and *then* debug it.

## Generating the Tag Entity

Anyways, this means that `ManyToOne`, `OneToMany` *and* `OneToOne` are all... really
just the same relationship! That leaves only `ManyToMany`, which *is* a bit different.
So let's build one!

Imagine that every `Question` can get be tagged with text descriptors.

In order to store tags in the database, let's make a `Tag` entity. Spin over to your
console and run:

```terminal
symfony console make:entity
```

Call the new entity `Tag`... and it's going to be *real* simple: a single field
called `name` that will be a `string` type, `255` length, not nullable. Hit
enter again to finish up.

Before I generate that migration, open up the new `Tag` class... 

[[[ code('c9d5bff55d') ]]]

because you *know* that I love to use `TimestampableEntity`.

[[[ code('2f217209d2') ]]]

We could also add a `slug` column if we wanted to be able to go to a nice url
like `/tags/{slug}` to show all the questions related a slug. I *won't* do that...
mostly because we showed how to do that in the last tutorial: how to generate a
`slug` automatically from some other property.

Ok: we now have a functional `Tag` entity. So let's generate a migration for it:

```terminal
symfony console make:migration
```

Beautiful! Go give it a quick peek to make sure nothing funny snuck in. Nope!
That looks boring: `CREATE TABLE tag` with `id`, `name` and the date fields.

[[[ code('2f217209d2') ]]]

Go run it:

```terminal
symfony console doctrine:migrations:migrate
```

Awesomesauce. So let's think about our goal: each `Question` could have many tags...
and each `Tag` could be related to many questions. In other words, this is a
*many* to *many* relationship. Next: let's generate that and see what it looks like!
