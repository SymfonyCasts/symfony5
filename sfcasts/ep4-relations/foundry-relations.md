# Relations in Foundry

Coming soon...

We're using a library called a Foundry to help us generate rich fake, fixed your
data. Right now, it's creating a 25 questions. Let's use boundary to also add some
answers. Start by generating the factor in class, do this with Symfony console, make
factory, and we want to generate the answer factory. Beautiful. Let's go check that
out. Source factory answer factory. All right. Down here. Really, the only work we
need to do is inside is inside and get defaults where we give a default value for
each property on the class, and we even have fingers so we can set it to some fake
data as a best practice. You want to set all of your required properties in here so
that you at least have enough data to create a valid answer in your database.

All right. Some of the tweak this a little bit, let's say username. There is actually
a username property, a faker method, then four votes instead of random number. I'm
going to say a number between negative 20 and 50, and I'm going to delete the updated
app, but I'm going, I am going to set the created at two, a failure method called
eight time between where we can say something like minus one year, and then now would
be the end date that we're drinking is the default value. So I don't actually have to
specify it. Cool. So if we go back to add fixtures and I'm going to remove all of
this answer, question stuff who did by hand, and instead I'll say answer factory,
create many, and let's create a hundred answers. Now notice in answer factory. Oh,
actually I have a typo. There we go.

And the answer factory, I haven't set the question yet. So if we spend our tour
terminal and run Symfony console doctrine, fixtures load, now we're going to get that
same question. ID can not be known, which we expected all. Alright, so inside of
[inaudible], one of the ways we can set the question is by setting a second argument
here, which is going to be in a red attributes that we want to set onside of this
answer. So for example, we can set question to question a factory and then as a
really cool method on it called random. So ultimately now when we create the, uh,
when we call answer back to create many, it's going to first call and get defaults,
get this array, then it will add this question to it. And it will ultimately try to
create an answer using all of those values. Now at this point, because I'm using
question factory random, that grabs a random question from database. So it is
important that we create the questions first and then the answers after. All right,
let's try this doctrine, fixtures load and beautiful, no errors. Let's look at the
database.

[inaudible],

I'll say select star from answer and awesome. All a hundred questions to the last one
is index 99. But if you can see lots of great random data, but if you look closely,
there's a problem. Check out the question ID one hundred and forty one hundred and
forty one hundred forty. Yup. All 100 questions are related to these answers are
related to the same one question that's because this question factory random method
is called just once it did fetch a random question, but then it used it when creating
all 100 answers. If you want a different value per answer, you need to pass a
callback function to this second argument. So callback function. That's the second
argument that returns the array of attributes to use.

Try now I'll first reload, the fixtures. Perfect. Then query the answer table and
awesome question. I'd be on 74, 1 61, 1 71. Perfect. A hundred answers that are
related to each1 is related to a random question, but to make life easier, we can
move this question value directly into the answer factory. So I'm going to copy this
question line here and then change the fixtures back to the very simple answer
factory, create many a hundred inside of answer factory I'll paste question set to
question factory colon,:random. This good false method is called for each answer.

So it should give us a different random question for each answer. Okay, but let's get
fancier. I love Foundry, but using Foundry with doctor relationships is probably the
hardest part of using that library. So let's pretend that in this situation, we want
to override this question value, which grabs any random question from the database
and instead grab only grabbing a random question. So I grabbed one of the 20 random
published questions. No problem. Put our call back back for the second argument and
return an array here. We can set question to whatever we want. Now there's no fancy
way and Foundry to go and get these 20 questions, but if we can do it pretty easily
by hand by saying questions = that. And then down here, it's a matter of first
getting that question's variable into our function. Let's make sure it's called
questions and then using array Rand twice.

Alright. Using a rate Rand to get a random key and then accessing that off the
questions array. Alright. Once reload, reload the fixtures, beautiful, no errors. And
then let's do a query here and we'll do is to make sure we have, we can do a select
count, actually select distinct question ID from answer beautiful. And this'll tells
us that in the answer table, there are 20 distinct questions that it's related to. So
that did work for if you've gone. I want to show you a really common mistake when
using Foundry with relationships, let's change the default question inside the answer
factory to create a new unpublished question.

Well, you can do this by saying question factory, colon, colon, and new, and then
using a method on there called unpublished. That's something we created in the first
tutorial. It just changes the ask to add to a null value and then actually create it.
I'll say->create. This is totally Weigle. Even though it tech, even though there's a
little mistake here, it will create a new unpublished question, save it to the
database and then, and, and save it to the database and use it as the default
question value. Of course, in our situation where overriding the question key. So
this change should make no difference for us famous. Last words, reload the fixtures.

Okay. No errors, but check out how many questions are in the database. Select star
from question we should have 20 plus five to 25 questions. Instead we have 125. Well,
the problem is subtle. We're creating a hundred answer objects for each1 of those
hundred. The get defaults method is called when that happens. This line at that
moment creates a new unpublished question and saves it into the database. Then a
moment later are our question. The question is overridden. Our question is actually
ends up replacing the one that's used for this answer. This means that our 100
answers I'll share over here are, are correct, are correctly related to those 20
published questions, but it also means that a hundred additional questions were
accidentally created along the way to solve this. Simply take off the great method.

This means that the question key is now actually set to a question that factory
instance, the unpublished method, if I open that up return self. So it's actually
returning the question factory instance that is totally allowed. And in fact, when
you're setting a relation property, you should always set it to a factory instance
instead of an actual created object, why this allows Foundry to delay creating this
object until later. And in this case, it realizes that the question has been
overridden. And so it avoids creating this object entirely, which is perfect. Let's
reload the fixtures one more time. And now if we create a question table, beautiful
back to just 25 questions, we now have an awesome set of data to work with at 25
questions and a hundred answers that are randomly related to be published once next
let's use this new stuff to render answers on the F on the front end.

