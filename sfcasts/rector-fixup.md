# Post-Rector Cleanups & Tweaks

Rector just automated several changes to our app that are needed to remove depre on
Symfony 5.4. Plus it added some nice bonus features like Adding the optional response
return type on my controllers, but it's not a perfect tool. All the class names are
in line instead of having a use statement. And even though it renamed some
interfaces, It didn't necessarily re name the methods that we call on that To reflect
those changes. So no worries. Rector is a great start and it just highlighted several
changes that I need to make. Now it's time for us to finish the job first For these
long class names with no use statement. And in general, for coding styles, Rector
doesn't know what coding style you preferred. So it doesn't even try to format things
correctly. The official recommendation is to use a tool in your project like P P H P
CS fixer To reformat the code after you run rector and PHC as fixtures is a great
tool anyway. So I thought let's get it installed and have it help us. So you can
install. PHP is fiction a couple different ways, but oddly enough, The recommended
way and the way that I like to do it is to create a new tools /PHP, CS, fixer
directory. So literally nothing special. There's just a new tools directory in PHP,
CS fix, and it's there. Now I'm going to actually install it into that directory by
running composer

Require and-working there = tools /PHCs fixer. So basically kinda composer, even
though I'm running you from this directory, pretend like I'm running you from that
directory. And then we're going to require Friends of PHP /PHP CS fixer. Now, if
you're wondering why I'm not just installing this directly into my main dependencies,
this is a bit tricky. PHC is fixer is really meant to just be a standalone tool. If I
installed it into my dependency, then I would need to make sure that it could just
cause some problems sometimes Where maybe PBC as fixer has some versions of some
dependencies that are incompatible with your project. And so it's hard to install it
and really we don't need it to be integrated into our project. It's just a standalone
executable that we run for that reason. We install it into this sub directory. So you
can see, we literally have a proposal JSUN composer lock file inside of here, and we
can run vendor bend PHPs, see as fixer there's our executable Now because we have a
new vendor directory inside of here. I'm going to open up my.get ignore file. And at
the bottom, let's actually ignore that. So I'll say /tools /PHC as fixer /vendor,
ignore that directory then also going to, while I'm here, ignore.PHP, CS, fixer
cache. That's the little file that PHCs is going to create. And we also don't need to
commit that.

All right, the last step to get PHCs fixer to run, we are going to need a
configuration file. So through the project, create a new file called.PHP-GS
fixer.PHP. And it's not up here. I'm just going to paste in about 10 lines of code.
So this is very simple. I tell PHCs fixer where to find my source files. And then
down here I tell it what rules to apply. So I'm using a pretty standard Symfony set
of rules. All right. So now we're ready to run this, to see what it did. Oh, over the
command line. I'm going to add all my changes, get, add, dot, and get status, but I'm
not going to commit them yet. Cuz I still want to be able to review the changes that
rector made before I finally commit them. But at least now I'll be able to see what
pH B, C S fixer does. All right, so let's run it. Tools. HPC is fixer fender. Then
HPC is fixer fix And D it modified six files. Let's check out what it did. I'll say
get D and awesome. Basically what den our case is. At least took out those long use
statements for the response class

Across our code base. It also removed a couple of old use statements that we don't
need. So the code from rector still isn't perfect, but that was a nice step forward
towards making it better. All right. Finally, Let's fix a couple of things manually.
So if you dig into the changes that were made by rector one by one, Just by reviewing
the changes and checking each1 by one, I'll help us out a little bit by zooming into
some places that we need to check out. First one is registration controller. So go to
src/Controller, registration controller. And this is, is one of the spots where it
changed from a user and coder interface, a user password Hasher interface. It notice
that PHCs fixer did fix a lot of our, uh, missing use statements, but not all of
them. So I'm going to fix this one by hand. I'm going to hover over this and I can
hit all all to enter and then go to simple. I F QCN and perfect that out of the use
statement up there for me. And then the only problem is if we trace down to where
this is used previously, we were calling Incode password on this, that method doesn't
exist on this interface. We need to call hash password. So that's the case where
rector didn't quite make all the changes we needed. Then I'm also going to rename
this, um,

Argument. So I'll go to refactor rename And call it User password Hasher, just cuz
that's a little bit of a better name. All right. Next change is that we need checkout
is very similar. It's in factory user factory.PHP. Scroll down here once again, we
have a long use statement. So I'll select that option. Alt enter, go to simplify. FQ
N to add that use statement and then I'm going to rename a couple things once again.
So refactor rename to call this password Hasher That looks like it also wants to
rename double checking that I Just confirming that change. And then let's also rename
the password refactor rename, call this password Hasher. And then last thing just so
before down here, we need to call hash password instead of encode password. All
right. There's one more spot we need to make actually kind of the same change is down
here in security login form authenticator. We're going to be refactoring this class
later anyways to have the new security system, but let's at least get it working. So
I'll find the user password, Hasher interface, argument, and, and simplify that I'm
then going to rename the argument

Pass for Hasher And rename the property, The password Hasher as well. And then we can
check where that's used. It's used all the way down on the bottom, Actually, lemme
search for Hasher. There we go. Students down here in line 84, and this is password
valid actually does exist on the new interface. So this is one case where we don't
need to change that. And one last change I want to make in here is the user not found
exception. It has the long thing. So let's click on that and hit simplify. FQ N
Beautiful. And that should be everything. All right. So does our page w Does our app
work? If we go back to the homepage, it doesn't, we are back to the welcome page.

If you spin back over to your terminal and run bin console Depot router, you'll see
that. In fact, all of our routes are gone. This was one other change that rector made
that I needed to pay close attention to it's inside of our kernel class. We're going
to talk more about this later when we upgrade our recipes, but it changed this use
statement here to route a configurator, but it didn't then update the code correctly
below. So again, rector is really good for getting a signal on some of these things,
but it doesn't always do a perfect job. Um, fortunately the entire configure routes
method has been moved into this microkernel trait. So we don't even need to have it
in our class anymore. So as soon as I delete that method, the parent class now holds
the correct version. My routes are back And the page works and it hopefully has less
deprecation than before. At least a couple. I now see 58. All right. So what's next
after upgrading. So we've upgraded our tendencies. We've automated some of the
changes with rector. Well, there's still one more thing thing that we can do before
we start going through all of these depre manually, and that is updating the recipes
for each of our packages. And this has gotten a whole heck of a lot easier than the
last time you upgraded that's next.
