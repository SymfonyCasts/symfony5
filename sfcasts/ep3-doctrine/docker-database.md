# Docker Database

Coming soon...

Doctrine is now installed. Great. Now we need to make sure a database is running like
my SQL or Postgres. Then once that's running, we can update these database URL
parameter here to point to our username, password, data, and database name of our
actual database that we have running now to get the database running. You can
absolutely do it by hand. You can download MySQL or Postgres onto your machine and
get it running. Or you can use Docker, which is what, which is what we will do. Now,
hold on. If you are nervous about Docker or you haven't used it much or you've used
it and you hated it, stay with me using Docker for your database is absolutely
optional. Well, we're going to use it in a very lightweight way, which I think you're
going to really, really like the only requirement to get started is that you need to
have Docker downloaded and running on your machine.

I already have Docker running on my machine for Mac. Now here's the plant. When you
think of Docker and hope, one of Docker is being able to spin up tiny little
containers, like one container that holds just MySQL another container that just
holds PHP. So when you think of doctor, you tend to think of a full Docker setup. You
have a container for PHP. You have a container from MySQL. You have a container for
your web server, like nginx, and they all communicate to each other. And then on
your actual local machine, you don't have to have anything installed except for
Docker. Now that is a great setup and you can do that, but it also adds a lot of
complexity in order to even run any console commands. You need to actually execute
them within your container.

Instead of we're going to do something much simpler, we are going to have PHP
installed on our local, on our local machine. I have PHP installed on my local
machine. Then I'm just going to use Docker for my services like my, MySQL service.
Or if later I need a Redis service, I'll add an I'll use Docker to spin up a redis
service, and then I'll have my local PHP application communicate with those, uh,
containers for me, this is kind of the best of both worlds. It makes it super easy
for me to, uh, add new services like MySQL or Reddis. But without the complexity
that often comes with Docker. Now the only thing that we need to, we need to get this
going is a `docker-compose.yaml` file, which describes all of the services we
need. So to get that, it's a pretty simple file, but we are going to cheat and
generate it.

So go back over to our terminal and we're gonna run 

```terminal
php bin/console make:docker:database
```

a nice little command from maker bundle. That's going to walk us through
that puzzle of that process so you can see it. Doesn't see a `docker-compose.yaml`
file. So it's going to generate a new one. Um, you can use any database you want.
I'll use MySQL here cause it's, it's all gonna work the same. Uh, what version would
you like to use? Uh, we're gonna talk about versions a little bit more, but I'll use
just latest. I'll hit enter just to use the default and done the new database service
is now ready and it gives us a number of commands that we can run. We'll talk about
all of those, but the only thing that this command did was create a `docker-compose.yaml`
file.

So it didn't communicate with Docker in any way. It just created this new 
`docker-compose.yaml` file. And you can see how simple it is down here. Basically said, we
have a service whose name is `database`. The `image` is MySQL at the latest version. And
then there's an environment variable that says that the root password is `password`,
which you could set to anything. And then down here it says that it's going to expose
port `3306` to our host machine. What that means is actually, and the way we have
written here is that it's actually going to expose that to a random host on our, a
random host on our host machine.

You're going to see how that works in a second now to actually start this container
back at a terminal, we're going to run 

```terminal
docker-compose up -d
```

is it means Damon. So it means once it finishes, it's actually going to run in the
background instead of just holding my terminal. And the first time you run this, it's
going to download MySQL. It'll be much faster after you run this. And yes,
congratulations with one command. We now have a database running in the background.
How do we communicate with it? Great question. If you just run 

```terminal
docker-compose
```

it's going to give you a list of a number of different commands that you can run at
it. And you're not, you know, for the way we're going to use Docker, you're not even
going to need most of these, but one of those called `ps` so we can say here is dr.

```terminal
docker-compose ps
``` 

And that's going to give you information about all of the
containers that are running as part of our project, which is just one. Now, this is
the thing I was talking about earlier, port `3306` of the container is being
shared to our local machine on this random port `32773`. That'll
be different. Every time that I run a `docker-compose`, this means that we can actually
talk to the database server by using this port here. Let me show you just to prove
it. I'm gonna use the, MySQL command that I, I happened to have MySQL also
installed locally in my school. So I'm actually going to communicate with that
container. So I'm saying  `mysql -u root --password=password`
Cause you remember when we, uh, our docker-compose file says it will have a root user with
password `password`. And then ` --host=127.0.0.1` to talk
to my local computer and then ` --port=`. And we'll use this port right
here. So `32773` and I hit that. 

```terminal-silnet
mysql -u root --password=password --host=127.0.0.1 --port=32773
```

Boom. I am actually inside of the container right now, talking to Majeski wealth.

We can have it, show us the databases. It just has the normal that you start with. We
can even create a database called Docker coolness and we haven't. We have a database
inside there. Now I'll hit exit to get out of here. Now, if we want to do turn this
container off, one of the other commands don't need to know is just `docker-compose stop`

That's going to stop all of the containers in your `docker-compose.yaml` file or
more commonly 

```terminal
docker-compose down
```

That's going to go through your `docker-compose.yaml`
compose file. Go through all of these containers. We only have one and not only turn
them off, but actually remove them. So it's almost like completely deleting that from
your system. So next time we do say dash a `docker-compose up -d` that actually
spend the beta database server back up. And if we go and communicate it with again,
Oh, I did that too fast. I'm going to back up there. I'll clear the screen and say

```terminal
docker-compose down
```

that actually stops it and removes it. So now to now, if we
tried to connect to my SQL, it's not there. Um, it doesn't work. So now next time we
do 

```terminal
docker-compose up -d
```

That's going to start up, but all, any data we have
from, from our database before is completely Dom is completely gone. Also, this might
be on a different port, so I'll do 

```terminal
docker-compose ps
```

You can see it's on port `32775`

And we can once again, talk to it. And by the way, if you get this, like here, one of
the things is when you run 

```terminal-silent
docker-compose up -d
```

it looks like the database
started instantly, but actually it might still be booting up in the background. So I
wanted to show you that. So if I try again, there we go. Now it works just fine. But
if you say show databases, you won't see the database that we created a second away
ago, Docker coolness, because Docker compose down actually kill that. So long way of
saying that this is great by having this one simple file that we generated, we can
now run 

```terminal
docker-compose up -d
```

and we get a database running that we can talk to
from our local machine. I don't have to install my SQL. It just works. So at this
point, you're probably thinking awesome. So all we need to do then is take these
connection parameters and kind of configure our dot end file right here to use root
password and the correct port right here, but actually we're in that. And yes, we
actually, we're not going to do that. You're thinking correctly. Well, but in
reality, our application already knows how to connect to our database without us
needing to do anything else. Let's talk about how that's possible next. Okay.

