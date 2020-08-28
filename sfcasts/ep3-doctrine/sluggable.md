# Sluggable: Doctrine Extensions

The whole point of the `slug` is to be a URL-safe version of the `name`. And,
ideally, this wouldn't be something we need to set manually... or even think about!
In a perfect world, we would be able to set the name of a `Question`, save and
something *else* would automatically calculate a unique `slug` from the `name` right
before the INSERT query.

We accomplished this in our fixtures, but *only* there. Let's accomplish this
*everywhere*.

## Hello StofDoctrineExtensionsBundle

To do that, we're going to install another bundle. Google for
StofDoctrineExtensionsBundle and find its GitHub page. And then click
over to its documentation, which lives on Symfony.com. This bundle gives you a
*bunch* of superpowers for entities, including one called Sluggable. And
actually, the bundle is just a tiny layer around *another* library called
[doctrine extensions](https://github.com/Atlantic18/DoctrineExtensions).

This is where the majority of the documentation lives. Anyways, let's get the bundle
installed. Find your terminal and run:

```terminal
composer require stof/doctrine-extensions-bundle
```
You can find this command in the bundle's documentation.

## Contrib Recipes

And, oh, interesting! The install stops and says:

> The recipe for this package comes from the contrib repository, which is open
> to community contributions. Review the recipe at this URL.
> Do you want to execute this recipe?

When you install a package, Symfony Flex looks for a *recipe* for that package...
and recipes can live in one of *two* different repositories. The first is
[symfony/recipes](https://github.com/symfony/recipes), which is the main recipe
repository and is closely guarded: it's hard to get recipes accepted here.

The other repository is called
[symfony/recipes-contrib](https://github.com/symfony/recipes-contrib). This is still
guarded for quality... but it's much easier to get recipe accepted here. For that
reason, the first time you install a recipe from `recipes-contrib`, Flex asks
you to make sure that you want to do that. So you can say yes or I'm actually going
to  say P for yes, permanently.

I committed my changes before recording recording, so when this finishes I'll run,

```terminal
git status
```

to see what the recipe did! Ok: it enabled the bundle - of course - and it also
added a new config file `stof_doctrine_extensions.yaml`. Let's go check that out:
`config/packages/stof_doctrine_extensions.yaml`.

[[[ code('27fbe03292') ]]]

Ok... nothing too interesting yet.

## Activating Sluggable in Config

As we saw, this bundle comes with a *bunch* of special features for entities.
And each time you want to use a feature, you need to enable it in this config file.
The first behavior we want is sluggable. To enable it add `orm:` - because we're
using the Doctrine ORM:

[[[ code('0f6bddc0be') ]]]

and then `default:`, because we want to enable this on our *default* entity manager. 
That's... really not important except in edge cases where you have multiple 
database connections. 

[[[ code('a4986e86e6') ]]]

Then, `sluggable: true`.

[[[ code('82cb5aacdb') ]]]

That's it! Well... sort of. This won't make any *real* difference in our app yet.
But, internally, the sluggable feature *is* now active.

Before we start using it, in `QuestionFactory`, remove the code that sets the slug.
I'll delete this logic, but keep an example function for later.

[[[ code('1feac3f2cd') ]]]

Now, temporarily, if we reload our fixtures with:

```terminal
symfony console doctrine:fixtures:load
```

Yep! A huge error because `slug` is not being set.

## The `@Gedmo\Slug` Annotation

So how do we tell the Doctrine extensions library that we want the `slug` property
to be set automatically? The library works via annotations. In the `Question`
entity, above the `slug` property, add `@Gedmo\Slug()` - making sure to autocomplete
this so that PhpStorm adds the `use` statement for this annotation.

The `@Gedmo\Slug` annotation has one required option called `fields={}`. Set it to
`name`.

[[[ code('8223030ea4') ]]]

Done! The `slug` will now be automatically set right before saving to a URL-safe
version of the `name` property.

Back at the terminal, try the fixtures now:

```terminal-silent
symfony console doctrine:fixtures:load
```

No errors! And on the homepage... yes! The slug looks perfect. We now *never* need
to worry about setting the slug manually.

## Doctrine's Event System

Internally, this magic works by leveraging Doctrine's *event* or "hook"
system. The event system makes it possible to run custom code at almost *any*
point during the "lifecycle" of an entity. Basically, you can run custom code
right before or after an entity is inserted or updated, right after an entity
is queried for or other times. You do this by creating an event subscriber or
entity listener. We *do* have an example of an entity listener in our
[API Platform tutorial](https://symfonycasts.com/screencast/api-platform-security/entity-listener) if you're interested.

Next, let's add two more handy fields to our entity: `createdAt` and `updatedAt`.
The trick will be to have something automatically set `createdAt` when the entity
is first inserted and `updatedAt` whenever it's updated. Thanks to
Doctrine extensions, you're going to love how easy this is.
