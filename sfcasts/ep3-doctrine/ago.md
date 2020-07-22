# "5 Minutes Ago" Strings

Let's make this date dynamic! The field on `Question` that we're going to use is
`$askedAt`, which - remember - *might* actually be *null*. If a `Question` hasn't
been published yet, then it won't have an `askedAt`.

Let's plan for this. In the template, add `{% if question.askedAt %}` with an
`{% else %}` and `{% endif %}`. If the question is *not* published, say
`(unpublished)`.

In a real app, we would probably *not* allow users to see *unpublished* questions...
we could do that in our controller by checking for this field and saying
`throw $this->createNotFoundException()` if it's null. But... maybe a user will
be able to *preview* their *own* unpublished question. If the did, we want to
show `unpublished`.

## The Twig date Filter

The easiest way to *try* to print the date would be to say `{{ question.askedAt }}`.
But... I'm sure many of you are thinking: "That's not going to work Ryan!".

And you're right:

> Object of class `DateTime` could not be converted to string

We know that when we have a `datetime` type in doctrine, it's stored in PHP
as a `DateTime` object. That's nice because `DateTime` objects are nice to work
with... but we can't simply print them.

So to fix this, pass the `DateTime` object through a `|date()` a *filter* and pass
it a format like `Y-m-d H:i:s`.

When we try the page now... it's technically *correct*... but yikes! That's...
not terribly friendly.

## KnpTimeBundle

Whenever I render dates, I like to make them relative. Instead of printing an
exact date, I prefer something like "10 minutes ago". It also avoids timezone
problems... because 10 minutes ago makes sense to everyone but *this* date would
*really* need a timezone to make sense.

So let's do this. Start by adding the word "Asked" back before the date. To convert
the `DateTime` into a friendly string, we can install a nice bundle. At your
terminal,
run:

```terminal
composer require knplabs/knp-time-bundle
```

You could find this bundle if you googled for "Symfony ago". Now, remember: the
*main* thing that bundles give is *services*. In this case, the bundle gives us
one main service that provides a twig filter called `ago`.

It's pretty awesome. Back in the template, add `|ago`.

And that's it. When we refresh now... woohoo!

> Asked 1 month ago


Next: let's make the homepage dynamic by querying for *all* of the questions in
the database.
