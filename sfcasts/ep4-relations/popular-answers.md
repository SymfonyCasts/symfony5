# Popular Answers

Coming soon...

Let's build a most popular answers. Page, top answers page, where we list the most
popular answers for all questions on the site. Let's put it over here in answer
controller, I'll create a new public function called popular answers and evolve.
This. I will give us a route whose URL is /answers /popular. Also going to give us a
name right now, because we'll need that in a second to create a link to this app,
popular answers inside for now. I'm just going to return this->render. Let's just
render a template called answers. Okay. Answer /popular answers that .html.twig.
Okay. I'll copy that template name down of templates. We need to create that new
directory called answer inside. There is a new file called popular answers dot HTML,
that twig, Then I'll paste in a little structure to get us started. We'll extend
based at HTML twig. I'll override the Title block to customize the title on the page.
And then the Bach body. I'll put a little bit of structure here, But mostly I'll just
put an age one that says most popular answers. Cool. Before we try this, let's go
into base that HTML twig and let's link to this.

So scroll down a little bit inside of our navbar here. We have an empty UL, uh, ally
classical's nav item,

And they'll generate a URL to the popular at popular answers page and say answers.
I'll just need to give this a class = now link. Cool. Let's try it when I refresh
there. And the like, and wonder if we get got it a boring, but functional page to get
the answers out of the database. We need a custom query. Well, technically we could
just use the, find a buy method on the answer repository and use its border by
argument, but let's add a full custom method. So open up answer repository. And at
the bottom it's called the new function find most popular.

It will return an array. And I'm also going to advertise on top that more
specifically, it returns an array of answer objects. Instead of here, it's a fairly
simple query. I'll say, return this->create query welder alias. To answer I'm going
to use add criteria and reuse are approved criteria from earlier so that this only
returns approved answers. So self colon, colon approved criteria, and then we need an
order by answer.boats the Sunday. And I'll say, is that max results? Do we only get
the top 10 then get query, get results? Beautiful. All right. Let's use this method
inside of our controller. So we'll auto wire answer repository, answer repository,
and then I'll say answers = answer repository arrow, find most popular. We'll add a
second argument to our render call pass and answers variable and set two answers and
the temple for this very simply.

I'll add a UL let's loop over them with four answer in answers and four and inside.
I'm going to do it very simple, very simple for now. I'm just going to print out,
answer that votes, just the vote count for each of those answers, just so we can see
that we get 10 results on the page. All right, let me move over and refresh yes. 10
answers on the page with the most highly voted on top. Okay. So on a normal question
page, we already have a nice structure for rendering answers. Let's reuse this on our
new popular answers page. So go to questions /showed at age two months quick. So
basically we want to take everything inside the four loop here, this entire LOI,
which renders a simple answer. Copy that. And then the answer directory create a new
file called_answer dot HTML that twig and paste that in there back and showed an
eight month wait. We can delete that now and just include answer slash_answer dot
aids, Timo flick. Thanks do this. I'm going to copy that.

And then in popular answers, I will print it. I don't remember this_answered at age
12 two. It actually includes the L I element, so that will fit perfectly inside of
our UL. All right, let's check it out and awesome. Looks great. But Hmm, in this
context, we would be more useful if we could actually see which question this answer
is answering, but I only want to show that here. I don't want to also render the
question on the question page, because that would be redundant over unpopular answers
that will twig at a second argument to include and passing a new variable called show
question. True. Now, an_answered at age two months, wig, We can use that. So say if
show, question pipe default, false default, false the pipe default false means if we
don't pass this variable in, we won't get an error, but it will default to false call
at the end, Def and inside of here. Okay.

[inaudible]

I'll add the, a tag, The ADF set you path app question show that's the route to the
question. Show page passing slug said to answered that question, that I'm also going
to give this a class = M B dash one and the link dash secondary Inside the, for the
text. Let's do a strong tag with the word question,

And then actually print that question with answer that question. That will give us
the question object, then another dot question to get the question property off of
the question object. That looks a little funny and I'm going to talk more about that
in a second. All right. We'll move on now and refresh, ah, we are crushing it except
for the obvious problem that this question is way too long and it looks terrible.
Let's truncate that and render just a preview on this page. So as we know, this
comes, that tax comes from this line right here. Answer that question, not question.
And before we think about truncating it, that by itself looks kind of funny. I even
had to explain what it was doing.

We can make this line easier and a lot more by adding a custom method to our answer
class, check this out, open source entity answer. And it doesn't matter where, but
I'm going to put it right by get question. Let's add a new method here called public
function. Get question text, which will return a string. So on a high level, this
makes sense. If I have an answer object, there's a good chance that I might want to
easily be able to get the question text related to this answer. So that's the job of
this method. First thing I'm gonna do is I'm gonna code defensively. I'm gonna say if
not this->get question. So if there is no related question object, let's just return
empty quotes. Now the question property is required in the database. So we can't
actually save an answer to the database without a question. But in theory, we could
create a new answer object, um, and then call this method on accident. Before we set
the question, and if we did that, we get a fatal air. This will avoid that fatal
error. So it's probably not needed, but it's just a good practice. And at the bottom,
I'm going to return this arrow, get question->and get question just in case P is
technically that property could be no. If the question isn't saved once again, I'm
going to kind of code defensively and cast that to a string.

Anyways, thanks to this new method over an_answer that is round twig. We can change
this to answer that question text. Now let's so much nicer and the front end doesn't
change at all. So now let's shorten this. So here's the cool thing in twig. There's a
special filter called pipe view. Now what this pipe U does, is it leverages Symfony's
string components to give you what's called a Unicode string. It's basically an
object that wraps this string over here. And then it has a bunch of useful methods on
it. One of the use of methods is called truncate. So you can say that truncate, and
then you can tell it how long do you know to truncate if it's longer than 80
characters. And if it's longer than 80 characters to add a dot.dot. Now, before I
trust, I just want to show you more about the Symfony string components.

So if you Google for a Symfony string opponent, you'll find some documentation about
it. And inside of here, if you kind of look at usage, a lot of examples down here,
but ultimately you'll see that in PHP and Symfony, you can actually, you have
actually have access to a UW function which returns to you, a new Unicode string. So
the twig filter is doing the exact same thing as this. And then below this, it starts
to tell you all kinds of cool methods that you can use to do different things. So for
example, if you check if a string is empty, uh, but more interesting, you can, um, go
to lowercase title, case, camel case, snake case, and there's even ways to check. Uh,
and there's lots and lots more methods on here. So this is useful in twig, but it's
also just useful inside of PHP. Here's our truncate method that we're leveraging
right here.

But if we try it and it doesn't actually work, it says that you felt were using as
part of these string extension, which is not installed or unable. Try running
composer require twig /string extra. No problem. Find your terminal run composer
required twig /string extra. And when it finishes, we can now refresh and see
awesome. Our truncated question up here. So cool bots. Look at the web debug toolbar
down here. There are eight queries on this page. There are eight queries on this
page, which simply which just renders 10 answer objects. How is that possible? We are
seeing the N plus one problem in action. Look, one about this database problem. Next
in COE can use join queries to solve it.

