# Reusing Query Logic & Param Converters

Maybe my favorite thing about the `QueryBuilder` is that if you have multiple methods
inside of a repository, you can *reuse* query logic. For example, a lot of
queries might need this `andWhere('q.askedAt IS NOT NULL')` logic. That's *not*
complex, but I would still *love* to not repeat this line over and over
again in every method and query. Instead let's centralize this logic.

## Private Method to Mutate a QueryBuilder

Create a new private function at the bottom. Let's call it `addIsAskedQueryBuilder()`
and give it a `QueryBuilder` argument - the one from ORM. Make this also *return*
a `QueryBuilder`.

Inside, we're going *modify* the `QueryBuilder` that's passdd to us to give it
the custom logic. So, `$qb->`, and then copy then the
`andWhere('q.askedAt IS NOT NULL')`. Oh, and `return` this.

Pretty much every `QueryBuilder` method returns *itself*, which is nice because
that allows us to do method chaining.

Ok, back in the original method, *first* create a `QueryBuilder` and set it to a
variable. So, `$qB = $this->creataeQueryBuilder()`.

Then we can say `return $this->addIsAskedQueryBuilder($qb)`, and then the rest of
the query.

How cool is that? We now have a private method that we can call whenever we
a query that will *only* return published questions. And as a bonus... when
we refresh... it doesn't break!

## Making the QueryBuilder Argument Option

But it *is* kind of a bummer that we needed to *first* create this empty
`QueryBuilder`. It sort of broke our cool-looking method chaining a bit. Let's see
if we can improve this.

Create another private method at the bottom called `getOrCreateQueryBuilder()`.
This will accept an *optional* `QueryBuilder` argument - so
`QueryBuilder $qb = null`. And it will return a `QueryBuilder`.

This is *totally* a convenience method. If the `QueryBuilder` is passed, return
it, else, return `$this->createQueryBuilder()` using the same `q` alias.

This is useful because in `addIsAskedQueryBuilder()`, we can add `= null` to make
its `QueryBuilder` argument optional. Make this work by saying
`return $this->getOrCreateQueryBuilder()` and pass it `$qb`. Then
`->andWhere('q.askedAt IS NOT NULL')`

So, if somebody passes us an existing `QueryBuilder`, we'll use it. But if not,
we'll create an empty `QueryBuilder` automatically. How nice of us!

All of this basically just makes our helper method easier to use above. Now
just `return $this->addIsAskedQueryBuilder()` with *no* `$qb` argument.

Before we celebrate and throw a well-deserved taco party, let's make sure it
works. Refresh and... it does! Sweet! Tacos!

Next, I've got another shortcut to show you. This time it's about letting Symfony
query for an object automatically in the controller.
