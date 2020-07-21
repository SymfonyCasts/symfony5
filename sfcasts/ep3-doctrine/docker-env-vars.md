# docker-compose Env Vars & Symfony

Thanks to our `docker-compose.yaml` file and the `docker-compose up` command, we
started a MySQL container in Docker. You can prove it by running:

```terminal
docker-compose ps
```

Yep! Port 3306 of the container is being exposed to my host machine on port 32776,
which is a random port that will change each time we run `docker-compose up`.

## Configure DATABASE_URL Manually?

Whether you followed me through the Docker setup... or decided to install MySQL
on your own, we're now at the same point: we need to update the `DATABASE_URL`
environment variable to point to the database.

Normally I would copy `DATABASE_URL`, go into `.env.local`, paste,
and update it to whatever my local settings are, like `root` user, no password
and a creative database.

## DATABASE_URL From Docker

But... I'm *not* going to do that. Why? Because the `DATABASE_URL` environment
variable is *already* configured correctly!

Let me show you. When we started our app, we used the Symfony binary to create
a local web server. I'll run:

```terminal
symfony server:stop
```

to stop it... just so I can show you the command we used. It was:

```terminal
symfony serve -d
```

That started a web server at `localhost:8000`. So: what we're seeing in the browser
is being *served* by the `symfony` binary.

Well... surprise! The Symfony binary has *special* integration with Docker! It
*detects* that we have a `docker-compose.yaml` file in this project,
loops over all of the running services, reads their config and exposes
*real* environment variables to our app with the connection details for each one.

For example, because this service is called `database` - we technically could have
called it anything - the Symfony binary is *already* exposing an environment variable
called `DATABASE_URL`: the *exact* environment variable that Doctrine is looking
for.

## Dumping the Environment Variable

I'll show you *exactly* what I mean. First, go back to your browser, watch the
bottom right of the web debug toolbar, and refresh. Ah! The little "Server"
icon turned green! This is info about the Symfony web server... and *now* it says
"Env Vars from Docker".

Back at your editor, open up `public/index.php`: the front controller for our
project. We normally don't need to mess with this file... but let's temporarily
hack in some code. After the autoload line, add `dd($_SERVER)`.

The `$_SERVER` global variable holds a lot of things *including* any real
*environment* variables that are passed to PHP. Back at the browser, refresh
and search for "database". Check it out! A `DATABASE_URL` environment variable!

That is being set by the Symfony binary, which is reading the info dynamically
from Docker. It has all the correct info including port 32776.

When a *real* environment variable exists, it *overrides* the value that you have
in `.env` or `.env.local`. In other words, as *soon* as we run `docker-compose up`,
our app has access to a `DATABASE_URL` environment variable that points to the Docker
container. We don't need to configure *anything*!

## Seeing the Environment Variables

Back in `index.php`, remove the `dd()` line.

Another way to see what environment variables the Symfony binary is exporting to
our app is by running:

```terminal
symfony var:export --multiline
```

And... yes! This has `DATABASE_URL` and some other `DATABASE` variables that
you can use for each part... if you need to. If we added a *second* service
to `docker-compose` - like a Redis container - then *that* would show up here too.

The big picture is this: all we need to do is run `docker-compose up -d` and
our Symfony app is immediately setup to talk to the database. I *love* that.

But... we can't really *do* anything yet... because the MySQL instance is empty!
Next, let's create our database and make sure that Doctrine knows *exactly* which
version of MySQL we're using.
