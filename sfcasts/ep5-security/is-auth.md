# Is Auth

Coming soon...

If we need to figure out simply whether or not the user's login or current using
`ROLE_USER`, this works kind of just by convention and how our app is built. It's Hey,
it works because in our get rolls method and user, we are making sure that every log
in user at least has this role and this works great, but it does make me wonder, is
there a kind of more core or pure way in Symfony to ask the question is the user
authenticated and it turns out there is bypassing `is_granted('IS_AUTHENTICATED_FULLY')`,
by the way, anything we've has to `is_granted()` in twig. We can also pass to a, 
`is_granted()` inside of a controller or even the, `$this->denyAccessUnlessGranted()` method
in our controller. All of these feed into the same system anyways, `IS_AUTHENTICATED_FULLY`
I notice it doesn't start with `ROLE_`

So it's handled by a different system. Part of Symfony security that kind of sees
this simply returns true or false based on whether or not the user is logged in. So
in other words, it basically has the same effect when we refresh it works one cool
thing about the web debug toolbar. If you click into the profiler, is that if you
scroll down to the bottom, you're going to see something called an access decision
log. This actually keeps track of all the times the security system was called on
that request and what the result was. So see the first one here, is there a check for
role admin? This is actually coming from our access control. So this is thanks to the
access control matching /admin. There's then a check for rural admin. Again, I think
that's to show the admin link and then the check for is authenticated fully. That's
also in twig to know if we should show the log out link. So this is kind of a cool
thing to see, and you can see whether access is granted or denied. Anyways, in
addition to the `IS_AUTHENTICATED_FULLY`, there are a couple of other special strings
that you can pass into the security system. The first one is called `IS_AUTHENTICATED_REMEMBER`
 which is super powerful, but can be a little bit confusing. Here's how it
works.

If I am logged in, then I always have `IS_AUTHENTICATED_REMEMBER`, even if, regardless
of whether I am, regardless of whether logged in during this session or if I am
logged in, thanks to a remember me cookie, but `IS_AUTHENTICATED_FULLY`, you only
have that if you have actually logged in during this session, if you close your
browser and then come back and are logged in, thanks to the remember me cookie, you
do not have `IS_AUTHENTICATED_FULLY`. Check it out right now. If I refresh, we are
authenticated fully, but now I'm going to inspect L amount of page go to application
and let's, And let's actually kill our session ID there. Okay. I'm actually going to
log back. I don't know. Where am I remember me. He was, I don't remember me. Cookie
is now gone.

I'm gonna go over here and inspect element on the page and go to application and
cookies. Oh, and actually look, my, remember me, cookie is gone. This is actually a
mistake I made let's log back out in `security.yaml `remember. We switched from using
our custom log inform of the candidate authenticator to `form_login`. That totally
works with, remember me cookies. But remember we had removed the actual checkbox from
our form and we were relying inside of our authenticator on adding their memory badge
and explicitly adding enable the core form log. And authenticator definitely adds the
`RememberMeBadge`, which advertises that it, that we, that we opt into the remember
me bad system, but remember me badge system, but it doesn't call `enable()` on it, which
means we either need to add a check box here, or we need to go into `security.yaml`
and make sure that we add `always_remember_me: true`. All right. So let's log back
in now,

Africa admin, at example.com password to that beautiful. There's my remembering
cookie anyways, because I just logged in and this request I have is authenticated
fully, but if I closed my browser, which I will imitate by deleting the, the session
cookie and refresh, I stay logged in, but I'm now logged in. Thanks to the remember
me cookie, and kind of see this because it says, remember me token and look up here
and that says, login sign up. I am not `IS_AUTHENTICATED_FULLY` anymore because I have
not authenticated during this session. Anyways, this is a long way of saying that if
you use, remember me cookies, then most of the time, what you want to do is use
`IS_AUTHENTICATED_REMEMBER`. Cause that's really the way that you check is the user
logged in. But if there are a couple of parts of your site that are more sensitive,
like maybe change password part of your site, then you can use `IS_AUTHENTICATED_FULLY`
to require the user to log in on this request.

If the users only `IS_AUTHENTICATED_REMEMBER` and they try to access a page that
requires is authenticated fully, there'll be redirected to the login page. And this
guys, my refresh. Now I see the log out link correctly again, or there's one other
kind of special string here. So it is authenticated in addition to `IS_AUTHENTICATED_FULLY`
and `IS_AUTHENTICATED_REMEMBER`, and it's called `PUBLIC_ACCESS`. And when you use
public access, it will return true. 100% of time, everyone has public access. So you
might be thinking, how could that ever possibly be useful? All right. So let's look
at our `security.yaml` access controls right now to get to anything that starts
with `/admin`. You need `ROLE_ADMIN`, but what if we had like an admin login page like
`/admin/login` and we wanted that to be accessible to anyone so that you could go and
log in. Let's actually go create a little Dummy Controller for this. So down here in
the bottom, I'll say a public function, `adminLogin()` a little at right above this
`/admin/login`. And here I'm just going to return. A new `Response()` is our 

> Pretend admin login page that should be public

So if I log out right now, I can go to `/admin/login`. That's not going to work. It's
going to bump into the log of age. And if that were really my login page, um, in the
real world, if I log in Pedro `/admin/login`, it would get, have real trouble. Cause
it would try to redirect back to that page. I don't know if that's important. Imagine
so in `security.yaml`, this is kind of the tricky thing here is how do we protect
everything under such admin, but open up this one page, the key is `PUBLIC_ACCESS`.
Remember only one access control matches per request, and it matches from top to
bottom. So we can do is say `/admin/login`. So anything starting with `/admin/login`
requires `PUBLIC_ACCESS`, which will always return true. So now if we go to anything
that starts with `/admin/login`, it will match only this one access control and access
will be granted approval, but a `/admin/login` access. Granted. All right, next, we
have talked about roles. We've talked about denying access in various different ways.
Let's turn to the user object. Cause a lot of times when your code you're going to
want to need that. You're going to want to ask Symfony who is logged in so you can
work with the user. Let's talk all about that next.

