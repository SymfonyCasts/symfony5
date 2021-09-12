# Saving Relations

Coming soon...

Our answer table has a new question. ID column. The question is how do we populate
that column? How do we relate an answer to a question? Do we, this is actually pretty
easy, but it might feel weird. At first let's open up source data fixtures at
fixtures. We're using Foundry to add riches fixtures, or fake data into our project,
but to see how relationships work for it. Now let's do some manual coding. Okay. Down
here, I'm going to create A new answer object And populate it with some data. Well
that I'm also going to create a new question object by hand and do the same thing,
populate it with some data. So boring answer object and a boring question. Object to
get these actually to save to the database. Since we're creating a manually, we need
to call it the manager->persist on both of them. Cool. Now, if we stop now, these
two, aren't going to be related and actually let's try this higher terminal run the
Symfony console doctrine fixtures load to reload the fixtures. Perfect. Okay. When
you run this oh, column question ID and field list, ah, Ryan, we generated this
migration in the last chapter, then I totally forgot to run it. Let's run typically
console doctrine, migrations migrate. There we go. Now let's run doctrine, fixtures
load, and it fails question ID cannot be no on the answer table because we made the
question ID required. Okay.

[inaudible]

Do you want to get specific? If you look at the answer question, answer Anthony, and
go up to the question table. It's this joint column nullable = false. That makes the
question ID column required in the database. Anyways, the question we want to answer
is how can I relate this answer to that question? How do we say that the answer
belongs to this question? Is it as simple as answer? Aerosept question question.
Notice that we do not say question-> get ID. We're not passing the ID to be
questioned property. We're actually setting the entire object onto the answer. Doctor
will be, Dr. Will be smart enough to save these in the court, correct order. We'll
actually say the question first, then take the ID from the new question and S uh, and
use that to save the answer and the table set to that ID need to explain that better.
Doctor will be smart enough to save these in the correct order. Then use the idea of
the question for the question ID column. So that's it. Let's try it. Run. Doximity
council, Dr. Pritchard load and no errors, the super segment database. We can run.
Symfony console doctrine query ask you. Well, a nice, easy way to generate SQL
queries against your database. And let's say select star from answer and awesome. We
see one answer in the database and it has a question ID set to 1 0 3.

You want, we can go and query for the question or the ID. You want a three? And there
it is.

So the big takeaway here is that in PHP, we just think about objects. We just think I
want to set the, uh, I want to take this for this answer. It's question is this
question object then behind the scenes, doctor will do the work of figuring out the
foreign key and getting the ID and saving everything in the database. The database is
almost an implementation detail. We run them down in Peachtree, uh, relating objects.
Next what's update. Now that we have this, now that we can see how this works, let's
update our fixtures to use Foundry that will let us create a ton of fake questions
and answers and relate them with very low code.

