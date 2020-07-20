# Query Reuse

Coming soon...

The really cool things about the query builder is that if you have multiple methods
inside of a repository class, you can reuse query logic. For example, a lot of
queries might need this. And where Q dot asked to add is not no logic. That's pretty
simple logic, but it would still be great to not repeat this line over and over
again, in every query. Instead let's centralize this logic, create a new private
function at the bottom. Let's call it add is asked query builder and give it a query
builder arguments. The one from ORM QB and make this also return a query builder
inside. What we're going to do is modify the query builder to have our custom logic.
So it's like QB, QB arrow, and I'll copy the, and where Q dot asset is not, not Oh,
and return this to pretty much every query builder method returns itself an instance
of itself, which is nice because that allows us to use the method chaining that you
see here now to use this above first, create a query builder and set it to a
variable. So QB = this->crate query builder.

Then we can say return, this->add is asked query builder, QB, and then the rest of
the query. How cool is that? We now have a private method. We can call whenever we
need to query to only show published questions. I want to try it now. It still works,
though. It is kind of a bummer that we needed to first create this empty query
builder. It sort of broke our cool looking method, chaining a bit. Let's see if we
can fix this, check it out, create a new private method on the bottom. Let's call it.
Get or create query builder, scroll up. And this is going to take an optional query
builder argument. So query bowler QB = null, and it's going to return a query
builder.

So the idea inside we can use this special ternary syntax to say return. If a query
builder is passed, then three, it return. If the query builder is passed, then return
it else. Return this arrow, create query builder, and we'll use that same cue. Alias.
This is useful because in ad is asked query builder. We can add = no to make its
query builder argument optional. Make that work by saying return this arrow, get or
create query folder and pass it QB and then->and where Q dot asks is Q dot asked at
is not no. So if somebody passes us a query builder, we will just use it and modify
it. But if no query builders pass to us, then this method will create it. And then it
will add our logic. It's basically just makes our helper method easier to use above.

Just return. This->add is asked query builder with no QB argument before we
celebrate. Let's make sure that works when I refresh it does okay. Enough with custom
queries, you can go further in our doctrine queries tutorial, but before we continue,
I have to admit something I've been making us do too much work. I want to show you a
shortcut for querying in a controller, head over to question controller and find your
show method here. Instead of manually querying for the question object via, find one
by Symfony can do that query for us automatically. Here's how replace these slug
argument with question question. The important thing here is not the name of the
argument, but the type hint.

And that's it just by doing that Symfony is going to automatically query for a
question entity object, where the slug is equal to whatever that part of the URL is.
It means I don't need any of this repository logic down here, or even my four, four
logic. And I can delete my entity manager interface argument. And actually I don't
need this markdown helper either before we discussed how this black magic works.
Let's try it. We move over. I'll refresh the homepage, but I don't need to let's
click into one of these questions and yes, it works. You can even see the query down
here. It's exactly what we expect to see where T or the slug = that slug.

Here's the deal. This magic is provided by a bundle that we already have installed
called Sensio framework, extra bundle. When that bundle sees a controller argument
type hinted with an entity class, it tries to query for that entity automatically how
by automatically querying via any wild card parameters. So this works because our
wild card is called slug, which is the same name as our property in our class. So
quite literally it does where slug = and then whatever that part of the URL is, it
even handles the four of four for us. So for example, if we did /foo here, you're
going to see a four Oh four, not found this functionality is called a parameter
converter in. I love it, but if you have a situation where you need a more complex
query, or for some reason, your wildcard name can't match the property name in your
class, or maybe you have some extra wild cards that you don't want to be part of your
query, then don't use the pram converter, just type pinch your repository class. Like
you would do normal and call whatever query you want. The pram converter is in
awesome shortcut for all the simple cases.

The prem converter is also the last major, uh, thing that you can add your
controller. So we now know that it's the arguments that you can add. Your controller
are one arguments whose name matches a wildcard to in Ottawa, horrible service class
or three in entity class. If you want it to be automatically queried for it, there
are actually other things you can do with as arguments your controller, but those are
the main cases. Next let's add some voting to our question. When we do that, we're
going to look closer at the methods inside of our question, which right now is just
all getter and setter methods. Are we allowed to add our own custom methods here? And
if so, when should we.

