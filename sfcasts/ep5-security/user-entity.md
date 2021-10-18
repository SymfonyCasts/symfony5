# Customizing the User Class

What's cool about the `User` class is that... it's our class! As long as we implement
`UserInterface`, we can add *whatever* else we want. For example, I'd like to store
the first name of my users. So let's go add another property. At your terminal run:

```terminal
symfony console make:entity
```

We'll edit the `User` entity, add a `firstName` property, have it be a string, 255
length... say "yes" to nullable. Let's make this property optional in the database.

And... done! Back over in the `User` class, no surprises! We have a new property...
and new getter and setter methods.

Let's go generate a migration for our new `User`. At your terminal, run

```terminal
symfony console make:migration
```

And... beautiful! Spin over and open that up to make sure it's not hiding any
surprises. Awesome: `CREATE TABLE user` with `id`, `email`, `roles` and `firstName`
columns. Close this... and run it:

```terminal
symfony console doctrine:migrations:migrate
```

And... success!

## Adding User Fixtures

And because the `User` entity is... just a normal Doctrine entity, we can *alos*
dummy users to our database using our fixtures system.

Open up `src/DataFixtures/AppFixture.php`. We're using a Foundry to help us load
data. So let's create a new Foundry factory for user. Since we're having SO much
fun running commands in this video, let's sneak in one more:

```terminal
symfony console make:factory
```

Yup! We want one for `User`. Go open it up: `src/Factory/UserFactory.php`. Our
job in `getDefaults()` is to make sure that all of our required properties have good
default values. Set `email` to `self::faker()->email()`, I won't set any roles right
now, set `firstName` to `self::faler)->firstName()`.

Cool! Over in `AppFixtures`, at the bottom, create a user: `UserFactory::createOne()`.
But use a specific email address so we can use this to log in later. How about,
`abraca_admin@example.com`.

Then, just to fill out the system, add `UserFactory::createMany(10)`.

Let's try it! At your terminal, run:

```terminal
symfony console doctrine:fixtures:load
```

And... no errors! Check it the new table

```terminal
symfony console doctrine:query:sql 'SELECT * FROM user'
```

And... there they are! Now that we have users in the database, we need to add one
or more ways for them to authenticate. It's time to build a login form!
