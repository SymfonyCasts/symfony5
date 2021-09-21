# Collection Criteria

Coming soon...

Whenever we run to the answers for a question we only want to render the approved
answers. I got clever in did this by adding a `getApprovedAnswers()` method. And it
loops over all the answers then returns only the ones who status is approved. The
problem is performance. It's pretty silly that we're querying for all of the answers
for this question, just so that we can render some of it. If there are only a few
non-approved answers, no big deal, but if we get a lot of spam and had many
non-approved answers, this page could start logging like really slowly. Imagine it
querying for 200 answers only to render six. Unfortunately it's not like we can grab
the answer repository service from inside of this method and create a custom query.
So are we stuck? Do we need to back up into our controller, do the custom query for
the answers here and then pass them into the template. Fortunately, no doctrine has a
special criteria system for just this situation. It allows us to describe how we want
to filter the answers so that it can do the query for us.

It looks like this, remove the filter stuff entirely instead say `$criteria = Criteria`,
get the one from `Doctrine/Collections`, `::create()`. And then this kind
of looks like the query builder. So it has `->andWhere()` method, but the big difference is
inside of here. We're going to use the criteria, uh, and a criteria expression. So
we'll say a `Criteria::expr()`, and then he uses `->eq()` function for
equals, and then you'll pass this `status`. They feel that you want to compare it to,
and then the value you want to look at, which is going to be `Answer::STATUS_APPROVED`
So you see what I mean? It's kind of similar to the query builder and it
ultimately gives us an object that describes our query to use this 
`$this->answers->matching($criteria)`, and then pass it criteria. So I find the criteria syntax to
be a little bit cryptic, but it's usually pretty easy to get the job done. Let's go
see if it works, refresh the page. And let's open up the profiler, look at the
queries for this. And yes, we have six results now. And after we refresh, yes, still
six results. We're still filtering out the unapproved answers, but check out the
queries for this page. That's what we want it inquiries for all answers that match
this question and who status = approved. Even the count query above this is correct.

So that's the criteria system. And other than getting a little bit fancier with the
expressions you can create, that's basically it. If you don't like having the query
logic in your entity, I don't blame you. You can always move it into your repository,
copying this criteria code and then open up `src/Repository/AnswerRepository`.
Since this criteria relates to answers, I'm going to delete this example code. And
instead of creating a public static function Called `createApprovedCriteria()`, which
will of course return a `Criteria` object. And I'll paste my logic in here and we can
just return this. So the reason I'm making this public static is because I want to be
able to call this from my question entities. So it needs to be static. And
technically static is just fine. Cause it's not like this needs to use the, this
variable to do anything.

Anyways. Now we have this back and question. We can simplify this to return 
`$this->answers->matching(AnswerRepository::createApprovedCriteria())`
Cool. If you go back to the site and try now still six questions, it still
works. One cool thing about these criteria objects is that you can also reuse them
with the query builder. For example, suppose you need to create a custom that returns
10 approved answers. Let's add a new method for this. So normally we normally do this
by saying something like public function `findAllApproved()`, maybe an `int $max = 10`
argument and this whole return and array. Although more specifically now at all, PHP
documentation out there to advertise that with this really is, is it going to return
an array of answers? Anyways, inside of here, we create the cream query builder like
normal. We say, return `$this->createQueryBuilder()`, pass it, aliens `answer`.

Then this point, if we wanted to, um, filter by the status, we would normally say 
`->andWhere('answer.status = ?')` and then fill in the rest of the details. Of course, we
want to do that without duplicating the logic of up here. So we can actually use this
criteria by saying `->addCriteria()` and then `self::createApprovedCriteria()`.
That's it. From here, we can finish the query like normal, I'll say `setMaxResults($max)`,
and then `->getQuery()->getResult()`. I won't use this right now, but
hopefully you get the idea next. Let's add a new page to our site that shows the most
popular answers. This will give us a great example to learn about and solve the N
plus one problem. We'll solve it by adding a join by printing a custom query that
joins across our relationship.

