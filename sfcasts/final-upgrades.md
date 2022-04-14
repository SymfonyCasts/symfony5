# Some Final Upgrades

Coming soon...

While we're doing all of these major upgrades, we might as well make sure everything
is upgraded. When we run composure outdated, it tells us the stuff that we still need
to update. As I mentioned, we're going to ignore the KP labs markdown bundle. But if
you have that in a project, you should refactor that to use the new twig markdown
extra. But what I'm checking out here is doctrine. Dal has a new major version, So
let's upgrade to it To figure out why it didn't automatically upgrade. When we ran
composer, let's run composer, Y-not doctrine /Dal, and then pass it to version number
like three. So why can't we install doctrine Dal version three? And the answer is
That apparently We are holding it back. And this says our project is requiring
doctrine Dal two 13.

Whoops.

All right. So let's head over to our composer adjacent file and sure enough, there it
is two 13. Let's change that to the latest three, three. All right. Moment of truth,
composer up Woo, and updated And composer outdated. Other than the markdown bundle
it's empty. Yay. So what we did was just a major version upgrade. So it does contain
backwards compatibility breaks. So you want to look into its, uh, change log a bit
deeper, but, uh, I can tell you that it mostly just affects you if you are running
doctrine, Dal queries directly, which typically when you're using the doctrine ORM
with entities, you're not doing that On our site. We seem to be just fine. Okay. Now
that we've just upgraded from Symfony 5.4 to 6.0. It's possible that some recipes
have a new version that we can upgrade to Let's run composer recipes Update. Oh, of
course. I need to commit my changes. Upgrading doctrine Bal From two to three.
Perfect. Now I run composer recipes, update and cool. There are actually two Start
with Symfony routing. Okay. Finish with a conflict from get status. Only change the
file. It changes config /routes. Yamo so let's check that out. And okay. So
previously I had this, just this commented out, um, route here and it added this
controllers and kernel imports. Let's keep their changes.

What these are doing are actually importing our route annotations or attributes from
the source /controller directory. And also you can put, if you want to, you can
actually put routes in your source kernel file. It says type annotation here, but
this is actually an importer that's able to load annotations or attribute. So nice
thing is in Symfony six, You can load attributes in particular without any external
library. It's just part of the routing system. And so we put these route imports
right in our main config routes.YAML. So let's go ahead and commit that

Because

This is going to make even more sense after we upgrade the last recipe. Perfect. So
we're going to compose our recipes update and let's update doctorate, annotations
recipe And check out what it did. It deleted config routes, annotation ya.

And if you look at that, that actually contains those two lines that we just added. I
should bring that a little higher on the screen. So basically what happened here is
that previously, when we only had annotation routes, we needed the doctrine.
Annotations law library enable to be, to be able to import them. So we only gave you
these imports once you installed the doctrine annotations library. But now that we
use route attributes, that's not true. You don't even need the doctrine annotations
library anymore. And so just by installing Symfony's routing components, we give you
these lines, which are able to load attributes, route attributes From our control,
the classes and our controller directory. Look over here, nothing changes on a front
end, all of our routes still work. All right, finally, now that we're on Symfony six,

We can remove some code that was only needed to keep things working on Symfony five.
We don't have a lot of this that I'm aware of. The only code I'm aware of is in
user.PHP. So as I mentioned in Symfony six, the user interface, if I actually jump
and click into that, it renamed get username to get user identifier in Symfony 5.4 to
remove the deprecations, but keep your code working. You actually need to have both.
You need to have the new one and the old one, but as soon as you get on some 26, you
don't need the old one anymore. Just make sure that you aren't calling it directly in
your code somewhere. One other spot down here is, uh, let's see here, get salt. This
is an old method related to how you hash passwords and it's no longer needed on
Symfony six Modern password hashing algorithms take care of the salting themselves.
So let's just a totally unused method. So yay. That's it team. We're done Symfony six
app fully upgraded app, upgraded recipes, pH B a code pH eight attributes instead of
annotations. That was a ton of stuff. And we just modernized our code base. Big time.

Get yourself ate fresh pizza to celebrate. Then come back. Cuz I want to take a quick
test drive of a few more features that we haven't talked about next.
