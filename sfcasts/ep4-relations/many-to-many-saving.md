# Saving Items in a ManyToMany Relation

Coming soon...

Okay, let's see how we can relate
these objects in action. So open up our `src/DataFixtures/AppFixtures.php` class.
We're going to discrete a couple of objects by hand. So first I'll say
`$question = QuestionFactory::createOne()` So I'll kind of create a question, the
lazy way using my factory. Then I'm going to create two tag objects. I'll just paste
their code here

To tag objects for something that I spend a lot of time thinking about along with my
four year old. And then to actually say these on your own call `$manager->persist($tag1)`,
uh, Taiwan and `$manager->persists($tag2)` Awesome. So right now it's going to great.
One new question and two new tags, but they're not going to be related to the
database. So how do we relate them? Well, don't think at all about this join table
that was created almost pretend like that doesn't even exist. Just think I want to
relate these two `Tag` objects to this question.

And so the way to do this is by saying $question->addTag($tag1)` `$question-addTag($tag2)`
That's it let's go over that are fixtures,

```terminal
symfony console doctrine:fixtures:load
```

and no errors. What's up in the

```terminal
symfony console doctrine:query:sql 'SELECT * FROM tag'
```

let's first select star from tech. No surprise. We have two entries inside of that table.
Now `SELECT * FROM question_tag`, the join table inside of there.

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

Yes, it actually is. When we, we have two rows inside of here, this is this first one
is relating the first tag to that question. And this is relating the second tag to
that question. How cool is that? We simply relate the objects in PHP in doctrine
handles inserting the rows as needed into the joint table. If we saved all this stuff
and then down here, it said, question arrow, remove tag tab one, and saved again.
This would actually cause doctrine to delete that this first row in that table, by
the way, like with many to one and one to many relationships, a many to many has an
owning side.

And in inverse side, because we originally modified the question entity and added a
`$tags` property. This is the owning side. It's actually determined because you can see
that it's pointing to the other side by saying `inversedBy=""`. So it's pointing to the
inverse side of the relationship. Then over in `Tag`, this is the inverse side of the
relationship. And you can see it's saying `mappedBy="tags"` is basically saying to find
the owning side, go look at the `$tags` property in `Question`. This means that the fact
that this has an owning an inverse side of the relationships, it means that
technically speaking, when we want to relate a tag and question me only way to do it
is by setting the `Question` `$tags` property.

If we changed this logic to be `$tag1->addQuestion($question)`, and
`$tag2->$tag1->addQuestion($question)` So only. So set the inverse side that wouldn't work well,
actually it will work for the same reason that we saw before, but let's try it. So
reload the fixtures and oh,

```terminal-silent
symfony console doctrine:fixtures:load
```

we actually get an area this is related to Foundry. So it
says `$tag->addQuestion()` argument. One question. It must be a type question proxy
given. So when you create an object with a Foundry, like up here, it actually returns
a proxy object that wraps your two true question object. It doesn't normally matter,
but if you start mixing Foundry code with non Foundry code, sometimes you can get
that air anyways in con `->object()` method. And now this will be a pure `Question` object.
Anyways, wondering we reload the fixtures again, it works. And more importantly, if
we created a joint table, we still have two rows in there, meaning that we were able
to relate tag and questions by setting the inverse side, which is exactly the
opposite of what I said.

But this only works because our entity code was generated smart. If you look at any
tag and state and go down to the `addQuestion()` method. Yep. It calls
`$question->addTag($this)` We saw this exact same thing with the question, answer relationship. When we
call, add question, it sets the owning side of the relationship. That is why this
saved. Watch. If we commented this line out, then reload. The fixtures.

```terminal-silent
symfony console doctrine:fixtures:load
```

This time he joined table is empty. We do have to `Tag` objects. It's just that when they were, they
weren't ever related to the database because the owning side of their relationship
was never set. So let's put that back again. Thanks to the generated code for make
and state. You shouldn't ever really need to think about this. I just want you to
keep it in mind next. Let us do something. I'm not sure what it is back. Mm.
