# PHP 8

Coming soon...

So let's keep track of our goal. Now that we've upgraded to Symfony 5.4, as soon as
we remove all of these depre, we can safely upgrade to Symfony six, but Symfony six
requires pH P eight and I've been building this project In PHP seven. So the next
step is to update any of our code to be PHP eight compatible. And for the most part,
that actually means updating some of our code to use some of the cool new P HPA
features. Yay. This is another spot where rec can help us. So open up the rector PHP
file and remove the Three simply upgrade lines Instead, replace it with level set
list, Call on:up to PHP eight. So just like with Symfony, you can, You can upgrade
specifically to PHP 7.3 or 7.4, but they have these nice up two. So that'll upgrade
everything in our code. Um, they'll upgrade our code across all versions of PHP up to
PHP 8.0. And that's all we need. So over the terminal, I'll remind you, We committed.
We've committed all of our changes, except for that one we just made. So now we can
run vendor bend rector,

Cross this, endpoint it at the source directory. Let's see what this does. Cool.
Okay. We're going to walk through some of these changes, But if you want to look even
deeper, You can search for A GI rector blog post, which actually shows you how to do
what we just did, But also gives you more information about what directly did from
behind the SWS. For example, one of the changes that it makes is it changes from
switch statements to use a new PPA match function. Uh, and it explains lots of other
things.

The most important one, the most common one is actually, um, these thing called
promoted properties. This is one of my favorite features in P B eight. And you can
see it right on top of here. So in PPA, you can actually put a private or public or
protected keyword, right before an argument of the construction and that creates and
sets the property. So you no longer need to create a property manually or set it
below just adding that creates the property and sets it all at once. So it makes your
instructors just easier to read. The vast majority of the changes in this file are
exactly that here's another example in markdown helper. Most of the other functions
changes are pretty small. We're using it does change some of our callback functions
to use the new short->syntax. That's actually from PHP 7.4, you can see down here, an
example of refactoring switch statements to use the new match function. All of this
is optional, But it's nice that our code has been updated to use some of these new
features. And if I skip down a little bit, this is more of the same types of changes

Cool. Inside of our entity. You'll actually see that in some cases it added property
types. The way it's doing this is in the case of roles because our property was
initialized to an array. Rector realized it's array. And so added the array type end.
In other cases like this password, it saw that it had PHP doc on it. So it added it.
Thanks to the PHP doc Though, this is actually a little bit questionable here. That
password, it should actually be nullable. Let's open up with that class source
entity, user.PHP, and scroll down a password. So right now this actually has a string
type, but that's not actually accurate. This at first is going to be Knowle. If you
look down a instructor, we don't initialize password to any value there, and we don't
initialize password to any value here. So that's going to be null. So The correct
type for this is actually a nullable string. And the reason record did this wrong is
I actually had a bug in my documentation up here. This should be string or no, We're
going to talk more about, um, property types. One of the biggest changes that I've
been doing in my code over the past year or so, um, since PHP 7.3 was released, was
adding property D types like this, both in my entity classes and also my service
classes in a few minutes, we're going to talk more about adding these property types
onto our entities. You can see rector added some, but a lot of our properties are
still missing them. And I am going to add those. It's actually going to make our code
a little bit cleaner.

All right. So since our code is now apparently ready for pH B eight, yay. Let's go
upgrade our dependencies for pH B eight. So in composing.json under the require key
here, I currently say that my project works with PHP 7.4 or eight. I'm going to
change that to just say PHP 8.0 0.2 or higher, which is the minimum version for, um,
Symfony 6.0, by the way, Symfony 6.1 requires PHP eight point. So if you are going to
upgrade to that pretty soon, you could go ahead and do all these upgrades all the way
to PHP 8.1. The other thing I have down here near the bottom, let's see, where is it?
Here we go. Where is that There? Out on our config platform, I have PHP set to 7.4
that basically in, uh, ensured that if someone using PHP eight was using my project.
When they download the new dependencies, it didn't download dependencies that were
compatible with PHP eight. It downloaded dependencies that were compatible with 7.4.
I need to lane that better. Anyways. Now we'll change this to 8.0 0.2. Great. And now
because we are using a new version of PHP in our project, there's a good chance. Some
dependencies will be able to be updated. So let's run composer up.

And in fact, yeah, there was several. So you can see PSR cache, PSR log, and also
Symfony event, dispatcher contracts, those all upgraded. I'm guessing that all of
those new versions require PHP eight. So we couldn't upgrade before, but now we can.
And if we go over to our page and load, everything still works. And hopefully we have
a couple less deprecations maybe we do. Maybe we don't, but our code is a little bit
more ready by the way. One other thing in composer at JSON up here is Symfony flex
it's Symfony flex uses its own version scheme, and there is now a version two of
Symfony flex At this moment. It's actually the same as version one, but version two
requires PHP eight. So now that we're using PHP eight, let's upgrade to that. So the
latest version right now is actually a 2.1. So I'll upgrade to that Carrot at 2.1 And
then send back over and we'll run composer up one more time. Beautiful. All right,
team, our project is now using PHP

Eight

To celebrate let's refactor from using annotations on our site to PHP eight native
attributes, A change that I love and a change that rector is going to make very easy.
