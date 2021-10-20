# Success User Provider

Coming soon...

Let's do a quick review of how our authenticator works after activating the
authenticator in `security.yaml` Symfony calls our `supports()` method on every request
before any controller before the controller is executed. Since we know how to handle
the log-in form, submit, we return true. If the current request is a `POST` to `/login`,
once we return true Symfony calls, `authenticate()`, and basically asks, okay, tell me
who is trying to authenticate and what proof they have. We answered these questions
by returning a `Passport`. The first argument identifies the user and the second
argument identifies some proof in this case, just a call back that makes sure that
the submitted password is set up. If we are able to find a user and our credentials
are successful, then we are authenticated. We did it. We saw this at the end of the
last video, when we logged in using a real email and our database and the password
"tada" we hit this `dd()` statement.

Yep. If authentication is successful Symfony calls `onAuthenticationSuccess()` and
asks, okay, what should we do now in our situation after success, we're probably
going to want to redirect to some other page, but for other types of authentication,
you might do something different. For example, if you're authenticating an API token
on a header, you would return null, here in that case, the request would continue. And
the normal route and controller would be executed for whatever page the user is
trying to access. Anyways, let's redirect to the homepage in order to do that, where
we're going to need to generate a URL. So we need our router. So I'll head up to the
top of his class and I'll add a second argument here called `RouterInterface $router`
and use my "Alt + Enter" trick, to go to "Initialize properties", to create that
property and set it now, down here `onAuthenticationSuccess()`, specifically what that
returns is `null` or a `Response` object. So what response do we want to send back to the
user after they're successful? In order to redirect, we are wanting to return a
redirect response. So return new `RedirectResponse()`. Now for the URL, I'll say
this->generate `$this->router->generate()`, and that's pass it. Let's redirect to the
home page. So `app_homepage`

Let me go check on this route name. It should be inside of `QuestionController` and
yet cool `app_homepage`. I'm not sure why my app thinks that that route's missing, but
it's there.

All right. Let's log in from scratch. I'm going to enter to go to `/login`. So as a
reminder, we're going to go to "abraca_admin@example.com" because that's a real
email and our database password "tada", and it worked we're redirected. And we're
logged in. I know because of the web Debo tool bar, I'm logged in as abraca admin, at
example.com authenticated. Yes. If you open up the web debug, if you click that link
to go to the profiler, there is a ton of information here, uh, related to security.
We're going to talk about the most important parts of this as we go along. If you
click back to the homepage, you'll notice that as we kind of surf around the site, we
stay logged in

That's because by default are a firewall is stateful, which is a fancy way of saying
that at the end of each request, the user object is saved to the session. Then at the
start of the next request, the user object is loaded from the session. And while we
stay logged in, but there is one potential problem. If we keep loading the user
object from the session forever, eventually the data on the object might become out
of date. It might not match what's in the database. If that data changed, changed
somehow, like we changed our first name from a different computer to fix this at the
beginning of every request, Symfony refreshes the user. Well, actually our user
provider does this back in `security.yaml` remember that user provider thingy. Yep.
This has two jobs. First. If we give it an email, it knows how to find that user. If
we only pass a single argument to use badge, if we just pass it, just the email like
that, which we originally did, then the user provider does the hard work of loading
the user from the database. The second job went in the user provider is that at the
start of every request, it refreshes our user by querying the database for fresh
data.

This all happens automatically in the background, which is great. It's a boring but
critical process.

Next. Let's find out what happens when we fail authentication. Where does the user go
in? How our error is displayed.

