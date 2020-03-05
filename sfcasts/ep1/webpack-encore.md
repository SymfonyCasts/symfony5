# Hello Webpack Encore

Our CSS and JavaScript setup is fine: we have a `public/` directory with
`app.css` and `question_show.js`. Inside our templates - like `base.html.twig` -
we include the CSS file with a traditional link tag. Sure, we use this
`{{ asset() }}` function, but it doesn't do anything important. Symfony isn't
touching our frontend assets at all.

That's fine. But if you want to get serious about frontend development - like
including using a frontend framework like React or Vue, you need to take this
up to the next level.

To do that, we're going to use a Node library called Webpack: which is the
industry-standard tool for managing your frontend assets. It combines
and minifies your CSS and JavaScript files... though that's just the tip of the
iceberg of what it can do.

But... to get Webpack to work *really* well requires a lot of complex configuration.
So, in the Symfony world, we use a *wonderful* library called Webpack Encore,
which makes using Webpack dead simple. We have an entire free tutorial about
[Webpack Encore](https://symfonycasts.com/screencast/webpack-encore) here on
SymfonyCasts.

But let's go through a crash course right now.

## Installing Webpack Encore

First, make sure you have node installed:

```terminal-silent
node -v
```

And also yarn:

```terminal-silent
yarn -v
```

Yarn is one of the package managers for Node... basically Composer for Node.

Before we install Encore, make sure you've committed all your changes - I already
have. Then run:

```terminal
composer require encore
```

But... a minute ago, I said that Encore is a *Node* library. So why are we
installing it via Composer? Great question! This command actually does *not*
install Encore. Nope, it installs a very small bundle called
`webpack-encore-bundle`, which will help our Symfony app *integrate* with
Webpack Encore. The *real* beauty is that this bundle has a *very* useful recipe.
Check it out, run:

```terminal
git status
```

Woh! It's recipe did a *lot* for us! One cool thing is that it modified our
`.gitignore` file. Go open it in your editor. Cool! We're now ignoring
`node_modules/` - which is Node's version of the `vendor/` directory, and a
few other paths.

The recipe also added some YAML files, but those aren't very important.

The *most* important thing the recipe did was give us these 2 files: `package.json`,
which is the `composer.json` of Node and `webpack.config.js`, which is the Webpack
Encore configuration file that controls everything it does.

Check out the `package.json` file. This tells Node which libraries it should
download and it includes the basic stuff we need. Most importantly:
`@symfony/webpack-encore`.

## Installing Node Dependencies with yarn

To tell Node to install these dependencies, run:

```terminal
yarn install
```

This command reads that file and downloads a *ton* of files and directories into
a new `node_modules/` directory. It might take a few moments to download everything
and build a couple of packages.

When it's done, you'll see two new things. First, you have a fancy new
`node_modules/` directory with tons of stuff in it. And this is already being
ignored from git. Second, it created a `yarn.lock` file, which has the same function
as `composer.lock`. So... you'll want to commit the `yarn.lock` file, but not
worry about it otherwise.

Ok, Encore is installed! Next, let's refactor our frontend setup to use it.
