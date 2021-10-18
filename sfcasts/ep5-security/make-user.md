# Make User

Coming soon...

No matter how your users log in, whether it's a log in form, social authentication,
OAuth, or authenticating with an API key, your security system needs some concept of
a user. Some class that describes the thing that is logged in. In other words, step
one of authentication is create that user class. And there's a command that can help
us find the terminal and run bin console. So think console make entity as a reminder,
Symfony console is just a shortcut for bin console, but because I'm using the Docker
integration with the Symfony web server, this injects my, uh, environment variables
like my database environment variable. It won't matter for this command, but it will.
When I run a command that actually talks to the database, oops, make users what I
meant to say, alright, the name of the user class, usually this is going to be user
and that's what I'll use.

But if the thing that is logging into your site is more is actually a company or
something else. Feel free to call this whatever you want. Do you want to store user
data in the database via doctrine for us? That's definitely a yes, but this is not a
requirement. You could have your data users stored on another server or across an
API. And you can answer no to this and do a little bit more work to fetch the data
from there. But we'll say yes, and then enter a property name. That will be the
unique display name for the user. I'm going to use the email for this. This is
actually not that important. And you'll see how it's used in a moment. Finally, will
this app need to hash and check user passwords?

You only need to say yes here. If it's actually your application's responsibility to
check a password that the user submit it. We actually are going to do this, but I'm
going to select no for now. And we're going to add that in a little bit later.
Alright. Enter and enter and done. Okay. What did this do? The first thing it did is
it created an entity and a repository class, the exact same things you'd normally
get. If you ran and make entity, let's go check out that new user class source
entity, user dot PHP. First and foremost, this is a normal, boring doctrine entity.
We have the annotations, we have the ID. There's nothing special about it. The only
thing that Symfony cares about is that your user class implements this user interface
actually in the whole, whole command or control. And you can actually jump into this
class to see what's inside. Now this class right now, this class really has just
three methods in it. Get user identifier, which you actually see up here on react
method, get rolls. And another one away down here called erase credentials. If you're
confused, why I I'm skipping all these other methods, it's because they're actually
deprecated in Symfony six.

This interface will only have those three methods. Get user identifier, get roles and
a risk credentials and user in our class. If we scroll down, we, the make user
command implemented all of the methods needed for us. So the first is see, is get
user identifier. This is what returns are email. This is really not that important.
If your user object ever needs to be displayed as a string get user identifier is
used. As far as I know, this is only used in the core of Symfony in one place. And
that's any web debug toolbar to show who we're logged in. As you will notice, if
you're using Symfony five, like I am, you will notice that some of the deprecated and
deprecated methods are still generated here once run on someone's Symfony six, I can
just delete these. If you're already using some basics, then they shouldn't have been
generated at all. So get roles. We're gonna talk more about this later. This deals
with the permission system and Symfony and how you deny or, uh, access to different
users on different things.

And then finally down here, we have methods, forget password and get salt, which we
don't need at all. Unless our application is actually checking user passwords, which
I said no to. So if you're on Symfony 60, you won't see either of these methods
generated though later, we are actually going to use this get password method. Once
we start checking user passwords and finally erase credentials, not very important.
We'll talk about it later. So at a high level, if you kind of, if you ignore the
deprecated methods from user interface and this not very important to raise
credentials, the only thing that our user class needs to have is basically a visual
identifier and then a method that returns the roles that this user should have. Not
really much, it's mostly just a user entity. They make user command also made one
tweak to our security. .yaml file. You can see right here, it tweaked, what's called
a, it added, what's called a user provider. And user provider is an object that knows
how to load your user objects because we're using doctrine. We're using w I built an
entity provider. So it knows how to fetch our users from the database, using their
email property. This isn't actually important yet, and it's not used, but we'll talk
about where and how it's used later.

So we have a user entity which implements the user interface, and we have a little
bit of configuring our security, that GMO, that set up this user provider thing. But
that's it

What's cool about our user class is that it is our class. As long as we implement
user interface, we can add whatever else we want to it. For example, I'd like to
store, to store the first name of my users. So let's go add another property at your
terminal run. Symfony consult, make entity in, we'll edit the user entity. I'm going
to add a first name property. We'll have it be a string, 2 55 length. And I'm
actually going to say two, yes, nullable in the database to make this feel optional
for my users. And then hit, enter to stop back over to user class, no surprises this
out of the property. And then at the bottom of the class, it added the getter and
setter methods. All right, so let's go generate a migration for our new user end
state. So at my terminal I'll run Symfony console, make migration beautiful, and then
let's spin over and make sure that doesn't contain any surprises inside. Awesome,
great table user with the ID, email roles and first name property. Okay, So I'll
close this and then let's run it. Symfony console doctrine migrations migrate. Sweet.
Okay. Because the user entity class is just a normal doctrine entity. We can add
dummy users to our database using foundries and F and fixtures.

So open up the source data fixtures at fixtures dot PHP, we're using a Foundry to
help us load data. So let's create a new Foundry factory for user SWAT, your terminal
run Symfony console to make factory. And yep. We want to generate one for the user
class that created a new source factory user factory that PHP our job inside of the
get default is to make sure that all of our required properties have good default
values. So let's see here for

[inaudible]

Female say SA self faker email, and then I won't set any roles right now. And then
I'll say also set first name, do self Hong Kong, faker arrow. First name, Then over
an app fixtures. Let's create some users. I'll go down to the bottom and say, user
factory, colon, colon create one. And I'm going to create one user with a specific
email address. So I can use this user to log in later. How about emails that to Agora
admin, at example.com And then just to kind of fill out our system, I'll say user
factory colon create many and they'll create 10 more random users. Cool. Let's try
that at the terminal runs, Symfony console doctrine, fixtures load, No heirs, and
that'll run Symfony console doctrine, query SQL select star from it user. And yes,
there they are. Now that we have users, we need to add one or more ways for these
users to authenticate. Let's start by building a log in form.

