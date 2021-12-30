# 2fa with TOTP (Time-Based One Time Password)

Coming soon...

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
class source entity, user.PHP, and that two factor interface. I will then go down
to the bottom of this class and go to code generate or Command + N on a Mac and
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
back down here. And normally I add, um, new properties with a, I `make:entity`
command,
but this one have all this use, not here. I'm going to go to generate getters and
setters code, generate four T O T B secret. Cool. And then just to make this match,
my other centers I'll make the, uh, Oh, I'll make the setter, um, return this. And
actually I'm going to remove, get tot be safer. We don't actually need to get her on
it and now we're going to access it directly. All right, now let's fill in the logic
for these three methods, which I'm going to steal from over here. Now we've talked
about them. So I'll steal the is to a TP authentication enabled method.

[inaudible]

And then for the return username for us, we can say, turn $this->. We'll say, get
user identifier and down here for get to TP authentication and be careful here. I'm
going to copy what they have and paste it. But then I'm going to do for horizontal.
Re-type this key here in a tab because that added the use statement on top for me,
but then very importantly, I'm going to change this 28 to 30 comma six. This, these
are
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
