# Orderby Extra Lazy

Coming soon...

You know what, on this page, we're missing the creative at for each answer. I want to
be able to see when this answer was posted. Let's fix that head over to this
template, which has showed at HTML that's wig. And down here, let's see right before
the vote arrows, I'll add a small tag and then answer dot created it. Now that's a
daytime object. You can't just print a date town object. So you can click pipe this
to the date, filter, do something like this. But Len the last tutorial we actually
created actually installed a liar that allowed us to add, to say pipe ago.

Okay. So for refresh now, oh, I get the question. Object cannot be found by app Ram
confer. Annotation. That's a fancy way of saying that this question kind of could not
be found that's because I reloaded my fixtures. So let's go to the homepage, refresh,
click into a fresh one. And actually let me try a different question. Wants something
with several answers. Perfect. Here we go. This will hand has a bunch of answers. And
now we have the months ago that each one was printed, which highlights a small
problem here. What order are these answers being returned at right now? There's no
specific order you can see in the query for this. This is just querying for all
answers where question ID = this, but there's no order by on this. We could order
this by the vote count, but let's actually order this, that the newest ones show up
first.

And this is the downside of convenience methods for relationships like question and
get answers. You don't have a lot of control over them, or so it seemed at first you
actually can't control that. The easiest thing you can change is how they're ordered.
So go into your question class, scroll up to the answers property. Here we go. And if
you want to control the order, this, you can add an order by and then pass this and
object and array. If created that = descending. That's it for all back over now and
beautiful. These are now ordered with the newest ones first. I love it. Let's learn
another trick on the homepage. We show the number of votes or not, sorry. Number of
votes. We showed the number of answers here. It is for each question, but instead
they all say six because that's still hard-coded. Let's fix that. Open a template for
this templates. Question, homepage dot HTML, twig. I'm actually going to search for
six.

There we go. Six answers. Let's replace that with curly curly question, that answers.
So I'll go to the collection of answers and then we can pipe that through the tweak
link filter so that it counts them simple enough. And when we refresh, yes, that
works two answers, six answers, eight answers, but check out the web Debo toolbar.
Whoa, we have a lot of queries suddenly. Let me open that up. So the first query is
still for all of the question objects, but then one by one it's selects from answer
where question ID = a specific question and then it selects the answers for the next
question. And then it's likes the answers for the next question. This is called the N
plus one problem. We have one query that gives us all of the questions. Then as we're
looping over the questions, each time we asked for the answers inquiries for all of
the answers to this question, and then all of the answers for this question. And then
all of the answers from this question all the way down to the problem it's called the
end plus one problem, because if you were showing 20 questions, you end up with 20
extra queries, plus one, the original 1 21 queries.

We're gonna talk more about the end plus one problem later and how to fix it. But
there's kind of a bigger problem right now. And that's that we're querying for all of
the answer data simply just to get B count of them. That's totally overkill. And
that's the default behavior of doctrine. When we access this answers property, it
fetches all the data so that it can return all of the answer objects. This is one of
the things you have to be a little bit careful with, uh, with doctrine. These, um,
it's very easy to use these nice convenience methods like question and get answers,
but sometimes they can, uh, cause you to do bad performance. Thanks anyways, there is
a way to fix this. Let me show you it. So in the question class, at the end of the
one to many, we're going to add a new option here called fetch = and then pass it a
value called extra lazy watch what happens here. So we have 21 queries now. And when
we refresh, we still have 21 queries. Let's open up the profile for that. Our first
query is still the same. It's querying for all the questions, but now check this out,
everyone after this is just select count from answer. So instead of grabbing all of
the answer data, it's just grabbing the count from them.

This is what fetch = extra lays. It gets you if doctrine determines that you're
accessing a relation, but you're only counting, counting that relation, not actually
trying to use its data, then it will create a count query instead of grabbing all of
the data. If you simply count the results doctrine is smart enough not to query for
all of them. So you might be wondering then why is this the default behavior? It
seems like it makes perfect sense. Hey, if I'm only counting the relation, why would
you ever query for all of the data? Why not be smart and just do the count query? The
answer is that it's not always the best thing for performance. If you go to a
question show page, having the extra lazy actually causes an extra query a second
ago, we had two. Now we have three. If you check it out, what happens is at first,
uh, selects for the question, then it counts the answers and then it re does this
query and grabs all the data for the answers.

The problem is the order in this template. The first thing we do is count all the
answers. You can see this in showed at HTML, that twig, before we loop over the
answers, all we do is count them. So at this moment, doctrine says, Hey, you're
counting the answers. So I'm going to do a quick count query for them. Then a second
later, we loop over all the answers and we need all of their data anyways. So at this
moment, doctrine actually does a full query for the answers. If we reversed the order
on these and kind of move this question, the answers length kind of below this,
somehow, then it would only make one query. But since we're counting them first, it
causes an extra query. All of this is probably not too important and I'm going to
leave it how it is in general. Don't optimize prematurely. I want you to know, I want
you to know about this extra lazy fetch option, but ultimately I use Blackfire once
I'm on production to do most of my

Profiling next, in addition to changing the order of the answers, when we call it a
questionnaire, we'll get answers. We can also filter this collection like to only re
return approved answers, time to learn about the criteria system.

