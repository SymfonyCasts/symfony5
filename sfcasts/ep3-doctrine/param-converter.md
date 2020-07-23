# Automatic Controller Queries: Param Converter

Once again, I have a confession: I've *still* be making us do too much work. Dang!

Head over to `QuestionController` and find the `show()` action. Instead of
manually querying for the `Question` object via `findOneBy()`, Symfony can make
that query *for* us automatically.

## Automatic Queries

Here's how: replace the `$slug` argument with `Question $question`. The important
thing here is *not* the *name* of the argument, but the type-hint: we're type-hinting
the argument with an *entity* class.

And... we're done! Symfony will *see* the type-hint and automatically query for a
`Question` object `WHERE slug =` the `{slug}` route wildcard value.

This means that we *don't* need any of the repository logic down here... or even
the 404 stuff. I explain why in a minute. We can also delete my
`EntityManagerInterface` argument... and, actually, we haven't needed this
`MarkdownHelper` argument for awhile.

Before we chat about *what's* going on, let's try it. Refresh the homepage, then
click into one of the questions. Yes! It works! You can even see the query in
the web debug toolbar. It's exactly what we expect: `WHERE slug =` that slug.

## How... Does this Work?

This magic is *actually* provided by a bundle that we already have installed
called SensioFrameworkExtraBundle. When that bundle sees a controller argument
that's type-hinted with an entity class, it tries to query for that entity
*automatically* by using *all* of the wildcard values.

So this works because our wildcard is called `slug`, which *exactly* matches
the property name. Quite literally this makes a query where `slug` equals the
`{slug}` part of the URL. If we also had an `{id}` wildcard in the URL, then
the query would be `WHERE slug = {slug} AND id = {id}`.

It even handles the 404 for us! If we add `foo` to the slug in the URL... we
*still* get a 404!

This feature is called a param converter and I freakin' *love* it. But it doesn't
always work. If you have a situation where you need a more complex query... or
maybe for some reason the wildcard can't match your property name... or you have
an extra wildcard that is *not* meant to be in the query, then this won't work.
Well, there *is* a way to get it to work - but I don't think it's worth the trouble.

And... that's fine! In those cases, just use your repository object to make the
query like you normally would. The param converter is an *awesome* shortcut for the
most common cases.

Next: let's add some *voting* to our question. When we do that, we're going to
look closer at the *methods* inside of the `Question` entity, which right now,
are just getter and setter methods. Are we allowed to add our own custom methods
here? And if so, when should we?
