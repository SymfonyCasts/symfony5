# Creating a Service

Okay, so bundles give us services and services do work. So... if we needed to
write our *own* custom code that did work... can we create our own service class
and put the logic there? Absolutely! And it's something that you're going to do
*all* the time. It's a great way to organize your code, be able to reuse logic
*and* unit test your class if you want. So... let's do it!

We're *already* doing some work. It may not look like a lot, but the logic of
parsing the markdown *and* caching the result is a little bit of work. It would
be nice to move this into its *own* class. That would make the controller a bit
easier to read *and* we could re-use this markdown caching logic somewhere else
if we needed to, which we will later.

## Creating the Service

How do we create our own service? Start by creating a class anywhere in `src/`.
It doesn't matter where I'll create a new sub-directory called `Service/`, which
I often use when I can't think of a better directory to put my class in. Now
add a new PHP Class called, how about `MarkdownHelper`.

Cool! PhpStorm automatically added the correct namespace to the class. Thanks!

Unlike controllers, this class has *nothing* to do with Symfony... it's just a
class *we* are creating for our own purposes. And so, it doesn't need to extend
any base class or implement any interface: this class will look *however* we want.

Let's think: we're probably going to want a function called something like
`parse()`. It will need a `string` argument - let's call it `$source` - and it
will return a `string`, which will be the finished HTML.

Cool! Back in `QuestionController`, copy the three lines of logic and paste them
into the new method. Let's fix a few things: `return` the value... then change
`$questionText` to `$source` in three different places.

## Your Class is Already a Service! Use it!

We still have a few undefined variables... but... I want you to ignore them for
now. Because, congratulations! This method may not work yet, but you just created
your first service! Remember: a service is just a class that does work.

Ok, so, how can we use this inside our controller? We *already* know the answer.
If we need a service from the container, we need to add an argument with the right
type-hint. But... is our service class already... somehow in Symfony's container?
Let's find out! At your terminal, run:

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

And there it is! Why did we need this `--all` flag? Well, the mostly-true
explanation is that, to keep this list short, Symfony hides *your* services
from the list... because you already know they exist.

*Anyways*, yes! Our service is - *somehow* - already available in Symfony's
container. We'll learn *how* that happened later, but the important thing know
is that we can use the `MarkdownHelper` type-hint to get an instance of that
class.

Let's do it! Back in the controller, add a 4th argument:
`MarkdownHelper $markdownHelper`. Down below, say
`$parsedQuestionText = $markdownHelper->parse($questionText)`.

Let's try it! When we refresh... yea! Undefined variable coming from
`MarkdownHelper`! This *proves* that the service was autowired into the controller.
It might not work yet, but our service is alive!

Inside of `MarkdownHelper`, we're trying to use the cache and markdown parser
services... but we don't have access to those here. How can we get them?
The answer to that is dependency injection: of the most *fundamental* concepts
in Symfony... or really any object-oriented coding. Let's tackle it next!
