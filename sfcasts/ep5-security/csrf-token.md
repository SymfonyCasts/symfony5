# Csrf Token

Coming soon...

After we returned the `Passport` object. We know that two things happen. The `UserBadge`
is used to get the `User` object in our case because we pass the second argument. It
just calls our function and we do the work. But earlier we found out that it also
works by just doing this and that case. It relies on our user provider to use the
email, to load the user. The second thing is that the credentials badge is resolved.
Originally it did this by executing our callback. Now it checks the user's password.
In reality, after authenticate the security system, dispatches Several events, and
there are a bunch of listeners to the events that do different work. We're going to
see a full list of these listeners later and even add our own listeners to the
system. But let's look at a few of them. I'm going to hit shift, shift and load some
core files from Symfony. First one is called `UserProviderListener`. Make sure you
have included non project items and Open it up. This is called after we return our
passport and its job is to use the `UserProvider` to load the user from the user
batch. So check it out. It checks to see if the password has a `UserBadge`, which it
will,

And then check to see if a badge has a user loader. That's basically, if we had
passed that second argument to, um, user badge, this is the user loader. If it has
that, then it does nothing, but if it doesn't then down here, it actually sets the
user loader. It sets that call back to use the `loadUserByIdentifier()` method on this
era user provider. This is a little technical, but basically this is what kind of,
this is what causes our user provider in `security.yaml`. So you be responsible for
loading the user from the database or wherever Let's check one other class. So I'll
close this one and hit shift shift, say `PasswordCredentials`, and opened up that
class. This as the name suggests, Oh, you know what? For a `CheckCredentialsListener`
this as the name suggests is responsible for checking the password on the
badge. Okay?

So as you can see, it checks to see if the bass, if the passport. So the 
`PasswordCredentials`, even though its name doesn't sound like it is actually just another one
of those badges, that's on the passport. So this checks to see if the password has
that badge. And if it does it grabs that badge grabs the password off of it, which is
going to be the plain text and then a password. And eventually way down here, it
actually uses the password Hasher to verify that the password is correct. So this
contains all of that password hashing logic. So your password always has at least
these two badges, your User badge, and also some sort of credentials badge. And what
property of badges is that they must be resolved. You can see that in 
`CheckCredentialsListener`, after it finished is actually checking the password at calls,
`$badge->markResolved()`. If for some reason, this chat credentials listener was
never called and due to some misconfiguration, the badge would remain unresolved and
that would actually cause authentication to fail. This means that you can always
confidently just return passer kennels here, and you don't have to worry about did
something actually check that if nothing checked it authentication will fail.

Now, what really gets interesting here is that in addition to these two badges, we
can also add more badges to our passport that activate more super powers in the
system. For example, one good thing to have on a log and form is a CSRF protection.
Basically you add a hidden field to your form that contains a CSRF token. Then on
submit, validate that tote, validate that token. Let's do this Anywhere inside your
forum. Let's add an input `type="hidden"`,

And then `name="_csrf_token"`. This name could be anything, but this is a
standard name then for the value degeneracy SF token. And there's a CSRF and say
curly, curly `csrf_token()`. And then you're gonna pass it here. A string. We're going to
use the string `authenticate` again. This could be anything as well. It's almost like a
category for the CSRF token, but this is the standard one that's used for security.
Actually, that's not true. We do need to use authenticate there. Now that we have
this field, I'll copy the, the name of it over in our `LoginFormAuthenticator`, we
basically want to do is read this field from the post data and then ask Symfony is
this CSRF token valid? Fortunately, we don't actually need to do that by hand.

It's actually a third argument to our passport, which is an array of any other badges
that we want to add to it. So I'll pass this an array, and then I'm going to pass a
new `CsrfTokenBadge()`. This, uh, has two arguments. The first one is the CSRF token
ID. So we're going to say "authenticate", this just needs to match whatever we used.
One regenerated the token. And the second thing is going to be the actual value. So
that's going to be `$request->request->get()` and then the name of our field `_csrf_token`
That's all we need to do internally. That's going to activate a listener.
That's going to validate that. Or if for some reason that listener wasn't valid, then
it would be, we don't need that. All right, let's try it. Go to login and let's
inspect an element on here and we should see, there we go.

Nice new CSRF token put in any email address and any password. And then I'm going to
mess with the CSRF token here. We'll just delete a couple of characters off of it and
then sign it beautiful before any other validation happens. It checks the CSM token.
It says invalid CSRF token. If we don't mess with it and just leave it alone and use
any email and password beautiful. The email that finally got past that CSRF token
validation. So next let's leverage Symfony's remember me system to allow users to
stay logged in for a long time. This feature also leverages the listener system that
we just saw.

