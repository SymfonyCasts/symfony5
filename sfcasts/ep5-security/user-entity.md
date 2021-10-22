# Customizing the User Class

What's cool about the `User` class is that... it's our class! As long as we implement
`UserInterface`, we can add *whatever* else we want:

[[[ code('3a25cd7778') ]]]

For example, I'd like to store the first name of my users. So let's go add a property
for that. At your terminal, run:

```terminal
symfony console make:entity
```

We'll edit the `User` entity, add a `firstName` property, have it be a string, 255
length... and say "yes" to nullable. Let's make this property optional in the database.

Done! Back over in the `User` class, no surprises! We have a new property...
and new getter and setter methods:

[[[ code('e5a12c2c11') ]]]

Go generate a migration for our new `User`. At the terminal, run

```terminal
symfony console make:migration
```

Cool! Spin over and open that up to make sure it's not hiding any
surprises:

[[[ code('45c667b8e8') ]]]

Awesome: `CREATE TABLE user` with `id`, `email`, `roles` and `first_name` columns.
Close this... and run it:

```terminal
symfony console doctrine:migrations:migrate
```

Success!

## Adding User Fixtures

And because the `User` entity is... just a normal Doctrine entity, we can *also*
add dummy users to our database using the fixtures system.

Open up `src/DataFixtures/AppFixtures.php`. We're using Foundry to help us load
data. So let's create a new Foundry factory for `User`. Since we're having SO much
fun running commands in this video, let's sneak in one... or three more:

```terminal
symfony console make:factory
```

Yup! We want one for `User`. Go open it up: `src/Factory/UserFactory.php`:

[[[ code('4a4c542689') ]]]

Our job in `getDefaults()` is to make sure that all of the required properties have good
default values. Set `email` to `self::faker()->email()`, I won't set any roles right
now and set `firstName` to `self::faker()->firstName()`:

[[[ code('014926ecd4') ]]]

Cool! Over in `AppFixtures`, at the bottom, create a user: `UserFactory::createOne()`.
But use a specific email so we can log in using this later. How about,
`abraca_admin@example.com`:

[[[ code('60eeaa3729') ]]]

Then, to fill out the system a bit, add `UserFactory::createMany(10)`:

[[[ code('2671011665') ]]]

Let's try it! Back at the terminal, run:

```terminal
symfony console doctrine:fixtures:load
```

No errors! Check out the new table:

```terminal
symfony console doctrine:query:sql 'SELECT * FROM user'
```

And... there they are! Now that we have users in the database, we need to add one
or more ways for them to authenticate. It's time to build a login form!
