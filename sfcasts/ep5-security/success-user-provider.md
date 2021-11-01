# Authentication Success & Refreshing the User

Let's do a quick review of how our authenticator works. After activating
it in `security.yaml`:

[[[ code('3447f68059') ]]]

Symfony calls our `supports()` method on every request before the controller:

[[[ code('9aa0a7925a') ]]]

Since our authenticator knows how to handle the login form submit, we return true
if the current request is a `POST` to `/login`. *Once* we return true, Symfony *then*
calls `authenticate()` and basically asks:

> Okay, tell me *who* is trying to log in and what *proof* they have.

We answer these questions by returning a `Passport`:

[[[ code('919c5f7405') ]]]

The first argument identifies the user and the second argument identifies some
*proof*... in this case, just a callback that checks that the submitted password
is `tada`. If we *are* able to find a user *and* the credentials are correct...
then we are authenticated!

We saw this at the end of the last video! When we logged in using the email of a
real user in our database and password `tada`... we hit this `dd()` statement:

[[[ code('ca2d37baa5') ]]]

## onAuthenticationSuccess

Yep! If authentication is successful Symfony calls `onAuthenticationSuccess()` and
asks:

> Congrats on authenticating! We're super proud! But... what should we do now?

In our situation, after success, we probably want to redirect the user to some
other page. But for other types of authentication you might do something different.
For example, if you're authenticating via an API token, you would return `null`
from this method to allow the request to continue to the normal controller.

Anyways, that's our job here: to decide what to do "next"... which will either be
"do nothing" - `null` - or return some sort of `Response` object. We're going to
redirect.

Head up to the top of this class. Add a second argument -
`RouterInterface $router` - use the `Alt`+`Enter` trick and select "Initialize
properties" to create that property and set it:

[[[ code('804ca50ec4') ]]]

Back down in `onAuthenticationSuccess()`, we need to return `null` or a `Response`.
Return a new `RedirectResponse()` and, for the URL, say `$this->router->generate()`
and pass `app_homepage`:

[[[ code('4f33ea5ea2') ]]]

Let me go... double-check that route name.... it should be inside of
`QuestionController`. Yup! `app_homepage` is correct:

[[[ code('0aaa06f6a1') ]]]

I'm not sure why PhpStorm thinks this route is missing... it's definitely there.

Anyways, let's log in from scratch. Go directly to `/login`, enter
`abraca_admin@example.com` - because that's a *real* email in our database - and
password "tada". When we submit... it works! We're redirected! And we're logged
in! I know because of the web debug toolbar: logged in as `abraca_admin@example.com`,
authenticated: Yes.

If you click this icon to jump into the profiler, there is a *ton* of juicy info
about security. We're going to talk about the most important parts of this
as we go along.

## Authentication Info & The Session

Click back to the homepage. Notice that, if we surf around the site, we *stay*
logged in... which is what we want. This works because Symfony firewalls are, by
default, "stateful". That's a fancy way of saying that, at the end of each request,
the `User` object is saved to the session. Then at the start of the next request,
that `User` object is *loaded* from the session... and we stay logged in.

## Refreshing the User

This works great! But... there is one potential problem. Imagine we log in at our
work computer. Then, we go home, log in on a totally *different* computer, and
change some of our user data - like maybe we change our `firstName` in the database
via an "edit profile" section. When we come back to work the next day and refresh
the site, Symfony will, of course, load the `User` object from the session. But...
that `User` object will now have the wrong `firstName`! Its data will no longer match
what's in the database... because we're reloading a "stale" object from the session.

Fortunately... this is *not* a real problem. Why? Because at the beginning of every
request, Symfony also *refreshes* the user. Well, actually our "user provider" does
this. Back in `security.yaml`, remember that user provider thingy?

[[[ code('4d62903fc8') ]]]

Yep it has *two* jobs. First, if we give it an email, it knows how to find that user.
If we only pass a single argument to `UserBadge`  then the user provider does
the hard work of loading the `User` from the database:

[[[ code('7c2fd2789a') ]]]

But the user provider also has a *second* job. At the start of every request, it
refreshes the `User` by querying the database for fresh data. This all happens
automatically in the background.... which is great! It's a boring, but critical
process that you, at least, should be aware of.

# User Changed === Logged Out

Oh, and by the way: after querying for the fresh `User` data, if some important
data on the user *changed* - like the `email`, `password` or `roles` - you'll actually
get logged out. This is a security feature: it allows a user to, for example, change
their password and cause any "bad" users who may have gotten access to their account
to get logged out. If you want to learn more about this, search for
`EquatableInterface`: that's an interface that allows you to control this process.

Let's find out what happens when we *fail* authentication. Where does the user go?
How are errors displayed? How will we deal with the emotional burden of failure?
*Most* of that is next.
