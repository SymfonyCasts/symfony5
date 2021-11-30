# To use API Token Authentication or Not?

Here's the million dollar question when it comes to security and APIs: does my site
need some sort of API token authentication? There's a pretty good chance that the
answer is no. Even if your app has some API endpoints - like ours - if you're creating
these endpoints solely so that your *own* JavaScript for your *own* site can use
them, then you do *not* need an API token authentication system. Nope, your life
will be much simpler if you use a normal login form and session-based authentication.

Session-based authentication is precisely why we have access to this endpoint:
we previously logged in... and our session cookie is used to authenticate us.
This works *just* as well on a real page as on an API endpoint.

To prove it, before I started the tutorial, I created a stimulus controller
called `user-api_controller.js`. It's dead simple: it makes an API request... and
logs the result. We're going to use it to make an API request to `/api/me` to
prove that Ajax calls can access the authenticated endpoints.

To activate the Stimulus controller, open `templates/base.html.twig`... and find
the `body` element: that's an easy place to attach it: if
`is_granted('IS_AUTHENTICATED_REMEMBERED')`, then `{{ stimulus_controller() }}`
and the name: `user-api`. So, our JavaScript will be called *only* if we're logged
in. To pass the URL to the endpoint, add a 2nd arg with `url` set to
`path('app_user_api_me')`.

And I'm realizing that I haven't *given* our API endpoint a route name yet... so
let's do that. Back in `base.html.twig`, yup! My editor looks happy now.

Ok, head back to the homepage, inspect element, go to the console and... there's
my user data! The Ajax request sends the session cookie and so... authentication
just works.

So if the *only* thing that needs to use your API is your own JavaScript, save
yourself a lot of trouble and just use a login form. And if you *do* want to get
fancy and submit your login for via Ajax, you can totally do that. In fact, if you
use Turbo, that happens automatically. But if you wanted to write some custom
JavaScript, it's still no problem. Just use Ajax to submit the login form and
the session cookie will be automatically set like normal. If you *do* decide to
do this, the only tweak you'll need is to make your login form authenticator return
JSON instead of redirecting. I would probably go back to using my
custom `LoginFormAuthenticator` because it would be super easy to return JSON from
`onAuthenticationSuccess`.

## When You Do Need API Tokens

So then, when *do* we need an API token authentication system? The answer is pretty
simple: if someone *other* than your own site's JavaScript needs to access your API...
including if your JavaScript lives on a completely different domain. If you have
this situation, you're probably going to need some sort of API token system.
Whether you need OAuth or a simpler system... depends. We won't cover API tokens in
this tutorial, but we create a pretty nice system in our Symfony 4 security tutorial,
which you can check out.

Next: let's add a registration form!
