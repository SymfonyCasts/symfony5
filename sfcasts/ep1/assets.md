# Assets: CSS, Images, etc

We're doing really well, but yikes! Our site is *ugly*. Time to fix that.

If you download the course code from this page, after you unzip it, you'll find
a `start/` directory with a `tutorial/` directory inside: the same `tutorial/`
directory you see here. We're going to copy a few files from it over the next
few minutes.

## Copying the Base Layout & Main CSS File

The first is `base.html.twig`. I'll open it up, copy its contents, close it,
and then open *our* `templates/base.html.twig`. Paste the new stuff here.

This was *not* a huge change: this added some CSS files - including Bootstrap -
and some basic HTML markup. But we have the same blocks as before:
`{% block body %}` in the middle, `{% block javascripts %}`,
`{% block title %}`, etc.

Notice that the link tags are *inside* a block called `stylesheets`. But that's
not important yet. I'll explain why it's done that way a bit later.

One of the link tags is pointing to `/css/app.css`. That's *another* file that
lives in this `tutorial/` directory. In fact, select the `images/` directory *and*
`app.css` and copy both. Now, select the `public/` folder and paste. Add another
`css/` directory and move `app.css` inside.

Remember: the `public/` directory is our document root. So if you need a file to
be accessible by a user's browser, it needs to live here. The path `/css/app.css`
will load this `public/css/app.css` file.

Let's see what this looks like! Spin over to your browser and refresh. *Much*
better. The middle still looks terrible... but that's because we haven't added
any markup to the template for this page.

## Does Symfony Care about your Assets

So let me ask a question... and answer a question: what features does Symfony
offer when it comes to CSS and JavaScript? The answer is... none... or a lot!

Symfony has two different levels of integration with CSS and JavaScript. Right
now, we're using the basic level. Really, right now, Symfony isn't doing *anything*
for us: we created a CSS file, then added a very traditional link tag to it in HTML.
Symfony is doing *nothing*: it's all up to you.

The *other*, *bigger* level of integration is to use something called Webpack
Encore: a *fantastic* library that handles minification, Sass support, React or
Vue.js support and many other things. I'll give you a crash course into Webpack
Encore at the end of this tutorial.

But right now, we're going to keep it simple: you create CSS or JavaScript files,
put them in the `public/` directory, and then create `link` or `script` tags that
point to them.

## The Not-So-Important asset() Function

Well, actually, even with this, "basic" integration, there is *one* small Symfony
feature you should use.

Before I show you, go into your PhpStorm preference... and search again for
"Symfony" to find the Symfony plugin. See this web directory option? Change that
to `public/` - this was called `web/` in older versions of Symfony. This will give
us better auto-completion soon. Hit "Ok".

Here's the deal: whenever you reference a static file on your site - like a CSS
file, JavaScript file or image, instead of just putting `/css/app.css`, you should
use a Twig function called `asset()`. So, `{{ asset() }}` and then the *same* path
as before, but without the opening `/`: `css/app.css`.

What does this super-cool-looking `asset()` function do? Almost... nothing. In
fact, this will output the *exact* same path as before: `/css/app.css`.

So why are we bothering to use a function that does nothing? Well, it *does*
do *two* things... which you may or may not care about. First, if you decide to
deploy your app to a *subdirectory* of a domain - like
`ILikeMagic.com/cauldron_overflow`, the `asset()` function will automatically
prefix all the paths with `/cauldron_overflow`. *Super* great... if you care.

The *second* thing it does is more useful: if you decide to deploy your assets
to a CDN, by adding one line to one config file, suddenly, Symfony will prefix
*every* path with the URL to your CDN.

So... it's really not *that* important, but if you use `asset()` everywhere, you'll
be happy later when you need it.

But... if we move over and refresh... surprise! It explodes!

> Did you forget to run `composer require symfony/asset`? Unknown function `asset`.

How cool is that? Remember, Symfony starts small: you install things *when* you
need them. In this case, we're trying to use a feature that's not installed... so
Symfony gives us the *exact* command we need to run. Copy it, move over and go:

```terminal
composer require symfony/asset
```

When this finishes... move back over and... it works. If you look at the HTML
source and search for `app.css`... yep! It's printing the same path as before.

## Making the "show" page Pretty

Let's make the middle of our page look a bit nicer. Back in the `tutorial/`
directory, open `show.html.twig`, copy its contents, close it, then open up our
version: `templates/question/show.html.twig`. Paste the new code.

Once again, there's nothing important happening here: we're still overriding the
same `title` and `body` blocks. We're still using the same `question` variable
and we're still looping over the `answers` down here. There's just a lot of extra
markup... which... ya know... makes things pretty.

When we refresh... see! Pretty! Back in the template, notice that this page
has a few `img` tags... but these are *not* using the `asset()` function. Let's
fix that. I'll use a shortcut! I can just type "tisha", hit tab and... boom!
It takes care of the rest. Search for `img`... and replace this one too with
"tisha". Wondering who tisha is? Oh, just one of the several cats we keep on staff
here at SymfonyCasts. This one manages Vladimir.

By the way, in a real app, instead of these images being static files in our
project, that might be files that users *upload*. Don't worry: we have an
entire tutorial on
[handling file uploads](https://symfonycasts.com/screencast/symfony-uploads).

Make sure this works and... it does.

## Styling the Homepage

The *last* page that we haven't styled is the homepage... which right now...
prints some text. Open its controller: `src/Controller/QuestionController.php`.
Yep! It's just `return new Response()` and text. We can do better. Replace this
with `return $this->render()`. Let's call the template `question/homepage.html.twig`.
And... right now... I don't think we need to pass any variables into the template...
so I'll leave the second argument off.

Inside `templates/question/`, create the new file: `homepage.html.twig`.

Most templates start the *exact* same way. Yay consistency! On top,
`{% extends 'base.html.twig' %}`, `{% block body %}` and `{% endblock %}`. In
between, add some markup so we can see if this is working.

Ok... refresh the page and... excellent! Except for the "this looks totally
awful" part.

Let's steal some code from the `tutorial/` directory *one* last time. Open
`homepage.html.twig`. This is *just* a bunch of hardcoded markup to make things
look nicer. Copy it, close that file... and then paste it over our
`homepage.html.twig` code.

And now... it looks *much* bettter.

So that's the *basic* CSS and JavaScript integration inside of Symfony: you manage
it yourself. Sure, you *should* use this `asset()` function, but it's not doing
anything too impressive.

If you want more, you're in luck! In the *last* chapter, we'll take our assets
up to the next level. You're going to love it.

Next: our site now has some links on it! And they all go nowhere! Let's learn how
to generate URLs to routes.
