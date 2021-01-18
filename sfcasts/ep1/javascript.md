# JavaScript, AJAX & the Profiler

Here's our next goal: write some JavaScript so that that when we click the up or
down vote icons, it will make an AJAX request to our JSON endpoint. This "fakes"
saving the vote to the database and returns the new vote count, which we will
use to update the vote number on the page.

## Adding js- Classes to the Template

The template for this page is: `templates/question/show.html.twig`. For each
answer, we have these `vote-up` and `vote-down` links. I'm going to add a
few classes to this section to help our JavaScript. On the `vote-arrows` element,
add a `js-vote-arrows` class: we'll use that in JavaScript to find this element.
Then, on the `vote-up` link, add a data attribute called `data-direction="up"`.
Do the same for the down link: `data-direction="down"`. This will help us know
which link was clicked. Finally, surround the vote number - the 6 - with a span
that has another class: `js-vote-total`. We'll use that to find the element so
we can update that number.

[[[ code('096aba564c') ]]]

## Adding JavaScript inside the javascripts Block.

To keep things simple, the JavaScript code we are going to write will use jQuery.
In fact, *if* your site uses jQuery, you *probably* will want to include jQuery
on *every* page... which means that we want to add a `script` tag to
`base.html.twig`. At the bottom, notice that we have a block called `javascripts`.
Inside this block, I'm going to paste a `<script>` tag to bring in jQuery from
a CDN. You can copy this from the code block on this page, or go to jQuery to
get it.

***TIP
In new Symfony projects, the `javascripts` block is at the top of this file - inside the `<head>` tag.
You can keep the `javascripts` block up in `<head>` or move it down here. If you
keep it up inside `head`, be sure to add a `defer` attribute to every `script` tag:
this will cause your JavaScript to be executed *after* the page loads.
***

[[[ code('dfaa4f6a88') ]]]

If you're wondering *why* we put this inside of the `javascripts` block... other
than it "seems" like a logical place, I'll show you why in a minute. Because
*technically*, if we put this *after* the `javascripts` block or before, it would
make no difference right now. But putting it inside will be useful soon.

For our custom JavaScript, inside the `public/` directory, create a new
directory called `js/`. And then a new file: `question_show.js`.

Here's the idea: usually you will have some custom JavaScript that you want to
include on every page. We don't have any right now, but if we *did*, I would
create an `app.js` file and add a `script` tag for it in `base.html.twig`. Then,
on certain pages, you might *also* need to include some page-specific JavaScript,
like to power a comment-voting feature that only lives on one page.

That's what I'm doing and that's why I created a file called `question_show.js`:
it's custom JavaScript for that page.

Inside `question_show.js`, I'm going to paste about 15 lines of code. 

[[[ code('8ce718cf9e') ]]]

This finds the `.js-vote-arrows` element - which we added here - finds any `a` 
tags inside, and registers a `click` listener on them. On click, we make 
an AJAX request to `/comments/10` - the 10 is hardcoded for now - `/vote/` 
and then we read the `data-direction` attribute off of the anchor element 
to know if this is an `up` vote or `down` vote. On success, jQuery passes us 
the JSON data from our endpoint. Let's rename that variable to `data` 
to be more accurate.

[[[ code('b564ad8fa7') ]]]

Then we use the `votes` field from the data - because in our controller we're
returning a `votes` key - to update the vote total.

## Overriding the javascripts Block

So... how do we include this file? If we wanted to include this on *every* page,
it would be pretty easy: add another script tag below jQuery in `base.html.twig`.
But we want to include this *only* on the show page. This is where having the jQuery
script tag inside of a `javascripts` block is handy. Because, in a "child" template,
we can *override* that block.

Check it out: in `show.html.twig`, it doesn't matter where - but let's go to
the bottom, say `{% block javascripts %} {% endblock %}`. Inside, add a
`<script>` tag with `src=""`. Oh, we need to remember to use the `asset()`
function. But... PhpStorm is suggesting `js/question_show.js`. Select that.
Nice! It added the `asset()` function for us.

[[[ code('ebeb877032') ]]]

If we stopped now, this would literally *override* the `javascripts` block of
`base.html.twig`. So, jQuery would not be included on the page. Instead of
*overriding* the block, what we *really* want to do is add *to* it! In the final
HTML, we want our new `script` tag to go right *below* jQuery.

How can we do this? Above our script tag, say `{{ parent() }}`.

[[[ code('9e813983d0') ]]]

I love that! The `parent()` function gets the content of the *parent* block,
and prints it.

Let's try this! Refresh and... click up. It updates! And if we hit down, we see
a really low number.

## AJAX Requests on the Profiler

Oh, and see this number "6" down on the web debug toolbar? This is really cool.
Refresh the page. Notice that the icon is *not* down here. But as soon as our
page makes an AJAX requests, it shows up! Yep, the web debug toolbar *detects*
AJAX requests and lists them here. The *best* part is that you can use this to
jump into the *profiler* for any of these requests! I'll right click and open this
"down" vote link in a new tab.

This is the *full* profiler for that request in all its glory. If you use
`dump()` somewhere in your code, the dumped variable for that AJAX requests will
be here. And later, a database section will be here. This is a *killer* feature.

Next, let's tighten up our API endpoint: we shouldn't be able to make a GET
request to it - like loading it in our browser. And... do we have anything that
validates that the `{direction}` wildcard in the URL is either `up` or `down` but
nothing else? Not yet.
