# Entity Class

Doctrine is an ORM: an object relational mapper. That's a fancy way of saying
that, for each table in the database, we will have a corresponding class in PHP.
And for each column on that table, there will be a property in that class. When
you query for a row in a table, Doctrine will give you an *object* with that
row's data set on the properties.

So if you want to create a database table in Doctrine, the way you do that is
actually by creating the class it will map to. These "classes" that map to
tables have a special name: entity classes.

## make:entity

You *can* create an entity class by hand - there's nothing very special about
them. But... come on! There's a *much* easier way. Find your terminal and run
one of my *favorite* `bin/console` commands:

```terminal
php bin/console make:entity
```

You can also run:

```terminal
symfony console make:entity
```

It doesn't matter in this case, because this command won't talk directly to the
database, and so, it doesn't need the environment variables. This command *just*
generates code.

Now remember: the *whole* point of our site is for witches and wizards to
ask questions and then post answers. So the *very* first thing we need
is a `Question` entity. So, a `question` table in the database.

Enter `Question`. The command immediately starts asking what properties we
want, which really, also means what *columns* we want in the table. Let's add
a few. Call the first one `name` - that will be the short name or "title" of
the question like "Reversing a Spell". The command then asks what "type" we want.
Doctrine has its *own* type system: enter "?" to see the full list.

These aren't MySQL column types, but each maps to one. For example, a `string`
maps to a `VARCHAR` in MySQL. And there are a bunch more.

In our case, choose `string`: that's good for any text 255 characters
or less. For the column length, I'll use the default 255. The next
question says:

> Can this field be nullable in the database?

Say "No". This means that the column will be *required* in the database.

And... congrats! We just added our first field! Let's add a few more. Call the
next `slug`: this will be the URL-safe version of the name that shows up in the
URL. It will also be a string, let's set its length to 100 and, once again, I'll
say "no" to "nullable".

For the actual body of the question, let's call it `question`. This will
be *long*, so we can't use the `string` type. Instead, use text... and make
this *also* required in the database.

Add *one* more field: `askedAt`. This will be a *date* field - kind of like a
"published at" field. For the type, ooh! It recommends `datetime` - that
is *exactly* what we want! Hit enter and this time say "yes" to nullable.
The idea is that users will be able to *start* writing a question and save it to
the database with a `null` `askedAt` because it's not finished. When the user *is*
finished and ready to post it, *then* we would set that value.

And... we're done! Hit enter one more time to exit `make:entity`.

## Hello Entity Class

So... what did this do? Well, first, I'll tell you that this made absolutely
*no* changes to our database: we do *not* have a `question` database table
yet.

If you scroll back up to the top of the command, you can see that it created 2
files: `src/Entity/Question.php` and `src/Repository/QuestionRepository.php`.

For now, *completely* ignore the repository class: it's not
important yet and we'll talk about it later.

This entity class, however, is *super* important. Go open it up:
`src/Entity/Question.php`.

[[[ code('1a970f0dbb') ]]]

As we talked about, we're going to have *one* class per table.

The first thing I want you to notice is that... there's nothing special about this
class. It's a boring, normal class... it doesn't even extend a base class!
It has several private properties and, to access those, the command generated
getter and setter methods, like `getName()`, `getSlug()` and `setSlug()`.

[[[ code('694e158b6e') ]]]

It's just about the most *boring* class you'll ever see.

But of course, if Doctrine is going to map this class and its properties to a
database table, it's needs to know a few things. For example, it needs
to know that the `name` property should map to a `name` column and that its
*type* is a `string`.

[[[ code('ca74540bc7') ]]]

The way that Doctrine does this is by reading annotations. Well, you can also
use XML, but I *love* annotations.

For example, the `@ORM\Entity()` above the *class* is what actually tells Doctrine:

[[[ code('dd26a10fdc') ]]]

> Hey! This is not just a normal, boring PHP class. This is an "entity": a class
> that I want to be able to store in the database.

Then, the `@ORM\Column()` above the properties is how Doctrine knows which properties
should be stored in the table and their types.

## Annotations Reference

Now, there are a *bunch* of different annotations and options you can use to
configure Doctrine. Most are pretty simple - but let me show you am *awesome*
reference. Search for
[doctrine annotations reference](https://www.doctrine-project.org/projects/doctrine-orm/en/2.7/reference/annotations-reference.html)
to find a *really* nice spot on their site where you can see a list of *all*
the different possible annotations and their options.

For example, `@Column()` tells you all the different options that you can pass
to it, like a `name` option. So if you wanted to control
the `name` of the slug column - instead of letting Doctrine determine it
automatically - you would do that by adding a `name` option.

One of the other annotations that you'll see here is `@Table`. Oh, and notice,
in the docs, the annotation will be called `@Table`. But inside Symfony, we always
use `@ORM\Table`. Those are both referring to the same thing.

Anyways, if you wanted to control the name of the table, we could say
`@ORM\Table()` and pass it `name=""` with some cool table name.

But I won't bother doing that because Doctrine will guess a good table
name from the class. Oh, and by the way, the auto-completion that you're seeing
on the annotations comes from the "PHP Annotations" plugin in PhpStorm.

Ok: status check! The `make:entity` command helped us create this new entity class,
but it did *not* talk to the database. There is *still* no `question` table.

How *do* we create the table? By generating a *migration*. Doctrine's migrations
system is *amazing*. It will even allow us to perform table *changes* with
basically zero work. Let's find out how next.
