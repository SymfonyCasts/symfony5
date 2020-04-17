# Create Service

Coming soon...

Okay, so bundles give us services and services do work, so if we needed to write our
own custom code that did work, can we create our own service and put the logic there?
The answer is absolutely and it's something that you're going to do all the time.
It's also a great way to organize your code, be able to reuse logic and unit test
because as you'll see, we're going to take small chunks of code that do work and put
them into their own classes, so we actually are already doing some work. It doesn't
look like a lot here, but this logic here of actually parsing the markdown and using
the caching system. That's a little bit of work. It might be nice if we could remove
this from the controller and put it into its own class. That would probably make this
function a little easier to read. It would also allow us to reuse this markdown and
caching logic.

How do we do that anywhere in the `src/` directory, create a new class. It doesn't
matter where. I'm going to create a new sub directory called the `Service/`, which I
often do for classes that are services. Um, and I can't think of a better directory
to put them in. So down here I'll say new PHP class and let's call our new service.
How about `MarkdownHelper`? And notice that piece storm automatically audit completed
the correct namespace to put this inside of. Now this is our class. It has nothing to
do with Symfony. We don't need to extend anything. We can make this class live
however we want. So if we think about this, we're probably gonna want to function
call something like `parse()`. It will take an input. We'll take a `string` argument called
`$source` and it's going to ultimately return the `string`, which is going to be the HTML.

Cool. Now I'm going to go back into question controller and I'll copy this entire
three lines here that do the logic and paste it in. And to get started, instead of
setting that to a variable, we will return that. Now obviously I have some undefined
variables inside of here. Oh, and that's `md5()`. Uh, and then update `$questionText`
to `$source` in those three different places. Now I see I have a couple of undefined
variables in here, but I want you to ignore them. Ignore them for now because
congratulations, it may not work yet, but you just created your own service. A
service is nothing more than a class.

and that has one or more functions that do work. This does work. It parses markdown
into HTML.

How can we use this inside of our controller? Well, we already know that. Usually we
use type hints to get services into our uh, controller. But is this service already
inside Symfony's container? Let's find out. Let's run 

```terminal
php bin/console debug:autowiring Markdown
```

and let's search for markdown with a capital M. and you can see it only shows the two
from the bundle. But check this out. It says one more concrete service would be
displayed when adding the `--all` option. Let's try that `--all`. 

```terminal
php bin/console debug:autowiring Markdown --all
```

And there it is. So long story short, this command, this is not quite the full picture,
but basically this command a highest classes that are your own classes.

So that's why it didn't show this in the list. But if you've asked `--all` you
can see that it's telling you, yes, you can actually type in `MarkdownHelper` and
you're going to get an instance of your `MarkdownHelper`. So let's do that. I'm going
to go over to my controller and let's add a third, a fourth argument called down
`MarkdownHelper $markdownHelper`. And then down here we'll say 
`$parsedQuestionText = $markdownHelper->parse()` We'll pass it. `$questionText` 
And it's not going to quite work yet, but isn't that a lot cleaner? Really made 
our controller easier to read.

So what happens when we try it? No surprise, we get undefined variable coming from
our markdown helper. It's undefined variable cache. Okay. So instead of marked
markdown helper, we are using the cache service and the markdown parser service, but
we don't have access to those yet. So one thing I want you to understand is that we
have these service objects floating around, uh, the service object inside Symfony,
um, inside the container. But you can't just grab them out of thin air. There's no,
there's no way to cheat inside of this function and say Symfony magically give me the
cache object right now. There's only one way that we know of to get services from
Symfony and that is by auto wiring them into the arguments to our controller
functions.

So [inaudible]

what I'm about to show you is not actually the correct solution, but I want to take
things one step at a time knowing what we know. Now, one option is that we can
actually pass the markdown parser and cache from our controller into the `parse()`
function. So let's actually do that. I'm going to add two new arguments here.
`MarkdownParserInterface $markdownParser`, and then `CacheInterface` from 
`Symfony\Contracts`, `$cache` and good, just as simple as that. This is now happy. All the
variables are defined and in `QuestionController`, we're not going to need to pass
this `$markdownParser` and `$cache`. Cool, so let's see if that works. We've over
refreshed and it does. Now I mentioned this is not the final solution and here's why.
If you think about it, the markdown parser object and the cache object aren't really,

aren't really input to the parse function. What I mean is it made sense when we made
the parts function to make the `$source` in arguments. Of course you have to pass into
the source that you want parsed, but these next two arguments don't really control
how this function behaves. They're not really arguments that you would normally put
on a parse function. Instead, they're really dependencies that this service needs in
order to do its work. It's just stuff that needs to be available so that it can get
its job done. And for dependencies like this, for objects or configuration that your
service just needs in order to get his job done, instead of passing them through the
individual functions, we instead pass them through the constructor. So we're going to
create a new public function `__construct()`, and I'm actually going to move
those two arguments.

I will delete them from our function down there and move them up here. Now, first
thing I want you to know before I finish this is that auto wiring works in two places
in Symfony. It works in the construct method of your services and in the methods to
your controller and actually the construct method of your service. This is actually
the main place that auto wiring works is the main place it's supposed to work. It
also works. Uh, auto wiring also works on the methods of your, uh, controller, but
that's a special superpower only for your controller. So for example, we wouldn't,
uh, be able to put like `MarkdownParserInterface` here and expect Symfony to auto
wire that because we are the ones that are actually choosing what arguments to pass
to that function. So it's auto wiring works in the constructor. Now what are we going
to do with those arguments?

We're going to do is we're actually going to create two private properties for them,
`$markdownParser` and another private property called `$cache`. Then down here we're going
to say `$this->markdownParser = $markdownParser`. And `$this->cache = $cache`. So
we're doing is we're saying whenever, whenever we are instantiated and Symfony is
going to instantiate us, Symfony will pass us the markdown parser, the cache service.
All we're going to do in the construct method is just store them on a property. We're
not going to do anything else. Just put them on a property. So later when our code
then calls this parse function, we know that these two properties will hold those
objects. So we can use them down here, `$this->cache`, and then we don't need to pass
the `$markdownParser` to the `use` because down here we can say `$this->markdownParser`
that is now a perfect service. We've auto wire our dependencies to the constructor
and then use, set them on properties and then use them down below. So in 
`QuestionController`, we can remove these two arguments. They're not, they don't even exist
anymore.

And when we move over, it works.

If this didn't feel totally comfortable yet, don't worry. This process of creating
services is something that we're gonna do, uh, over and over again. But we now have
this beautiful new service, this new tool that we can use from anywhere in our
application. We pass it the markdown. We want eight takes care of the caching and the
markdown processing. We don't need to worry about it at all. So to celebrate in
`QuestionController`, we don't need to have these arguments anymore. Actually want to
delete the second and third argument. Look how simple it is. I even go up the top
here and oops, even though it doesn't hurt anything, I will delete those to you
statements.

Next, let's talk about something else. Maybe services.yaml. I'm not sure.

