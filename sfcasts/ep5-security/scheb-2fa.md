# 2 Factor Authentication & Authentication Tokens

For our last trick in this tutorial, we're going to do something fun: add two-factor
authentication. This can take a few forms, but the basic flow looks like
this, you're probably familiar. First, the user submits a valid email and
password to the login form. But then, instead of that logging them in, they're
redirected to a form where they need to enter a temporary code.

This code could be something that we email them or text to their phone... or it
could be a code from an authenticator app like Google authenticator or Authy. Once
the user fills in the code and submits, *then* they are finally logged in.

## Installing The scheb/2fa-bundle

In the Symfony world, we're *super* lucky to have a *fantastic* library to help
with two-factor auth. Search for Symfony 2fa to find the scheb/2fa library.
Scroll down... and click into the documentation, which lives on Symfony.com. Then
head to the Installation page.

Cool! Let's get this thing installed! At your terminal, run:

```terminal
composer require 2fa
```

Where 2fa is a Flex alias to the actual bundle name.

Once this finishes... I'll run `git status` to see what the bundle's recipe did. Cool:
it added a new configuration file... and also a new routes file.

That routes file, which lives at `config/routes/scheb_2fa.yaml`, adds two routes
to our app. The first will render the "enter the code” form that we see
after submitting our email and password. The second route is the URL that this form
will submit to.

## Bundle Configuration / Setup

Back at the docs, let's walk through this. Step 2 - enable the bundle - was done by
Flex automatically… and step 3 - define the routes - was handled thanks to the recipe.
Nice!

Step 4 is to configure the firewall. This part we *do* need to do.

Start by copying the `two_factor` stuff. Then open up
`config/packages/security.yaml`. This new config can live anywhere under our
`main` firewall. I'll paste it after `form_login`... and we can remove this
comment: it highlighted that `2fa_login` should match the route name in
our routes file, which it does.

Oh, and remember how the job of *most* keys under our firewall is to activate
another *authenticator*? Whelp, the `two_factor` key is no exception: this activates
a new authenticator that handles the "enter your code" form submit that we'll
see in a few minutes.

The README also recommends a couple of access controls, which are a good idea.
Copy those... and paste them at the top of our `access_control`.

This second one makes sure that you can't go to `/2fa` - that's the URL that renders
the "enter your code" form - unless you *have* already submitted your valid email
and password. When you're in that, sort of, “in-between-login” state, the 2fa bundle
makes sure that you have this `IS_AUTHENTICATED_2FA_IN_PROGRESS` attribute.

The first entry - for `/logout` - makes sure that if you *are* in that “in-between”
state, you *can* still cancel the login by going to `/logout`. Oh, but change
this to `PUBLIC_ACCESS`.

## Configuring the security_tokens

The *last* step in the README is to configure this `security_tokens` config.

Let me explain. When we submit a valid email and password into the login form,
the two-factor authentication system - via a listener - is going to decide whether
or not it should *interrupt* authentication and start the two factor
authentication process... where it redirects the user to the "enter the code" form.

If we think about it, we definitely *do* want this to happen when a user logs in
via the login form. But... we probably *wouldn't* want this
to happen if, for example, a user was authenticating via an API token. The
bundle needs a way to figure out whether or not we want 2fa based on *how*
the user just authenticated.

We haven't talked about it much, but whenever you log in, you're
authenticated with a certain type of *token* object. This token object is... sort
of a wrapper around the `User` object... and you almost *never* care about it.

But, different authentication systems - like `form_login` or `remember_me` - use
different token classes... which means that you can figure out *how* the user
originally logged in, by looking at the currently-authenticated token.

For example, this top token class is actually the token that you get if you log in
via the `form_login` authenticator. I'll prove it. Hit Shift+Shift and search
for `FormLoginAuthenticator`. Inside... it has a `createAuthenticatedToken()` method,
a method that *every* authenticator has. It returns a new `UsernamePasswordToken`.

Here's the point. If we login via this authenticator... and the matching token class
is listed under our `scheb_two_factor` config, the two-factor authentication
process will take over and redirect the user to the "enter the code" form.

Let's go see what our file looks like: `config/packages/scheb_2fa.yaml`.
By default, the only uncommented class is `UsernamePasswordToken`, which is *perfect*
for us.

But notice the last comment. If you're authenticating via a *custom* authenticator -
like we were doing earlier - then you should use this class.

Let see *exactly* why that’s the case. Open our custom `LoginFormAuthenticator`. We're
not using this anymore, but pretend we are. This extends
`AbstractLoginFormAuthenticator`. Hold Cmd or Ctrl to open that... then open
*its* base class `AbstractAuthenticator`. Scroll down a bit and... hello
`createAuthenticatedToken()`! This returns a new `PostAuthenticatedToken`. And so,
by default, *this* is the token class you get with a custom authenticator.

These token classes *aren't* super important... they basically all extend the
same `AbstractToken`... and mostly just help to identify *how* the user logged in.

By leveraging this knowledge, along with the scheb configuration, you can tell the
two-factor bundle *which* authenticators require two-factor authentication and which
don't.

Oh, and if you're using *two* custom authenticators... and only *one* of them needs
two-factor authentication, you'll need to create a *custom* token class and override
the `createAuthenticatedToken()` method in your authenticator to return that. *Then*
you can target *just* the custom class here.

Phew! It may not feel like we've done much yet... other than listen to me talk
about tokens... but the bundle *is* now... basically set up. But next, we need
to choose *how* our users will get the tokens. Will we email them? Or will they
use an authenticator app with a QR code? We're going to do the second.
