# Custom Authenticator authenticate() Method

Coming soon...

Finally, let's go down to this `authenticate()` method. In the old guard system, we
split up authentication into a few methods. We had `getCredentials()`, where we grab
some information, `getUser()`, where we found the user object, and
`checkCredentials()`, where we checked the password. All three of these things are
now combined into the `authenticate()` method, and with a couple of nice bonuses. For
example, as you'll see in a second, it's no longer going to be our responsibility to
check the password. That will now happen *automatically*.

Our job in `authenticate()` is to return a `Passport`. So go ahead and add a
`Passport` return type. The reason that wasn't added *for* us is because that was
actually a change that occurred in an update from Symfony 5.3 to 5.4, where
`PassportInterface` became `Passport`. Long story short, you should have a return
type `Passport` here, and then we'll `return new Passport()`. If you're new to this
system, you should check out our Symfony 5 Security tutorial, which talks all about
this new system. I'll go through some of the basics here, but the Security tutorial
is there for you if you want to dive a little deeper.

Before I fill in this `Passport`, I'm going to grab all of the information from the
`Request` for the `email`, `password`, and `_csrf_token`, and I'm going to set them
as variables. Say `email =`, `password =`, and I'll save the `-csrf_token` for later.
So the first argument to the `Passport()` is going to be a `new UserBadge()`. What
you pass here is the *user identifier*. In our system, we're logging in via the
email, so we'll use `$email`. If you want to, you can stop right there. If you just
pass a single argument to `UserBadge()`, Symfony will use your `app_user_provider`
from `security.yaml` to find that user. I have an `entity` provider here, which tells
Symfony to try to locate the user object in the database via the `email` property.

In the old system, however, we did this all manually by querying the user repository
for the email. And sometimes, if you have some custom logic, you will *still* need to
do it manually. I'm going to show you the longer, manual version up here. We'll pass
`function()` as a second argument, and we'll pass *that* the `$userIdentifier`.

Inside of this, your job is to take this `$userIdentifier` - the email - and return
the `$user`. So I'll say:

```
$user = $this->entityManager
->getRepository(User::class)
```

I also could have injected the user repository directly. That's probably a better
idea.

Below that, I'll say:

```
->findOneBy(['email' => $userIdentifier])
```

And then, down here, we need to add `if (!$user)`. Inside, we need to `throw new
UserNotFoundException()` because this callback always needs to `return $user` or
throw that exception. Perfect!

For the second argument down here - I'll change this semicolon to a comma - add `new
PasswordCredentials()`, and we pass this the submitted `$password`. That's all we
need to do here. This is a really cool thing where we don't actually need to check
the password ourselves. We just need to pass `PasswordCredentials()`, and there's
going to be another system that's going to check the hashed password in the database
automatically.

Finally, we can pass an array of extra badges. We only need *one* badge, and it's the
`new CsrfTokenBadge()`. This is because our login form uses a `CsrfToken`. We checked
it manually before, but we don't need to do that anymore. We can just pass the string
`authenticate` as the first argument that matches the string that we're using in our
login template. If we go to `/templates/security/login.html.twig` and search for
`csrf_token`, we'll just use the same string we use here.

Now, we're going to pass it the submitted CSRF token which, for us, is
`$request->request->get('_csrf_token')`. You can see that in the login form. Just by
passing that that badge here, the CSRF token is going to be validated.

The last thing I'll do here isn't *required*, but I'm going to pass a `new
RememberMeBadge`. If you use the "Remember Me" system, then you and need to pass this
`RememberMeBadge`, which signals that you're opting into it. You'll *still* need have
a "Remember Me" checkbox here, *or* if you *always* want it to be enabled, you can
add `->enable()`. If you *do* have "Remember Me" stuff here, in order to activate it,
you also need to have "Remember Me" under your firewall. I don't have this right now,
so if I wanted "Remember Me" to work, I would need to add it here.

All right, we are *done*! If that was overwhelming, back up and watch our Symfony
Security tutorial so we can explain all of these things in a little more detail. The
cool thing is that we don't need `getCredentials()`, `getUser()`,
`checkCredentials()`, *or* `getPassword()` anymore. It's just as simple as
`authenticate()`, `onAuthenticationSuccess()`, `onAuthenticationFailure()`, and
`getLoginUrl()`. We can even celebrate up here by removing a whole bunch of old use
statements. Yay! And if we look at our constructor here, a few of these arguments are
no longer needed, including the `CsrfTokenManagerInterface` or the
`UserPasswordHasherInterface`. That's because we're not checking the CSRF Token or
the password manually anymore. And that gives us two *more* use statements that we
can delete.

At this point, our one custom authenticator has been moved to the new authenticator
system, which means in `security.yaml`, we are ready to switch to the new system. Say
`enable_authenticator_manager.: true`. These custom authenticators aren't under a
`guard` key anymore. Instead, they're under a `custom_authenticator` key, so we'll
put them directly below that.

Okay, moment of truth! We just completely switched security systems to the new
system, so let's head back to the homepage, reload and... it works! And check out
those deprecations! It went down from around 45 to 4. That's *awesome*! And if you
look at what's left, one of them says:

`The child node "encoders" at path "security" is
deprecated, use "password_hashers" instead.`

This is another change we saw when we upgraded the `security-bundle` recipe.
Originally we had `encoders` here. This tells Symfony what password algorithm to use
to hash your users. This has been renamed to `password_hashers`. And instead of
having our custom class here, you can always just use this config, which basically
says *any class that implements `PasswordAuthenticatedUserInterface`, which our user
class will always implement, use the `auto` algorithm*. Use this new config, and if
you *did* have a different algorithm here, move that down to this line, but
ultimately delete the `encoders`. We don't need that anymore. It's reading from
`password_hashers`.

Now, on the homepage... we have even less deprecations! Two left! Let's try to log
in. Oh! Check out the login form. I think I missed some conflicts on my base layout
earlier. I'll swing over and fix these really quick. In
`/templates/base.html.twig`... ah, yep. I missed a couple of lines. When we upgraded
the `twig-bundle` recipe, I hadn't even noticed. There we go! That's better.

Okay, we have a user called `abraca_admin@example.com` with password `tada`. Sign in
and... it works! By the way, speaking of "securities" and "firewalls", there's a new
command you can use to debug your firewall. It's called, appropriately,
`debug:firewall`. If you run it with no arguments, it will tell you your firewall
names (mine are `dev` and `main`) and we can rerun it with `main`. This just gives us
some information about it. It tells us what authenticators we have for it, the user
provider it's using, and also the entry point, which is something we talk about in
our Security tutorial.

Next, we're going to *crush* the last few deprecations and learn how we can be sure
we didn't miss any.
