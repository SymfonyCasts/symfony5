# KnpMarkdownBundle & Service

Fun fact! Witches & wizards *love* writing markdown. I have no idea why... but
we're going to give our customers what they want: we're going to allow the question
text to be written in Markdown. We'll focus on this "show" page.

To do that, open up `QuestionController` and find the `show()` method. Let's see,
this renders `show.html.twig`... open up that template... and find the question
text. Here it is. Because we don't have a database yet, the question is hardcoded
right here. Let's move this text into our controller so we can write some code to
transform it from Markdown to HTML.

Copy the question text, delete it, and, in the controller, let's make a new
variable: `$questionText =` and paste. Pass this to the template as a new
`questionText` variable. Perfect! Back in `show.html.twig`, print that:
`{{ questionText }}`. Oh, and to make things a bit more interesting, let's add
some markdown formatting - how about `**` around "adorable".

Ok, if we refresh the page now... no surprise - it literally prints `**adorable**`.

Now, transforming text from Markdown into HTML is clearly "work"... and we know
that all work in Symfony is done by a service. At your terminal, who knows - let's
see if Symfony has any services that parse markdown. Run:

```terminal
php bin/console debug:autowiring markdown
```

## Installing KnpMarkdownBundle

No such luck! And that makes sense: Symfony starts small, but makes it easy to
add more stuff. Since I don't want to write a markdown parser by hand - that would
be *crazy* - let's find something that can help us! Google for `KnpMarkdownBundle`
and find its GitHub page. This isn't the only bundle that can parse markdown, but
it's a good one. My *hope* is that it will add a service to our app that can handle
all the markdown parsing for us.

Copy the composer require, find your terminal and paste:

```terminal
composer require knplabs/knp-markdown-bundle
```

This installs and... it configured a recipe! Run:

```terminal
git status
```

It, of course, updated the files we expect: `composer.json`, `composer.lock`
and `symfony.lock`. But it *also* update `config/bundles.php`! Check it out: we
have a new line at the bottom that initializes our new bundle.

## Finding the new Service

Ok, so if the *main* purpose of a bundle is to give us more services... then we
*probably* have at least one new one! Find your terminal and run
`debug:autowiring markdown` again:

```terminal-silent
php bin/console debug:autowiring markdown
```

Yes! There are *two* services. Well actually, both of these interfaces are a way
to get the *same* service object. See this little blue text - `markdown.parser.max`?
We'll talk more about this later, but each "service" in Symfony has a unique "id".
This service's unique id is apparently `markdown.parser.max` and we can get it by
using either type-hint.

It doesn't really matter which one we use, but if you check back on the bundle's
documentation... they use `MarkdownParserInterface`.

Let's do it! In `QuestionController::show` add a second argument:
`MarkdownParserInterface $markdownParser`. Down below, let's say
`$parsedQuestionText = $markdownParser->`. And we don't even need to look at
documentation to see what methods this object has. Thanks to the type-hint,
PhpStorm tells us: `transformMarkdown($questionText)`. Now, pass *this* variable
into the template.

## Twig Output Escaping: The "raw" Filter

Love it! Does it work? Who knows? Move over and refresh. It... sorta works! But
it's dumping out the HTML tags! The reason... is *awesome*. If you inspect the
HTML... here we go. Twig is using `htmlentities` to output escape the text. Twig
does that automatically for security: it protects against XSS attacks - that's when
users try to enter HTML for a question so that it will render in your site. In this
case, we *do* want to allow HTML because it's coming from our Markdown process. To
tell Twig to *not* escape, we can use a special filter `|raw`.

By the way, in a real app, because the question text *will* be entered by users
we don't trust, we would need to do a bit more work to prevent these XSS attacks.
I'll mention how later.

Anyways, now when we refresh... it works! It's subtle, but that word is now bold.

## The twig:debug Command

By the way, you can *of course* read the Twig documentation to learn that this
`raw` filter exists. But Symfony *also* has a command that will tell you *everything*
Twig can do. At your terminal, run:

```terminal
php bin/console debug:twig
```

How cool is this? This shows us the Twig "tests", filters, functions - everything
Twig can do in our app. Here is the `raw` filter.

## The markdown Twig Filter

And... oh! Apparently there's a filter called `markdown`! If you go back to the
bundle documentation and search for `|markdown`... yeah!This bundle *also* gives
us a Twig `markdown` filter. Cool!

So, in addition to the `MarkdownParserInterface` service, this bundle *also*
apparently gave us another service that added this `markdown` filter. At the
end of the tutorial, we'll even learn how to add our *own* custom filters.

This filter is *immediately* useful because we might also want to process the
*answers* through Markdown. We could do that in the controller, but it would
be *much* easier in the template. I'll add some "ticks" around the word "purrrfectly".

Then, in `show.html.twig`, scroll down to where we loop over the answers. Here,
say `answer|markdown`. And because answers will eventually be added by users
we don't trust, in a real app, I would use `answers|striptags|markdown`. Cool, right?
That removes an HTML added by the user and *then* processes it through Markdown.

Anyways, let's try it! Refresh and... got it! This filter is smart enough to
automatically *not* escape the HTML - so we don't need the `|raw`.

Next: I'm *loving* this idea of finding new tools, I mean *services*, and seeing
what we can do with them. Let's find another service that's *already* in our app:
a caching service. Because parsing Markdown on *every* request can slow down our
app.
