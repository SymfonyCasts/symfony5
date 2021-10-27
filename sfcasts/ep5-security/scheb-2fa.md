# Scheb 2fa

Coming soon...

For our last topic in this tutorial, let's do something fun. We're going to have two
factor authentication, and this can take a few different forms, but the basic flow
looks like this. You're probably familiar first, the user logs in, but then instead
of actually being logged in. So instead of logging, I should have said submit and
user email and password. They're redirected to a form where they need to enter a
temporary code.

This code might be something that we just emailed or texted their phone, or it could
be a code from an authenticator app like Google authenticator or offi. Then once the
user fills in the code and submits the form, boom, now they are really logged in, in
the symphony world. We are super lucky to have a fantastic library, to help with two
factor off search for symphony to FFA, to find these Chev slash a library, scroll
down and click into the documentation which lives on symphony.com. And then let's go
down here to installation. As you can see, the live, the degradation has library is
awesome to install it. Easy enough. Composer required to FFA, where to IFA isn't
alias flex alias to the actual bundle name. So I'll find my terminal and run that

```terminal
composer require 2fa
```

Once it finishes, I'll run and get status to see that the bundle added a new
configuration file and also a new routes file. That routes file, which is config
routes, shed underscore to have a dynamical as two routes to our system. The first is
I route that's going to render the enter the code form. And the second route is the
URL that this form is going to submit to. All right, once I back the docs and keep
going down here. So step two is enable the bundle flex to that automatically. Step
three, define the routes. The recipe did that automatically. And step four is
configure the firewall. This part we do need to do

Start by copying the two factor stuff and then go over to config packages, security
dot Yammel. So this, these live anywhere under our main. I'll put it down here at the
login form and I will remove the comment what the two of and two, if I log in check
are referring to are the route names in our routes file. What this two factor key
does here is it activates a new authenticator. In this case, this authenticator is
going to be watching for form submits to that. Enter the code form that we're going
to see in a few minutes. This also has a couple of access controls, which are a good
idea. I'll copy those and put those on top of our access control. So the second one,
make sure that you can't go to slash to a bay. That's the URL that renders a form.
You can't do that unless you have this special role. That means you're right in the
middle of the two factor authentication process this up here slash log out this, just
make sure that if you want to, during that process, you can go to slash log out to
log out, but change this to public underscore access.

Finally, the last step in the configuration is to configure these security token. So
the way this works is that once we log in the two factor, once we enter submit the
login, a log from a password

[inaudible] [inaudible],

Once we submit the email and password box to log in, the two factor authentication
system is going to look at that and decide whether or not it should start the two
factor authentication process and redirect the user to the form or not. Cause if you
think about it, we want this to happen on our email and password form, but you
wouldn't want this to necessarily happen. Um, if you were using API token
authentication, so we haven't talked about it much, but technically whenever you log
in you, your logging system logs you in with a certain type of token. This top token
class here is actually the token that you're logged in. As if you use the form
underscore logging authenticator. It's a little tricky to see, but if you hit shift,
shift and search for a log in form authenticator, find the one core in the core of
symphony inside of it, it has a create authenticated token method, which returns a
new username password token. So if we log in via this authentication mechanism, and
this token is listed our Chev to Aveda yellow file, the two factor authentication
process will take over.

So let's go look at what our file looks like. So config packages should have to
factor that Yammel into the only one by fault is username, password token. And we're
going to leave that, notice this last comment down here, if you're using
authenticator based security, you have to use this one. So by default, if you use a
custom authenticator, this is the token class that you have the reason for that.
Instead, if you go into source security long and former authenticator to look at the
authenticator that we were using earlier, it extends abstract log in form
authenticator. And if you'll hold command or control that, open that and scroll down,
actually open that. And then it checked it's based class it's create authenticated.
So can creates this new post authentication dope. And so by default, this is the
token glass that you get. So the token classes aren't that important, but they kind
of identify which authentication mechanism you used. And by leveraging that and Chev
in this configuration file, you can tell the two factor authentication library, which
methods of authentication required, two factor authentication, and which don't, if
you were using a custom authenticator, if you were using two custom authenticators
and only one of them needed two factor authentication, you would actually need to
create a custom token class so that you could differentiate between the two, well, a
bit more advanced, but I wanted to mention that anyways for us. We're cool because
that's the token that we're using.

All right. So that's it for the basic setup. The next thing inside this bundle is to,
um, choose which authentication method you want. And there's kind of, there's three
choices here where there's sort of two choices. The first two choices are a standard
authenticator app like Google authenticator or offi, or you can send a code via email
or text message. I'm going to use tot P authentication, which is basically the same
as Google authenticator. Cause I'm one which will allow your user to use off the or
Google authenticator to get a code. Now, first up, and this is actually this code
lives in a separate library. Some of the copy that composer require line it's been
over and get it installed in this case, 

```terminal
composer require scheb/2fa-totp
```

there was no recipe or anything fancy. It's
just installing a library. Next, if you had back to the documentation, we are going
to enable this as a authentication as a two factor method inside of our configuration
file. So that's back in config packages, Shev two factor dynamo. I'll paste that in
there. And,

And the last step, if you look over the documentation is that your user class needs
to enable any new two factor up a two factor interface. So let's open up our user
class source entity, user dot PHB, and that two factor interface. I will then go down
to the bottom of this class and go to code generate or command and on a Mac and
choose employment methods to generate the three methods that we need. Beautiful. All
right. Here's how to UTP authentication works. I can kind of see it over in their
documentation. Each user's going to have each user that decides to activate two
factor authentication is going to have a T O T P secret a random string that stored
on a property. This will be used to help validate the code when they enter it. It's
also going to be used to help the user set up their authenticator app. When they
first activate two factor authentication, then these methods on here are fairly
straight forward. You can listen to it returns whether or not authentication is
enabled, which if that two PT secret is set up, it means it's enabled. Otherwise. It
means a user has not enabled it. We also may get to UTP authentication username. This
is used, um, this is used to

Help build what the QR code looks like. And then finally down here, there's this TTB
configuration, which kind of has some rules about how the, um, Code should be
generated. So I want to start by copying the TTB secret, cause we definitely need
that and then scroll up to my properties and let's add that. Then I'm going to go
back down here. And normally I add, um, new properties with a, I make entity command,
but this one have all this use, not here. I'm going to go to generate getters and
setters code, generate four T O T B secret. Cool. And then just to make this match,
my other centers I'll make the, uh, Oh, I'll make the setter, um, return this. And
actually I'm going to remove, get tot be safer. We don't actually need to get her on
it and now we're going to access it directly. All right, now let's fill in the logic
for these three methods, which I'm going to steal from over here. Now we've talked
about them. So I'll steal the is to a TP authentication enabled method.

[inaudible]

And then for the return username for us, we can say, turn this arrow. We'll say, get
user identifier and down here for get to TP authentication and be careful here. I'm
going to copy what they have and paste it. But then I'm going to do for horizontal.
Re-type this key here in a tab because that added the use statement on top for me,
but then very importantly, I'm gonna change this 28 to 30 comma six. This, these are
configuration about how this is like the number of digits and the period they're
going to use in the string. If you want to be compatible things like often and Google
authenticator, you have to use 30 comma six. If you use other values, it's those
aren't going to work.

Okay. Our user in our system gel is ready. In theory, if we set a T T B secret value
for one of our users in the database, then if we try to log in as that user, we would
be redirected to the enter your code screen, but we're missing a step next. Let's add
a way for a user to activate two factor authentication on their account when they do
we'll generate a new well, generate this to you at TPC grit and use it to show a QR
code to the user so that they can set up their authenticator app.

