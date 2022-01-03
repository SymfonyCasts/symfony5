# Customize The 2-Factor Auth Form

Coming soon...

All right, let me open my off the app and
type in a valid code. Boom, , and access. Granted it works so cool,
but we have to make that two factor authentication form less ugly. Let me log out
again, log back in

And boom, here we go. Back to our two factor authentication code. So how can we
customize what this template looks like? Oh, of course the documentation tells you,
but on the cool way to look at this is to look at the configuration for this bundle.
So I'm going to run Symfony console, debug config, and then I'm going to go to my
configuration file and copy the root key Chev two factor. So there's a matter of
debugging is going to show me what my current configuration is for this bundle. Cool.
So you can see a security tokens has username, password token. That's no surprise
because that's what we have here, but this also fills in some default values that we
have not specifically filled in and most important. One is the template. This is the
template that's currently being rendered for this page. Let's go check that out. I'll
copy most of the file name here. I'll shift, shift paste and cool. Here's that
template. So it gets fairly basic. We have an authentication air variable if we type
in an invalid code, and then it's basically just a form that has an action to the
correct path

And an input and a submit

[inaudible]

All right. So I'm going to leave this here for now. And we're going to start
customizing this by creating our own new templates. So I'm going to go down into the
templates /security directory. Let's create a new file here called to FAA
underscore form .html.twig I'm going to paste in a structure, get us
started. Uh, I'm extending base .html.twig, but otherwise there's nothing dynamic
in here yet. You can say I have a big to-do where we'll put the form a second now up
in our config packages, Chev underscored TFA dynamo went on to say template and we'll
point to our template, which is a security /two FAA form that age to tumor that
twig. So with any we refresh Tara, it uses our template Is that you can see the form
to do one cool thing you can see now is that we sort of are authenticated, but with
this special two factor token

[inaudible].

But if you look, we don't have any roles in everywhere in the system, we're going to
look not authenticated. So we sort of our authentication, but we're not actually
going to have access to anywhere on the site. You can even see this down here. If we
scroll all the way down, all of the, um, access decision for like is authenticated
remembered and our all access denied. Anyways, let's fill in the form to do parts. So
for this, I'm going to go steal the core templates. I'm going to copy all of this and
paste it into my form to do. Now. It's just a matter of customizing this. However, we
need to assault change this P to a div class = alert, alert air. Then down here,
you can actually have multiple different ways to authenticate. Uh, we're not going to
do that. So I'm going to delete this entire section here For the input we need. Class
= form-control. Then all the way down here, I'll leave these display
trusted options and is CSR protection enabled. Those are things that you can use. If
you activate them, then they'll show up here. I'm going to delete this P tag. We'll
change this to be a button type = submit.

And then I'll add a couple of Classes to it. I'm also going to move this log out,
link a little further up

[inaudible]

And just like the four element I remove that P tag, let's say a class = BTN BTN
dash link. And with any luck that should make it look fairly good or fresh this time.
Awesome. A little extra quotation on my log in. I always do that. There we go. Okay,
Cool. That looks better. All right. So if I type in an invalid code here, We get an
error. Although that's not quite as red as I wanted it course, this is why we test
things. Perfect mic. Now we get the error in red.

If I type in a valid code for my off the app, we've got it. Okay. Friends. We made
it. Congratulations. I think security is supposed to be kind of a dry, boring topic,
but I absolutely love this stuff. I hope you enjoy the journey as much as I did. If
there's something we didn't cover, you still have some questions. Let us know down in
the comments. We're there. We're there for you in the comments and watch for an extra
credit security tutorial. Soon that we'll cover a few more topics like API token
authentication our friends. See you next time.

---> Mention backup codes, etc
