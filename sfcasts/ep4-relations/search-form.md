# Search Form

Coming soon...

New mission. Let's add a search box to this answers page, head over to our popular
answers that age, not 10, but actually we don't really need a row here. So I'm going
to kind of simplify my markup up a little bit, move this UL for the bottom. Cool.

Now we can give this div on top a D flex class to make it explain flex and justify
content between, because what I'm gonna do is I'm gonna have this H one on the left
and then on the right side of the page, let's add a form. Now the form is going to
submit right to our answer controller right here. So I'm going to set the action to
curly curly path at popular answers. I'm going to leave off the method equals, which
is going to make this submit via get requests, which is appropriate for a search
inside. We're using one field. So I'm going to have input type = search, And then
break this on multiple lines to add a name it's called name = queue. That's the name
we'll use to fetch that data. When we submit classical's form control to make it look
nice, a place holder, and even even an aria label, which is for accessibility since I
don't actually have a real label on this field. Okay. Refresh now looks awesome.

[inaudible] [inaudible]

And if we fill in the box and hit enter,

We come right back to this cage page, but now they question mark Q = a bananas on the
Europe. Of course the results don't change because we're not using that in our code
yet. So let's do that head into answer controller. So here's the plan. We're going to
read that question. Mark Q = from the URL, pass that string into find most popular as
an argument, and then use that inside of the query to add a where answer dot content,
like whatever that search term is. So a fuzzy search, but inside of our controller,
how can we read the question mark Q = from the URL? How do we do that in Symfony?
Whenever you want to read anything from the request like parameters, post data or
headers, you need Symfonys request object. It holds all of this. And if you're in a
controller, it's easy to get, add a new request argument type into with new org type
of the requests. The one from H to give you found HTTP foundation and then call off
request. Very simply. If you have an ARG arguments, your controller that's type
hinted with Symfonys request, class Symfony will pass you it's request object. This
has a number of methods on it to get all kinds of different data. Um, but it's fairly
easy to work with three query parameters. We say request arrow, query, arrow, get,
and then the query parameter. We want to fetch off of that. If it's not there that
will return. No.

Alright. Over inside of our repository, let's add a new string search argument. I'll
let it be known that it's optional and also so that it accepts no values. And then
we're going to kind of do this in pieces here. So I'm gonna say QueryBuilder = the
first part and I'll stop after the add select and at the bottom, say return query
builder, and then the rest of it. I fix my typo. The reason I'm splitting into two
pieces is we only want to apply the search logic. If a search term was actually fast
in. So splitting it, lets us say, if search, then we can add our aware. So say query
builder and where instead of here, I'll say answer dot content. That's the field
we're going to look at, like, and then pass, uh, the actual search term as a while as
a placeholder. So I'll say colon search term, but that could be anything. And
actually passing that and revalue say set, parameter search term and pass in these
search. Um, variable. Except if we do is that, oh, except we also need to put the
percents around this. So it looks a little funny, but that's what we want. So, so
we'll say we're answer that content like, and then the search term will be surrounded
by percent. So it's a fuzzy search.

All right, let's try it clear the question mark Q = from the URL at first. So here's
our normal results. Let's search for this can secretary and Got it.

[inaudible]

The result actually became the second result down here. But if you watch closely,
this third result actually changed was actually fine, but different word here to
search for it and make it even more obvious. There you go. That's much more obvious.
So it is working, uh, of course not that obvious that we're filtering because we are
not rendering the search term in the search box. So what's fix that over in popular
answers that HTML that twig at a value equals. Now we could actually pass the query
parameter from the controller into our template as a variable. But in this case, we
can also cheat the request. Object is available in every template via app, that
request. So then we can say the same thing that query dot get, and then queue now
beautiful. It shows up, but our search could be smarter. Well, we want to make our
search really smart and powerful.

We should use something like elastic search, but to make it a little bit cooler,
let's also return results that match the question text. So for example, maybe clear
out the queue, let's search for something with that big Niecy, most word on it, which
is inside that first question, but hit enter. Now that result disappears because
we're not searching any question, text, no surprise over an answer. Pository let's
change things. So think about what we really want to have here is an or aware, cause
I want to say where answer dot content like search term or the questions or the
question is like that search term. So what you might expect me to do here is say
something like or where, because there is a oral where method, but I never wants you
to use that method. The reason is it gets tricky knowing where the, where the
parentheses should go in the query. If you kind of get my meaning, if we use an oral
where down here instead, I want you to always use an where, but inside of an where
you can literally write or statements. So I can say answer, not content like search
term or, and then just put another expression right here. Now what I want to actually
search in this case is I want to search on the question property of our question
entity.

And since we have joined over to the question, entity and Eylea set, his question has
this. We can actually reference that question alias, to say question dot question.
Like no, can use that same colon search term. That's it. When we refresh now, yes.
That first result shows back up and check out the query for this page. It's pretty
sweet. Let me actually say view formatted query. So we're inter joining over to
question and then look at the where statement. We actually remember where actually
checking, or actually only returning things where the status is approved. And because
we put the order statement inside of that and where these are surrounded by
parentheses, which is really important that those parentheses weren't there, it would
actually, this order would actually mess things up. So next we've mastered the many
to one relationship, which is actually the same as the one to many relationship. Ooh,
we got a two for one. Now let's master the other major type of relationship, a many
to many.

