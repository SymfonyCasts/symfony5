# QR Data & Scanning with an Authenticator App

Okay, status check. Any user can now enable two-factor authentication on their
account by clicking this link. Behind the scenes, when they do that, we populate
the `totpSecret` on the `User` object, save that to the database, and then render
a QR code the user can scan. This QR code is a fancy image that
contains two pieces of information. The first is the email of our user. Or, more
precisely, if I scroll down to the "totp methods" in `User`, it contains whatever
we return from `getTotpAuthenticationUsername()`.

The second thing the QR code image contains is the `totpSecret`. In a minute, I'm
going to scan this code with an authenticator app, which will allow me to generate
the correct two-factor authentication code that I'll need to log in. It does that
by leveraging that secret.

## Adding Extra Info to the QR Code

But first, there *is* some *extra* info that we can add to the QR code. Head over
to `config/packages/scheb_2fa.yaml`. Under `totp:`, one of the most important things
that you can add is called an `issuer`. I'm going to set this to `Cauldron Overflow`.
That *literally* just added new information to the QR code image. Watch the image
when we refresh. See that? It changed!

Thanks to this, in addition to the `email` and `totpSecret`, the code *now*
contains an "issuer" key. If you want to learn about *all* the extra information
that you can put here, check out the documentation or read about totp authentication
in general. Because, for example, "issuer" is just a "totp concept"... that helps
authenticator apps generate a label for our site when we scan this code.

## Scanning with our Authenticator App

At this point, I want to pretend that we're a *real* user and test the *entire* flow. If
we *were* a real user we would pull out our phone, open an
authenticator app - like Google authenticator or Authy - and scan this code.

I like using Authy, here's what it looks like for me. I add a new account,
scan and... got it! It reads my email and the "issuer" from the QR code and
suggests a name and logo. If your company is well-known, it might actually
guess the correct logo, but you can also add an `image` to your QR code in the
same way that we added the “issuer”. When I accept this, it gives me codes!

## Logging in

So we are ready! Let's try it! Log out... and then log back in with
`abraca_admin@example.com`, password `tada`. Submit and... sweet! Instead of
actually being logged in, we're redirected to the two-factor authentication
page! This happened for two reasons. First, the user has two-factor authentication
enabled on their account. Specifically, this `isTotpAuthenticationEnabled()` method
returned true. Second, the security "token" - that internal thing that wraps your
`User` object when you log in - well, it matches one of the tokens in our configuration.
Specifically, we get the `UsernamePasswordToken` when we log in via the `form_login`
mechanism.

If we try going *anywhere* else on the site, it kicks us right back here. The
only place we can go to is `/logout` if we wanted to cancel the process. This is
because the two-factor bundle will now deny access to *any* page on our site unless
you've explicitly allowed it via the `access_control` rules, like we did for
`/logout` and for the URL showing this form. This form *is* ugly, but we'll fix
that soon.

Ok, back to pretending I'm a real user. I'll open up my authenticator app, type in a valid
code: 5, 3, 9, 9, 2, 2 and... got it! We're logged in! So cool!

Next, let's customize that two-factor authentication form... because it was
*ugly*.
