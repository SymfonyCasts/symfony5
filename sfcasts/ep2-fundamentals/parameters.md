# Parameters

Coming soon...

Okay, so we know that there are lots of these useful service objects floating around
and Symfony and SyFy keeps them inside. Something called a container, which isn't
that important of a detail, but this container also holds. One other thing,

it's a little bit less important, but the container also is also able to hold a
scalar configuration values called parameters. And you can use these to do some
pretty cool stuff. So if remember from earlier, if you want to get a list of all of
the services in the container, you can run `debug:container`. 

```terminal-silent
php bin/console debug:container
```

Boom, there's our big
list. If you want to see a list of all the parameters in the system, it's add a
`--parameters` flag. 

```terminal-silent
php bin/console debug:container --parameters
```

And you can see there's a bunch of them. And for the most part,
a lot of these aren't really important. You don't need to worry about them. They're
used internally. But for example, there's something called `kernel.charset`,
which has that our kernel is using `UTF-8` and that's used in various places
internally. So there are scalar config inside of the container and often it's useful
to add your own configuration. And I'll show you an example. So first if we want to
add a new parameter, how do we do it? The answer to that question is to go into any
configuration file inside of `config/packages/` in any configuration file. Let's do
`cache.yaml` cause we're going to do a little cacheing trick and add a key called
`parameters`. So the framework key here means we're configuring the framework bundle,
but `parameters` is a special key, which says we're adding a parameter to the
container. I'm gonna invent a new one called `cache_adapter`. I'm totally inventing
that name and I'm going to set it to `cache.adapter.apcu`.

No, we're not actually using this yet. The end result of this right now is that we
have a new parameter in our container call called `cache_adapter`, but we're not using
it anywhere yet. It's just a new thing. We haven't container good for us. It's not
doing anything. Now we can read this parameter out in two different ways. The first
is that you can read it, for example, in a controller. So if I've got a 
`src/Controller/QuestionController.php` and find my `show()` action here and let's do a `dump()`.
And we use a PR, a shortcut in here called `$this->getParameter()` here we can say
`cache_adapter`.

so if I go over and refresh the show page, Oh there it is. That gives me the 
`cache.adapter.apcu` string.

But this is actually not the most common way to use parameters. The most common way
to use parameters is to specify a parameter in a configuration file and then
reference it in a configuration file. These parameters sort of work like variables
inside of the configuration file. Once you've set a parameter, you can reference that
parameter from any other configuration file by using a special format. So for
example, since uh, down here for, instead of having the cast on it after APCU, I'm
going to reference it, that parameter up there where we do that is by having quotes
and saying `'%cache_adapter%'`. And that's it. As soon as I go over and
refresh, no airs because it's still working exactly the same way. So the key thing
you hear is when you surround something by `%` signs, somebody realizes that you
are referencing eight parameter. And I also put these around with double quotes
around them. That's just a Yammel thing. If you have a stream that starts with a
percent sign, then you're supposed to have quotes around it. For the most part in
yamble, you don't need quotes, but if you're ever not sure, add quotes and it will
definitely make, make things work.

So yeah, this is how we set a parameter and this is how we reference the parameter.
This isn't anything too special. We're effectively setting a variable up here and
using it down there, which is fine I guess, but not really that useful yet. But now
that we understand parameters, we can use this system to do our cache override in a
more intelligent way as a reminder in `dev/cache.yaml` we're overriding
the framework cache app in the development environment to be `cache.adapter.filesystem`

Now we're going to do is instead of overriding that config, let's just override that
parameter. So I'll say `parameters:` and then I will use the same parameter name as as
the other file `cache_adapter:` and set that to
`cache.adapter.filesystem`. So we're doing here is in our main cache
diameter file. We're rough. We're setting the app key here to whatever the final
value of cache adapter is. Of course, initially the cache adapter is going to be set
to APCU, but then when this development override is loaded, it's going to override
that parameter instead of the filesystem. We can see this over here when we run 

```terminal
php bin/console debug:container --parameters
```

boom, `cache.adapter.filesystem`. And there's
a little trick with commands. We can actually pass a `--env=prod` and run
that same command in the production environment. 

```terminal-silent
php bin/console debug:container --parameters --env=prod
```

And you can see it's `cache.adapter.apcu`
so cool. So by using this parameters, we simplified this configuration just
a little bit. Now as we saw these parameters are something that's great.

No. Typically

all the config that we put into the config packages directory completely by
convention, our configuration to configure other bundles like the `FrameworkBundle` or
the `TwigBundle`, but parameters are kind of a global thing for your container. So we
don't typically put them inside of a config and can `config/packages` instead. There's
actually a file inside of the `config/` directory itself called `services.yaml`. We
haven't talked about this file yet. We're going to talk more about it soon, but this
is basically configuration for your SERP. Um, this is basically a file where you
configure the services in your application so you're not configuring third party
services, you're actually controlling your own services and so it's usually more
appropriate to actually, if you want, if you do want to set a custom parameter to set
this in your `services.yaml` file, of course it makes no difference because you'll
remember all of these `services.yaml` and all of these `config/packages/`, files,
Symfony loads them all at the same time and the file names aren't important at all.

so we can move this parameters in any file and it would work exactly the same.

Of course, you might not be wondering. Okay, well how do we move the parameter that's
in the `config/packages/dev/cache.yaml` well, if you remember the fi, the class
responsible for loading all these Yammel files as `src/kernel.php`. And as you
remember, it loads all of the con Yammel files in the `packages/` directory, then all
the ammo files and `packages/` the environment, and then it loads `services.yaml` and
that's what this line he is here. And then there's one more. It actually under loads
loads loads if it finds one AE `services_` the environment. So in the develop
development environment, Sydney actually looks for a `services_dev.yaml` so if
you want to override a parameter in just the development environment, that's how you
do it. So I'm gonna create a new file here called `services_dev.yaml`.

And then take this configuration from my `cache.yaml` move it in there and then I'll
close that file cause I'm actually going to refactor.

delete that file. So if you look the whole setup now we set the `cache_adapter`
parameter in `services.yaml`. We override it in the development environment only
to a different value. And then we referenced that inside of our `cache.yaml` file
using the  `%cache_adapter%`  right here to prove the whole thing works.
Let's actually go over into our service markdown helper and I'll actually `dump()` the
`$cache`, uh, object right here. And since we're in the development environment now when
refresh, we expect this to be the filesystem cache and it is. So let's go back and
remove that `dump()`. So don't overcomplicate parameters. Parameters are just simple,
random key value pairs that you can create when they're helpful. They're basically
like variables inside of your container and they're handy because you can reference
them in other files like this or even override them. Next, we're actually going to
use a built in parameter to disable caching in the development environment.

