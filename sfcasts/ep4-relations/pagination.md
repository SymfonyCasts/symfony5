# Pagination with Pagerfanta

I want to add *one* more Doctrine-specific feature to our site: pagination.

Right now, on the homepage, we're rendering *every* question on the site. That's...
not very realistic. Instead, let's render 5 on each page with pagination links.

## KnpPaginator and Pagerfanta

Doctrine *does* come with some tools for pagination... but they lack a few features
that make it easy to use. Fortunately, there area *two* great libraries in the
Symfony ecosystem to help with this: KnpPaginator and Pagerfanta.

Both of these are really good... and I have a hard time choosing between them.
In our Symfony 4 Doctrine tutorial, we talked about KnpPaginator. So in *this*
tutorial, let's explore Pagerfanta.

## Installing PagerfantaBundle

Search for "pagerfanta bundle" to find a GitHub pagae under the "BabDev" organization.
Scroll down a little and click into the documentation.

The PagerfantaBundle is a wrapper around a Pagerfanta *library* that holds most
of the functionality. So the documentation is kind of split between the bundle and
the library. Open the docs for the library over in another tab so we have it handy...
then come back and click "Installaation".

Copy the "composer require" line, spin over toyour terminal and get it:


```terminal
composer require babdev/pagerfanta-bundle
```

Let's see what that did:

```terminal
git status
```

Ok: nothing interesting, though it *did* automatically enable the new bundle.

## Pagers Work with QueryBuilders

The controller for the homepage lives at `src/Controller/QuestionController.php`:
the `homepage` action. We're calling this custom repository method, which is returning
an array of `Question` objects.

The biggest difference when using *any* paginator is that *we* will no longer execute
the query directly. Instead, our job will be to create a `QueryBuilder` and pass
*that* to the paginator... which will figure out what page we're on and set up the
limit and offset setuff *for* us.

In other words, to prep for Pagerfanta, instead of returning an array of `Question`
objects, we need to return a `QueryBuilder`. Rename the method to
`createAskedOrderedByNewestQueryBuilder()`... and it will return a `QueryBuilder`.
Inside, all we need to do is remove `getQuery()` and `getResult()`.

Back over in the controller, change this to `$queryBuilder` equals
`$repository->createAskedOrderedByNewestQueryBuilder()`.

Ok, we're ready!

## Installing the ORM Pagerfanta Adapter

The next step is to create a `Pagerfanta` object... you can see the "Rendering
Pagerfantas" section. This looks simple enough: create a new `Pagerfanta` and,
because we're using Doctrine, create a new `QueryAdapter` and pass in our
`$queryBuilder`.

Cool: `$pagerfanta = new Pagerfanta()`... and, `new QueryAdapter()`. But... hmm...
PhpStorm isn't finding that class.

This is a...kind of weird... but also really cool thing about the Pagerfanta
packages. Go back to library's documentation and click "Pagination Adapters".
The Pagerfanta library can be used to paginate a *lot* of different things.
Actually, click "Available Adapters".

For example, you can use Pagerfanta to paginate a relationship property, like
`$question->getAnswers()`, via its `CollectionAdapter`. Or you can use it to paginate
Doctrine DBAL queries... which is a lower-level way to use Doctrine. You can
also paginate MongoDB or, if yo'ure using the Doctrine ORM like we are, you
can paginate with the `QueryAdapter`.

This is cool! But each adapter lives in its own Composer *package*... which is
why we don't have the `QueryAdapter` class yet. So let's install it: copy the
package name, spin over to your terminal, and run:

```terminal
composer require pagerfanta/doctrine-orm-adapter
```

Once PhpStorm indexes the new code... try `new QueryAdapter()` - we have it! -
and pass `$queryBuilder`. We can also configure a few things, like
`->setMaxPerPage(5)` - I'm using 5 so that pagination is really obvious.

## Looping Over a Pagerfanta

For the template, instead of passing a `questions` variable, we're going to pass
the us a `pager` variable set to the `$pagerfanta` object.

Now,pPop into the homepage template... and scroll up. We *were* looping over the
`questions` array. What do we do now? Loop over `pager`: `for question in pager`.

Yup, we can treat the `Pagerfanta` object like an array. The *moment* we do this,
Pagerfanta will execute the query it needs to get the results for the current page.

Let's try it! Go back to the homepage. If we refresh now... 1, 2, 3, 4, 5. Yes!
The paginator is limiting the results!

Check out the query for this page. Remember, our query for this page was *already*
pretty complex. The pager *wrapped* that query in *another* query to get *just*
the ids of the 5 questions we need, ordered in the right way. Then, with a second
query, it grabs the data for those 5 questions.

The point is: the pager does some heavy lifting to make this work... and our complex
query *doesn't* cause any issues.

So... cool! It returned only the first 5 results! But what about pagination links?
Like links to get to the next page... or the last page? Let's handle that next.
