# Hashing Plain Password & PasswordCredentials

Coming soon...

and then pass in the plain password right
here and of directly onto the password property. That would totally work, but it's
often convenient.

To be able to temporarily store the plain password on the user object on a
non-persistent property and then hash it before saving. So this is not an optional
step here, but check it out. What I'm going to do is on top, I'm going to add a new
`private $plainPassword` property. The key thing here is this is not persistent.
It's just a temporary property we can use during registration, for example, as a
place to store the user's password.

Now down below, we're going to add, I'll just add a getter and setter for this. So
I'll go to code generate or Command + N on the Mac, go to getter and setter in
generated for `$plainPassword`. And I'll even add a little, a normal string return type
to get my password. So just say normal field. Now, one thing, if you do have a plain
password, a property like this, you want to find `eraseCredentials()` and set
`$this->plainPassword` to null this is not really that important, but bef after, uh, but a
race Prudential's is called before the user is stored to the session. So it's just a
way for us to know a find out any sensitive information so that it doesn't actual
accidentally get stored somewhere.

Okay. So now inside of our `UserFactory`, this is pretty cool. Instead of, uh, setting
the `password` field, we're going to set the `plainPassword` field to "tada". Now, if we
just stopped now, it would set this property, but then the `password` property would
stay. No, and it would explodes saving users in the database. So what we're going to
do here is basically after our object is fully done, after Foundry's done in
stanchion or object, we're going to run some extra code that reads this plain
password and hashes it. We can do that down here and then initialize method. And I
adding an `afterInstantiation()` hook. This is pretty cool. So I'm just called
`$this->afterInstantiation()`, pass it a callback. And instead of here, we can say if
`$user->getPlainPassword()`, but it should have a `plainPassword`, but technically we
can override that when we use the, uh, uh, factory, then `$user->setPassword()`
And for this, we're going to pass in the hashed password, which we can get
by saying `$this->passwordHasher->hashPassword()`. And this takes two arguments, the
user that we're trying to hash so `$user,` and then whatever the claimed password is,
which is going to be nicely stored on the `getPlainPassword()` method. All right, here
we go.

All right. So let's try this spin over. And we let our fixtures since many

```terminal
symfony console doctrine:fixtures:load
```

and this will take a little bit longer than before because
hashing passwords is actually CPU intensive and it works. Let's check the user table.
So any

```terminal
symfony console doctrine:query:sql 'SELECT * FROM user'
```

and awesome. Every user has a
hashed version of the password. Now on our last job is here. Is that on logging? We
need to safely, we need to actually check this. So we need to safely hash the plain
password. We need to hash the submitted plain password and safely check to see if it
matches the user's hashed password in the database.

Well, actually we don't need to do this. Symfony is going to do it automatically.
Check it out, place the `CustomCredentials` with a new `PasswordCredentials` and pass
it. The plain text password. That's it. Try this head over. Log in. Let's use our
real user add Rocca admin, add example.com. Copy that. And let's use a invalid
password. First invalid password entered, and now try to get off. It works when you
return it. Password credentials Symfony automatically reads that hash as the plain
text submitted password and securely compares it to the hash password for this user
in the database. It does all of that work for us. This is all possible. Thanks to be
security systems, powerful listener system. Let's learn more about that next and see
how we can leverage it to add CSF our protection to our log and form with about two
lines of code.
