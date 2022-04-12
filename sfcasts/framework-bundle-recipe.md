# The All-Important FrameworkBundle Recipe

Coming soon...

At your terminal run composer recipes, as you probably know, whenever we install a
new package, that package may come with a recipe that does things like ad
configuration files, modify things like.N or add other files over time. Symfony makes
updates to these file to these recipes. Sometimes these are minor like the addition
of some comments in a config file. Other times they're bigger, like renaming, some
configuration to match changes in Symfony itself. <affirmative>. And while you don't
have to update your recipes, it's a great way to keep your app looking like a
standard Symfony app. And it's also a free way to update code that might be
deprecated, But until recently, updating recipes was a pain. Just check our upgrade
to Symfony five tutorial, but no more starting with Symfony flex one 18 or two, one
composer has a proper recipes update command, which literally patches your files to
the latest version. It's awesome. Let's try it. Run composer recipes update. Oh,
Before we run this, it tells us to commit everything that we've been working on.
Great idea. I'll say that we are upgrading some code to 25.4 with rector. Perfect.
Let's try the recipes updated command again. The reason it wants our working copy to
be clean is that it's about to patch some files.

Okay. We're going to start with Symfony /framework, extra bundle, cuz this is the
biggest one. So I'll hit full, Clear my screen and go behind the scenes. This checks
what the recipe look like when we originally installed it compares that to how the
recipe looks now and generates a diff that it applies to your project in some, in
cases like this, That can even cause a conflict, which is pretty cool. And maybe the
best part is that generates a change log. If we need to dig to see why something
changed, this is going to be your friend. Now creating the change log makes a of API
calls the GitHub. So it's possible that composer will ask you for a personal access
token. Like it just did for me, In some rare cases with a giant recipe like framework
bundle. If it's really, really old, You might hit this message. One time am. Even if
you do have an API token, because you're hitting the per minute maximum And there is
the change lock. So as I mentioned, framework bundles, the most complic complex
recipe. So it has a pretty huge change lock on a lot of terminals. You can actually
hold, you can actually click this link to jump directly to that PR, which will live
up on Symfony /recipes. Revok

Anyways, let's walk through what changes this made. I'm actually going to clear this
change log and run get status. So it made a bunch of changes on here, including three
conflicts. Let's go through those first. So let's go over here and start with.N. So
if we look down here, apparently the recipe change to move these two trusted, proxies
and trusted hosts. These are now set via a, in a config file while you could still
use environment variables. If you wanted to there these two example environment
variables just aren't shipped with a rescue anymore. I'm not sure why this, why, why
this caused a conflict, but let's delete them. Next conflict is up in config services
YAML. Excellent. So this is a pretty easy one. This is our config and this is the new
config. The recipe remove this app /controller entry here That's because it wasn't
needed unless you were getting super fancy with your controllers and creating
controllers that don't extend abstract controller. And then it also looks like it
kind of reformed this exclude Kia onto multiple lines. So let's take their config
entirely. Then the last con conflict is in source /kernel.PHP, where you can see that
they, ours has a bunch of COVID and theirs has nothing in it.

Remember how config I mentioned that configure routes was moved into microkernel
trait? Well, it turns out that all of these methods were moved into microkernel
trait. So let's delete. So delete them unless you have some custom logic in one of
those methods, which is pretty rare. All right, back at the terminal, I'm going to
add those three files. Now that we've fixed their conflicts And let's run, get status
and see what else this recipe did. Okay. Notice that it deleted config /bootstrap PHP
and modified public /index.PHP. Those are related. So if I look at the diff Of index
PHP, this file used to require config /bootstrap.PHP And its job. If I Did that file
And its job was basically to read all the environment, variables, initialize the
environment, vari and initialize the environment variables.

Well,

If you check up the new public /index at PHP Close in folders, there it is. And now
requires a vendor /autoload runtime.PHP. And the file is now super short and simple.
What we're seeing here is the new Symfony runtime component in action. And you can
check out the blog post to get more information about it. Basically the runtime
components Job Is to load all the environment variables, Basically the job of booting
up Symfony and loading. All the environment. Variables has been extracted to this
runtime component. We don't actually have that component installed yet, Which is why.
If we try to refresh the page, we are going to get a horrible error about failing to
require auto load_runtime, PHP to fix this head every to terminal head run composer
require Symfony /runtime. This includes a composer plugin. So it's going to ask us if
we trust it, go ahead and say yes, And then it's going to install and it will explode
When it tries to clear the cache. We're going to talk about why in a second, it
relates to upgrading the Symfony console recipe, But if we try our site,

It works Okay. But I want to look at what other files this recipe changed. Cause
it's, it's just a super important recipe. Okay? Notice it, it deleted config
packages, test /framework, do Yael, but modified config packages framework do This is
probably the most common thing you'll see in the recipe updates. Let's open config
packages, framework.YAML at the bottom. Notice a new when at test section,

Starting

In Symfony 5.3, you can now put environment specific config Using this syntax. So
what happened is this configuration used to live inside of config packages, test
/framework Amal, but for simplicity, the recipe deleted that file and just move that
config to the bottom of this file. Oh, but back on the terminal, let me just dip that
file. That new file one more time. Cause it made two other small changes. Yep. The
recipe also changed HD method override to false. It saing a feature that you're
probably not even using. And it also set this storage factory ID to session storage,
factory native. This is a configuration key that used to be called. I need to double
check this storage ID and it has to do with how your session storage is made. It's
now changed to storage factory ID. So if you have some custom config here, you might
need to, uh, play with that a little bit. Oh. And if I run get status again, speaking
of environment specific config, you can also do that same trick with routing files.
So check this, see how it deleted config routes, dev framework, di Yamo, but added a
config routes framework Yael. So if we open up config routes framework yamal you can
see it just has when at dev and it imports the routes that allow us to test our error
pages. So another example of it just moving, uh, a file configuration out of the
environment directory into the main configuration file, just for simplicity.

Finally, the recipe added new Config /preload PHP file. This one is pretty simple And
it leverages PHP. PHPs preloading functionality basically on production of your site.
If you, you point your PHP.I and I setting of opt cache.preload to this file, You'll
get a free performance boost. That's that simple. The only other thing you need to
worry about is restarting your web server on every deploy or PHP FPM on each deploy.
We use this on Symfony cast for a little extra boost. Okay. Team. The biggest recipe
update is done. So let's Add all of these files. I'll commit them And then Move on.
We're going to start moving a bit faster with the next recipe updates next.

