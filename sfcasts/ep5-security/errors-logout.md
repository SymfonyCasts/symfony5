# Customize Error Messages & Adding Logout

When we fail login, we store the `AuthenticationException` in the session - which
explains what went wrong - and then redirect to the login page:

[[[ code('9252e2de82') ]]]

On *that* page, we read that exception *out* of the session using this nice
`AuthenticationUtils` service:

[[[ code('1c1ebcec46') ]]]

And ultimately, in the template, call the `getMessageKey()` method to render
a safe message that describes *why* authentication failed:

[[[ code('2a83126eb5') ]]]

For example, if we enter an email that doesn't exist, we see:

> Username could not be found.

On a technical level, this means that the `User` object could not be found. Cool...
but for us, this isn't a great message because we're logging in via an *email*.
Also, if we enter a *valid* user - `abraca_admin@example.com` - with an invalid
password, we see:

> Invalid credentials.

That's a better message... but it's not super friendly.

## Translating the Error Messages?

So how can we customize these? The answer is both simple and... maybe a bit surprising.
We *translate* them. Check it out: over in the template, after `messageKey`, add
`|trans` to translate it. Pass this two arguments. The first is `error.messageData`.
This isn't too important... but in the translation world, sometimes your translations
can have "wildcard" values in them... and you pass in the values for those wildcards
here. The second argument is called a "translation domain"... which is almost like
a translation category. Pass `security`:

[[[ code('cbbe36edc0') ]]]

If you *do* have a multi-lingual site, all of the core authentication messages have
*already* been translated to other languages... and those translations are available
in a domain called `security`. So by using the `security` domain here, if we switched
the site to Spanish, we would instantly get Spanish authentication messages.

If we stopped now... absolutely nothing would change! But because we're going
through the translator, we have the *opportunity* to "translate" these strings
from English to... *different* English!

In the `translations/` directory - which you should automatically have because
the translation component is already installed - create a new file called
`security.en.yaml`: `security` because we're using the `security` translation
domain and `en` for English. You can also create `.xlf` translation files - YAML
is just easier for what we need to do.

Now, copy the *exact* error message including the period, paste - I'll wrap
it in quotes to be safe - and set it to something different like:

> Invalid password entered!

[[[ code('54fa2fd217') ]]]

Cool! Let's try it again. Log in as `abraca_admin@example.com` with an invalid
password and... much better! Let's try with a bad email.

Ok, repeat the process: copy the message, go over to the translation file, paste...
and change it to something a bit more user-friendly like:

> Email not found!

[[[ code('5a99fcf551') ]]]

Let's try it again: same email, any password and... got it!

> Email not found.

Okay! Our authenticator is done! We load the `User` from the email, check their
password and handle both success and failure. Booya! We *are* going to add more
stuff to this later - including checking real user passwords - but this *is*
fully functional.

## Logging Out

Let's add a way to log out. So... like if the user goes to `/logout`, they get...
logged it! This starts exactly like you expect: we need a route & controller.

Inside of `SecurityController`, I'll copy the `login()` method, paste, change it
to `/logout`, `app_logout` and call the *method* `logout`:

[[[ code('3568dae894') ]]]

To *perform* the logging out itself... we're going to put absolutely no code
in this method. Actually, I'll throw a new `\Exception()` that says
"logout() should never be reached":

[[[ code('34d6cf405b') ]]]

Let me explain. Logging out works a bit like logging in. Instead of putting some
logic in the controller, we're going activate something on our firewall that says:

> Hey! If the user goes to `/logout`, please intercept that request, log out the user,
> and redirect them somewhere else.

To activate that magic, open up `config/packages/security.yaml`. Anywhere under our
firewall, add `logout: true`:

[[[ code('4e44f617e9') ]]]

Internally, this activates a "listener" that looks for any requests to `/logout`.

## Configuring logout

And actually, instead of just saying `logout: true`, you can customize how this
works. Find your terminal and run:


```terminal
symfony console debug:config security
```

As a reminder, this command shows you all of your *current* configuration under
the `security` key. So all of our config *plus* any default values.

If we run this... and find the `main` firewall... check out the `logout` section.
All of these keys are the *default* values. Notice there's one called
`path: /logout`. *This* is why it's listening to the URL `/logout`. If you wanted
to log out via another URL, you would just tweak this key here.

But since we have `/logout` here... and that matches our `/logout` right here,
this *should* work. By the way, you might be wondering why we needed to create
a route and controller at all! Great question! We actually *don't* need a controller,
it will never be called. But we *do* need a route. If we *didn't* have one, the
routing system would trigger a 404 error *before* the logout system could work its
magic. Plus, it's nice to have a route, so we can generate a URL to it.

Ok: let's test this thing! Log in first: `abraca_admin@example.com` and
password `tada`. Awesome: we *are* authenticated. Manually go to `/logout` and...
we are now logged out! The default behavior of the system is to log us out and
redirect back to the homepage. If you need to customize that, there are a few
options. First, under the `logout` key, you can change `target` to some other
URL or route name.

But we can also hook into the logout process via an event listener, a topic that
we'll talk about towards the end of the tutorial.

Next: let's give each user a *real* password. This will involve hashing
passwords, so we can securely store them in the database and then *checking*
those hashed passwords during authentication. Symfony makes both of these easy.
