# "5 Minutes Ago" Strings

Let's make this date dynamic! The field on `Question` that we're going to use is
`$askedAt`, which - remember - *might* be *null*. If a `Question` hasn't
been published yet, then it won't have an `askedAt`.

Let's plan for this. In the template, add `{% if question.askedAt %}` with an
`{% else %}` and `{% endif %}`. If the question is *not* published, say
`(unpublished)`.

In a real app, we would probably *not* allow users to see *unpublished* questions...
we could do that in our controller by checking for this field and saying
`throw $this->createNotFoundException()` if it's null. But... maybe a user will
be able to *preview* their *own* unpublished questions. If they did, we'll show
`unpublished`.

## The Twig date Filter

The easiest way to *try* to print the date would be to say `{{ question.askedAt }}`.
But... you might be shouting: "Hey Ryan! That's not going to work!".

And... you're right:

> Object of class `DateTime` could not be converted to string

We know that when we have a `datetime` type in Doctrine, it's stored in PHP
as a `DateTime` object. That's nice because `DateTime` objects are easy to work
with... but we can't simply print them.

To fix this, pass the `DateTime` object through a `|date()` *filter*. This takes
a format argument - something like `Y-m-d H:i:s`.

When we try the page now... it's technically *correct*... but yikes! This... well...
how can I put this politely: it looks like a backend developer designed this.

## KnpTimeBundle

Whenever I render dates, I like to make them relative. Instead of printing an
exact date, I prefer something like "10 minutes ago". It also avoids timezone
problems... because 10 minutes ago makes sense to everyone! But this exact date
would *really* need a timezone to make sense.

So let's do this. Start by adding the word "Asked" back before the date. Cool.

To convert the `DateTime` into a friendly string, we can install a nice bundle.
At your terminal, run:

```terminal
composer require knplabs/knp-time-bundle
```

You could find this bundle if you googled for "Symfony ago". As we know, the
*main* thing that a bundle gives us is more *services*. In this case, the bundle gives
us one main service that provides a Twig filter called `ago`.

It's pretty awesome. Back in the template, add `|ago`.

We're done! When we refresh now... woohoo!

> Asked 1 month ago

Next: let's make the homepage dynamic by querying for *all* of the questions in
the database and rendering them. Along the way, we're going to learn a *secret*
about the repository object.
