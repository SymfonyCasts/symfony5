# Votes

Coming soon...

We are on

Quest to make everything on the question page, truly dynamic right now, each question
can get up voted and down voted, but this is still totally hard-coded. The six is
just coming from the template. Let's fix that. Here's the plan. We're going to add a
new votes into your property, to the question entity. When you click this up, button
will increase the number. When you click down, we'll decrease it in the future. When
we have a true user authentication system, we can make this smarter by recording who
is voting and preventing a person from voting multiple times, but our plan will work
great for now. Okay. Step one, add a new field for entity. We could do this by hand
by copying one of these properties and adjusting the options and then going and
creating a getter and a setter for it.

But

There is an easier way spin over and let's run Ben console, make entity. Once again,
I could use a Symfony console for that. Well, since I don't need the environment
variables from the Symfony council right now, I'll just run, make entity. Okay. All
right. We're going to update our question at city. We'll add a new field called
votes. We'll have it be an integer type and we're going to have this mean not
nullable in the database. When the questions first graded, probably the vote count
should be zero and

Done.

If we look back over on our end state, what we'll see is they exactly expect a new
votes property. And then down here, a get votes and set votes methods. Alright, next
let's make our migration this time. I definitely need to use the Symfony console make
migration so that it can read the environment variables from the Symfony terminal,
from the Symfony binary, And when going to hit that, it generates one migration. And
I was like to go over and just double check the migration to make sure it doesn't
contain any surprises. That looks perfect. And then we'll execute that with Symfony
console doctrine, colon migrations, colon migrate.

Beautiful.

Alright, so this is looking good. So, but I have a surprise. If you go to /question
/new our little URL, that creates a new questions. It breaks here. It says near the
end, the exception is coming from the database, not from Symfony. Exactly. It says
integrity, constraint, violation, column votes cannot be no. Hmm. Okay. So that makes
sense. We didn't set the votes column, so it's trying to create it in the database as
no, but what we really probably want is for the votes to be zero in the database, if
we didn't set them manually, but how could we do that in doctrine? How can we default
the value of a column? Well, actually that's not the right question to ask. The real
question is how can we default the value of a property in PHP?

And the answer to that is simple. And our question entity just say, private votes =
zero. It's that easy. Now, when we instantiate a question, object votes will be zero.
And when it saves the database, the votes will be zero. Instead of null. Now you try
to create a new question. It works again. The cool thing about this is that we can
also clean up our get votes method a little bit. So scroll down to the bottom here.
You can see that the gift boats method has a return type of a nullable integer, and
it was generated that way because there was no guarantee that the votes property was
going to be set ever. So now we can actually remove that question, Mark, because we
now know that this will always return an integer.

Okay. Let's start rendering the vote. Count on the show page to make this more
interesting though, because all of our votes, all of our questions right now have
zero votes. Let's get each new question that we created this page or random number of
votes. So on question controller, let's scroll up to our new action. And down here,
I'm going to say question arrow, set votes, and we'll give a random number from
negative 20 to 50 votes for each one. We're going to refresh this page a few times.
We'll get some new, interesting items in the database, but copy the slug of the last
one. Put that into my address bar and perfect. And we're now looking at one of the
questions that has a real number of votes. Finally rendering this right here is the
easiest part. The template for this lives in the templates question showed that HTML
twig. And let's see here a question number right here, plus six. Let's replace that
with curly curly question. That votes Good boring code back at the browser. When we
refresh there, it is minus 10. As you can see when the vote is negative, it has a
little minus number right here, but when it's positive, let me go create another
question that will hopefully have a positive number. Yes. When it's positive, it's
just 10, not plus 10,

But for clarity, our designer actually wants that to have a plus symbol when it's
above zero. Okay. That's simple enough. We could just add some extra twig logic. If
the number is positive, then we can add a plus sign before the vote number easy.

Wait. Yeah.

There's nothing wrong with having some logic in twig, but if there is another place
that we could put that logic, that's usually better. In this case, we can add a new
method to our question, entity itself, a method that returns the string
representation of the vote count. This would keep the logic out of twig and even make
that functionality reusable. Check it out in the question entity. It doesn't matter
where, but I'll put it right after get votes. So that it's with next to that method,
I'm going to say public function, get votes string, and assuming a function that
returns a string inside. We're just going to do the logic for adding the plus or
minus symbol when it's needed. So I'll say prefix = this arrow, get votes if it's
greater than or equal to zero. And I'll add a plus symbol Ellis L add a minus symbol,
and I need to make sure I actually get my Turner's syntax, correct there. And then
down here, we can return a sprint F

Of present S or using my tethering

Probably. Okay. I was going to turn it off, but then I thought maybe you're using, I
think I am using it. Yeah. Thank you. Present S presented D and then for the present
asks, we'll do prefix. And then for the percent D uh, since I already had the minus
sign up here, when it's negative, we're actually going to want the absolute,

This->get votes. How nice is that? A reusable function, a clear reusable function,
um, that we could even unitask if we want it to now and Twitter to use this, we can
say question about votes string. That's it. Let's try it back with the browser when
we refresh there it is. Plus 10. The cool thing about this is that we said question
that votes string, but there is no votes string property inside of our question. And
Steve, and that's fine because twig is smart enough. When we say question that vote
string to look for a get votes string methods. So this is what it calls next. Now
that we're printing the vote number, let's make it possible to click these up and
down vote buttons to actually change the value of that votes column in the database.

[inaudible].

