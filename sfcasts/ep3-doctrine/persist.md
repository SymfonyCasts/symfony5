# Persisting to the Database

We have a beautiful entity class and, thanks to the migrations that we just
executed, we have a corresponding `question` table in the database. Time to
insert some data!

## Think "Classes", not "Tables"

One of the *key* philosophies of Doctrine is that it doesn't want you to
think about tables and columns. Doctrine wants you to think about classes and
properties... and then leave all the details of saving and querying to a database
table up to *it* to worry about.

So instead of asking:

> How can I insert a new row in the `question` table?

We need to think:

> Let's create a `Question` object, populate it with data and then ask Doctrine
> to save it.

## Creating a Question Endpoint

To play with all of this, let's add a new, sort of, fake page - `/questions/new`.
When we go there, I want a new question to be added to the database.

Open up `src/Controller/QuestionController.php`, which already holds the homepage
and show page. At the bottom, add `public function ` and... let's call it `new()`.
Above, say `@Route()` with `/questions/new`.

To keep things simple, return a `new Response()` - the one from
HttpFoundation - with `Time for some Doctrine magic!`

There's no Doctrine logic yet, but this *should* work. At the browser, hit enter
and... woh! It *doesn't* work! There's no error, but this is *not* the
page we expected. It looks like the question *show* page. And, in fact, if you
look down on the web debug toolbar... yea! The route is `app_question_show`!

The problem is that the url `/questions/new` *does* match this route! It look like
"new" is the `slug`. Routes match from top to bottom and Symfony stops as soon
as it finds the *first* matching route. So the easiest fix is to just move the
*more* specific route above this one.

This doesn't happen too often, but this is how I handle it.

Now when we go refresh... got it!

## Creating the Question Object

Ok: time to work! Eventually - in a future tutorial - this page will render a form
where the user can fill out all the information about their question. When
they submit, we will save that question to the database.

But we're not going to talk about Symfony forms yet. Instead, let's
"fake it" inside the controller. Let's create a `Question` object, set some
hardcoded data on it and ask Doctrine to save it.

And because there is *nothing* special about our entity class, instantiating it
looks *exactly* like you would expect: `$question = new Question()` and I'll
auto-complete this so that PhpStorm adds the `Question` use statement.
Next, call `$question->setName('Missing pants')` - an unfortunate magical
side effect of an incorrect spell. And `->setSlug('missing-pants')` with a
random number at the end so that each one is unique.

For the *main* part of the question, call `->setQuestion()` and, because this is
long, I'll use the multiline syntax - `<<<EOF` - and paste in some content.
You can copy this from the code block on this page or use any text.

The *last* field is `$askedAt`. Let's add some randomness
to this: if a random number between 1 and 10 is greater than 2,
then call `$question->setAskedAt()`. Remember: `askedAt` *is* allowed to be
`null` in the database... and if it *is*, we want that to *mean* that the user
hasn't *published* the question yet. This if statement will give us a nice mixture
of published and unpublished questions.

Also remember that the `$askedAt` property is a `datetime` field. This means that it
will be a `DATETIME` type in MySQL: a field that is ultimately set via a date *string*.
But in PHP, instead of dealing with *strings*, *thankfully* we get to deal with
`DateTime` *objects*. Let's say `new \DateTime()` and add some randomness here too:
`sprintf('-%d days')` and pass a random number from 1 to 100.

So, the `askedAt` will be anywhere from 1 to 100 days ago.

Ok! Our `Question` object is done! Add a `dd($question)` at the bottom, then move
over, refresh and... hello nice, boring `Question` object! Notice that the `id`
property is still `null` because we haven't saved it to the database yet.

## The EntityManagerInterface Service

So... how *do* we ask Doctrine to save this? When we installed Doctrine,
one of the packages we downloaded was DoctrineBundle. From the Symfony Fundamentals
course, you might remember that the *main* thing that a bundle gives us is new
*services* in the container. And even though Doctrine is *super* powerful, it
turns out that there is just *one* Doctrine service that we'll use 99% of the time.
This *one* service is capable of both saving and fetching... which... is really
all Doctrine does.

To find the service, head to your terminal and run:

```terminal
php bin/console debug:autowiring doctrine
```

This returns several services, but most are lower level. The one we want -
which is the *most* important service *by far* in Doctrine - is
`EntityManagerInterface`.

Let's go use it! Back in the controller, add a new argument to autowire this:
`EntityManagerInterface $entityManager`.

## persist() and flush()

Below, remove the `dd()`. How do we save? Call
`$entityManager->persist()` and pass the object to save. And
then `$entityManager->flush()`.

Yes, you need *both* lines. The `persist()` call *simply* says:

> Hey Doctrine! Please be "aware" of this `Question` object.

The persist line does *not* make *any* queries. The `INSERT` query
happens when we call `flush()`. The `flush()` method says:

> Yo Doctrine! Please look at all of the objects that you are "aware" of and
> make all the queries you need to save those.

So *this* is how saving looks: a `persist()` and `flush()` right next to each
other. If you ever needed to, you could call `persist()` on 5 different objects
and *then* call `flush()` once at the end to make *all* of those queries at
the same time.

*Anyways*, now that we have a `Question` object, let's make the `Response`
more interesting. I'll say `sprintf` with:

> Well hallo! The shiny new question is id #%d, slug: %s

Passing `$question->getId()` for the first placeholder and
`$question->getSlug()` for the second.

Ok, back at the browser, *before* saving, the `Question` object had *no*
`id` value. But now when we refresh... yes! It has an id! After saving,
Doctrine automatically sets the new `id` on the object. We can refresh over and
over again to add more and more question rows to the table.

Let's go see them! If you ever want to make a query to see something, Doctrine
has a handy `bin/console` command for that:

```terminal
symfony console doctrine:query:sql 'SELECT * FROM question'
```

And... yes! Here is a dump of the 8 rows in the table.

Next: we know how to save. So how can we query to *fetch* data?
