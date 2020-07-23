# Sluggable

Coming soon...

Whole point of the slug is to be a URL, safe version of the name. And ideally this
isn't something we should need to worry about setting manually. When we're coding in
a perfect world, I could set the name of a question save and something else would
automatically calculate a unique slug from the name. We've accomplished this in our
fixtures, but only there let's accomplish this everywhere to do that. We're going to
install another external bundle, Google for stof doctrine extensions bundle, and
find it's get up page and then actually click over to its documentation, which lives
on Symfony.com. This bundle gives you a bunch of super powers for your entities,
including one called sluggable. And actually this bundle is just a small layer around
another library called them doctrine extensions.

This is where the majority of the documentation lips. Anyways, let's get the bundle
installed. Find your terminal and run 

```terminal
composer require stof/doctrine-extensions-bundle
```

You would get the name of that from the documentation. Oh, interesting. This
time it stops and says the recipe for this package comes from the contribute
repository, which is open to community contributions. Review the recipe at this URL.
Do you want to execute this recipe? So in reality, recipes come from two
repositories. There is symfony/recipes, which is the main recipe repository. And
this is very closely guarded. That's hard to get any changes into this recipes, but
there's also another repository called recipes-contrib. And this is still guarded for
quality, but it's easier to get recipes put into this repository. So for that reason,
the first time you install a recipe that comes from this repository, uh, flex asks
you to make sure that you want to do that. So you can say yes or I'm actually gonna
say P for yes, permanently.

I committed my changes before recording recording. So when this finishes I'll run,

```terminal
git status
```

to see what this recipe did, it looks like it enabled the bundle. Of
course, it also added a new config file `stof_doctrine_extension.yaml`. Let's go
check that out. `config/packages/stof_doctrine_extension.yaml`. Okay, nothing too
interesting here yet. But as we saw this bundle comes with a bunch of special
functionality for entities. Each time you want to use a feature, you need to enable
it in this config file. The first behavior we want is sluggable to enable it add `orm:`
because we're using doctrine ORM, then `default:`, which means our default entity
manager.

You only need to worry about that being a different value if you have multiple and
then `slugable: true`, that's it? Well, this won't make any changes yet, but internally
the sluggable functionality is now active before we start using it. In question
factory, remove the code that sets the slug. I'll delete this logic, but kind of keep
an example function right there. Now temporarily, if we reload our fixtures with

```terminal
symfony console doctrine:fixtures:load
```

Yep. A huge air slug is not being set. The
doctrine extensions library works via annotations in the `Question` entity to tell the
library to automatically set the slug property, add `@Gedmo\Slug()`, make sure
to auto complete, do a lot of that to auto complete so that you get this use
statement. Uh, so you get the use statement for this annotation. This annotation has
one required option called `fields={}`, set that to `name` that's it. These slug will now
automatically be set right before saving to a URL safe version of the name property
back at the terminal. Try the fixtures now.

No errors. And on the home page. Yes, the slug looks perfect. We now never need to
worry about setting the slug manually. Again, internally this magic works by
leveraging doctrines event system or book system. Hmm. The invent system makes it
possible to run code at almost any point during the entity objects lifecycle.
Basically, if you need to, you can write code that will be called before any entity
object is inserted or after it's inserted, or right before it's updated. In many
other spots, we won't create our own Event Listener and this tutorial, but it is
something you can do next. Let's add two more fields to our entity `createdAt`, in
`updatedAt` the trick will be to automatically set created that when the entity is
first inserted and updated, that whenever it's updated and actually thanks to
doctrine extensions, you're going to love how easy this is.

