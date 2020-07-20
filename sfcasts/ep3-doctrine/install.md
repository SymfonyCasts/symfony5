# Install

Coming soon...

Hey friends.

Welcome to our tutorial about Symfony and doctrine. This is going to be a good one.
We learned a ton of stuff in the first two courses in the series. It really, we
learned everything about how Symfony works, how configuration works. Now it's time to
take our application to the next level, by adding a database, that's going to make
things way, way more interesting. Now, actually Symfony has no database integration
at all. Instead it leverages another library called doctrine, which has been around
for a super long time and is incredibly powerful. Somebody doctrine, nurse sort of
programming BFS, they're sort of the Batman and Robin of web development. They're
both powerful, but they have such good integration that it feels like one unit

And not only is doctrine powerful, but it's also easier to use. And it's ever been in
its entire history. I think you're going to love it. So as always to get the most out
of this and have the most fun, you should absolutely code along with me. Download the
course code from this page. After you unzip it, you'll find a `start/` directory with
the same code that you see here. Check out this `README.md` file for all the
setup instructions. The last step will be to open a terminal, move into the project
and run 

```terminal
symfony serve -d
```

Do you use these Symfony binary to start a local web
server? You can download this at https://symfony.com/download run 

```terminal
symfony serve -d
```

to start a web server in the background, Port `8000`. So I'll copy this. You are all
here. Spin over to my browser and say hello to Cauldron Overflow, our question and
answer sites for witches and wizards. When things kind of go wrong, Where do you have
a listing of spells on the homepage? And you can go and view individual spells, but
all of this stuff is really hard coded. We're not grabbing this from our dynamic
database yet. That is our job. So like everything is Symfony Symfony starts very,
very small. So doctrine actually isn't installed right now, installing it though is
really easy over at our terminal. I'm going to run

```terminal
composer require orm
```

There's a few things I want to say about that. `orm` is one of
those Symfony flex aliases. You can just say `orm` but in reality, uh, it's just a
shortcut for a `symfony/orm-pack`. Now we're talking about packs in a previous
course, a pack is sort of a fake package that helps you just get other packages. So I
can actually copy that, uh, the name of that repository. And we can see what that
looks like over at https://github.com/symfony/orm-pack. You can see it's just a
`composer.json` file. The whole point of this library is that it requires a few other
packages. So we can just `composer require` this one library and we will get all four of
these libraries.

Now, one of the, one of the libraries that we have in our project is `symfony/flex`,
which is actually what, which is what powers, the alias and recipe system starting in
`symfony/flex` version 1.9, which I have in this project. When you install a pack like
we just did, and you go and look at your `composer.json` file, what you're gonna
see is that these four lines here were added. So before a `symfony/flex` 1.9, you would
have only had one entry in here for `symfony/orm-pack`. It would have still downloaded
the same things in the background, but starting in `symfony/flex` 1.9, instead of putting
that one line here, it adds all four lines here and it just makes it easier because
now you can manage all of these independently. So the point is, all we had to do was
say, `composer require orm`. And that's a shortcut for getting the four libraries that
Symfony recommends to work with the Doctrine ORM.

So anyways, if we scroll down, you can ignore this Zen framework, uh, abandoned
thing. That's, uh, not something we use very directly. Now we just install the
library that talks to the database and you can see we get this nice little, uh, uh,
message at the bottom here about that. And it says, modify your database. You were
all config in `.env` So when we installed doctrine, it installed a couple of recipes.
So I'm gonna go down here, clear my screen and say,

```terminal
git status
```

And so, in addition
to the normal files that we would expect to be modified, also modified the `.env` and
created a couple new files. So if we look at that, that end, what it did down here at
the bottom is it added this new `DATABASE_URL`. So this is the configuration, the
environment variable that doctrine is going to use to connect to your database the
way it does that. The recipe also add another file called `config/packages/doctrine.yaml`
This is actually the doctrine configuration here, and you can actually see
this `doctrine.dbal.url` . You were anything that points to the environment
variable. So this, this file is not all that important, but I wanted you to see how
the pieces are connected with doctrine.

The recipe also added a couple of directories `src/Entity/`, `src/Repository/`,
and `migrations/`, which we'll talk about soon. So all we need to do to start working
with doctrine is configure this `DATABASE_URL` environment, variable, and point that to
our real database in connection information. But unlike what we're going to do
something special in this tutorial, instead of me telling you to go install my SQL
and get the server running on your own, we're going to use Docker. And if you already
use Docker then great, you're going to love this. If you haven't used Docker much
yet, I still think this isn't required, but I still think you're going to love this.
Docker has wonderful integration with the Symfony Symfony binary. That's going to
make using a, spinning up a web server, a database server. Very nice. Let's talk
about that next.

