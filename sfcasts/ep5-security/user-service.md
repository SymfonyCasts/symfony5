# Custom User Methods & the User in a Service

We know how to fetch the current user object in a controller. What about from Twig?
Head to `base.html.twig`. Let's see... this is where we render our "log out" and
"log in" links. Let's try to render the first name of the user right here.

## App.user In Twig

How? In Twig, we have access to a *single* global variable called `app`, which has
lots of useful stuff on it, like `app.session` and `app.request`. It *also* has
`app.user` which will be the current `User` object or `null`. So we can say
`app.user.firstName`:

[[[ code('35f8b1dcaf') ]]]

This is safe because we're *inside* of the `is_granted()` check... so we *know*
there's a `User`.

Let's try it! Close the profiler, refresh the page and... perfect! Apparently my
name is Tremayne!

Now that we've got this... time to make it fancier. Inside of the `is_granted()` check,
I'm going to paste in a big user menu: you can get this from the code block on this
page:

[[[ code('e530102feb') ]]]

This is *completely* hard-coded to start... but it renders nicely!

Let's make it dynamic... there are a few spots. For the image, I'm using an
avatar API. *We* just need to take out the "John Doe" part and print the user's
*real* first name: `app.user.firstName`. Oh, then pipe that into `|url_encode`
so it's safe to put in a URL. Also render `app.user.firstName` inside the `alt`
text:

[[[ code('091bdf7f97') ]]]

For the "log out" link, steal the `path()` function from below... and put it here:

[[[ code('2fc4255d4c') ]]]

Delete the old stuff at the bottom to finish this up:

[[[ code('4235857e51') ]]]

Sweet! When we refresh.. voilà! A real user drop-down menu.

## Adding Custom Methods to User

I've mentioned a few times that our `User` class is *our* class.... so we are free
to add whatever methods we want to it. For example, imagine that we need to get the
user's avatar URL in a few places on our site... and we don't want to repeat this
long string.

Copy this and then go open the `User` class: `src/Entity/User.php`. All
the way at the bottom, create a new `public function getAvatarUri()`. Give this
an `int $size` argument that defaults to `32`... and a `string` return type:

[[[ code('11816e9eff') ]]]

Paste the URL as an example. Let's return the first part of that...
add a `?` - which I totally just forgot - then use `http_build_query()`:

[[[ code('f877e76619') ]]]

Pass this an array... with the first query parameter we need: `name` set to
`$this->getFirstName()`.

Oh, but we can be even smarter. If you scroll up, the `firstName` property is
allowed to be `null`:

[[[ code('a4f20b77e6') ]]]

It's an optional thing that a user can provide. So, back down in the method,
use `getFirstName()` if it has a value... else fallback to the user's email.
For `size`, which is the second query parameter, set it to `$size`... and we
also need `background` set to `random` to make the images more fun:

[[[ code('4a11168db9') ]]]

Thanks to this nice little method, back in `base.html.twig` we can replace all of
this with `app.user.avatarUri`:

[[[ code('49d8dd9533') ]]]

You can also say `getAvatarUri()`: both will do the same thing.

If we try it... broken image! Ryan: go add the `?` you forgot, you knucklehead.
`http_build_query` adds the `&` between the query parameters, but we still need
the first `?`:

[[[ code('f881376787') ]]]

Now... much better!

But we can make this even better-er! In `base.html.twig`, we're using
`app.user.firstName`:

[[[ code('f162f0eeb5') ]]]

As we just saw, this *might* be empty. So let's add one more helper method to
`User` called `getDisplayName()`, which will return a `string`:

[[[ code('0414b064fc') ]]]

I'll steal some logic from above... and return that:

[[[ code('31807ed413') ]]]

So we either return the first name or the email. We can use this up in
`getAvatarUri()` - `getDisplayName()`:

[[[ code('91049a5040') ]]]

And also in `base.html.twig`:

[[[ code('c384bcf30a') ]]]

When we refresh... yup! It still works!

## Security Service: Fetching the User in a Service

Ok: we have now fetched the `User` object from a controller via `$this->getUser()`...
and in Twig via `app.user`. The only other place where you'll need to fetch the
`User` object is from within a *service*.

For example, a couple of tutorials ago, we created this `MarkdownHelper` service:

[[[ code('a54488219c') ]]]

We pass it markdown, it converts that into HTML... and then... profit... or
something. Let's pretend that we need the `User` object inside of this method:
we're going to use it log another message.

If you need the currently authenticated `User` object from a service, you can
get it via *another* service called `Security`. Add a new argument type-hinted
with `Security` - the one from `Symfony\Component` - called `$security`. Hit
`Alt` + `Enter` and go to "Initialize properties" to create that property and set it:

[[[ code('fe80c5aee3') ]]]

Because I'm using PHP 7.4, this added a *type* to my property.

Down below, let's log a message *if* the user is logged in. To do this,
say if `$this->security->getUser()`:

[[[ code('8babe8c1c7') ]]]

*Really*, this is the way to fetch the `User` object... but we can also use it
to see if the `User` is logged in because this will return `null` if they're not.
A more "official" way to do this would be to use `isGranted()` - that's
another method on the `Security` class - and check for `IS_AUTHENTICATED_REMEMBERED`:

```php
class MarkdownHelper
{
    // ...
    public function parse(string $source): string
    {
        // ...
        if ($this->security->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            // ...
        }
        // ...
    }
}
```

*Anyways*, inside say `$this->logger->info()` with:

> Rendering markdown for {user}

Pass a context array with `user` set to `$this->security->getUser()->getEmail()`:

[[[ code('c72c7baae7') ]]]

Like before, *we* know this will to be *our* `User` object... but our editor only
knows that it's some `UserInterface`. So we *could* use `getEmail()`... but I'll
stick with `getUserIdentifier()`:

[[[ code('33f09f2e6b') ]]]

Let's try it! We have markdown on this page... so refresh... then click any link
on the web debug toolbar to jump into the profiler. Go to logs and... got it!
There are a *bunch* of logs because we call this method a *bunch* of times.

Next, let's talk about a *super* useful feature called "role hierarchy". This
gives you the power to assign *extra* roles to any user that has some *other*
role.
