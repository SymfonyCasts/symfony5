# How Recipes Work

Where do these Flex recipes lives? They live... in the *cloud*. More specifically,
if you look back at https://flex.symfony.com, you can click to view the Recipe for
any of the packages.

***TIP
The flex.symfony.com server was shut down in favor of a new system. But you can still
see a list of all of the available recipes at https://bit.ly/flex-recipes!
***

This goes to... interesting: a GitHub repository called `symfony/recipes`.

Go to the homepage of this repository. This is *the* central repository for recipes,
organized by the name of the package... and then each package can have different
recipes for different versions. Our recipe lives in `sensiolabs/security-checker/4.0`.

## Looking at the Source of a Recipe

Every recipe has *at least* this `manifest.json` file, which describes all of the
"things" it should do. This `copy-from-recipe` says that the contents of the
`config/` directory in the recipe should be copied into our project. *This* is
why a `config/packages/security_checker.yaml` file was added to our app.

Back in the manifest, the `composer-scripts` section tells Flex to add this line
to our `composer.json` file... and `aliases` define... well... the aliases that
should *map* to this package.

There *are* a few other things that a recipe can do, but this is the basic idea.

So... *all* Symfony recipes live in this *one* repository. Hmm, actually, that's
not true: all Symfony recipes lives in this repository *or* in another one called
`recipes-contrib`. There's no difference between these, except that quality
control is higher on recipes merged into the *main* repository.

## Using Composer to View Recipes

Another way you can see details about the recipes is via Composer itself. Run:

```terminal
composer recipes
```

These are the 7 recipes that have been installed into our app. And if we run:

```terminal
composer recipes sensiolabs/security-checker
```

We can see more details, like the URL to the recipe and files it copied into
our app.

*Anyways*, the recipe system is going to be our *best* friend: allowing our app
to start tiny, but grow *automatically* when we install new packages.

## Removing a Package & Recipe

Oh, and if you decide that you want to *remove* a package, its recipe will
be *uninstalled*. Check it out:

```terminal
composer remove sec-checker
```

That - of course - will remove the package... but it *also* "unconfigured" the
recipe. When we run:

```terminal
git status
```

It's clean! It reverted the change in `composer.json` and removed the config file.

[[[ code('eff0f785dc') ]]]

Next: let's install Twig - Symfony's templating engine - so we can create HTML
templates. The Twig recipe is going to make this *so* easy.
