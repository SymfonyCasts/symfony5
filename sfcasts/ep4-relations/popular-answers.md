# Most Popular Answers Page

Let's build a "top answers" page where we list the answers with the most votes
for *all* questions on our site.

## Creating the Route, Controller & Template

Open `AnswerController` and create a new public function called `popularAnswers()`.

[[[ code('022647b9cb') ]]]

Add an `@Route()` above this - or use the `Route` attribute if you're on PHP 8 -
with the URL `/answers/popular`. Immediately give this a name so we can link to it:
`app_popular_answers`.

[[[ code('8b8880b54c') ]]]

Inside, render a template: `answer/popularAnswers.html.twig`.

[[[ code('6f3a1946f6') ]]]

Now, copy that template name and, down in the `templates/` directory, create the
new `answer/` folder... and inside, the new file: `popularAnswers.html.twig`.
I'll paste in a little structure to get us started.

[[[ code('7193e18f1f') ]]]

This extends `base.html.twig`, overrides the `title` block to customize the title...
and in the `body` block, adds some basic structure. Let's put an `<h1>` that says
"Most Popular Answers".

[[[ code('4dbe7149bc') ]]]

Before we try this, open up `base.html.twig` so we can link to this. Scroll down a
little. Inside of the `navbar`, we have an empty `<ul>` that's just *waiting* for
a link. Add an `<li>` with `class="nav-item"`... and an `a` tag inside with `href`
set to our new page: `path('app_popular_answers')`. Say "Answers" for the link
text... and this needs `class="nav-link"`.

[[[ code('67021c1523') ]]]

*Now* let's try this thing. Refresh... and click the link. Hello normal, boring,
but *functional* page.

## Querying for the Most Popular Answers

To get the most popular answers, we need a custom query. Well, technically we could
use the `findBy()` method on `AnswerRepository` and use its "order by" argument.
But let's add a full custom repository method instead: that will be nice and
descriptive.

Open up `AnswerRepository`. At the bottom, add the method. Let's call it
`findMostPopular()` and set the return type to an array. Like normal, I'll use
PHPDoc to advertise that, more specifically, this will return an array of
`Answer` objects.

[[[ code('5f69449e12') ]]]

Inside, it's a simple query: return `$this->createQueryBuilder('answer')`,
`->addCriteria()` and reuse `self::createApprovedCriteria()` so that this only returns
*approved* answers. 

[[[ code('b2aee92e9a') ]]]

Then `->orderBy('answer.votes', 'DESC')`, `->setMaxResults(10)`
to only return the top 10 answers, `->getQuery()`, `->getResult()`.

[[[ code('ae4d9d9600') ]]]

Beautiful! Back in the controller, autowire `AnswerRepository $answerRepository`,
and then we can say `$answers = $answerRepository->findMostPopular()`. 

[[[ code('4b6397ae4e') ]]]

Add a second argument to `render()` so that we can pass an `answers` variable to Twig
set to this array of answers.

[[[ code('dab86b98f3') ]]]

In the template, add a `ul` and loop over `answers` with
`{% for answer in answers %}`. Let's start real simple: render `answer.votes`
so we can at *least* make sure that we have the most popular on top.

[[[ code('ae3fc63b6a') ]]]

Spin over to your browser, refresh and... got it! 10 answers with the most highly
voted on top.

## Reusing the Answer Templates

So on the question show page, we already have a nice structure for rendering answers.
I want to reuse this on our new popular answers page. Open `question/show.html.twig`.
Select everything inside the `for` loop - the entire `<li>` that renders a single
answer - and copy it. Then, in the `templates/answer/` directory, create a new file
called `_answer.html.twig`... and paste!

[[[ code('1337459dc8') ]]]

Back in `show.html.twig`, delete all of this and replace it with
`{{ include('answer/_answer.html.twig') }}`.

[[[ code('9058a78f62') ]]]

Now copy *that* line and, in the popular answers template, repeat this! The new
template *includes* the `<li>` element... so this will fit perfectly inside of
our `ul`.

[[[ code('549da015cd') ]]]

## Conditionally Rendering the Answer's Question

Phew! Let's check it! Refresh and... very nice! But hmm, in *this* context, we really
need to render which *question* this answer is answering. We *don't* want to do
that on the question show page - that would be redundant - but we *do* want it here.

To allow that, in `popularAnswers.html.twig`, add a second argument to `include()`
and pass in a new variable called `showQuestion` set to `true`.

[[[ code('351b19f353') ]]]

In `_answer.html.twig`, we can use that: if `showQuestion|default(false)` and `endif`.
Thanks to the `default` filter, if this variable is *not* passed, instead of an
error, it'll default to false.

[[[ code('a878988869') ]]]

Inside, add an `<a>` tag with `href=""` set to `{{ path('app_question_show') }}`:
the route to the question show page. This route needs a `slug` parameter set to
`answer.question.slug`. Also give this some classes: `mb-1` and `link-secondary"`.
For the text, say `<strong>` "Question" and then print the question text:
`answer.question.question`.

[[[ code('b9536f1cb5') ]]]

That *does* look funny, but... it's correct: `answer.question` gives us the `Question`
object... then the last part reads *its* `question` property.

Back at our browser, refresh and... yikes! That *technically* works but these
questions are *way* too long! We need to shorten them!

Next, let's learn about Twig's powerful `u` filter *and* add a method to our
`Answer` class that will make our code a *whole* lot more readable.
