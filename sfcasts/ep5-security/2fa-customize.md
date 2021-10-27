# 2fa Customize

Coming soon...

[inaudible]

Okay. Status check. Any user can now enable two factor authentication on their
account by clicking this link behind the scenes. When they click that

[inaudible]

We populate the T O T P secret on the T T B secret on the user user object. Save that
to the database and then render a Q R code that the user can scan. This QR code is
basically a fancy image that contains two pieces of information. The first is the
email of our user, or more specifically, if I scroll down to our Tio teepee functions
or they are whatever we returned from, get Tio teepee authentication username. The
second is the T O T P secret in a minute, we're going to, I'm going to scan this code
with an authenticator app, which will allow me to generate the correct two factor
authentication code when I log in. But first there is some extra info that you can
add to your key QR code, head over to config packages, Shev, TFA dot Yammel under
TNTP. One of the most important things that you can add is called an issuer. I'm
going to set this to call grin overflow. If you want to learn more, all the things
that you can, the extra information you can put here, you can check out the bundle or
just read about tot PF and occasion.

But the important thing is when we refresh, watch the image, it's going to change
slightly Internally. In addition to the email and the QTP secret, there is also a
piece of issuer data inside. That is your data is going to help my authenticator app
to have a more helpful icon when I scan it. Okay. So at this point, if we really were
this user, we would pull out our phone open and authenticator app like Google
authenticator or offi

[inaudible].

You can't see it, but I'm opening up my authenticator off the author right now. And
it's scanning this code.

[inaudible]

It reads when I scan it, it read that data, including the issuer name, called an
overflow and see the icon ready in my app. So we are ready. Let's try the whole flow.
So log out, pretend like we're logging in as this user tomorrow. So I'll go to login
The user we're working as Africa, admin, at example.com password ta-da. And yes,
instead of actually being logged in we're redirected to the two factor authentication
page. This happened for two reasons. First, the user has two factor authentication
enabled specifically this users is Tio authentication, enabled method returned. True.
Second, the token of the authenticated user, that sort of internal Object that your
user gets on that log in matches. One of the tokens that I have in my configuration
file specifically, it's the username password token. When we log in using form
underscore login. So this page, if we try going anywhere else in the site, it kicks
us right back here. The only place we can go is to slash log out. If we wanted to
cancel the process, this page is ugly, but we'll fix that soon. All right, let me
open my off the app and type in a valid code. Boom, 5 3, 9, 9 2, 2, and access.
Granted it works so cool, but we have to make that two factor authentication form
less ugly. Let me log out again, log back in

And boom, here we go. Back to our two factor authentication code. So how can we
customize what this template looks like? Oh, of course the documentation tells you,
but on the cool way to look at this is to look at the configuration for this bundle.
So I'm gonna run symphony console, debug config, and then I'm gonna go to my
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
templates slash security directory. Let's create a new file here called to FAA
underscore form that HTML, that twig I'm going to paste in a structure, get us
started. Uh, I'm extending base that HTML twig, but otherwise there's nothing dynamic
in here yet. You can say I have a big to-do where we'll put the form a second now up
in our config packages, Chev underscored TFA dynamo went on to say template and we'll
point to our template, which is a security slash two FAA form that age to tumor that
twig. So with any we refresh Tara, it uses our template Is that you can see the form
to do one cool thing you can see now is that we sort of are authenticated, but with
this special two factor token

[inaudible].

But if you look, we don't have any roles in everywhere in the system, we're going to
look not authenticated. So we sort of our authentication, but we're not actually
going to have access to anywhere on the site. You can even see this down here. If we
scroll all the way down, all of the, um, access decision for like is authenticated
remembered and our all access denied. Anyways, let's fill in the form to do parts. So
for this, I'm going to go steal the core templates. I'm gonna copy all of this and
paste it into my form to do. Now. It's just a matter of customizing this. However, we
need to assault change this P to a div class equals alert, alert air. Then down here,
you can actually have multiple different ways to authenticate. Uh, we're not going to
do that. So I'm going to delete this entire section here For the input we need. Class
equals form dash control. Then all the way down here, I'll leave these display
trusted options and is CSR protection enabled. Those are things that you can use. If
you activate them, then they'll show up here. I'm going to delete this P tag. We'll
change this to be a button type equals submit.

And then I'll add a couple of Classes to it. I'm also going to move this log out,
link a little further up

[inaudible]

And just like the four element I remove that P tag, let's say a class equals BTN BTN
dash link. And with any luck that should make it look fairly good or fresh this time.
Awesome. A little extra quotation on my log in. I always do that. There we go. Okay,
Cool. That looks better. All right. So if I type in an invalid code here, We get an
error. Although that's not quite as red as I wanted it course, this is why we test
things. Perfect mic. Now we get the air in red.

If I type in a valid code for my off the app, we've got it. Okay. Friends. We made
it. Congratulations. I think security is supposed to be kind of a dry, boring topic,
but I absolutely love this stuff. I hope you enjoy the journey as much as I did. If
there's something we didn't cover, you still have some questions. Let us know down in
the comments. We're there. We're there for you in the comments and watch for an extra
credit security tutorial. Soon that we'll cover a few more topics like API token
authentication our friends. See you next time.

