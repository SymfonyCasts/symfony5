# doctrine:database:create & serverVersion

But... we can't really *do* anything yet... because the MySQL instance is empty!
In `var:export`, you can see that the database *name* is apparently "main". But
that does *not* exist yet.

But... no problem! When we installed Doctrine, it gave us a *bunch* of new
`bin/console` commands.


Docker, it actually adds a number of `bin/console` commands to your projects. If I run

```terminal
php bin/console
```

scroll up, you'll see a bunch of these that start with the word doctrine,
the vast, vast majority of these. You're not gonna need to worry about, and we'll
talk about the important ones, but one of them is called `doctrine:database:create`.
And what that does is it reads your database configuration information and the
database. So in our case, it should create a database called `main`.

So I'll copy that command name and then let's run

```terminal
php bin/console doctrine:database:create
```

and, Oh, it doesn't work access denied for db_user at localhost. So you can
kind of read between the lines here. For some reason, it's using the, this `DATABASE_URL`.
value instead of the one from the Symfony binary. And the problem is when
you load your site through the web server here, this is running through the Symfony
binary. So the Symfony binary, the Symfony binary can inject all the environment
variables that you need. But if you just run a random `bin/console` command, the
Symfony binary doesn't have an opportunity to inject those environment variables. So,
but that's fine. The Symfony binary has a solution for that instead of running
`bin/console`. And then our command. What we're going to do now is actually run
`symfony console`

So when a council literally means `bin/console`, but because we're running through the
Symfony executable, it's going to inject the environment variables coming from
Docker. So

```terminal
symfony console doctrine:database:create
```

and boom, that works perfectly.
All right. The last thing I want to talk about before we actually go and start
creating some database tables is inside of our `docker-compose.yaml` file. This
version is `:latest`. That means we, this gives us the latest version of MySQL,
and you can totally keep that latest thing there if you want to, but I'm going to go
to the, I'm going to Google for Docker hub to find hub.backer.com. Now, when you say
something like image, MySQL that actually communicates back to Docker hub to figure
out what that means. So we can search here for MySQL and this shows us the, my SQL
image and all of the different tags that are currently there. So when I'm recording
this, the latest is actually the same as version eight. So that's great. I'm actually
going to go over here and change my latest two version. Let's say 8.0. So instead of
just, this is going to make it so that if 8.1 comes out tomorrow, I might see my
project. Doesn't start instantly using it and gives me a little bit more control.

Now, 8.0 in latest are the same right now, but I'm actually going to run Docker,
compose, bashed down for this to take effect. I'm gonna run

```terminal
docker-compose down
```

and then

```terminal
docker-compose up -d
```

once again. And that's going to now pull in the
minuscule eight imaging and see it was really fast because my school eight is really
the same as the latest version. And the last change I'm going to make is actually the
doctrines configuration file `config/packages/doctrine.yaml` you notice over here,
there's a little bit of configuration here called `server_version`. This is an annoying
little thing that you should set. I'm an oncoming that out and set this to 8.0. What
this does is it tells doctrine what version of my SQL you're running or what version
of Postgres you're running so that it knows what features are supported. And then it
can kind of adjust the SQL. It generates based on that. If you're using Maria DB,
instead, you can use a version numbers like a `mariadb-10.2` here, something you
just need to set one time, and then you're good to go. Alright. Our database have a
database. Our project is connected to the database next let's generate our first
entity, our first database table, and really start putting things together.
