# Tutorials, Friendship & Symfony5

Well hi there! This repository holds the code and script
for the [Symfony5 Tutorials](https://symfonycasts.com/tracks/symfony) on SymfonyCasts.

## Setup

If you've just downloaded the code, congratulations!!

To get it working, follow these steps:

**Download Composer dependencies**

Make sure you have [Composer installed](https://getcomposer.org/download/)
and then run:

```
composer install
```

You may alternatively need to run `php composer.phar install`, depending
on how you installed Composer.

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

**Optional: Webpack Encore Assets**

This app uses Webpack Encore for the CSS, JS and image files. But
to keep life simple, the final, built assets are already inside the
project. So... you don't need to do anything to get thing set up!

If you *do* want to build the Webpack Encore assets manually, you
totally can! Make sure you have [yarn](https://yarnpkg.com/lang/en/)
installed and then run:

```
yarn install
yarn encore dev --watch
```

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
