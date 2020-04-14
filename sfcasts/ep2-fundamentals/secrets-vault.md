# Secrets Vault

Coming soon...

So thinking about these environment variables and deploying to production, how does
that work? Because you are going to have a bunch of environment variables and
ratification, things like this and also like your database, a username, password and
other things. So the general idea is that you get your code onto production. I'm not
going to fully tell you how to deploy right now. You get your deployed on production
and then somehow during your deployment process you create a dot and that local file
with all of your production values. So it's on a soup on the service, dead simple,
create a single file with your production values. Boom, everything works. The only
trick is that you need to thumb figure out somewhere to put these production values
so that your deployment process has access to them. You know, obviously we're not
going to commit them to the data and file that that and that local file is ignored
from get.

So I would need to take this center DSM value and maybe put it into a deploy script
somewhere so that the deploy script could create this file. And that's tricky because
you want to keep these values secrets so you don't want to just store them somewhere.
That's easy to find. There's a general concept around the, uh, around this process
right now called a secret vaults and there are actually several cloud-based faults
where you can put these values into a cloud system and then read them out later. And
Symfony itself actually has a secret's fault, which is really cool because it allows
you to commit these sensitive values to your get repository. It's safe because the
values are going to be encrypted. All right. To help us see this, I'm actually going
to go into my question controller and I'm going to add a third argument here. Type
ended with hub interface. Let's call this century hub. As I mentioned, that bundle
may purposes that bundles not to give you services that we use directly, but, but,
but I'm going to do that here, um, and dump it because it's going to be a really easy
way for us to see,

okay,

what configuration values were passing to century. So check out over here. I'm
actually going to close century. I'm going to refresh. And down here you can see it's
dumping out the century thing and it's a bit of a deep object, but if you kind of
open up the century stack and open up the client and then open up the options here.
There you can see it's got our DSN, it's got our project idea, it's got our, our
public key here. So that's showing that it's using our production configuration. All
right, so a vault. What is a vault? A vault is basically a collection of encrypted
secret values. And in Symfony you're going to have one vault for your development
environment, which is going to kind of contain a bunch of non less sensitive nice
development values. And then you're going to have a separate vault for your
production environment. So we're going to set this century DSN into a dev vault and
also a production vault. How do we do that? Find your terminal and we're going to run
a very handy command called secret set.

Oops.

Then we're going to pass this the name of the secret that we want. So for us, we're
actually going to use our century underscored BSN.

Cool. Now what I'm doing right now is because I'm in the development environment, I'm
actually sending this value into the development vault. So for the development vault
of a good, uh, value is probably just an empty string in this bundle and empty string
means that century is disabled. So I'm actually just going to hit enter here and
notice it gives me an error. No value provided a boarding. This is actually a bug in
this command that's been fixed and will be released in the next version of Symfony.
It's going to allow you to set, uh, empty values for now, I can do a little bit of a
hack here. I can do a dash at the end that tells this command to read from standard
in. And then as crazy as it sounds, I can then hit control D as in dog. And what
that's going to do is it's going to actually set that center DSN to an empty value.
Now the really important thing is because this is the first time that we've set a
secret into the fault, it actually initializes all of our secret keys. You can see
sodium keys have been generated that config secrets Def, let's actually go and look
at that.

So the secrets themselves are actually stored in this config secrets directory. You
can see we have a dev director here cause we just created the dev vault [inaudible]
and there are a few important parts to the vault. There is a public encrypt key is
actually a key internally that's used to create new secrets and then there's the the
private decrypt key. This is what's used internally to decrypt the secrets so that we
can read them. Again, this is a sensitive value and normally shouldn't be committed
to the repository. However, we usually do commit the decrypt key for the dev vault to
the repository. Because anything you're developed in your dev vault is probably not
sensitive. And you do want other developers to be actually able to read these values.
And then you'll have one file in here for every encrypted value you see the inside of
these files aren't really that interesting. Um, but there you go. Now we're gonna
repeat the same process for the prod vaults. So I'm going to clear the screen and
this time I'm gonna do such a DSN, but I'm also gonna pass the dash dash V = to
switch this to the production environment. It's going to ask me for the secret value.
I'll go over here and copy my long DSN.

Okay.

And then paste. And you don't see it here because it's hiding the secret value for
security purposes, but it did work. Now this is the exact same thing. We now have a
prod directory. It's got the same exact files in it. Um, except you notice that
there's one extra note. It says, do not commit the decryption key for the prod
environment. This right here, this D prod decrypt, that private. This file must be
present for the secrets to be decrypted, but this is not something you're going to
commit to repository. This is the one thing, one file that you need to keep a
sensitive.

Okay.

And you need to keep in your deploy script so that you can use it to decrypt your
values. If this file is not in this directory, then it's going a fail.

Yeah,

and actually you can see it's a different color here because it is being ignored from
get it's inner dot. And that local, sorry are that get ignore file. You can see it is
already set up to ignore the prod decrypt file. So I'm actually going to go over here
right now and say get status and let's get add config the secrets. So you can see
we're committing the actual individual secret themselves. Um, the both the decrypt
and encrypt key for the Delta development environment. Only the encrypt key for prod
that will allow other developers to add new keys. They won't be able to read those
keys.

Okay.

All right. So before we see this in action, we can actually list the keys by saying
secrets list. So we're going to secret list. This is going to run into development
environments and you can see that it has one inside of there and we can do a dash
dash reveal. And then that will use the um, the decrypt key to actually show us that
value. And you see its value is an empty quote. Ignore this local value thing for a
second. I'm going to talk about that. We can also do the same thing for the prod
environment and dash dash reveal to see its value. Alright, so let's check this out.
So right now we're in the development environment and Symfony, so that should read
from the development vault. And so the value that it should use should actually be
the empty string. So let's refresh here. Then I'll just go down and put on a cheat.
I'll open my dump and look at the look in the options and huh? It's still using the
production value for some reason. The reason for that. Here's why

I didn't really mention it, but if you go into config pack, does century.yaml the way
that you re reference environment variables is with the exact same syntax, his
secrets, what Symfony does internally when it sees the syntax is it first looks to
see if there's an environment variable called century DSN. If there is, it uses it.
If there is not, then it goes and looks for a secret in the vault called center DSN.
So environment variables take priority over secrets. So as soon as you identify some
environment variable that you want to convert into your secrets vault, you need to
remove it entirely as an environment variable. Never referenced that as an
environment variable anymore because we now want it to be read from the secrets
faults. So now if you go over and refresh, let's go ahead and expand our object. Once
again, client options and perfect look, everything is Nolde out.

It is now reading from our development vault. Okay, let's switch over to production
and check it there. Now normally I would change app_M to prod, but now, now that we
understand that we have is that that local file, I'm not going to modify that file.
I'm just going to override the app N in my dot and the local file. Then we'll spend
over do our big console cache clear so we clear the production cache and then move
over and refresh. And you can see our dump on top here. If I expand that, yes it is
using the value from our production vault that works because I have the production
decrypt key in my project. If I didn't have the production decrypted in my project,
that would fail.

All right, so let's take out the app [inaudible] that invent local to get back to the
development environment. And now inside our question controller, I'm gonna delete
that dump the lead. The exceptions are it, half still works and I don't need this hub
interface thing anymore. All right, so I'll spin back over and cool. My page is
working. By the way, the fact that environment variables take precedent over secrets
is actually a really handy thing because what if, for example, in our development
vault, we have, I go over to my terminal and run bin console, secret list dash dash
reveal in the development environment and my center DSN is set to an empty string.
Let's say for some reason that while I'm developing, I really did want to set century
DSN to a real value because I was testing something related to it. It would be kind
of annoying to modify the value inside of the development vaults because then I would
have to, you know, try not to commit those values. So instead if you want to override
something inside of your, I'm going to override something in your vault locally. It's
as simple as adding it to that end, that local. So if I said, send your DSN equal to
food and I run that same secrets list dash dash reveal,

can I say century to IO /[inaudible] and go back over and I run that same command
with dash dash reveal.

[inaudible] okay,

so we went over to our [inaudible]. I haven't got a logo that's centered, decent =
and pasted some real value, and I'll make this very obvious that it's a fake value
here by saying food is our key, and that has been over and run that same command
again, you're going to see that it's, it's telling you that the value is actually
empty quotes, but it's being overwritten locally. So this is actually the value that
would be used. So I'll take that out of my a. Dot. M. dot. Local vault. But that is a
great way to override local values. All right, next let's talk about something fun.
Make her bundle.

