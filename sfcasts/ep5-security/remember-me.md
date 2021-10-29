# Remember Me System

Another nice feature of a login form is a "remember me" checkbox. This is where
we store a long-lived "remember me" cookie on the user's browser so that if they
(close) their browser - and so, lose their session - that cookie will keep them logged
in... for a week or a year... or whatever we configure. Let's add this.

## Enabling the remember_me System

The first step is to go to `config/packages/security.yaml` and activate the system.
We do this by saying `remember_me:` and then, below, set one required piece of
config: `secret`: set to `%kernel.secret%`.

This is used to generate the remember me token... and the `kernel.secret` parameter
actually comes from our `.env` file. Yup, this `APP_SECRET` ends up becoming the
`kernel.secret` parameter... which we can reference here.

Like normal, there are a bunch of other options that you can put under `remember_me`.
You can see a lot of them by running:

```terminal
symfony console debug:config security
```

And then looking for the `remember_me:` section. One important one is `lifetime:`,
which is how long the remember me cookie will be valid for.

Earlier, I said that most of the configuration that we put under our firewall serves
to *activate* different authenticators. For example, the `custom_authenticator:`
activated our `LoginFormAuthenticator`... which means that our class is now looking
for POST requests to `/login`. The `remember_me` config *also* activates an
authenticator: a core authenticator called `RememberMeAuthenticator`. On every
request, this looks for a "remember me" cookie - that we'll create in a second -
and, if it's there, uses it to authenticate the user.

## Adding the Remember Me Checkbox

Now that this is in place, our *next* job is to *set* that cookie on the user's
browser after they log in. Open up `login.html.twig`. Instead of *always* adding
the cookie, let's allow the user to choose. Right after the password, I'll add
a div with some classes, a label and an input `type="checkbox"`,
`name="_remember_me"`, some more classes and then "Remember me"

The name = `_remember_me` *is* important and *needs* to be that value. As we'll
see in a minute, the system *looks* for a checkbox with this exact name.

Ok, refresh the form. Cool: we have a checkbox! Though... it's a little ugly...
I think messed something up. use `form-check` and let's give our checkbox
`form-check-input`. Now... better!

## Opting into the Remember Me Cookie

If we checked the box right now and submitted... *nothing* different would happen:
Symfony would *not* set a remember me cookie.

That's because our authenticator needs to *advertise* that it supports remember me
cookies being set. This is a little weird, but think about it: just because we
activated the `remember_me` system in `security.yaml` doesn't mean that we ALWAYS
want remember me cookies to be set. In a login form, definitely. But if we had some
sort of API token authentication... then we don't want Symfony to try to set a
remember me cookie on that request.

*Anyways*, all we need to have is add a little flag that says that this authentication
mechanism *does* support adding remember me cookies. Do this with a badge:
new `RememberMeBadge()`.

That's it! But there's one kind of odd thing. With the `CsrfTokenBadge`, we
*read* the POSTed token and passed it to the badge. But with `RememberMeBadge`,
we *don't* do that. Instead, internally, the remember me system knows to look
for a check box called exactly `_remember_me`.

The entire process works like this. After we successfully authenticate, the remember
me system looks for this badge *and* looks to see if this checkbox is checked.
If both of these are true, it adds the remember me cookie.

Let's see this in action. Refresh the page... and login with our normal user,
password "tada", click the remember me checkbox... and hit "Sign in". Authentication
successful! No surprise. But now open your browser tools, go to "Application",
find "Cookies" and... yes! We have a new `REMEMBERME` cookie... which expires a
*long* time from now: that's 1 year from now.

## Watching the RememberMe Cookie Authenticate Us

To prove the system works, delete the session cookie that normally keeps us logged
in. Watch what happens when we refresh. We're still logged in! *That* is thanks
to the `remember_me` authenticator.

In the web debug toolbar, you can see a slight difference: it's this token class.
When you authenticate, internally, your `User` object is wrapped in a "token"
object... which usually isn't too important. But that token shows of *how* you
were authenticated. Now it says `RememberMeToken`... which proves that *it* is
what authenticated us.

Oh, and if you're wondering why Symfony didn't add a new session cookie... that's
only because Symfony's session is lazy. You won't see it until you go to a page
that uses the session - like the login page. *Now* it's back.

And... that's really it! In addition to being able to submit an email and password
to authenticate, there is now a *second* authenticator that looks for authentication
information on a `REMEMBERME` cookie.

Though, we *can* make all of this a bit fancier. Next, let's see how we could
add a remember me cookie for *all* users when they log in, *without* needing a
checkbox. We're also going to explore a brand-new option on the remember me
system that allows you to *invalidate* all existing remember me cookies if the
user changes their password.
