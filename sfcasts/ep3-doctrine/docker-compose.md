# docker-compose & Exposed Ports

We just started our MySQL docker container thanks to `docker-compose`. So... ah...
now what? How can we *communicate* with it? Great question!

Start by running just:

```terminal
docker-compose
```

This lists *all* the possible commands you can use with `docker-compose`. Most
of these we won't need to worry about. But one good one is `ps`, which stands
for "process status". Try it:

```terminal
docker-compose ps
```

This lists *all* the containers that `docker-compose` is running for this project...
which is just one. Ah, and check this out: port `3306` of the container is being
shared to our local machine on port `32773`. By the way, that is a *random* port
that will be different each time we restart the container.

## Connecting to the MySQL Docker Container

Anyways, this means that we can *talk* to the MySQL server in the container via
port 32773! I'll show you. I actually *do* have `mysql` installed on my local
machine, so I can say  `mysql -u root --password=password` because, in our
`docker-compose.yaml` file, that's what we set the root user password to.
Then ` --host=127.0.0.1` to talk to my local computer and ` --port=` set to
this port right here: `32773`. Try it!

```terminal-silent
mysql -u root --password=password --host=127.0.0.1 --port=32773
```

Boom! We are *inside* of the container talking to MySQL. By the way, if you
*don't* have MySQL installed locally, you can also do this by running:

```terminal
docker-compose exec database mysql -u root --password=root
```

That will "execute" the `mysql` command inside the container that's called `docker`.

Anyways, now that we're here, we can do normal stuff like:

```terminal
SHOW DATABASES
```

... or even create a new database called `docker_coolness`:

```terminal-silent
CREATE DATABASE docker_coolness
```

There it is! I'll type `exit` to get out of here.

## Stopping and Destroying the Containers

When you're done with the containers and want to turn them off, you can do that
with:

```terminal
docker-compose stop
```

Or the more common:

```terminal
docker-compose down
```

This loops through all of the services in `docker-compose.yaml` and, not only
*stops* each container, but it also *removes* their image. It's like completely
deleting that mini server - including its data.

Thanks to that, the next time we run:

```terminal
docker-compose up -d
```

It will create the whole server from scratch - any data will be gone.

## Booting isn't Instant

Let's see the whole process from the start. First, run:

```terminal
docker-compose down
```

to stop and destroy the container. If we tried to connect to MySQL now it, of
course, fails. Now run:

```terminal
docker-compose up -d
```

To start the container back up. Let's check on the process:

```terminal
docker-compose ps
```

Ah! Look at that port! It was `32773` the first time we ran it. *Now* the container
is exposed on port `32775`. Let's try connecting:

```terminal
mysql -u root --password=password --host=127.0.0.1 --port=32775
```

And... oh! It didn't work!

> Lost connection to MySQL server

Ah. The truth is that, even though it *looks* like `docker-compose up` is instant,
in reality, it takes a few seconds for MySQL to *truly* start. Eventually if we
try again...

```terminal-silent
mysql -u root --password=password --host=127.0.0.1 --port=32775
```

Yes! Now we're in. But you won't see the `docker_coolness` database because
`docker-compose down` killed our data.

At this point, we've created a `docker-compose.yaml` file that allows us to use
`docker-compose` to launch a MySQL container that we can talk to. *Awesome*.

To connect to this from our Symfony app, all *we* need to do is update the
`DATABASE_URL` environment variable to use the right password and port. Simple!

But... we're *not* going to do that. It *would* work... but it turns out that
our app is *already* aware of the correct `DATABASE_URL` value... even though
we haven't configured anything. Let's talk about that next.
