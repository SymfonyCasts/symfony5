# Verify Email

Coming soon...

On some sites after registration, you need to verify your email. You're familiar with
the process you register on some site. Then they send a special link to your email.
You click that link and wallah. Your email is verified on their site. If you don't
click that link, depending on the site, you might not have access to certain
sections, or you may not, not be able to log in at all. What's that an email
verification system to our registration form. This was actually one of the questions
that asked us when we ran, make somebody council make registration form and asked us
if we wanted, uh, to have an email verification process. If we had said yes, it would
have generated some code for us. We said no. So we're going to build it by hand,
which is going to be better anyways. Cause it's gonna then we'll know exactly how we
can customize the behavior. First things first though, on my user class, I want there
to be, to be some way that I can track whether or not a user object has been
verified. So I'm going to add a new what's that a new field to this. If any console
make entity. So update user and add an ism, verified Boolean, feel tight. Perfect.
When that finishes back over in that class, let's see. There it is. It is verified.
And I'm going to default this to false.

Let's go make that migration Symfony console, make migration, go check out that
migration. It looks exactly like we expect and then run that migration Symfony
console doctrine, migrations migrate. Beautiful. And then let's do one more thing
related to the database inside of source factory user factory, just to make life
simpler. I'm going to say is verified true. So by default, any users to be great will
be verified, but I won't. I'll worry about reloading my fixtures later. Okay. So to
have an email confirmation system, we can leverage a bundle or your terminal run
composer require Symfony casts. Hey, I know them /and verify email bundle. Ooh,
beautiful. This moment gives us a couple of services that are going to help us
generate a signed URL and then validate that signed URL afterwards, to get this
working, start opening up our registration controller. So we already have our
registered act, our register method here. We're also going to need one other method.
I'm going to call it public function. Verify user email above this. Let's add our
route at route and I'll say verify, let's get his name = app verify email.

And I'm just going to leave this empty for now. This is when the user clicks the link
in their email. It's going to be in link to this controller. So the job of this
controller is going to be to validate the signed URL, which will prove that the user
did click on the link or whatever up in eregister action. And what we need to do here
is send that email. So as I mentioned earlier, you can do different things in your
site, um, based on whether or not the user's email is verified or not. In our site,
we are going to completely prevent the user from logging in until the email is
verified. So I'm going to remove the user authenticator stuff and replace that with
the original redirect rock app on her horse for a homepage. And then up here, we can
remove a couple of arguments.

Cool. Now, when it's placed, we're going to generate that, uh, generate that conf uh,
email confirmation link, and then send it to the user to do that. We can auto wire a
new service in here called verify email, help or interface, not call it, verify email
helper. Now down here, after I saved the user, we're going to sort of generate that
link. It looks a little weird at first, we're going to say signature components = and
then say, verify email helper, arrow, generate signature. And the way you pass, this
is the name of the route. That's going to be the verify route. So for us going to be
app verified email. So I'll put that here, then the user's ID. So user error we'll
get ID and the user's email, user->get email. These are both used, um, as part of the
sign you were out, which is going to help us prove that this user did click this from
their email address. Now there's two different ways to use the verify email bundle.
It's kind of two different modes and they talk on their documentation. The first one
is where you recall when the user clicks this link, they're already logged in.

So down here inside of verified user email, you can actually use this arrogant user
to figure out who's trying to verify and then use that while you're validating the
assigned URL. The other way in which we're going to use is going to be, to allow the
user to not be logged in when they hit this endpoint to use it, that mode, we're
going to pass an array as the final argument here and pass the user ID to that. Now I
know this, what this line is basically doing is generating a big, fancy signed URL
and thinks of this last argument. There's going to be a little part of that. You were
at where we embed the user ID. That's going to be useful cause we use it to query for
the user down here.

Now this is the part where I would take this significant shared components thing, uh,
pass it into an email template, render the link and then send that email. But this is
not a story about sending emails. You have that tutorial. So I'm just going to take a
little short. I'm just going to go a little to do here and instead, I'm just going to
render this. Uh, I'm gonna say this arrow, add flash success with a little message
that says, confirm your email at, and then to get the actual URL from this signature
components, object, you can say arrow, get signed your out.

We haven't talked about flash messages yet. They're basically temporary messages that
you can put into the session that you'll then render once. So I put this into sort of
the success category and then over to run to that, I can go over to templates based
that age came on that twig and right after the navigation. So it's on top of the
page. We can loop over them. So we can say for flash in app that flashes and then
look up that key success. So that success Keith had been anything, but we're going to
look for it right here.

I'll make this look happy, alert, alert, success, and then we can render that flash
message. So last month, this has nothing to do with email confirmation. That's just a
feature of Symfony it's most commonly used when you're handling forms, but we're
going to use it here to render our confirmation. U R L phew. Okay, let's try it. I
refresh the page. Now I get a terrible error. A binding is configured for an argument
named form logging authenticator under_defaults, but no course dawning argument has
been found. So until a few minutes ago, we had an argument to our register action
that was called far form logging authenticator over in our config services. That,
yeah, we'll file. We set up a global bind that said when the arguments used to pass
this service, one of the cool things about bind is that if this argument doesn't
isn't used anywhere in your application, it actually throws an exception. It's kind
of trying to help you make sure you're not making a mistake or making a type of
anyways. Now that we're not using this anymore, we can delete it. And now our
registration Page finishes. All right. So let's go into, let's go through this
process.

Great. Some new user or agree to the terms and register beautiful. So you can say
here is our long URL and it's going to R /verify controller. It includes an
expiration. That's something you can configure, how long your, these links, uh,
include any signature. That kind of, sort of guarantees that the user couldn't just
make up the, see where all had to have come from their email. It also includes a
little at I, an ID = 18. That's our user ID. So our job now is to go into the
verified controller down here. And we're going to validate that that signed URL is
valid. Do that first thing we're gonna need is actually, we're gonna need a couple of
arguments here. First, we're going to need some things, request objects that we can
read, uh, the URL. We're also going to need the verify

Email helper, interface arguments, cause that's gonna help us validate the URL. And
the last thing we're gonna need is actually the user repository. So we can query for
the user so that we, that last step is actually the first one. So I'll say user =
user repository, Aero find, and then I'm going to see what users logged in by reading
that ID query parameter. So we can do that request arrow, query, arrow, get ID. And
for some reason we don't find that user in our system that shouldn't happen, but we
will throw this->create not fond exception. So that's just a 4 0 4 error

Next to validate that this signed URL hasn't been tampered with and is valid news, a
try-catch block. Instead of here, we're gonna say verify email helper, Carol
validate, email confirmation, and we're going to pass this a couple of things. The
first is going to be the sign you were else in the actual current URL. You can get
that with request arrow, get your eye. So what, the second thing we need to do passes
the user ID. So user error will get ID and then user->get email, actually make sure
that the user ID and user email haven't changed in the database since the
verification email was sent. Now, if this is successful, nothing will happen. If it
fails, it will throw a special exception called a verify email, exception interface.
So down here, now we know that, uh, validation, uh, failed somebody maybe messed with
the URL. It could be a bad character. So let's use that ad flash again, this time I'm
going to invent kind of a different category called error, and then to say went
wrong. We can say E arrow, get reason. Cause maybe the signature was invalid or maybe
the, um, the link has expired

[inaudible]

And then we will use redirect route and we'll send them back. How about to the
registration page? So he has some sort of an error with that and send them back to
really any page. It doesn't matter. And down here, I'm still going to say, just add,
add to two for the successful situation. Now, in order for these error message to be
rendered, I'm going to go back to base studies of twig. And we're just going to
duplicate this block here. Look for error messages, use alert, danger, and then print
those out as well. Phew.

All right. Let's try and be kind of air case. So let's pretend that we are sent this
email and click the whole thing. I'm going to open this in a new tab and if I don't
mess with it, it works. It hits our to do, which means that this was validated. If I
mess around with any part of this, I could just like delete a couple characters out
of the signature. It's going to fail the link to your verified email is invalid.
Please request a new link. So cool. So at the bottom of our controller, now that we
know that the validation link is true, we are done. So in our case, what we want to
do is say, user->KCET is verified true and store that in the database.

And then we'll save that. So I will add one more argument here and see manager
interface, entity manager, and then down here, we'll say, and city manager->flush. So
it saves that new user. And then we'll add a little success, a little success, flash
message account verified. You can now log in at the bottom. We'll redirect them to
app_login. Now, if you wanted, you could do one better here. You could in the same
way, you could actually manually authenticate the user in the same way that we were
manually authenticating to before inside of our registration controller. That's
totally doable. All right. So let's, let's go back over here and I will copy that
link again, paste and we are verified. Sweet me only missing feature is something
that prevents the user from logging in before they're verified to do that. Let's
learn about the events that happen inside of the security system and show off another
cool feature that leverages those events, login throttling.

