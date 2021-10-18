# Api Auth

Coming soon...

Here's the million dollar question when it comes to security and Avi's, does my site
need some sort of API token authentication? There's a pretty good chance that the
answer is no. Even if your app has some API end points like ours, if you're creating
API endpoints solely for so that your own JavaScript for your own site can use them,
then you do not need an API token authentication system. Nope, you're alive will be
much simpler if you use a normal login form and session based off on occasion. That's
why this works. That's why we have access to this endpoint.

We previously logged in and be a log and form that study session cookie to
authenticate us. And that session cookie works fine. Even on API end points to prove
it. Before we started going into tutorial, I created a stimulus controller called
user API controller. It's dead simple. It's based. We're basically going to use it to
make an API request to /API /me, and then log the user data just to prove that our
Ajax has access to authenticated end points. Let's activate this open up templates
and based at age timeouts with lack of it, it on every page. So we'll attach the
controller to the body element. So I'm going add a little if saving year say if is
granted is authenticated remembered so that we only activate the semis controller.
Um, if the user's logged in to activate the semi's controller, say critically
stimulus controller, and then the name, which is a user dash API, and then I need to
pass in what's one value, which is the URL path set to the path through our end point
app understory user_API_me. I actually realizing that I have not yet given our API
endpoint a name, so let's do that.

Perfect. All right. So I'll add back. Doesn't really matter where I go to the
homepage inspect element, go to console. And there's my user data. When the Ajax
request, the agent's request to use uses our session, cookie and authentication just
works. So if the only thing that needs to use your API is your own JavaScript. Save
yourself a lot of trouble and just use a log inform. Oh, and if you do want to get
fancy with your log in form and submit it via Ajax, you can totally do that. In fact,
if you use turbo, that happens automatically, but if you wanted to write some custom
JavaScript, it's still no problem. Just use Ajax to submit your log in form. And the
session cookie will be set exactly the same way.

If you are, somebody is in some custom way, you may want to tweak the success
behavior to maybe return JSON instead of redirecting. But that's pretty minor. If I
were doing that, I'd probably go back to using my login form custom authenticator,
because then it'd be very easy down in authentication success to return JSON, instead
of redirecting, I probably do something similar in authentication failure. So then
when do we need an API token authentication system? The answer is pretty simple. If
someone other than our own sites, JavaScript needs to access your API, including if
your JavaScript lives on a separate domain, then you're going to need some sort of
API token authentication system. If you do have this use case, we'll walk through a
simple example towards the end of the tutorial, Britten out, let's add a registration
form to our site.

