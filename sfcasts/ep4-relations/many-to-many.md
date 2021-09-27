# ManyToMany Relation

Each `Question` is going to be able to have many tags: we're going to render the
list of tags below each question. But *then*, each tag could *also* be related
to many different question. OMG! We need a `ManyToMany` relationship! But don't take
my word for it, let's pretend that we haven't figured which relationship we need
yet: we just know that we want to be able to set multiple `Tag` objects onto a
`Question` object. In other words, we want our `Question` class to have a *tags*
property. Well, let's add that! Find your terminal and run:

```terminal
symfony console make:entity
```

For which entity to edit, we could actually choose `Question` or `Tag`... it
won't make much difference. But in my mind, right now I want to edit the
`Question` entity in order to add a new property called `tags`. Once again,
use the fake type called `relation` to activate the relationship wizard.

Okay: what class should this entity be related to? We want to relate to the `Tag`
entity. Just like before, we see the big nice table describing the different
relationships. If you focus on `ManyToMany`, it says:

> Each question can have many `Tag` objects and each `Tag` can also
> relate to many `Question` objects.

That describes our situation perfectly. Answer `ManyToMany`. Next, it asks
a familiar question:

> Do we want to add a new property to `Tag` so that we can access or update
> `Question` objects from it?

It's basically saying:

> Hey! Would it be convenient for you to have a `$tag->getQuestions()` method.

I'm not *so* sure that'll be useful... but let's say yes: it doesn't hurt anything.
This will cause it to generate the *other* side of the relationship: we'll see
that code in a minute. What should the property be called inside `Tag`? `questions`
sounds perfect.

And... we're done! Hit enter to exit the wizard. Let's go check out the entities!
Start in `Question`. Awesome. No surprise: it added a new `$tags` property, which
will hold a *collection* of `Tag` objects. And as we mentioned before, whenever you
have a relationship that holds a "collection" of things - whether that's a collection
of answers or a collection of tags, in the construct method, you need to initialize
it to an `ArrayCollection`. That's taken care of for us.

Above the property, we have a `ManyToMany` to tags... and if you scroll to the
bottom, of the class, we have a `getTags()`, `addTag()` and `removeTag()` methods.
If you're thinking that this looks a *lot* like the code generated for a
`OneToMany` relationship, you're right!

Now let's check out the `Tag` class. Things here... well... they look pretty much
the same! We have a `$questions` property... which is initialized to an
`ArrayCollection`. It is *also* a `ManyToMany` and points to the `Question` class.
And below, it has `getQuestions()`, `addQuestion()` and  `removeQuestion()`.

Now that we've seen what this look like in PHP, let's generate the migration:

```terminal
symfony console make:migration
```

Once it finishes... spin over and open that new file. And... woh! It creates a
brand new table! It's called `question_tag`... and it has only *two* columns: a
`question_id` foreign key column and a `tag_id` foreign key column. That's it.

And... this makes sense! Even outside of Doctrine, this is how you build a
`ManyToMany` relationship: you create a "join table" that keeps track of which
tags are related to which questions.

With Doctrine, it's no different... except that Doctrine is going to handle the
heavy lifting of inserting and removing records to and from this table *for* us.
We'll see that in a minute.

But before I forget, head back to your terminal and run this migration:

```terminal
symfony console doctrine:migrations:migrate
```

Next: let's see our relationship in action, by relating questions and tags in
PHP and watching Doctrine automatically inserts rows into the join table.
