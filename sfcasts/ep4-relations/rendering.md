# Rendering Answer Data & Saving Votes

So let's render some answer data! Delete the old, hardcoded `$answers` and the
`foreach`. Perfect: we're now passing this collection of `Answer` objects
into the template. Let's go open this template... because it'll probably need
a few tweaks: `templates/question/show.html.twig`.

If you scroll down a bit - here it is - we loop over the `answers` variable. That
*will* still work: the Doctrine collection *is* something that we can loop over.
But the `answer` variable will now be an `Answer` *object*. So, to get the content,
use `answer.content`. We can also remove the hardcoded username and replace it
with `answer.username`.

And there's... one more spot. The vote count is hardcoded. Change that to
`answer.votes`.

Ok! Let's see how it looks. Refresh and... alright! We have dynamic answers!

## Fetching the Answers Directly in Twig

But... we're *still* doing too much work! Head back to the controller and completely
remove the `$answers` variable. Why are we doing this? Well, we know that we can
say `$question->getAnswers()` to get all the answers for a question. And since we're
passing a `$question` object into the template... we can call that method directly
from Twig!

In `show.html.twig`, we don't have an `answers` variable anymore. That's ok because
we can say `question.answers`.

As reminder, when we say `question.answers`, Twig will first try to access the
`$answers` property directly. But because it's private, it will *then* call the
`getAnswers()` method. In other words, this is calling the *same* code that we
were using a few minutes ago in our controller.

Back in the template, we need to update one more spot: the `answer|length` that
renders the *number* of answers. Change this to `question.answers`.

Refresh now and... we're still good! If you open the Doctrine profiler, we have
the same 2 queries. But now this second query is literally being made from
*inside* of the Twig template.

## Saving Answer Votes

While we're here, in the first Symfony 5 tutorial, we wrote some JavaScript
to support this answer voting feature. When we click, it... well... *sort of*
works? It makes an Ajax call: we can see that down on the toolbar. But since
there were no answers in the database when we built this, we... just "faked" it
and returned a new random vote count from the Ajax call. *Now* we can make this
actually work!

Before I recorded this tutorial, I refactored the JavaScript logic for this into
Stimulus. If you want to check that out, it lives in
`assets/controllers/answer-vote_controller.js`.

The important thing for *us* is that, when we click the vote button, it makes an
Ajax call to `src/Controller/AnswerController.php`: to the `answerVote` method.
Inside, yup! We're grabbing a random number, doing nothing with it, and returning
it.

To make the voting system *truly* work, start in `show.html.twig`. The way that
our Stimulus JavaScript knows what URL to send the Ajax call to is via this
`url` *variable* that we pass into that controller. It's generating a URL to the
`answer_vote` route... which is the route above the target controller. Right now,
for the `id` wildcard... we're passing in a hardcoded 10. Change that to `answer.id`.

Back in the controller, we need to take this `id` and query for the `Answer` object.
The *laziest* way to do that is by adding an `Answer $answer` argument. Doctrine will
see that entity type-hint and automatically query for an `Answer` where `id`
equals the `id` in the URL.

Remove this TODO stuff... and for the "up" direction, say
`$answer->setVotes($answer->getVotes() + 1)`. Use the same thing for the down
direction with *minus* one.

If you want to create fancier methods inside `Answer` so that you can say things
like `$answer->upVote()`, you *totally* should. We did that in the `Question`
entity in the last tutorial.

At the bottom, return the *real* vote count: `$answer->getVotes()`. The only thing
left to do *now* is save the new vote count to the database. To do that, we
need the entity manager. Autowire that as a new argument -
`EntityManagerInterface $entityManager` - and, before the `return`, call
`$entityManager->flush()`.

Ok team! Test drive time! Refresh. Everything still looks good so... let's vote!
Yes! That made a successful Ajax call and the vote increased by 1. More importantly,
when we refresh... the new vote count stays! It *did* save to the database!

Next: we've already learned that any *one* relationship can have *two* sides,
like the `Question` is a `OneToMany` to `Answer`... but also `Answer` is `ManyToOne`
to `Question`. It turns out, in Doctrine, each side is given a special name *and*
has an important distinction.
