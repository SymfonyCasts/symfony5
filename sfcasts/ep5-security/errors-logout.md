# Errors Logout

Coming soon...

When we fail to log. When we fail login, we store the authentication exception, which
kind of explains what went wrong into the session, redirect to the login page. And
then on that page, read that out of this session, using this nice authentication util
service, ultimately in the template, we call the get message key method on that,
which renders a safe message that describes what went wrong. Like if we enter an
email that doesn't exist, we get this username could not be found message, which
means something went wrong, trying to actually load the user. That's cool. But for
us, this isn't a great message because we're logging in via an email. If we enter an
inbound, if we use a valid user, have Rocca admin, as example.com with an invalid
password, we see invalid credentials, which is better, but not super friendly. So how
can we customize these? The answer is both simple and maybe a bit surprising. We
translate them, check it out over in our template. We're going to say, Erin, that
message key pipe trans, to translate it, or they're going to pass this two arguments.

The first is air that message data. This is not really important, but if you in the
translation world, sometimes you can have your translation. Key can have wild cards
in it. And then you pass those smiles wild cards via air, not message data, not
actually sure if any of the core air messages use this, but it's a safe thing to
have. The second thing we're gonna pass here is what's called a translation domain
called security. The reason we're doing this is if you do have a multi-lingual site,
then all of these core messages are already translated to other languages. So by
using the security domain here, it will automatically look up those messages in
whatever language you have and automatically translate them. You're going, of course
customize them, but they will be translated out of the box.

In our case, if we just did this, it wouldn't do anything yet. But now, because we're
going through the translator, we have the opportunity to translate them from this
English to different days, English. The way we do that is in the translations
directory, which we have because create a new file called security back in .yaml you
can also create Exela files. You prefer that Yamhill is just the simplest format
inside of here. I'm going to copy the exact error message. We have included a period,
wrap that in quotes to be safe. Let's set it to something different like invalid
password entered.

Awesome. Let's try it again. So I will log in as Agora, admin, invalid password, and
much better, or let's try that bad email message. So same thing once we get it, we'll
copy exactly. Go over to our translation file and then change it to something a
little more. User-friendly like email, not found. Let me try it again. Any password,
got it. Email not found. Awesome. Okay. And our authenticator is done. We load the
user from the email, check their password and handle both success and failure. We are
going to add more stuff to this later, including checking real user passwords instead
of just using the same for all of them, but this is now fully functional. So let's
add a way to log out to do this. No surprise. We first need to create a route and
controller for /log out. So I'll put this inside of my security controller. I'll be
lazy and actually copy the log in and controller we'll change it to log out, happen
to score, log out and we'll call it a method log out also. But there's one surprise
here.

We don't actually do anything in this method. So you might expect me instead of here
to call some Symfony function that says, log the user out. Instead, I'm just going to
throw a new exception that says log out should never be reached. How is that
possible? Well, the log out works a little bit like the log in. We don't put the
logic in the controller. We activate something in our firewall that is going to watch
for this URL. And when we go here, intercept the request in log the user out to
activate that thing. We go to config packages, security .yaml and anywhere under our
firewall, we simply say, log out true. This aggravates, a listener, that's looking
for the /log out URL. And actually, instead of just saying, log-out true, you can
customize this. You can customize this, check it out, go to your terminal.

And Ron Symfony console, debug config security. As a reminder, this is a command that
will show you all of your current configuration under these security route key. So
everything is under security. So include all of our config here, but it also fill in
it. Also show us some defaults that it's assuming. So if we run this and let's see
here's our main firewall and check it out under log out, all of these keys are the
default values. Notice there's one called path /log out. So this is why it's
listening to /log out. If you wanted to log out via another URL, you would just tweak
this key here and suddenly it would be looking for that other URL. But since we have
/log out here and that matches our /log right here, this should work by the way. If
you're wondering why we need a route control here, we actually don't need a
controller. We just need a route. If you don't have a route, then the, um, user will
get a 4 0 4 page before the lockout listener can intercept the request. So you need a
route, but you don't actually need a controller.

All right, let's try this flow. So let me actually log in first, okay. With password
and we are successfully along then now I would manually to /log out and got it. So
you can see where logged out. And by default the log out lesson and redirects it back
to the homepage. If you need to customize that behavior again, there are several
options that you can put onto the log on key, for example, targets /to go somewhere
else. This can also be a route name, But we can also hook into this process via any
event listener, a topic we'll talk about towards the end of the tutorial. All right,
next, let's add real passwords to our system, which will involve hashing those
passwords in order to store them securely in the database and securely checking those
during our authentication process, Symfony makes both of those things easy.

