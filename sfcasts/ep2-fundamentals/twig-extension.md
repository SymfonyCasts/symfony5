# Making a Twig Extension (Filter)

When we installed `KnpMarkdownBundle`, it gave us a new service that we used to
parse markdown into HTML. But it did more than that. Open up
`templates/question/show.html.twig` and look down where we print out the answers.
Because, that bundle *also* gave us a service that provided a custom Twig filter.
We could suddenly say `{{ answer|markdown }}` and that would process the answer
through the markdown parser:

[[[ code('078c2fd158') ]]]

The only problem is that this doesn't use our caching system. We created our *own*
`MarkdownHelper` service to handle that:

[[[ code('d48ef36cf7') ]]]

It uses the markdown parser service but *also* caches the result. Unfortunately,
the `markdown` filter uses the markdown parser from the bundle directly and
skips our cool cache layer.

So. What we really want is to have a filter like this that, when used, calls *our*
`MarkdownHelper` service to do its work.

## make:twig-extension

Let's take this one piece at a time. First: how can we add custom functions or
filters to Twig? Adding features to Twig is work... so it should be *no* surprise
that we do this by creating a service. But in order for Twig to understand our
service, it needs to look a certain way.

MakerBundle can help us get started. Find your terminal and run:

```terminal
php bin/console make:
```

to see our list.

## Making the Twig Extension

Let's use `make:twig-extension`:

```terminal-silent
php bin/console make:twig-extension
```

For the name: how about `MarkdownExtension`. Ding! This created a new
`src/Twig/MarkdownExtension.php` file. Sweet! Let's go open it up:

[[[ code('2a0c6eb904') ]]]

Just like with our command, in order to hook into Twig, our class needs to
implement a specific interface or extend a specific base class. That helps tell
us what *methods* our class needs to have.

Right now, this adds a new filter called `filter_name` and a new function
called `function_name`:

[[[ code('b9d4f183e0') ]]]

Creative! If someone used the filter in their template, Twig would *actually*
call the `doSomething()` method down here and we would return the final value
after applying our filter logic:

[[[ code('99df9534e4') ]]]

## Autoconfigure!

And guess what? Just like with our command, Twig is *already* aware of our
class! To prove that, at your terminal, run:

```terminal
php bin/console debug:twig
```

And if we look up... there it is: `filter_name`. And the reason that Twig instantly
sees our new service is *not* because it lives in a `Twig/` directory. It's once
again thanks to the `autoconfigure` feature:

[[[ code('4a322986f6') ]]]

Symfony notices that it extends `AbstractExtension` from Twig:

[[[ code('9f5ae58087') ]]]

A class that *all* Twig extensions extend - and thinks:

> Oh! This must be a Twig extension! I'll tell Twig about it

***TIP
Technically, all Twig extensions must implement an `ExtensionInterface` and
Symfony checks for this interface for autoconfigure. The `AbstractExtension`
class implements this interface.
***

## Adding the parse_markdown Filter

This means that we're ready to work! Let's call the filter `parse_markdown`... so
it doesn't collide with the other filter. When someone uses this filter, I want
Twig to call a new `parseMarkdown()` method that we're going to add to this class:

[[[ code('ce1ccec669') ]]]

Remove `getFunctions()`: we don't need that.

Below, rename `doSomething()` to `parseMarkdown()`. And for now, just return
`TEST`:

[[[ code('eb99191359') ]]]

Let's do this! In `show.html.twig`, change to use the new `parse_markdown` filter:

[[[ code('10afd9ad37') ]]]

Moment of truth! Spin over to your browser and refresh. Our new filter *works*!

Of course, `TEST` isn't a *great* answer to a question, so let's make the Twig
extension use `MarkdownHelper`. Once again, we find ourselves in a familiar spot:
we're inside of a service and we need access to another service. Yep, it's dependency
injection to the rescue! Create the `public function __construct()` with one
argument: `MarkdownHelper $markdownHelper`. I'll hit `Alt`+`Enter` and go to
"Initialize properties" to create that property and set it below:

[[[ code('e1dd8e1e83') ]]]

Inside the method, thanks to our hard work of centralizing our logic into
`MarkdownHelper`, this couldn't be easier: return
`$this->markdownHelper->parse($value)`:

[[[ code('d059833a16') ]]]

`$value` will be whatever "thing" is being piped into the filter: the answer
text in this case.

Ok, it should work! When we refresh... hmm. It's parsing through Markdown but
Twig is output escaping it. Twig output escapes everything you print and we
fixed this earlier by using the `raw` filter to tell Twig to *not* do that.

But there's another solution: we can tell Twig that the `parse_markdown`
filter is "safe" and doesn't *need* escaping. To do that, add a 3rd argument to
`TwigFilter`: an array with `'is_safe' => ['html']`:

[[[ code('0b18e9d3ab') ]]]

That says: it is safe to print this value into HTML without escaping.

Oh, but in a real app, in `parseMarkdown()`, I would probably *first* call
`strip_tags` on the `$value` argument to remove any HTML tags that a bad user
may have entered into their answer there. *Then* we can safely use the final HTML.

Anyways, when we move over and refresh, it's *perfect*: a custom Twig filter
that parses markdown *and* uses our cache system.

Friends! You rock! Congrats on finishing the Symfony Fundamental course! This was
a lot of work and your reward is that *everything* else you do will make more sense
and take less time to implement. Nice job.

In the next course, we're going to *really* take things up to the next level by
adding a database layer so we can dynamically load *real* questions and real
answers. And if *you* have a real question and want a real answer, we're always
here for you down in the comments.

Alright friends - seeya next time!
