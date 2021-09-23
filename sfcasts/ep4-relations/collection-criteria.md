# Collection Criteria for Custom Relation Queries

When we render the answers for a question, we only want to render the *approved*
answers. I got clever and did this by adding a `getApprovedAnswers()` method. It
loops over *all* of the answers but then returns only the *approved* ones.

The *problem* with this approach is... performance. It's pretty silly to query
for *every* `Answer` object related to this question... and then only render
*some* of them.

Realistically, if there are only ever a *few* non-approved answers, this is no big
deal. But if it's possible that a question could have *many* non-approved answers,
this page could *really* slow down. Imagine querying for 200 answers because some
SPAM bot hit our site... only to render 6 of them.

Unfortunately, because we're in an entity, we can't simply grab the `AnswerRepository`
service from inside of this method and create a custom query. So, are we stuck? Do
we need to back up into our controller and do the custom query for the answers there?

Fortunately, no. These Doctrine Collection objects have a few tricks up their sleeves,
including a special "criteria" system for *just* this situation. It allows us to
*describe* how we want to filter the answers and then it *uses* that when it queries!

## Creating the Criteria Expression

Remove the filter stuff entirely... and instead say `$criteria = Criteria` - the
one from `Doctrine\Collections` - `::create()`. Then, this object "kind of" looks
like a query builder. For example, it has an `->andWhere()` method. The big difference
is what we put inside of this. Instead of a simple string, we need to use a criteria
"expression": `Criteria::expr()`, `->eq()` for equals and pass this `status` the
property that we want to use in the WHERE. For the second arg, pass
`Answer::STATUS_APPROVED`.

This `Criteria` object now "describes" how we want to filter the answers. To use
it, say `$this->answers->matching($criteria)`.

For me, the criteria syntax - especially the expression stuff - is a little
cryptic... but it's still usually pretty easy to create whatever logic I need.
And, most importantly, it gets the job done.

Check it out: we have 6 approved answer now. After we refresh... ok good: this
*still* renders 6 answers. Open the Doctrine profiler to look at the queries.
And... amazing! When we call the `getApprovedAnswers()` method, it now queries
from answer where `question_id` equals this question *and* `status = 'approved`!
Event the `COUNT()` query *above* this does that!

So... *that's* the criteria system! And other than getting a little bit fancier with
the expressions you create, it's just that simple and powerful. It's one of my
favorite secrets inside of Doctrine.

## Moving Criteria Logic into the Repository

By the way, if you don't like having the query logic in your entity, I don't blame
you! But no worries:we can move it into our repository. Copy the criteria code and
then open up `src/Repository/AnswerRepository.php` since this criteria relates to
answers. I'll delete the example code and replace it with a new public
*static* function called `createApprovedCriteria()`. This will, of course, return a
`Criteria` object. Paste the logic and return this.

There are two reasons I'm making this *static*. First, because I want to be able
to call this from my `Question` entity. And since I can't inject service *objects*
into an entity, the only way to do that is by making this method static. And second...
this method *can* be static! It doesn't need to use the `$this` variable to call
any methods on the repository.


Anyways, now that we have this, back in `Question` we can simplify this to return
`$this->answers->matching(AnswerRepository::createApprovedCriteria())`.

Cool! If you go back to the site and try it now... still 6 questions: it still
works.

## Using Criteria in a QueryBuilder

One other cool thing about these `Criteria` objects is that you can reuse them
with the query builder. For example, suppose we need to create a custom that returns
10 approved answers. Add a new method for this: `public function findAllApproved()`
with an `int $max = 10` argument... and this will return and array. Though, more
specifically, I'll advertise in PHPDoc that this will return an array of `Answer`
objects.

Anyways, inside, create the query builder like normal: return
`$this->createQueryBuilder()` and pass it `answer` for the alias. To filter for
only approved answers, we would normally say `->andWhere('answer.status = :status')`.
But... I want to do this *without* duplicating the approved logic that we've
already written in the criteria method. Fortunately, you can put a criteria
*into* a `QueryBuilder` by saying `->addCriteria()` and then
`self::createApprovedCriteria()`.

Cool huh? from here, we can finish the query like normal:
`->setMaxResults($max)` and then `->getQuery()->getResult()`.

I won't *use* this method right now, but hopefully you get the idea.

Next: let's add a new page to our site that shows the most popular answers. This
will give us a great example to learn more about -then solve-  the N+1 problem.
We'll solve it by creating a custom query that *joins* across our relationship.
