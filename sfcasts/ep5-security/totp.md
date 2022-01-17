# 2fa with TOTP (Time-Based One Time Password)

It may not *feel* like it yet, but the bundle *is* now set up... except for one
big missing piece: how do we want our users to *get* the temporary token they'll
enter into the form?

In the docs, there are 3 choices... well kind of only 2. These first two
are where you use an authenticator app - like Google authenticator or Authy. The
other option is to send the code via email.

We're going to use this "totp" authentication, which is basically the same as Google
authenticator and stands for "time-based one-time password".

The logic for this actually lives in a separate library. Copy the
Composer require line, find your terminal, and paste:

```terminal
composer require scheb/2fa-totp
```

This time there's no recipe or anything fancy: it just installs the library. Next,
if you head back to the documentation, we need to enable this as an authentication
method inside the config file. That's back in `config/packages/scheb_2fa.yaml`.
Paste that at the bottom:

[[[ code('07da8ee239') ]]]

## Implementing TwoFactorInterface

The last step, if you look over at the docs, is to make our `User`
implements a `TwoFactorInterface`. Open up our user class: `src/Entity/User.php`,
add `TwoFactorInterface`:

[[[ code('8dd345887d') ]]]

Then head down to the bottom. Now go to the "Code"->"Generate" menu - or
`Command`+`N` on a Mac - and choose implement methods to generate the 3 we need:

[[[ code('780611284e') ]]]

Beautiful. Here's how TOTP authentication works. Each user that decides to activate
two-factor authentication for their account will have a TOTP secret - a random
string - stored on a property. This will be used to validate the code *and* will
be used to help the user set up their authenticator app when they first activate
two-factor authentication.

The methods from the interface are fairly straightforward.
`isTotpAuthenticationEnabled()` returns whether or not the user has activated
two-factor auth... and we can just check to see if the property is set. The
`getTotpAuthenticationUsername()` method is used to help generate some info on
the QR code. The last method - `getTotpAuthenticationConfiguration()` - is
the most interesting: it determines how the codes are generated, including the number
of digits and how long each will last. Usually, authenticator apps generate a new
code every 30 seconds.

Copy the `$totpSecret` property, scroll up to the properties in *our* class and
paste:

[[[ code('3b2a6c09f2') ]]]

Then head back to the bottom and use the "Code"->"Generate" menu to generate
a getter and setter for this. But we can make this nicer: give the argument a
nullable string type, a `self` return type, and return `$this`... because the rest
of our setters are "fluent" like this:

[[[ code('460433c71f') ]]]

For the getter... let's delete this entirely. We just won't need it... and
it's kind of a sensitive value.

Let's fill in the three methods. I'll steal the code for the first... and paste:

[[[ code('78c19377b5') ]]]

For the username, in our case, return `$this->getUserIdentifier()`, which is really
just our email:

[[[ code('0bd9391389') ]]]

For the last method, copy the config from the docs... and paste:

[[[ code('cad44e1d9e') ]]]

I'll re-type the end of `TotpConfiguration` and hit tab so that PhpStorm adds
the `use` statement on top:

[[[ code('bab3f6be02') ]]]

But, be careful. Change the 20 to 30, and the 8 to 6:

[[[ code('904e73d993') ]]]

This says that each code should last for 30 seconds and contain 6 digits. The
reason I'm using these *exact* values - including the algorithm - is to support
the Google Authenticator app. Other apps, apparently, allow you to tweak these,
but Google Authenticator doesn’t. So if you want to support Google Authenticator,
stick with this config.

Okay, our user system is ready! In theory, if we set a `totpSecret` value for
one of our users in the database, and then tried to log in as that user, we would
be redirected to the "enter your code" form. But, we're missing a step.


Next: let's add a way for a user to *activate* two-factor authentication
on their account. When they do that, we'll generate a `totpSecret` and - most
importantly - use it to show a QR code the user can scan to set up their
authenticator app.
