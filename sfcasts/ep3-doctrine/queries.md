# Fetching Data & The Repository

Our `question` table has data! And each time we refresh, we got more data! You
get a question! You get a question!

Copy the slug from the latest one and then go to `/questions/that-slug` to
see it. Except... this is not *actually* that question. The name is
kinda right... but that's it. Over in the `show()` action, this is because *nothing*
is being loaded from the database. Lame!

Here's our next mission: use the `$slug` to query for a row of `Question` data and
*use* that to make this page *truly* dynamic. How? The entity manager that we
use to *save* data can *also* be used to *fetch* data.

## The Repository

Start by adding a third argument: `EntityManagerInterface $entityManager`. This
interface has a *bunch* of methods on it. But... most of the time, you'll only
use three: `persist()` and `flush()` to save, and `getRepository()` when you want
to *get* data.

Say `$repository = $entityManager->getRepository()` and pass the entity
*class* that we want to query. So `Question::class`.

Whenever you need to get data, you'll *first* get the *repository* for an entity.
This repository object is really really good at querying from the `question`
table. And it has several methods to help us.

For example, we want to query `WHERE` the `slug` column equals the `$slug`
variable. Do that with `$question = $repository->` and... this auto completes
a bunch of methods. We want `findOneBy()`. Pass this an array of the WHERE
statements we need: `'slug' => $slug`. After, `dd($question)`.

Ok, let's see what this returns! Refresh and... woohoo! This gives us a `Question`
*object*. Doctrine finds the matching row of data and uses that to populate an
object, which is beautiful.

The repository has a number of other methods on it. For example, `findOneBy()`
returns a single object and `findBy()` returns an *array* of objects that
match whatever criteria you pass. The `findAll()` method returns an array
of *all* `Question` objects and there are a few others. So without doing *any*
work, we can easily execute the most basic queries. Now, eventually we *will* need
to do more *complex* stuff - and for that, we'll write custom queries. We'll
see that later.

## 404 On Not Found

So when Doctrine finds a matching row, we get back a `Question` object. But if
we change the slug in the URL to something that does *not* exist, we get *null*.
So: a `Question` object or null.

Let's think: what *do* we want to do when someone goes to a URL that doesn't
match a real question? The answer is: trigger a 404 page! Great! Um... how do we
trigger a 404 page in Symfony?

First, this is optional - I'm going to say `/**` space and then type
`Question|null`.

This simply helps my editor know that this is a `Question` object or
null, which will assist auto-completion. And, to be honest, PhpStorm is so smart
that... I think it already knew this.

Below, if *not* `$question`, trigger a 404 page by saying
`throw $this->createNotFoundException()`, which is a method on the parent
`AbstractController` class. Pass this any message you want:

> No question found for slug %s

And pass the `$slug` variable.

That's it! But notice the `throw`. `createNotFoundException()` instantiates an
exception object - a very *special* exception object that triggers a 404 page.
Most of the time in Symfony, if you throw an exception, it will cause a 500
page. But this special exception maps to a 404.

Let's try it: refresh and... yes! You can see it up here: "404 Not found" with
our message.

Two things about this. First: this is the *development* error page. If we
changed the environment to `prod`, we would see a much more boring 404 page with
*no* error or stack trace details. We won't talk about it, but the Symfony docs
have details about how you can customize the look and feel of your error pages
on production.

The second thing I want to say is that the message - no question found for slug -
is something that only *developers* will see. Feel free to make this as *descriptive*
as you want: you don't need to worry about a real user seeing it.

Now that we have a `Question` object in our controller, let's use it in our
template to render *real*, dynamic info. That's next.
