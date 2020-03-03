# JavaScript

Coming soon...

So the goal now is to write some JavaScript so that when we click up and down here,
it will make a request to our end point, which sort of a fake end point that saves
the vote of the database, which we don't have yet and returns the new vote count. So
the template for this page is in templates. Question show dot H. dot. Twig. You can
see down here in answers we have this vote up and vote down. I'm going to add a
couple of classes here that are going to help our JavaScript on the vote arrows. I'm
going to add a J S dash vote dash arrows class. I'm going to use that in JavaScript
in a second to find this element. Then on the vote up, I'm going to add a data
attribute called data direction = up and same thing on the down button. I'll add data
direction = down so we know which buttons being clicked. The last thing I'm going to
do is I'm going to surround this little number six here with a span and add a little
class on here called J S dash vote dash total. We'll use that JavaScript to find this
element so we can update that number.

No, the co JavaScript code I'm going to write for this is going to use jQuery. Keep
things nice and simple, and in fact, I'm going to use jQuery on, I'm going to want
jQuery on my entire site. So the first thing I want to do is go into my base layout
down here and at the bottom you'll notice we have a block called JavaScripts. I'm
gonna enter here, I'm a paste in a script tag, which goes, just goes to a, use a
jQuery a from a CDN. Either copy this URL exactly or go to J query and get this URL
yourself.

Well, this does nothing more than adds jQuery to our site, but we're not actually
using jQuery yet. Now, if you're wondering why we put this inside of the JavaScript's
block other than it seems like a good place to put it, I'll show you in a second.
Technically, if we had put this after the JavaScript's block, everything would work
perfectly the same for now. But having it in the JavaScript's block is going to be
handy in a few minutes. I'll show you why. For the JavaScript itself, I'm going to go
to the public directory, create a new directory called J S and a new file here called
question underscores show that JS. So here's the idea. You might have some global
JavaScript that you want to include on every page. We don't have any right now, but
usually you do have some global JavaScript and then on some certain pages and
sometimes on specific pages you want to add some extra JavaScript.

So what we're creating here is a file, a JavaScript file that I'm only going to load
on our show page. It's going gonna contain the logic for the upvote for these
comments. So in question on the score score so that they ask, I'm just going paste
about 15 lines of code here. What this does, it listens to the click, finds the jazz
vote arrows element, which we just added here, finds the links on them. Then on click
it makes a Ajax request to /comments /10 that number is hard coded in for now. /vote
/and then it reads the data dash direction attribute off of our elements to figure
out if it should go to up or down. Then on response, which really I'll call that,
I'll rename that to data. That's even more accurate name.

It reads the votes property off of the data because in our controller we're returning
a vote's property and it uses that to update the vote total. Perfect, so how do we
bring this in? Now if we wanted to bring this into our base template, we pretty easy.
We would just add another script tag below there, but we want to bring this into our
show template only. This is where having this inside of a JavaScript's block is handy
because what we can do with the child template is we can override that JavaScript's
block. So check this out and show to H Montsweag doesn't matter where. But let's go
to the bottom and say block, JavaScripts and block. And here I'll put a script tag
and say source equals. And remember we're going to use our asset function first = I
remember when these are asset function, but actually you can see it's already auto
completing here. JSS questions show. If I had to have it as asset a function for me.
Now if we just stop here, this would literally override the JavaScript's block in our
base template. So jQuery would not be included on our page. What we really want to do
is not override this block but a pin to it. We want our JavaScript to effectively go
right below jQuery. The way to do that is above our script tag to do curly, curly
parent that literally gets the content of the parents job skirts, block and prints it
right there.

Alright, so let's dry this refresh and yes, we got it it up. And if you hit down,
you'll get really slow numbers. Now really quick. I want to show you some really
cool, see this little six down here. I'm actually gonna refresh. Notice that icon is
not down there, but as soon as our page makes any Ajax requests, it's actually
keeping track of them. And this is a really cool spot because what it's doing is it's
showing you a link to look at the profiler for any of those requests. So I'll hold,
uh, I'm actually gonna open this in a new tab here and we're looking at, here is
actually the profile,

the profiler for that specific Ajax requests. You have all the same information that
you're normally used to having, but for your actual, for the Ajax request, that is
one of the killer features. No, of course. When inside of my JavaScript value and
notice that I chose to make a post request to this end point. And that makes sense
because this end point eventually is actually going to be changing something in the
database. So we don't want a best practice that we don't allow people to make a get
requests to it. We want to make a post request to it, but technically speaking we can
still just make a get request. I guess just to put it in my browser if I want to,
Hey, I'm voting.

So to fix that I'm gonna go on a common controller and one of the things you can do
here is say that this should only match one specific method. So to do that I'm going
to add methods equals, and you can put an array here, a multiple methods, but I'm
just going to say double quote post. And as soon as you do that through refresh over
here, this now gets a four for no route found because only the post methods is
matched. And actually a cool way to see that. Another way is to run a bin console
router colon match. What you can do here is I'm going to go and copy the URL to my
Ajax end point. You can give this a URL and it will tell you which route in the
system it matches. You can see that it almost matched this common boat route, but
this was a get request and it doesn't match the post.

If you want to do a, you can also pass gas as medicals post if you want to say what
would match my post request and boom, it shows you which route matched. And um, and
of course this tells you like which controller, uh, that route points to. So that's
really cool. The other little thing that's not quite right here is the direction
we're expecting it to be up or down. But technically somebody could put a banana
right there. In fact, let's go over here and change this to banana and it matches a
route. It's not the end of the world, it's just going to downvote it automatically,
but it's not really as good as it should be. So normally these wildcards match
anything. But if you want, you can make them a little bit more specific. The way you
do that is by doing inside the curly race.

After the name, you say open less than greater than instead of here, you can put a
regular expression that you want this to match. So in our case, we can say up pipe
down, literally up or down. Now let me go over and refresh. It doesn't match because
banana does not match up or down. But if we change this to up, it matches. Another
common one you'll see here is, um, we can use it. Fry ID is /D plus means match a
digit of any length. I'm actually not going to put that here, even if my ID is an
integer. In reality, if somebody did put banana, eventually, it's just going to fail
to find that in the database and it's not going to cause a problem anyways, so don't
really need that level of specificity. All right, next let's get a preview into, and
let's spin over and close this. Just refresh the page and double check. This still
works and it does. So next, let's get a sneak peek into the most fundamental part of
Symfony services.

