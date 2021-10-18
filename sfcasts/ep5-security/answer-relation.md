# Answer Relation

Coming soon...

Our site has users and these questions are created by those users. So in the
database, each question should probably be related to the user that created it via
doctor relationship. Right now, if you open source entity question that PHP, that is
not the case, there's nothing that relates this back to the user that grid it. So
let's fix that terminal from Symfony consult and make entity. We are going to modify
the question entity and add a new property called owner. So the owner of that
question, this is going to be a many to one relationship. If you're ever not sure you
can type a relation here and it will guide you through a wizard to help you make that
decision. But many questions can be related to one user is a related to the user
class, and then the owner property will not be noble. Every question must be owned by
someone then asks if we want to map the other side of the relationship. So we can say
user arrow, get questions that might be handy. So let's say, yes, we'll call that
property questions. And finally, I'm going to say no to orphan removal and done.

If you went through our doctor relationships, Oriel, there's nothing special here,
many, 2, 1, 2 owner. And then there's a getter and setter methods on the bottom and
inside of the user. And the other side of the relationship is, uh, the other side of
the relationship was just mapped. So let's go make a migration for this Symfony
console, make migration, and as usual, we'll run over to migrations and check that
out to make sure it contains only the Symfony. Yep. All the table question, add owner
ID and then the foreign key stuff. So let's run that Symfony console doctrine,
migrations migrate and it fails. Oh, that's okay. It fails because there are already
existing questions in the table. So adding a new owner ID, not no makes those
existing ones explode. And the doctor relations tutorial, we talked about how to
responsibly handle fix, and test failed migrations because we already talked about it
there. I'm just going to take the easy right off route here and just drop our
database Symfony console doctrine database drop dash dash force, oops. Create a fresh
database doctrine database create, and then migrate from scratch doctrine. Migrations
migrate Gorgeous. If you try to reload the fixtures with doctrine, that fixtures
load, we're also in for a nasty surprise. There insert into question is failing
because owner ID cannot be no. That makes sense. We have not yet gone into our
fixtures and given every question and owner

To fix that, go into source factory question factory, remember and get defaults. Our
job is to try to give some default value for every required property. So I'm not
going to add an owner key here, and we'll just set that to user factory colon, colon
new. So if we use the question factory and don't override any variables, this will
create a brand new user for every new question, but instead of our fixtures, it's not
exactly what we want. So down here at the bottom, you can say, this is where we
create our users. What I want to do now is create these users. And then when we
create our questions up here, actually up here, I want to use one, a random user from
the ones that were already created. So to do this, I'm going to first kind of move
our users up to the top so that those are created first, okay. Then down here for our
main questions, We'll pass a function. That's going to return an array and we will
override that owner property to be user factory, colon, colon random. I'm not going
to worry about also doing it for these unpublished questions down here I could, but
I'm just going to ignore that. So new, a couple of new users will be created down
here for those unpublished questions.

[inaudible]

All right. Let's try the fixtures again. And now

[inaudible],

This will dig a little bit longer cause we're going to users. It works cool. Final
step here is we get to celebrate. Now that our question has an owner on the front
end, we can start actually rendering real data instead of always having the same cat
picture written by the same tissue. Those are both hard-coded. So let's start in our
homepage. So I'll open up templates, question home page, that age channel that TWIC.
And here's where we loop over the questions. So first for the avatar, Hey, we can use
our nice curly curly question. That owner dot avatar, U R I, that we created earlier.

[inaudible]

And then down here towards the bottom. Here's where we say, who wrote it? We'll use
question dot owner dot display, name, that other custom method we created earlier.
Now our page starts to look real. Yes. All right. So let's click into one of these
and do the same thing for the show page. So in this case, we want show that HTML,
that twig, same thing for the avatar Question, that owner that avatar you are I

[inaudible] [inaudible]

And down here, let's see. Here we go. Say curly, curly question dot owner dot display
name. And actually I forgot to do one thing. Let me copy that. Display anything, go
back up to my image. Avatar. There we go. I'll I'll be responsible and make sure I
update the alt on the image as well. Alison needs to do that over here on the
homepage. Beautiful. All right. So in refresh this page, now that is also dynamic.
Woo. So let's go one step further. What's at a page where the owner of this question
can edit it. We're not going to build this out all the way, but we are going to get
it started. And this is going to lead us to a really interesting security situation.
So over in source controller, question controller, not PHP. We're going to go down
here and let's add a new edit end point. So I'll actually copy these show. End points
I can cheat. And then we'll call. This says questions /ad /log app question, Calling
method edits, and then inside of here, all I'm actually going to do is just render a
new template, show questions /edit that HR on its way and passing the question. Let's
go create that template templates question, edit that age channel on a twig.

And I'm going to paste in just a basic template. So nothing special here, except that
I'm printing the dynamic question, but there's not actually any form. I'll leave that
to you. Okay.

[inaudible]

Before we try this page, let's also go to the question show template. I can add a
little edit link right below to help out the owner. So back in question, /showed at
HTML that twig

[inaudible]

And actually let's put the link a little further down and search for the age one on
here. Here it is. Give us around the age, old with the new class, The flex and
justify content between that will let me put the age one there. And then we can also
add a link. So H a R F = path app question edit. Of course we need to pass this the
wild card, which is the ID. That two question, that ID

[inaudible]

Oh, actually in this case, it is called slug. So let me make sure I changed that. Not
ID, but slot question. That's like cool. And I'll say edit, and let's give this a
couple of classes. Class. You can be 10 dash secondary BTN dash is small. Okay. So

[inaudible]

Thanks that we now have an edit button on the question with, With, if I add MB two,
there we go. A little margin bottom. When I click it, I go to the edit question page,
and we're going to pretend that this has a form on it. Now, of course, in order to
get to the edit question page, you can't let anyone go here. You need to be the owner
of this question. So inside of question controller, edit, we need a security check.
So first we need to make sure that the user is logged in at all. So I can say
this->deny access unless granted

Is authenticated remembered. As soon as I do that, I I'm guaranteed that I will have
a user object if I say this user. So we can say, if question arrow, get owner does
not equal this->get user. That means someone else is trying to get to my edit page.
And so we can throw a vis arrow, create access to the night exception. I'll say you
are not the owner, but again, remember these error messages here are only shown to
developers the end user to see an access to an I page. So if I try this, I'm probably
not the owner. I try this. I'm actually not logged in at all right now. If I try
this, I'm not logged in at all. So when I refresh it kicks me back to the login page.
Yay. But there's kind of a problem with this.

I do not like if we're going to do our security kind of manually like this, then it
means that on the question show page, I'm going to have to repeat that logic in twig
in order to hide or show the edit button at the, at the correct times. And what if
our logic is worse? What if you can get to this edit page, if you're the owner, or if
you have role admin that would make this more complicated and we'd have even more to
duplicate inside of twig, we do not want to duplicate our security rules. So next
let's learn about the voter system, which is the key to centralizing all of this
authorization, logic, any beautiful way.

