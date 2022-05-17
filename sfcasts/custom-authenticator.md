# Custom Authenticator authenticate() Method

We're currently converting our old Guard authenticator to the new authenticator
system. And, nicely, these two systems *do* share some methods, like `supports()`,
`onAuthenticationSuccess()` and `onAuthenticationFailure()`.

The *big* difference is down inside the new `authenticate()` method. In the old Guard
system, we split up authentication into a few methods. We had `getCredentials()`,
where we grab some information, `getUser()`, where we found the `User` object, and
`checkCredentials()`, where we checked the password. All three of these things are
now combined into the `authenticate()` method... with a few nice bonuses. For example,
as you'll see in a second, it's no longer *our* responsibility to check the password.
That now happens *automatically*.

## The Passport Object

Our job in `authenticate()` is simple: to return a `Passport`. Go ahead and add a
`Passport` return type. That's actually needed in Symfony 6. It wasn't added
*automatically* due to a deprecation layer and the fact that the return type changed
from `PassportInterface` to `Passport` in Symfony 5.4.

[[[ code('224d189c16') ]]]

*Anyways*, this method returns a `Passport`... so do it: `return new Passport()`.
By the way, if you're new to the custom authenticator system and want to learn
more, check out our [Symfony 5 Security tutorial](https://symfonycasts.com/screencast/symfony5-security)
where we talk *all* about this. I'll go through the basics now, but the details
live there.

Before we fill in the `Passport`, grab all the info from the `Request` that we
need... paste... then set each of these as variables:
`$email =`, `$password =`... and let's worry about the CSRF token later.

[[[ code('bf93e07d3e') ]]]

The first argument to the `Passport` is a `new UserBadge()`. What you pass here
is the *user identifier*. In our system, we're logging in via the email, so pass
`$email`!

And... if you want, you can stop right here. If you only pass one argument to
`UserBadge`, Symfony will use the "user provider" from `security.yaml` to
find that user. We're using an `entity` provider, which tells Symfony to try to
query for the `User` object in the database via the `email` property.

## Optional Custom User Query

In the old system, we did this all manually by querying the `UserRepository`.
That is *not* needed anymore. But sometimes... if you have custom logic, you
might *still* need to find the user manually.

*If* you have this use-case, pass a `function()` to the second argument that accepts
a `$userIdentifier` argument. Now, when the authentication system needs the User
object, it will call our function and pass us the "user identifier"... which will
be whatever *we* passed to the first argument. So, the email.

Our job is to *use* that to return the user. Start with
`$user = $this->entityManager->getRepository(User::class)`

And yea, I could have injected the `UserRepository` instead of the entity manager...
that would be better... but this is fine. Then
`->findOneBy(['email' => $userIdentifier])`.

If we did *not* find a user, we need to `throw` a `new UserNotFoundException()`.
*Then*, `return $user`.

[[[ code('77bc8de249') ]]]

First `Passport` argument is done!

## PasswordCredentials

For the second argument, down here, change my bad semicolon to a comma - then say
`new PasswordCredentials()` and pass this the submitted `$password`.

[[[ code('7568ad9eac') ]]]

That's all we need! That's right: we do *not* need to actually *check* the password!
We pass a `PasswordCredentials()`... and then another system is responsible for
checking the submitted password against the hashed password in the database! How
cool is that?

## Extra Badges

Finally, the `Passport` accepts an optional array of "badges", which are extra
"stuff" that you want to add... usually to activate other features.

We only need to pass *one*: a `new CsrfTokenBadge()`. This is because our login
form is protected by a CSRF token. Previously, we checked that manually. Lame!

But no more! Pass the string `authenticate` to the first argument... which just
needs to match the string used when we generate the token in the template:
`login.html.twig`. If I search for `csrf_token`... there it is!

For the second argument, pass the submitted CSRF token:
`$request->request->get('_csrf_token')`, which you can also see in the login form.

[[[ code('a7e461d829') ]]]

And... done! *Just* by passing the badge, the CSRF token will be validated.

Oh, and while we don't *need* to do this, I'm also going to pass a
`new RememberMeBadge()`. If you use the "Remember Me" system, then you need to
pass this badge. It tells the system that you opt "into" having a remember me
cookie set if the user logs in using this authenticator. But you *still* need to
have a "Remember Me" checkbox here... for it to work. Or, to *always* enable it,
add `->enable()` on the badge.

[[[ code('8acb02ab56') ]]]

And, of course, none of this will work unless you activate the `remember_me`
system under your firewall, which I don't actually have yet. It's still safe
to add that badge... but there won't be any system to process it and add the
cookie. So, the badge will be ignored.

## Deleting Old Methods!

Anyways, we're done! If that felt overwhelming, back up and watch our Symfony
Security tutorial to get more context.

The cool thing is that we don't need `getCredentials()`, `getUser()`,
`checkCredentials()`, *or* `getPassword()` anymore. All we need is
`authenticate()`, `onAuthenticationSuccess()`, `onAuthenticationFailure()`, and
`getLoginUrl()`. We can even celebrate up here by removing a *bunch* of old use
statements. Yay!

Oh, and look at the constructor. We no longer need `CsrfTokenManagerInterface`
or `UserPasswordHasherInterface`: both of those checks are now done somewhere *else*.
And... that gives us two *more* `use` statements to delete.

[[[ code('4d91137ae4') ]]]

## Activating the New Security System

At this point, our one custom authenticator *has* been moved to the new authenticator
system. This mean that, in `security.yaml`, we are ready to switch to the new system!
Say `enable_authenticator_manager: true`.

[[[ code('d73484c8b8') ]]]

And these custom authenticators aren't under a `guard` key anymore. Instead,
add `custom_authenticator` and add this directly below that.

[[[ code('7ade8ffdcc') ]]]

Okay, moment of truth! We just *completely* switched to the new system. Will
it work? Head back to the homepage, reload and... it does! And check out those
deprecations! It went from around 45 to 4. Woh!

Some of those relate to *one* more security change. Next: let's update
to the new `password_hasher` & check out a new command for debugging security
firewalls.
