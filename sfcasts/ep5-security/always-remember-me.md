# Always Remember Me & "signature_properties"

Now that we've got the remember me system working, let's play with it! Instead of
giving the user the *option* to enable "remember me", could we... just enable it
always?

Sure! In this case, we no longer need a remember me checkbox... so we delete that
entirely.

## always_remember_me: true

There are two ways that you can "force" the remember me system to *always* set a
cookie even though the checkbox isn't there. The first is in `security.yaml`:
set `always_remember_me:` to `true`. Yes, I *totally* just misspelled `remember`...
so don't do that!

With this, our authenticator *still* needs to add a `RememberMeBadge`, but the
system will *no* longer look for that checkbox. As long as it sees this badge, it
will add the cookie.

## Enabling on the RememberMeBadge

The *other* way that you can enable the remember me cookie in all situations is
via the badge itself. Comment-out the new option. Well... let me fix my typo
and *then* comment it out.

Inside of `LoginFormAuthenticator`, on the badge itself, you can call `->enable()`...
which returns the badge instance. This says:

> I don't care about any other settings or the checkbox: I *definitely* want the
> remember me system to add a cookie.

Let's try it! Clear the session *and* `REMEMBERME` cookie. This time when we
login... oh invalid CSRF token! That's because I just killed my session without
refreshing - silly Ryan! Refresh and try again.

Beautiful! We have the `REMEMBERME` cookie!

## Securing Remember Me Cookies: Invalidate on User Data Change

There *is* one thing that you need to be careful with when it comes to remember
me cookies. If a bad user somehow got access to my account - like they stole my
password - then they could, of course, log in. Normally, that sucks... but as
soon as I find out, I could change my password, which will log them out.

But... if that bad user has a `REMEMEBERME` cookie... then even if I change
my password, they will *stay* logged in until that cookie expires...
which could be a long time from now. These cookies are almost as good as the
real thing: they act like "free authentication tickets". And they keep working - no
matter what we do - until they expire.

Fortunately, in the new authenticator system, there's a really cool way to
avoid this. In `security.yaml`, below `remember_me`, add a new option called
`signature_properties` set to an array with `password` inside.

Let me explain. When Symfony creates the remember me cookie, it creates a "signature"
that proves that this cookie is valid. Thanks to this config, it will now fetch the
`password` property off of our `User` and include that in the signature. Then, when
that cookie is used to *authenticate*, Symfony will re-create the signature
using the `password` of the `User` that's currently in the *database* and make sure
the two signatures match. So if the `password` in the database is different than
the password that was used to originally create the cookie... the signature match
will *fail*!

In other words, for any properties in this list, if even *one* of these changes
in the database on that `User`, *all* remember me cookies for that user will
instantly be invalidated.

So if a bad user steals my account, all I need to do is change my password and that
bad user will get kicked out.

This is *super* cool to see in action. Refresh the page. If you tweak the
`signature_properties` config, that will invalidate *all* `REMEMBERME` cookies
on your entire system: so make sure to get the config right when you first set
things up. Watch: if I delete the session cookie and refresh... yup! I'm *not*
authenticated: the `REMEMBERME` cookie didn't work. It's still there... but it's
non-functional.

Let's log in - with our normal email address... and password... so that we get a
new remember me cookie that's created with the hashed password.

Cool! And now, under normal conditions, things will work just like normal. I can
delete the session cookie, refresh, and I'm still logged in.

But *now*, let's change the user's password in the database. We can cheat and do
this on the command line:

```terminal
symfony console doctrine:query:sql 'UPDATE user SET password="foo" WHERE email = "abraca_admin@example.com"'
```

Setting the password to `foo` is utter nonsense... since this column needs to hold
a hashed password... but it'll be ok for our purposes. Hit it and... awesome!
This imitated what would happen if I changed the password on my account.

Now, if we are the *bad* user, the next time we come back to the site... suddenly
we're logged out! Blast! And I would've gotten away with it, too, if it weren't
for you meddling kids! The remember me cookie is there... but it's not working.
I *love* this feature.

Let's go back... and reload our fixtures to fix my password:

```terminal-silent
symfony console doctrine:fixtures:load
```

And... once that's done, go log in again as `abraca_admin@example.com`,
password `tada`.

Next: it's time to have a power trip and start *denying* access! Let's look at
`access_control`: the simplest way to block access to entire sections of your site.
