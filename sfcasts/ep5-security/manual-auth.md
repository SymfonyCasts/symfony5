# Manual Authentication

Coming soon...



So they don't have to register and then log in right after.
And that actually begs a really interesting question is can we from just inside a
controller, authenticate our user in the answer is yes. By auto wiring, a service
that's made specifically for this. So add a new argument up here, type hinted with
user authentication,

No user authenticator interface, and I'll call it user authenticator. This class
allows you to just authenticate a user. So right before the redirect, we can say user
authenticator, pero authenticate user, and we need to pass this a couple of
arguments. The first one is the user we want authenticate, which here is this user
variable. So I'll pass the user. The second argument is an authenticator that you
want to use. So the way that this system works is that basically it's going to take
your, your user object and kind of run it through one of your authenticators. So for
example, we could kind of authenticate our user as if they went through our login
form authenticator. This is mostly used

[inaudible].

Um, if we were still using our login form authenticator, it'd be really easy to do
this because we can just auto wire that service up here, but in our security value
animal file, we're kind of like our main way of authenticating is form_log in. So
what we kind of need to do is get the authenticator service that's behind form owners
score log-in, which is a little bit trickier

[inaudible]

To find out what that service is. We need to do a little bit of digging let's, run
Symfony console, debug container, and search it for form_login inside of here. You're
going to see a service called security authenticator form. Log-in main, main is the
name of our firewall. This is the ID of the service that we want to use. If I hit one
here, you can see that it is an instance of the form blogging, authentic here, which
is a core class that we looked at earlier. Okay. So what we can do then is we can add
another argument to our controller called form log-in authenticator. I'll call it
form logging authenticator, and then down here, we'll pass form log and authenticator
to authenticate user. And the last argument it needs here is a request object, which
we already have in the controller because it is our first argument to our controller.
So That's it. And actually one of the cool things about authenticate user is that
because we're using a or passing an authenticator, this extra returns, a response
actually called the on authentication success of that authenticator and returns that
response. So instead of redirecting the homepage, we can actually just return this
and wherever that, uh, authenticator normally redirects to our, we will redirect
there as well, which is just going to be the homepage.

All right, let's try it. Refresh the registration form to be greeted with an awesome
air, cannot auto where argument log in form authenticator. So we did type it, that
argument correctly with its class, which is form log-in authenticator, but the
foreign logging authenticator is not a service that can be auto wired. So we need to
kind of configure this manually. Fortunately, if we didn't already know it yet, the
error message gives us a great hint here. It says no such service exists. Maybe you
should alias this class through the existing security authenticator form log-in main
service. It's basically give us the ID of the service that we should, uh, wire, The
way I'm going to do this is I'm going to copy the argument name, form logon
authenticator, and then go open my config services .yaml I'll put her_score faults.
I'm going to add a new bind called dollar sign and form log and authenticator set to
at, and then I'll go copy that long service name and paste it here. So this says,
whenever somebody a service uses the form, logging authenticator argument, pass it,
this service that will get rid of our air. No. Okay. Let's finally try it.

[inaudible]

Let's register a new user, Any password as long as it's six characters and we got it.
I know it works. Look down here. We are logged in as Merlin. I feel the magical
power. Okay. Next let's talk about sometimes denying access is not as simple as just
checking a role. For example, if we had an edit page for a question, then we need to
make it so that only the owners, the original creator of that question can edit it to
do that. We are going to discover a super powerful system inside Symfony called
voters.
