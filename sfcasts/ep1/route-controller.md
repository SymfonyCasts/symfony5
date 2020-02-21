# Route Controller

Coming soon...

The page we're looking at right now, which is super fun and even changes colors is
just here, just shows up while you're developing. If you don't have a homepage yet,
so let's create a real homepage. Any framework has, there's one main job of any
framework to give you a route and controller system, a system that allows you to
build pages. Our route is where you define the URL to the page you want. In the
controller is PHP code that we write that builds the content for that page, whether
it be HTML or JSON. At this point, our application is actually so small that pretty
much all Symfony's giving us is that route and controller system. Later when we need
more features, we're going to install them, which is actually going to be awesome.

Open up config routes.yaml. When Symfony loads up the system it when Symfony loads,
it gets it loads routes from this file. I'm going to uncomment this route here. If
you're not familiar with the AML, it is a key value based system separated by colons
where indentation is important. So this is a single route where the path that you
were out will be slashed at the home page. And the controller actually points to a
class whose name is spaces app controller, default controller. So when we go to the
homepage, it's going to execute in index method on this default controller class.

And for now you can ignore this index key up here. That's just the internal name of
the route. And right now it's meaningless. Now remember our application is all about
allowing, which is in wizards to ask questions about different spells that they're
doing. And in the homepage we're going to show some of the most popular questions. So
I'm gonna change the controller here to question controller and the method to
homepage. And that's it. That is a route we've defined the URL and we've defined the
controller function that should, that will build the page. Now this controller class
doesn't exist yet. We're looking at source. There is a controller directory, but
there's nothing in it. So I'm going to right click on this. Go to new Petri class.
You can also do command N and type in question controller, but wait, check this out.
It free filled the namespace. That's awesome. This was thanks to that setup we did
with composer.

Every file that we create in the source directory is going to need a namespace and
the name of space always needs to be app followed by whatever directory you're at. So
we're in the controller directory. It's in the controller namespace if you like PHP
storm and create the piece. But that's for you. It's going to guess it right every
time. Perfect. All right. Now because in our roster at Yammer, we call the method
homepage. Let's go inside of here and create a new public function homepage.
Congratulations. We are now inside of our controller function. Sometimes also call an
action. Our job here is simple to build the page and we can do anything inside of
this function. We can make database queries, cache queries, API calls, whatever we
need to do to build the page. The only rule is that we must return a Symfony response
object from a controller.

So check this out. Say return new response. Then notice there are multiple response
objects in our project. Use the one from Symfony component HTTP foundation. That's a
part of Symfony that gives you um, and uh, choose that one and hit tab to auto
complete it. Now stop right there. That was super important because we led PHP storm
auto complete that for us, it added the use David to the class on the top of the
file. That is one of the best features of PhpStorm. And I'm going to use that a lot.
You will constantly see me type classes. Let peaches start my auto, complete them so
that it will add the use statement on the top of the file for me. Now inside let's
just put some simple texts. Would it be witch and controller

we have conjured and that's it.

So let's drive. We have the routes which points the home page and when we go to the
homepage, it should execute our function and this should return the message. So let's
move back over. We're on the homepage right now. Refresh and say hello to our very
first page. It's not much to look at yet, but we've already covered the most
foundational part of the Symfony, the route and controller system. Next, let's make
our routes fancier by using something called annotations. We'll also create a second
page that will show a specific question on the site.

