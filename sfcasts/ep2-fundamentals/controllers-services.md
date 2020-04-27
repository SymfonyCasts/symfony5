# Controllers: Boring, Beautiful Services

Head back to our trusty controller class: `src/Controller/QuestionController.php`.
It may be obvious at this point, but controllers are *also* services that live in
the container. Yep, they're good, normal boring services that behave *just* like
anything else. Well, that's true - except that they *do* have one superpower that
no other service has: the ability to autowire arguments to the individual methods.
That normally *only* works for the constructor.

## Using bind in Controller Arguments

Open up `config/services.yaml`. A few minutes ago, we added this global "bind"
called `$isDebug`. We know we can autowire *services* into our controller arguments,
but can we *also* get this value? Absolutely! In the controller, add another
argument called `bool $isDebug`. I'll dump that down here.

Now, find you browser, go back to our show page, refresh and... that works fine.

The point is: this ability to autowire arguments into a method is unique to
controllers, but it works *exactly* the same as normal, constructor autowiring...
which is cool, because being able to grab services or bound values like this is
super easy.

## Constructor Injection

But because a controller is a normal, boring service, we *can* also use *normal*
dependency injection. Remove the `$isDebug` argument. Let's pretend that we want
to log something inside this controller. This time, create a
`public function __construct()` and give it two arguments `LoggerInterface $logger`
and `bool $isDebug` flag. Like last time, with my cursor on one of the arguments,
I'll hit Alt + Enter and go to "Initialize properties" to create both of those
properties and set them below.

And now - just like *any* other service - when Symfony instantiates our controller,
it will know what values to pass for these two arguments. Down in the `show()`
method, we can say something like if `$this->isDebug`, then `$this->logger->info()`:

> We are in debug mode!

If you refresh now, open the Profiler, and go to logs... there it is!

So... yeah! Controllers are normal services and, if you want it to, you can
*entirely* use "normal" dependency injection through the constructor. Heck the
biggest reason that autowiring was added to the method was convenience. I
*usually* autowire into my methods, but if you need a service in *every* method,
using the constructor can help clean things up.

Next, let's talk about the *final* missing piece to configuration: environment
variables!
