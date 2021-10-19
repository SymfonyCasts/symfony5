# Firewalls Authenticator

Coming soon...

We built this log inform by making a route, a controller and rendering a template
dead simple. When we submit the form it's submits right back to `/login`. So to
authenticate the user, you might expect us to put logic right here. Like if this is a
post request, read the posted email and password query for the user object and
eventually check the password. That makes perfect sense. And also that is completely
not what we're going to do. Symfony's authentication system works in a bit of a magic
way, which I guess is fitting for our site, or at least it feels magic. At first, at
the start of every request before your controller is called Symfony executes, a set
of authenticators, the job of each authenticator is to look at the request, see if
there is any authentication information on it that it understands like a submitted
email and password or an API key that's stored on a header. And if there is use that
to find the user, check the password, if there is one and boom authentication
complete. So our job is to write in activate these authenticators, open up a 
`config/packages/security.yaml` remember the two parts of security. They are
authentication who you are and authorization. What you can do. Eight. The most
important part of this is firewalls. A firewall is all about authentication. Its job
is to figure out who you are and usually only makes sense to have one firewall. Okay,

Because you have only one user class that's true. Even if there are multiple
different ways to authenticate as that user like a login form API key or OAUTH. But
wait a second. I just said that we almost always only have one firewall and yet there
are two firewalls. So here's how this works at the start of each request. Symfony
goes down the list of firewalls and finds and chooses.

Reads the pattern key, which is a regular expression of the URL and finds first
firewall that matches the URL of this request and activates it. So there's only ever
one active firewall per request. And if you look closely, this first firewall is a
fake firewall. It basically matches the request to start with `/_profiler` and
`/_wdt` and sets security to `false`. In other words, it's basically making sure that
you don't create a security system that is so awesome that you block your handy web
Debo, toolbar and profile are down there. So in reality, we only have one real
firewall called main. It has no pattern key, which means that we'll, it will match
all other requests that don't match this first firewall. Oh, and by the way, the
names of these firewalls main and dev are totally meaningless. So most of the config
that we're going to put beneath the firewall relate, relates to activating
authenticators, those things that execute early in each request and try to
authenticate the user. We'll add some of that config. Soon, these two top keys we
have near actually not related to that system. `lazy` just allows the authentication
system to not authenticate the user until it needs to. And the `provider` ties to this
user provider thing that we talked about earlier. Don't worry about that right now,
but we'll talk more about it later.

Anyways, anytime that we want to authenticate the user, like when we submit a log in
form, we need an authenticator. There are some core authenticators that we can use,
including one for log informs. I'll show you some of those later, but to start, let's
build our own authenticator from scratch to do that, go to terminal run 

```terminal
symfony console make:auth
```

As you can see here, you can select "Login form authenticator"
to kind of cheat and generate a bunch of code where you're going to
sec select an "Empty authenticator" and let's call it `LoginFormAuthenticator`.
Awesome. This did two things. It created a new class and it also updated `security.yaml`
that GMO will check out. Both things. Start with the class it's down here in 
`src/Security/LoginFormAuthenticator`, all authenticators need to implement an
`AuthenticatorInterface` to do this. You'll commonly extend this `AbstractAuthenticator`
It implements the `AuthenticatorInterface`. And we'll talk about what
these methods do, but `AbstractAuthenticator` is nice because it fills in this one
super boring method for you.

Once we plug our new class into the security system at the beginning of every
request, Symfony, we'll call this supports method and basically ask, do you see
authentication information on this request that you understand to prove at Symfony
we'll call this let's just `dd('supports')`. Okay. So how do we tell our firewall that it
should use this as an authenticator back in `security.yaml`, we already have the
code that does this, this `custom_authenticator` line here was just added by `make:auth`.
So if you have a custom authenticator, this is how you activate it later. I'll show
you how you can even, you can have two, uh, multiple customer authenticators. If you
want. You can also have multiple authenticators. Anyways. This means that we should
be hooked up. So let's try it refresh the log in page. And it had R `dd()`. And if you
go to any URL anywhere I will hit our `dd()` eh, on every request before the controller
Symfony is now asking our authenticator. If it supports authentication on this
request, next let's fill in this authenticator logic and get our user logged in.

