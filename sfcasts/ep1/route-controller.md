# Route, Controllers & Responses!

The page we're looking at right now... which is super fun... and even changes colors
is *just* here to say "Hello!". Symfony is rendering this because, in reality, our
page doesn't have *any* pages configured yet. Let's change that.

## Route + Controller = Page

Every web framework... in *any* language... has the same main job: to give you a
route & controller system - a system to build pages. A route defines the URL of
your page and the controller is where we write PHP code to *build* that page, like
HTML or JSON.

Open up `config/routes.yaml`. Hey! We already have an example! Uncomment that.
If you're not familiar with the YAML format, it's super friendly: it's a key-value
config format separated by colons and indentation is important.

This creates a single route whose URL is `/`. The controller points to a *function*
that will build the page... really, it points to a method on a class. Put together
this route says:

> when the user goes to the homepage, please execute the `index` method on the
> `DefaultController` class.

You can ignore the `index` key - that's an internal name for the route, and it's
not important yet.

## Our App

The project we're building is called "Cauldron Overflow". We *originally* wanted
to create a site where developers could ask questions and other people answered
them but... someone beat us to it... by about 10 years. So like all smart startups,
we're pivoting! We've noticed a lot of wizards accidentally blowing themselves up...
or conjuring fire-breathing dragons when they meant to create, well, just a small
fire. And so... Cauldron Overflow is here to help: becoming *the* place for witches
and wizards to ask and answer questions about magical misadventures.

## Creating a Controller

On the homepage, we will eventually show some of the most popular questions. So
let's change the controller class to `QuestionController` and the method to
`homepage`.

Ok, route done! It defines the URL and points to the controller that will build
the page. Now... we need to create that! Inside the `src/` directory, there is
already a `Controller/` directory... but it's empty. I'll right click on this
and select "New PHP class". Call it `QuestionController`.

## Namespaces & the src/ Directory

But wait! Check this out. It pre-filled the *namespace*. That's awesome! And this
was thanks to the Composer PhpStorm configuration we did in the last chapter.

Here's the deal: every class we create in the `src/` directory will need a namespace.
And... for reasons that aren't important yet, the namespace must be `App\` followed
whatever directory the file lives in. Because we're creating this file in the
`Controller/` directory, its namespace should be `App\Controller`. PhpStorm will
pre-fill this every time.

Perfect! Now, because in `routes.yaml`, we decided to call the method `homepage`,
create that here: `public function homepage()`.

And.. congratulations! You are now inside of a controller function, which is also
sometimes called an "action"... to confuse things. Our job here is simple: to build
the page. We can write *any* code we need to do that - like to make database queries,
cache things, perform API calls... whatever. The *only* rule is that a controller
function *must* return a Symfony `Response` object.

Say `return new Response()`. PhpStorm tries to auto-complete this... but there
are *multiple* `Response` classes in our app. The one we want is from
`Symfony\Component\HttpFoundation`. HttpFoundation is one of the most important
parts - or "components" in Symfony. Hit tab to auto-complete it.

But stop! Did you see that? Because we let PhpStorm auto-complete that class for
us, it wrote `Response`, but it *also* added the use statement for this class at
the top of the file! That is one of the *best* features of PhpStorm and I'm going
to use it a *lot*. You will *constantly* see me type a class and allow PhpStorm
to auto-complete it so that it will add the `use` statement to the top of the file
for me.

Inside `new Response()`, add some text:

> What a bewitching controller we have conjured!

And... done! We just created our first page! Let's try it! When we go to the
homepage, it should execute our controller function... which returns the message.

Find your browser. We're already on the homepage... so just refresh. Say hello to
our *very* first page. I know, it's not much to look at yet, but we've already
covered the most *foundational* part of Symfony: the route and controller system.

Next, let's make our route fancier by using something called annotations. We'll
also create a second page with a route that matches a wildcard path.
