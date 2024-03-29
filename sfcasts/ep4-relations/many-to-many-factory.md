# Handling ManyToMany in Foundry

Now that we've seen how we can relate `Tag` objects and `Question` objects, let's
use Foundry to properly create some fresh `Tag` fixture data. Start by generating
the `Tag` factory

```terminal
symfony console make:factory
```

And... we want to generate the one for `Tag`. Beautiful!

[[[ code('fdb8989a0a') ]]]

Go check out that class: `src/Factory/TagFactory.php`. Remember: our only job is
to make sure that we have good default values for all of the required properties.
For `name`, instead of using `text()`, we can use `->word()`. And like I've done
before, I'm going to remove `updatedAt`... but set `createdAt` to
`self::faker->dateTimeBetween('-1 year')`.

[[[ code('5779b575a2') ]]]

Now that we have this, at the top of the fixtures class, we can create 100
random tags with `TagFactory::createMany(100)`. I *love* doing that!

[[[ code('faf192d75d') ]]]

Below, for these 20 published questions, I want to relate *each* one to a random
number of tags. To do that, pass a second argument: this is an array of attribute
*overrides*. Let's think: the property we want to set on each `Question` object
is called `tags`. So pass `tags` `=>` some collection of tags. To get that
collection, let's pass this a *new* function: `TagFactory::randomRange(0, 5)`.

[[[ code('64ca34cc58') ]]]

This is pretty cool: it will return 0 to 5 random tags from the database, giving
each question a different *number* of random tags. There *is* a small problem with
this code... and maybe you see it... but let's try it anyways.

Spin over and reload the fixtures:

```terminal
symfony console doctrine:fixtures:load
```

Awesome. And now check the database. I'll first say:

```terminal
symfony console doctrine:query:sql 'SELECT * FROM tag'
```

Yep! We *do* have 100 tags. Actually, we have 102 tags. Go the bottom of the fixtures
class and delete our code from earlier: we don't need that anymore.

Anyways, this created 100 tags. Now check the join table:
`SELECT * FROM question_tag`

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

And... it *did* work... though if we're assigning 0 to 5 tags to *each* of the 20
questions... 20 *total* seems a little low. And... it *is*! Look closely: every
row is related to the *same* tag!

Of course! I keep making this mistake! Because we're passing an array of attributes,
the `TagFactory::randomRange()` method is only called *once*. So in my situation,
this returned *one* random `Tag`... and then assigned that one `Tag` to all 20
questions... which is why we ended up with 20 rows.

We know the fix: change this to a callback... that *returns* that array. 

[[[ code('8bbffd7982') ]]]

Try it again:

```terminal-silent
symfony console doctrine:fixtures:load
```

And then query the join table:

```terminal-silent
symfony console doctrine:query:sql 'SELECT * FROM question_tag'
```

Sweet! 41 results seems right! And we can see that each question is related to
different tags... and a different *number* of tags: some only have one, this one
has 4. So, it's perfect.

Next: each published question is now related to 0 to 5 tags. Time to render the
ManyToMany relationship on the frontend *and* learn how to join across it in
a query.
