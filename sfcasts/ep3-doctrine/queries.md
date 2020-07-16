# Queries

Coming soon...

We're great. And new question objects to the database. Every time we refresh you get
another question. You get another question. So now I want to see if I can render this
onto the site and we already have a page that renders an individual question. I'll
copy my slug here. And we can go to your /questions /that slug to see that question,
except it's not actually that question you can see, it's kind of got the title here,
but this question is not correct. That's because as you probably remember down here,
there we go down here, our show action. This is not actually loaded from the database
yet. We just have a hard coded question information.

That's no fun. So now let's start, let's use these slug to query for that question
object from the database and make this page dynamic. Now, as I mentioned, the entity
manager that we use to save is also what you're going to want to use when you query.
So we're going to start here by adding a third argument for entity manager, interface
and city manager. Now to query we've already seen the persistent flush method on the
into manager. There's one more important method it's called get repository. So I'm
going to say repository = it's the manager->get repository, and then I'm going to
pass it the entity class that we want to query. So for us, it's question ::class. Now
this repository objects is a very important concept, uh, related to querying for
data. This repository object, he's really, really good at querying from the question
table.

And it has a number of methods on it to help us do that. For example, in this case,
we want to query for, uh, based on these slug column using these slug variables. So
we can say question = repository arrow, and you can see it. Auto completes a number
of methods here. The one we want is find one by, and they're going to pass an array
and say, query from the slot where the slug field is equal to the slug variable, and
then below, I'm going to DD that question. All right. So let's try that right there.
I move over and refresh.

Yes. Would you see is actually gives me the question objects. So queries they have is
four. It gets all that data and puts it onto our object, which is beautiful. So the
repo, the repository object has a number of other methods on it as well. So for
example, there's fine. One by which gives you a single object, or you can say find
by, and that's the same thing, but it's going to give you an array of objects that
match, uh, some condition, or you could say, find all to get all of the, to get all
of the objects. And there's a few other methods. So it, without doing any work, it
gives you the most basic ways to query. Now, eventually we're going to need more
complex queries and to do that, we're going to talk about writing custom queries, but
this is exactly what we want right here.

So as we can see, when it finds this in the database, it gives us back the question
object. But if we change the slug to something that won't match a slug in the
database, we get no. So in question object or no, now this is a legitimate thing
that's going to happen on our site. And what do we want to do when someone goes to a
URL that is doesn't match the real question. And the answer is we want to trigger a
four Oh four page. So we're going to do here is first above my question, variable.
This is totally optional. I'm going to say /star star space and then type in question
or no, but that's doing is that's going to help my editor know that this is a
question object or no, it'll just help with auto completion, but you don't need to do
that.

Now down here, I'm gonna say if not question. So if it's a it's null to trigger for a
four page, we're going to say, throw this arrow, create, not found exception. That's
a method on our base controller and here we can pass any message we want. So I'll say
no question found or slug percent S and then I'll pass in the slug variable. Perfect.
Now you notice I'm doing a throw here, cause the great enough on exception actually
creates an exception object, a very special exception object that triggers a four or
four page. Most of the time in Symfony, if you throw an exception, that's going to be
a 500 page, but this special exception is a four Oh four. Now I go over and refresh.
Yes, you can see it up in here. It says HTTP four Oh four, not found. And you can see
our message.

Now do things I want to say about this first is that this message here is only for
developers. Your, uh, your real first thing I was saying is this is the development
error page. If we were, if we changed our environment to production, we would say
much more boring for a four page, and we want to talk about it. But if you look at
the Symfony documentation, you can find out how to customize your production error
pages. The second thing I want to say is that this message here, there's no question
found for slug is something that only developers will see. So you can make this very
descriptive, uh, your end users. Aren't going to see this when they go to a 44 page.

All right. So we now have our question object inside of our controller. And
eventually at the bottom here, we render a template. So we rather do now is actually
pass that question, object into the templates and then use it on the page to print
the title and to print the name and the other information. So I'm going to remove my
DD here. Uh, answers. We'll keep those hard coded for now because we don't have an
answer entity yet. And then I'll get rid of this, a hard coded question, tech stuff,
and then down here, we're going to pass in order to remove these two of these
template variables and just pass questions, set to question. So in the template, the
question variable will now be a object. All right. So let's go from that template.
Templates question showed at H not TWIC. So if question is no longer a string, it's
actually an object. How do we render that object? And the answer is very simple
because our question has a name property on it. We can say a question that name, it
even auto completes that auto-completion doesn't always work, but when it does is
awesome.

And then down here, let's see here's another one. Say, question.name here. And this
is the question texts. So I'll actually say Washington dot question. All right. If I
didn't miss any dynamic things should work, move over. Oh, and I'm going to go back
to my real question page refresh and yes, there it is. We have the real title, the
real title, the real name, the real name of the page. And this is the real question
text. This date is still hard coded, but we'll fix that in a second, but you might be
wondering how the heck that worked, because we said question.name, which sort of
makes it look like it's reading the name property. But if you look at the name
property inside of our question, entity, it's privates means you can't just access
the name property directly. So this works thanks to some twig magic.

In reality, when you say question not name it first does look to see if the name of
property exists and is public. If it were public, you would just use it. But since
it's not, then tries to call get name. So in reality, we're saying question.name, but
that's calling get named behind the scenes. This is really nice. Cause you don't, you
can just run around and saying question, not name and your template and not really
worry about the details of a, of whether there's a, there's a getter on that you can,
if you can, if you want to still call get named, that's totally legal. But most of
the time, you're not going to need to.

The one detail that we did lose here is that originally this was being parsed through
markdown. We can fix that really easy. And now by using our parse markdown filter
that we created in the last tutorial and refresh, now it works. So if you look down
at the bottom here, check out the web people at toolbar, there's a little database
icon. It says one database query. So this is a really great thing about doctrine is
actually shows you your database queries. So I can click in here and you can see the
exact query that was being made.

If there were any, there were multiple queries. You'd see the multiple queries here.
And you can say, if you run a bulk query, if you want to be able to copy that and
maybe go run it directly on your database to, uh, to figure it out. So I love this.
And actually we can even see the query on our, um, on our insert page. So if I go
back to /questions /new, that just made an insert query. But the problem is that,
because this isn't a real page, you don't see the web debug toolbar. This is a common
thing that happens with Ajax calls. You might make an Ajax call, a, you might want to
see the queries that Ajax call makes, but it doesn't have a web view of a toolbar. So
you can't see it. So the trick here is to go to /on our score profiler.

And that's going to show you a list of all of the recent requests you made. So for
example, here, we can see when we can see the requests, we just made a /question
/knew. If we could click this little token thing over here, we can see the profiler
for that request. And then we click on doctrine. Bam. There you go. You can see it
actually started a transaction insert into here's the answer statement and then
committed the transaction on the bottom. So this is a great little trick to see
information about a request, an Ajax request, usually. All right, next, let's next.
If I go back a couple of pages back to our show page, but one piece of data that's
still hard code is this asked 10 minutes ago thing. I'll actually search for that in
my template. There we go. Line 18. Um, let's make this dynamic next, but not just by
putting a date. I actually want to print out a cool dynamic, like 10 minutes ago.
Kind of message. What let's do that next.

