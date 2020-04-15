# Controllers Services

Coming soon...

Open up a source controller question controller. It may seem obvious at this point,
but controllers are also services that live in the container. They're good, normal
boring services though they do have one extra special power that no other service has
in the system. And that is that we can auto wire arguments to the method individual
controller methods in addition to the constructor, there's totally unique to
controllers, open up config services that Jamo and that auto wiring into the methods
works not only for services like markdown helper, but it also works for our global
binds like bull is debug. So for example, here we can add another argument called
Google is debug. I'll dump that down here and if we go over and go back to our show
page and refresh, that works just fine.

Okay,

so in controllers we can auto wire through our methods like this or as I mentioned,
we can also do it just like every other service. We can honor wires, either
constructor solid, remove that argument and let's do that. Let's pretend that we want
to log something inside this controller and we're going to inject it through the
constructor, so the public function underscore,_construct and let's add logger
interface logger and let's also do our bull is debug flag. Once again here, I'm going
to hit alt enter and go to initialize properties to create both of those properties
and set them below and now just like any other service, Symfony's going to when
Symfony and stage AIDS the controller, it's going to know what values to pass for
these two arguments. Sit down here and show. You can say something like if

okay,

this->is debug, then this air lager error info.

Okay,

we are in debug mode and is that easy? [inaudible] over refresh and I'll open the
profiler head down to logs and there it is. We are in debug mode.

Okay?

Yeah. Controllers are normal services and if you want it to, you can entirely do the
normal constructor auto wiring if you wanted to. The only reason that the method auto
wiring was added, the biggest reason was it's just kind of very convenient. You do a
lot of work in controllers. So Symfony added this extra superpower to controllers
only. I usually do my auto wire through my controller methods, but using the
constructor is just fine as well, and sometimes it's really good idea, like if you
needed lager service in many different, uh, methods inside of this controller, then
auto wiring through constructor is kind of convenient because then you can just use
it below anywhere you want. All right, next, let's talk about something else.

