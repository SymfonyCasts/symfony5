# Controlling the prod Environment

Let's see what our app looks like if we change to the `prod` environment.
To do that, open the `.env` file and change `APP_ENV` to `prod`:

[[[ code('4efa9abc25') ]]]

## Clearing Cache in the prod Environment

Cool! Now, find your browser, refresh and... it works! Well, actually, we got lucky.
Behind the scenes, when we load a page, Symfony caches configuration, templates and
other things for performance. In the `dev` environment, if we *update* a config file,
Symfony *automatically* rebuilds the cache. So it's not something we even need
to think about.

But in the `prod` environment - which is *primed* for performance - Symfony does *not*
automatically rebuild your cache files. For example, if we added a new route to
our app and then went to that URL in the `prod` environment, it would give us a
page not found error! Why? Because our app would be using outdated routing cache.

That's why, *whenever* you change to the `prod` environment, you need to
find your terminal and run a special command:

```terminal
php bin/console cache:clear
```

This clears the cache so that, on our next reload, *new* cache will be built. The
cache is stored in a `var/cache/prod` directory. Oh, and notice that `bin/console`
is smart enough to know that we're in the `prod` environment.

In practice, I *rarely* switch to the `prod` environment on my local computer.
The most common time I run `cache:clear` is when I'm deploying.

*Now* our app *definitely* works. And notice: no web debug toolbar!

Let's see Symfony's automatic caching system in action. Open up
`templates/question/show.html.twig` and... let's make some small change - like
`Question:`:

[[[ code('a1830be13a') ]]]

This time, when we refresh, the change is *not* there. That's because Symfony
caches Twig templates. Now find your terminal, run:

```terminal
php bin/console cache:clear
```

And come back to refresh. There's the change!

## Different Cache Adapter in prod

Now that we understand environments, I have a challenge for us! At the top of the
page, we're still dumping the cache service inside our controller. The class
is `ApcuAdapter` because that's what we configured inside of
`config/packages/cache.yaml`:

[[[ code('eebd79d37e') ]]]

APCu is great. But maybe for simplicity, because it requires you to have a PHP
extension installed, we want to use the filesystem adapter in the `dev` environment
and APCu *only* for `prod`. How could we do that?

Let's think about it: we know how to override configuration in a specific
environment... so we *could* override just this *one* config key in the `dev`
environment.

To do that, in the `dev/` directory, create a new file. It *technically* doesn't
matter what it's called, but because we value our sanity, call it `cache.yaml`.
Inside, say `framework:`, `cache:`, `app:` and the name of the original default
value for this: `cache.adapter.filesystem`:

[[[ code('8c8d43e3e4') ]]]

That's... all we need! Let's see if it works! Because we're still in the `prod`
environment, find your terminal and clear the cache:

```terminal-silent
php bin/console cache:clear
```

When it finishes, go refresh the page. Good: in `prod` it's *still* using
`ApcuAdapter`. Now go find the `.env` file at the root of the project... change
`APP_ENV` back to `dev`:

[[[ code('325f656b0f') ]]]

And refresh the page.

Because the web debug toolbar is back, our dump is hiding inside its target icon.
Let's see... yes! It's `FilesystemAdapter`!

Ok team: we've mastered environments and configuring services that are coming
from bundles. So let's take things up to the next level: let's create our *own*
service objects! That's next.
