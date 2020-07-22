# Entity objects in Twig

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
