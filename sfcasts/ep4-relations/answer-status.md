# Filtering to Return only Approved Answers

As wonderful as our users are, sometimes we need to mark an answer as spam.
Or, maybe in the future, we might add a system that notices too many links in an
answer and marks it as "needs approval". So each answer will be one of three
statuses: needs approval, spam, or approved. And only answers with the *approved*
status should be visible on the site.

## Adding the Answer status Property

Right now, inside of our `Answer` entity, we don't have any way to track the
`status`. So let's add a new property for it. At your console run:

```terminal
symfony console make:entity
```

We're going to update the `Answer` entity. Add a new field called `status` and
make it a `string` type. This property will be a, kind of, `ENUM` field:
it'll hold one of three possible short status strings. Set the length to 15,
which will be more than enough to hold the status string. Make this required in
the database and... done!

Generate the migration immediately:

```terminal
symfony console make:migration
```

Let's go double check that *just* to make sure it doesn't contain any
surprises. It looks good:

> ALTER TABLE answer ADD status.

Close that, spin back to your terminal and execute it:

```terminal
symfony console doctrine:migrations:migrate
```

Because we have exactly three possible statuses, I'm going to add a constant for
each one. Now, if you're using PHP 8.1, you could use the new `enum` type to
help with this - and you totally should. But either way, you'll ultimately store
a string in the database.

Add `public const STATUS_NEEDS_APPROVAL = 'needs_approval'`. I just made up that
`needs_approval` part - that's what will be stored in the database. Copy that,
paste it twice, and create the other two statuses: `spam` and `approved`, setting
each to a simple string.

Awesome. Now default the `status` property down here to `self::STATUS_NEEDS_APPROVAL`:
comments will "need approval" unless we say otherwise.

*Finally*, down on `setStatus()`, let's add a sanity check: if someone passes
a status that is *not* one of those three, we should throw an exception. So
if not `in_array($status, [])`... and then I'll create an array with the
three constants: `self::STATUS_NEEDS_APPROVAL`, `self::STATUS_SPAM` and
`self::STATUS_APPROVED`. So if it's *not* inside that array, then throw a
new `InvalidArgumentException()` with a nice message.

A little gatekeeping to make sure that we always have a valid status.

## Creating Approved and Non-Approved Answer Fixtures

Now that the new `status` property is done, open `src/Factory/AnswerFactory.php`.
Down in `getDefaults()`, set `status` to `Answer::STATUS_APPROVED`.

So when we create answers via the factory, let's make them approved by default so
they show up on the site.

But I actually *do* want a mixture of approved and not approved answers in my
fixtures to make sure things are working. To allow that, add a new method:
`public function`, how about, `needsApproval()`, that will return `self`. Inside,
return `$this->addState()` and pass this an array with `status` set to
`Answer::STATUS_NEEDS_APPROVAL`.

Now go open the fixtures class: `src/DataFixtures/AppFixtures.php`. These 100
answers, thanks to `getDefaults()`, will all be approved. Let's *also* save
some "needs approval" answers. Do that with `AnswerFactory::new()` - to get a new
instance of `AnswerFactory`, `->needsApproval()`, `->many()` to say that we want 20,
and finally `->create()` to actually do the work.

Thanks to the `getDefaults()` method, for each `Answer`, this will create a new,
unpublished question to relate to... which is actually not what we want: we want
to relate this to one of the questions we've already created. Let's use the same
trick we used before. Inside the `new()` method, we can pass a callable. Use the
`$questions` variable to get it into scope... and then paste.

So this will create 20 new, "needs approval" answers that are set to a random
published `Question`. Phew! Let's get these loaded. At your terminal, run:

```terminal
symfony console doctrine:fixtures:load
```

No errors!

## Creating Question::getApprovedAnswers()

Cool. *But* how do we actually *hide* the non-approved answers from the frontend?

Go back to the homepage... and find a question with a lot of answers. This one has
10, so there's a *pretty* good chance that one of these is *not* approved and
should be hidden. But how *can* we hide those answers?

Inside of `show.html.twig`, we get the answers by saying `question.answers`.
So this is calling `$question->getAnswers()`, which, of course, returns *all* of
the related answers.

We *could* solve this by going back to `QuestionController` and, in the `show()`
action, executing a custom query through the `AnswerRepository` where question
equals this question *and* status = approved... and *then* passing that array
into the template.

But... ugggh, I don't want to do that! I *still* want to be able to use a
nice shortcut method in my template! It makes my life so much easier! So... let's
do that!

In the `Question` class... anywhere, but right after `getAnswers()` makes sense,
create a new function called `getApprovedAnswers()`. This will return a `Collection`,
just like `getAnswers()`: `Collection` is the common interface that `ArrayCollection`
and `PersistentCollection` both implement.

Inside, we're going to loop over the answers and *remove* any that are *not* approved.
We could do this with a `foreach` loop... but there's a helper method on
`Collection` for exactly this.

Return `$this->answers->filter()` and pass this a callback with an
`$answer` argument. This callback will be executed one time for *each* `Answer`
object inside the answers collection. If we return true, it will be included in the
final collection that's returned. And if we return false, it won't. So we're taking
the answers collection and filtering it.

Inside the callback, we need to check if this answer's status is "approved". Instead
of doing that here, let's add a helper method inside of `Answer`.

Down here, add `public function isApproved()` that will return a boolean. Inside, we
need return `$this->status === self::STATUS_APPROVED`.

Back over in `Question`, it's easy: include this answer if `$answer->isApproved()`.

Sweet! We now have a new method inside of `Question` that will only return
*approved* answers. All we need to do *now* is use this our template. In
`show.html.twig`, use it in both spots: `question.approvedAnswers`... and
`question.approvedAnswers`.

There's also a spot on the homepage where we show the count... make sure to use
`question.approvedAnswers` here too.

Ok! Moment of truth. Right now we have 10 answers on this question. When I refresh...
oh, it's still 10! Boo. We either have a bug... or that was bad luck and this question
has only *approved* answers. Click back. Find another question that has a lot of
answers. Let's see... try this one. We got it! This question originally had 11
answers, but now that we're only showing *approved* answers, we see 6.

So... this works! *But*.... there's a performance problem... and you may have
spotted it. Open up the profiler to see the queries. We're still querying for all
of the answers `WHERE question_id = 457`. But then... we're only rendering the six
*approved* ones. That's wasteful! What we *really* want is some way to have this
nice `getApprovedAnswers()` method... but make it query *only* for the approved
answers... instead of querying for *all* of them and filtering them in PHP.

Is that possible? Yes! Via an amazing "criteria" system.
