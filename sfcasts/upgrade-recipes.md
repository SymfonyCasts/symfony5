# Recipe Upgrades with recipes:update

Coming soon...

Let's keep upgrading recipes. Yes. There are a bunch of them to do, but most of these
are going to be super easy. So we're going to go through this quickly, but I'll
highlight the important parts as we go for the next one. Let's skip down to do
Symfony /console since that's all. That's another important one. This updated Just
one file bin /console. If I did that, It changed from being kind of long to pretty
darn short. This is once again, The Symfony runtime component in action. The code to
boot up Symfony for the console has moved into Symfony /runtime. The nice thing is
making this change fixed hard, been consult command. Perfect. Which had been broken
since we greater the framework bundle recipe. All right, Let's update this and then
keep going. Let's skip down to twig bundle. That is number seven. I'll clear the
screen.

All right. We got some conflicts this time. Exciting. I'm going to clear the change
log since I've already looked at it. Interesting. So it deleted another environment,
specific configuration file. And then we have two conflicts down here. Let's go check
out config packages, twig.YAML. So once again, we are seeing the new environment
specific config. This config used to live in config packages, test /trade YAML. It's
now been moved into this file and because I have a call forms, themes, config, this
conflicted, but we just want to keep both of those. So that's easy. The second
conflict was in template /based H channel, not twig. Our base H twig is pretty
customized, so we probably don't need to worry about any new changes. What I
basically did was adding new Fae icon by default in Symfony, you probably won't want
to use this, cuz you'll probably have your own, but you know, To fix this conflict
perfectly since I don't have a of icon, I'll copy that new thing, use our code, but
then paste the Faye icon up here. And I'll actually delete that comment. All right,
perfect. I'm going to commit a everything

And let's go again. Now I'm going to start doing this list just in order from top to
bottom. So the next one is the bundle. I'll clear the screen and start that this is a
pretty cool update. Once again, I'm going to clear I'll clear the screen and we're
going to get status. All right. So it actually conflicted in the.N file. This is
probably the least interesting part art sometime over the past few months, Symfony,
the Dr. Bundle started chipping with Postgres as the default database. You were URL.
You can totally change that to be whatever you wanted, but Postgres is such a good
database engine that we started shipping the, with this as the default suggestion.
But of course I'm using my SQL wellness product. So I'm going to keep my SQL, but
just to be super cool, I at least take their new example config, which maybe is,
looks a little bit different than what I have now and kind of update my examples on
top of it. And then I will use is my version. So the end result is a couple of tweaks
to these comments and that's it. The other change in here have to do with config
files and I bet you can see what's happening here. It deleted two environment
specific config files and updated the main one. Hmm. So let's open config packages,
doctrine Yamo and sure enough, at the bottom you can see custom when at test and when
at prod config, which is great. So everything's now in one file,

Just make sure that you, if you had any custom configuration inside of these files,
that you move that over to this file right here and you don't lose that one other
thing that's kind of new is this, when at test the database name, suffix, this is
pretty cool. What this is going to do is it's going to automatically make your, um,
when you're running tests, it's going to reuse the same database connection
configuration, but then a new, but then just a different database name, maybe
whatever you're normal database name is_test. So that allows you to have two, one
database for your main coding and another one for your test. And this little end
thing here is a little fancy thing, and that makes it really easy to run parallel
tests. If you use hair tests, this will just help you give a unique database name per
parallel test run, which is awesome. And there's a one other change in this file. If
you kinda look up, you can kind of see it in PhpStorm. It deleted this type
annotation line right now on our project. We are still using annotations for our
entity configuration.

We're actually going to change that in a few minutes to use a pH P attributes, which
is going to be awesome. But anyways, in the doctrine bone configuration, you no
longer need this type annotation line. It's going to be automatically to detected. So
doctrine's going to look at your entities and if it sees annotations, it will load
the annotations. If it sees P HPA attributes, it's going to automatically load PHP
attributes. So the best config to have here is nothing so that it figures out things
for us. All right. So once again, We'll add everything Commit And then keep going to
doctrine extensions. The next few are going to be really simple. This one, I'm not
even If you look at it, modified a comment, that's it. So I'm going to go ahead and
commit that And move directly onto D bug bundle. I'll clear the screen and run that

This actually made two different changes. If we run via status, the first thing I
did, I won't look at it, but it, once again, deleted some environment specific file
and then moved it into the main file. The second thing I did, which is kind of rare
for which is not very common in recipe updates, is that in config /bundles.PHP, it
previously loaded, debug bundle in the dev environment and test environment. We now
recommend only loading it in the dev environment. You can't have it in test
environment, but it tends to slow things down. So it's been removed. So we now have
that change. All right. So let's commit that Go on to the next one, which is monolog
bundle. And this one does have a conflict, but it's still a fairly simple change
before we had environment specific files for in dev prod and test. These have all
been moved into a central config packages and monolog.YAML. The only reason I
conflicted on my project is I had previously created this file in an old tutorial to
add a new markdown channel. So it kind of, um, uh, conflicted on that. So what I'll
do is I'll actually add my markdown channel down here

And keep that. And then you can see the dev configuration for logging test
configuration for logging and broad configuration for logging. Again, if you had
custom configuration in your individual files, make sure you bring that over to the
new file so that doesn't get lost.

All

Right. So let's add, add that Commit. You guys know the drill at this point. We're
almost there. We're going to keep updating next is Symfony routing. This one's dead
simple. Another environment specific configuration file was, was, uh, deleted. I like
that. I like having less files and it also highlights a new default_you are I config
that you can use if you ever are like, for example, generating absolute anywhere, URL
from a C I a command. This is something that you need to do. You need to set so that
those URLs generate correctly. We used to set this by setting some parameters called
config, route context. There's now this simpler way and it's advertising it right
here. Perfect. So let's Commit that. And next is security bundle. This one Has a
conflict And it's inside of config, packages, security that YAML. All right. So there
are a couple important things here. The new recipe added and enable authenticator
manager, true. This is important and in, and it enables the new security system.
We're going to talk about that later for now, set this to false so that we're still
using the old security system. It also added something called password hatchers,
which replaces encoders. But we're also going to talk about that later. So for right
now, I want you to keep

All of this config. And then once we get to the actual security upgrade, part of our
tutorial, we will talk about those. There's also a con uh, conflict down here on our
firewall. Most important thing is that the new recipe had a lazy, true that replaces
anonymous, lazy. So we can go ahead and make that change, But it works the same way.
And then we'll use the rest of our custom config. And then at the bottom, we get one
new, nice thing, new test configuration, which sets a custom password Hasher. And you
can read the, uh, comment here, but basically this makes it much faster. Th this is
a, this will accelerate your tests by making it much faster to hash passwords in the
test environment where we don't care about security quite as much. All right. So
let's add the files.

<affirmative>

Then keep going. Symfony /translation. This is not very important. It's just showing
off some new, um, configuration options that you can have. Those are all commented
out. So cool to see, but not that important. Next is Symfony /a valid, This is adding
more environment specific config. The test /validated Yael config was moved into the
main validated at Yael. So that's nice. Let's do one more right now, web profiler
bundle, Which can you guess what it did it, you added more environment specific
config. So the config from dev and test web profile at ya was moved into the main
one. And then same thing for routes. The, uh, configuration from dev was moved into a
new config routes, web profiler, Yael. So let's commit that pH, okay, we've almost
done it. Just two recipes left let's update. The next, the Webpac Encore bundle will
also give us a chance to upgrade our JavaScript to the new stimulus three version.

