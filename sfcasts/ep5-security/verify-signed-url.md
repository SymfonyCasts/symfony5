# Verifying the Signed Confirm Email URL

We're now generating a signed URL that we would *normally* include in a "confirm
your email address" email that we send to the user after registration. To keep
things simple, we're just rendering that URL onto the page after registration.

## Removing our Unused Bind

Let's... go see what it looks like. Refresh and... ah! A terrible-looking error!

> A binding is configured for an argument named `$formLoginAuthenticator` under
> `_defaults`, but no corresponding argument has been found.

So until a few minutes ago, we had an argument to our `register()` action that was
called `$formLoginAuthenticator`. Over in `config/services.yaml`, we
set up a global "bind" that said:

> Whenever an autowired service has an argument named `$formLoginAuthenticator`,
> please pass this service.

[[[ code('882f3addc8') ]]]

One of the cool things about bind is that if there is *no* matching argument
*anywhere* in our app, it throws an exception. It's trying to make sure that we're
not making an accidental typo.

In our situation, we... just don't need that argument anymore. So, delete it.
And now... our registration page is alive!

## Checking out the Verify URL

Let's do this! Enter an email, some password, agree to the terms and hit register.
Beautiful! Here is our email confirmation URL. You can see that it goes to
`/verify`: that will hit our new `verifyUserEmail()` action. It also includes
an expiration. That's something you can configure... it's how long the link
is valid for. And it has a `signature`: that's something that will help prove
that the user didn't just make up this URL: it definitely came from us.

It also includes an `id=18`: our user id.

## Verifying the Signed URL

So our job now is to go into the `verifyUserEmail` controller method down here
and *validate* that signed URL. To do that, we need a few arguments:
the `Request` object - so we can read data from the URL - a
`VerifyEmailHelperInterface` to help us validate the URL - and finally,
our `UserRepository` - so we can query for the `User` object:

[[[ code('f2723a14dc') ]]]

And actually, that's our first job. Say `$user = $userRepository->find()` and
find the user that this confirmation link belongs to by reading the `id` query
parameter. So, `$request->query->get('id')`. And if, for some reason, we can't
find the `User`, let's trigger a 404 page by throwing
`$this->createNotFoundException()`:

[[[ code('4c1eedf886') ]]]

*Now* we can make sure that the signed URL hasn't been tampered with. To do that,
add a try-catch block. Inside, say `$verifyEmailHelper->validateEmailConfirmation()`
and pass in a couple of things. First, the signed URL, which... is the current URL.
Get that with `$request->getUri()`. Next pass the user's id - `$user->getId()` then
the user's email - `$user->getEmail()`:

[[[ code('0db135a3f6') ]]]

This makes sure that the id and email haven't changed in the *database* since
the verification email was sent. Well, the id *definitely* hasn't changed...
since we just used it to query. This part only really applies if you rely on
the user being logged in to verify their email.

Anyways, if this is successful... nothing will happen! If it fails, it will throw a
special exception that implements `VerifyEmailExceptionInterface`:

[[[ code('e45fac579f') ]]]

So, down here, we know that verifying the URL failed... maybe someone messed
with it. Or, more likely, the link expired. Let's tell the user the reason
by leveraging the flash system again. Say `$this->addFlash()`, but this time
put it into a different category called `error`. Then, to say what went wrong,
use `$e->getReason()`. Finally, use `redirectToRoute()` to send them somewhere.
How about the registration page?

[[[ code('d1a77dfa67') ]]]

To render the error, back in `base.html.twig`, duplicate this entire block,
but look for `error` messages and use `alert-danger`:

[[[ code('315db02373') ]]]

Phew! Let's try the error case. Copy the URL then open a new tab and paste. If
I go to this *real* URL... it works. Well, we still need to do some more coding,
but it hits our TODO at the bottom of the controller. *Now* mess with the URL,
like remove a few characters... or tweak the expiration or change the `id`.
Now... yes! It failed because our link is invalid. If the link were expired, you
would see a message about that.

So, finally, let's finish the happy case! At the bottom of our controller, now that
we know that the verification link *is* valid, we are done. For our app, we can
say `$user->isVerified(true)` and then store that in the database:

[[[ code('5a032845ce') ]]]

Let' see... we need one more argument: `EntityManagerInterface $entityManager`:

[[[ code('e0e6137ac4') ]]]

Back down here, use `$entityManager->flush()` to save that change:

[[[ code('7aa66d12a2') ]]]

And let's give this a happy success message:

> Account verified! You can now log in.

Well, the truth is, we're not *yet* preventing them from logging in before they
verify their email. But we *will* soon. Anyways, finish by redirecting
to the login page: `app_login`:

[[[ code('3cf0b00443') ]]]

If you wanted to be *even* cooler, you could manually authenticate the user in
the same way that we did earlier in our registration controller. That's totally
ok and up to you.

Back in my main tab... copy that link again, paste and... we are verified! Sweet!

The only thing left to do is to prevent the user from logging in until they've
verified their email. To do that, we first need to learn about the events that happen
inside of the security system. And to show off *those*, we'll leverage a really
cool new feature: login throttling.
