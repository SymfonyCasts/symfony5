# Form Login

Coming soon...

Custom authenticator classes like this, give us tons of control. Like imagine that in
addition to email and password, you had another company I company dropdown menu, and
you needed to use the email and the company in order to for the user, doing that in
here would be dead simple. Grab the field, you use a custom query done, or you can do
something totally crazy on success. It's all right here. But a login form is a pretty
generic and common thing that many sites need. So there's actually a built in log in
form authenticator that we can just use. Let's actually open it up, hit shift shift,
and look for form log-in authenticator. The first thing I noticed is that it extends
these same base class that we are. And if you look at the methods, it's using a bunch
of kind of generic options, but ultimately it's doing the same thing. We are it's
I'll get logged in. You were all generates a URL for the login page. Authenticate
creates a passport, are they user badge, password grand jewels. And remember me badge
and CSRF token badge and authentication success on vacation failure, offload to
another class. But these ultimately do basically the same thing that we are.

So let's use this instead of our custom authenticator to do this, go to security
.yaml, and let's comment out our customer authenticators is not used anymore.

I'm also going to comment out the entry point since that was using our login form
authenticator. Instead, we're going to add a new key hair color form score. Log-in
that activates that form lot and authenticate her. Then below this, we can configure
a bunch of options and I'll show you these in a second, but two important ones are
the log-in path. What you set to the route to your login page. So for us, it's called
app login and also the check path, which is the route that you're logging form
submits to, which for us is also apparatus where logging, we submit to that same URL

And that's it to start. Let's go try it. Refresh any page and air and air that we've
seen. It says because you have multiple authenticators on firewall main. You need to
set entry point to one of them, either app security, dummy, I think hater or form
login. So this is the same thing I mentioned earlier. That's some authentic caters
have entry points and some don't. They remember me. Authenticator does not provide an
entry point, but our dummy authenticator does. And so does form login form log-ins
entry point redirects to the login page. So since we have multiple entry points, we
need to choose one and we can set entry point to form a login to use its entry point,
or you can still point it to some other custom class that implements that
authentication entry point interface. All right. Now, refresh cool. No air. So let's
try a lot log in.

Actually let's log out first, just so we can make sure that this is working cool. I'm
logged out, got to log in and oh, bad air. The key_username must be string, no given.
And you can see it's actually coming from form log enough. Any theater get
credentials. So when you use the built-in form on a score log and everything needs to
be, you need to, you need to make sure a couple of things are lined up. If you open
our login template, template security log in that HTML twig, our email field is
called email and our password field is called password. It turns out that's Symfony
expects your email or using M field to be called_username. That's why we get this
air. It's looking for this post parameter and it's not there. Fortunately, we can
configure this however, to your terminal and run Symfony console, debug config
security, to see all of our current security configuration. If you scroll up and look
for form login here it is. There are a bunch of things that you can configure that
you can use to control the form. Log-ins behavior. Two of the most important ones are
username, parameter and password parameter. Let's configure these to match what our
properties are.

So insecurity .yaml the username parameter to email password parameter, to password.
This tells it to read the email post parameter, and then it will pass whatever that
string is to our user provider to define that user, all right, let's test it. Refresh
resubmit and got ads. We are logged in. So using the foremost we're is not as
flexible as a custom authenticator. So it's your choice. Some things can be
configured. Like you can configure a bit more what happens after success, Or even
though you don't see it in this or enable CSRF protection, okay, Let's actually do
that. So right now it's actually not checking our CSR fields. Let's say enable, CSRF
true. And that's all you need to do by default. And of course it is like everything
else can, by default, as you can see in the options, this, when you enable CSRF, it
looks for a hidden field called_CSRF_token with that string authenticate use generate
it. Fortunately in our template, we were using both of those things. Exactly. So this
is just the CSR protection is just going to work.

They're all several, there are several other options that you can use to configure
this. Remember when to get this list, I just ran it debug config security. And that
shows you all of your current config plus defaults. There's actually additional
configure. That's not shown here that we can use to see that we can use the config,
colon dumps security command. Instead of showing you your actual config. This shows
you a huge list of potential config that you can have under each key. So let's see
here, this is a bigger list. So there we go form on a score. Log-in so a lot of what
you saw before, but there's also things called success handler and failure handler,
where you can take even more control of what happens on success or what happens on
failure. You do this by creating a class and making it implement blah, blah interface
and putting the service ID right here. But also later, we're going to learn kind of a
simpler way to do something custom on success or on failure by registering a listener
Anyways, apart from not even needing our and form authenticator anymore. So you could
delete this if you want it to. The core authenticator is doing one thing that our
class that our authenticator never did.

Let's see, where is it here? It is down in get credentials. It's actually taking
whatever the submitted email is in this code, credentials, username, and storing that
in the session.

It's doing that so that if authentication fails, we can read that. And pre-fill our
email box to read this key from the session, go to our controller source controller
security controller, and this authentication utils has a method for this. So let's
pass a new variable to our template called last_username. You can also call that last
email cause it's actually an email and then say authentication. Utils arrow. Get last
username. She again, it's just to help her to read this exact key on the session. Now
let me have this new variable. We can go to our template, log into HTML, twig, and up
here on our email field. I'll say value = currently curly last_username.

All right, let's try that. If I go to /login McKee, who is already stored in the
session from before it pre-fills, if I save this to something else and fail
beautiful, it's prefilled there. So the form on the score logging authenticator is
great because it's super simple. It's super easy to use, but if you need to do
something, it can't no problem. Just great, a custom authenticator class or better if
possible, hook into the authentication process, via a listener, a topic that I keep
mentioning, we're going to talk about later. Next, let's get back to authorization by
learning how to deny access in a controller in a number of different ways.

