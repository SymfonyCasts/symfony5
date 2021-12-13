# Leveraging the Question Owner

Now that each `Question` has an `owner` - a `User` object - it's time to celebrate!
On the frontend, we can start rendering *real* data... instead of always having
the same cat picture and question written by the same Tisha. Those are both
hard-coded, though we *do* love Tisha the cat here at SymfonyCasts.

Start on the homepage. Open up `templates/question/homepage.html.twig`.
And... here's where we loop over the questions. First, for the avatar, we can use
the helper method we created earlier: `{{ question.owner.avatarUri }}`:

[[[ code('563d8574b2') ]]]

Next... down towards the bottom, here's where we print the question owner's
name. Let's use `question.owner.displayName`:

[[[ code('b6a9704faa') ]]]

100 experience points for using *two* custom methods in a row.

And now... our page is starting to look real! Click into a question. Let's do the
same thing for the show page. Open that template: `show.html.twig`.

For the avatar, use `question.owner.avatarUri`:

[[[ code('68e62d526a') ]]]

Then... down here, for the name, `{{ question.owner.displayName }}`:

[[[ code('56d4799e57') ]]]

Oh, and I forgot to do one thing. Copy that, head back up to the avatar... so that
we can also update the `alt` attribute:

[[[ code('b88680b41f') ]]]

I also need to do that on the homepage... here it is:

[[[ code('2049427214') ]]]

Let's try this! Refresh the page and... we are dynamic!

## Creating the Question Edit Page

In a real site, we're probably going to need a page where the owner of this question
can edit its details. We're not going to build this out all the way - I don't want
to dive into the form system - but we *are* going to get it started. And this is
going to lead us to a really interesting security situation.

Over in `src/Controller/QuestionController.php`... find the `show()` action. Let's
cheat by copying this and pasting it. Change the URL to `/questions/edit/{slug}`,
tweak the route name and update the method name. Inside, just render
a template: `question/edit.html.twig`:

[[[ code('b336a9cc15') ]]]

Cool! In `templates/question/`, create that: `edit.html.twig`.

I'll paste in a basic template:

[[[ code('7647e94174') ]]]

Nothing special here, except that I'm printing the dynamic question text.
There's no actually form... since we're focusing on security... but pretend
that there is.

## Linking to the Edit Page

Before we try this page, head back into the question show template. Let's add an
edit link to help out the owner. Actually, find the `h1`. Here we go.

Wrap this in a div with `class="d-flex justify-content-between"`... and then close
and indent:

[[[ code('8834968757') ]]]

*Now* add a link with `href=` `path('app_question_edit')`. And, of course, we need
to pass this the wildcard: `id` set to `question.id`. Oh... wait, actually,
the wildcard is `slug`:

[[[ code('df02d00a9c') ]]]

So use `slug` set to `question.slug`:

[[[ code('a2ab2a991c') ]]]

Cool. Then say "Edit"... and give this a few classes for prettiness.

Thanks to this... we have an edit button! Oh, but we need some margin! Add `mb-2`:

[[[ code('e8701a1343') ]]]

and... much better. Click that. This is the question edit page... which is not
*really* an edit page... but pretend that it is.

*Now* let's circle back to the topic of security. Because... we can't just let
*anyone* get to this page: only the *owner* of this question should be able to
edit it.

So inside of `QuestionController`, we need a security check. We first need
to make sure that the user is logged in. Do that with `$this->denyAccessUnlessGranted()`
passing `IS_AUTHENTICATED_REMEMBERED`:

[[[ code('a98fa7d89b') ]]]

Thanks to this, we're guaranteed to get a `User` object if we say `$this->getUser()`.
We can use that: if `$question->getOwner()` does not equal `$this->getUser()`,
then someone *other* than the owner is trying to access this page. Deny access
with `throw $this->createAccessDeniedException()`. I'll say:

> You are not the owner!

But, remember, these error messages are only shown to developers:

[[[ code('dea2a6f944') ]]]

Ok, so right now I'm *not* logged in at all. So if we refresh, it kicks us back
to the login page. So... yay! We just successfully prevented anyone *other* than
the owner from accessing this edit page!

But... bad news friends: I don't like this solution. I don't like putting any
manual security logic inside my controller. Why? Because it means that we're going
to need to repeat that logic in Twig in order to hide or show the edit button.
And what if our logic gets more complex? What if you can edit a question if
you're the owner *or* if you have `ROLE_ADMIN`? Now we would need to update and
maintain the duplicate logic in two places at *least*. Nope, we do *not* want
to duplicate our security rules.

So next let's learn about the voter system, which is the key to centralizing all
of this authorization logic in a beautiful way.
