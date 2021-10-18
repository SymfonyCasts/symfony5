# Abstract Login Form Authenticator

Coming soon...

I have a confession to make in our authenticator. We did too much work. Yep. When
you're building a custom authenticator, that is some sort of logging form. There's a
special base class in court that can make life easier instead of extending abstract
authenticator extend abstract login form authenticator. If you hold command control
to open up that class, you'll see that this extends abstract authenticator and it
also implements authentication entry point interface. Cool. So that actually means I
can take off authentication entry point interface. Now this requires me to have one
new method called get in URL. So I'm going to head to the bottom of this class and
I'll go to code generate or Command + N on a Mac go to "Implement Methods" and
generate and get logged in. You were up. This is pretty simple for us. Obviously
steal a code from above and say, return this error router->generate app login.

The usefulness of this class is pretty easy to see it implements three of the methods
for us. For example, implements supports for us. It checks to see if the method is a
post and if, and if our log and you were out = the current URL. So exactly what our
supports method does. It also handles authentication failure, storing the error in
the session and redirecting back to our log in anywhere else. And finally it handles
the entry point. Start by yet, again, redirecting to the logging you were out. This
means we can remove some code in our class, so let's see we can remove start our
supports and authentication failure. And also the start method, much simpler. Let's
try it go to /admin and perfect. It still redirects us to /login let's log in ever
admin, at example.com password. And yes, that still works too. It redirects us to the
homepage, thinks to the on authentication success method in our authenticator, but
that's actually not ideal. I mean, we were trying to go to /admin. So shouldn't the
system be smart enough to redirect us back here after we successfully log in. Yep.
And that's totally possible.

Okay.

Walk back out. When an anonymous user tries to access a protected page like /admin,
right before calling the entry point function Symfony stores that you well somewhere
in this session, thanks to that. In on authentication success, we can read that you
were L which is called the target path and redirect there. And there's actually a
trait to make the super easy at the top of the class use target path trait, Then down
in on authentication success, we'll check to see if there is a key in, uh, stored in
the session. We knew that I was saying if target = this arrow, get target path, and
then we need to pass it the session, which is request arrow, get session. And then
the name of the firewall, which is actually passed to us as an argument. That's that
key main. So this is doing two things at once. It's calling this get target path and
setting it through a target variable. Then it's checking to see if the target
variable is, uh, actually has something in it. Because if you think about it, if
somebody went directly to the log in page, then they won't have a target path. You
only have a target path if you try to access a protected page first. So if we ever
have a target path, we can say return new redirect response target.

And that's it. If you hold commander control and jumping to get target path, you can
see it's super simple. It's just reading a very special key off of the session. This
is the key that the security system sets once when, uh, when an anonymous user tries
to access a protected page. All right, let's try it. We are already logged out right
now. So I'm just gonna go to /admin and our entry point redirects us to /login, but
behind the scenes, it all Symfony also set that key into the session. So when we log
in now, got it redirected back to /admin. Okay. Next. Um, we're still doing too much
work in our login form authenticator. It turns out that unless we need some
especially complex functionality, if you need to build a long inform, you can skip
creating a custom authenticator class entirely.

