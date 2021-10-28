# Firewalls & Authenticators

We built this log in form by making a route, controller and rendering a template:

[[[ code('db53d89860') ]]]

Dead simple. When we submit the form, it POSTs right back to `/login`. So, to
authenticate the user, you might expect us to put some logic right here: like if
this is a POST request, read the POSTed email & password, query for the `User`
object... and eventually check the password. That makes perfect sense! And that is
*completely* not what we're going to do.

## Hello Firewalls

Symfony's authentication system works in a... bit of a magic way, which I guess is
fitting for our site. At the start of every request, before Symfony calls the
controller, the security system executes a set of "authenticators". The job of each
authenticator is to look at the request, see if there is any authentication
information that it understands - like a submitted email and password, or an API
key that's stored on a header - and if there *is*, use that to query the user and
check the password. If all that happens successfully then... boom! Authentication
complete.

*Our* job is to write and *activate* these authenticators. Open up
`config/packages/security.yaml`. Remember the two parts of security: authentication
(who you are) and authorization (what you can do).

The most important part of this file is `firewalls`:

[[[ code('bb6e00ac72') ]]]

A firewall is *all* about authentication: its job is to figure out *who* you are.
And, it usually makes sense to have only *one* firewall in your app... even if there
are multiple  different *ways* to authenticate, like a login form *and* an API key
*and* OAuth.

## The "dev" Firewall

But... woh woh woh. If we almost always want only *one* firewall... why are
there are already two? Here's how this works: at the start of each request, Symfony
goes down the list of firewalls, reads the `pattern` key - which is a regular
expression - and finds the *first* firewall whose pattern matches the current URL.
So there's only ever *one* firewall active per request.

If you look closely, this first firewall is a fake! It basically matches if the URL
starts with `/_profiler` or `/_wdt`... and then sets security to `false`:

[[[ code('7d4e1725bb') ]]]

In other words, it's basically making sure that you don't create a security system
that is *so* epically awesome that... you block the web debug toolbar and profiler.

So... in reality, we only have *one* real firewall called `main`. It has no `pattern`
key, which means that it will match all requests that don't match the `dev` firewall.
Oh, and the names of these firewalls - `main` and `dev`? They're totally meaningless.

## Activating Authenticators

Most of the config that we're going to put *beneath* the firewall relates to
*activating* authenticators: those things that execute early in each request and
try to authenticate the user. We'll add some of that config soon. But these two
top keys do something different. `lazy` allows the authentication system to not
authenticate the user until it needs to and `provider` ties this firewall to the
user provider we talked about earlier. You should have both of these lines... but
neither are terribly important:

[[[ code('57caeb0679') ]]]

## Creating a Custom Authenticator Class

Anyways, anytime that we want to authenticate the user - like when we submit a login
form - we need an authenticator. There *are* some core authenticator classes that
we can use, including one for login forms.... and I'll show you some of those later.
But to start, let's build our *own* authenticator class from scratch.

To do that, go to terminal and run:

```terminal
symfony console make:auth
```

As you can see, you can select "Login form authenticator" to cheat and generate a
bunch of code for a login form. But since we're building things from scratch, select
"Empty authenticator" and call it `LoginFormAuthenticator`.

Awesome. This did two things: it created a new authenticator class and *also* updated
`security.yaml`. Open the class first: `src/Security/LoginFormAuthenticator.php`:

[[[ code('3507d77a21') ]]]

The only rule about an authenticator is that it needs to implement
`AuthenticatorInterface`... though usually you'll extend `AbstractAuthenticator`...
which implements `AuthenticatorInterface` for you:

[[[ code('5f4050a81e') ]]]

We'll talk about what these methods do one-by-one. Anyways, `AbstractAuthenticator` is
nice because it implements a *super* boring method for you.

Once we *activate* this new class in the security system, at the beginning of every
request, Symfony will call this `supports()` method and basically ask:

> Do you see authentication information on this request that you understand?

To prove that Symfony will call this, let's just `dd('supports')`:

[[[ code('57cf2a3e49') ]]]

## Activating Authenticators with custom_authenticators

Okay, so how *do* we activate this authenticator? How do we tell our firewall
that it should use our new class? Back in `security.yaml`, we *already* have the
code that does that! This `custom_authenticator` line was added by the `make:auth`
command:

[[[ code('6212a2e3eb') ]]]

So if you have a custom authenticator class, *this* is how you activate it.
Later, we'll see that you can have *multiple* custom authenticators if you want.

Anyways, this means that our authenticator *is* already active! So let's try it.
Refresh the login page. It hits the `supports()` method! In fact, if you go to
*any* URL it will hit our `dd()`. On every request, before the controller, Symfony
now asks our authenticator if it *supports* authentication on this request.

Next let's fill in the authenticator logic and get our user logged in!
