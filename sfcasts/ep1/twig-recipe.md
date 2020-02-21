# Twig Recipe

Coming soon...

Returning text or HTML from a template is kind of lame. We know that the only rule of
controllers that has to return a response and later we're going to talk about how we
can return a JSON response, but first I want to talk about how could we actually make
it HTML. We don't want to just, you know, put a HTML right inside of this string that
will get really ugly really fast instead of we're going to want to use a templatey
engine, but because our application is so small, Symfony starts so small because it
doesn't know if you need a tumbling engine, there's not one installed right now, so
no problem. Let's flip back over and go back to the flex dot Symfony, that com site,
and I'm just going to search for template and boom, check us out. There is something
called the twig pack, which has the alias template templates, twig, twig pack. This
is the package we want to install if we want a templatey engine. Twig is a wonderful
templating language that you're absolutely going to love. So let's try it. Let's go
over here. I'll run and get status just to show that everything is committed right
now. And let's say composer require

template that installs Symfony twig pack, which installs several different libraries
and chats out, configures to recipes. Let's check out what those did. Fall clear this
and say get status. Whoa, awesome. Okay, so compose it a day. Sign and compose it at
lock. We expected those and now we know that Symfony keeps track of all the recipes
it's installed. So that change makes sense as well. Well, it's like a config bundles
that PHP first

I'll do get diff can pig /bundles dot PHP. Oh, interesting. It had a two lines. The
end of this file. Let's open that. Config bumbles dot PHP. Okay, so in Symfony a
bundle is a Symfony plugin. So very commonly when you want a new feature in your
Symfony application, you are going to be installing AppBundle. And whenever you
install a bundle, you need to enable it in your application. A long time ago in
Symfony you had to do to do this manually, but saying thanks to Symfony flux,
whenever you install a Symfony Bumble, it automatically updates this bundles dot PHP
file and enables the bundle for you. So this is going to happen behind the scenes.
You'll probably never need to touch this bumbles.pg file because flex is going to
take care of it automatically.

The recipe also added a templates directory, so there's no mystery if you're
wondering where templates should live inside of your application. Well, as soon as
you installed a templating language, you get a templates directory so you have a
pretty good guess where it should go. We also have a base that each Gemma twig, which
they very simple base layout that we're going to work with in a few seconds, and if
you really want to know why do templates need to live in this template structure?
Like is that just a hard corded somewhere in the core of that library that we just
installed? The answer is no, he's actually in our configuration. One of the other
files it created was a config packages TWIC .yaml a configuration file that controls
twig. So if we open config packages, tweak .yaml, check that out.

Without even understanding a lot about this file, we can immediately see that there's
something called a default path that points to the templates directory. Don't worry
yet about this weird percent kernel project or percent syntax. That's something we're
going to talk about in future tutorials, but basically this is just a a fancy way of
pointing to the root of our project. So this tells twig I want my templates to live
in the templates directory. Want your templates to be called it views instead renamed
directory, renamed this key here and boom, twig will now load from that other
directory. You're in total control and this is your file to change from one other
file that it created with somebody called config packages. Test. Tweak .yaml. This is
a little bit less important, but Symfony has something called different environments.
It's something we're going to talk about in a future tutorial. But this case, it
created a little configuration file that said, in the test environment, strict
variables should be true. What that does is not important at all, even after you
become a Symfony expert. This is a tiny little detail. The point is, when you
installed twig, it's recipe takes care of all these little details for us. In this
case, this setting actually tells twig, um, that if you're ever doing automated tests
to throw exceptions, if you try to use an, if you try to reference an unused variable
so that you know about it,

one is you don't even need to know about that Symfony added a default, a sensible
default value for you. So in other words, this is a long way of saying that we ran
composer require templates and thanks to the recipe, we are 100% ready to use twig in
our application. So let's do that next.

