# Hashing Plain Password & PasswordCredentials

The process of saving a user's password always looks like this: start with a
plain-text password, hash that, *then* save the hashed version onto the `User`.
This is something we're going to do in the fixtures... but we'll also do this
on a registration form we'll build later... and you would also need it on a
change password form.

## Adding a plainPassword Field

To make this easier, I'm going to do something optional. In `User`, up on top, add
a new `private $plainPassword` property. The *key* thing is that this property will
*not* be persisted to the database: it's just a temporary property that we can use
during, for example, registration, to store the plain password.

Below, I'll go to code generate - or Command + N on a Mac - to generate the getter
and setter for this. The getter will return a nullable `string`.

Now, if you *do* have a `plainPassword` property like this, you'll want to find
`eraseCredentials()` and set  `$this->plainPassword` to null. This... is not really
*that* important. After authentication is successful, Symfony calls `eraseCredentials()`.
It's... just a way for you to "clear out any sensitive information" on your `User`
class once you're done with authentication. Technically we will never *set*
`plainPassword` during authentication... so it doesn't matter. But, again, it's
a safe thing to do.

# Hashing the Password in the Fixtures

Back inside `UserFactory` instead of setting the `password` property, we're going
to set `plainPassword` to "tada".

If we just stopped now, it would set this property... but then the `password` property
would stay null... and it would explode in the database because that column is
required.

So after Foundry has finished instantiating the object, we're going to run some extra
code that reads the `plainPassword` and hashes it. We can do that down here in the
`initialize()` method... via an `afterInstantiation()` hook.

This is pretty cool: call `$this->afterInstantiation()`, pass it a callback and,
inside say if `$user->getPlainPassword()` - just in case it gets overridden to
`null` - then `$user->setPassword()`. Generate the hash with
`$this->passwordHasher->hashPassword()`. This takes two arguments: the user that
we're trying to hash - so `$user` - and then whatever the plain password is, so
`$user->getPlainPassword()`.

Done! Let's try this. Find your terminal and run:

```terminal
symfony console doctrine:fixtures:load
```

This will take a bit longer than before because hashing passwords is actually CPU
intensive. But... it works! Check the `user` table:

```terminal
symfony console doctrine:query:sql 'SELECT * FROM user'
```

And... got it!. Every user has a hashed version of the password!

## Validating the Password: PasswordCredentials

*Finally* we're ready to *check* the user's password inside our authenticator.
To do this, we need to hash the submitted plain password then safely *compare*
the two hashes.

Well *we*  don't need to do this... because Symfony is going to do it automatically.
Check it out: replace `CustomCredentials` with a new `PasswordCredentials` and pass
it the plain-text submitted password.

That's it! Try it. Log in using our real user - `abraca_admin@example.com` - I'll
copy that, then some *wrong* password. Nice! Invalid password! Now enter the
*real* password `tada`. It works!

That's awesome! When you put a `PasswordCredentials` inside your `Passport`,
Symfony automatically uses that to compare the submitted password to the hashed
password for the user in the database. I *love* that.

This is all possible. Thanks to a powerful event listener system inside of security.
Let's learn more about that next and see how we can leverage it to add CSRF
protection to our login form... with about two lines of code.
