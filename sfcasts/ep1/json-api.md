# Json Api

Coming soon...

One of the features on our site which doesn't actually work yet is the fact that you
can up and down vote answers to a question. Eventually when you click up or down,
this was an AJAXrequest to an API endpoint that we have that will record that vote in
the database. Then it will respond with a new number of votes and this number here
would update. Now obviously we don't have a database yet, but we can do the whole
rest of that except for that part, which would be a great introduction to API calls
inside of Symfony.

So let's start with creating the controller, the API controller that this Ajax call
will hit everything about it. This is going to record a vote for a comment, so if we
need to create a new endpoint, we could put that in `QuestionController` as a new
method at the bottom of his controller. But since it deals with comments, I'm
actually going to close this and instead create a whole new controller class, whole
new PHP class called `CommentController` like before we're going to say extends
`AbstractController` and hit tab so that it auto completes. That `AbstractController`
will give us some nice shortcuts. Now inside of here I'll create public function.
This could be called anything but let's call it `commentVote()` and then above this
`/**` that's `@Route` auto complete. The one from the `Routing`
components. Let's have that.

You were all B. How bout `/comments/{id}`. This will be eventually the ID in
the database to this specific comment `/vote/{direction}` and what that
direction will be is either the word `up` or the word `down`. Now because I have this two
wild cards, I can put `$id` here in `$direction` arguments. The
logical side of here, I'm going to put a little to do here, says to do use ID to
query database. We don't have a database yet, so I'm just going to ignore the ID and
then down here, just to kind of make this a little bit realistic, I'll say if
`$direction === 'up'`, then we'd probably do is actually save this vote to the database and
then do a query to the database to figure out what the new vote count is. Instead,
I'm just going to fake it and say `$currentVoteCount = rand(7, 100)` right
now if you look on the site, all the comments are hard coded to six so that way if we
hit up the system will respond that we have some random number that's higher than six
and then on the else, if it's down, we'll say the same thing. `$currentVoteCount =`
somewhere between 0 and 5 so it at least looks lower.

So this is the part here that's not very realistic yet. I'll put a little thing says,
use real logic here to save this to the database. That is something we'll do in a
future tutorial. It's just not right now. Now the real answer is what do we return
from this? This is an API endpoint. So what we're probably going to run a return is
that JSON and specifically we're going to read, I want to return this of new vote
count and JSON because we're going to read some JavaScript that takes that number in
updates this text right here with the new number. So how do we return, JSON? Remember
our only job in a controller is to return a Symfony response. Object in JSON is
nothing more than a response object that has a JSON string in it instead of HTML. So
we could say return new `Response()` here and then maybe JSON and code some data and put
it inside there.

But instead we're going to say return new `JsonResponse()` and we're going to pass this
whatever data we want to JSON and code. So I'll make an array. Now, how about let's
have a `votes` key set to `$currentVoteCount`. Now you may have just think I violated
my rule of always returning a Symfony response object, but in reality, `JsonResponse()`
is a subclass of response back. If you want, you can hit hold command or control and
bump into that, jump into that and you can literally see `JsonResponse` extends
`Response`. It's nothing more than a nice shortcut method for creating a JSON response.
It'll JSON and code this data for us. We'll also set the content type header two
`application/json`, so that's nice. All right, so let's try this. I'm going to
copy this URL right here and I'll open up a new tab, but a 
localhost:8000/comments/10/vote/ and hello JSON and point.

So the big takeaway here is that JSON responses are nothing special, just return a
`JsonResponse` to object and actually we can be even more lazy than this. Instead of
returning new `JsonResponse`, which I auto completed to get the use statement, you can
say return `$this->json()`, that makes absolutely no difference at all. It's still JSON
and it still creates a `JsonResponse` behind the scenes and actually later this JSON
function actually unlocks internally. If you have Symfony serializer installed, it
will actually use the serializer to JSON and Cove. This data, which is able to see,
realize objects. Super powerful concept, but beyond the scope of this tutorial. So
then we have our beautiful JSON endpoint. Let's raise some JavaScript included in our
page and actually make a call up to this endpoint. Almost going to show you a couple
extra routing tricks, like how you can make this route respond to post only and how
we can validate that this direction is either the word up or down. That's next.

