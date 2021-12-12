# Verifying the Signed Confirm Email URL

Coming soon...

Let's try it! I
refresh the page. Now I get a terrible error. A binding is configured for an argument
named form logging authenticator under _defaults, but no course dawning argument has
been found. So until a few minutes ago, we had an argument to our register action
that was called far `FormLoggingAuthenticator` over in our `config/services.yaml`
file. We set up a global bind that said when the arguments used to pass
this service, one of the cool things about bind is that if this argument doesn't
isn't used anywhere in your application, it actually throws an exception. It's kind
of trying to help you make sure you're not making a mistake or making a type of
anyways. Now that we're not using this anymore, we can delete it. And now our
registration Page finishes. All right. So let's go into, let's go through this
process.

Great. Some new user or agree to the terms and register beautiful. So you can say
here is our long URL and it's going to R `/verify` controller. It includes an
expiration. That's something you can configure, how long your, these links, uh,
include any signature. That kind of, sort of guarantees that the user couldn't just
make up the, see where all had to have come from their email. It also includes a
little at I, an `id=18`. That's our user ID. So our job now is to go into the
verified controller down here. And we're going to validate that that signed URL is
valid. Do that first thing we're gonna need is actually, we're gonna need a couple of
arguments here. First, we're going to need some things, `Request` objects that we can
read, uh, the URL. We're also going to need the

`VerifyEmailHelperInterface` arguments, cause that's gonna help us validate the URL. And
the last thing we're gonna need is actually the `UserRepository`. So we can query for
the user so that we, that last step is actually the first one. So I'll say
`$user = $userRepository->find()`, and then I'm going to see what users logged in by reading
that `id` query parameter. So we can do that `$request->query->get('id')`. And
for some reason we don't find that user in our system that shouldn't happen, but we
will throw `$this->createNotFoundException()`. So that's just a 4 0 4 error

Next to validate that this signed URL hasn't been tampered with and is valid news, a
try-catch block. Instead of here, we're gonna say `$verifyEmailHelper->validateEmailConfirmation()`
and we're going to pass this a couple of things. The
first is going to be the sign you were else in the actual current URL. You can get
that with `$request->getUri()` So what, the second thing we need to do passes
the user ID. So `$user->getId()` and then `$user->getEmail()`, actually make sure
that the user ID and user email haven't changed in the database since the
verification email was sent. Now, if this is successful, nothing will happen. If it
fails, it will throw a special exception called a `VerifyEmailExceptionInterface`.
So down here, now we know that, uh, validation, uh, failed somebody maybe messed with
the URL. It could be a bad character. So let's use that `addFlash()` again, this time I'm
going to invent kind of a different category called `error`, and then to say went
wrong. We can say `$e->getReason()`. Cause maybe the signature was invalid or maybe
the, um, the link has expired

And then we will use redirect route and we'll send them back. How about to the
registration page? So he has some sort of an error with that and send them back to
really any page. It doesn't matter. And down here, I'm still going to say, just add,
add to two for the successful situation. Now, in order for these error message to be
rendered, I'm going to go back to base studies of twig. And we're just going to
duplicate this block here. Look for `error` messages, use `alert-danger`, and then print
those out as well. Phew.

All right. Let's try and be kind of air case. So let's pretend that we are sent this
email and click the whole thing. I'm going to open this in a new tab and if I don't
mess with it, it works. It hits our to do, which means that this was validated. If I
mess around with any part of this, I could just like delete a couple characters out
of the signature. It's going to fail the link to your verified email is invalid.
Please request a new link. So cool. So at the bottom of our controller, now that we
know that the validation link is true, we are done. So in our case, what we want to
do is say, `$user->isVerified(true)` and store that in the database.

And then we'll save that. So I will add one more argument here and see
`EntityManagerInterface $entityManager`, and then down here, we'll say, and
`$entityManager->flush()`. So
it saves that new user. And then we'll add a little success, a little success, flash
message account verified. You can now log in at the bottom. We'll redirect them to
`app_login`. Now, if you wanted, you could do one better here. You could in the same
way, you could actually manually authenticate the user in the same way that we were
manually authenticating to before inside of our registration controller. That's
totally doable. All right. So let's, let's go back over here and I will copy that
link again, paste and we are verified. Sweet me only missing feature is something
that prevents the user from logging in before they're verified to do that. Let's
learn about the events that happen inside of the security system and show off another
cool feature that leverages those events, login throttling.
