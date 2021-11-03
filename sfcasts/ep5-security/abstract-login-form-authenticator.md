# AbstractLoginFormAuthenticator & Redirecting to Previous URL

I have a confession to make: in our authenticator, we did too much work. Yep, when
you build a custom authenticator for some sort of "login form", there's a
special base class that can you can use to make life easier. Instead of extending
`AbstractAuthenticator` extend `AbstractLoginFormAuthenticator`.

Hold Command or Ctrl control to open up that class. Yup, *it* extends
`AbstractAuthenticator` and *also* implements `AuthenticationEntryPointInterface`.
Cool! That means we can remove our redundant `AuthenticationEntryPointInterface`.

This abstract class requires us to add one new method called `getLoginUrl()`. Head
to the bottom of this class and go to Code -> Generate - or Command + N on a Mac -
and then "Implement Methods" to generate `getLoginUrl()`. For the inside of this,
steal the code from above... and return `$this->router->generate('app_login')`.

The usefulness of this bas class is pretty easy to see: it implements three of the
methods *for* us! For example, it implements `supports()` by checking to see if
the method is POST *and* if the `getLoginUrl()` string matches the *current* URL.
In other words, it does *exactly* what *our* `supports()` method does. It also handles
`onAuthenticationFailure()` - storing the error in the session and redirecting back
to our login page - and also the entry point - `start()` - by, yet again, redirecting
to the login page.

This means that we can remove code! Let's see: delete `supports()`,
`onAuthenticationFailure()` and also `start()`.

Much simpler. Let's make sure we didn't break anything: go to `/admin` and... perfect!
The `start()` mtehod still redirects us to `/login`. Let's log in with
`abraca_admin@example.com`, password `foo` and... yea! That still works too: it
redirects us to the homepage page... which makes perfect sense, because that's
what we're doing inside of `onAuthenticationSuccess`.

## TargetPathTrait: Smart Redirecting

But... if you think about it... that's *not* ideal. Since I was originally trying
to go to `/admin`... shouldn't the system be smart enough to redirect us back there
after we successfully log in? Yep! And that's totally possible.

Log back out. When an anonymous user tries to access a protected page like `/admin`,
right *before* calling the entry point function, Symfony stores that current URL
somewhere in this session. Thanks to that, in `onAuthenticationSuccess()`, we can
*read* that you URL - which is called the "target path" - and redirect there.

To help us do this, we can leverage a trait! At the top of the class
`use TargetPathTrait`. Then, down in `onAuthenticationSuccess()`, we can check to
see *if* there a "target path" was stored in the session. We do that by saying if
`$target = $this->getTargetPath()` - passing this the session -
`$request->getSession()` - and then the name of the firewall, which we actually
have as an argument. That's that key `main`.

This line does two things at once: it calls sets a `$target` variable to the target
path *and* the if statement checks to see if this actually has something in it.
Because, if the user goes *directly* to the login page, they won't have a target
path in the session.

Then, *if* we have a target path, redirect to it: `RedirectResponse($target)`.

Done and done! If you hold Command or Ctrl and click `getTargetPath()` to jump into
that core method, you can see that it's super simple: it just reads a very specific
key off of the session. This is the key that the security system sets when an
anonymous user tries to access a protected page.

Let's try this thing! we're already logged out. Head to `/admin`. Our entry point
redirects us to `/login`. But *also*, behind the scenes, Symfony just set the URL
`/admin` onto that key in the session. So when we log in now, with our usual email
and password... awesome! We get it redirected back to `/admin`!

Next: um... we're *still* doing too much work in our `LoginFormAuthenticator`. It
turns out that, unless we need some especially custom stuff, if you need to build
a login form, you can skip creating a custom authenticator class entirely and rely
on a core authenticator from Symfony.
