# make:user

No matter how your users authenticate - a log in form, social authentication, or
an API key - your security system needs some concept of a user: some class that
describes the "thing" that is logged in.

Yup, step 1 of authentication is to create a `User` class. And there's a command
that can help us! Find your terminal and run:

```terminal
symfony console make:user
```

As a reminder, `symfony console` is just a shortcut for `bin/console`... but because
I'm using the Docker integration with the Symfony web server, calling `symfony console`
allows the `symfony` binary to inject some environment variables that point to the
Docker database. It won't matter for this command, but it *will* matter for any
command that talks to the database.

Ok, question one: "The name of the user class". Typically this will be `User`...
though it *would* be cooler to call it `HumanoidEntity`. If the "thing" that
logs into your site would be better called a `Company` or `University` or `Machine`,
use that name here.

"Do you want to store user data in the database via Doctrine"? For us: that's a
definite yes... but that's not a requirement. Your user data might be stored
on some other server... though even in those cases, it's often convenient to store
some *extra* data in your local database.

Ok:

> Enter a property name that will be the unique display name for the user.

I'm going to use `email`. This is not *that* important and I'll explain how this
is used in a moment. Finally: "will this app need to hash and check user passwords?"
You only need to say yes if it will be *your* application's responsibility to
check the user's password when they log in. We *are* going to do this, but I'm
going to say "no" for now. We'll add this manually a bit later.

Hit enter and... done!

## The User Class & Entity

Okay. What did this do? First, it created a `User` entity and a `UserRepository`...
the exact same things you normally get from running `make:entity`. Let's go check
out that new `User` class: `src/Entity/User.php`. First and foremost, this is
a normal boring Doctrine entity: it has annotations - or maybe PHP 8 attributes
for you - and an id. It is... just an entity: there is nothing special about it.

## UserInterface & Deprecated Methods

The *only* thing that Symfony cares about is that your user class implements
`UserInterface`. Hold Command or Ctrl and click to jump *way* into the core code
to see this.

This interface *really* has just three methods: `getUserIdentifier()`, which you
see up here documented above the interface, `getRoles()`... and another one away
down here called `eraseCredentials()`. If you're confused about why I'm skipping
all of these *other* methods, it's because they're *deprecated*. And Symfony 6,
this interfce will *only* have those 3: `getUserIdentifier()`, `getRoles()` and
`earseCredentials()`.

In *our* `User`, class, if you scroll down, the `make:user` command implemented
*all* of the for us. Thanks to how we answered one of its questions, `getUserIdentier()`
returns the email. This... isn't very important: it's mostly just a visual representation
of your User object... it's used in the web debug toolbar... and in a few optional
systems, like the remember me system.

If you're using Symfony 5 like I am, you'l notice that the deprecated methods *are*
still generated. Those are needed *just* for backwards compatibility and you can
delete them once you're on Symfony 6.

The `getRoles()` method deals with permissions - more on that later. And then
`getPassword()` and `getSalt()` are both deprecated. You *will* still need a
`getPassword()` method if you check passwords on your site - but we'll learn about
that later. Finally, `eraseCredentials()` *is* part of `UserInterface`, but it's
not very important and we'll learn about it later.

So at a high level... if you ignore the deprecated methods... and the not-important
`eraseCredentials`, the only thing that our `User` class needs to have is basically
a visual identifier and a method that returns the array of roles that this user should
have. Yup... it's mostly just a `User` entity.

## "providers": The User Provider

They `make:user` command also made one tweak to our `security.yaml` file: you can
see right here. It added what's called a "user provider", which is an object that
knows how to load your user objects... whether you're loading that data from an API
or from a database. Because we're using doctrine, this uses a built-in `entity`
provider: it knows how to fetch our users from the database using their `email`
property. But this user provider stuff isn't important yet. I'll show you *exactly*
how and where it's used as we go along.

Next: we have *total* control over how our `User` class looks. Let's add a custom
field then load up our database with a nice set of fake users.
