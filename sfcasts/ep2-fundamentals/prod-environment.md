# Controlling the prod Environment

Let's see what our app looks like if we change it to the `prod` environment.
Simple enough: open the `.env` file and change `APP_ENV` to `prod`.

## Clearing Cache in the prod Environment

Cool! Now find your browser, refresh and... it works! Well, actually, we got lucky.
Behind the scenes, when we load a page, Symfony caches configuration, templates and
other things for performance. In the `dev` environment, if we update a config file,
Symfony *automatically* knows to rebuild the cache. So, it's not something we really
need to even think about.

But in the `prod` environment - which is *primed* for performance - Symfony does *not*
automatically rebuild your cache files. For example, if we added a new route to
the system and tried to go to it in the `prod` environment, it would *not* be there!
Why? Because our app would be using an outdated cache file.

For this reason, *whenever* you change to the `prod` environment, you need to
find your terminal and run a special command:

```terminal
php bin/console cache:clear
```

This clears the cache so that, on our next reload, *new* cache will be built. The
cache is stored in a `var/cache/prod` directory. Oh, and notice that `bin/console`
is smart enough to know that we're no in the `prod` environment.

In practice, I *rarely* need to switch to the `prod` environment on my local computer.
And so I typically only run this `cache:clear` command when I'm deploying.

*Now* our app should *definitely* work. And notice: no web debug toolbar!

Let's see Symfony's automatic caching system in action. Open up
`templates/question/show.html.twig` and... let's make some small change - like a
`Question:`.

This time, when we refresh, the change is *not* there. That's because Symfony
caches Twig templates. Now find your terminal, run:

```terminal
php bin/console cache:clear
```

And come back to refresh. *Now* we see the change.

## Different Cache Adapter in prod

Now that we understand environments, I have a challenge for us! At the top of the
page, we're still dumping the cache service from inside our controller. The class
is `ApcuAdapter` because that's what we configured inside of
`config/packages/cache.yaml`.

APCu is great. But maybe for simplicity, since it requires you to have a PHP extension
installed, we want to use the filesystem adapter in the `dev` environment and
APCu only for the `prod` environment. How could we do that?

Let's think about it: we now know how to override configuration in specific
environments. So... we could override just this *one* config key in the `dev`
environment.

To do that, in the `dev/` directory, create a new file. It *technically* doesn't
matter what it's called, but because we value our sanity, call it `cache.yaml`.
Inside, say `framework:`, `cache:`, `app:` and the name of the original default
value for this: `cache.adapter.filesystem`,

That's... all we need! Let's see if it works! Because we're still in the `prod`
environment, find your terminal and clear the cache:

```terminal-silent
php bin/console cache:clear
```

And now go refresh the page. Good: in `prod` it's *still* using `ApcuAdapter`. Now
go find the `.env` file at the root of the project... and change `APP_ENV` back
to `dev`.

*Now* if we refresh... because the web debug toolbar is back, our dump is hiding
inside the target icon. Inside the `TraceableAdapter`... yes! It's `FilesystemAdapter`!

Now that we've mastered environments and configuring services that are coming
from bundles, let's do something wild: let's create our *own* service object!
