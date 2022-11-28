# Verify Email after Registration

On some sites, after registration, you need to verify your email. You're almost
definitely familiar with the process: you register, they send a special link to
your email, you click that link and voilà! Your email is verified. If you *don't*
click that link, depending on the site, you might not have access to certain
sections... or you may not be able to log in at all. *That's* what we're going
to do.

When we originally ran the `make:registration-form` command, it asked us if we wanted
to generate an email verification process. If we had said yes, it would have generated
some code for us. We said no... so that we could build it by hand, learn a bit more
about how it works *and* customize things a bit.

## User.isVerified Property

But before we jump into sending the verification email, inside our `User` class,
we need some way to track whether or not a user has verified their email. Let's
add a new field for that. Run:

```terminal
symfony console make:entity
```

Update `User`, add an `isVerified` property, boolean type, not nullable and...
perfect! Head over to the class. Let's see... here we go: `$isVerified`:

[[[ code('7b6a00197d') ]]]

Let's default this to `false`:

[[[ code('2106a7e246') ]]]

Ok, time for the migration:

```terminal
symfony console make:migration
```

Go check that out and... awesome. It looks exactly like we expect:

[[[ code('6bd47260f7') ]]]

Run it!

```terminal
symfony console doctrine:migrations:migrate
```

Beautiful! Let's do one more thing related to the database. Inside of
`src/Factory/UserFactory.php`, to make life simpler, set `$isVerified` to `true`:

[[[ code('9f079af27f') ]]]

So, by default, users in our fixtures will be verified. But I won't worry about
reloading my fixtures quite yet.

## Hello VerifyEmailBundle!

Okay: *now* let's add the email confirmation system! How? By leveraging a bundle!
At your terminal, run:

```terminal
composer require "symfonycasts/verify-email-bundle:1.11.0"
```

Hey, I know them! This bundle gives us a couple of services that will help
generate a signed URL that we will include in the email and then *validate* that
signed URL when the user clicks it. To get this working, open up
`RegistrationController`. We already have our working `register()` method.
*Now* we need one other method. Add public function `verifyUserEmail()`. Above this,
give it a route: `@Route("/verify")` with `name="app_verify_email"`:

[[[ code('0bac7d3cc4') ]]]

When the user clicks the "confirm email" link in the email that we send them,
*this* is the route and controller that link will take them to. I'm going to
leave it empty for now. But eventually, its job will be to validate the signed URL,
which will prove that the user *did* click on the exact link that we sent them.

## Sending the Confirmation Email

Up in the `register()` action, *here* is where we need to send that email.
As I mentioned earlier, you can do different things on your site based on
whether or not the user's email is verified. In our site, we are going to
completely *prevent* the user from logging in until their email is verified. So I'm
going to remove the `$userAuthenticator` stuff:

[[[ code('fa2c533db4') ]]]

And replace that with the original redirect to `app_homepage`:

[[[ code('e95c6f8006') ]]]

Up top, we can remove some arguments.

Cool. *Now* we need to generate the signed email confirmation link and send
it to the user. To do that, autowire a new service type-hinted with
`VerifyEmailHelperInterface`. Call it `$verifyEmailHelper`:

[[[ code('51da6f14d2') ]]]

Below, after we save the user, let's generate that signed URL. This... looks a little
weird at first. Say `$signatureComponents` equals
`$verifyEmailHelper->generateSignature()`:

[[[ code('fe1fd88609') ]]]

The first argument is the route name to the verification route. For us,
that will be `app_verify_email`:

[[[ code('b114cea228') ]]]

So I'll put that here. Then the user's id - `$user->getId()` - and the user's email,
`$user->getEmail()`:

[[[ code('4ebe1c6095') ]]]

These are both used to "sign" the URL, which will help prove that *this* user
*did* click the link from the email we sent them:

## Verifying the Email without Being Logged In

But now we have a decision point. There are two different ways to use the
VerifyEmailBundle. The first one is where, when the user clicks this email
confirmation link, you expect them to be logged in. In this situation, down in
`verifyUserEmail()`, we can use `$this->getUser()` to figure out *who* is trying
to verify their email and use that to help validate the signed URL.

The other way, which is the way that *we're* going to use, is to allow the user to
*not* be logged in when they click the confirmation link in their email. With this
mode, we need to pass an array as the final argument to include the user id:

[[[ code('e933d8bdb6') ]]]

The *whole* point of this `generateSignature()` method is to generate a signed URL.
And thanks to this last argument, that URL will now contain an `id` query parameter...
which we can use down in the `verifyUserEmail()` method to query for the `User`.
We'll see that soon.

At this point, in a real app, you would take this `$signatureComponents` thing, pass
it into an email template, use it to render the link and then send the email. But
this is not a tutorial about sending emails - though we *do* have that
[tutorial](https://symfonycasts.com/screencast/mailer). So I'm going to take
a shortcut. Instead of sending an email, say `$this->addFlash('success')` with
a little message that says, "Confirm your email at:" and then the signed URL.
You can generate that by saying `$signatureComponents->getSignedUrl()`:

[[[ code('52ed379578') ]]]

We haven't talked about flash messages. They're basically temporary messages that
you can put into the session... then render them one time. I put this message
into a `success` category. Thanks to this, over in `templates/base.html.twig`, right
after the navigation - so it's on top of the page - we can render any `success`
flash messages. Add for `flash in app.flashes()` and then look up that key `success`.
Inside, add `div` with `alert`, `alert-success` and render the message:

[[[ code('fd0081fe0d') ]]]

This flash stuff has nothing to do with email confirmation... it's just a
feature of Symfony that's most commonly used when you're handling forms. But it's
a nice shortcut to help us test this.

Next: let's... do that! Test out our registration form and see what this signed URL
looks like. Then we'll fill in the logic to verify that URL and confirm our user.
