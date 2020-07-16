# Persist

Coming soon...

We have a beautiful entity class with some properties on it. And thanks to our
migrations, which we just executed. We have a corresponding question table in the
database. We are ready to insert some data. Okay. Now, one of the key philosophies of
doctrine is that doctor doesn't want you to think about tables and columns. Doctrine
wants you to think about classes and properties, and then let all the details of
saving and querying to a database table. Leave that to doctrine. So instead of
asking, how can I insert a new row in the question table? We're going to think, how
can we create a question object populated with data and then ask doctrine to save it,
to create a integrated new question. Let's add a new page. It be like /question /new
that when we go to this URL, it will create a new question in the database.

So let's find our controller for this source controller question controller. You can
see our homepage, our show page. So let's go down to the bottom here and we'll say
public function wouldn't call us anything. But how about new? And I'll add my at
route above this four /questions /new, and to keep things simple, it's going to
return a new response from this is the lowest level thing you can do in Symfonys. You
can always return a response object, and I have to say time for some doctrine magic.
Alright, so nothing doctor related yet, but if we go over here and hit enter, it
doesn't work well. I mean it worked, but this is not the page we expected. It looks
like the question show page. And in fact, if you look down here, yes, the route is
app questions show the problem is that it matched this route up here because
/question /new, it just makes it look like new is the slug value.

Now routes match from top to bottom. So the easiest way to fix this is actually just
to move your more specific routes above this one. It's kind of big, doesn't happen
too often, but this is a nice example. Now, if we go over and refresh, got it.
Alright, so let's get to work. Now. Eventually this page would have a form on it that
the user can fill out all the information about their question. And when they submit,
we would say that to the, to the database, but we're not going to talk about Symfony
forms yet. So I just want to fake it inside the controller. We're literally just
going to create a question object and ask doctors to save it. So very simply start
with question = new question. I'll enter the audit, complete that, and then we need
to start setting the data. So questionnaire a set name.

We'll ask a question about a spell that went wrong and made her pants disappear. I'll
set a slug on this two missing pants dash, and then I'm going to add a little random
thing because remember this needs to be unique in the database. So I want to make
sure that those don't collide. And then I'll say set question, and this is the long
text. So I'm gonna use the multiline syntax here, the EOF syntax, and then I'm going
to paste in some content. You put any content here, but you want to, you can grab
this from our, from this page. Perfect. So there's a question object. And then the
last field we haven't said here is the asked at I'm actually going to set this. I'm
gonna do this a little in a little bit of a conditional way. So I'm gonna say if Rand
of one from one to 10 is greater than two.

So kind of a 70% chance of this. If statement mean hit, then we're going to set
Washington->set asked app. So the idea is that the asked ad is something that is set
only when a question is sort of published. So this will give us a nice mixture of
like most questions will be published, but we'll have a few that will be unpublished.
So that'll give us some nice data to play with. Now, remember the asked app is a date
time field. So what this means in PHP, this means in my as well as it's going to be a
date column with a, with a, with a string value. But in PHP, we don't have to worry
about the string value. We're just going to pass to say date, time object. So here
I'll say new /date time. And then we'll make this a little bit random as well say,
minus percent D days. And then we can pass this a random, uh, from one to a hundred.
So set the, ask that at anywhere between one and a hundred days ago.

And that's it. So I'll DD the question down here, dumping dye, just so we can move
over and refresh and Oh, sprint app minus percent percent the days. And they'll pass
this a random number from one to a hundred days. That's not going to work. Let me go
over and refresh there. It is a nice, boring question. Object. You can see that his
ID is no, because we didn't set the idea and then it hasn't been saved to the
database yet. So now all we need to do is basically ask doctrine to save this forest.
Now, when we installed doctrine a few minutes ago, Ben saw the doc in library, but
also installed a doctrine bundle, which integrates into Symfony. Now you remember the
main reason that the main thing that a bundle gives us is new services in our
container in doctrine is super powerful, but it turns out that there's basically just
one main service instead of doctrine, that we care about.

This one service is capable of both saving and querying to find it however your
terminal and let's run our handy bin console, debug auto wiring notice here. I could
also be saying Symfony console, debug auto wiring. So that by this case, I don't
really care about my environment variables. So it's safe to run it either way. Oops.
And then we'll say doctrine and you see, there are several things in the error, but
most of these are lower level. The one we care about to do everything is entity
manager interface. This can save in this can query. So let's go add this as a type
into our controller to fax that service. So as an argument, I'll say entity manager,
interface and steam manager, and then down here at the of the manager, doesn't have
very many methods on it to save an object. We're going to say entity
manager,->persist, and then pass it.

The question object, and then, and city manager->flush. Now this is the first time
you've seen doctrine. You might be surprised that there are two lines to save
something. So what happens here is persist simply tells doctrine, Hey, please be
aware of this question object. The persist line doesn't actually make any queries.
But doctor now knows that we about our question object. When we call flush, this
actually makes the query specifically doctrine looks at all of the objects that it's
aware of in our case, just one and then makes all the queries to save those. So
usually how persistent flush like this right next to each other. But in theory, you
could persist five question objects, and then just flush them once all at once, which
is more performance.

Alright, to see the data down here, let's actually replace our response with
something more interesting. I'll say sprint up. And what I want to do here is say
that the shiny new question is ID and they'll actually say percent D uh, and then
slug percent S will do it. I'm going to pass a question, arrow, get ID, and then
question->gets slug. And I remember from a second ago, when we dumped the question
object before saving it, there was no idea yet. But now when we refresh, yes, look at
it has an ID when doc can saves that to the database, it grabs the auto Ingram ID and
puts that back on the question object. We can refresh this over and over again. And
this is actually inserting more and more question rows into the database. So that's
it saving an object is creating the object and then calling persist and flush. If you
want to see this more directly in the database, there is a nice handy command inside
of a doctrine to query the database directly. So this is not on the run Symfony
console so that I get my environment variables. And then we can say doctrine, colon
query, colon SQL. And I'll say select star from question. And that gives us a nice
little dump and you can see our seven objects are eight objects in this array. That's
it. Our next we're saving. How do we query? Let's do that next.

