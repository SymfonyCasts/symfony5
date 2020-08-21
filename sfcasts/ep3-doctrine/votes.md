# Smarter Entity Methods

We are on an epic quest to make everything on the question page truly dynamic.
In the design, each question can get up and down voted... but this doesn't work
yet and the vote count - + 6 - is hardcoded in the template.

To get this working, let's add a new `votes` property to the `Question` entity.
When a user clicks the up button, we will increase the votes. When they click
down, we'll decrease it. In the future, when we have a true user authentication
system, we could make this smarter by recording *who* is voting and preventing
someone from voting multiple times. But our simpler plan will work *great* for
now.

## Adding the votes Property

Step one: add a new field to the entity. We *could* do this by hand by copying
an existing property, adjusting the options and then adding getter and setter
methods for it. But... it's easier just to run `make:entity`. At your terminal,
run:

```terminal
php bin/console make:entity
```

Once again, I *could* use `symfony console`... and I probably should. But since
this command doesn't need the database environment variables, `bin/console` also
works.

This time, enter `Question` so that we can *update* the entity. Yea! `make:entity`
can also be used to *modify* an entity! Add a new field called `votes`, make it
an `integer` type and set it to *not* nullable in the database. Hit enter to finish.

Ok! Let's go check out the `Question` entity. It looks *exactly* like we expected:
a `$votes` property and, at the bottom, `getVotes()` and `setVotes()` methods.

[[[ code('c60363cb05') ]]]

Let's generate the migration for this. Run:

```terminal
symfony console make:migration
```

so that the Symfony binary can inject the environment variables. When this finishes,
I like to double check the migration to make sure it doesn't contain any surprises.

[[[ code('db70a2e45c') ]]]

This looks perfect. Execute it with:

```terminal
symfony console doctrine:migrations:migrate
```

Beautiful!

## Default Values with Doctrine

But... this *did* break one little thing. Go to `/questions/new` - our endpoint
to create a new `Question`. And... woh! There's an exception coming from the database:

> Integrity constraint violation: Column 'votes' cannot be null

Hmm, yea: that makes sense. We didn't set the `votes` property, so it's trying
to create a new row with `null` for that column. What we probably want to do is
default `votes` to be *zero*. How can we set a default value for a column in
Doctrine?

Actually, that's not really the right question to ask. A better question
would be: how can we default the value of a *property* in *PHP*?

And the answer to that is simple. In `Question`, just say `private $votes = 0`

[[[ code('aa15b243d9') ]]]

It's that easy. Now, when we instantiate a `Question` object, `votes` will be zero.
And when it saves the database... the `votes` *column* will be zero instead of null.
There *is* actually a way inside the `@ORM\Column` annotation to *specifically*
set the default value of the column in the *database*, but I've never used it.
Setting the default value on the property works beautifully.

Hit the URL again and... it works!

## Giving getVotes() a Non-Nullable Return Type

Back in the entity, scroll down to `getVotes()`. The return type of this method
is a *nullable* integer. It was generated that way because there was no guarantee
that the `votes` property would ever be set: it *was* possible for `votes` to
be `null` in PHP. But thanks to the change we just made, we can now *remove*
the question mark: we know that this will *always* be an integer.

[[[ code('084c7a1c45') ]]]

## Rendering the Vote

Before we hook up the voting functionality, let's *render* the vote count.
To make this more interesting - because all of the questions in the database right
now have *zero* votes - let's set a random vote number for new questions. In
`QuestionController`, scroll up to the `new()` action. Near the bottom, add
`$question->setVotes()` and pass a random number from negative 20 to 50.

[[[ code('bfa82a88c6') ]]]

Back on the browser, I'll refresh `/questions/new` a few times to get some fresh
data. Copy the new `slug` and put that into the address bar to *view* the new Question.

*Rendering* the true vote count should be easy. Open up
`templates/question/show.html.twig`. Find the vote number... `+ 6` and replace it
with `{{ question.votes }}`

[[[ code('291eac9daf') ]]]

That's good boring code. Back at the browser, when we refresh... nice! This has
minus 10 votes... it must not be a great question.

## Adding the + / - Sign

Because the vote is negative, it naturally has a "minus" sign next to it.
But that *won't* be there for a *positive* number. Let me create another
`Question` that will hopefully have a positive vote number. Yes! When it's
positive, it's just 10, not + 10.

But... our designer actually *does* want positive vote numbers to have a plus sign.
No problem. We could add some extra Twig logic: if the number is positive,
then add a plus sign before printing the votes.

There's nothing wrong with having simple logic like this in Twig. But if there is
*another* place that we could put that logic, that's usually better. In this case,
we could add a new method to the `Question` entity itself: a method that returns
the *string* representation of the vote count - complete with the + and - signs.
That would keep the logic out of Twig and even make that code *reusable*. Heck!
We could also unit test it!

Check it out: inside the `Question` entity - it doesn't matter where, but I'll put
it right after `getVotes()` so that it's next to related methods - add
`public function getVotesString()` with a `string` return type. Inside, I'll paste
some logic.

[[[ code('a874042f40') ]]]

This first determines the "prefix" - the plus or minus sign - and then adds
that before the number - using the `abs()` function to avoid two minus signs
for negative numbers. In other words, this returns the *exact* string we want.
How nice is that? Easy to read & reusable.

[[[ code('10bf2396bb') ]]]

To use it in Twig, we can say `question.votesString`.

[[[ code('94e8733378') ]]]

That's it. Let's try it! Over on the browser, refresh and... there it is! + 10!

The *cool* thing about this is that we said `question.votesString`. But... there
is *no* `$votesString` property inside of `Question`! And... that's fine! When we
say `question.votesString`, Twig is smart enough to call the `getVotesString()`
method.

Now that we're printing the vote number, let's make it possible to *click* these
up and down vote buttons. This will be the first time we execute an *update*
query *and* we'll get to talk more about "smart" entity methods. That's all next.
