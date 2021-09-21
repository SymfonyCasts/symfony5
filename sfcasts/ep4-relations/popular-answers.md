# Popular Answers

Coming soon...

Let's build a most popular answers. Page, top answers page, where we list the most
popular answers for all questions on the site. Let's put it over here in answer
controller, I'll create a new public function called `popularAnswers()` and evolve.
This. I will give us `@Route()` whose URL is `/answers/popular`. Also going to give us a
name right now, because we'll need that in a second to create a link to this 
`app_popular_answers` inside for now. I'm just going to return `$this->render()`. Let's just
render a template called answers. Okay. `answer/popularAnswers.html.twig`.
Okay. I'll copy that template name down of templates. We need to create that new
directory called `answer/` inside. There is a new file called `popularAnswers.html.twig`
Then I'll paste in a little structure to get us started. We'll extend
`base.html.twig`. I'll override the `title` block to customize the title on the page.
And then the Bach `body`. I'll put a little bit of structure here, But mostly I'll just
put an `<h1>` that says most popular answers. Cool. Before we try this, let's go
into `base.html.twig` and let's link to this.

So scroll down a little bit inside of our navbar here. We have an empty `<ul>`, uh, a 
`<li>` classical's `nav-item`,

And they'll generate a URL to the popular `app_popular_answers` page and say answers.
I'll just need to give this a `class="nav-link"`. Cool. Let's try it when I refresh
there. And the like, and wonder if we get got it a boring, but functional page to get
the answers out of the database. We need a custom query. Well, technically we could
just use the, `findBy()` method on the `AnswerRepository` and use its border by
argument, but let's add a full custom method. So open up answer repository. And at
the bottom it's called the new function `findMostPopular()`.

It will return an `array`. And I'm also going to advertise on top that more
specifically, it returns an array of `Answer` objects. Instead of here, it's a fairly
simple query. I'll say, return `$this->createQueryBuilder('alias')` alias. To answer I'm going
to use `addCriteria()` and reuse `createApprovedCriteria()` from earlier so that this only
returns approved answers. So `self::createApprovedCriteria()`, and then we need an
`->orderBy('answer.votes', 'DESC')`. And I'll say, `->setMaxResults()`? Do we only get
the top 10 then `->getQuery()`, `->getResults()`? Beautiful. All right. Let's use this method
inside of our controller. So we'll auto wire `AnswerRepository $answerRepository`,
and then I'll say `$answers = $answerRepository->findMostPopular()`. We'll add a
second argument to our render call pass and answers variable and set two answers and
the temple for this very simply.

I'll add a UL let's loop over them with `{% for answer in answers %}` and four and inside.
I'm going to do it very simple, very simple for now. I'm just going to print out,
`answer.votes`, just the vote count for each of those answers, just so we can see
that we get 10 results on the page. All right, let me move over and refresh yes. 10
answers on the page with the most highly voted on top. Okay. So on a normal question
page, we already have a nice structure for rendering answers. Let's reuse this on our
new popular answers page. So go to `questions/show.html.twig`. So
basically we want to take everything inside the four loop here, this entire `<li>`,
which renders a simple answer. Copy that. And then the `answer/` directory create a new
file called `_answer.html.twig` and paste that in there back and showed an
eight month wait. We can delete that now and just `{{ include('answer/_answer.html.twig') }}`
Thanks do this. I'm going to copy that.

And then in popular answers, I will print it. I don't remember this_answered at age
12 two. It actually includes the `<li>` element, so that will fit perfectly inside of
our UL. All right, let's check it out and awesome. Looks great. But Hmm, in this
context, we would be more useful if we could actually see which question this answer
is answering, but I only want to show that here. I don't want to also render the
question on the question page, because that would be redundant over un `popularAnswers.html.twig`
that will twig at a second argument to `{{ include() }}` and passing a new variable called 
`showQuestion: true`. Now, an `_answer.html.twig`, We can use that. So say if
`showQuestion|default(false)` default, false the `|default(false)` means if we
don't pass this variable in, we won't get an error, but it will default to false call
at the end, Def and inside of here. Okay.

I'll add the, `<a>` tag, The `href=""` set you `{{ path('app_question_show') }}` that's the route to the
question. Show page passing `slug` said to `answer.question.slug`, that I'm also going
to give this a `class="mb-1 link-secondary"` Inside the, for the
text. Let's do a `<strong>` tag with the word question,

And then actually print that question with `answer.question`. That will give us
the question object, then another `.question` to get the question property off of
the question object. That looks a little funny and I'm going to talk more about that
in a second. All right. We'll move on now and refresh, ah, we are crushing it except
for the obvious problem that this question is way too long and it looks terrible.
Let's truncate that and render just a preview on this page. So as we know, this
comes, that tax comes from this line right here. Answer that question, not question.
And before we think about truncating it, that by itself looks kind of funny. I even
had to explain what it was doing.

We can make this line easier and a lot more by adding a custom method to our answer
class, check this out, open `src/Entity/Answer`. And it doesn't matter where, but
I'm going to put it right by `getQuestion()`. Let's add a new method here called public
function. `getQuestionText()`, which will return a `string`. So on a high level, this
makes sense. If I have an answer object, there's a good chance that I might want to
easily be able to get the question text related to this answer. So that's the job of
this method. First thing I'm gonna do is I'm gonna code defensively. I'm gonna say if
not `$this->getQuestion()`. So if there is no related question object, let's just return
empty quotes. Now the question property is required in the database. So we can't
actually save an answer to the database without a question. But in theory, we could
create a new answer object, um, and then call this method on accident. Before we set
the question, and if we did that, we get a fatal air. This will avoid that fatal
error. So it's probably not needed, but it's just a good practice. And at the bottom,
I'm going to return `$this->getQuestion->getQuestion()` just in case P is
technically that property could be null. If the question isn't saved once again, I'm
going to kind of code defensively and cast that to a string.

Anyways, thanks to this new method over an `_answer.html.twig`. We can change
this to `{{ answer.questionText }}` Now let's so much nicer and the front end doesn't
change at all. So now let's shorten this. So here's the cool thing in twig. There's a
special filter called `|u`. Now what this `|u` does, is it leverages Symfony's
string components to give you what's called a Unicode string. It's basically an
object that wraps this string over here. And then it has a bunch of useful methods on
it. One of the use of methods is called truncate. So you can say `.truncate()`, and
then you can tell it how long do you know to truncate if it's longer than 80
characters. And if it's longer than 80 characters to add a .... Now, before I
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
composer require twig/string-extra. No problem. Find your terminal run 

```terminal
composer require twig/string-extra
```

And when it finishes, we can now refresh and see
awesome. Our truncated question up here. So cool bots. Look at the web debug toolbar
down here. There are eight queries on this page. There are eight queries on this
page, which simply which just renders 10 answer objects. How is that possible? We are
seeing the N plus one problem in action. Look, one about this database problem. Next
in COE can use join queries to solve it.

