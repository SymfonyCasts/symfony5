# Security Upgrades

It's time to fix these deprecations so that we can *finally* upgrade to Symfony 6.
Go to any page on the site and click the deprecations down on the web debug toolbar
to see the list. This is a *big* list... but a lot of these relate to the same
thing: security.

The biggest - and perhaps most wonderful - change in Symfony 5.4 and Symfony 6,
is the new security system. But don't worry. It's not *that* much different from
the old one... and the upgrade path is surprisingly easy.

## UserInterface, getPassword & PasswordAuthenticatedUserInterface

For the first change, open up the `User` entity. In addition to `UserInterface`,
add a second `PasswordAuthenticatedUserInterface`. Until recently, `UserInterface`
had a *lot* of methods on it, including `getPassword()`. But... this didn't always
make sense. For example, some security systems have users that *don't* have passwords.
For example, if your users log in via a single sign-on system, then there *are*
no passwords to handle. Well, the user might enter their password into *that* system...
but as far as our app is concerned, there are no passwords.

To make this cleaner, in Symfony 6, `getPassword()` was *removed* from
`UserInterface`. So you *still* always need to implement `UserInterface`... but
then the `getPassword()` method and its `PasswordAuthenticatedUserInterface`
are optional.

## UserInterface: getUsername() -> getUserIdentifier()

Another change relates to `getUsername()`. This method lives on `UserInterface`...
but its name was *always* confusing. It made it *seem* like you needed to have a
*username*... when really, this method is *supposed* to return any unique
user identifier - not *necessarily* a username. Because of that, in Symfony 6, this
has been renamed from `getUsername()` to `getUserIdentifier()`. Copy this, paste,
change `getUsername` to `getUserIdentifier()`... and that's it.

We *do* need to keep `getUsername()` for now because we're still on Symfony 5.4...
but once we upgrade to Symfony 6, we can safely remove it.

## New Security System: enable_authenticator_manager

But the *biggest* change in Symfony's security system can be found in
`config/packages/security.yaml`. It's this `enable_authenticator_manager`. When we
upgraded the recipe, it gave us this config... but it was set to `true`. This
teenie, tiny, innocent-looking line allows us to switch from the old security system
to the new one. And what *that* means, in practice, is that all of the ways you
authenticate - like a custom authenticator or `form_login` or `http_basic` - will
suddenly start using an entirely new system under the hood.

For the most part, if you're using one of the *built-in* authentication systems,
like `form_login` or `http_basic`... you probably won't notice any changes. You
can activate the new system by setting this to true... and everything will work
exactly like before.... even though the code behind `form_login` will suddenly
be very different. In a lot of ways, the new security system is an internal
refactoring to make the core code more readable and to give us more flexibility,
when we need it.

## Guard -> Custom Authenticator Conversion

*However*, if you have any custom `guard` authenticators... like we do, you'll
need to convert these to the new authenticator system... which is super fun
anyways... so let's do it!

Open up our custom authenticator: `src/Security/LoginFormAuthenticator.php`. We
can already see that `AbstractFormLoginAuthenticator` from the old system is
deprecated. Change this to `AbstractLoginFormAuthenticator`.

I know, it's almost the exact same name: we just swapped "Form" and "Login" around.
If your custom authenticator is *not* for a login form, then change your class to
`AbstractAuthenticator`.

Oh, and we don't need to implement `PasswordAuthenticatedInterface` anymore:
that was something for the *old* system.

## Adding the New Authenticator Methods

The old Guard system and new authenticator system *do* the same thing: they
figure out who's trying to log in, check the password, and decide what to do
on success and failure. But the new authenticator style will feel quite a bit
different. For example, you can *immediately* see that PhpStorm is furious because
we now need to implement a new method called `authenticate()`.

Ok! I'll go down below `supports()`, go to "Code Generate" - or "cmd" + "N"
on a Mac - and implement that new `authenticate()` method. This is the *core* of
the new authenticator system... and we're going to talk about it in a few minutes.

Oh, but the old and new systems do *share* several methods. Like, they
both have a method called `supports()`... but the new system has a `bool` return
type. As soon as we add that, PhpStorm is happy.

Below, on `onAuthenticationSuccess()`, it looks like we need to add a return
type here as well. At the end, add the `Response` type from HttpFoundation.
Nice! And while we're working on this method, rename the `$providerKey` argument to
`$firewallName`.

You don't *have* to do this, that's just the new name of the argument... and it's
more clear.

Next, down on `onAuthenticationFailure()`, add the `Response` return type there
as well. Oh, and for `onAuthenticationSuccess()`, I just remembered that this can
return a *nullable* `Response`. In some systems - like API token authentication -
you will *not* return a response.

Finally, we *still* need a `getLoginUrl()` method, but in the new system, this
accepts a `Request $request` argument and returns a `string`.

Alright! we still need to fill in the "guts", but we *at least* have all the
methods we need.

## Removing supports() for "form login" authenticators

And actually, we can remove one of these! Delete the `supports()` method.

Ok, this method *is* still needed by custom authenticators and its job is the
same as before. But, if you jump into the base class, in the new system, the
`supports()` method is implemented *for* you. It checks to make sure that the
current request is a `POST` and that the *current* URL is the same as the *login*
URL. Basically, it says

> I support authenticating this request if this is a POST request to the login form.

We wrote our logic a bit differently before, but that's *exactly* what we were
checking.

Ok, it's time to get to the *meat* of our custom authenticator: the `authenticate()`
method. Let's do that next.
