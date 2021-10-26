# User Password

Coming soon...

Symfony doesn't really care if the users in your system have passwords or not. If
you're building a log in system that reads API keys from header, then there are no
passwords. But for us, we do want each user to have a password. When we use the 
`make:user` command earlier, it actually asked us if we want to use it to have passwords, we
answered no so that we could do all of this manually, but in a real project, I would
answer yes. To save time. Anyways, we know that all User classes must implement 
`UserInterface`. Then if you need to check user passwords in your application, you also
need to implement a second interface called `PasswordAuthenticatedUserInterface`.
This requires you to have one at new method, `getPassword()`.

If you're using Symfony 6, you won't have this yet. So add it. I do have it because
I'm using Symfony 5 and they `getPassword()` method is needed for backwards
compatibility. It used to be part of `UserInterface`, but now that our users will have
a password and we're implementing the new password authentication interface, I'm
going to remove this comment above the method. All right. So let's forget about
security for a minute. Just think we need to be able to store a unique password for
each user in the database. Okay. To do that. Our user entity is going to need a new
field, find your terminal and run 

```terminal
symfony console make:entity
```

let's update the `User`
entity to add a new field call `password` have to be a string. 255 is fine, and then
it no to novel the database hit enter.

We look over and our `User` class, it's mostly not surprising. We have a new `$password`
field right here. And then at the bottom, we have a new `setPassword()` method. Notice
that did not generate a `getPassword()` method because we already had one. So all we
need to do is just update this to return `$this->password`. Now, important thing about
this password property. This is not going to store the plain tax password, never
store the plain text password. It's going to store a hashed version of the password
and we'll see how to generate a hash password in a second. But first let's generate a
migration for this. So 

```terminal
symfony console make:migration
```

and we'll go peek at that file
to make sure everything looks good. And it does. Yep. Just adding that one field. So
I'll close that and then run 

```terminal
symfony console doctrine:migration:migrate
```

to add that
new column. All right. So now that our Users have a new password column in the
database, Let's give all of our users in our fixtures. Let's populate that column for
all the users in our fixtures. I'm actually going to do this and you 
`src/Factory/UserFactory.php`  Now, again, we are not going to do is set.

It is set this to me, blank X Pfizer. And that is a big no-no is password properties
needs to be a hashed version of the password. If you look in your `config/packages/security.yaml`
file. There's a little bit of config on top called `password_hashers`
And basically this tells Symfony which algorithm you want to use for hashing your
user passwords. Right now it's set to auto, which is what you should use in any new
application. This basically means that any user classes that implement 
`PasswordAuthenticatedUserInterface`, which is all of them, which ours does, whether you use
the auto algorithm, this basically means that Symfony will choose whatever the latest
and greatest hashing algorithm is and use that to hash the user passwords We're going
to have for us. It basically means that it simply provides us a service where we can
give it the plain text password, and it will take care of all the hashing for us.
Now, inside of our `UserFactory`, what we could do is just set the password property
directly to the hashed version of our Password, our password. I wouldn't bet a
strict, you know, an actual, I wouldn't actually say hash password here, but we could
use these service.

Yeah. Instead of `UserFactory`, in order to hash, the we're going to need a service

Fortunately these factories are, we can use a dependency injection on them. So in the
constructor, add a new argument called type ended with `UserPasswordHasherInterface`
and call it the `$passwordHasher` I'll then hit Alt + Enter and go to
"Initialize properties" to create that property and set it, our move is to do here. So
now here, what we could do in this password is we could say 
`$this->passwordHasher->hashPassword()`, and then pass in the plain password right here and of directly
onto the password property. That would totally work, but it's often convenient.

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

