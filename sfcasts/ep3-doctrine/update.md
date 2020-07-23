# Update Query & Rich vs Anemic Models

On the show page, we can now up vote or down vote the question... mostly. In
the controller, we read `direction` to know which button was clicked and change
the vote count. This doesn't save to the database yet, but we'll do that in a minute.

## Adding upVote and downVote Methods

Before we do, we have another opportunity to improve our code. The logic inside the
controller to increase or decrease the vote isn't complex, but it *could* be simpler
and more descriptive.

In `Question` at the bottom, add a new `public function` called `upVote()`. I'm
going make this return `self`. Inside, say `$this->votes++`. Then, `return $this`...
just because that chaining easier - all of the setter methods return `$this`.

Copy this, paste, and create another called `downVote()` that will do `$this->votes--`.
I'm not going to both adding any PHP documentation above these, because their names
are already so descriptive: `upVote()` and `downVote()`!

I love doing this because it makes the code in our controller *so* nice. If
the direction is `up`, `$question->upVote()`. If it's `down`, `$question->downVote()`.

How beautiful is that? And when we move over and refresh... it still works!

## Rich vs Anemic Models

We've now added the *three* custom methods to `Question`: `upVote()` `downVote()`
`getVotesString()`. And this touches on a somewhat controversial topic related to
entities. Notice that every property in our entity has a getter and setter method.
This makes the entity super flexible: you can get or set any field you want.

But sometimes you might not need or even want a getter or setter method. For example,
do we really want a `setVotes()` method? Should anything in our app be able to
set the vote directly to *any* number that it wants? Probably not. Probably we
will always want to use `upVote()` or `downVote()`.

Now I *will* keep this method... but only because we're using it in
`QuestionController` - in the `new()` method... we're using it to set the fake data.

But this touches on a really interesting idea: by removing any unnecessary getter or
setter methods in your entity and replacing them with more descriptive methods that
fit your business logic - like `upVote()` and `downVote()` - you can, little by
little, give your entities more clarity. `upVote()`, and `downVote()` are *very*
clear & descriptive.

Some people take this to an extreme and have almost *zero* getter and setter
methods on their entities. Here at Symfonycasts, we tend to be more pragmatic.
We usually have getters and setters method, but we always look for ways to be
more descriptive - like `upVote()` and `downVote()` methods.

## Updating an Entity in the Database

Okay, let's finish this! In our controller, back down on `questionVote()`, how
can we execute an *update* query to save the new vote count to the database? Well,
no surprise, whenever we need to *save* something in doctrine, we need the
entity manager.

Add another argument: `EntityManagerInterface $entityManager`. Then, below,
replace the `dd($question)` with `$entityManager->flush()`.

Done! Seriously! Doctrine is smart enough to *realize* that the `Question` object
already exists in the database and makes an *update* query instead of an insert.
*We* don't need to worry about "is this an insert or an update" at all? Doctrine
has that covered.

But wait, didn't I forget the `persist()` call? Up in the `new()` action, we
learned that to insert something in the database, we need to call call `persist()`
*and* `flush()`.

This time, we *could* have added `persist()`, but we don't need to. Scroll back
up to `new()`. Remember: the point of `persist()` is to make Doctrine *aware* of
your object so that when you call `flush()`, it can *check* that object and
execute whatever queries it needs to save that into the database, whether that
is an INSERT of UPDATE query.

Down in `questionVote()`, because Doctrine was used to *query* for this `Question`
object... it's *already* aware of it! When we call `flush()`, it already knows
to check that `Question` object for changes and performs an UPDATE query.
Doctrine is smart.

## Redirecting

Ok, now that this is saving... what should our controller return? Well, usually
after a form submit, we should redirect somewhere. Let's do that. How?
`return $this->redirectToRoute()` and then pass the name of the route that we
want to redirect to. Let's use `app_question_show` to redirect to the show page
and then pass any wildcard value as the second argument: `slug` set to
`$question->getSlug()`.

Two things about. First, until now, we've *only* ever generated a URL from inside
of Twig, by using the `{{ path() }}` function. We pass the same arguments to
`redirectToRoute()` because, internally, it generates a URL just like `path()`
does.

And second... on a high level... what *is* a redirect? When a server wants to
redirect you to another page, how does it do that?

A redirect is *nothing* more than a special type of response. It's a response
that has a 301 or 302 status code and a `Location` header that tells your browser
where to go.

We know that our controller always needs to return a Symfony `Response` object.
Let's do some digging: hold Command or Ctrl and click `redirectToRoute()` to
jump to that method inside of `AbstractController`. This apparently calls another
method `redirect()`. Hold Command or Ctrl again to jump to that.

Ah, *here's* the answer: this returns a `RedirectResponse` object. Hold Command
or Ctrl *one* more time to jump into this class.

`RedirectResponse` live deep in the core of Symfony and it *extends* `Response`!
Yes this is just a special subclass of `Response` that's really good at creating
*redirect* responses.

Let's close all of these core classes. The point is: the `redirectToRoute()`
method doesn't do anything magical: it returns a `Response` object that's really
good at redirecting.

Ok: testing time! Spin over to your browser and go back to the show page. Right
now this has 10 votes. Hit "up vote" and... 11! Do it again: 12! The 13! Downvote
and... 12. We got it!

Like I said earlier, in a real app, when we have user authentication, we might
prevent someone from voting multiple times. But, we can worry about that later.

Next: we *have* created a way to load dummy data into our database via the
`/questions/new` page. But... it's pretty hacky.

Let's replace this with a much more robust *fixtures* system.
