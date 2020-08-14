# DQL & The Query Builder

We just learned that when you ask for a repository, what you *actually*
get back is a custom class. Well, technically you don't *have* to have a custom
repository class - and if you don't, Doctrine will just give you an instance of
`EntityRepository`. But in practice, I *always* have custom repository classes.

Anyways, when we ask for the repository for the `Question` entity, we get back
an instance of this `QuestionRepository`. The *cool* thing is that we can add custom
methods to hold custom queries. In fact, *every* time I write a custom query,
I'll put it in a repository class.

Here's the new goal: I want to change the query on the homepage so that it
*hides* any questions `WHERE askedAt IS NULL`. This will hide "unpublished"
questions.

## DQL

We know that we use SQL queries to talk to databases. Internally, Doctrine has a
slightly different language called DQL: Doctrine Query Language. But don't worry,
it's almost *identical* to SQL. The main difference is that, with DQL, you
reference class and property names instead of table and column names. Otherwise,
it basically looks the same.

## The QueryBuilder

Now, you can *absolutely*  write DQL strings by hand and execute them. *Or* you
can use a *super* handy object called the `QueryBuilder`, which allows you to
*build* that DQL string using a convenient object. *That* is what you see here.

The `$this->createQueryBuilder()` line creates the `QueryBuilder` object. And
because we're inside of the `QuestionRepository`, the `QueryBuilder` will *already*
know to query `FROM` the `question` table. The `q` is basically the table alias,
like `SELECT * FROM question as q`. We'll use that everywhere to refer to
properties on `Question`.

Then, most of the methods on  `QueryBuilder` are pretty intuitive, like,
`andWhere()` and `orderBy()`. `setMaxResults()` is probably one of the *least*
intuitive and it's still pretty simple: this adds a `LIMIT`.

## Prepared Statements

Check out the `andWhere()`: `q.exampleField = :value`. Doctrine uses prepared
statements... which is a fancy way of saying that you should *never* concatenate
a dynamic value into a string. *This* allows for SQL injections.

Instead, whenever you have something dynamic, set it to a placeholder - like `:value`
and then *set* that placeholder with `setParameter()`. This is how prepared
statements work. It's not unique at *all* to Doctrine, but I wanted to point it out.

## Writing our Custom Query

Ok: let's clear out these four lines and make our *own* query. Start with
`->andWhere('q.askedAt IS NOT NULL')`.

[[[ code('7ac7465903') ]]]

I'm using `askedAt` because that's the name of the *property*... even though
the column in the table is `asked_at`. Now add `->orderBy()` with
`q.askedAt` and `DESC`.

[[[ code('a8ac4aa978') ]]]

Oh, and notice that I'm using `andWhere()`... even though there are no WHERE
clauses before this! I'm doing this for 2 reasons. First... because it's allowed!
Doctrine is smart enough to figure out if it needs an `AND` statement or not.
And second, there *is* a `where()` method... but it's kind of dangerous because
it will *override* any `where()` or `andWhere()` calls that you had earlier. So,
I *never* use it.

Once we're done building our query, we always finish with `getQuery()` to
transforms it into a finished `Query` object. Then, the `getResult()` method will
return an *array* of `Question` objects. My `@return` already says this! Woo!

The other common *final* method is `getOneOrNullResult()` which I use when I want
to find a *single* record.

Ok: with any luck, this will return the array of `Question` objects we need!
Let's try it! Find your browser, refresh and... no errors! But I can't exactly
tell if it's hiding the right stuff. Let's click on the web debug toolbar to see
the query. I think that's right! Click "View formatted query". That's
*definitely* right!

## More Complex Queries? SQL?

We're not going to talk too much more about creating custom queries, but we *do*
have an entire tutorial about
[Doctrine queries](https://symfonycasts.com/screencast/doctrine-queries). It's
built on an old version of Symfony, but all of the info about Doctrine queries
hasn't changed.

And yes, if you ever have a super duper custom complex query and you *just* want
to write it in normal SQL, you can *absolutely* do that. The Doctrine queries
tutorial will show you how.

## Autowiring the Repository Directly

Anyways, whenever we need to query for something, we're going to get the
repository for that entity and either call a *custom* method that we created or
a built-in method. And actually... I've been making us do too much work!
There's an *easier* way to get the repository. Instead of autowiring the
entity manager and calling `getRepository()`, the `QuestionRepository` *itself*
is a service in the container. That means we can autowire it directly!

Check it out: remove the `EntityManagerInterface` argument and replace it with
`QuestionRepository $repository`. Celebrate by deleting the `getRepository()` call.

[[[ code('1dfbf65a32') ]]]

If we move over and refresh... it *still* works! In practice, when I
need to query for something, this is what I do: I autowire the specific repository
I need. The only time that I work with the entity manager directly is when I need
to *save* something - like we're doing in the `new()` method.

Thanks to the `QueryBuilder` object, we can leverage a pattern inside our
repository that will allow us to *reuse* pieces of query logic for multiple queries.
Let me show you how next.
