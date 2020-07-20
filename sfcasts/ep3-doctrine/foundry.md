# Foundry

Coming soon...

In the load method of our fixture class, we can create as much dummy data as we want.
Right now. We're only grading one question, which isn't making for a very realistic
experience, but, but if we were to create more questions and especially in the
future, when we will have multiple database tables that relate to each other, this
class would become big and ugly. It's already kind of ugly. So instead of doing that,
let's use a super fun new library, Google for Zen struck Foundry and find it's get up
page.

Wow.

Gary is all about creating doctrine, entity objects in as easy way as possible. It's
perfect for fixtures as well as for tests. When you want to see your database with
data at the start of your test, it also has extra features for assertions and the
test, which is what it was really originally created for. Oh, and prompts to it's
author, Kevin, Kevin Bond, a long time Symfony community member who has been creating
some excellent libraries lately, scroll down to the installation. Copy of the
composer require line, find your terminal and paste. This is dash dash dev because we
only need the load dummy data and the dev environment. While that's running head back
over to the docs. The idea is that for each entity, like for example, category or
post, like they use in this example, We're going to generate a corresponding model
factory. So I post entity, which we'll do with a make factory command. So he posts
[inaudible] post to factory class, which will look something like this. Once we have
that, we can configure some default data on that for that entity class, and then
start grading objects. Now I know I wonder that really quickly, but that's mostly
because we're going to see this in action back at the terminal. Let's wait for this
to finish. I'm actually recording this at my parents' house where the internet is a
little lack. Luster

When finishes

Let's do generate one of those model factories for our question,

Using the new make factor command I'll run Symfony console, make colon factory. Now I
also could have used a bin console make factory because this command doesn't need the
database connection environment variable, but it's easier to get in the habit of
always using Symfony console select question from the list and done. Go check out a
new class source factory question factory that PHP, the only method that we need to
worry about right now is get defaults. The idea is that we'll return an array of all
of the data needed to create a question. For example, we can set a name key to our
dummy question name, which is right now missing pants internally. This works a bit
like twig. When frown, when Foundry sees the name key, it will call the set name
method on our end state internally. This is used as Symfony's property access or
component. So it also has a few other tricks and how it can set properties.

Copy the rest of the dummy code from our fixture class. Delete it, delete everything
actually. And then back in our question factory and get a false it. Now, what I need
to do is basically now convert this all into the key format, but array format, sluggy
a question key. And then for the asked at we'll actually do use a ternary syntax to
do all of that thing in one line. So if our random number is greater than two, then
we will pass our random value here. Check my prints. These ELLs will pass. No, there
we go. And then finally here, I'll add a key four votes set to a random number from
negative 20 to 50.

All right. Let me clean out all this old code and we'll see if I messed up any of my,
see if I mess anything up and I just need my closing square bracket and a stomach
colon. Perfect. So a little ugly conversion there, but you can see it's just a very
simple array and that's it. We are ready to use this question factory. How in the
fixtures glass, say question factory, colon, colon new that will give us a new
instance of the question factory, then->create to create a single question. That's
still not very interesting, but let's try it rerun the fixtures Symfony console
doctrine fixtures, colon load press. Yes. So it will purge the database and no errors
over on the home page. Whenever you refresh. Oh, actually zero questions probably
because mine was unpublished. Let me load one more time. And there it is our one
question.

So this point you might be wondering why is this better? It's better because we've
only just started to scratch the service of what Foundry can do. Try this, want to
create 20 questions instead of just one change, create to create many 20 reload the
fixtures again, then go check out the homepage. Hello, our 20 questions with one line
of very readable code, but wait, there's more Foundry comes with a built in
integration with a library called faker and handy library for creating truly fake
data. Let's improve the quality of our fake data and see a few other cool things that
Foundry can do next.

