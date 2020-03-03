# Assets

Coming soon...

We're doing really well, but yikes. This site is ugly time to fix that. So if you
download the course code, if you download the course code, you'll find a `start/`
directory that has a `tutorial/` director, the same editorial director you see here.
We're going to copy a couple of files out of this during this chapter. The first one
is `base.html.twig`. I'm going to open up this one, copied it, close this
bile, and then let's go into our `templates/base.html.twig`, which is
really basic and paste. Now first not, it wasn't a huge change. This basically does
brought in some CSS including `bootstrap.css` and then added some very light, a
markup to our page. But you see we still have the same bodies blocked body in the
middle and a couple other blocks like `{% block javascripts %}` and um, `{% block title %}` and a few
minutes.

I'm going to explain why this, the style sheets went inside the style sheets block.
Um, specifically this reference is known as an `app.css` file that's also inside
of this `tutorial/` directory. In fact, I'm going to copy about the `images/` directory and
`app.css` copy those. Go into `public/` and paste. I remember the `public/` directory
is our document root. So if we want this to be accessible, Oh, I run and then his
other `public/` directory, I'm going to create a `css/` directory and then move the 
`app.css` inside of there. Now remember the public directory is our document root. So if we
want something to be publicly accessible by the browser, we need to put it inside the
`public/` directory. So `/css/app.css` is going to reference `css/app.css`.

So we spent over now and refresh, ah, much better. I mean the middle still looks
terrible, but that's because we haven't added any markup to our specific page. Now as
you can kind of tell so far, it looks like Symfony doesn't care about your CSS and
JavaScript at all. We just created a CSS file here and we added a very boring link
tag to it and it's working. And in reality, Symfony has two different levels of
intake, of two different ways that I can help you with your CSS. The first way is
very small and I'm going to show you that first. The second way is much bigger and
much more helpful and it's called a Webpack Encore and it's something we'll talk
about at the end of the Dettori.

So in the simpler integration, the simple integration basically looks like this. You
create CSS files, create JavaScript files, put them in `public/` directory, and then
create link tags or script tags to them. That's basically it except for one small
detail. Before I show you, I want you to go into your PHP storm settings. Search for
Symfony once again so we can find the Symfony plugin and you see this web director
here, change that to `public`. That's going to help us with a shortcut in a second. In
older versions, Symfony used to be called `web`, so it still said `web`. There I'm to
hit, okay, now here's the, here's the thing that Symfony wants you to do. Whenever
you reference a static file on your, on your site, like a CSS file or an image file.
Instead of just putting `/css/app.css`. Instead, you should say `{{` and
use a function and call the `asset()`, and in here you're going to pass it the exact same
path, but without the opening `/` so `css/app.css`

now, the first thing I want you to know about that is what does this `{{ asset() }}` function
do? Almost nothing in reality. In a moment you'll see that this will render the exact
same path as before `/css/app.css`, so why are we bothering adding? It's well, if
you surround all of your static assets with this asset function, it gives you a
couple of possibilities. The first thing is that if you ever deploy your site to a
subdirectory of a domain like example.com/site/your site, let's do it. Then this will
prefix the sub-directory and the final paths need to improve that. The second thing
is, thanks to this, you can actually go to one configuration file. If you use a CDN,
configure your CDN, and all of a sudden all the pads will render over the seat and in
front of it.

So it's really not that important, but included everywhere and you'll be happy. But
if we move over and refresh, we get a huge air. Did you forget to run? A 
`composer require symfony/asset`, unknown function. `asset`. I love this. So remember
Symfony starts really small. You install things only when you need them. You'll see
this from time to time. We're trying to, we're trying to use a feature we don't have
installed. It simply gives us the exact command and we need to run to install it. So
I'll copy that move over. And run. 

```terminal
composer require symfony/asset
```

As soon as that finishes moved back over and it works. And just to prove it, if I
searched for `app.css` here, you'd see, look, nothing special. It just renders the
original path to that file, right? So let's get the middle of the page looking a
little bit nicer. So I'll go back to my templates, my `tutorial/` directory, and open up
`show.html.twig`. I'll copy this, close it, then go to `templates/question/show.html.twig`
 and paste the same thing as before. There's not a really big
change to here. We're still overriding the same `title` block `body` block. We're still
using the same `question` variable and we're still looping over our answers down here.
There's just a lot of extra markup. And so when we refresh, yes it looks much, much
better. Um, but notice here we actually have a couple of image tags for our images
over here. These are pointing to a static file on our filesystem. So I'm also gonna
replace these with the `{{ asset() }}` function. So I'll actually use a shortcut. I'll just
have assets. And then here I can just type `tisha` and hit tab and it's going to auto
complete that for us. So let me search for image tag here. By the way, Tish is the
name of one of our cats `asset`. `tisha` good to go. And we are good.

No. In reality, these might be uploaded photos. I just have them hard-coded right now
on our images directory. We have an uploading tutorial. If you're interested in more
about that. All right, so we move over. That doesn't make any difference. It still
works just fine. So the last page on our site that we still need to style is the
homepage, which right now is just returning the super simple message. So let's go
over to `src/Controller/QuestionController.php` and yep, sure enough we just have
`return new Response()` here. So let's render a proper template return `$this->render()`
and we'll call this one `question/homepage.html.twig`. And
right now I don't think I really need to pass any variables into it, so I'll leave
the second argument empty. Now inside of our `templates/question/` directory, create a
new file called `homepage.html.twig`.

And we'll do the same thing as before. We'll extend our base template, 
`{% extends 'base.html.twig' %}` and then I'll say `{% block body %}` and `{% endblock %}`
to override that blocking inside. We'll just say that should be enough to get this working. It's been
over and excellent. I mean the middle looks terrible, but the rest of it looks great.
So let's grab one last file from our `tutorial/` director over here. It's our 
`homepage.html.twig`. Same thing. It's just a bunch of hard coded Mark up to make things
look a little nicer. So I'll copy that, closed that file, and then paste it over my
`homepage.html.twig` And now it works beautifully. So that's the basic CSS and
JavaScript set up inside of Symfony. You just manage it on your own. Great CSS files.
Create JavaScript files, create normal, uh, links to them from inside of your, um,
templates. The only re the only difference being that you include this asset
function, which doesn't really do much, but at the end of the tutorial, we're going
to talk about Webpack Encore. And that's a very, very robust system instead of
Symfony for doing some really cool stuff.

