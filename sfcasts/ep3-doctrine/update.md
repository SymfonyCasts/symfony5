# Update

Coming soon...

Back on the show page, we can now upvote or downvote inquiries for that question
object in the controller grabs which button we clicked in increases or decreases the
vote. Count. This doesn't save the database yet, but we'll do that in a minute before
we do. I think we have another opportunity to clean up our code, adding some new
methods directly to our entity, the code of the controller to increase or decrease
the vote isn't complex, but it could be simpler and more descriptive in question at
the bottom, what's that a new public function called up a vote, and I'm going to have
this return self. Basically the job of this is it's going to say this->votes, plus,
plus that simple, this vote, we can call this method. If we ever want to increase the
votes, I'm also going to return this just because that makes it easier to chain.

I returned this on all of my methods that, uh, all of my setter methods let's copy
this and make another method called downvote this time. It will do this->votes minus
minus notice. I'm not even adding any PHP documentation above these votes because is
so descriptive up vote and down vote. I love doing this because it's going to make
our code in our controller. So simple. Check this up. If the direction is up,
question,->up, vote. If it's down, question arrow. Downvote how beautiful is that?
When we go over and try it and refresh it still works. This question has 10 votes,
but when we uploaded it up votes to 11, we've now added the three custom methods to
our question, upvote downvote and also get votes string. And this touches on a
somewhat controversial topic related to entities. Notice that every property in our
entity has a getter and setter method.

This makes our entity super flexible. You can get or set any field you want, but
sometimes you might not need or even want a Gitter or a setter method. For example,
do we really want a sets, a set votes method, should anything in our app, be able to
set the vote directly to any number that it wants? Probably not, probably always want
to use the vote or downvote methods. Now I will keep this method, but only because
we're using it in question controller. If I scroll up here to help create our random
data, to help create our fake data.

But this touches on a really interesting idea by removing any unnecessary getter or
setter methods in your entity and replacing them with more descriptive methods that
fit your business logic like upvote and downvote, you can little by little, give your
entities more clarity, upvote, and downvote are very clear methods. Some people take
this to an extreme and have almost zero getter and setter methods on their entity
class here at Symfony casts, we tend to be more pragmatic. We usually have getters
and setters, but we always look for ways to be more descriptive, to be more
descriptive. For example, the upvote and downvote methods are super nice. Okay, let's
finish this in our controller back down on question vote. How can we execute an
update query to save the new vote, count to the database? Well, no surprise. Whenever
we're saving something with doctrine, we need the ad city manager. So add another
argument and city manager interface and city manager.

And then down here, replace the D D question with entity manager->flush that's it.
Doctrine is smart enough to realize that the question object already exists in the
database and makes an update query instead of an insert we don't need to worry about
is this an insert or an update at all? Doctrine has us covered. Wait didn't I forget
the persist call up in our new action. We learned that when we need to insert
something in the database, we get the entity manager. When you call persist in, then
flush what you could. We could have added persist down here if we want it to, but you
don't have to remember the point of persist. If I scroll back up is to make doctrine
aware of your object so that when you call flush, it will execute whatever queries it
needs to put that into the database, whether those are update or insert queries, but
down in our question vote, because doctrine was used to query for this question
object. It already knows it exists.

We just call flushed down here. It checks that question. Object for updates and
performs. The update query doctrine is smart. Now that this is saving, what should
our controller return? Well, usually after a form submit we'll redirect. So let's do
that. How am I saying return this->redirect to route and then passes the name of the
route that we want to redirect to. So I'm gonna use app questions, show we'll
redirect to our show page, and then pass that any wild cards that it needs. So that
has a slug. Wildcards will pass it. Question arrow, get slugged. Now, two things
about this one is so far we've only ever generated you where else from inside of twig
and instead of twig, when you use the path function to generate you, where else the
redirector route, we pass it, similar arguments because internally it's going to
generate a URL to that route.

The second thing is that if you think about it, what a redirect actually is, it's a
special type of response. So we know that our controller always needs to return a
response, right? Well, the redirect is actually just a response with a three Oh two
status code and a special location header set to the address that your browser should
go to. So I'm actually going to hold command or control to click into this redirect
route. You can see this actually comes from our abstract controller. This apparently
calls some other method called redirect on this class. I'm going to hold command to
jump that. So ultimately what this redirect drop method returns is a redirect
response. And if I hold command on that redirect response is actually a class deep in
the core of Symfony that extends response. It's just a special subclass of response.
That's really good at creating redirect responses. So if that didn't quite make
sense, that's fine. I'm gonna close out these two classes. What I want you to know is
that redirect to route actually returns a response object, response option. That's
really good at redirecting. All right. So testing time, let's move over. Let's go
back to the show page and you can see that right now. This has 10 votes. Let's upload
that. And as 11 of what it again, 12 I'll put it again. 13, downvote it? 12, it works
beautifully.

Like I said, in a real app, when we have user authentication, we might prevent a
person from voting multiple times, but since we don't have that yet, this is working
awesome. Next let's talk about something else.

