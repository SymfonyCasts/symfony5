# Flex Recipes

Coming soon...

Let's commit our progress so far. I'll clear the screen and run, get status. There
may be more files here. Then you expect like a couple of new Yammel files down there.
Don't worry. I'm explaining where those came from soon for now, just do get added
and.now normally get at.as a little dangerous because you could commit files that you
don't want to, but one of the great things about the project is that it came with a
dot get ignore file, which are ignores things like the vendor directory and other
files. Other paths that we'll talk about little by little like you VAR directory,
which you don't really need to worry about, but the VAR directory contains some cache
files that Symfony crates that you also want to ignore. So Symfony is watching our
back by creating the doc. Get ignore file. So let's commit, get commit dash M we are
rocking this Symfony thing.

All right, I want to talk about the recipe system first. I want to show you a really
cool feature that we haven't looked at yet, which is that you can interact with your
simply application in two different ways by loading a page in your browser, of
course, but simply also has a little command line script you can run by saying PHP
bin slash. Console. This is loaded with tons of useful debugging commands in our
application. Now just to demystify this a little bit, there is literally a bin
directory with a console file inside. So this bin console thing is not some global
command we installed on our system. We're just literally executing a PHP file, which
boots up our application and gives us a bunch of commands that we can run inside of
it. So for example, one of the cool ones is debug router. This is going to give you a
list of all the routes in your application. So I run PHP bin console, debug router to
see our two pages /in slash. Questions /curly brace, slug this preview air thing. You
can ignore this as a way to help you, um, build your 400, four, four and 500 pate
style pages and it's added an automatic device Symfony in the development mode only.
All right, so I want to install a totally new package into our system called the
security checker.

The point of the security checker is it will actually check our applications
composer.json and composed about lock files and tell us if we're using any
dependencies that have security vulnerabilities. But full disclosure, we're going to
install this library because it's going to be a great way to look at the recipe
system. So run composer require sec checker. You could use dash dash dev. Now if you
know composer, you know that sec checker is not a real package name. All packaged
names must be something /something else. So what the heck is going on?

Move over and check out the composer dot and JSON filer. When we started our project,
we started with very few dependencies, but one of the dependencies that we started
with was something called Symfony. Slash. Flex. This is a composer plugin so it adds
more features to composer itself and specifically adds to amazing features to
composer. The first one is called aliases, so go to your browser and open up
flex.Symfony.com to find and search up here for security. In fact, let's look for it.
Sec checker. Boom. Here we go. So you can see where it says right here. It says that
there is a package called Sensi labs /security checker and it has aliases of sec,
check, sec checker, security dash checker, any of these things. So the ileus system
is very useful but very simple thanks to having Symfony flex installed. We can say
composer, applier, security checker and internally that will be shortcuts to download
Sensio labs /security checker.

You can see over here in our terminal we said sec checker, but ultimately it
downloaded Sensio labs /security checker and that's what went into our actual
composer, that JSON file. So this is just a nice little shortcut feature and it's
really cool because you know if you need, for example, a logger, I'll search for
logger. You can say composer require logger. And they'll give you the recommended
logging library. Need a to do emails you can do a composer require mailer or composer
require mail and it's going to give you Symfony's official mailer library or composer
require cookies. A man cake,

nothing.

Okay, well there's not an alias for grit for delicious food.

Okay?

The second super power of the system, and this is really the most important one, is
the recipe system. So if I move back to my terminal here, you'll see that after
installed the package, it says simply operations one recipe configuring sends you lab
/security checker. Now check this out. Run, get status. Whoa. We expected composed of
JSON and composer that lock to be modified. That's how composer works. But there's
also it also modify that sip and have that locked file in added a new configuration
file. All right, so first sip of that lock is something that is managed by flex and
you don't need to worry about it and you should commit it. It just keeps a big list
of all of the recipes that it has installed. The other mysterious files, config
packages, security checker..yaml. So config packages, security checker. Dot. Yammel.
This was created by Symfony flex when we installed the recipe. And I don't want you
to worry about the specifics of what's in this file. That's something we're going to
be talking about over the next, uh, uh, little by little, but thanks to this file.

Yeah,

we now have a new bin console command. That's actually the whole point of this
library watch I run PHP bin slash. Console. You can see in here there's one called
security check that wasn't there a second ago, but they see didn't configuration
file.

All right,

but thanks to this new, there's a new configuration file, gave Symfony all the
configuration that needed to add this new command to our application so we can try
it. Been counseled security call on check and beautiful no package, no packages have
known vulnerabilities. So very simply, whenever you install a package, there may be a
recipe for it and recipes can do lots of things that can add files, it can add
directories or they can even modify files like a recipe can modify your get dot. Get
ignore file and add more contents to it. I love Symfony flex because anytime that I
install a third party package, all I had to do is install it. I don't need to add
configuration files or modify anything else because the recipe is going to add all
things form all those things for me. In fact, if I go back, I'll run and get status
again and I'm going to get diff composer.json as expected when we install this
package, added the sensory lab security checker to our composer JSON file. But check
this out. It also added something down here under scripts called auto scripts called
secure security dash checker security check.

So that's actually an example of the recipe updating a file and thanks to this line
here, if you run composer install now after an install is on the packages, it
executes one extra script on here which is it actually executes that security check
command for us. So all we needed to do was install the security checker. It added the
configuration file that was needed and even updated our composer.json file to add
that auto script. Now you might be wondering, where did this recipe come from? Where
are the instructions for the recipe? Well, they live in the cloud, but also if you
look at flex dot [inaudible] dot com you can click and look at the recipe for any of
the packages on here. So I'm gonna click on this particular recipe and notice it
takes us to a repositor called Symfony. Slash. Recipes.

I actually click to go to the home page. So this repository is actually a big
repository full of all of the different recipes in the Symfony ecosystem. So I'll go
back here and I'll put in a 4.0 so when we installed this recipe, when we installed
that package, the Symfony flax looked at this recipe and looked at this manifest that
JSON file, which describes what should be added. So you can see the first thing it
says here is it says that we should copy the config directory into the user's
project. So a copy of this config packages, security check or dye Yammel file into
our config packages directory. The configuration file also said that it should add
this security checker line to composer and it defines the aliases that should use for
this recipe. So it's all right here. There's one other spot on the internet where
there are recipes which is Symfony /recipes.com trip. So in fact all the recipes are
either in their recipes repository or in recipes can trip. There's no difference
between these two different places. Um, except that the remain recipes repository is
a little more closely guarded. So these are guaranteed to be higher quality, whereas
recipes contributes easier for anyone to get their a recipe into it. We'll be
installing bundle libraries from both of these.

One other way that you can get information about the recipes is actually via composer
because remember flex is a composer plugin, so it actually adds a new command called
composer recipes. This gives you an example. This shows you all the recipes that are
currently installed into our system. And if we copy this name here, we can say
composer recipes sends the lab /security checker and it gives us a URL to be exact
version that we have installed and even shows us which files it copied into our
project. So that's it for composer or that's it for the flex recipe system. It's
going to be the key because it's going to help us install everything as we go along.
I need a good way to wrap that up. One other superpower of the recipe system. We're
just kind of handy because you can also remove packages. So the security checker is
cool, but I just wanted to show it as an example. So I'm gonna remove it. Composer
remove second checker. That of course is going to remove the packages, but it also
unconfigured the recipe. So when I run and get status, now look, it's clean. It
cleaned up our composer, that JSON file, the script section has gone from here and
deleted the extra configuration file. All right, next let's install a temp bunny
engine called twig doing. That's going to be super easy because the twig recipe is
going to configure everything we need automatically.

