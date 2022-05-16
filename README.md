# Tutorials, Friendship & Upgrading to Symfony6

Well hi there! This repository holds the code and script
for the [Symfony6 Upgrade Tutorial](https://symfonycasts.com/screencast/symfony6-upgrade) on SymfonyCasts.

## Setup

If you've just downloaded the code, congratulations!!

To get it working, follow these steps:

**Download Composer dependencies**

Make sure you have [Composer installed](https://getcomposer.org/download/)
and then run:

```
composer install --ignore-platform-reqs
```

The `--ignore-platform-reqs` is added because our "old code" contains old
dependencies that support PHP 8 (which you are probably using). Well, in
reality, the code *does* work in PHP 8. And so by adding this flag, it tells
Composer to download those dependencies anyways. It's definitely time to
upgrade this old code!

You may alternatively need to run `php composer.phar install`, depending
on how you installed Composer.

**Database Setup**

The code comes with a `docker-compose.yaml` file and we recommend using
Docker to boot a database container. You will still have PHP installed
locally, but you'll connect to a database inside Docker. This is optional,
but I think you'll love it!

First, make sure you have [Docker installed](https://docs.docker.com/get-docker/)
and running. To start the container, run:

```
docker-compose up -d
```

Next, build the database and the schema with:

```
# "symfony console" is equivalent to "bin/console"
# but its aware of your database container
symfony console doctrine:database:create
symfony console doctrine:schema:update --force
symfony console doctrine:fixtures:load
```

(If you get an error about "MySQL server has gone away", just wait
a few seconds and try again - the container is probably still booting).

If you do *not* want to use Docker, just make sure to start your own
database server and update the `DATABASE_URL` environment variable in
`.env` or `.env.local` before running the commands above.

**Webpack Encore Assets**

This app uses Webpack Encore for the CSS, JS and image files. We'll
be tweaking the Encore setup while upgrading, so we want to get this
running. Make sure you have [yarn](https://yarnpkg.com/lang/en/)
or `npm` installed (`npm` comes with Node) and then run:

```
yarn install
yarn encore dev --watch

# or
npm install
npm run watch
```

**Start the Symfony web server**

You can use Nginx or Apache, but Symfony's local web server
works even better.

To install the Symfony local web server, follow
"Downloading the Symfony client" instructions found
here: https://symfony.com/download - you only need to do this
once on your system.

Then, to start the web server, open a terminal, move into the
project, and run:

```
symfony serve
```

(If this is your first time using this command, you may see an
error that you need to run `symfony server:ca:install` first).

Now check out the site at `https://localhost:8000`

Have fun!

## Have Ideas, Feedback or an Issue?

If you have suggestions or questions, please feel free to
open an issue on this repository or comment on the course
itself. We're watching both :).

## Magic

Sandra's seen a leprechaun,
Eddie touched a troll,
Laurie danced with witches once,
Charlie found some goblins' gold.
Donald heard a mermaid sing,
Susy spied an elf,
But all the magic I have known
I've had to make myself.

Shel Silverstein

## Thanks!

And as always, thanks so much for your support and letting
us do what we love!

<3 Your friends at SymfonyCasts
