# Custom User Query & Credentials

On the screen, we see a `dd()` of the password I entered into the login form and
the `User` entity *object* from the database for the *email* I entered. Something,
*somehow* knew to take the submitted email and query for the User!

## UserBadge & The User Provider

Here's how this works. After we return the `Passport` object, the security system
tries to find the `User` object from the `UserBadge`. If you just pass *one* argument
to `UserBadge` - like we are - then it does this by leveraging our user provider.
Remember that thing in `security.yaml` called `providers`? Because our `User` class
is an entity, we're using the `entity` provider that knows how to load users using
the `email` property. So basically this is an object that's *really* good at querying
the user table via the `email` property. So when we pass just the email to
the `UserBadge`, the user provider uses that to query for the `User`.

If a `User` object *is* found, Symfony *then* tries to "check the credentials"
on our passport. Because we're using `CustomCredentials`, this means that it
executes this callback... where we're dumping some data. If a `User` could *not*
be found - because we entered an email that isn't in the database - authentication
fails. More on both of these situations soon.

## Custom User Query

*Anyways*, the point is this: if you *just* pass one argument to `UserBadge`,
the user provider loads the user automatically. That's the easiest thing to do.
And you can even customize this query a bit if you need to - search for
"Using a Custom Query to Load the User" on the Symfony docs to see how.

Or... you can write your *own* custom logic to load the user right here. To do
that, we're going to need the `UserRepository`. At the top of the class, add public
function `__construct()`... and autowire a `UserRepository` argument. I'll hit
Alt + Enter and select "initialize properties" to create that property and set it.

Down in `authenticate()`, `UserBadge` has an optional *second* argument called a
user loader. Pass it a callback with one argument: `$userIdentifier`.

It's pretty simple: if you pass a callable, then when Symfony loads your `User`,
it will call *this* function *instead* of your user provider. Our job here is to
"load the user" and return it. The `$userIdentifier` will be whatever we passed
to the first argument of `UserBadge`... so the `email` in our case.

Say `$user = $this->userRepository->findOneBy()` to query for `email` set to
`$userIdentifier`. This is where you could use whatever custom query you want.
If we *can't* find the user, we need to throw a special exception. So if not
`$user`, `throw new UserNotFoundException()`. That will cause authentication
to fail.

At the bottom, return `$user`.

This... is basically identical to what our user provider was doing a minute ago...
so it won't change anything. But you can see how we have the power to load the
`User` *however* we want to.

Let's refresh. Yup! The same dump as before.

## Validating the Credentials

Ok, so *if* a `User` object is found - either from our custom callback or the
user provider - Symfony *next* checks our credentials, which means something different
depending on *which* credentials object you pass. There are 3 main ones:
`PasswordCredentials` - we'll see that later, a `SelfValidatingPassport` which is
good for API authentication and doesn't need any credentials - and `CustomCredentials`.

If you use `CustomCredentials`, Symfony executes the callback... and our job is to
"check their credentials"... whatever that means in our app. The `$credentials`
argument will match whatever we passed to the 2nd argument to `CustomCredentials`.
For us, that's the submitted password.

Let's pretend that all users have the same password `tada`! To validate that, return
true if `$credentials === 'tada'`. Air-tight security!

## Authentication Failure and Success

If we return `true` from this function, authentication is successful! Woo! If we
return false, authentication fails. To prove this, go down to
`onAuthenticationSuccess()` and `dd('success')`. Do the same thing
inside `onAuthenticationFailure()`.

We'll put *real* code into these methods soon... but their purpose is pretty
self-explanatory: if authentication is successful, Symfony will call
`onAuthenticationSuccess()`. If authentication fails for *any* reason - like an
invalid email *or* password - Symfony will call `onAuthenticationFailure()`.

Let's try it! Go directly back to `/login`. Use the real email again -
`abraca_admin@example.com` with the correct password: `tada`. Submit and... yes!
It hit `onAuthenticationSuccess()`. Authentication is complete!

I know, it doesn't *look* like much yet... so next, let's *do* something on success,
like redirect to another page. We're also going to learn about the *other* critical
job of a user provider: refreshing the user from the session at the beginning of
each request to keep us logged in.
