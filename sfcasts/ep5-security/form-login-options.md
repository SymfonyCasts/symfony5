# More form_login Config

Using `form_login` isn't as flexible as a custom authenticator class...
though a lot of stuff *can* be configured.

For example, right now, it's *not* checking our CSRF token. Enable that
by saying `enable_csrf: true`:

[[[ code('09a3e4b868') ]]]

That's it! Over in the options, when you enable CSRF protection, it looks for a hidden
field called `_csrf_token` with the string `authenticate` used to generate it.
Fortunately, in our template, we're already using *both* of those things... so
this is just going to work.

## Seeing the Full List of Options

And there are even *more* ways we can configure this. Remember: to get this config,
I ran `debug:config security`... which shows your *current* configuration, including
defaults. But not *all* options are shown here. To see a full list, run
`config:dump security`.

```terminal-silent
symfomy console config:dump security
```

Instead of showing your *actual* config, this shows a huge list of *example* config.
This is a much bigger list... here's `form_login`. A lot of this we saw before...
but `success_handler` and `failure_handler` are both new. You can search the
docs for these to learn how to control what happens after success or failure.

But also, later, we're going to learn about a more *global* way of hooking into
the success or failure process by registering an event listener.

## Rendering "last_username" On the Login Form

*Anyways*, we're not using our `LoginFormAuthenticator` anymore, so feel free
to delete it.

And... I have good news! The *core* authenticator is doing one thing that *our*
class never did! Up in `authenticate()`... this calls `getCredentials()` to read
the POST data. Let me search for "session"... yup! This took me into
`getCredentials()`. Anyways, after grabbing the submitted email - in this code
that's stored as `$credentials['username']` - it *saves* that value into the session.

It's doing that so that if authentication fails, we can *read* that and pre-fill
the email box on the login form.

Let's do it! Go to our controller: `src/Controller/SecurityController.php`. This
`AuthenticationUtils` has one other useful method. Pass a new variable to the
template called `last_username` - you can call it `last_email` if you'd like - set
to `$authenticationUtils->getLastUsername()`:

[[[ code('55833098cd') ]]]

Once again, this is just a helper to read a specific key off of the session.

Now, in the template - `login.html.twig` - up here on the email field, add
`value="{{ last_username }} "`:

[[[ code('6dd9591db8') ]]]

Cool! If we go to `/login`... it's already there from filling out the form a
minute ago! If we enter a different email... yes! That sticks too.

Next: let's get back to authorization by learning how to deny access in a
controller... in a number of different ways.
