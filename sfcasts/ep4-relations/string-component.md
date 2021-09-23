# The |u Filter & String Component

The questions on this page are *way* too long. We need to shorten them!

But before we do, this `answer.question.question` thing is bothering me: it looks...
kind of confusing. Let's make this more clear by adding a custom method to our `Answer`
class.

## Adding Answer::getQuestionText() for Clarity

Open `src/Entity/Answer.php`. It doesn't matter where... but right by
`getQuestion()` makes sense, add a new method: public function `getQuestionText()`,
which will return a `string`.

On a high level, this method makes me happy! If I have an `Answer` object, there's
a good chance that I might want to easily get the question text *related* to this
answer. Inside, I'll start by coding defensively: if not `$this->getQuestion()` -
so if there is *no* related `Question` object, return empty quotes.

Now, you might be screaming:

> Hey Ryan! I thought the question property was required in the database! How
> could we *not* have a question?

And... that's mostly right! We can't *save* an `Answer` to the database without a
`Question`. But, in theory, we *could* create a new `Answer` object and call
`getQuestionText()` on it *before* even *trying* to save it. To avoid an error
if we did that, I'm coding defensively.

At the bottom, return `$this->getQuestion->getQuestion()`... but cast that to a
`string`, just in case it's `null`... which, again, isn't likely since that property
is required in the database, but it *is* technically possible.

Thanks to the new method, over in `_answer.html.twig`, we can change this to
`{{ answer.questionText }}`.

*So* much nicer. But... the front-end still looks weird. So let's shorten the
question string!

## Twig's "u" Filter & the String Component

In Twig, we have a special filter called `|u`. This filter leverages Symfony's
`string` component to give you what's called a `UnicodeString` object. It's
basically an object that *wraps* this string... and gives you access to a bunch
of useful methods. One of those methods is called `truncate()`. This means we can
say `.truncate()`. Pass this 80 and `'...`.

So *if* the string is longer than 80 characters, truncate it and add a `...` to
the end. I love it!

Before we try this, search for "Symfony string component" to find its
documentation. If you scroll down... you'll see a bunch of examples of what
you can do - in PHP - with the string component. This `u()` function in PHP creates
the same thing as our `|u` filter. Down here, you can see a ton of examples
of what you can do - like lower-casing, title-casing, camel-casing... and a lot
more... *including* a `truncate()` method. So if you *ever* need to mess around
with strings - in Twig or PHP - don't forget about this component!

But... if we try this... it doesn't actually work! It says:

> the `u` filter is part of the `StringExtension`... try running
> `composer require twig/string-extra`.

No problem! Find your terminal and run that:

```terminal
composer require twig/string-extra
```

When it finishes... we can now refresh and see... awesome! We have truncated
questions!

But look down at the web debug toolbar. This page made 8 queries... which seems
like a lot just to render 10 answers. This is because we're suffering from the
the N+1 query problem.

Next, let's learn more about this and see how we can join across a relationship
to solve it.
