# Fetching the User Object

One of the *amazing* features of our site is that you can up vote and down vote
each answer. Right now, you don't even need to be logged in to do this. Let's
change that.

## Requiring Login to Vote

Find the controller that handles the Ajax call that's made when we vote: it's
`src/Controller/AnswerController.php`... the `answerVote()` method. Ok: I want to
require the user to be logged in to use this endpoint. Let's do that with an
annotation... or attribute: `@IsGranted`... then select that class and hit tab so
that it adds the `use` statement we need up on top. Inside, use
`IS_AUTHENTICATED_REMEMBERED`. Because we're using the remember me system, *this*
is the correct way to check if the user is simply logged in.

If we stop now, because we're not logged in, we won't be able to vote. Yay!
But it's going to look funny on the frontend because the vote links *are*
still visible. So let's hide those.

The template for this section is `templates/answer/_answer.html.twig`. Let's see...
down... here are the vote arrows. So we basically want to hide this entire `div`
section if we are *not* logged in. If `is_granted('IS_AUTHENTICATED_REMEMBERED')`,
find the closing `div`... here it is, and add `endif`.

When we refresh... yes! The vote links are gone.

## Fetching the User Object from a Controller

In a real app, when we save the vote to the database, we will probably also
store *who* voted so we can prevent a user from voting multiple times on the
same answer. We're *not* going to do that right now... but let's try something
simpler: let's log a message that includes the email address of who is voting.

But wait: how do we find out *who* is logged in? In a controller, it's easy peasy:
use the `$this->getUser()` shortcut. Check it out: on top, I'll say
`$logger->info('')` with the message:

> {user} is voting on answer {answer}

Pass this a second argument, which is called the logger "context". This is unrelated
to security... it's just kind of cool. The second argument is an array of any extra
data that you want to store along with the message. For example, we can set `answer`
to `$answer->getId()`. *And*... if you use this nifty `{answer}` format, then the
`answer` context will automatically be put into the message. We'll see that in a
minute.

For the `user`, get the current user with `$this->getUser()`... it's that easy.
This will give us the `User` *object*... and then we can call a method on it, like
`->getUserIdentifier()`, which we know will be the email.

Sweet! Let's test this thing! First... we need to log in - `abraca_admin@example.com`,
password `tada`. And... got it! It redirected us back to `/admin/login` because,
a few minutes ago, we tried to access this and were redirected to the login form.
So it's technically still in the session as our "target path".

Head to the homepage, click into a question... and vote! On the web debug toolbar,
we can see that Ajax call... and we can even open the *profiler* for that request
by clicking the link. Head to `Logs`. Sweet!

> `abraca_admin@example.com` is voting on answer 498

## Custom Base Controller Class

Back in the controller, *we* know that `$this->getUser()` will return *our* `User`
object... which means that we can call whatever methods it has. For example, our
`User` class has a `getEmail()` method. So this *will* work. But notice that my
editor did *not* auto-complete that. Bummer!

Hold Command or Ctrl and click `getUser()`. This jumps us to the core
`AbstractController`. Ah... the method advertises that it returns a `UserInterface`,
which is true! But more specifically, *we* know that this will return *our* `User`
entity. Unfortunately, because this method doesn't *say* that, we don't get nice
auto-completion.

I use `$this->getUser()` a *lot* in my controllers... so I like to "fix" this.
How? By creating a custom base controller class. Inside of the `Controller/`
directory, create a new class called `BaseController`.

You can make this `abstract`... because we won't ever use it directly. Make it
extended `AbstractController` so that we get the normal shortcut methods.

Creating a custom base controller is... just kind of a nice idea: you can add
whatever extra shortcut methods you want. Then, in your *real* controllers, you
extend this and... have fun! I'm *only*going to do this in `AnswerController`
right now... just to save time.

Anyways, if we stopped now... congratulations! This doesn't change *anything* because
`BaseController` extends `AbstractController`. To solve *our* problem, we don't
need to *add* a new shortcut method... we just need to give our editor a *hint* so
that it knows that `getUser()` returns *our* `User` object... not just a `UserInterface`.

To do that, above the class, add `@method` then `User` then `getUser()`.

Done! Back in `AnswerController`, re-type `getEmail()` and... yes! We get
auto-completion!

Cool! So the way that you get the current user in a controller is `$this->getUser()`.
But there are a few *other* places where we might need to do this, like in Twig
or from a service. Let's check those out next.
