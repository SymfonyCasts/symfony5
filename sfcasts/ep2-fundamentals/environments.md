# Environments

Coming soon...

Your application, the PHP code that you write is a machine. It does whatever work you
program it to do, but you can give that machine different configuration and make it
work in different ways. For example, during development you probably want to uh,
configure Symfonys logger to log everything, like log all levels of messages and in
fact that's how Symfonys lager is configured by default in dev. But on production
you'll probably want to pass configuration to your application that tells Symfony to
only log error messages so that your log files don't get really big to handle this
different idea of different sets of configuration. Symfony is a really important
concept called environments. This has nothing to do with like development versus
production. Environment in Symfony and environment is a set of configuration and by
default there are two environments. There's the development environment which has a
set of configuration that says log everything, show big exception pages, and then
there's a production, a prod environment, and that set of configuration says only log
EHRs. And if there is an air show, a boring air page and other things for
performance.

Okay,

you're going to actually see this inside the public /index dot PHP file. This is
actually the file that is being executed by our our web server.

Yeah,

and if you scroll down a little bit, most things aren't important in here. You're
going to see that down here and instantiates an object called a Colonel and passes
something called app underscore. In this, what you're seeing here is actually the use
this app on a score. M is set in this dotN file. You can see app_M = depth, so it's
Eagle, but that string depth, by the way, this entire file is all about environment
variables. That's a different topic that we're going to talk about in a little in a
little while. What we need to know now is that Symfony parses this, that end file,
and so when an instantiates shakes, this Colonel class is passing the string dev as
the first argument. That is what sets Symfony into the dev environment. If, if you
want to change your app into the prod environment, you'll just change this key here
and we'll do that in a few minutes. This Colonel class is actually not a core class
deep in the heart of Symfony. This is actually a class that lives in our code source
slash. Colonel that PHP.

Okay,

let's open that up. The kernel class is the heart of your application. You don't
actually look at it and do a lot of coding in it, but it is actually what ties
everything together. And if you think about it, a simply application is really sort
of three parts, first Symfonys to know what all of the bundles are that are in the
application. That's the job of register bundles. Then it needs to know what all of
these services are in the container. That's the job of configure container. And
finally it needs to know what all the routes are to your application. That's the job
of configure routes. So if we go up here,

the key that was passed when we instantiated this kernel, this depth string inside
the kernel class becomes the this->environment, uh, property. And so you can see what
registered bundles does is it actually opens up our config /bundles dot PHP file. So
I'll open up that and notice that all of these bundles actually have a little key
after here, like all true or some of them have dev true and things like test true.
What this is saying is what environments that bundle should be enabled in. Most
bundles are going to be enabled in all environments, but some like the debug bundle
or the web profiler bundle. Those are development only so they're only enabled any
dev environment and there's also an environment called test for automated tests are
registered bundles. Class takes care of that looping over all the bundles inside of
there and figuring out whether or not they should be enabled that based on the
environment.

So some bundles are just simply not enabled at all in the prod environment. That's
why we don't have the web debug toolbar or why we, why we won't have it in the prod
environment. And then how to configure a container. This, I love this function. This
function is what's responsible for loading all of our configuration inside of the
config directory. The first four lines here aren't that important. They're just
setting up a couple of low level things on there. But these last four lines are this
loader object is an object that's good at loading configuration files. And check this
out. It loads things from the config directory slash. Packages.

The curly braces aren't too important here. Slash. Star and then self config
extension. So /star if you'll get configuring sessions. This is dot PHP that XML dot.
EMR that YML. So basically what this first line is doing is it saying load every
single file that's in the config packages directory that ends in.yaml that XML or
dot. PHP. We're using Yammel config, but it's totally legal to rename these to dot.
PHP Symfony has a built in PHP configuration format, so this is actually what loads
all of our demo files inside of the config directory I mentioned a little while ago
that the names of these files aren't important. For example, cache.yaml does not have
a cache root key that doesn't line up with the file name and this is why the file
names, these files are important. So if we can just all of them and creates a big
array of configuration, we can rename all of these two totally different file names
and it would make no difference at all. Now the really important part I want to show
you is this next line. It then says load everything from SA config /packages /the
environment directory. So if we're in the dev environment, then loads these
configuration files. So these configuration files are only loaded in the dev
environment and this allows us to add different configuration based on the
environment.

For example, in the prod environment, as soon as a routing.yaml file is configured,
configures the router, it sets framework router strict requirements to null. That's
not important at all other than the strict requirements setting is a setting that
basically says if there's some problem generating it. Basically it tells the router
to be a little bit more polite and throw less errors in the production environment. I
need to explain that better. I'll close that file. So this whole idea of
environments, ultimately it's nothing more than just a fun little configuration trick
where as Symfony loads all the main configuration files and then loads other
configuration files from this subdirectory which can override the original ones.
Super dead simple way of having different configuration in different environments.
These last few lines here, the services and services_environment we'll talk about
later, we'll talk about a little bit later.

Okay.

And finally if you look down can configure routes. It does actually the exact same
thing. It says load all the files from config /routes. Let me pose that packages. So
it'll load this Yammer file here and that if you want, you can also have environment
specific overrides. So, and actually if you look at config routes, dev web
profile.yaml, these are the routing lines that are responsible for um, adding the
routes or the web profiler. So if I run in council diva router, these are the lines
that are responsible for the web debug toolbar and the profiler. So you can see those
are only loaded in the dev environment. So those routes won't even be available on
production. Thanks to this trick. All right, cool. So we have three different
environments, dev, dev, prod and test. So let's switch over to the prod environment
to see what it looks like. So I'll go to my dot and file here and I'm just going to
change this to Prague. That's simple. Now if I move over, wow. Don't show any of that
stuff.

Now if I move over and refresh, it works. Well actually it may or may not have worked
on your computer when you're in the prod environment. One of the properties of it is
that Symfony does not automatically rebuild your cache. So for example, even if this
work, now if I went and added a new route to my system and then tried to use it,
simply wouldn't see that new route because it's already using because it cause then
its route cache would be out of date. I need to explain that better. So actually
before you switch in, as soon as you ever want to switch into the prod environment,
what you need to do is change the environment, the prod and then move over here and
run bin console cache clear. That's going to tell somebody to rebuild the cache and
you can see that the bin console also reads the same app and flag so it knows that
we're now in the prod environment. So whenever you switch to prod environment makes
you clear the cache and really you're only going to do that normally when you go to
production. Now it will definitely work and notice on here, no web debug toolbar.

And to prove that the cache won't update, I'm actually going to go to templates
question show that H to my twig and let's see. Let's make a change inside of here. So
I'll take the question I'll put up.

Okay,

so the question, I'll put a colon on the end of it. So that's right here. When a
refresh, it's not there because the twig template itself is cached. But if we move
over and run our cache clear,

okay

and come back. There it is. So that's why you always rebuild your cache in
development. Now that we understand environments, I have a challenge for us. You
notice up here that we're still dumping the cache a service from inside of our
controller, and not surprisingly because we're in the, not surprisingly, it's using
the APCU adapter because that's what we configured inside of our config packages.
cache.yaml file.

Okay,

so using APCU is great, but maybe for simplicity, we just want to use the filesystem
when we're in development and we only want to use the APCU and we're in the
production environment, how could we do that? Well, think about it. We now know how
to override configuration in specific environments. We can override this one config D
in the dev environment only to do that in the dev directory. Let's create a new file
called cache.yaml. Inside of here we'll say framework cache app, and the name of the
original ID that we had was cacheed dot adapter. That filesystem,

it's just that simple

to prove it's working. I'm going to go over here and rebuild my cache just so I can
refresh the page here in prod and yep. In priding and see it's still using APCU
adapter in prod. Now let's go back over to art. That end file. This lives right at
the root of the project. Let's change back to the dev environment. Now, when we were
[inaudible]

fresh,

you see the dev environment, because we have the web people have to have our, the
dump goes down there. You can see we are using the filesystem adapter. So
environments already very, very powerful concept. But ultimately it's very simple.
It's all about just overriding configuration in different environments. Uh, next,
maybe we're creating our own service. Not sure. Sure.

