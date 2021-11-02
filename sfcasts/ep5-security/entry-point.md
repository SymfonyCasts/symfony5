# The Entry Point: Inviting Users to Log In

Log back in using `abraca_admin@example.com` and password `tada`. When we go to
`/admin`, like we saw earlier, we get access denied. This is because of the
`access_control`... and the fact that our user does *not* have `ROLE_ADMIN`.

But if we change this to `ROLE_USER` - a role that we *do* have - then access is
granted... and we get to see some *pretty* impressive graphs.

Let's try one more thing. Log out - so manually go to `/logout`. Now that we are
*not* logged in, if I went directly to `/admin`: what should happen?

Well, right now, we get a *big* error page with a 401 status code. But... that's
not what we want! If an anonymous user tries to access a protected page on our site,
instead of an error, we want to be super friendly and *invite* them to log in.
Because we have a login form, it means that we want to redirect the user to the
login page.

## Hello Entry Point!

To figure out what to do when an anonymous user accesses a protected page, each
firewall defines something called an "entry point". The entry point of a firewall
is literally a function that says:

> Here's what we should when an anonymous user tries to access a protected page!

Each authenticator under our firewall may or may *not* "provide" an entry point.
Right now, we have two authenticators: our custom `LoginFormAuthenticator` and
also the `remember_me` authenticator. But neither of these provides an entry point,
which is why, instead of redirecting the user to a page... or something different,
we get this generic 401 error. Some built-in authenticators - like `form_login`, which
we'll talk about soon - *do* provide an entry point... and we'll see that.

## Making our Authenticator an Entry Point

But anyways, none of our authenticators provide an entry point... so let's add one!

Open up our authenticator: `src/Security/LoginFormAuthenticator.php`. If you want
your authenticator to provide an entry point, all you need to do is implement a new
interface: `AuthenticationEntryPointInterface`.

This requires the class to have one new method... which we actually already have
down here. It's called `start()`. Uncomment the method. Then, inside, very simply,
we're going to redirect to the login page. I'll steal the code from above and...
done!

As *soon* as an authenticator implements this interface, the security system will
notice this and start using it. Literally, if an anonymous user tries to access a
protected page, it will now call our `start()` method... and we're going to redirect
them to the login page.

Watch: refresh! Boom! It knocks us over to the login page.

## A Firewall has Exactly ONE Entry Point

But there's *one* important thing to understand about entry points. Each firewall
can only have *one* of them. Think about: at the moment we go to `/admin` as
an anonymous user.... we're not trying to log in via a login form... or via an
API token. We're truly anonymous. And so, if we *did* have multiple authenticators
that each provided an entry point, our firewall wouldn't know which to choose. It
needs *one* entry point for *all* cases.

Right now, since only *one* of our two authenticators is providing an entry point,
it knows to use this one. But what if that were *not* the case? Let's actually see
what would happen. Find your terminal and generate a *second* custom authenticator:

```terminal
symfony console make:auth
```

Make an empty authenticator... and call it `DummyAuthenticator`.

Beautiful! Like This created a new class called `DummyAuthenticator`...
and it also updated `custom_authenticator` in `security.yaml` to use *both* custom
classes.

In the new class, inside `supports()`, return false. We're... not going to turn
this into a *real* authenticator.

If we stopped right now... and tried to go to `/admin`, it would *still* use the
entry point from `LoginFormAuthenticator`. But *now* implement
`AuthenticationEntryPointInterface`... and then go down... and uncomment the
`start()` method. For the body, just `dd()` a message... because this won't ever
be executed.

*Now* the firewall will notice that we have *two* authenticators that
*each* provide an entry point. And so, when we refresh any page, it panics!
The error says:

> Run for you liiiiives!

Oh wait, it actually says:

> Because you have multiple authenticators in firewall "main", you need to set the
> `entry_point:` key to one of your authenticators.

And it helpfully tells us the two authenticators that we have. In other words:
it's making us choose.

Copy the `entry_point` key... then, anywhere under the firewall, say
`entry_point:` and then point to the `LoginFormAuthenticator` service.

Technically we can point to *any* service that implements
`AuthenticationEntryPointInterface`... but usually I put that in my authenticator.

*Now*... if we go back to `/admin`.... it works fine! It knows to choose the entry
point from `LoginFormAuthenticator`.

Speaking of `LoginFormAuthenticator`... um... we've been doing *way* too much
work inside of it! That's my bad - we're doing things the hard way for... ya know...
"learning"! But next, let's cut that out and leverage a base class from Symfony
that will let us delete a *bunch* of code. We're also going to learn about
something called `TargetPathTrait`: an intelligent way to redirect the user on
success.
