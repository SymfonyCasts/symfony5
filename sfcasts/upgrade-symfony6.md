# Upgrading to Symfony 6.0

Coming soon...

Time to upgrade to Symfony six. Woo. This is just a simple composer trick really, but
first, just in case let's run rector one more time. This time focused on our code for
Symfony. So I mention you going to go back to Rectors repository, click the Symfony
link, and we're going to steal some code that we had from earlier, Paste that into
our record PHP. And then just like we did for Symfony 5.4, Do Symfony level set list,
and then say up to Symfony 6.0 this time. Now, in theory, there shouldn't really be
any or many changes between what your code looks like for Symfony 5.4 and Symfony
six, but let's run this and see what happens. So vendor bend, rector process source,
And huh. Okay. It actually made one change. This is to a event subscriber and an
added in array type return return type. This was added because in the future, this
interface may add the, this array return type. So now our code is future compatible.
All right. So with that done, let's upgrade things again. This is just a composer
trick. We need to find change, find all these main Symfony libraries and change the
version from 5.4 star to six zero star. So let's do you that with

A little fine and replace and got it. Of course we're not touching any Symfony
libraries that have their own versioning scheme. We're just worried about the main
stuff. And this also very importantly at the bottom change, my extra Symfony require
to 6.0 star also. So we're ready. As I mentioned before, we could say composer op
Symfony /Star, but you know, I'm not going to bother with that. Let's update
everything And it fails. Check this out. One of the libraries I'm using is B dev
pager font to bundle

<affirmative>.

And it says that it requires PHP 7.2, but we are using PHP eight. And if you look
further down here, there's some errors about page found two requiring Symfony three,
four or five, but not six What's happening here is Ponta two. Version two does not
support Symfony six, Fortunately, And you can see this. If you run composer outdated
to see what our outdated packages are Bad dev has a new version 3.6. So let's go into
our composer at JSON and find that here it is, we'll change to charact 3.6. That is a
major version upgrade. So it may have some backwards compatibility changes we need to
look into. And we'll tr we'll check that out in a second, but let's track the
composer up again and yay. Huge upgrade. Woo. Everything just upgraded Symfony six.
And then at the bottom, it exploded while clearing the, Uh,

Oh, I

Think we may have missed a deprecation when we were upgrading our code. It says in
user repository, the upgrade password method void must be compatible with password
upgrade or interface

<affirmative>.

And if you want to see this In color, you can refresh the homepage and see the same
thing by the way one cool feature. One cool thing is that if you have your
configuration, correct, you've always been able to there's this new thing, uh, in
Symfony 5.4, we can actually click this, uh, here icon here to copy that entire path
to your clipboard. So now if I go back over to my editor and Type shift, shift and
paste, it'll actually copy me straight to that class and actually that exact method
where the problem is happening. So you can see here it is underlined. It is not
happy. And the reason is that upgrade password changed from requiring a user
interface to requiring a password authenticated user interface. So we just need to
change that there And that's it. Nothing else needs to change in here And back over
here. If we run peach, we bin console cache calling in clear. Now It's happy. We are
still getting some depre down here from a different library. I'm going to ignore
those. This actually come from a deprecated package that I really need to just remove
from this project entirely. We'll see that in a second.

All right. Let's see if the home pay works and it doesn't. We get attempted the low
class query builder from Ponta doctrine ORM. So it should be a surprise. We did
upgrade from Ponta to bundle two to Ponta bundle three. So this is a situation where
You're going to want to find the get up page for that. And hopefully they have an
upgrade document. This actually does has an upgrade 3.0, and it's going to kind of
tell you some information about what types of things changed. If you read into this,
what you would discover is that previously you got a whole bunch of classes From the
pager Fonta library that was now broken down into a bunch of smaller libraries. So if
you want to use this query at the, after you need to install a separate package. So
we do that with composer require Ponta /doctrine, ORM, adapter, Awesome. And now, and
refresh Another error, but this one's actually even better unknown function Ponta.
Did you forget to run composer require Ponta /twig? So the twig integration was also
moved to its own package. And so we also need to run that command. And after that's
done,

It's a live Symfony six project. Woo. If we click around things seem to be working
just fine. We did it

Right

Now over at our command line. If you run composer outdated to see all of the outdated
packages we have, Our list is now very short. One thing I want to highlight here is
can labs cany, markdown bundle that is fully upgraded, but it's been abandoned. And
you should actually, if you are using this in a real project, you should refactor it
to use twig /mark extra. I'm not going to bother doing that, but that's why that's
showing up here. But notice that the big thing here is that doct and Dal has a new
version, new major version. So, Hey, we're all we're upgrading things. Let's upgrade
that. So next we're going to upgrade doctrine Dal to its latest version. We're also
going to double check our recipe and do one final cleanup.
