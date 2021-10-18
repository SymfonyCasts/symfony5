# Auth Errors

Coming soon...

Go back to the log and form. What happens if we fail login right now, there are two
ways to fail. Logging in first is if we can't find a user for the email and the
second is if the password is wrong, let's try wrong password first. So we use our
real users from the database and then just some other password. Yep. We hit our D D
this comes from on authentication failure. So no matter how we fail authentication,
we end up here and we're past an exception argument. Let's also dump that. All right,
go back and refresh. Cool. It's a bad credentials exception. All right. So here's the
deal. If authentication fails, no matter how it fails, we're going to get some sort
of authentication, exception, bad credentials. Exception is actually a subclass of
that. And so is user not found exception that we're throwing from our custom user
loader. All of these exception classes have one important thing in common. I'll
actually hold command or control to open up using that found exception to see it. All
of these authentication exceptions have a special get message, key method That
contains a safe explanation of why authentication failed.

Alright, so since we were throwing, using not found exception, if we try wrong, E if
we enter a wrong email, let's actually go see that on a log and form. So,

But in some invalid email address and enter an, oh, this is a little surprising. We
still get a bad credentials exception. I was kind of expecting us to get our user not
found exception. And for the most part, that's how this works. If you throw some sort
of authentication exception during the authentic authenticate process, that exception
is passed to you down in authentication failure. So you can use it to figure out what
went wrong. However, the user not found exception is a special case on some sites you
might, when the user enters an invalid email address, you might not want to expose
whether or not that email was found or not in your system.

Some sites, this is called user a numeration. So for some sites exposing that that
email wasn't was, or wasn't found could be a problem on other sites. You do want to
expose that the email wasn't found cause it helps the user figure out what's going
wrong. So by default, we do Symfony converts that user not found exception to a bad
credentials exception so that no matter how you fail on occasion, you get kind of the
same error message. If you do want to differentiate those two, you can do it, go into
config, packages, security .yaml. And anywhere on here, we're going to add a hide
user, not found option set to false. This tells Symfony not to try to convert this
user. Not found exception to a bad credentials, exception. I refresh now, boom, there
we get, let me see. Our user not found exception is now being passed to us.

All right. So let's think down, down here, when we fell off on occasion, what do we
want to do? Like our job in this method is as you can see, to return a response
object for a long inform, what we want to do is redirect back to the login page and
show the error two, in order to show the error let's stash this exception into these
temporarily into the session, check it out to get the session we can say, request
arrow, get session. And then we will say set, and we can really use whatever key we
want here, but there's kind of a standard key that we use instead of Symfony to store
authentication errors. And you can get it from a constant, so type into a security
class, the one from Symfony components, and then use an authentication error key on
there in the past at the entire exception object.

Now they've got that stored in the session. We're just going to redirect back to the
log in page. So I'll cheat and copy my redirect response from earlier and change the
route to app_log in. Okay. So this will redirect back to the login page, which means
that over inside of our login controller, we need read that air and then show it. So
the most straightforward way to do this would be to grab the session and read out
this key. It's actually even easier than that. Symfony provides a service to fats
that, to get, to grab that key automatically. So I had a new argument type ended with
authentication utils and then it passed the second argument to render and let's pass
in an error variable set to authentication utils arrow, get last authentication
error. That's just a shortcut to read that key off of the session.

So what this err variable is going to be is literally this authentication exception
object, and remember it to fig to get each of all those authentication exception
objects, have a get message, key method that will explain what went wrong. This means
that in our template, logging that HTML twig, we can render that. So right after the
H one, we'll say if air and Def and here I'll add a div alert danger, and inside of
say error dot message key. You don't want to use air message because if you have some
sort of internal database error or something like that, and I would actually print
that database message, erudite message key is always guaranteed to be a safe message
to show to your users. All right, let's try this refresh. And as we're on /login and
we see username could not be found, that's the built-in message. If the user can't be
loaded, but I'll admit that's not a super great message since we are using an email,
not a username. So let's learn how to customize these error messages next and add a
way to log out.

