# doctrine:database:create & server_version

We have a Docker database container running *and* our app is *instantly* configured
to talk to it thanks to the Symfony web server. But... we can't really *do*
anything yet... because that MySQL instance is empty! In `var:export`, you can see
that the database *name* is apparently "main". But that does *not* exist yet.

No problem! When we installed Doctrine, it added a *bunch* of new `bin/console`
commands to our app. Run:

```terminal
php bin/console
```

and scroll up to find a *huge* list that start with `doctrine:`. The *vast* majority
of these are not very important - and we'll talk about the ones that *are*.

## The "symfony console" Command

*One* of the handy ones is `doctrine:database:create`, which reads the database config
and creates the database. So, in our case, it should create a database called `main`.

Ok! Copy the command name and run:

```terminal
php bin/console doctrine:database:create
```

And... yikes!

> Access denied for db_user at localhost.

Huh. For some reason, it's using this `DATABASE_URL` from `.env` *instead* of the
one that's set by the Symfony binary. The problem is that, when you load your site
in the browser, this is processed through the Symfony web server. That allows
the Symfony binary to inject all of the environment variables.

But when you just run a random `bin/console` command, that does *not* use the
symfony binary. And so, it does *not* have an opportunity to add the environment
variables.

No worries! There is, of course, a solution. Instead of running:

```terminal
php bin/console
```

We'll run:

```terminal
symfony console
```

`symfony console` literally means `bin/console`... but because we're running it
through the Symfony executable, it *will* inject the environment variables that
are coming from Docker. So:

```terminal
symfony console doctrine:database:create
```

And... boom! We have a database!

## Docker Image Versions

Before we jump into fun stuff like generating entities and database tables,
I want to tighten up one more thing. Open up `docker-compose.yaml`. The
`:latest` next to the image means that we want to use the *latest* version of MySQL.
Where does that image come from?

Google for Docker hub to find https://hub.docker.com. When you say that you want
a `mysql` image at version `latest`, Docker communicates back to Docker Hub to
get the details. Search for MySQL for *all* the info about that image including
the *tags* that are currently available. Right now, the `latest` tag is equal to
8.0.

Head back over to `docker-compose.yaml`. You don't have to do this, but I'm going
to change `latest` to `8.0` so that I'm locked at a specific version that won't
suddenly change.

Over at the terminal, even though `latest` and `8.0` are *technically* the same
image, let's restart `docker-compose` anyways to update the image. Run:

```terminal
docker-compose down
```

And then:

```terminal
docker-compose up -d
```

It quickly downloaded the new image... which was probably just a "pointer" to the
same image we used before.

## Setting server_version

Now that we've set the MySQL version in Docker, we should *also* do the same thing
with Doctrine. Open up `config/packages/doctrine.yaml`. See that `server_version`
key? Set this to 8.0. If you're using mariadb, you can use a format like
`mariadb-10.5.4`.

This is... kind of an annoying thing to set, but it *is* important. It tells
Doctrine what *version* of MySQL we're running so that it knows what features are
supported. It uses that to adjust the exact SQL it generates. Make sure that your
production database uses this version or *higher*.

Next, let's create our *first* database table by generating an entity.
