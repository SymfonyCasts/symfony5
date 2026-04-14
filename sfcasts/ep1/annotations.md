# Annotation & Wildcard Routes

Creating a route in YAML that points to a controller function is pretty simple.
But there's an even *easier* way to create routes... and I *love* it. It's called:
annotations.

First, comment-out the YAML route. Basically, remove it entirely. To prove it's
not working, refresh the homepage. Yep! It's back to the welcome page.

[[[ code('6249b6bc32') ]]]

## Installing Annotations Support

Annotations are a special config format... and support for annotations is *not*
something that comes standard in our tiny Symfony app. And... that's fine! In
fact, that's the *whole* philosophy of Symfony: start small and add features when
you need them.

To add annotations support, we'll use Composer to require a new package. If you
don't have Composer installed already, go to https://getcomposer.org.

Once you *do*, run:

```terminal
composer require "annotations:<6.2.10"
```

If you're familiar with composer, that package name might look strange. And
in reality, it installed a totally *different* package:
`sensio/framework-extra-bundle`. Near the bottom of the command, it mentions
something about two recipes. We'll talk about what's going on soon:
it's part of what makes Symfony special.

## Adding a Route Annotation

Anyways, now that annotations support is installed, we can re-add our route via
annotations. What does that mean? Above your controller function, say `/**` and
hit enter to create a PHPDoc section. Then say `@Route` and auto-complete the one
from the Routing component. Just like before, PhpStorm added the `use` statement
at the top of the class automatically.

Inside the parentheses, say `"/"`.

[[[ code('8f140f527a') ]]]

That's it! When the user goes to the homepage, it will execute the function
right below this. I *love* annotations because they're simple to read and keep
the route and controller right next to each other. And yes... annotations are
*literally* configuration inside PHP comments. If you don't like them, you can
always use YAML or XML instead: Symfony is super flexible. From a performance
standpoint, all the formats are the same.

Now when we refresh the homepage... we're back!

## A Second Route and Controller

This page will eventually list some recently-asked questions. When you click
on a specific question, it will need its *own* page. Let's create a second route
and controller for that. How? By creating a second method. How about:
`public function show()`. 

[[[ code('fe1ec280ee') ]]]

Above this, add `@Route()` and set the URL to, how about,
`/questions/how-to-tie-my-shoes-with-magic`. That would be awesome!

[[[ code('6a6c0c73d5') ]]]

Inside, just like last time, return a new `Response`: the one from `HttpFoundation`.

> Future page to show a question

[[[ code('7b17b4ef63') ]]]

Let's try it! Copy the URL, move over to your browser, paste and... it works!
We just created a *second* page... in less than a minute.

## The Front Controller: Working Behind-the-Scenes

By the way, no matter what URL we go to - like this one or the homepage - the
PHP file that our web server is executing is `index.php`. It's as *if* we are going
to `/index.php/questions/how-to-tie-my-shoes-with-magic`. The only reason you
don't *need* to have `index.php` in the URL is because our local web server
is configured to execute `index.php` automatically. On production, your Nginx
or Apache config will do the same. Check the Symfony docs to learn how.

## A Wildcard Route

Eventually, we're going to have a database *full* of questions. And so, no, we
are *not* going to manually create one route per question. Instead, we can make
this route smarter. Replace the `how-to-tie-my-shoes-with-magic` part with
`{slug}`.

When you have something between curly braces in a route, it becomes a *wildcard*.
This route now matches `/questions/ANYTHING`. The name `{slug}` is not important:
we could have used anything... like `{slugulusErecto}`! That makes no difference.

But *whatever* we call this wildcard - like `{slug}` - we are now *allowed* to
have an argument to our controller with the same *name*: `$slug`... which will
be set to whatever that part of the URL is.

[[[ code('d16dfb89a7') ]]]

Let's use that to make our page fancier! Let's use `sprintf()`, say "the"
question and add a `%s` placeholder. Pass `$slug` for that placeholder.

[[[ code('4b1f6f7659') ]]]

Sweet! Move over, refresh and... love it! Change the URL to
`/questions/accidentally-turned-cat-into-furry-shoes` and... that works too.

In the future, we'll use the `$slug` to query the database for the question. But
since we're not there yet, I'll use `str_replace()` ... and `ucwords()` to make
this *just* a little more elegant. It's still early, but the page is *starting*
come alive!

[[[ code('497e56f24a') ]]]

Next, our new app is hiding a secret! A little command-line executable that's
*filled* with goodies.
