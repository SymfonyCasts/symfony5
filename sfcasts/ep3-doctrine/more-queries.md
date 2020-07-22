# Custom Repository Class

Now that the show page is working, let's bring the homepage to life! This time,
instead of querying for one `Question` object, we want to query for *all* of them.

## findAll() for All Data

Head over to our `QuestionController` and scroll up to `homepage()`. Ok, to fetch
data, autowire the entity manager with `EntityManagerInterface $entityManager`.
Next, add `$repository = $entityManager->getRepository(Question::class)`.
And finally, `$questions = $repository->findAll()`. Let's `dd($questions)` to
see what this looks like.

## Rendering all the Questions

Ok, refresh the homepage. There we go! 12 `Question` objects for the 12 rows in
my table. *Now* we're dangerous because we can pass these into our template.
Add a second argument to `render()` - an array - and pass a `questions` variable
set to our array of `Question` objects.

Ok, pop open the template: `templates/question/homepage.html.twig`. Let's see:
the homepage currently has two hard coded questions. I want to loop right inside
the `row`: `{% for question in questions %}`. Trace the markup down to see where
it ends and... add `{% endfor %}`. Delete the 2nd hard-coded question completely.

Perfect. *Now* it's just like the show page because we have a `question` variable.
The first thing to update is the question name - `{{ question.name }}`. Then,
the slug also needs to be dynamic: `question.slug`. Below. for the question text,
use `{{ question.question|parse_markdown }}`. We might also want to only show *some*
of the question on the page - we could do that by adding a new method - like
`getQuestionPreview()` to the entity - and using that here. We'll see this idea
of custom entity methods later.

At the bottom, there's one more link - use `question.slug`.

Done! Doctrine makes it easy to query for data and Twig makes it easy to render.
Let's try it: refresh and... *cool*.

## Ordering the Data

Each question has a random `askedAt` date - you can it by clicking into each
What we probably want to do is put the *newest* questions on the top of the page.
In other words, we want to do the *same* query but with an `ORDER BY askedAt DESC`
on it.

If yo click the database icon on the web debug, you can see that the query doesn't
have an `ORDER BY` yet. When you're working with the built-in methods on the
repository class, you're a bit limited - there are many custom things that these
methods simply *can't* do. For example, the `findAll()` method doesn't have any
arguments: there's no way to add ordering info or anything else. Soon we'll learn
how to write *custom* queries so we can do whatever we want.

But, in this case, there *is* another method that can help: `findBy()`. Pass
this an empty array - we don't need *any* WHERE statements - and then another
array with `'askedAt' => 'DESC'`.

Let's try it! Refresh! And... click the first: 10 days ago. Click the second:
1 month ago! I think we got it! If we jump into the profiler... yes! It has
`ORDER BY asked_at DESC`.

## EntityRepository

We've now pushed the built-in repository methods *about* as far as they can go.

I have a question: when we call `getRepository()`, what does that *actually*
return? It's an object, but what *type* of object? The answer is:
`EntityRepository`.

In PhpStorm, I'll press Shift+Shift and type `EntityRepository.php`. I want
to actually *see* what this looks like. Make sure to include all "non project items"
There we go.

`EntityRepository` lives deep down inside of Doctrine and *it* is where the
methods we've been using live, like `find()`, `findAll()`, `findBy()`,
`findOneBy()` and some more.

## Our Custom Repository Class

But check this out: in the controller, `dd($repository)`. When we refresh...
surprise! I lied! Sort of...

Instead of being an instance of `EntityRepository` - like I promised - this is
an instance of `App\Repository\QuestionRepository`. That's a class that lives
in our project! Open it up: `src/Repository/QuestionRepository.php`.

When we originally ran `make:entity` to generate our `Question`, it actually
generated *two* classes: the `Question` class *and* this `QuestionRepository`.
This class extends another called `ServiceEntityRepository`. And if you hold
Command or Ctrl and click into that, *that* class extends `EntityRepository`!
That's the class we were just looking at.

The point is, when we ask for the repository for the `Question` entity, Doctrine
*actually* returns a `QuestionRepository` object. But since that ultimately
extends `EntityRepository`, we have access to all the helper methods like
`findAll()` and `findBy()`.

But... how does Doctrine knows to give us an instance of this class? How does
it connect the `Question` entity to `QuestionRepository`? Is it relying on a
naming convention?

Nope! The answer is at the top of the `Question` class: we `@ORM\Entity()` with
`repositoryClass=QuestionRepository::class`. This was generated for us by
`make:entity`.

Here's the big picture: when we call `getRepository()` and pass it
`Question::class`, Doctrine will give an instance of `QuestionRepository`. And
because that extends `EntityRepository`, we get access to the shortcut methods.

## Custom Repository Methods

The reason this is *cool* is that anytime we need to write a custom query, we can
add a new *method* inside of `QuestionRepository`.

The class already has an example: uncomment the `findByExampleField()` method.
If I have a `findByExampleField()` method in the repository, it means that we
can *call* this method from the controller.

In a few minutes, we're going to write a custom query that finds all questions
`WHERE askedAt IS NOT NULL`. In `QuestionRepository`, let's create a method to
hold this. How about: `findAllAskedOrderedByNewest()` and this won't need any
arguments.

In the controller, remove the `dd()` and say
`$questions = $repository->findAllAskedOrderedByNewest()`.

Of course, that won't  work yet because the logic is all wrong, but it *will*
call our new method.

Next, let's learn about DQL and the query builder. Then, we'll create a custom
query that will return the *exact* results we want.
