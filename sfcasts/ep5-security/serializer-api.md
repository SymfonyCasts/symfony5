# Serializer Api

Coming soon...

Most of our pages so far have just been normal HTML pages. Let's create an API end
point. Now that returns JSON information about the currently authentic created user.
This might be something that we use by our own JavaScript, or maybe you're creating
an API for someone else to consume more on that later. Right now let's just create a
new controller for this call. How about user controller? I'll make this extend our
base controller class

Down here. I'll create a method called API me in a way. This is going to look as I'll
add my aunt route out of people. One from synthetic component and we'll call this
/API /MI. So this is not a very restful and buoyant, uh, but it's oftentimes a very
convenient one to have. Now we're going to require the user to be logged in, in order
to see this. Otherwise we won't be able to return any information about them. So I'll
use is granted is authenticated remembered. You can see I'm using kind of a mixture
of, um, Uh, annotations to deny access and PHP to deny access to my project. Choose
whichever one you want Inside the method. We can just say, return this arrow, JSON,
And pass it. The current user, which is this->get user. All right. So let's try that.
We are logged in right now, so we can go to /API /meet and see absolutely nothing.
Just empty quotes. So by default, when you called this arrow, JSON, this passes your
data to Symfonys JSON response class. And what it basically does is called JSON and
code on your user object in PHP, unless you do extra work when you use JSON and on
the object, all it does is include the public properties. And of course our user
class doesn't have any public properties. Hence we get nothing back,

But a real application. If I'm building an API, I'm going to use Symfony serializer
components to help me out here. So let's go get that installed air command line run
composer require Symfony serializer.

This is salsa face serializer pack, which basically takes of installing Symfony
serializer components as well as a couple of other libraries that help us serializer,
uh, work in a really smart way, but it doesn't have a recipe that does anything
fancy. It just installs coat. Now, one of the cool things about using this arrow,
JSON, is that as soon as the Symfony serializer is installed, it will automatically
start using it to serialize your data instead of just normal JSON and code. In other
words, when we refresh the end point, now it does work. We're not going to go too far
in how the Symfony serializer works. We talk a lot about it in our API platform
tutorials, but let's at least get some basics.

So by default, the serializer is going to see realize any property that has a get her
on it, or really it's going to see realized including even display name, which is not
a real property, but there is a get a display name. Now we don't really want to
include all this information. So let's take a little bit more control here. We can do
that as by telling the serializer to only see, realize a specific group. So I'm going
to pass 200 for the status code, empty headers array, which are the faults just so I
can get to this fourth context option, which is sort of like options that you pass in
serializer. We'll pass one and call the groups set to an array. And I'm just going to
invent the string here, called the user read because we are reading the user now a
copy of that class name, because what we'll do now inside of our user entity is we
will add every property that we want to include in the API to that group.

So for example, let's include the ID. So we'll do is use an annotation or a PHP
attribute above us and say, add groups, make sure that you auto complete that one
from Symfony serializer that added the use statement for it on top, and then inside
of here, I'll paste in user colon read. So I'll copy that and, or run down and also
expose email. We don't want to expose roles, we'll expose first name and that's it.
We can also, if we want it to even put that, uh, group at above, get display name, if
we want it to include that or get avatar you or I in fact, get the advertiser you
where I would kind of fun. So let's, let's do that. Awesome. When we refresh now
super cool. We have those four fields, but notice one thing, even though this is an
API end point and our API end point requires us to be logged in. We can totally see
this, even though we don't have a fancy API token authentication system, we're seeing
this thanks to our normal session cookie. So that kind of leads us to our next
question. If you have API end points like this, do you need an API token
authentication system or not? Let's tackle that topic. The next.

