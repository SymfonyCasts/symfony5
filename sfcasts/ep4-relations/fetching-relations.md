# Fetching Relations

Coming soon...

Okay.

Each question in the database will now be related to approximately each of these
pelvis questions, approximately five answers, head to the homepage and click into a
question time to replace this hard, coded answer craziness with real answers. So
here's the question. How can we find all the answers for this specific question? When
we ran make entity, it also generated in answer repository. And if you remember from
the last tutorial, these repositories have nice built in methods, like find by, or we
can find all the answers where some criteria is matched. Like where question I, the
column = this question or a specific question, open the controller for this page,
which is source controller, question and controller. And it's this show action here.
Let's add an answer repository argument. And then down here, We'll say answers =
answer repository, find by and pass us an array of the where statement, which is
going to be aware. Question = the question object, because remember we're using the
kind of fancy auto query thing. So that doctrine is automatically querying for this
question object where slug = whatever is in the URL. So the point is we have a
question object here in raising. Fine by question = that question object.

No. So we're not saying question_ID here, or, or question = questionnaire or get ID.
No, no, no. We have to stop thinking about the database and only think about objects.
We wouldn't find all the answers who's questioned property = this question. Object
behind the scenes. Doctor will be smart enough to query where question ID = the ID
from this object.

Let's DD this and these answers and go see what it looks like when we refresh. Yes,
we've got it. Okay. Only two answers on this question. I'm going to pick a different
question. So if we have something interesting, here we go. Four answers on this
question. So we have answers butts because we decided to map both sides of this
relationship. Well, there's an easier way to do this. I'm going to remove this answer
repository argument entirely. And instead of say answers = question arrow, good
answers. Let me put my DD answers back. Okay. Refresh. Now we should get the same
thing and we don't. We get some funny persistent collection object and even weirder.
I don't see the answers anywhere inside this object. So where are my answers? Great
question. Right. There are two things to know here. Remember first, remember that
inside the question entity, the answers property will not be a true array of answer
objects.

It will be some sort of doctrine collection object. It may be an array collection
object or this persistent collection object, just depending on the situation. It
doesn't really matter because both of these classes implement the same collection
interface and both of them look and act like a normal array. Second, when we query
for a question doctrine does a select star from question. It grabs all the data from
the question table and puts it onto the properties on this object, but it does not
immediately query the answer table for the related answers. Nope, relations are
loaded. Laser only, doctor doesn't query for the answers until, and unless we try to
use the answers property. So at this moment, it has not made the query for the
answers yet, which is why you don't see the data on this collection object. But try
this in the question, controller, remove the DD. And instead for each over answered
as answer and inside of here, I'm going to just do a normal dump of the answer
variable.

So what I'm doing here by doing this for each is I'm literally using this property.
The moment we forage over it, it's going to make that query, check it out, refresh.
And because there's no dye, the dump is now down here on the web Dio to bar. And yes,
there are these same four answers. Click the doctrine icon on the toolbar, jump into
its profiler and look at the queries. There are two first doctrine, first queries
for, uh, the question data. Then a moment later at the moment that we for each over
answers it, then queries for the answer table where question ID = this specific
question.

So doctrine lays lead makes the query for the answers. Anyways, we have answers. Uh,
and yes, you can add a join to make these two queries one. And we'll talk about how
to do that later. Anyways, we have answers. So let's pass these into the template. So
do we eat all these old hard-coded answers stuff and I'll believe this for each and
perfect. Now passing these, this collection of answer objects into the template.
Let's go check out this template, cause we'll probably need to make a couple of
changes to us. Tempo's question showed at HTML that twig.

And if you scroll down a little bit, Siri, go, here's where we loop over a for
answers and answers. So that's still going to work. That collection is something we
can loop over, but this is not going to be an answer object. So to get the content,
let we say, answer dot the content. And then down here, we can remove this hard coded
username and say answered that username. And then one more spots down here. Perfect.
We have the vote count and this is just hard coded right now. So let's change that to
answer that votes.

All right, go check it out. Refresh and yes, we have real dynamic answers, but we're
still doing too much work. Head back to the controller and completely remove all of
the answers and the answers variable. Why are we doing this? Well, we know that we
can say question arrow, get answers, to get all the answers for a question. And since
we're passing a question object into the template, we can call that method directly
from the template itself, took it out and show it to HTML. Twig. We don't have an
answers variable anymore, but we can say question dot answers as reminder in twig.
When you say question dot answers, twig will first try to access this answers
property directly, but it's going to see that it's private. And so it's ultimately
going to call the, get answers method down here. In other words, it's going to, uh,

Okay.

In back of example, there's one other spot right here. Answer's pipe length. This is
where we show the number of answers on the page like this for, um, this now also
needs to be questioned dot answers pipeline. All right, we're refreshing again. You
had still works open up the doctrine profiler. One more time. We still have these
same two queries, but now this second query is literally being made from inside of
the twig template. Watch this go to the performance tab And oh, I have no timeline
here. Check that Symfony /stop watches installed. I love this. So I don't have
something I need installed to get this going. So let's composer requires Symfony
/stopwatch mind. Okay.

Yeah.

All right. Close the profiler while we're here in the first tutorial in this series,
we wrote some JavaScript for this answer, uh, voting feature. And if you click, you
can see that it sort of works. Something is happening, but the vote count is all over
the place. When you click this, it does make an Ajax call. You can see it happening
down here, but since there were no answers in the database, until now behind the
scenes, it's just, it's just returning a fake number. Before I recorded this
tutorial. I refactored the JavaScript logic for this into stimulus. So if you want to
check that out, it's an assets controllers, answer, vote controller. But the
important thing for us

Is that when we click this link, it makes an Ajax call to source controller, answer
controller, this answer, vote method. And inside of here, you can see that we're
literally grabbing a random number, uh, doing nothing with it, and then returning
that random number. So let's make this actually work start in, showed at HTML twig,
the way that our stimulus, our JavaScript knows what you were able to make an Ajax
call to is via this URL variable that we're passing into that controller. And you can
see it's generating a, uh, you were out of the answer vote route, which is this route
right here, but for the ID value, it's just passing in a hard-coded 10. Now we can
change that to answer.id. Great.

Back in the controller, let's get to work. So we're gonna need to take this ID and
query for the answer opt into what that ID, the laziest way to do that is just to
type in an argument, answer, answer. And that's it doctor. And we'll now query for
this answer, from that ID, or it will 4 0 4. So now we can re get rid of this to do
stuff here and down here in the up direction. I'll say answer arrow, set, votes,
answer, arrow, get votes. Plus one and another the same thing on the downvote we'll
say minus one, if you want, you can actually make fancier methods. You can say
answer->up, vote or answer->down vote showed that in the last tutorial, that's up to
you.

And then down here for the votes, we'll say answer, arrow, get votes. Now the only
thing we're missing is we actually need to make sure we save this to the database to
do that. We need the entity manager. So I'll add that as a new argument and to the
manager interface and city manager, and then down here, right before we return, all
we need to do is say Anthony manager,->flush. All right. Let's try that. Refresh the
page. Everything still looks good and let's vote. Yes. Okay. Yes. We'd see it made
the HS call. It was successful in this return one and more importantly, if we refresh
the one stays, it did save to the database. All right. Next, we've already learned
that any relationship can have two sides to it making like the, like the question
entity is a one to many to answers or the answer entity is a many to one to question
it turns out in doctrine. Each side has a name and a very important distinction.

