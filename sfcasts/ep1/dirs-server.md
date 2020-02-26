# Meet our Tiny App + PhpStorm Setup

One of my *main* goals in these tutorials will be to help you *really* understand
how Symfony - how your *application* works.

To start with that, let's take a quick look at the directory structure.

## The public/ Directory

There are only three directories you need to think about. First, `public/` is
the document root: so it will hold all files that need to be accessible by a
browser. And... there's only one right now: `index.php`. This is called the
"front controller": a fancy word that programmers invented to mean that this
is the file that's executed by your web server.

But really, other than putting CSS or image files into `public/`, you'll almost
never need to think about it.

## src/ and config/

So... I kinda lied. There are *truly* only *two* directories that you need to
think about: `config/` and `src/`. `config/` holds... um... puppies? No, `config/`
holds config files and `src/` is where all your PHP code will go. It's just that
simple.

So... where is Symfony? Our project *started* with a `composer.json` file, which
lists all the third-party libraries that our app *requires*. Behind the scenes,
that `symfony new` command used composer to install this... which is a *fancy*
way of saying that Composer downloaded a bunch of libraries into the `vendor/`
directory... including Symfony itself.

We'll talk more about the other files and directories along the way... but they're
just not important yet.

## Using the symfony Local Web Server

A few minutes ago, we used PHP itself to start a local development web server.
Cool. But hit Ctrl+C to quit that. Why? Because that handy symfony binary tool we
installed comes with a more *powerful* local server. Run:

```terminal
symfony serve
```

That's it. The first time you run this, it may ask you about installing a
certificate. That's optional. If you *do* install it - I did - it will start
the web server with https. Yep, you get https locally with zero config.

Anyways, once it's running, move over to your browser and refresh. It works!
And the little lock icon prove that we're now using https.

To stop the web server, just hit Control + C. You can see all of this command's
options by running:

```terminal-silent
symfony serve --help
```

Like ways to control the port number. When *I* use this command, I usually run:

```terminal
symfony serve -d
```

The `-d` means to run as a daemon. It does the exact same thing except that now
it runs in the background... which means I can still use this terminal. Running:

```terminal
symfony server:status
```

Shows me the server is running and:

```terminal
symfony server:stop
```

Will stop it. Let's start it again:

```terminal-silent
symfony serve -d
```

## Installing PhpStorm Plugins

Ok: we're about to start doing a *lot* of coding... so I want to make sure your
editor is setup. And, yea, you can use *whatever* your want. But I *highly*
recommend PhpStorm! Seriously, it makes developing in Symfony a *dream*! And no,
the nice people at PhpStorm aren't paying me to say this... though... they *do*
actually sponsor several open source PHP devs... which is kinda better.

To *really* make PhpStorm awesome, you need to do two things. First, open the
Preferences, select "Plugins" and click "Marketplace". Search this for Symfony.

This plugin is *awesome*... proven by the nearly 4 million downloads it has.
This will give us all *kinds* of extra auto-completion & intelligence while
we're working. If you don't have it already, install it. You should *also*
install the  "PHP Annotations" and "PHP toolbox" plugins. If you searched for
"php toolbar"... you can see all three of them. Install them and restart PhpStorm.

Once you've restarted, go *back* to Preferences and Search for Symfony. In
addition to installing the plugin, you *also* need to enable it on a
project-by-project basis. Check Enable and then apply. It says you need to
restart PhpStorm... but I don't think that's true.

The *second* thing you need to do in PhpStorm to make it shine is to search
for Composer and find the "Languages and Frameworks", "PHP", "Composer" section.
Make sure the "Synchronize IDE settings with composer.json" box is checked...
which automatically configures a few useful things.

Hit "Ok" and... we are ready! Let's create our very first page and see what
Symfony is all about.
