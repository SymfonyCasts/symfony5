# Bundle Config

Coming soon...

Ms controller, we're using two services, one markdown parser interface from a Pando
installed and cache interface from Symfony itself. And this is great because we're
very easily just grabbing tools and using them down here. But I'm starting to wonder
how can I change the behavior of these? Like what if I want to cache to Reddis
instead of the filesystem or maybe there are some ways that I can tweak the markdown
parser service down here. Let's D D for dumping by a markdown parser to see what that
actually is. So if we go over and refresh the show page, we can say this is actually
an instance of some class called max. Okay. And apparently it has an array called
features where you can turn certain features on and off. So just as a challenge

[inaudible]

in general, it looks like there's a lot of configuration to this specific class. And
if we did want to change one of these configuration options, we can't really do that
right now. How can we control the options that are passed to this? Because we're not
responsible for creating this object. The bundle is, well, the answer to that on a
high level is that every bundle allows you to pass configuration to it to describe
where you can tell it different. You can describe,

yeah,

different functionality that you want the services from that bundle to GIF. That's a
terrible explanation. So check this out. Uh, if you look in config bundles, that PHP,
you see this last part of each bundle bundle class name, that's actually the name of
the bundle internally. So I'm going to copy KMP markdown bundle, close this file and
spin over and I'm gonna run a special command called the bin console config dump KNP
markdown bundle and boom. This gives us a big example Yammel of all of the
configuration that this bundle provides. And apparently there's some option called
parser. Would you sit down to markdown dot parser dot max? I don't really know what
that means, but apparently you can configure the in some way. And if you go back and
look at the documentation of this bundle and search for a parser, but down here
actually let's search for parser colon. There we go. Yup. You can see it talks about
kind of the same thing and flip down here. It actually tells you different values
that you can place for that. A parser option plus copy this marked dot parser dot
light just to see if we can configure this.

Now, if you go back and look at the, the documentation here, the way that you're
actually configure this as a VA Yammel file, you're going to have, this can be
markdown key than a parser key than a service key. Where should this file live? The
answer is that because we're configuring the KV_markdown key here, we're going to go
into config packages. There's already a number of files in here and create a new file
called came P_markdown .yaml. Inside of here we'll put the Campion markdown key and
then we need a parser key parser service and then I'm going to paste that markdown
dot parser, that light now. Now just as a hint, as I mentioned, I need this file came
here,_marked on.yaml to match this case_markdown key here. That's actually not
required. We'll talk more about later. We do it for sanity, but technically this file
can be called anything. The really important thing is this root key campaign under
score markdown that tells Symfony to pass this config to our Campion markdown bundle.
Okay. What difference did that make if we go over EQ over to our side now and
refresh.

Oh, okay.

I love this. That was a complete accident. Unrecognized options services under S I
can't be that markdown. Did you mean service? Yes I did. I actually type of this,
I'll change that to service. One of the cool things about this configuration is that
it's validated. If you do a silly typo like I did, you're going to get an air. That's
awesome. And there it is. And you can see in this situation, by changing that config
option, it actually changed the service, uh, the class name of that service
internally.

So the point is that every single bundle gives you services and every single bundle
gives you different configuration to help you control the behavior of those services.
So, for example, we run bin console and big dump framework bundle framework bundle is
the main core Symfony bundle that gives you all the most important services. And if
you have that you can see a huge list here of all of the potential configuration that
you can use under the framework fondly. You can see it's quite big because it gives
you a lot of different features and yes you can totally Google this, look at it as
Symfony documentation. But how cool is it that you can just run this command and see
that list right there. Uh, let's also run another one is twig bundle we installed
toward Mundell in the first episode and boom, you can see all the different
information for twig bundle. Apparently you can set a global variable in here by just
adding,

okay,

our key value pair under some global ski. So you can run a mini concert and fig dump
twig bundle where you can actually use this root key here. Also if you know that. So
we just run config on the config dump twig. You're going to get the exact same list.
So you can use the name of the bundle or the sort of configuration alias down here if
you want to. Well, one thing I am curious about is this service thing. We know what a
service is at this point and we use this key markdown, that parser about light. What
is the significance of this string? Is this just some specials or just say list
inside the bundle of specific strings that you can use. Actually,

this [inaudible],

it's actually a little bit more interesting. Other than that, let's talk about it
next.

Okay.

