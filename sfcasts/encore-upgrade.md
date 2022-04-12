# Upgrading Encore and your assets/ Setup

Coming soon...

Just two recipes left to update. Let's do WEP pack Encore bundle next. This has
changed. Recipe has changed quite a bit over the past year and a half. So depending
on how old your is, this might be easy or it might be a little bit more and evolved.
So let's run and get status and see what's going on. All right, so I have a number of
modified and deleted files and conflicts. Let's go through the conflicts first. So
first assets /app.JS. You can see here, I added a new custom collapse functionality
from bootstrap. Not sure why this conflicted, but that's an easy fix. Next is
bootstrap.JS. This might actually be a new file for you, depending on how old your
application is. This is a new file that was added Or while ago, and its job is to
initialize stimulus in your application and load all the files in your controller's
directory as stimulus controllers. In this case, I already had this file, but
apparently the kind of regular expression here changed slightly For how it finds the
files, the new ones probably by so I'll use it. The next conflict is controllers.
JSUN,

I'm not sure exactly why this is conflicting. I have a feeling that I maybe added
these files manually. And then when I upgraded the recipe right now, it's re adding
them. So I actually want to keep my more custom version right here. If you did have
an old project, it would be adding all these files And then one more conflict. That's
conflict with style, such app CSS, same thing. It actually added this file all the
way at the bottom with just a body background, I must have added this file manually.
So I'm getting a big, old conflict. We want to keep all of our custom stuff. All
right. The last conflict is down here in package.JSON. This was a little bit more
interesting. So when I,

My project was already using stimulus. You can see, I have stimulus down here and I
also have Symfony's stimulus bridge, which helps bring stimulus into Symfony while
the updated recipe now has at Hotwired /stimulus. And then instead of stimulus bridge
two, it has stimulus bridge three. So what happened here is when stimulus went from
version two to version three, they didn't really change anything except that they
renamed the library from stimulus to at Hotwired /stimulus. And then in order to get
version three to work, we need version three of stimulus bundle instead of version
true two. So I'm going to take this as an opportunity to upgrade from stimulus two to
stimulus three. So I'm going to keep this at Hotwired /stimulus. I'll put it up here.
So as an alphabetical order, let's use version three of stimulus bridge. And even
though really doesn't matter because this version constraint allows any version one,
I'll also use the new Webpac Encore version and then fix the conflict. And the other
thing you want to make sure you do is delete stimulus. We don't want version two of
stimulus in there anymore. All right, because we just changed some files

In our package at JSUN file. I'm going to go to my other tab here. That's running,
uh, Encore. Hey, control C and then run yarn install or node install. All right,
perfect. And I'll clear this and run yarn watch to rerun Encore and It fails. You can
see something here. It's got this long weird air message, but it eventually says
assets controllers answer vote. Controller contains a reference to the file stimulus.
So the most important, but boring part when you upgrade from stimulus two to three is
you need to go into all of your controllers and change this import from stimulus to
import from hat hot, wired /stimulus. It's that simple. I'm actually going to delete
this hello controller. This is an example controller that the recipe just gave me.
And then in my other real controller, I'll change this to pat hot wired /stimulus.
Perfect. Now I'll try rerunning. I'll close out of yarn watch and try rerunning it.
And we still get an air. This coming from Symfony UX chart, JS controller. So in my
project, I've installed one of these Symfony UX packages, which are PHP packages that
also give you some JavaScript. So apparently the JavaScript for that package is still
referencing the stimulus instead of the new, at hot wired /stimulus. What this tells
me is that I probably need to upgrade that P three package. So in composed.json

Down here in Symfony UX chart JS, If you need some research, you find out that
there's a new version, two out That supports, Um, stimulus three. So now I'm going to
go over here to my main terminal tab and run composer up. And then we will upgrade
Symfony /UX chart at JS just to upgrade that one package And perfect upper version
2.1. And then it wants us to run MPM installed-force or yarn installed-force that re
initializes the JavaScript from that package. One thing I want to do want to
highlight for this one particular package is that when we upgraded a version, two of
that in our package, JSON file, it actually upgraded our chart JS dependency from
version 2.9 to 3.4 that's cuz the JavaScript in this new version is meant to work
with chart JS three instead of chart JS two. So you made that change for us. This
just downloaded chart, Jas version three. You just want to be aware of that. Right?
Finally, we should be ready to go yarn watch And got it. It builds It builds
successfully. So over the main terminal tab, Let's go ahead and add everything. I've
fixed. All those conflicts

Made all those changes. Got it commit,

Go.

And then friends we're under the last update. It's Zen struck /Foundry. This is an
easy one. Earn get status. It is once again, environment configuration going into a
main file. So let's commit that Beautiful and we are Clean. All of our recipes are
updated. And remember part of the reason we did that is some of those recipes
actually replaced old deprecated code with new code. So hopefully when we refreshed
the page, it not only still works, but we have less depre on mine. It went from 11
down to N Very first, a couple times. I'm settling in at about 22. So next it's time
to actually take a look at the DEP. We have left And start so squashing. These we're
going to start with security. I think.

