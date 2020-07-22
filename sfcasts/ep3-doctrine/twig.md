# Entity objects in Twig

We *now* have a `Question` object inside of our controller. And at the bottom,
we render a template. What we need is *pass* that `Question` object *into* the
template and then use it on the page to print the name and the other info.

Remove the `dd()`, leave the `$answers` - we'll keep those hardcoded for now because
we don't have an `Answer` entity yet and then get rid of the hardcoded `$question`,
and `$questionText`.

Instead pass a `question` variable to Twig set to the `Question` object.

## Twig's Smart . Syntax

Let's go find that template: `templates/question/show.html.twig`. The `question`
variable is *no longer* a string: it's now an *object*. So... how do we render an
object? Because the `Question` class has a `name` property, we can say
`question.name` - it even auto-completes it for me! That doesn't always work in
Twig, but it's nice when it does.

Below... here's another one - `question.name` and `questionText` is now
`question.question`.

And... I think that's it! Testing time! Move over, go back to the *real* question
slug and... there it is! We have a real name and real question text. This date is
still hard coded, but we'll fix that in a minute.

Now, some of you *might* be thinking:

> How the heck did that work?

We said `question.name`... which makes it *look* like it's reading the *name*
property. But... if you look at the `name` property inside of the `Question`
entity... it's private! That means you *can't* access the `name` property directly.
What's going on?

We're witnessing some Twig magic. In reality, when we say `question.name`, Twig
first *does* look to see if the `name` property exists and is public. If it *were*
public, Twig would use it. But since it is not, Twig *then* tries to call a
`getName()` method. Yep, we write `question.name`, but, behind the scenes, Twig
is smart enough to call `getName()`.

I *love* this: it means you can run around saying `question.name` in your template
and not really worry about the details whether there's a getter method. That's
especially friendly to non-PHP frontend devs.

If you wanted to actually *call* a method - like `getName()` - that *is* allowed,
but it's usually unnecessary.

## The Doctrine Web Debug Toolbar

The one thing that we *did* lose is that, originally, the question text was being
parsed through markdown. We can fix that really easy by using the `parse_markdown`
filter that we created in the last tutorial.

Refresh and... it works.

You may not have noticed, but near the middle of the web debug toolbar, there's a
little database icon that says 1 database query. And we can click this icon to
jump into the profiler to see the *exact* query! If this page made multiple
queries, you would see *all* of them here.

If you ever want to debug a query directly, click "View runnable query" to get a
version that you can copy.

Now, here's a challenge: how could we see the `INSERT` query that's made when we
go to `/questions/new`? This *did* just make that query... but because we're not
rendering HTML, this doesn't have a web debug toolbar. This same problem happens
whenever you make an AJAX call.

So... are we out of luck? Nah - we can use a trick. Go to `/_profiler`. This shows
a list of the most recent requests we've made. Here's the one we just made to
`/question/new`. Click the little token string on the right to jump into the
*full* profiler for that request. Go to the "Doctrine" tab and... bam! And.. cool!
It even wraps the INSERT in a transaction.

Remember this trick the next time you want to see database queries, a rendered
version of an HTML error, or something else about an AJAX request.

Go back a few times to the question show page. The last piece of question data
that's hardcoded is this "asked 10 minutes ago" text. Search for it in the
template... there it is, line 18.

Next, let's make this dynamic. But, not by printing some boring date like
"July 4th and 10:30 EST". Yuck. Let's print a much-friendlier "10 minutes ago" type
of message.
