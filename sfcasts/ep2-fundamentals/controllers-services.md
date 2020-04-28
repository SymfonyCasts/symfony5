# Controllers: Boring, Beautiful Services

Head back to our trusty controller: `src/Controller/QuestionController.php`.
It may be obvious, but it's worth mentioning that controllers are *also* services
that live in the container. Yep, they're good, old, normal boring services
that behave *just* like anything else. Well except that they have that one *extra*
superpower that no other service has: the ability to autowire arguments into its
methods. That normally *only* works for the constructor.

## Using bind in Controller Arguments

Open up `config/services.yaml`. A few minutes ago, we added this global "bind"
called `bool $isDebug`. Thanks to that, we can add a `bool $isDebug` argument
to the constructor of any service and Symfony will pass us this value. But can
we *also* add this argument to a controller method? Absolutely! In the controller,
add another with this name: `bool $isDebug`. I'll dump that down here.

Now, find you browser, go back to our show page, refresh and... that works wonderfully.

The point is: this ability to autowire arguments into a method is unique to
controllers, but it works *exactly* the same as normal, constructor autowiring.

## Constructor Injection

And because a controller is a normal, boring service, we can also use *normal*
dependency injection. Remove the `$isDebug` argument. Let's pretend that we want
to log something. This time, create a `public function __construct()` and give it
two arguments `LoggerInterface $logger` and `bool $isDebug`. Like last time, I'll
put my cursor on one of the arguments, hit Alt + Enter and go to "Initialize
properties" to create both of those properties and set them below.

Down in the `show()` method, we can say something like if `$this->isDebug`, then
`$this->logger->info()`:

> We are in debug mode!

If you refresh now, open the Profiler, and go to logs... there it is!

So... yeah! Controllers are normal services and, if you want to, you can
*entirely* use "normal" dependency injection through the constructor. Heck the
biggest reason that autowiring was added to the method was convenience. I
*usually* autowire into my methods, but if you need a service in *every* method,
using the constructor can help clean things up.

Next, let's talk about the *final* missing piece to configuration: environment
variables!
