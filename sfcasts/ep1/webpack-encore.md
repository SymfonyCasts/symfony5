# Webpack Encore

Coming soon...

Our CSS and JavaScript set up is fine. We have a `public/` directory of an `app.css` we
created. We have a `question_show.js` and inside of our templates like 
`base.html.twig`, we're just linking to the CSS files directly other than this `{{ asset () }}`
function, which really doesn't do anything. Symfony isn't touching our assets at all.
We're just doing things a very traditional way and that's fine. But if you want to be
very serious about front end development, um, in this day and age we need to take
this up to a next level. We need to use a node library called Webpack, which is an
absolute industry standard for sort of combining your CSS and JavaScript files and
creating a very robust front end system. Now what back can be a lot of work can be a
lot of work to set up. So in the Symfony world we use a wonderful library called
Webpack Encore to make this dead simple and we have an entire free tutorial on
Webpack Encore.

But I'm going to give you a quick view into how it works right now before we start.
Make sure you haven't node installed and also that you have yarn installed. Yarn is
one of the package managers for node, so it's kind of like composer for note. No,
it's all Encore. We're going to run the 

```terminal
composer require encore
```

Now I know a second
ago, Oh, before you do this, you should commit everything. I know a second ago I said
that Encore is a node library, so why are we installing it via composer? This is a
package library for PHP. What reality, all this does is installed a very small bundle
called `webpack-encore-bundle`, which helps integrate with Webpack Encore. The real
beauty of this, uh, of installing this library is that 

```terminal-silent
git status
```

it brought in a fairly large recipe which bootstrapped a whole bunch of stuff for us.

One cool thing is it modified our `.gitignore` file. So if we go over here, I can
open the `.gitignore` file and you can see down here it added some new entries for
`node_modules/`. That's basically the vendor directory for node and a couple other paths
that we want to ignore and it boosts up a couple. It also added some Yaml files.
Don't worry about those. And bootstrapped a `package.json`. This is the
`composer.json` file for node and also a very important `webpack.config.js` file,
which makes this whole thing work. We're not going to look at those files and too
much detail. We'll save that for the full Encore tutorial. So check out there if you
want to.

Now that we have this `package.json` file, which specifies our no dependencies,
we're gonna install them by saying:

```terminal
yarn install
```

This is basically gonna read that
file and download a ton of files and directories into a new `node_modules/` directory.
It might take a few moments to download everything and build a couple of packages.
When it's done. You'll see two new things inside of here. First you'll see a new 
`node_modules/` director with tons of stuff in it. This is already being ignored from get,
which is good. And it also created a `yarn.lock` file, which is just like the
`composer.lock` file. So you'll also want to commit the yarn dot locked file.
Okay. So here's how this whole thing works. Close a couple of files, the recipe, edit
a new `assets/` directory with a couple of examples, CSS and JS in your files. There's
an `app.js` which just basically just `console.log( something )`. And there's an 
`app.css`, which just changes the background color to light to gray.

Webpack Encore is already configured to point at these files so it knows it needs to
process those files that happens thanks to this `webpack.config.js` file,
which we're not going to talk very much about, but this is where uh, how a web Encore
knows to look at that `app.js` file. So to execute Encore, find your terminal and
run 

```terminal
yarn watch
```

is actually a shortcut command for running an `encore` executable `dev --watch`
Again more than that, noon in a different tutorial. The really
important thing here is that it parse through these two source files here and then
created a `public/build/` directory with a built version of `app.css` and a built
version of `app.js`. And if we, and yes we can do a production build was Encore,
which would admit it by those. There's a lot more going on here, but that's basically
the idea. So now in our base template, instead of pointing directly at our public CSS
files, we can now point at this public and build stuff. There's an easy way to do
that. I'm going to remove my old link tag. We can say `{{ encore_entry_link_tags() }}`
and then just say `app` meaning because this is the name of these files is app.
And then down here on the bottom I'm going to say `{{ encore_entry_script_tags('app') }}`
to get the same thing.

Now if we move over and refresh, did it work? It actually did see that gray
background there. It totally is loading those in. If I go to inspect here and look at
my console, you can see hello, Webpack Encore, edit me and `assets/js/app.js`.
And just to show you in the uh, a view source here, there's nothing special going on
here. It's just rent the rendering, the build link tag to `build/app.css`. So
the cool thing is that now we can move our CSS into the CSS file. So I'm gonna copy
my `public/css/app.css`. I'm gonna copy all of this. What was that file right click
go to refactor, delete. And then I'm going to go to `app.css` and paste over this.

And as soon as I do that, if I refresh, it works. The reason is that if you look back
in your terminal, `yarn watch` is actually watching our files for changes so many times
we make, anytime we make any changes to those files, it automatically rebuilds the
files and `public/build/`. So we just let this run in the background. So let's do the
same thing for our JavaScript file. I'm going to open `question_show.js` and
instead of having a page specific JavaScript for simplicity, I'm just going to put
this right into my global `app.js`. So this'll be loaded on every page now. And
then I'm going to delete my `js/` directory entirely back. Let's delete our `css/`
directory entirely.

And then I'm also going to go into `templates/question/show.html.twig`, and
at the bottom we'll remove our page specific JavaScript here. And with any luck that
should have rebuilt my JavaScript. So if I click into his page here, I'm actually
gonna do a force refresh just to be totally sure. I'll close this. And yes, this
still works. Our `app.js` is being compiled down and the final `public/build/app.js`
now contains that coat. So the really cool thing is that now that you're in this
system, you can do, um, there's a couple of cool things that you can do. There's a
lot of cool things you can do. The most, the most important one is that instead of,
you know, using CDNs or downloading jQuery directly in your project, you can properly
install jQuery into your `node_modules/` directory. Then import it. So check this
out. I'm going to open a new terminal tab over here and say 

```terminal
yarn add jquery --dev
```

This is the equivalent to `composer require` the `--dev` part. There
is not actually important to you can use it or not use it. Now I'm going to go over
to my base template and remove jQuery entirely from my layout.

Go back and open my inspector here because if I refresh, our page is totally broken.
You can see dollar sign is not defined coming from our app dot JS file, so jQuery
does not exist right now. We did just download it into our `node_modules/` directory.
You would find a jQuery directly inside of here, but it does, but it's not being
included yet. The way to do that once you're inside Encore is via this handy import
statements, `import $ from 'jquery'` because jQuery is the name of the library
installed. Now all these dollar signs here are referencing that jQuery variable
inside of there. When OnCourse, when mug Webpack Encore sees this, it's going to
automatically package jQuery into the final `app.js` file. Basically, it's a fancy
way of saying whenever I go over here and refresh, it just works. No heirs and jQuery
is now being properly brought in and packaged.

We can also do the same thing of bootstrap with a CSS. So up here you can see one of
the CSS I'm bringing in as `bootstrap.css`. So I'm going to delete that. No surprise if
we refresh. Now that's going to make our page super duper ugly. So let's spin back
over here and run 

```terminal
yarn add bootstrap --dev
```

This is going to install
bootstrap, which is actually a collection of JavaScript and CSS files into our 
`node_modules/` directory. And in this case we will want to bring in the `bootstrap.css`. So
I'm gonna go into my `app.css` and check this out.

We can actually use the old `@import` syntax, double quotes. And then if you want to
reference a load, somebody from your `node_modules/` directory, the special syntax here
where you say `~bootstrap` and that's it. It's going to know to bring in the
`bootstrap.css`. So now I go over refresh doing anything else that reloads Webpack.
Encore is smart enough now to grab the `bootstrap.css` and include that inside of
the final `app.css` file. So that's just the tip of the artist's Berg with Webpack
Encore. But we now have a very nice robust system set up there. Webpack Encore can
also do production builds where it minimizes and combines files. Um, it supports sass
or less. You can, um, get it, uh, enable react or view support. Automatic versioning.
The sky is the limit. So if you're interested, go check out our free Webpack Encore
tutorial that's gonna make you an absolute expert on this, our friends. That's it for
this tutorial. I hope you're feeling really excited. We've already learned a lot of
Symfony and the next tutorial we're going to tackle, we're really going to dive into
Symfony and tackle that topic of services more and more because once you understand
services and how they work, you are going to be unstoppable inside of Symfony. Our
friends see you next time.

