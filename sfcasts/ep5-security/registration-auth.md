# Registration Auth

Coming soon...

Let's add a registration form to our site. Now here's the thing about registration
forms. They technically have nothing to do with security. Think about it. The whole
point of a registration form is just to insert new users into the database. So
creating registration form is not really any different than creating a form to insert
any data into your database and to make it even easier. We are going to cheat by
generating code run, Symfony console, make registration form. Ooh. When you're on
this, we get an error. It says missing packages, run composer required, form and
validator. And the 75 series. We haven't talked about the form component yet. And
that's in part because it's, hasn't changed much since our Symfony for tutorial.
We're not going to go into too much detail about it right now, but we do need it in
order to run this command. So let's install both of those packages.

Awesome. When that finishes run, make registration form again. Cool. All right. So
first question is, do we want to add a unique entity validation annotation to your
user class to make sure duplicate accounts aren't created you almost definitely want
to say yes so that the user gets a validation error. If they enter email that's
already taken, do you want to send an email to verify the user's email address after
registration? We're going to add this later, but I want to do it manually. So I'm
going to say no. Do you want to automatically authenticate the user after
registration? That sounds awesome, but say no, because we're also going to do that
manually boy, making us do so much work. Finally, the last question is what route
should the user be re redirected to after registration? Let's just use our homepage
route. So I'll say 16 and done. So the big changes that's made has made it
registration controller, a form type, and a template. That's going to run to that
form.

All right. So let's go check out that controller source controller, registration
controller. Again, we're not going to talk much about the form components, but on a
high level, what this does, what this controller does is it creates a user object and
then on submit it hashes the plain password that was submitted in the form and then
saves the user. This is, this is exactly the same thing we're doing in our fixtures
to create users. There's nothing special about it at all. So let's see what it looks
like. Head over to /register to say the world's ugliest form. Okay. Let's make that a
little nicer. So the tempo of this page is registration /registered at HTML twig. So
let's open that up and I'm just going to add a couple of dibs here to give it some
structure. Okay, Awesome. Then I will indent all of this form stuff to be inside of
it. And then we just need three closing devs on the bottom. Cool. That doesn't really
fix the form, but at least makes our ugly form sort of appear in the center of the
page. Oh, let me, and let me fix my typo on the margin that top. There we go.

That looks a little better, uh, to fix the form, we can actually tell a Symfony to
output the form in a way that's bootstrap five friendly. This is kind of a topic for
the form tutorial. Let's do it. Go to config packages, twig.yaml. And we can add an
option here Called forum_themes. And then we'll pass one in here called bootstrap
honors score five_score layout that .html.twig. This will make the biggest difference
and boom, the form suddenly looks nice. Let me have one more class to that
registration button so that it's not invisible. Let's add BTN dash primary. Cool. And
while we're doing stuff, we can finally hook up the sign up button to go somewhere.
So in a base study, each channel that twig Hold for a signed up, I can see this is
going nowhere. Let's now target our new route, which if you look is called
app_register. So path app under sport register. Beautiful. All right, before we try
this, I want to add one other feature to our registration form after registration. I
want to automatically authenticate my user so they don't have to register and then
log in right after. And that actually begs a really interesting question is can we
from just inside a controller, authenticate our user in the answer is yes. By auto
wiring, a service that's made specifically for this. So add a new argument up here,
type hinted with user authentication,

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

