# Markdown Bundle

Coming soon...

Fun fact, wizards love writing in markdown. I have no idea why wizard, which isn't
wizards, they just love the asterix and things have markdown. So we listen to our
customers. So we are going to allow the question text on each individual question to
be written in markdown. We're gonna focus on the show page right here.

So to do that, let's go over to our question controller and here is our show page.
And right now this renders showed that HTML tweaks. Let's open up that template and
find the question text. Scroll up here. Here we go. It's right. Another question. Tax
is actually just hard coded right into the template. In order to transform to
markdown, let's actually move that into our controller so we can do the work there.
So I'm going to copy this question text here, delete it, and go into my controller
and we'll make a new variable called question text and paste that in there. And we'll
pass this to the template as a new question. Text variable.

Perfect. Now back in show to H months week, I'll say curly curly question, text.
Awesome. And to make it a little bit interesting. Let's put in a little bit of
markdown. I'll find a durable and we will make that bold. All right, so if we try
this right now and refresh, no surprise, it's just printing out literally star star
adorable. So we still need to transform that and markdown. Now transforming texts
from markdown into HTML is clearly work and we know that all work in Symfony is done
by a service right now from bin console, debug auto wiring markdown, there's no
service in Symfony that we have that uh, can already transform things and markdown
and we're obviously not going to write one by hand. That would be crazy. We're going
to S so what we're going to do is install a new bundle that will give us a service
that can transform from markdown. So Google for canopy markdown bundle, it's fine and
get hub. This is a library that has a civil library that transforms markdown. And
let's just go down here and follow its instructions. So I'll copy of the composer
require line here, move over and paste.

Perfect installs the library. And you could see that it configured a bundle. I
configured a recipe, so if I say get status here, you can see that of course updated
the compose that JSON had to push that lock and the Symfony, that lock but it also
updated the config bundles that PHP, we talked about that last time, so you can see
here automatically initialize the bundle down the bottom. Now as we talked about, the
main purpose of bundles is that bundles give you services and services are tools. So
if we go back here and once again run debug auto wiring markdown. Now we show have
two services on here. Actually these are really the same service. This little blue
text here is the sort of an internal ID of the service. It's not really important but
you can see these are both actually different ways, different interfaces you can use
to get the same service so it doesn't really matter which one you use, but I'm going
to go back over here to the usage and you can see that they say to use the markdown
parser interface.

So let's do that. Let's go into our question controller and we will add an argument
here for that markdown parser interface, markdown parser. And then down here I'll
transform this by saying parsed question, taxed = markdown parser arrow. And we don't
even have to look up what method to use because the type is going to tell us that
this has a method called transform markdown. That sounds perfect. And we'll pass it
the question text and down here and now let's ask them the parsed question text into
our template. Love that. So now when we spin over refresh, it sort of works. It
actually dumps out raw HTML. The reason and the reason for that is awesome. If we
kind of open this up, you'll see that if I hit a, and it has HTML editor, you can see
it's actually dumping out the HTML entities for that. By default, a twig, um, output
escapes everything for security purposes. So when you don't want that to happen, you
can use a special tweak filter called raw. So pipe raw, it says don't output escape.
This is now in refresh. It works. And you can see it's a little subtle, but that is
now bold mission accomplished. By the way, this raw filter, you can look that up in a
couple different ways. Uh, you can look it up on the twig documentation itself, but
there's also a debugging mat for it.

Bin console, debug twig. How cool is that? So here you can see all the tests and the
long list of filters, functions, um, all the basic things that are in the system. So
down here we can see raw is right there, but Oh, check this out. Look, apparently
there's a filter called markdown. Let's go back over to the bundle here. I'm going to
search for pipe markdown. Yeah. And sure enough, this bundle apparently also gives us
a markdown filter.

And I remember everything in Symfony is done by a service. So even if you wanted to,
so even if one of the things you can do in toy use, you can add custom functions and
filters. But remember, everything in Symfony is done by service. So even if you add a
custom function or filter like markdown and it's actually done by a service behind
the scenes. So in addition to the markdown parser interface, a service that this
Bumble gave us and apparently also gave us a service, another service that added this
ability to have this markdown down filter, which is pretty cool. By the end of the
store aisle we're actually going to create our own custom filter so you'll see
exactly what those services look like. So this is great because our answers, um, we
would probably also want to parse those through down so we don't have to do it in the
controller because we can do it in a template. So I'm going to add like little ticks
around are perfectly here and then going to show .html.twig. Scroll down here to
where we iterate over our answers. And I'll here we can say clearly for the answer
pipe markdown.

Now if it's been over refresh, it works and you can see that it didn't escape it, it
works. And that filter is smart enough to tell its wake, to not escape it, which is
why it comes out instantly. Good. All right. Next, let's use some more services
instead of Symfony. Next, we're going to use a service that's already built into
Symfony called the cache service to make sure that we're not parsing marked on an
every single request, which could get a little bit slow.

