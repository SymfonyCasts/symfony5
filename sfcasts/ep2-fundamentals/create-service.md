# Creating a Service

Okay, so bundles give us services and services do work. So... if we needed to
write our *own* custom code that did work... can we create our own service class
and put the logic there? Absolutely! And it's something that you're going to do
*all* the time. It's a great way to organize your code, gives you the ability
to re-use logic *and* allows you to write unit tests if you want. So...
let's do it!

We're *already* doing some work. It may not look like a lot, but the logic of
parsing the markdown and caching the result *is* work:

[[[ code('b13ac0fba9') ]]]

It would be nice to move this into its *own* class. That would make the controller
a bit easier to read *and* we could re-use this markdown caching logic somewhere
else if we needed to, which we will later.

## Creating the Service

So how do we create our very own service? Start by creating a class anywhere in
`src/`. It doesn't matter where but I'll create a new sub-directory called `Service/`,
which I often use when I can't think of a better directory to put my class in. Inside,
add a new PHP class called, how about `MarkdownHelper`:

[[[ code('0ec9620a24') ]]]

And cool! PhpStorm automatically added the correct namespace to the class. Thanks!

Unlike controllers, this class has *nothing* to do with Symfony... it's just a
class *we* are creating for our own purposes. And so, it doesn't need to extend
a base class or implement an interface: this class will look *however* we want.

Let's think: we're probably going to want a function called something like
`parse()`. It will need a `string` argument - how about `$source` - and it
will return a `string`, which will be the finished HTML:

[[[ code('ef6632a20c') ]]]

Nice! Back in `QuestionController`, copy the three lines of logic and paste them
into the new method. Let's fix a few things: `return` the value:

[[[ code('c8e70ee641') ]]]

then change `$questionText` to `$source` in three different places:

[[[ code('7e145b25e2') ]]]

## Your Class is Already a Service! Use it!

We still have a few undefined variables... but... I want you to ignore them for
now. Because, congratulations! This may not, ya know, "work" yet, but you just
created your first service! Remember: a service is just a class that does work.

Ok, so, how can we use this inside our controller? We *already* know the answer.
If we need a service from the container, we need to add an argument with the right
type-hint. But... is our service already... somehow in Symfony's container? Let's
find out! At your terminal, run:

```terminal
php bin/console debug:autowiring Markdown
```

Hmm, it only shows the two results from the bundle. But wait! At the bottom it
says:

> 1 more concrete service would be displayed when adding the `--all` option.

Um... ok - let's add `--all` to this:

```terminal-silent
php bin/console debug:autowiring Markdown --all
```

And there it is! Why did we need this `--all` flag? Well, the "mostly-true"
explanation is that, to keep this list short, Symfony hides *your* services
from the list... because you already know they exist.

*Anyways*, yes! Our service is - *somehow* - already available in Symfony's
container. We'll learn *how* that happened later, but the important thing now
is that we can use the `MarkdownHelper` type-hint to get an instance of our
class.

Let's do it! Back in the controller, add a 4th argument:
`MarkdownHelper $markdownHelper`:

[[[ code('49637fd406') ]]]

Down below, say `$parsedQuestionText = $markdownHelper->parse($questionText)`:

[[[ code('e159a88134') ]]]

Testing time! Refresh and... yea! Undefined variable coming from `MarkdownHelper`!
Woo! I'm happy because this *proves* that the service was autowired into the controller.
The method is blowing up... but our service is alive!

Inside of `MarkdownHelper`, we're trying to use the cache and markdown parser
services... but we don't have access to those here:

[[[ code('c89b8a9c11') ]]]

How can we get them? The answer to that is "dependency injection": a threatening-sounding
word for a delightfully simple concept. It's also one of the most *fundamental*
concepts in Symfony... or really any object-oriented coding. Let's tackle it next!
