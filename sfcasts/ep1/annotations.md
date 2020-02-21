# Annotations

Coming soon...

Creating a route in Yammel at points to a controller function and PHP is pretty
simple but there is an even easier way that I love. It's called annotations. First.
I'm going to go back and comment out our Yammer out. Basically remove it entirely.
Prove it's not working for refresh the homepage. It's back to the placeholder
homepage. Now this annotations thing is actually an added feature to Symfony. It's
not something that we have installed in our project right now. No problem. We can
install it super easily via composer first. Make sure you have composer installed on
your system if you don't go and get composed.org/download and get it going. Once you
do, once you do run composer require annotations.

If you use composer before that package name is going to look strange to you and
actually you can see that in reality installed company something called Senseo
framework. Extra bundle. More on that later. There's also some stuff down here about
two recipes being installed. Also going to talk about that later. That is one of the
things that makes Symfony special, but don't worry about that now. So the
annotations, the really great thing about them is you actually put the route right
above your controller function. So say /star star, make sure you have /star star, my
ship, two stars I hit enter. I'll remove that return and say app route and then auto
complete the one from Symfony components. The Symfony bundle one is actually
deprecated and hits hat just like before the add of the use statement at the top of
your class, which you absolutely need insides at route.

Do double quotes and then /congratulations you just created a route for this
controller. When we go to /it will execute this function right below it. So simple.
Want to refresh? Our page is back, so let's make this fancier. Let's create a second
page. If we're going to have a homepage that lists some of the popular questions,
each individual question is also going to need its own page. So how can we create a
second page? Well, just by creating a second method right inside this controller, we
can also create another controller class. But since this is going to display a single
question, probably makes sense to have it right here. So let's create a public
function called show and to give this a URL withU /star star. Then at routes the same
one and let's create a you where I'll have out /questions /how to tie my shoes with
magic and inside. Just like before we're going to return a new response. The one from
Symfony HDU foundation, let's say future page to show a question.

All right, let's try it and a copy of this exact, you were all right here. Let's spin
back over. Pop that onto our page and page number two is done. One thing to note here
is no matter what you are all you go to like this you were out or your homepage. In
reality, the file that's being executed by your web server is actually this public
/index dot PHP, so you don't see the index that PHP in the URL here because our web
server is smart enough to execute it, but it's actually there. In fact, I can put it
there if I want to. That makes it a little bit more sense. Um, but it's not required.
Internally. Symfony is looking at what the URL is, finding which route matches and
then calling the correct controller.

Now having do you were like, this doesn't really make sense. In reality, we're
eventually going to have a big database full of these questions. So we need this to
be dynamic. We're not going to have a new route for every single question in the
database. So instead of having this, how to tie my shoes with magic part here,
replace this with curly slug curly. When you have something inside the curly braces,
this becomes a wild card. This now matches slash. Questions /anything. The name slug
here is not important. Anything like slug you less a recto, but uh, it doesn't matter
at all. These will all match slash. Questions slash. Star. In fact, I go over right
now and refresh that page. Still works. But slug of us erect erected was a little bit
long. So let's use slug slug as a common term for a a, you were all that kind of
looks like a word now because we have this slug here, we are now allowed to have an
argument with the same name because we decided to call this slug. This argument needs
to be slugged down here. The really cool thing is that Symfony passes us whatever
value is in the you. Where else? That variable. So now I'm gonna make this a little
fancier. I'm gonna use a sprintF here just so I can use it. Say a future page to show
the question and I'll say percent S and then past slog as an argument. So should be
future page to show the question and then that question name. So go over now and
refresh.

It works. How to tie my shoes with magic shows up down here. Let's try something
different. The classic accidentally turned cat

into

for issues and that shows up as well. And eventually we'll use that to actually query
the database. But for now, just to make things even a little bit fancier, I'm going
to add a little streamer place onto this where we replace dashes with spaces and even
put using words on this. Still, we have a database that will make things look a
little bit cooler. All right, next, let's talk about Symfony flex Symfony recipes and
S flex aliases.

