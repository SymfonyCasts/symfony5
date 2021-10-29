# Always Remember Me & "signature_properties"

Coming soon..

though. If you want to, one of the things you can do is instead of giving the user
to option to do remember me, you can just enable it automatically for them. So in
this case, you don't need to remember me chat box so we can just delete that entirely.
And then there's two ways that you can force. Remember me the first way is to put
it inside of, um, as an option in security. That animal `always_remember_me: true`.
Sure. In this case, your authenticator is still needs to return to remember me badge,
but it's no longer going to look for that checkbox. As long as it sees this badge,
it will add the cookie. It will add the cookie. The other way that you can enable
the remember me, badge always is via the badge itself. So comma,

Oh,

I'll fix my type of always. Remember me anyways, comment that out. And then an inside
of your log and form authentic here on the badge itself, you can call a method called
`enable()`, which also returns an instance of itself. This basically says I don't care
about any other setting or any other check box. I definitely want the remember me
system to be enable

Cool. I want to try that out, but you can take my word for it that actually I'll try
it out. Let me clear the session ID and the remember me cookie. And this time when we
log in, oh, invalid CSRF token. Let me refresh the page again. That's because I
cleared my session ID and beautiful. We have the, remember me a token. Now, one thing
that you need to be careful with, remember me tokens is that if a bad user somehow
got access to my system, like they stole my password. They could stay logged in.
Thanks to remember me cookie. They could stay logged in for a long time. Even if we
figured out what happened and changed our password. That's because these cookies are
like free tickets and they will work until they expire. No matter what, like one year
from now

To, if you want to avoid that, you can do something very cool in `security.yaml`, you
can add a property here called uh, often called `signature_properties` and set that to
how about password? What this means is that when it creates the, remember me cookie,
it's going to call the it's going to call, uh, it's going to use the password
property off of our user as sort of an ingredient to that signature. And then when
the remember me, cookie is used later, it will read the hash, the hash password off
of the cookie. And if it doesn't match the hash password in the database, the cookie
won't work. In other words, any properties that you list here for any properties that
you list here, if those properties change in the database, they remember me, cookie
won't work. So all I all I would need to do once I regained access to my account is
changed my password and all our memory cookies would stop working, check it out.
Whenever you make that change, it will actually invalidate the rumor meat cookies for
all users. You can see it as if I, the way the session ID and reload see it
invalidated at all right? So let's log in

So that we get a new, remember me cookie with the hashed password information on it.

And now under normal conditions, things work just like normal. I can believe the
session ID refresh, and I'm still logged in, but now let's change the user's password
in the database. So to do this, I'm going to run

```terminal
symfony console doctrine:query:sql 'UPDATE user SET password="foo" WHERE email = "abraca_admin@example.com"'
```

And we'll just say Fu again, which won't
work for anything because this is really supposed to hold a hash password. And I'll
say where email = we'll use Avalara admin, at example, that come beautiful. So that
just changed my password in the database imitating what would happen if I changed the
password on my account? Now, if we are the bad user, next time we actually come back
to the site. Suddenly we're logged out and see the, remember me cookies there. But
the remember me cookie doesn't work because our password in the database changed.
That's a powerful feature. All right, let me reload my fixtures to reset my password.
And then once that's done, let's go log in again, as Agra admin, at example.com acid
TETA util next it's time to deny access. Let's look at access control, the simplest
way to block access to entire sections of your site.
