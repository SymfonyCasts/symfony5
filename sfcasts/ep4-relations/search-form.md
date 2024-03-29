# Search, the Request Object & OR Query Logic

New mission: let's add a search box to this answers page. Head over to
`popularAnswers.html.twig`. We don't actually need a row here... so I'm going
to simplify my markup: move this `<ul>` to the bottom. Cool. Now we can give this
`div` on top a `d-flex` class and also `justify-content-between`. This will
let us have this `<h1>` on the left and a search form on the right.

[[[ code('314142e663') ]]]

## Adding the Search Form

Add the `form` tag. This will submit right to this `AnswerController` route.
So set the action to `{{ path('app_popular_answers') }}`. I'm going to *not*
add a `method=""` attribute, because that defaults to `GET`, which is what you
want for a search form.

[[[ code('7bb0ffa7d4') ]]]

Inside, add the search field: `<input type="search">`. I'll break this on multiple
lines. Add `name="q"` - that `q` could be anything, but we'll read that from our
controller - a `class`, a `placeholder` and an `aria-label=""` for accessibility
since we don't have a *real* label for this field.

[[[ code('2579f956ec') ]]]

By the way, I'm not using the Symfony's form component because we haven't talked
about it yet... but also because this form is *so* simple that it's overkill anyways.

Refresh now. Looks awesome! And if we fill in the box and hit enter...
we come *right* back to this page, but now with `?q=bananas` on the URL. The results
don't change because we're not *reading* that query parameter in our code yet.
So let's do that.

## Symfony's Request Object

Head into `AnswerController`. Here's the plan: we're going to read that `?q=` from
the URL, pass that string into `findMostPopular()` as an argument, and then use that
inside of the query to add a where `answer.content LIKE` that search term. So,
a fuzzy search.

But inside of the controller, how *can* we read the `?q=` from the URL in Symfony?
Whenever you need to read *anything* from the request - like query parameters, post
data, headers or cookies - you need Symfony's `Request` object: it holds *all* of
these goodies.

And if you're in a controller, it's easy to get! Add a new argument type-hinted
with `Request` - the one from `HttpFoundation`. You can *call* the argument anything,
but I'll use `$request` to avoid being crazy.

[[[ code('f50435ba1d') ]]]

Here's how this works, it's pretty simple: *if* you have an argument to your controller
that's *type-hinted* with Symfony's `Request` class, Symfony will pass you the
`Request` object. This class has a *bunch* of methods on it to get *anything* you
need from the request. To fetch a query parameter, use `$request->query->get()`
and then the name: `q`. If that query parameter isn't there, this will return null.

[[[ code('e07f9c1193') ]]]

## Adding The Fuzzy LIKE Search

Over in the repository, add a new `string $search` argument... I'll let it be
optional, in part, so that it accepts a `null` value. 

[[[ code('5eac661e6b') ]]]

For the query, let's do it in pieces. Add `$queryBuilder =` the first part... 
and stop after the `addSelect()`. 

[[[ code('b13d9d9370') ]]]

At the bottom `return $queryBuilder` and then the rest. I'll... fix my typo.

[[[ code('b13d9d9370') ]]]

The reason we're splitting this into two pieces is that we only want to apply the
search logic *if* a search term was actually passed. Splitting it lets us say
if `$search`, then, `$queryBuilder->andWhere()` with `answer.content` - that's the
field we're going to search inside of - `LIKE :searchTerm`. That `searchTerm`
could be anything: it's just a placeholder that we fill in by saying
`->setParameter('searchTerm', $search)`. Except... to be a fuzzy search, we need
to put `%` on each side. I know, it looks funny, but that's exactly what we want.

[[[ code('cbea21d03c') ]]]

Let's try it! Clear the `?q=` from the URL first. Cool: we have our normal,
non-filtered results. Copy a word from an answer to search for. And... got it!
The top item became the *second* result... but this *third* result is definitely
new. But let's search a different word to make it even more obvious. Yup!
That's working.

## Using the Request Object in Twig

Though... it's not very obvious that we're filtering because we're not rendering
the search term in the search box. Open up `popularAnswers.html.twig` and add a
`value=""`. To render the current search term, we *could* read the query parameter
in the controller and pass it into our template as a variable. But in this case,
we can cheat because the request object is available in every template via
`app.request`. So we can say `app.request.query.get('q')`.

[[[ code('9e2ffc57a9') ]]]

Now... much better.

## Filtering Across a Join

*But*, our search could be smarter! Well, if we wanted to make our search *really*
smart, we should probably use something like Elasticsearch. But to make our search
a *little* bit cooler, let's *also* return results that match the *question's* text.

For example, clear out the search term... and let's search for something that's
in the first *question*. Hit enter. That result disappears because we're *not*
searching the question text yet.

Over in `AnswerRepository`, let's think. We want to query where
`answer.content LIKE :searchTerm` *or* the question's text is `LIKE :searchTerm`.

The `QueryBuilder` *does* have an `orWhere()` method. Big win, right!

Actually... no! I *never* use that method. The reason is that it gets tricky
to get the parentheses correct in a query when using `orWhere()`. I'll show you what
I mean when we see the final query. The point is that if you need an `OR` in a
WHERE statement, you should *still* use `andWhere()`. Yup, we can say:
`answer.content LIKE :searchTerm OR` and then pass another expression. We want to
search on the `$question` property of the `Question` entity. And since we joined
over to the `Question` entity and aliased it to `question`, we can say
`question.question LIKE` and use that same `:searchTerm` placeholder.

[[[ code('7c65b06828') ]]]

That's it! When we refresh now... yes! That first result showed back up! And check
out the query for this page, it's pretty sweet.... and easier to see in the formatted
version. Check out the WHERE clause. I totally forgot that we were *already*
filtering WHERE `status = approved`. But because we put the `OR` statement *inside*
of the `andWhere()`, Doctrine surrounded the entire fuzzy search part with parentheses.
If we had used `orWhere()`, that wouldn't have happened... and our query logic
would have been wrong: it would have allowed non-approved answers to be returned
as long the search term matched the question text.

Ok! We've mastered the `ManyToOne` relationship, which is actually the same as
the `OneToMany` relationship. We got two for one! That means that there are only
two more relationships to learn about: `OneToOne` and `ManyToMany`. Except...
that's not true: we really only have *one* more relationship to learn about. Next:
we'll discover that there are really only *two* types of relationships, not four.
