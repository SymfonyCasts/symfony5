# Rememeber Me

Coming soon...

Another nice feature of a long informed is a remember me checkbox. This is where the
system stores a long lived. Remember me cookie on the user's browser, so that if they
close their browser and lose their session, that cookie will keep them logged in for
a week or a year, whatever we configure. So let's add this the first step. Is it
going to config packages, security that Yammer in activate the system? We do this by
saying, remember me, and then below this there's one required piece of configuration,
which is a secret that's going to be used to cryptographically, create the cookies
for this. We can use percent kernel that's secret, where they realize they're nuts
inside of our data and file. All of our applications have a unique secret, which is
used in various places. This ends up becoming a Colonel that secret parameter, which
we can reference here.

There are also a number of, uh, other options under remember me, which you can see by
running Symfony console, debug and fig security. And then looking for the remember me
section. So a bunch of them, including lifetime, which is how you set, how long this
cookie is going to last. So what this you remember earlier, I said that most of the
configuration that we're going to put under our firewall actually activates different
authenticators. So the custom authenticator config activated our login form
authenticator, which means our class is now looking for submitted log informs the,
remember me cookie actually, uh, activates the, remember me authenticator, which is
going to be looking for the, remember me cookies and authenticating the user. If it
sees them, we're going to see that and action. But before we do, we need to add the,
remember me checkbox to our form. So in logging that HTML, that twig right off the
password, a lot of dev with some classes label and inside input type = checkbox, and
then name = underscore. Remember_me that actually this is a, this actually needs to
be this exact name. Cause that's what the remember me. System's going to look for
then I'll just say, remember me.

All right. So if I refreshed the form, cool. I have my remember me checkbox though.
No, uh, that's a little ugly. Let me think. I think I actually mess with the styling
for here. Use form check and let's give our checkbox = form check input. Alright,
Dallas, a little bit better.

But if we check this right now and submitted nothing different would happen. One of
the things that we need our authenticator to do is advertise that it supports,
remember me cookies. This is a little weird, but even if you enable the remember me
system here under your firewall, you still need to say inside of your authentic care
that this authentication mechanism supports, remember me cookies. This is to prevent,
for example, you having an API token authenticator, and then the system trying to set
a cookie on those. When the user authenticates via an API token as well. Anyways, all
we need to have here is this a little flag that says we, this authentication
mechanism supports you remember me? So we'll say new. Remember me badge? That's it on
like the CSRF token badge. We're actually read the token. And the remember me bat,
the remember me system internally is going to be looking for a check box called
underscore. Remember_me. So it works like this. After we successfully authenticate
the, remember me, system's going to look for this badge and look for this check box
being checked. And if it sees both of those, it will add the cookie.

So let's check it. I'm going to refresh the page and login. Okay. Password TETA.
Quick to remember me check box and hit sign in. All right. So we are authenticated
and no surprise, but if you inspect element and go-to application, you can go down to
cookies for your site and yes, you should see a new remember me, which expires a long
time from now, that's next year for me

To prove this works. We can delete our session ID that normally would log us up.
Watch what happens when I refresh. We're still logged in and you got actually a
slight difference. And as I was token class, or remember me token, that's not an
important detail. That's kind of proof that we were just logged in via the remember
me token. We don't say a session cookie in here. That's only because Symfony's
session is lazy. Uh, you won't see it until you go to a page that uses the session
like the login page. Now we see the session there And that's really it though. If you
want to, one of the things you can do is instead of giving the user to option to do
remember me, you can just enable it automatically for them. So in this case, you
don't need to remember me chat box so we can just delete that entirely. And then
there's two ways that you can force. Remember me the first way is to put it inside
of, um, as an option in security. That animal always underscore, remember_me. Sure.
In this case, your authenticator is still needs to return to remember me badge, but
it's no longer going to look for that checkbox. As long as it sees this badge, it
will add the cookie. It will add the cookie. The other way that you can enable the
remember me, badge always is via the badge itself. So comma,

Oh,

I'll fix my type of always. Remember me anyways, comment that out. And then an inside
of your log and form authentic here on the badge itself, you can call a method called
enable, which also returns an instance of itself. This basically says I don't care
about any other setting or any other check box. I definitely want the remember me
system to be enable.

[inaudible]

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

To, if you want to avoid that, you can do something very cool insecurity .yaml, you
can add a property here called uh, often called signature properties and set that to
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
in the database. So to do this, I'm going to run Symfony Ponsoldt doctrine query SQL
I'll say update user set, password equals. And we'll just say Fu again, which won't
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

