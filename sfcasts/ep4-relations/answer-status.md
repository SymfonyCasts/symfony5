# Answer Status

Coming soon...

Sometimes as a wonderful as our users are, we need to mark an answer as spam work.
Maybe in theory, we might add a system later that notices links included in an answer
and marks it as needs approval. So each answer will be one of three statuses needs,
approval, spam, or approved, and only be the last one should actually be visible on
the site. So right now, inside of our answer entity, we don't have any way to track
the status. So let's add a new property to this class. So at your console run,
terminal run, similar council, make entity. We're going to ask to update the answer
entity, we'll add a new field called status. I'm going to make this a string field.
It's going to be kind of an ENM field with the length of just 15, because we will
know the, this only hold a couple, uh, one of a couple of short values and not
knowing the database. Perfect. Can enter going to finish that last immediately run
Symfony console, make migration.

Awesome. And go double check that migration just to make sure it doesn't contain any
surprises. Looks good. Alter table, uh, answer, add status. Beautiful. So I'll close
that and send it back over and run Symfony console doctrine, migrations migrate.
Awesome. All right. Since we have three different statuses, I'm going to add
constants for each one. Now, if you're using PGB 8.1, it actually has a built-in ENM
type, which you can totally use if you want to. So I'm at a public constant status
needs approval. I'll set this to just needs approval. As you'll see in a second, this
will be the actual string we store in the database. And then I'll paste that twice to
make the other two statuses, which are spam and approved setting each of those to a
simple string.

Awesome. Next I'm going to default each status down here to self status needs
approval. So if we don't set it, that will be the default status. And finally, down
here on set status, we can do a little sanity check. If someone calls us they value.
That's not one of those three constants. We should throw an exception. So if not in
array status, and then I'll create a little array here with those three statuses. So
it looks a little odd way, but we'll say self status needs approval, self status,
spam, or self status approved. So if it's not inside that array, then we will throw
in a new invalid argument exception, and I'll put a little error message here about
invalid status, the percent S status. Beautiful. So little gatekeeping to make sure
that we only have a valid status. All right, so we've created this new status
property. Good for us. Now open up source factory answer factory and for simplicity
down here and get the false, I'm going to set status to answer status approved. So if
we ever create some answer fixtures, let's make them approve by default so that they
actually show up on the site. But I do want to actually create a couple of, um, but
in reality, in my test data, I'm going to want a mixture of approved and needs
approval and not approved answers. Okay?

So to do that, I'm going to create a new state changing method inside of here. I'm
going to say public function needs approval. This is going to return self. And here,
this is a founder feature. We can say, return this arrow, add state and change the
status to answer a colon, colon status needs approval. So thanks to this new, it
needs approval method. What we can do is we can go into our fixtures class, so source
data at fixtures, and right after we create our 100 answers, which thanks to get
defaults are going to be approved. That's also create some needs approval answers by
saying, answer factory colon, colon it new to give us a new instance of answer.
Factory->needs approval, and then->many error, many that's great 20 of them, and
then->create that's it. So as a reminder, um, so the needs approval here, we'll set
the status to needs approval. This will say that we want to create 20 and then, uh,
we'll actually create them as a reminder, thanks to the get defaults method. This is
going to, uh, create a new unpublished question to relate this to, um, it's actually
not what I want.

[inaudible]

I really want to relate this to one of the questions I've already created. So let's
use the same trick that we used up here for our other answer factories. So when we
create new here, we can pass it the callable of attributes to use. So I'll pass that
a callable. I'll make sure I use questions and then we can return that same thing
here. So great. 20 new needs approval answers that are set to this random question.
Phew. All right. Let's call over here and reload. The fixtures Symfony console
doctrine, fixtures load. Awesome. No airs.

Cool. But how do we actually hide these from the front end? So let's go back to our
homepage here and perfect. This first one for me has 10 answers. So that's probably
good. Chances are that out of these 10 answers, at least one of them is actually, uh,
needs approval and should not be shown. So how can we hide these right now inside of
a show that HTML twig to get these were saying question dot answers. So this is
calling question arrow, get answers, which of course returns all of the answers. So
if we wanted to, we could go back into question controller inside the show action,
and we could do a custom query using the answer. Pository where the question = this
answer and status = approved. Well, that's lame. I don't want to do that. I still
want to be able to use my nice little shortcut methods inside the template.

It makes my life so much easier and we can do this. So when the question class,
anywhere inside of here, but I'm going to go right after get answers, create a new
callback function, get approved answers. This is going to return a collection, just
like get answers. But inside of here, what we're actually going to do is loop over
the answers and remove any that are not approved. Now I could do this with like a
four each method, but there's actually a helper method on the, uh, collection object
that we can do this. So check this out. We can say return this->answers,->filter. And
then we can pass this a call back with an answer argument. So what's going to happen
is that, um, this callback is going to be executed for every single each answer
inside of the answers collection. And if we return true, it will be included in the
final collection that's returned. And if we returned false, it won't. So we're taking
the answers collection and filtering it. Now inside of here, we basically want to
check to see if this answer's status is approved. I'm actually going to add a little
helper method for that inside of answer,

Sun here, I'm going to add public function is, is approved. This will return a
bullion and we'll say return this->status = self corn status approved. Yep. And, uh,
vitamins and be there in 10 minutes. Okay.

[inaudible]

Now we're in question. This just makes our code here a little bit easier and we can
say conclude this answer. If Answer->is approved. So we now have a new method instead
of question, that will only return as the approved answers. All we need to do now is
use this our template. So when it showed on HTML twig, we're gonna use this in two
different spots, question dot approved answers, and questioned dot approved answers.
And then also on the homepage. I don't want to forget there. We're counting them in
the homepage. We're going to want this to also show only the approved answers count.
So approved answers. Okay.

Yeah.

All right. Moment of truth. Right now we have 10 answers on this question. I'm
guessing at least one of those is not approved when I refresh, oh, it's still 10 as
well. Probably all of those are actually approved as rotten luck. Let's go back here.
Find one of these other ones that has a lot of answers on it. Perfect. You saw on
this page from my old refresh, it still said 11, but when I actually got into here,
there was six. And most importantly, if we open up the profiler for doctrine, we can
see, I don't run. Don't do that. Okay.

[inaudible]

So it works, but there is a performance problem with this. If you open up the profile
for this and look at the query, we are still queering for all of the answers where
question ID = 4 57. So in this case, but then we're only actually rendering the six
approved once that's wasteful. What we really want is some way to have this nice get
approved answers method, but make it only for the answers we need instead of querying
for all of them and then filtering them in PHP. Is that possible? Yes. Via a nice
little criteria system.

