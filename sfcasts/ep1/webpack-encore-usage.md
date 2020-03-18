# Webpack Encore: JavaScript Greatness

Okay: here's how this whole thing works. The recipe added a new `assets/` directory
with a couple of example CSS and JS files. The `app.js` file basically just
`console.log()`'s something:

[[[ code('c6a71046c8') ]]]

The `app.css` changes the background color to light gray:

[[[ code('f43de8ec0a') ]]]

Webpack Encore is entirely configured by one file: `webpack.config.js`:

[[[ code('6f832a3e78') ]]]

We won't talk much about this file - we'll save that for the Encore tutorial - but 
it's already configured to *point* at the `app.js` and `app.css` files: it knows that
it needs to process them.

## Running Encore

To execute Encore, find your terminal and run:

```terminal
yarn watch
```

This is a shortcut for running `yarn run encore dev --watch`. What does this do?
It reads those 2 files in `assets/`, does some processing on them, and outputs
a *built* version of each inside a new `public/build/` directory. Here is the
"built" `app.css` file... and the built `app.js` file. If we ran Encore in production
mode - which is just a different command - it would *minimize* the contents of
each file.

## Including the Built CSS and JS Files

There's a lot more cool stuff going on, but this is the basic idea: we code in
the `assets/` directory, but point to the *built* files in our templates.

For example, in `base.html.twig`, instead of pointing at the old `app.css` file,
we want to point at the one in the `build/` directory. That's simple enough,
but the WebpackEncoreBundle has a shortcut to make it even easier:
`{{ encore_entry_link_tags() }}` and pass this `app`, because that's the name
of the source files - called an "entry" in Webpack land.

[[[ code('5b5d122a07') ]]]

At the bottom, render the script tag with `{{ encore_entry_script_tags('app') }}`.

[[[ code('b39b2c4f5f') ]]]

Let's try it! Move over and refresh. Did it work? It did! The background color
is gray... and if I bring up the console, there's the log:

> Hello Webpack Encore!

If you look at the HTML source, there's nothing special going on: we have a
normal link tag pointing to `/build/app.css`.

## Moving our Code into Encore

Now that this is working, let's move *our* CSS into the new system. Open
`public/css/app.css`, copy all of this, then right click and delete the file.
Now open the *new* `app.css` inside `assets/` and paste.

[[[ code('1fcae3bccb') ]]]

As *soon* as I do that, when I refresh... it works! Our CSS is back! The reason
is that - if you check your terminal - `yarn watch` is *watching* our files for
changes. As *soon* as we modified the `app.css` file, it re-read that file and
dumped a new version into the `public/build` directory. That's why we keep this
running in the background.

Let's do the same thing for our custom JavaScript. Open `question_show.js` and,
instead of having a page-specific JavaScript file - where we only include this on
our "show" page - to keep things simple, I'm going to put this into the new `app.js`,
which is loaded on *every* page.

[[[ code('d32dc534aa') ]]]

Then go delete the `public/js/` directory entirely... and `public/css/`. Also
open up `templates/question/show.html.twig` and, at the bottom, remove the old
script tag.

[[[ code('72d626d0d5') ]]]

With any luck, Encore *already* rebuilt my `app.js`. So if we click to view a
question - I'll refresh just to be safe - and... click the vote icons. Yes!
This still works.

## Installing & Importing Outside Libraries (jQuery)

Now that we're using Encore, there are some *really* cool things we can do.
Here's one: instead of linking to a CDN or downloading jQuery directly into our
project and committing it, we can *require* jQuery and install it into our
`node_modules/` directory... which is *exactly* how we're used to doing things
in PHP: we install third-party libraries into `vendor/` instead of downloading
them manually.

To do that, open a new terminal tab and run:

```terminal
yarn add jquery --dev
```

This is equivalent to the `composer require` command: it adds `jquery` to the
`package.json` file and downloads it into `node_modules/`. The `--dev` part is not
important.

Next, inside `base.html.twig`, remove jQuery entirely from the layout. 

[[[ code('09aa8d7543') ]]]

If you go back to your browser and refresh the page now... it's totally broken:

> $ is not defined

...coming from `app.js`. That makes sense: we *did* just download jQuery into our
`node_modules/` directory - you can find a directory here called `jquery` - but
we're not *using* it yet.

How do we use it? Inside `app.js`, uncomment this import line: 
`import $ from 'jquery'`. 

[[[ code('78bf71af69') ]]]

This "loads" the `jquery` package we installed and *assigns* it to a `$` variable. 
All these `$` variables below are referencing the value we imported.

Here's the *really* cool part: without making *any* other changes, when we refresh,
it works! Webpack *noticed* that we're importing `jquery` and automatically
packaged it *inside* of the built `app.js` file. We import the stuff we need,
and Webpack takes care of... packaging it all together.

***TIP
Actually, Webpack splits the final files into multiple for efficiency. jQuery
actually lives inside a different file in public/build/, though that doesn't matter!
***

## Importing the Bootstrap CSS

We can do the same thing for the Bootstrap CSS. On the top of `base.html.twig`,
delete the `link` tag for Bootstrap:

[[[ code('d084eb8896') ]]]

No surprise, when we refresh, our site looks terrible.

To fix it, find your terminal and run:

```terminal
yarn add bootstrap --dev
```

This downloads the `bootstrap` package into `node_modules/`. This package
contains *both* JavaScript and CSS. We want to bring in the CSS.

To do that, open `app.css` and, at the top, use the good-old-fashioned
`@import` syntax. Inside double quotes, say `~bootstrap`:

[[[ code('01ba1837f0') ]]]

In CSS, this `~` is a special way to say that you want to load the CSS from 
a `bootstrap` package inside `node_modules/`.

Move over, refresh and... we are back! Webpack saw this import, grabbed the
CSS from the bootstrap package, and included it in the final `app.css` file.
How cool is that?

## What Else can Encore Do?

This is just the start of what Webpack Encore can do. It can also
minimize your files for production, supports Sass or LESS compiling, comes with
React and Vue.js support, has automatic filename versioning and more.
To go further, check out our free
[Webpack Encore tutorial](https://symfonycasts.com/screencast/webpack-encore).

And... that's it for this tutorial! Congratulations for sticking with me to the
end! You already understand the most important parts of Symfony. In the next
tutorial, we're going unlock even *more* of your Symfony potential by uncovering
the secrets of services. You'll be unstoppable.

As always, if you have questions, problems or have a really funny story - especially
if it involves your cat - we would *love* to hear from you in the comments.

Alright friends - seeya next time!
