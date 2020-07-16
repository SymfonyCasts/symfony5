# Docker Env Vars

Coming soon...

Thanks to our simple Docker compose file and the Docker compose up command. We
started a nice, we started a, my SQL container in Docker. You can see it by
running.com. You can prove it by running Docker, compose P S port 33 Oh six on the
inside of the container is being exposed to my host on port three, two seven seven
six, which is a random port that will change every time you use Docker compose. Now,
whether you followed me and just created this Majeski created my SQL in this
container, or you decided to install my SQL your own way. We're at the same point at
this moment, we need to update our database_URL environment, variable to point to our
database. So like re user whatever the password is, the correct port and whatever
database name we want. Now, normally the way that I would do this is I would copy
this database. You were all key here. And then I would go into D and that local, and
I would do a local override, like maybe root, no password, and then, uh, create some
creative database name like Calder and overflow.

That would allow me to talk to doctrine, but I'm actually not going to do that.
That's logical. But in reality, the database_you were all environment is already
configured correctly without us having to do anything. How we remember when we first
started our project, we use the Symfony web server to start our web servers. I'm
actually gonna run Symfony server server stops so we can stop it. You remember, we
were running Symfony. We said, I said, Symfony serve dash D. And that started our web
server at local host 8,000. So we're seeing a very, as it's actually running through
the Symfony web server, well, the Symfony Webster has integration with Docker. It
actually detects that we have a Docker compose that.yaml file in this project. And it
detects that backer, compose is running it then goes through each of these services,
reads their configuration and exposes these as environment variables. So, because we
have a service here called database, which could have been called anything, it's
going to expose the connection information of this, uh, to this container as an
environment variable called database_you L the exact name that doctrine is looking
for.

I'll show you exactly what I mean. But first, if you go over to our browser and
refresh, the first thing you notice is down here on the right, all of a sudden this
little server thing is going green, and you can that it is detecting backer composed.
And it says that there are some environment variables from Docker. So to see what
this means is that if you go to public index dot PHP, this is the front controller
for our project, and we normally don't need to put any, we normally don't need to
mess with this file, but I actually going to go read from my Ottawa file and say, D D
Dyson_server the server. So the server global variable is the one that hold in
environment variables. So figuring out and refresh and search for a database, check
it out. Database_URL.

There is an environment variable called database. You were out that is actually being
set by the Symfony binary. And it's reading it from Docker. You can see it has all
the correct connection information here for port three, two, seven 76. And when you
have a real environment, variable, it overrides the value that you have and dot N or
dot M that local. So the whole point is just by starting Docker, backer, compose, we
already have a database URL that is set to point to that Docker container without us
needing to do anything. In other words, I've just spent five, 10 times longer talking
about how this works. Then you will, then you would actually need to get this running
back in the next app each week. I'm going to remove this line another way to see what
variables the Symfony binary is exporting is by running Symfony VAR export dash dash
multiline this year. It's going to tell you that it has a couple of other, has a
couple of kind of Symfony specific things you can see up here. This is all the
environment variables is exposing to describe our service. And if we had a read a
service, you would see, uh, an environment variables here for redness or rabbit MQ.

So the point is all we needed to do was run Docker, composed SD, and everything
works. I love that. Now, even though our project is already set up to talk to the
database, we can't really do much yet because the database there, there is no
database and there are no database tables. Uh, if you look at our, of our export, you
can see that, uh, the database you were all by default is going to use a database
called Maine. And that name of that is not important. All we don't care. So the first
we didn't do is actually make sure that that database exists. Now, when you install
Docker, it actually adds a number of bin console commands to your projects. If I run
bin console, scroll up, you'll see a bunch of these that start with the word Docker,
the vast, vast majority of these. You're not gonna need to worry about, and we'll
talk about the important ones, but one of them is called doctrine database create.
And what that does is it reads your database configuration information and the
database. So in our case, it should create a database called main.

So I'll copy that command name and then let's run bin console doctrine, database
create, and, Oh, it doesn't work access denied for DB_user at local host. So you can
kind of read between the lines here. For some reason, it's using the, this database.
You well, a value instead of the one from the Symfony binary. And the problem is when
you load your site through the web server here, this is running through the Symfony
binary. So the Symfony binary, the Symfony binary can inject all the environment
variables that you need. But if you just run a random bin console command, the
Symfony binary doesn't have an opportunity to inject those environment variables. So,
but that's fine. The Symfony binary has a solution for that instead of running bin
console. And then our command. What we're going to do now is actually run Symfony
console.

So when a council literally means Ben console, but because we're running through the
Symfony executable, it's going to inject the environment variables coming from
Docker. So Symfony console doctrine, database create, and boom, that works perfectly.
All right. The last thing I want to talk about before we actually go and start
creating some database tables is inside of our doc can compose that Yammer file. This
version is colon latest. That means we, this gives us the latest version of my SQL,
and you can totally keep that latest thing there if you want to, but I'm going to go
to the, I'm going to Google for Docker hub to find hub.backer.com. Now, when you say
something like image, my SQL that actually communicates back to Docker hub to figure
out what that means. So we can search here for my SQL and this shows us the, my SQL
image and all of the different tags that are currently there. So when I'm recording
this, the latest is actually the same as version eight. So that's great. I'm actually
going to go over here and change my latest two version. Let's say 8.0. So instead of
just, this is going to make it so that if 8.1 comes out tomorrow, I might see my
project. Doesn't start instantly using it and gives me a little bit more control.

Now, 8.0 in latest are the same right now, but I'm actually going to run Docker,
compose, bashed down for this to take effect. I'm gonna run Docker composed down and
then Docker compose up dash D once again. And that's going to now pull in the
minuscule eight imaging and see it was really fast because my school eight is really
the same as the latest version. And the last change I'm going to make is actually the
doctrines configuration file config packages, doctrine.yaml you notice over here,
there's a little bit of configuration here called server version. This is an annoying
little thing that you should set. I'm an oncoming that out and set this to 8.0. What
this does is it tells doctrine what version of my SQL you're running or what version
of Postgres you're running so that it knows what features are supported. And then it
can kind of adjust the SQL. It generates based on that. If you're using Maria DB,
instead, you can use a version numbers like a Maria DB dash 10.2 here, something you
just need to set one time, and then you're good to go. Alright. Our database have a
database. Our project is connected to the database next let's generate our first
entity, our first database table, and really start putting things together.

