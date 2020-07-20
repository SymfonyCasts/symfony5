# make:docker:database

Doctrine is installed! Woo! Now we need to make sure a database is running like
MySQL or PostgreSQL. Then, once that's running, we can update the `DATABASE_URL`
env var to point to our username, password and hostname of that running database.

So: you can *absolutely* start a database manually: you can download MySQL or
PostgreSQL onto your machine and start it. *Or* you can use Docker, which is what
*we* will do.

## Using Docker?

Now, hold on: if you're nervous about Docker... or you haven't used it much... or
you've used it and you hated it, stay with me! Using Docker *is* optional for
this tutorial, but we're going to use it in a very lightweight way.

The only requirement to get started is that you need to have Docker downloaded
and running on your machine. I already have Docker running on my machine for Mac.

Docker is *all* about creating tiny *containers* - like a container
that holds a MySQL instance and another that holds a PHP installation. Traditionally,
when *I* think of Docker, I think of a *full* Docker setup: a container for PHP,
a container for MySQL and another container for Nginx - all of which communicate
to each other. In that situation, you don't have *anything* installed on your
local machine except for Docker.

That "full Docker" setup is great - and, if you like it, awesome. But it also
adds a lot of complexity: sharing source code can make your app *super* slow on
a Mac and if you need to run a `bin/console` command, you need to execute that
from *within* a Docker container.

## Our Simple Docker Plan

Instead, we're going to do something *much* simpler: we *are* going to have PHP
installed on our local machine - I *do* have PHP installed on my Mac. Then, we're
*just* going to use Docker to launch *services* like a MySQL, Redis or Elasticsearch.
Then. we'll configure out local PHP app to communicate with those containers.

For me, it's kind of the best of both words: it makes it super easy to launch
services... but without the complexity that often comes with Docker.

## Hello make:docker:database

Ok, ready? To manager our Docker containers, we need to create a
`docker-compose.yaml` file that describes all of the services we need.

That file is pretty simple but... let's cheat! Find your terminal and run:

```terminal
php bin/console make:docker:database
```

This command comes from MakerBundle version 1.20... and it will guide us through
our Docker setup.

Ok: it doesn't see a `docker-compose.yaml` file, so it's going to generate a new
one. I'll use MySQL and, for the version - I'll use `latest` - we'll talk more
about this in a few minutes.

And... done! The database service is now ready!

In reality, the *only* thing this command did was create a `docker-compose.yaml`
file: it didn't communicate with Docker or start any containers - it *just*
created this new  `docker-compose.yaml` file.

And... it's pretty basic: we have a service called `database` - that's just our
internal name for it - which uses a `mysql` image at its `latest` version. We're
setting an environment variable in the container that make sure the root user
password is... `password`! At the bottom, the `ports` means that port 3306 of
the container will be exposed to our *host* machine.

That last part is important: this will make it possible for our PHP code to talk
*directly* to MySQL in that container. This syntax actually means that port 3306
of the container will be exposed to a *random* port on our host machine. Don't
worry: I'll show you exactly what this means.

## docker-compose up

So... yay! We have a `docker-compose.yaml` file! To start *all* of the containers
that are described in it... which is just one - run:

```terminal
docker-compose up -d
```

The `-d` means "run as a daemon" - it runs in the background instead of holding
into my termianl.

The first time you run this it will take some time because it needs to download
MySQL. But eventually.... yes! With one command, we now have a database running
in the background!

How do we communicate with it? Let's learn a bit more about `docker-compose` next,
including how to shut down the containers and connect to the MySQL instance.
