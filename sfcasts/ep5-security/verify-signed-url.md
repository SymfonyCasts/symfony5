# Verifying the Signed Confirm Email URL

We're now generating a signed URL that we would *normally* include in a "confirm
your email address" that we send to the user after registration. To keep things
simpler, we're just rendering that URL onto the page after registration.

## Removing our Unused Bind

Let's go see what it looks like. Refresh and... ah! A terrible-looking error!

> A binding is configured for an argument named `$formLoggingAuthenticator` under
> `_defaults`, but no corresponding argument has been found.

So until a few minutes ago, we had an argument to our `register()` action that was
called `$formLoginAuthenticator`. Over in `config/services.yaml`, we
set up a global "bind" that said:

> Whenever and autowired service has an argument named `$formLoginAuthenticator`,
> please pass them this service.

One of the cool things about bind is that if there is *no* matching argument
anywhere in our app, it throws an exception. It's trying to make sure that we're
not making an accidental typo anywhere.

In our situation, we just don't need that argument anymore... so we can delete it.
And now... our registration page finishes!

## Checking out the Verify URL

So let's try it! Enter an email, some password, agree to the terms and hit register.
Beautiful! Here is our email confirmation URL. You can see that it goes to
`/verify`: that will hit our new `verifyUserEmail()` action. It also includes
an expiration. That's something you can configure... it's how long the link
is valid for. And it has a `signature`: that's something that, once we verify
it, will prove that the user didn't just make up this URL: it definitely came
from us.

It also includes an `id=18`. That's our user id.

## Verifying the Signed URL

So our job now is to go into the `verifyUserEmail` controller method down here
and *validate* that signed URL. To do that, we're going to need a couple of arguments:
the `Request` object - so we can read data from the URL - a
`VerifyEmailHelperInterface` argument to help us validate the URL - and finally,
our `UserRepository`, so we can query for the `User` object.

And actually, that's the first thing we need to do. Say
`$user = $userRepository->find()` and find the user that this confirmation link
belongs to by reading the `id` query parameter. So, `$request->query->get('id')`.
And if, for some reason, we can't find `User`, let's trigger a 404 page by throwing
`$this->createNotFoundException()`.

*Now* we can make sure that the signed URL hasn't been tampered with. To do that,
add a try-catch block. Inside, say `$verifyEmailHelper->validateEmailConfirmation()`
and pass in a couple of things. First, pass the actual current URL, which we
can get with `$request->getUri()`. Next pass the user's id - `$user->getId()` then
the user's email - `$user->getEmail()`. This makes sure that the id and email haven't
changed in the database since the verification email was sent. The id *definitely*
hasn't changed... since we just used it to query... this part only really applies
if you rely on the user being logged in to verify their email.

Anyways, if this is successful... nothing will happen! If it fails, it will throw a
special exception that will implement `VerifyEmailExceptionInterface`. So down here,
we know the verifying the URL has failed... maybe someone messed with the URL. Or,
more likely, it's expired. Let's tell then the reason by leveraging the flash
system again. Say `$this->addFlash()` but this time put it into a different category
called `error`. Then, to say went wrong, use `$e->getReason()`. Finally, use
`redirectRoute()` to send them somewhere. How about the registration page?

To render the error, back in `base.html.twig`, duplicate this entire block,
but look for `error` messages and use `alert-danger`.

Phew! Let's try the error case. Copy the URL then open a new tab and paste. If
I go to this *real* URL... it works. Well, we still need to do some more coding,
but it hits our TODO at the bottom of the controller. *Now*, mess with the URL,
like remove a few characters... or try to tweak the expiration or change the
`id` part. Now... yes! It failed because our link is invalid. If the link were
expired, you would see a message about that.

So, finally, let's finish the happy case! At the bottom of our controller, now that
we know that the verification link *is* valid, we are done. For our app, we can
say `$user->isVerified(true)` and store that in the database.

To do that... add one more argument: `EntityManagerInterface $entityManager`. Then,
down here, say `$entityManager->flush()` to save that change. And let's give
this a happy success message:

> Account verified! You can now log in.

Well, the truth is, we're not *yet* preventing them from logging in before they
verify their email. But we *will* add that soon. Anyways, finish by redirecting
them to the login page: `app_login`.

If you wanted to be *even* cooler, you could choose to manually authenticate the
user in the same way that did earlier in our registration controller. That's totally
ok and up to you.

Back in my main tab... copy that link again, paste and... we are verified! Sweet!

The only thing left to do is to prevent the user from logging in until they've
verified their email. To do that, we first need to learn about the events that happen
inside of the security system. And to show off *those*, we'll leverages a really
cool new feature: login throttling.
