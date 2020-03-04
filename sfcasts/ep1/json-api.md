# JSON API Endpoint

One of the features on our site... which doesn't work yet... is that you can up
up and down vote answers to a question. Eventually, when you click up or down,
this will make an AJAX request to an API endpoint that we create. That endpoint
will save the vote to the database and *respond* with JSON that contains the
*new* vote count so that our JavaScript can update this vote number.

Even though we don't have a database in our app yet, but we can build *every* other
part of this feature.

## Creating a JSON Endpoint

Let's start by creating an JSON API endpoint that will be hit via AJAX when a user
up or down votes an answer.

We *could* create this in `QuestionController` as a new method. But since this
endpoint *really* deals with a "comment", let's create a *new* controller class.
Call it `CommentController`.

Like before, we're going to say `extends AbstractController` and hit tab so that
PhpStorm autocompletes this and adds the `use` statement on top. Extending this
class gives us shortcut methods... and I love shortcuts!

Inside, create public function. This could be called anything... but let's call
it `commentVote()`. Add the route above: `/**`, then `@Route`. Select the one
from the the Routing component so that PhpStorm adds this `use` statement.

For the URL, how about `/comments/{id}` - this will be eventually the id of the
specific comment in the database - `/vote/{direction}`, where `{direction}` will
either be the word `up` or the word `down`.

And because we have these two wildcards, we're can add two arguments: `$id` and
`$direction`. I'll start by adding a comment: the `$id` value will be *super*
important later when we have a database... but we won't need it at all right now.

Without a database, we'll kinda fake the logic. If `$direction === 'up'`, then
we would normally save this up-vote to the database, and query for the new vote
count. Instead, say `$currentVoteCount = rand(7, 100)`.

Right now, the vote counts are hardcoded to 6 in the template. So this will make
the new vote count appear to at *least* be higher than that. In the else, do the
opposite: a random number between 0 and 5.

Yes, this will all be *much* cooler when we have a database, but this will work
great for our purposes.

## Returning JSON?

The question now is: after "saving" the vote to the database, what should this
controller return? Well, it should probably return JSON... and I *know* that I
want to include the new vote count so our JavaScript can use that to update
the vote text.

So... how do we return, JSON? Remember: our *only* job in a controller is to
return a Symfony `Response` object. JSON is nothing more than a response whose
text is a JSON string instead of HTML. So we *could* say:
`return new Response()` with `json_encode()` of some data.

But! Instead, `return new JsonResponse()` - auto-complete this so that PhpStorm
adds the `use` statement. Pass this an array with the data we want. How about a
`votes` key set to `$currentVoteCount`.

Now... you *may* be thinking:

> Ryan! You keep saying that we *must* return a Response object... and you just
> returned something different. This is madness!

*Fair* point. But! If you hold Command or Ctrl and click the `JsonResponse` class,
you'll learn that `JsonResponse extends Response`. This class is nothing more
than a shortcut for creating JSON responses: it JSON encodes the data we pass to
it *and* makes sure that the `Content-Type` header is set to `application/json`,
which helps some AJAX libraries understand that you're returning JSON data.

So... ah! Let's test out our shiny-new API endpoint! Copy the URL, open a new
browser tab, paste and fill in the wildcards - how about 10 for `{id}` and vote
"up". Hit enter and... hello JSON endpoint!

The big takeaway here is this: JSON responses are nothing special.

## The json() Shortcut Method

The `JsonResponse` class makes life easier... but can be even *lazier* than this!
Instead of `new JsonResponse`, just say `return $this->json()`.

That changes nothing: it's a shortcut method to create the *same* `JsonResponse`
object. Easy peasy.

## The Symfony Serializer

By the way, one of the "components" in Symfony is called the "Serializer", and
it's *really* good at converting *objects* into JSON or XML. We don't have it
installed yet, but if we *did*, the `$this->json()` would start using it to
serialize whatever we pass. That wouldn't make any difference in this case, but
it means that you could start passing *objects* to `$this->json()`. If you want
to learn more - or want to build a super-rich API, check out our tutorial about
[API Platform](https://symfonycasts.com/screencast/api-platform) an amazing Symfony
bundle for building APIs.

Next, let's write some JavaScript that will make an AJAX cal to our new endpoint.
I'll also show you a few routing tricks, like making sure this route *only* responds
to POST requests and validating that the `{direction}` is either `up` or `down`.
