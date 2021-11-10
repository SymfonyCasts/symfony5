# The Special IS_AUTHENTICATED_ Strings

If we need to figure out simply whether or not the user is currently logged in, we
check for `ROLE_USER`. This works.... just because of how our app is built: it
works because in the `getRoles()`, we're making sure that every logged in user at
least has this role.

## Checking if Logged In: IS_AUTHENTICATED_FULLY

And... this works great! But it does make me wonder: is there a, kind of, more
"official" way in Symfony to check if a user is logged in? It turns out, there is!
Check for `is_granted('IS_AUTHENTICATED_FULLY')`.

By the way, anything we pass `is_granted()` in Twig - like `ROLE_USER` or
`IS_AUThENTICATED_FULL` - we can also pass to the `isGranted()` method in the
controller, or `$this->denyAccessUnlessGranted()`... or to `access_control`. They
all call the security system in the same way.

I bet you noticed that `IS_AUTHENTICATED_FULLY` does *not* start with `ROLE_`.
Yup! Roles *must* start with `ROLE_`... but this string isn't a role: it's handled
by an entirely different system internally, a part of the security system that
simply returns `true` or `false` based on whether or not the user is logged in.

So, in practice, this should have the same effect as `ROLEUSer`. When we refresh...
yup! No change.

## Access Decision Log in the Profiler

Oh, but click the security link in the web debug toolbar to jump into the profiler.
Scroll down to the bottom to find something called the "Access Decision Log". This
is super cool: Symfony keeps track of *all* the times that the authorization system
was called during the request and what the result was.

For example, this first check was for `ROLE_ADMIN`, which is probably coming from
our `access_control`: because we went to `/admin`, this rule matched and it checked
for `ROLE_ADMIN`. The next check is again for `ROLE_ADMIN` - that's probably to
show the admin link in Twig - and then there's the check for `IS_AUTHENTICATED_FULLY`
to show the log in or log out link. And we had access granted for all of these!

## Remember Me Authed: IS_AUTHENTICATED_REMEMBER

In addition to `IS_AUTHENTICATED_FULLY`, there are a couple of other special strings
that you can pass into the security system. The first is `IS_AUTHENTICATED_REMEMBERED`,
which is super powerful... but can be a little bit confusing.

Here's how it works. If I am logged in, then I *always* have
`IS_AUTHENTICATED_REMEMBERED`. That... so far should sound identical to
`IS_AUTHENTICATED_FULLY`. But, there's one key difference. Suppose I log in, close
my browser, open my browser, and refresh so that I'm logged in thanks to a remember
me cookie. In this situation, I *will* have `IS_AUTHENTICATED_REMEMBERED` but I will
*not* have `IS_AUTHENTICATED_FULLY`. Yup, you *only* have `IS_AUTHENTICATED_FULLY`
if you logged in during this browser session.

We can see this. Head over to your browser, open your debugging tools, go to
Application and then Cookies. Oh... my remember me cookie is gone! This... was
a mistake I made. Log out... then go to `security.yaml`.

Earlier, we switched from using our custom `LoginFormAuthenticator` to `form_login`.
That system *totally* works with remember me cookies. But we also removed the
checkbox from our login form. And, inside of our authenticator, we were relying on
calling `enable()` on the `RemmeberMeBadge` to force the cookie to be set.

Well, the core `form_login` authenticator definitely adds the `RememberMeBadge`,
which advertises that we "opt into the remember me system". But it doesn't call
`enable()` on it. This means that we either need to add a check box to the form...
or, in `security.yaml`, add `always_remember_me: true`.

Let's log back in now: `abraca_admin@example.com`, password `tada` and... got it!
There's my `REMEMBERME` cookie.

Ok: because we just logged in - so we "logged in during this session", we are
"authenticated fully". But, if I closed my browser, which I will imitate by deleting
the session cookie - and refresh... we *do* logged in, but we are now logged in
thanks to the remember me cookie... you can see that via the `RememberMeToken`.

And look up here! We have the "Log in" and "Sign up" links! Yup, we are now *not*
`IS_AUTHENTICATED_FULLY` because we did *not* authenticate during this session.

This is a *long* way of saying that if you use remember me cookies, then most of
the time you should use `IS_AUTHENTICATED_REMEMBERED` when you simply want to know
whether or not the user is logged in. And then, if there are a couple of parts of
your site that are more sensitive - like maybe the "change password" page - then
protect those with `IS_AUTHENTICATED_FULLY`. If the users tries to access this page
and only has `IS_AUTHENTICATED_REMEMBERED`, Symfony will actually execute your
entry point. In other words, it'll redirect them to the login page.

Refresh the page and... yes! The correct links are back.

## PUBLIC_ACCESS & access_control

Ok, there are a few other special strings like `IS_AUTHENTICATED_REMEMBERED`, but
only one more that I think is useful. It's called `PUBLIC_ACCESS`... and it returns
true 100% of time. Yup, *everyone* has `PUBLIC_ACCESS`, even if you're not logged
in.

So... you might be thinking: how could that ever possibly be useful? Fair question!

Look again at `access_control` in `security.yaml`. To access any URL that starts
with `/admin`, you need `ROLE_ADMIN`. But pretend that we had a login page at the
URL `/admin/login`.

Let's actually create a dummy controller for this. Down at the bottom of
`AdminController`, add `public function adminLogin()`... with a route - `/admin/login` -
and, inside, return a new `Response()` with:

> Pretend admin login page that should be public

I we log out and can go to `/admin/login`... that's not going to work: we're
redirected to `/login`. And really, if `/admin/login` were our *real* login page,
then we would get redirected to `/admin/login`... which would redirect us to
`/admin/login`... which would redirect us to `/admin/login`.... forever and ever.
Yikes!

The point is, in `security.yaml`, we want to be able to require `ROLE_ADMIN` for
all URLs starting with `/admin`... *except* for `/admin/login`. The key to do
this is `PUBLIC_ACCESS`.

Copy the access control and paste above. Remember: only one `access_control` matches
per request and it matches from top to bottom. So we can add a new rule matching
anything starting with `/admin/login` and have it require `PUBLIC_ACCESS`... which
will always return true!

Thanks to this, if we go to anything that starts with `/admin/login`, it will match
only this one `access_control`... and access will be granted!

Try it: go to `/admin/login` and... access granted!

Next: we've talked about roles, we've talked about denying access in various different
ways. So let's turn to the `User` object: how you can ask Symfony *who* is logged
in.
