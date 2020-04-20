# Controlling the prod Environment

Coming soon...

All right, cool. So we have three different
environments, dev, `dev`, `prod` and `test`. So let's switch over to the prod environment
to see what it looks like. So I'll go to my `.env` file here and I'm just going to
change this to `prod`. That's simple. Now if I move over, wow. Don't show any of that
stuff.

Now if I move over and refresh, it works. Well actually it may or may not have worked
on your computer when you're in the prod environment. One of the properties of it is
that Symfony does not automatically rebuild your cache. So for example, even if this
work, now if I went and added a new route to my system and then tried to use it,
simply wouldn't see that new route because it's already using because it cause then
its route cache would be out of date. I need to explain that better. So actually
before you switch in, as soon as you ever want to switch into the prod environment,
what you need to do is change the environment, the prod and then move over here and
run

```terminal
php bin/console cache:clear
```

That's going to tell somebody to rebuild the cache and
you can see that the bin console also reads the same app and flag so it knows that
we're now in the prod environment. So whenever you switch to prod environment makes
you clear the cache and really you're only going to do that normally when you go to
production. Now it will definitely work and notice on here, no web debug toolbar.

And to prove that the cache won't update, I'm actually going to go to
`templates/question/show.html.twig` and let's see. Let's make a change inside of here. So
I'll take the question I'll put up.

so the question, I'll put a colon on the end of it. So that's right here. When a
refresh, it's not there because the twig template itself is cached. But if we move
over and run our

```terminal
php bin/console cache:clear
```

and come back. There it is. So that's why you always rebuild your cache in
development. Now that we understand environments, I have a challenge for us. You
notice up here that we're still dumping the cache a service from inside of our
controller, and not surprisingly because we're in the, not surprisingly, it's using
the APCU adapter because that's what we configured inside of our
`config/packages/cache.yaml` file.

so using APCU is great, but maybe for simplicity, we just want to use the filesystem
when we're in development and we only want to use the APCU and we're in the
production environment, how could we do that? Well, think about it. We now know how
to override configuration in specific environments. We can override this one config D
in the dev environment only to do that in the `dev/` directory. Let's create a new file
called `cache.yaml`. Inside of here we'll say `framework:`, `cache:`, `app:`, and the name of the
original ID that we had was `cache.adapter.filesystem`,

it's just that simple

to prove it's working. I'm going to go over here and rebuild my cache just so I can
refresh the page here in prod and yep. In priding and see it's still using APCU
adapter in prod. Now let's go back over to our `.env` file. This lives right at
the root of the project. Let's change back to the dev environment. Now, when we were

fresh,

you see the dev environment, because we have the web people have to have our, the
dump goes down there. You can see we are using the `FilesystemAdapter`. So
environments already very, very powerful concept. But ultimately it's very simple.
It's all about just overriding configuration in different environments. Uh, next,
maybe we're creating our own service. Not sure. Sure.

