# Custom User Methods & the User in a Service

We know how to fetch the current user object in a controller. What about from Twig?
Head back to `base.html.twig`. Let's see... this is where we render our log out and
log in link. To see if we can do it, let's render the first name of the user right
here.

## App.user In Twig

How? In Twig, we have access to a *single* global variable called `app`, which has
lots of useful stuff on it, like `app.session` and `app.request`. It *also* has
`app.user` which will be the current `User` object or `null`. So we can say
`app.user.firstName`. This is safe because we're *inside* of the `is_granted()`
check... so we *know* there is a `User`.

Let's try that. Close the profiler, refresh the page and... perfect! Apparently my
name is Tremayne!

Now that we've got this... let's make it fancier. Inside of the `is_granted` check,
I'm going to paste in a big user menu: you can get this from the code block on this
page. This is *completely* hard-coded to start... but it renders as a nice user
drop-down.

Let's make it dynamic.... there are a few spots. For the image, I'm using an
avatar API. *We* just need to take out the "John Doe" part and print the user's
real first name: `app.user.firstName`. Oh, then pipe that into `|url_encode`
so it's safe to put in a URL. Also render `app.user.firstName` inside the `alt`
text.

For the log out link, steal the `path()` function from below... and put it here.
Cool! Delete the old stuff at the bottom.

And when we refresh.. voilà! We have a real drop-down menu.

## Adding Custom Methods to User

I've mentioned a few times that our `User` class is *our* class.... so we are free
to add whatever methods we want to it. So, for example, maybe we need to get the
avatar URL in a few places on the site... and we don't want repeat this long
string.

Copy this and then go open the `User` class: `src/Entity/User.php`. All
the way at the bottom, create a new public function `getAvatarUri()`. Give this
an `int $size` argument that defaults to `32`... and this will return a `string`.

Paste the URL so we can an example. Let's return the first part of the URL...
add a `?` - which I totally just forgot - then use `http_build_query()` method and
pass this an array. The first query parameter we need is `name` set to
`$this->getFirstName()`.

Oh, but we can be even smarter. If you scroll up, the `firstName` property If we
is allowed to be null: it's an optional thing that a user can provide. So, back
down in the method, let's use `getFirstName()` if it has a value... else fallback
to the user's email. Then, for `size`, which is the second query parameter, set it
to `$size`. Oh, and we also need `background` set to `random` to make the image
more interesting.

Thanks to this nice little method, back in `base.html.twig` we can delete all of
this and say `app.user.avatarUri`. You can also say `.getAavatarUri()`: both
will do the same thing.

If we try it... broken image! Ryan: go add the `?` you forgot, you knucklehead.
`http_build_query` adds `&` between the query parameters, but we still need the
first `?`. Now... much better!

But we can make this even better-er! In `base.html.twig`, we're using
`app.user.firstName`. As we just say, this *might* be empty. So let's add one
more helper method to `User` called `getDisplayName()`, which will return
a `string`.

I'll steal some logic from above... and return that. So we either return the first
name or the email. We can use this up in `getAvatarUri()` - `getDisplayName()` -
and also in `base.html.twig`.

When we refresh... yup! It still works!

## Security Service: Fetching the User in a Service

Ok: we have now fetched the `User` object from a controller via `$this->getUser()`...
and in Twig via `app.user`. The only other place where you will need to fetch the
`User` object is from within a *service*.

For example, a couple of tutorials ago, we created this `MarkdownHelper` service.
We pass it markdown, it converts that into HTML... and returns. Let's pretend
that we need the `User` object inside of this method: we're going to use it
 log another message.

If you need the the currently authenticated `User` object from a service, you can
get it via *another* service called `Security`. Add a new argument called `Security` -
the one from `Symfony\Component` - called `$security`. Hit Alt+Enter and go to
initialize properties to create that property and set it. Because I'm using PHP 7.4,
this added a type to my property.

Then, down below, let's log a message *if* the user is logged in. To do this,
say if `$this->security->getUser()`.

*Really*, this is the way to fetch the `User` object... but we can also use it
to see if the `User` is logged in because this will return `null` if the user is
anonymous. A more "official" way to do this would be to use `isGranted()` - that's
another methods on the `Security` class - and check for `IS_AUTHENTICATED_REMEMBERED`.

*Anyways*, inside say `$this->logger->info()` with:

> Rendering markdown for {user}

And pass a context array with `user` set to `$this->security->getUser()->getEmail()`.
Like before, *we* know this will to be *our* `User` object... but our editor only
knows that it's some `UserInterface`. So we *could* use `getEmail()`... but I'll
stick with `getUserIdentifier()`.

Let's try it! We have markdown on this page... so refresh... then click any link
on the web debug toolbar to jump into the profiler. Go to logs and... got it!
There are a *bunch* of logs because we call this method for each answer.

Next, let's talk about a *super* useful feature called "role hierarchy" where if
the user has *one* role, you can automatically give them *other* roles.
