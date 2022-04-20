# The All-Important FrameworkBundle Recipe

At your terminal, run:

```terminal
composer recipes
```

As you probably already know, whenever we install a new package, that package *may* come with a recipe that does things like add configuration files, modify things like `.env`, or add other files. Over time, Symfony makes updates to these recipes. Sometimes the updates are minor, like the addition of some comments in a config file. Other times, they're bigger, like renaming some configuration to match changes in Symfony itself. And while you don't *have* to update your recipes, it's a great way to keep your app looking like a standard Symfony app. It's also a free way to update code that might be deprecated.

Until recently, updating recipes was a pain. Just check our "Upgrade to Symfony 5" tutorial. *But* no more! Starting with Symfony Flex 1.18 or 2.1, composer has a proper recipes update command, which literally patches your files to the latest version. It's *awesome*. Let's try it!

Run:

```terminal
composer recipes:update
```

Oh! Before we run this, it tells us to commit everything that we've been working on. Great idea! I'll say that we are:

`upgrading some code to Symfony 5.4 with Rector`

Perfect! Let's try the `recipes:update` command again. The reason it wants our working copy to be clean is because it's about to patch some files.

Okay. We're going to start with `symfony/framework-bundle`, because this is the biggest one. I'll hit `4`, clear my screen, and go! Behind the scenes, this checks what the recipe looked like when we *originally* installed it, compares that to what the recipe looks like now, and generates a diff that it applies to your project. In some cases, like this, that can cause a conflict, which is pretty cool. And the best part might be that it generates a change log. If we need to dig to see why something changed, this is going to be your friend.

Creating the change log makes a bunch of API calls to GitHub, so it's *possible* that composer will ask you for a personal access token, like it just did for me. In some rare cases with a giant recipe like `framework-bundle`, if it's really, *really* old, You might get this message one time even if you *do* have an API token, because you're hitting the per minute maximum. And *there's* the change log. As I mentioned, `framework-bundle` is the most complex recipe, so it has a pretty huge change log. On a lot of terminals, you can actually click this link to jump directly into that PR, which will live up on `symfony/recipes`.

Alright, let's walk through the changes this made. I'm actually going to clear this change log and run:

```terminal
git status
```

You can see it made a *bunch* of changes on here, including three conflicts. Let's go through those first. Go over here and start with `.env`. If we look down here, apparently the recipe change *removed* these `#TRUSTED_PROXIES` and `#TRUSTED_HOSTS`. These are now set in a config file, and while you *could* still use environment variables if you wanted to, these two example environment variables just aren't shipped with the recipe anymore. I'm not sure why this has caused a conflict, but let's delete them.

The next conflict is up in `/config/services.yaml`. Excellent. This is a pretty easy one. This is *our* config and this is the *new* config. The recipe removed this `App\Controller\` entry here. That's because it wasn't needed unless you were getting super fancy with your controllers and creating controllers that don't extend `AbstractController`. It also looks like it reformatted this `exclude` key onto multiple lines, so let's take their config entirely.

The last conflict is in `src/Kernel.php`, where you can see that ours has a bunch of code in it and theirs has nothing in it.

Remember how I mentioned that `ConfigureRoutes` was moved into `MicroKernelTrait`? Well, it turns out that *all* of these methods were moved into `MicroKernelTrait`. So you can delete them unless you have some custom logic in one of those methods, which is pretty rare.

All right, back at the terminal, I'm going to add those three files now that we've fixed their conflicts. Run

```terminal
git status
```

and see what else this recipe did.

Okay, notice that it deleted `config/bootstrap.php` and modified `public/index.php`. Those are related. If I look at the diff of `index.php`, this file used to require `config/bootstrap.php` And its job was basically to read all the environment, variables and initialize them.

If you check up the *new* `public/index.php`... let's close a few folders here... you can see it now requires `vendor/autoload_runtime.php`. And the file is now super short and simple. What we're seeing here is the new Symfony runtime component in action. You can check out the blog post to get more information about it.

Basically, the job of booting up Symfony and loading all of the environment variables has been extracted to this runtime component. We don't *actually* have that component installed yet, which is why, if we try to refresh the page, we're going to get an error about *failing to open required autoload_runtime.php*.

To fix this, head over to your terminal and run:

```terminal
composer require symfony/runtime
```

This includes a Composer plugin, so it's going to ask us if we trust it. Go ahead and say "yes", and then it's going to install and explode when it tries to clear the cache. We're going to talk about *why* in a second, but it relates to upgrading the Symfony console recipe. If we try our site... it works! That's great, but now I want to look at what other files this recipe changed, because it's a *super* important recipe.

Here, you'll notice it deleted `config/packages/test/framework.yaml`, but *modified* `config/packages/framework.yaml`. This is probably the most common thing you'll see in the recipe updates.

Let's open `config/packages/framework.yaml`. At the bottom... we have a new `when@test` section. Starting in Symfony 5.3, you can now add environment-specific config using this syntax. What happened is this configuration *used to* live inside of `config/packages/test/framework.yaml`, but for simplicity, the recipe *deleted* that file and just moved that config to the *bottom* of this file.

Back on the terminal, let me grab that new file one more time, because it made two other small changes. Yep! The recipe also changed `http_method_override` to `false`. It's disabling a feature that you're probably not even using, and it *also* set this `storage_factory_id` to `session.storage.factory.native`. This has to do with how your session storage is made, so if you have some custom config here, you might need to play around with that a little bit.

If I run

```terminal
git status
```

again, speaking of environment-specific config, you can also do that same trick with routing files. See how it deleted `config/routes/dev/framework.yaml`, but *added* `config/routes/framework.yaml`? If we open up `config/routes/framework.yaml`, you can see it just has `when@dev` and it imports the routes that allow us to test our error pages. This is yet another example of it just moving a file configuration out of the environment directory into the main configuration file, just for simplicity.

Finally, the recipe added new `config/preload.php` file. This one is pretty simple, and it leverages PHP's preloading functionality. Essentially, on production of your site, if you point your `php.ini` setting of `opcache.preload` to this file, you'll get a free performance boost. It's *that* simple.

The only other thing you need to worry about is restarting your web server on every deploy or PHP FPM on each deploy. We use this at SymfonyCasts for a little extra boost.

Okay team! The biggest recipe update is *done*, so let's go ahead and commit all of these files. We're going to start moving a bit faster with the upcoming recipe updates. That's next.
