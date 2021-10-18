# Fetch User

Coming soon...

One of the things that you can do on our site is upvote and downvote individual
answers right now. You don't even need to be logged in to do this. Let's change that
let's find the controller that handles that AGS call. It is a source controller
answer controller. It's this answer vote action. All right. So if we want to require
you to be logged in, in order to use this Ajax endpoint, I'm going to use the
annotations method here. I want to go down, make sure I go down here and hit tab
because that's going to add the you statement up here for that annotation. And then
I'm going to use is authenticated. Remember because I'm using the river, remember me
system. This is really what I want to check in order to just know if the user is
logged in.

Of course we stopped there. I won't be able to vote anymore, but it's going to look a
little funny on the front end because these vote links are still there for me. So
let's hide those as well. The template that whole, that section is templates. Answer
underscore, answer dot HTML, twig. And let's see down here, here we go. Here are the
vote arrow. So we basically want to hide this entire div section. We'll do the same
thing. If is granted authenticated remembered, then I'll find the closing part of
this div. There it is down here. That's the end of when we refreshed beautiful vote
links are gone.

Okay. So in a real app, when we save the vote to the database, we would probably also
store a who voted in the database, maybe to prevent users from voting multiple times
on an answer. We're not going to do that right now, but let's try something simpler.
Let's log a message that includes the email address of who is voting. But wait, how
do we find out who is logged in and Symfony easy peasy in a controller. We can use a,
this->get user shortcut, check this out right on top. I'll say logger->info.

And then I'm gonna put a little message here. User is voting on answer, answer, and I
want to pass a second argument here, which is called a logger context. So I'm showing
a couple of, kind of cool things here. Um, you can pass a second argument in a longer
methods just to store, just to store extra data with that log message. And for
example, I can set answer to answer arrow, get ID. And if you use this nifty curly
brace answer, curly brace format, then whatever the value is here will actually be
swapped in right there. We'll see that in a second. All right. So for the user, in
order to get the current user, we can say this arrow, get This arrow, get user it's
that easy. So that gives us the user object, and then we can call a method on it,
like get user identifier, which we know is going to be our email. Cool. Let's try
that. All I need to do is, well, first log in. There we go. Okay. Back to the log-in
page, I was kind of playing with earlier, go back here and vote, and then I can open
the profiler for that really easily down here

And under logs, beautiful abraca admin example that is voting on answer 4 98. Sweet.
So, one thing to remember is that this->get user is going to return our user object,
which means that we can call whatever, whatever methods we want on it. For example,
we know that our user class, as they get email method on it, so that will work. I
noticed that did not auto complete for me. That's because this user shortcut in our
base controller, I opened it up. It advertises that it returns a user interface,
which is, which is true. But more specifically, we know this is going to return our
user entity. Unfortunately, the peach Radack above it, doesn't really advertise that.
So we don't get nice auto-completion. So, because they use this->get user a lot in my
controllers, I usually put a fix for this. The fix is by creating a base controller.
So instead of the controller directory, I'm going to create a new class called the
base controller.

You can make this abstract if you want, because we're not actually going to ever use
this directly. And we're going to make this extended abstract controller. This is
just kind of a nice pattern in general, because you can add extra shortcut methods in
your base controller. And then in all of your individual controllers, you can extend
that and get those shortcut methods. So I'll extend it only an answer controller now,
but along the way, I'll extend the base controller. Whenever I need to. Anyways, if
we stop now, this doesn't change anything at all, because base controller just
extends abstract controller, but like I mentioned, we can add more shortcut methods
in here or in this case, what we want to do is basically add some code that helps our
editor understand that they get user shortcut method that lives in abstract
controller returns our user class, not just a user interface to do that above the
class. We can add an add method and then user out of the cleaner using anonymity and
then say, get user that's a special syntax that basically said we have a method
called get user. It returns a user object. So an answer controller, if I go back here
and read type kid email, you can see it does see that because it knows get user is
going to return our user object. Okay,

Cool. So the way that you get the user and the controller is this->get user, but
there are, but there are a few other places that we usually want to get the user like
twig. So let's have back into based on HTML that twig. And let's see right here, this
is where we render our log out and log in link. So just to see if we can do it, let's
run your arm. The first name of the user right here and twig. Remember we have that
global variable called app, which has lots of useful stuff on it. One of the useful
things we have on it is app that user, which is the current user object. So we can
say app that user dot first name. This is safe to call because we are inside of this
is granted check. If we weren't, we weren't logged in and app, that user would be no.
All right, let's try that. Close the profiler refresh page and perfect. Apparently my
name is Trimont Tremaine. Let's use our user object and Twitter to make this a little
fancier inside of is the, is granted check. I'm going to paste in a big user menu.
You can get this from the code block on this page. This is actually completely
hard-coded, but it's going to give us a nice little user dropped down like that.
Okay.

[inaudible]

Let's make it dynamic. So there are a couple parts I'm using a little, uh, API for
the, um, avatar. We just need to take out the John DOE part here and print out the
user's first name. So I'll say app that user dot first name, and then we can pipe
that into a URL in code method, which is kinda cool and definitely all down here.
I'll also say like really app that user dot first. Cool. And then for the log out
link, we will I'll steal the path function below and paste that here. Awesome. Now in
a dual lead, my old stuff down here. And if we try it while we have a real dropdown
menu, real user, many with AOL log out link,

Well, we can do some even cooler stuff with our user class because after user is our
user class, we're free to add whatever methods to it that we want. So for example,
generating the user to avatar. Maybe that's something that we do in a couple places
on the site. So we don't want to have this whole long string kind of hard coded here.
So I'm going to kind of copy this and I'm going to refactor an, add a method insomnia
user class to make that easier. So let's open up source entity, user dot PHP, and all
the way at the bottom, how I'm going to create public function, get avatar. You are
I, and I'll allow the size of it to be passed in, which is one of the query
parameters and all the fault at the third two. And this will return a string. So as a
reminder, that's kind of like what the URL looks like right there. So I'm going to
return kind of the beginning part of this string, And then to build the, what are
your parameters we can use? PHP is HTTP build a query method and just pass it and
array of all of the

Pieces. So named we'll set this to this arrow, get first name. Uh, but actually now
that we're in here, we can be a little smarter. First name is technically a N the
first name method, first name, property. If we scroll up is actually allowed to be
no. So that's gonna be something that we allow users to fill in, but they won't
necessarily have to fill it in. So I'm gonna make this smart and say, let's use the
get first name, method, Or fall back to using the user's email address. And then for
size, Which is the second query of down, we have size and background so size, I'll
set that to whatever the size argument is. And then we are going to make the
background random all the time. Cause that's fun.

Cool. So that's a nice little method there and we can now use this back in base that
HTML, twig, we can delete all of that and say, app that user, that avatar your eye,
you can also say, get avatar you or I, or you can kind of treat it like a property
like this dry try that it breaks. Oh, I know why because, and user, I forgot to put
the little question, mark, H you go query to build all the ampersand, but we still
need the question mark there much better, but we can do even more here in based
study. So it's quick, I'm using app that use it at first name, as we mentioned it,
sometimes that might be empty. So let's also add one more helper method here just to
keep making our user class richer and richer called get dispo, get display name,
which will return a string.

Very simple. I'm going to kind of steal my logic from above and return that. So we
either return the first name or the email, and we can use this up and get avatar your
well, get a display name, and then also use it in based at .html.twig, which is cool
and want to refresh. It still looks the same. All right. So we have now fetched the
user object in the controller via this arrogant user. We fetched the object in twig
via app that user, the only other place that you're going to need to fetch the user
object is from within a service. That's not a controller. For example, a couple of
tutorials ago, we created this markdown helper service. We pass it markdown. It
converts that into markdown and returns. It let's pretend that we need the user
object inside of this method. We're going to use it just to log another message.

So if you need the user, the currently authenticated user object, the way to get it
is by Ottawa, a service called security. So I'm going to add a new argument here
called security, the one from Symfony components security. Then I'll hit all enter
and go to initialize properties to create that property and set it notice I'm on PHP
7.4. So I've started to add my property type. Hence now down here, I'm going to log a
message. If the user is logged in, because these are may or may not be logged in at
this point, do that. Cause I, if this->is security arrow, get user, then we'll log
something. So this is the way that you get the current user object. And if the user
is not logged in, then you can then it will return null. So another it's kind of a
more direct way to do this is we could also say is granted that's another methods on
the security class and we can check for is authenticated remembered, but that would
effectively be the same as checking to see if there is a user object at all.

So if there is, well, log a message rendering markdown for probably race user, then
we'll pass that context. Second argument and set user to this->security arrow, get
user arrow. And like before we know this is going to be our user object, but it only
augments the user interface. So we could use get email here. That's that will work.
I'll stick with user identifier, which is going to give us the same thing anyways.
Awesome. So let's check that out. We have markdown on this page so I can refresh
anything down here to jump into the profile of this page, go to logs and yes, we have
a bunch of, uh, renderings for that. All right. Next, I'm sort of got a cool feature
in Symfony related to roles called a role hierarchy where you can make where if the
user has one role, you can also automatically give them other roles.

