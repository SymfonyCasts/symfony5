# Request

Coming soon...

Time to hook up this vote's functionality. Here's the plan. These uploads and
downvote buttons are actually already buttons. I'll show you. It `show.html.twig`
see it's `<button>` and it has `name="direction"` in `value="up"`. You may not be
that familiar with it because you don't use this functionality that often. But if you
wrap this in a `<form>` and then click one of these buttons, this value of up or down
will actually get submitted to the server, like a normal form field. So we're going
to wrap this in a form and then submit it to a new end point that will read the up or
down value, then increase or decrease the vote count. We could also do this with a
fancy Ajax call, but from a doctrine and Symfony perspective, that really makes no
difference. So I'm going to keep it simple.

Let's start by creating that end point. So in `src/Controller/QuestionController`,
Oh, let's see. At the bottom, let's create a new end point new method called question
method, called `questionVote()`. And above here, we'll add our normal at routes and
we're gonna make the U where I'll have out `/questions/{slug}`. So
that's actually the same as the show page up here, but then we'll add `/vote` on van of
it. Now, in this case, I know that I'm going to need to generate a URL to this route.
I'm going to need to generate it when we create our form. So I'm instantly going to
give this a `name=""` . And how about `app_question_vote` and the last
thing I'm going to do, which I don't need to do, but it's kind of nice is add 
`methods="POST"`.

So that's going to mean that I can only make a `POST` request to this end point. I
can't make a `GET` requested as end point, which is nice because it means people can't
like share a voting link and then just have people click that voting Lincoln and have
them accidentally vote on the site. All right. So like before, like with our show
page, we have a `slug` query parameter and we need to query for wildcard. We need to
query for the question object. So let's do that down here the same way, just by type
pending the `Question` class and then `$question`. And then for now I'm just going to `dd()`
the `$question`. So when we get the form hooked up, when we submit here, it should dump
the question. Alright. Now when `show.html.twig`, let's hook this entire thing up
here with a form. It's a very simply, I'm going to add a `<form>` element here. I'll put
the end form after this stuff. And then I will end that this dip now inside of the
form, we need a several things. The first thing we need to do is we need, as the
`action=""` in here, I'll use curly curly `path()` to generate a URL to our `app_question_vote`
page. Now that has a curly brace wildcard. So we need to pass a second
argument here and say `slug` set to `question.slug`.

The other thing we need on the end here is `method="POST"`. Perfect. Okay. With any
luck when we refresh the page over here, we should be able to click either of these
buttons and have it submit to that end point. And it works. You can see that you were
up here and it queried four and dumped our `Question` object of that. So this form
doesn't look much like a traditional HTML form. It doesn't have any inputs or text
areas, but because it does have these two buttons and each of these have a 
`name="direction"`. If we click the up vote, it's actually going to send in up a `direction`.
Post parameters set you up over, click down. It's going to send a `direction` post
parameter sets it down almost as if these were, uh, input boxes.

So the question now is how can we read post data from inside of Symfony? Well,
whenever you need to read post data or query parameters or headers, what you really
doing is reading information from the request and in Symfony, there is a `Request`
object that holds all of this data. So all we need to do is get the `Request` object
and because needing the `Request` object is so common. You can get it in the controller
by using its type it, check this out, add `Request`, make sure you get the one from
`HttpFoundation` and then `$request`.

Now this looks like service auto wiring. It looks for example, just like how we can
type in `EntityManagerInterface` to get that service. It looks like we're type
hinting, the `Request` class and autowiring, the request service. But in reality, the
request is not a service in the container. This is actually a special one of the
final, special, uh, cases of things you can have as controller arguments. So if
you've been keeping track at home, we know that you can have an argument that matches
the curly brace wildcard name. We also know that you can type into services. We also
know that you can type into entity objects and Symfony will automatically query for
them. And finally, we know that we can now type in the `Request` class. It's the
request class specifically, not the name of the argument that tells Symfony that you
want, that there are a few other things you can do, but those are actually all the
ones that I use.

Now, the request object itself is very simple. It just has a bunch of methods to read
any information that you want off the request, like where your parameters, headers or
post parameters. So if you want to do something, it's usually a matter of just
looking at the class or Googling, what method do I need to get the information that I
need? Let's dump all of the let's use one of it's let's use something on it to dump
all of the post parameters, do that with `$request->request->all()`. Yeah. As
I know, it looks a little funny with request error request. Technically post
parameters are known as it request parameters. So this `$request->request` is a small
object that holds all of the post parameters and all turns them into an array. So
when we go over now and refresh beautiful, you can see `'direction' => 'up'`.

Now we're dangerous. And the controller let's get that with 
`$direction = `. And before I actually do this, you can also see if I do request
your query. That would be a way to get query parameters. If I said requests or
headers, I could start getting request print, um, uh, headers in this case, we'll say
`$request->request->get('direection')` The name of the key that we want to
read off of that. And we'll do this very simply. It will say if `$direction === 'up'`, then
we'll say `$question->setVotes($question->getVotes() + 1)`

And then we'll say else if `$direction === 'down'`, then we'll do the same thing, but
we'll do it with minus one. And if their direction is said to some other value, let's
just ignore it. That probably means that someone is messing with our form and we'll
just do nothing. The bottom of here, lets `dd($question)` to see what it looks like now,
before you can see that the question vote number on this is 10. So this time when I
refresh, yes, that goes up to 11. And if I go back to the show page and hit down, it
goes down to nine, but this didn't save to the database yet. It just updated the
value on our PHP object. And also I think we can do this in a cleaner way and our
controller then getting the votes and adding one, getting the votes and subtracting
one next, let's talk about a Nemic versus rich models. And then we're going to learn
how to make an update query in the database so that it will update the count. The
hint about that is that you already know how to do this.

