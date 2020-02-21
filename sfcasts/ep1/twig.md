# Twig

Coming soon...

Let's take our show page here and render a template with some proper HTML. As soon as
you want to render a template from our controller, you need to make your controller
extend abstract controller. Now obviously your control, a controller class doesn't
need to extend the space class so it was working fine until now, but you usually will
because abstract controller contains a bunch of useful shortcuts. The first useful
shortcut

is render. We can say it, return this->render and then this takes two arguments. The
first argument is the name of the template that we want to render. We use, it doesn't
matter, but we usually follow the same name you can dimension as our controller. So
since this is questioning controller, I'll say question and then I'll say /and then
show that HTML, that twig because we are in show action. The second argument to this
is an array of variables that we want to pass into our template. So eventually we're
going to query the database for a particular question and get all of its data. But
right now let's just fake it. I'm going to copy my UC words down here, believe the
older spots and let's create a variable call. How about question set to that version
of the slug?

Now in case in case you're wondering, our controller controllers still returns
response object. This render functions a shortcut to render this template and then
put it into a response. So we are still returning a response object. Now let's go
ahead and create this template. We know our templates live inside this templates
directory awkward, a new sub directory called question just for organization and then
inside a new file called the show dot .html.twig and it's not, I'm gonna start with a
very simple template here. I'm going to do an H one and then use a special tweak
syntax, curly curly, and then because we passed a variable called question into this,
I'm going to say question in between those and I'll put a little extra fake markup
down here. Eventually we'll print the full question here.

Okay, so you just saw the first tweak syntax, curly curly. As soon as we're inside
this tweak file, we are in the twig language. Unfortunately, twig is super, super
friendly. There are only two tweaks in taxes. The first is the say something syntax.
Anytime you want to print something you say you open curly curly and then a very
curly curly and then whatever you want to print. So this is exactly what we went to
open PHP echo. Inside of here you enter into the twig language, which is a lot like
JavaScript, so in this case we're referencing a question variable. If we put quotes
around it, this would be the string question.

Okay.

You can even do more complex expressions like ternary, like if question print, who
else? Print bar. Once you're inside toy, you are in a full fully featured mini
language,

but the point is if you're printing something, it's curly girly and then the thing
you wanted to print these seconds in Texas called, I called the do something syntax.
It's curly brace percent. If what you need to do is not printing something but doing
something like an if statement or a for loop, then you're going to use curly brace
percent. We'll talk more about those in a second. I'll show you a full list of
currently raised percent things you can do and that's it. Just those two syntaxes.
You're the printing something or you're doing something. Okay, small lie. There is a
third syntax. It is the common syntax. All right, so let's try football work refresh
and it works. There is our age one printing our variable. Now if you hit, if you view
the source in the space though, you'll notice that there's no HTML layout, there's
not like a property in layout. It's literally the markup that we're putting. We're
going to talk about how to do an HTML layout in a few minutes. All right, so we have
a fake question. I think this fake question deserves some fake answers. So let's go
back into our controller and up here in my show action, I'm going to paste in three
answers. Again, once we talked about databases will be query the database for these
answers, but right now I just have three answers to this problem and let's pass these
answers in as a second variable.

All answers into the template. And then down near the bottom here, I'll do age two
answers. And then down here I'm going to print those answers. Now we can't just say
curly curly answers because answers is an array. We can't just print an array. What
we really want to do is loop over that array and print out each individual answer.
That is going be our first, do something tag and it looks like this curly race
percent for answer in answers. And most do somebody tax also have an end tag. So we
can say, and for Asha, put this all inside of a UL tag here. Once inside the answer
is just uh, uh, the S each string answer. So now we can just print those out. So I'll
say ally, then curly curly answer.

That's it.

Well, we're now refresh, eh, works. I mean it's so, so ugly, but we're going to fix
that soon.

So you've already seen most of [inaudible] honestly go to twin.Symfony.com too. It
gets its own individual library that is us and it has its own documentation. So you
can click on docs up here and there's lots of information about [inaudible], but what
I really love down here is this twig reference. You see these tags over here, these
are all of the do something tax. If you're using the curly base percent of do
something syntax, it's always going to be curly raised percent one of these like
curly brace percentage for curly brace percent if or curly brace, percent set and
honestly you're going to use very few of these ultimately.

Okay?

I can always click into the documentation to see exactly how one of those works.
[inaudible] also has functions works to work like any other language you can just
call functions in whenever you want to inside [inaudible] and it has something really
cool called tests, which are a bit unique. Tests allow you to say things like if food
is defined

or [inaudible]

if some number is divisible by three. So just kind of a fancy syntax that you can use
an if statements to do a variety of different really cool things. But the biggest
section on here and the coolest part of twig are these things called filters. Filters
are basically functions but more hipster checking out. There's a filter here called
length and what it looks like instead of saying the length filter just counts
something. But instead of saying length open parentheses users, you get to say users
pipe length. The value goes from the left to the right. Here, check this out. Let's
try to print the number of answers that we have on this page. I'll put some premises
over here to make it look good. Now we can say curly curly because we print in number
and then we'll say answers, which is our array pipe like. So this answers array here
is going to get passed over to the link filter whose job is to count them. So if they
go over now and refresh, it's there.

The twig reference is a great way to know everything that's going on. Now there's
last one, last killer feature with twig and it has to do with layouts. Most of your
pages are going to share the same um, base layout file right now. Our page, as we saw
earlier, it doesn't have any layout at all. We're going to want it to share all pages
to share some common markup. To do that in your template all the way on top, I want
you to add curly race percent. So this is a do something tag extends based by age
team, all that twig. So we're telling twig that we want this template to use a base
template and the base that age to month toy that we're referring to is this based on
age TMA twig that was added by the recipe. It's super simple right now but this is
ours to customize. But if you try just this, you get a huge air, a template that
extends another one cannot include content outside twig blocks.

So when you say when you add extends to a tempo of what you're saying is that you
want, it's the content from this template to go inside of the template you're
extending but tweak as a note where you want, it's what you just shared. Put the
template up here or down here or somewhere in the middle, but you'll notice that this
template is full of things called blocks block title block style sheets, block body
and block JavaScript blocks are holes into which a child template can enter content.
So basically we can't just extend based at age Dima twig. We need to say, we also
need to tell it that we want all of this content to go into one of these blocks.
Specifically it looks like this blocked body is perfect. We really want the content
to go right here. So to put the our content into the blocked body, we need to
override that block in our template. So we're going to say currently grades, percent
block and body, and then at the bottom, color base and guac that tells it where this
should go inside of that base template.

So if we go over now and refresh, it works. Now it doesn't look like much yet because
that's such a simple template. But if you have a source, we now have proper HTML
layout. Now these blocks in based at H and twig aren't special. You can rename them
however you wanted. You can move them around, you can delete them, you can add them.
The more you add, the more extension points, the more uh, you can add and do whatever
you want with these. Now, most of the time you'll notice that these blocks haven't no
content, but if you want, they can actually have default contents. Look up it.
There's one called block title, which whose default value as well. No surprise. Look
over here. That's the name on our page. Welcome. This is surrounded in a block
because it allows individual templates to override that, so check it out. It doesn't
matter where in this template, but somewhere, let's say block title, and then I'll
say question colon, and then we'll print the question and then we'll say, and block,
recover and refresh. That overrides the title on the page. Blocks are awesome. Next,
let's talk about the coolest feature insights of maybe profiler.

