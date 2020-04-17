# Service Config

Coming soon...

About your terminal and run that 

```terminal
php bin/console debug:container --parameters
```

As I mentioned, most of the things in here are real low level parameters that are used by
different core parts of the system, but there are a set of them that start with
`kernel.` These are special things that were added by Symfony itself, but several
of them are useful. Like for example, if you for some reason needed to figure out
what the environment was, there's one called `kernel.environment`. Another super
common one is called `kernel.project_dir`. So if you ever needed to uh, form a path relative
to your project directory, you could reference this parameter, `%kernel.project_dir%/`
 and then the path to something in your project. But what I'm
really interested right now is `kernel.debug` currently set to true. Basically when
you're in the development environment, this is set to true when you're in the prod
environment, and this is set to false. So it's basically a flag on whether or not we
are in debug mode or not in debug mode. I want to see if I can use that to disable
caching entirely inside of my markdown helper. So basically if we are in debug mode,
we are not going to cache at all. We're going to parse the markdown every single
time, maybe because that makes debugging easier.

So if you think about it in the same way that this class needs the `MarkdownParserInterface`
and the `CacheInterface` to do its job, it also needs to know whether or not we're in
debug mode. So usually when you make a `__construct()` function for a service, you're going
to pass in a other services as dependencies, but occasionally you're actually going
to need configuration like is debug true or false or maybe an API key or some other
configuration that your service is going to use. So I'm going to add a new argument
here called `bool $isDebug`. And then I'm going to add another property. `private $isDebug`
And down here I will assign that property. `$this->isDebug = $isDebug`
And then down here we'll basically say if `$this->isDebug`, then I'll
actually just go copy that return statement down from down below. We're just going to
return the markdown immediately. Now, so far, every time we add an argument to a
constructor, Symfony knows what the passenger thinks to autowiring. Do you think
it's going to know what to pass for this flight here? Go over and refresh. The answer
is

that I have ACE index air.

Come on Ryan. Okay, drum roll. The answer is no. Symfony does not know what to pass.
This it says can not resolve argument. `$markdownHelper` of `QuestionController::show()`
show, that's actually kind of showing what controllers calling it. The real air is
here. Cannot auto wire service markdown helper argument is debug of method. Construct
is type hinted bull. You should configure its value explicitly. So the auto wiring
only works for class or interface type ins. You can't expect Symfony to magically
gasp what value we want for this argument here just because we have a bul type hint,
it doesn't work that way. It's not that magic and that's great. So this is the first
example where we have an argument to a constructor that's not auto. Why Arabelle and
when this happens, it's no problem. What you need to do is you need to hint to
Symfony what value you want for this argument.

It can still guess the other arguments, but it needs to know what value you want to
pass for `$isDebug`. We do that in that `config/services.yaml` file that we were just
talking about. Remember, the purpose of this file is for us to configure these
services in our application, the services in our `src/` directory. So there's a bunch
of [inaudible] and you notice there's a `services:` key here. This is where we actually
explicitly configure our services and there's already a bunch of stuff in here that I
want you to ignore for not. We're going to talk about what all this stuff is doing
shortly. It is important. I want you to go down all the way down to the file, go in
four spaces so that you are below the services and here we're going to type the class
name to our service. So `App\Service\MarkdownHelper`. And then below this we can
pass configuration to help Symfony know how to instantiate that object. So we can do
this, we can say `arguments:`.

And then we can put the name of the arguments. So quite literally this argument is
called `$isDebug`. So down here we can say `$isDebug:` . And then for now let's just
say true and that's it. That will tell something, what's a pass for that one
argument? And it will keep auto wiring the other arguments. So when we refresh it
works.

And actually do really make sure that this is working. Let's go in here and 
`dump($isDebug)` flag. I'll go back and refresh again and there we go. Yep, he's
debug. Set to true.

So that's the, that is the way that you, of course, we don't really want true here,
right? We want to reference this `kernel.debug` parameter. No problem. We know
how to do that. But quotes here say `%kernel.debug%` percent that easy. Go
back and refresh and you can see that it is true. And just to see how this works.
Let's go down here to our `.env` file change our environment real quick to prod.
Remember after you switch to the prod environment, we need to do a `cache:clear`. 

```terminal-silent
php bin/console cache:clear
```

Then
we move over and refresh. Yep. You can see up here it is printing false cause we are
not in debug mode. Pretty cool so let's change that environment back to dev. So
that's it by saying

by saying the class of the service down here, which is also the idea of the service
and the container and arguments, we can specify exactly which argument we want.
There's one other key that I want to talk about and there's several other ways that
you can configure services that are not important right now, but one thing you can do
on down here is instead of arguments you can type `bind:` and if you go over and refresh
that makes no difference at all. The difference between bind and arguments is very
subtle. When you have arguments it says that this `$isDebug` argument to the
constructor should have this value bind. It's very subtle and I'm not going to go
into the details right now except to say that bind also applies to something called
method calls, which is something that we're not using right now and is not that
common, but I usually prefer having bind. All right. Next, I want to demystify what
this file is doing up here so we can really understand how services are being added
to the container. That's next. [inaudible].

