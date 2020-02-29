# Twig ❤️

Let's make our `show()` controller render some *real* HTML by using a template.
As *soon* as you want to render a template, you need to make your controller
extend `AbstractController`. Don't forget to let PhpStorm auto-complete this so
it adds the `use` statement.

Now, obviously, a controller doesn't *need* to extend this base class - Symfony
doesn't really care about that. *But*, you usually *will* extend `AbstractController`
for one simple reason: it gives us shortcut methods!

## Rendering a Template

The first useful shortcut method is `render`. We can say:
`return this->render()` and pass two arguments. The first is the filename of the
template: we can put anything here, but usually - because we value our
sanity - we name this after our controller: `question/show.html.twig`.

The second argument is an array of any variables that we want to pass into the
template. Eventually, we're going to query the database for a specific question
and pass that data into the template. Right now, let's fake it. I'll copy my
`ucwords()` line and delete the old code. Let's pass a variable into the template
called - how about, `question` - set to this string.

Pop quiz time! What do you think that `render()` method returns? A string?
Something else? The answer is: a `Response` object... with HTML inside. Because
remember: the *one* rule of a controller is that it must *always* return a
`Response`.

***TIP
A controller *can* actually return something *other* than a Response,
but don't worry about that right now... or maybe ever.
***

## Creating the Template

Anyways, let's go create that template! Inside `templates/`, create a `question`
sub-directory, then a new file called `show.html.twig`. Let's start simple:
an `<h1>` and then `{{ question }}` to render the question *variable*. And...
I'll put some extra markup below this.

## The 3 Syntaxes of Twig!

We *just* wrote our first Twig code! Twig is *super* friendly: it's a plain HTML
file until your write one of its *two* syntaxes.

The first is the "say something" syntax. Anytime you want to print something, use
`{{`, the thing you want to print, then `}}`. Inside the curly braces,
you're writing Twig code... which is a lot like JavaScript. This prints the
`question` variable. If we put quotes around it, it would print the *string*
`question`. And yea, you can do more complex stuff - like the ternary operator.
Again, it's *very* much like JavaScript.

The *second* syntax I call the "do something" syntax. It's `{%` followed by
whatever you need to do, like `if` or `for` to do a loop. We'll talk more about
this in a second.

And... that's it! You're either printing something with `{{` or *doing* something,
like an `if` statement, with `{%`.

Ok, *small* lie, there *is* a third syntax... but it's just comments: `{#`,
a comment... then `#}`.

Let's see if this works! Move over refresh and... got it! If you view the HTML
source, notice that there is *no* HTML layout yet. It's literally the markup
from our template and nothing else. We'll add a layout in a few minutes.

## Looping with the {% for Tag

Ok: we have a fake question. I think it deserves some fake answers! Back in the
controller, up in the `show()` action, I'm going to paste in three fake answers.
Again, once we talked about databases, we will query the database for these. But
this will work beautifully to start. Pass these into the template as a
*second* variable called `answers`.

Back in the template, how can we print those? We can't just say `{{ answers }}`...
because it's an array. What we *really* want to do is loop *over* that array and
print each individual answer. To do that, *we* get to use our first "do something"
tag! It looks like this: `{% for answer in answers %}`. And most "do something"
tags also have an end tag: `{% endfor %}`.

Let's surround this with a `ul` and, inside the loop, say `<li>` and
`{{ answer }}`.

I love that! Ok browser, reload! It works! I mean, it's so, *so*, ugly... but
we'll fix that soon.

## The Twig Reference: Tags, Filters, Functions

Head to https://twig.symfony.com. Twig is its own library with its *own*
documentation. There's a lot of good stuff here... but what I *really* love is
down here: the [Twig Reference](https://twig.symfony.com/doc/3.x/#reference).

See these "Tags" on the left? These are *all* of the "do something" tags that
exist. Yep, it will *always* be `{%` and then *one* of these words - like `for`,
`if` or `{% set`. If you try `{% pizza`, I'll think it's funny, but Twig will
yell at you.

Twig also has functions... like every language... and a cool feature called
"tests", which is a bit unique. These allow you to say things like:
`if foo is defined` or `if number is even`.

But the *biggest* and *coolest* section is for "filters". Filters are basically
functions... but more hipster. Check out the `length` filter. Filters work like
"pipes" on the command line: we "pipe" the `users` variable into the `length`
filter, which counts it. The value goes from left to right. Filters are really
functions... with a friendlier syntax.

Let's use this filter to print out the *number* of answers. I'll add some parenthesis,
then `{{ answers|length }}`. When we try that... super nice!

## Twig Template Inheritance: extends

At this point, you're *well* on your way to being a Twig pro. There's just *one*
last big feature we need to talk about, and it's a good one: template inheritance.

Most of our pages will share an HTML layout. Right now, we don't have *any*
HTML structure. To give it some, at the *top* of the template, add
`{% extends 'base.html.twig' %}`.

This tells Twig that we want to use this `base.html.twig` template as our layout.
This file is *super* basic right now, but it's *ours* to customize - and we will
soon.

But if you refresh the page... hide! Huge error!

> A template that extends another one cannot include content outside Twig blocks.

When you add `extends` to a template, you're saying that you want the content from
this template to go *inside* of `base.html.twig`. But... where? Should Twig put
it all the way on top? On the bottom? Somewhere in the middle? Twig doesn't
know!

I'm sure you already noticed these `block` things, like `stylesheets`, `title`
and `body`. Blocks are "holes" that a child template can put content *into*.
We can't *just* extend `base.html.twig`: we need to tell it which *block* the
content should go into. The `body` block is a perfect spot.

How do we do this? By *overriding* the block. Above the content add `{% block body %}`,
and after, `{% endblock %}`.

Try it now. It works! It doesn't look like much yet... because our base
layout is so simple, but if you check out the page source, we *do* have the basic
HTML structure.

## Adding, Removing, Changing Blocks?

By the way, these blocks in `base.html.twig` aren't special: you can rename them,
move them around, add more or remove some. The more blocks you add, the more
flexibility your "child" templates have to put content into different spots.

Most of the existing blocks are empty... but a block *can* define *default*
content... like the `title` block. See this `Welcome`? No surprise, that's the
current `title` of the page.

Because this is surrounded by a block, we can *override* that in any template.
Check it out: anywhere in `show.html.twig`, add `{% block title %}`, Question,
print the question, then `{% endblock %}`.

This time when we reload... we have a *new* title!

Ok, with Twig behind us, let's look at one of the *killer* features of Symfony...
and your new best friend for debugging: the Symfony profiler.
