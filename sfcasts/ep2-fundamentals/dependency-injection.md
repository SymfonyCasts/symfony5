# Autowiring Dependencies into a Service

Our `MarkdownHelper` service is... sort of working. We can call it from the
controller... but inside, we're trying to use two services - cache and markdown
parser - that we don't have access to. How can we get those objects?

Real quick: I've said many times that there are service objects "floating
around" in Symfony. But even though that's true, you *can't* just grab them out
of thin air. There's no, like, `Cache::get()` static call or something that
will magically give us that object. And that's *good* - that's a recipe for writing
bad code.

## Passing Dependencies to the Method?

So how *can* we get access to services? Currently, we only know one way: by autowiring
them into our controller methods... which we can't do here, because that's a superpower
that *only* controllers have.

Hmm, but one idea is that we could *pass* the markdown parser and cache *from*
our controller *into* `parse()`. This won't be our *final* solution, but let's
try it!

On `parse()`, add two more arguments: `MarkdownParserInterface $markdownParser`
and `CacheInterface` - from `Symfony\Contracts` - `$cache`. Cool! This method
is happy.

Back in `QuestionController`, pass the two extra arguments: `$markdownParser` and
`$cache`.

Ok team - let's see if it works! Find your browser and refresh. It does!

## Method Arguments versus Class Dependencies

On a high level, this solution makes sense: since we can't grab service objects
out of thin air in `MarkdownHelper`, we *pass* them in. But, if you think about
it, the markdown parser and cache objects aren't really "input" to the `parse()`
function. What I mean is, the `$source` argument to `parse()` makes *total*
sense: when we call the method, we *of course* need to pass in the content
we want parsed.

But these next two arguments don't really control how the function behaves... you
would probably always pass these *same* values *every* time you called the method.
No, instead of function arguments, these objects are more *dependencies* that the
service needs in order to do its work. It's just stuff that *must* be available
so that `parse()` can do its job.

For *dependencies* like this - for service objects or configuration that your service
simply *needs*, instead of passing them through the individual methods, we instead
pass them through the *constructor*.

## Dependency Injection via the Constructor

At the top, create a new `public function __construct()`. Move the two arguments
here... and delete them from `parse()`.

Before we finish this, I need to tell you that autowiring in fact works in
*two* places. We already know that you can autowire services into your controller
methods. But you can *also* autowire services into the `__construct()` method of
a service. In fact, that is the *main* place where autowiring is meant to work.
The fact that autowiring *also* works for controller methods was... kind of an
added feature to make life easier. And it *only* works for controllers - you can't
add a `MarkdownParserInterface` argument to `parse()` and expect Symfony to autowire
that because *we* are the ones that are calling that method and passing it arguments.

*Anyways*, when Symfony instantiates `MarkdownHelper`, it will pass us these
two arguments thanks to autowiring. What do we... *do* with them? Create two private
properties: `$markdownParser` and `$cache`. Then, in the constructor, set those:
`$this->markdownParser = $markdownParser` and `$this->cache = $cache`.

Basically, when the object is instantiated, we're taking those objects and storing
them for later. Then, whenever we call `parse()`, the two properties will already
hold those objects. Let's use them: `$this->cache`, and then we don't need
to pass `$markdownParser` to the `use` because we can instead say
`$this->markdownParser`.

I love it! This class is now a *perfect* service: we add our dependencies to the
constructor, set them on properties, then use them below.

## Dependency Injection?

By the way, what we *just* did has a fancy name! Ooo. It's dependency injection. But
don't be too impressed: it's a simple concept. Whenever you're inside a service -
like `MarkdownHelper` - and you realize that you need something that you don't
have access to, you'll follow the *same* solution: add another constructor argument,
create a property, *set* that onto the property, then use it in your methods.
*That* is dependency injection. A *big* word to *basically* mean: if you need
something, don't expect to grab it out of thin air: force Symfony to pass it
*to* you by adding it to the constructor.

Phew! Back in `QuestionController`, we can celebrate by removing the two extra
arguments to `parse()`. And when we move over and refresh... it works!

If this didn't feel *totally* comfortable yet, don't worry. The process of creating
services is something that we're gonna to do over and over again. The benefit is
that we now have a beautiful service - a tool - that we can use from anywhere in
our app. We pass it the markdown string and it takes care of the caching and
markdown processing.

Heck, in `QuestionController`, we don't even need the `$markdownParser` and
`$cache` arguments to the `show()` method! Remove them and, on top
of the class, even though it doesn't hurt anything, let's delete the two `use`
statements.

Next: the service container holds services! That's true! But it *also* holds
something else: scalar configuration.
