# Query Builder

Coming soon...

All right. We just found out that when you ask for a repository, what you actually
get back is a specific class. So when we asked for the question repository, we
actually get back this class called question repository. The cool thing about that is
that we can add custom methods to it. So right now, what I want to do is I want to
change the query on our homepage when it changed the query on our homepage, so that
it hides any questions that don't have an asked at value. It means they're sort of
not published yet.

So we all know.

So what we need to do is write a custom query inside this method. We all know that
with databases, we use SQL queries to talk to them well in doctrine, it has a
slightly different internal language called DQ well doctrine, query language, but
don't worry. It's almost identical to SQL. The main difference is that with doctrine,
query language, you referenced class names and property names instead of table names
and column names, but it generally looks exactly the same. Now you absolutely can
write DQS strings by hand and then execute them through doctor. Or you can use this a
really handy object called a query builder, which, which allows you to build that
query string with a really nice fluent interface that you see here. So that's what
we're going to do. So let's walk through these lines here, whenever you start just to
great agreeability you can call this->great query builder because we're inside of the
question repository. This line already knows to select from the question table. The
queue here becomes basically the table Eylea. So every, every like select star from
question as cute. And so you use queue everywhere else when you're referring to
different properties on that class.

And then most of the methods in the query builder are like very intuitive, like, and
where order by, uh, the limit is set max results. And you see here when you use the
end where you can see it says, queued out example, field = colon value. This is a
prepared statement. What we don't want to do here. If assuming that value was maybe
an argument passed to us, we don't want to do here is actually just concatenate that
into the string, cause that could give us SQL injection. So instead of we say = colon
Val, then we call set parameter. And we kind of basically tell doctrine that, Hey,
this Val here, um, is actually whatever this second argument is. So you'll see some
things like prepared statements. That's nothing unique to doctrine, but I wanted to
point that out. All right. So let's clear out these four lines here and make our
query.

What we want to do first is we want to say and where, and say Q dot asked at is not.
No. So don't return to me anything where the asset is. No, then we can say order by,
and we'll say cute asked app. And then the second argument, I'll say descending, and
that's it. Now I do want to point out I'm using ant. You might think using, and
where's all the weird, because we don't have a ware statement, but it's totally legal
to do that. It's really nice. You don't have to worry about if there are, is already
a where statement, doctrine, figures out that there isn't an, and, and that is smart.
So you can absolutely use and where here. And I recommend always using an where,
because there is a where method, but if you use where it might delete, it would
remove any previous ware clauses you have.

So if I accidentally use where after and where that would remove the first one, so
basically always used and where and doctrine will create your query correctly. Now,
once you've created your query, you always finish with get query, which transforms it
into this finished query object. And then down here, get result. Well, get results is
going to return is an array of question objects, which you can actually see. I
already have in my at return statement. Um, if you want to return only a single
question object or no, even say, get, get one or know result, she'll always finish
with either get one or no result or get results. So with any luck, this will return
the array of question objects with using this query. All right. So let's try it move
over refresh and it works. Okay. I can't exactly tell them this page if it's hiding
the right stuff, but let me click into the web Debo toolbar here and beautiful. I'm
gonna say if you format query, it makes it really easy. So it's like all of my
columns where Q that asset is not no order by Q dot asset descending. That is
perfect.

Now we're not going to talk too much more about creating custom queries in doctrine,
but we do have an entire tutorial about doctrine queries that you can look at. It's
built on a bit of an older version of Symfony, but all the information in there about
doc and queries hasn't changed at all. And yes, if you ever have a super duper custom
complex query and you want to write it in normal SQL, you can absolutely do that. And
the doctrine query tutorial shows you how. So this is the flow. Whenever we need to
query for something, we're going to get the repository for that class. You either
call a custom method that we created or call one of the built in methods. And
actually there's an easier way to get our repository, then getting it through the,
then, then this so far always been telling you that we need to get, we all should
auto wire, the entity manager, and then call get repository on it and pass it the
question class.

But in reality, the question repository is, is a service in our container, which
means that we can auto wire it directly. So check this out instead of entity manager
interface, argument, I'll say question repository, repository, and then I can delete
the entity manager error or get repository line. And that if I go back and refresh
works exactly the same. So in practice, when I need to queer for something, I auto
wired the specific repository class that I need. The only time that I usually work
with the entity manager directly is when I need to save something. For example, a
new, when we do need the entity manager so that we can call persist and flush on it.
All right, next, let's do a little bit more work inside of our question repository.
I'll show you a pattern that you can use inside of here to reuse different parts of
your custom query.

