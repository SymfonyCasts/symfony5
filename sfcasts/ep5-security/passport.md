# Authenticator & The Passport

On a basic level, authenticating a user when we submit the login form is... pretty
simple. We need to read the submitted `email`, query the database for that
`User` object... and eventually check the user's password.

## Symfony's Security Doesn't Happen in a Controller

The *weird* thing about Symfony's security system is that... we're *not* going to
write this logic in the controller. Nope. When we POST to `/login`, our authenticator
is going to *intercept* that request and do all the work itself. Yup, when we
submit the login form, our controller will actually *never* be executed.

## The supports() Method

Now that our authenticator is activated, at the start of each request, Symfony
will call the `supports()` method on our class. Our job is to return `true` if
this request "contains authentication info that we know how to process". If not,
we return `false`. If we return `false`, we don't *fail* authentication: it just
means that our authenticator doesn't know how to authenticate this request... and
the request continues processing like normal... executing whatever controller it
matches.

So let's think: when do we want our authenticator to "do its work"? Which requests
will "contains authentication info that we know how to process"? The answer to
that is: whenever the user submits the login form.

Inside of `supports()` return true if `$request->getPathInfo()` - that's a fancy
method to get the current URL - equals `/login` *and* if `$request->isMethod('POST')`:

[[[ code('7d0098ac83') ]]]

So *if* the current request is a POST to `/login`, we want to try to authenticate
the user. If not, we want to allow the request to continue like normal.

To see what happens next, down in `authenticate()`, `dd('authenticate')`:

***TIP
`PassportInterface` was deprecated since Symfony 5.4: use `Passport` as a return type instead.
***

[[[ code('743dc917b8') ]]]

Testing time! Go refresh the homepage. Yup! The `supports()` method returned
`false`... and the page kept loading like normal. In the web debug toolbar, we have
a new security icon that says "Authenticated: no". But now go to the login form.
This page *still* loads like normal. Enter `abraca_admin@example.com` - that's the
email of a *real* user in the database - and any password - I'll use `foobar`.
Submit and... got it! It hit our `dd('authenticate')`!

## The authenticate() Method

So if `supports()` returns true, Symfony *then* calls `authenticate()`. *This*
is the *heart* of our authenticator... and its job is to communicate two important
things. First, *who* the user is that's trying to log in - specifically, which
`User` object they are - and second, some *proof* that they are this user. In the
case of a login form, that would be a password. Since our users don't actually
*have* passwords yet... we'll fake it temporarily.

## The Passport Object: UserBadge & Credentials

We communicate these two things by returning a `Passport` object: return new
`Passport()`:

[[[ code('7ff1720cce') ]]]

This simple object is basically just a container for things called "badges"...
where a badge is a little piece of information that goes into the passport.
The two most important badges are `UserBadge` and some sort of "credentials badge"
that helps prove that this user *is* who they say they are.

Start by grabbing the POSTed email and password:
`$email = $request->request->get('email')`. If you haven't seen it before,
`$request->request->get()` is how you read `POST` data in Symfony. In the login
template, the name of the field is `email`... so we read the `email` POST field.
Copy and paste this line to create a `$password` variable that reads the
`password` field from the form:

[[[ code('5143281c67') ]]]

Next, inside of the `Passport`, the first argument is always the `UserBadge`. Say
`new UserBadge()` and pass this our "user identifier". For us, that's the `$email`:

[[[ code('21f09737a4') ]]]

We'll talk *very* soon about how this is used.

The second argument to `Passport` is some sort of "credentials". Eventually we're
going to pass it a `PasswordCredentials()`.... but since our users don't have passwords
yet, use a new `CustomCredentials()`. Pass this a callback with a `$credentials`
arguments and a `$user` argument type-hinted with our `User` class:

[[[ code('cc26c9624a') ]]]

Symfony will execute our callback and allow *us* to manually "check the credentials"
for this user... whatever that means in our app. To start, `dd($credentials, $user)`.
Oh, and `CustomCredentials` needs a second argument - which is whatever our "credentials"
are. For us, that's `$password`:

[[[ code('f033f60434') ]]]

If this `CustomCredentials` thing is a little fuzzy, don't worry: we really need to see
this in action.

But on a high level... it's kind of cool. We return a `Passport` object, which
says *who* the user is - identified by their `email` - and some sort of a
"credentials process" that will *prove* that the user is who they say they are.

Ok: with *just* this, let's try it. Go back to the login form and re-submit.
Remember: we filled in the form using an email address that *does* exist in our
database.

And... awesome! `foobar` is what I submitted for my password and it's also
dumping the correct `User` entity object from the database! So... woh! Somehow
it knew to query for the `User` object *using* that email. How does that work?

The answer is the user provider! Let's dive into that next, learn how we can
make a *custom* query for our user and finish the authentication process.
