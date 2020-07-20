# docker-compose & Exposed Ports

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
