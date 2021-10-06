# Saving Items in a ManyToMany Relation

We just successfully generated a ManyToMany relationship between `Question` and
`Tag`... and we even made and executed the migration.

*Now* let's see how we can relate these objects in PHP. Open up
`src/DataFixtures/AppFixtures.php`. We're going to create a couple of objects
by hand. Start with `$question = QuestionFactory::createOne()` to create a question -
the lazy way - using our factory. Then I'll paste in some code that creates two
`Tag` objects for some very important topics to my 4 year old son.

[[[ code('8ddff45c03') ]]]

To actually *save* these, we need to call `$manager->persist($tag1)` and
`$manager->persist($tag2)`.

[[[ code('728945b649') ]]]

## Relating the Objects

Awesome! Right now, this will create one new `Question` and two new tags... but
they won't be related in the database. So how *do* we relate them? Well, don't
think at *all* about the join table that was created... you really want to pretend
like that doesn't even exist. Instead, like we've done with the other relationship,
*just* think:

> I want to relate these two `Tag` objects to this `Question` object.

Doing *that* is pretty simple: `$question->addTag($tag1)` and
`$question->addTag($tag2)`.

[[[ code('eda0806ff8') ]]]

That's it! Let's try this thing! Reload the fixtures:

```terminal
symfony console doctrine:fixtures:load
```

And... no errors! Check the database:

```terminal
symfony console doctrine:query:sql 'SELECT * FROM tag'
```

No surprise: we have two tags in this table. Now
`SELECT * FROM question_tag` - the *join* table.

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

And... yes! This has two rows! The first relates the first tag to the question
and the second relates the *second* tag to that same question. How cool is that?
We simply relate the objects in PHP and *Doctrine* handles inserting the rows into
the join table.

If we saved all of this stuff and then, down here, said
`$question->removeTag($tag1)` and saved again, this would cause Doctrine to
*delete* the first row in that table. All of the inserting and deleting
happens automatically.

## Owning vs Inverse on a ManyToMany

By the way, like with *any* relationship, a `ManyToMany` has an *owning* side
and an inverse side. Because we originally modified the `Question` entity and added
a `$tags` property, *this* is the owning side.

In a `ManyToOne` and `OneToMany` relationship, the owning side is *always* the
`ManyToOne`... because that's the entity where the foreign key column exists,
like `question_id` on the `answer` table.

But a `ManyToMany` is a bit different: you get to *choose* which side is
the owning side. Because we decided to update the `Question` entity when we ran
`make:entity`, that command set up *this* class to be the owning side. The way
you know is that it points to the *other* side by saying `inversedBy=""`. So
it's pointing to the *other* side of the relationship as the *inverse* side.

[[[ code('a97db4fb71') ]]]

Then, over in `Tag`, this is the inverse side. And you can see that it says
`mappedBy="tags"`. This says:

> The owning side - or "mapped side" - is the `tags` property over in the
> `Question` entity.

[[[ code('6196dd9023') ]]]

But... remember: this distinction isn't *that* important. *Technically* speaking,
when we want to relate a `Tag` and `Question`, the only way to do that is by
setting the owning side: setting the `$tags` property on `Question`.

So let's do an experiment: change the code to be `$tag1->addQuestion($question)`
and `$tag2->addQuestion($question)`.

[[[ code('e3803d11ee') ]]]

So we're now setting the *inverse* side of the relationship *only*. In theory, 
this should *not* save correctly. But let's try it: reload the fixtures.

```terminal-silent
symfony console doctrine:fixtures:load
```

## Foundry Proxy Objects

Ah! This error is unrelated: it's from Foundry: it says that
`$tag->addQuestion()` argument `one` should be a `Question` object, but it
received a `Proxy` object.

When you create an object with Foundry, like up here, it actually returns a
`Proxy` object that *wraps* the true `Question` object. It doesn't normally matter,
but if you start mixing Foundry code with non-Foundry code, sometimes you can get
this error. To fix it, add `->object()`.

[[[ code('18914cc000') ]]]

This will now be a *pure* `Question` object.

*Anyways*, reload the fixtures again:

```terminal-silent
symfony console doctrine:fixtures:load
```

And... it works. More importantly, if we query the join table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

We still have two rows! That means that we *were* able to relate `Tag` and
`Question` object by setting only the *inverse* side of the relation... which is
exactly the opposite of what I said.

But... this only works because our entity code is smart. Look at the `Tag`
class... and go down to the `addQuestion()` method. 

[[[ code('1adc45c3cb') ]]]

Yep, it calls `$question->addTag($this)`. We saw this *exact* same thing 
with the `Question` `Answer` relationship. When we call, `addQuestion()`, 
*it* handles setting the owning side of the relationship. *That* is why 
this saved. Watch: if we comment this line out... 

[[[ code('a0fc665637') ]]]

reload the fixtures...

```terminal-silent
symfony console doctrine:fixtures:load
```

... and query the join table, it's empty! We *do* have 2 `Tag` objects...
but they are not related to any questions in the database because we never set
the owning side of the relationship. So... let's put that code back.

[[[ code('5c13d63731') ]]]

Next: let's use Foundry to create a bunch of `Tag` objects and randomly relate them
to questions.
