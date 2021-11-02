# Giving Users Passwords

Symfony doesn't really care if the users in your system have passwords or not. If
you're building a login system that reads API keys from a header, then there *are*
no passwords. The same is true if you have some sort of SSO system. Your users
might have passwords... but they enter them on some *other* site.

But for us, we *do* want each user to have a password. When we used the `make:user`
command earlier, it actually asked us if we wanted our users to have passwords. We
answered no... so that we could do all of this manually. But in a real project, I
*would* answer "yes" to save time.

## PasswordAuthenticatedUserInterface

We know that all User classes must implement `UserInterface`:

[[[ code('a901b7fc72') ]]]

Then, *if* you need to check user passwords in your application, you *also* need
to implement a second interface called `PasswordAuthenticatedUserInterface`:

[[[ code('e820720fba') ]]]

This requires you to have one new method: `getPassword()`.

If you're using Symfony 6, you won't have this yet, so add it:

[[[ code('8000636fbc') ]]]

I *do* have it because I'm using Symfony 5 and the `getPassword()` method is needed
for backwards compatibility: it *used* to be part of `UserInterface`.

Now that our users *will* have a password, and we're implementing
`PasswordAuthenticatedUserInterface`, I'm going to remove this comment above the
method:

[[[ code('98fb443723') ]]]

## Storing a Hashed Password for each User

Ok, let's forget about security for a minute. Instead, focus on the fact that
we need to be able to store a unique password for each user in the database.
This means that our user entity needs a new field! Find your terminal and run:

```terminal
symfony console make:entity
```

Let's update the `User` entity, to add a new field call `password`... which is
a string, 255 length is overkill but fine... and then say "no" to nullable. Hit
enter to finish.

Back over in the `User` class, it's... mostly not surprising. We have a new `$password`
property... and at the bottom, a new `setPassword()` method:

[[[ code('924e58807e') ]]]

Notice that it did *not* generate a `getPassword()` method... because we already
had one. But we *do* need to update this to return `$this->password`:

[[[ code('a7cf7f951e') ]]]

Very important thing about this `$password` property: it is *not* going to store
the *plaintext* password. Never ever store the plaintext password! That's the
fastest way to have a security breach... and lose friends.

Instead, we're going to store a *hashed* version of the password... and we'll see
how to generate that hashed password in a minute. But first, let's make the migration
for the new property:

```terminal
symfony console make:migration
```

Go peek at that file to make sure everything looks good:

[[[ code('772e4bbbf3') ]]]

And... it does! Close it... and run it:

```terminal
symfony console doctrine:migrations:migrate
```

## The password_hashers Config

Perfect! Now that our users have a new password column in the database, let's
*populate* that in our fixtures. Open up `src/Factory/UserFactory.php` and
find `getDefaults()`.

Again, what we are *not* going to do is set `password` to the plain-text password.
Nope, that `password` property needs to store the *hashed* version of the password.

Open up `config/packages/security.yaml`. This has a little bit of config
on top called `password_hashers`, which tells Symfony which hashing *algorithm*
it should use for hashing user passwords:

[[[ code('e96fca06bd') ]]]

This config says that any `User` classes that implement
`PasswordAuthenticatedUserInterface` - which our class, of course, does - will use
the `auto` algorithm where Symfony chooses the latest and greatest algorithm
automatically.

## The Password Hasher Service

Thanks to this config, we have access to a "hasher" service that's able to convert
a plaintext password into a *hashed* version using this `auto` algorithm. Back inside
`UserFactory`, we can use that to set the `password` property:

[[[ code('3a51c825fc') ]]]

In the constructor, add a new argument: `UserPasswordHasherInterface $passwordHasher`.
I'll hit `Alt`+`Enter` and go to "Initialize properties" to create that property
and set it:

[[[ code('bdebb42f7a') ]]]

Below, we can set `password` to `$this->passwordHasher->hashPassword()` and then
pass it some plain-text string.

Well... to be honest... while I hope this makes sense on a *high* level... this
won't *quite* work because the first argument to `hashPassword()` is the `User`
object... which we don't have yet inside `getDefaults()`.

That's ok because I like to create a `plainPassword` property on `User` to help
make all of this easier anyways. Let's add that next, finish the fixtures and update
our authenticator to validate the password. Oh, but don't worry: that new
`plainPassword` property *won't* be stored in the database.
