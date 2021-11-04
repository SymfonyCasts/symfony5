# Deny Access Controller

Coming soon...

I like using access control in `security.yaml` to help me protect entire sections of my
site. Like everything under `/admin` requires some role, but most of the time I protect
my site on a controller by controller basis, open `QuestionController` and find the
`new()` action. This obviously is not a real page. It's a good old fashioned to do one of
the developers. Favorite ways to implement a feature. Let's pretend that this page
does work. Anyone on our site is going to be allowed to ask new questions, but you do
need to be logged in before you do that, too. And to enforce that in the controller
on the first line, let's `$this->denyAccessUnlessGranted('ROLE_USER')`. So if the user
does not have `ROLE_USER`, which is only possible, if you're not logged in deny access,
yes, then I access in a controller is just that easy let's log out and go to that
page `/questions/new` beautiful, because we're anonymous. It redirected to `/login`. Now
let's log in "abraca_admin@example.com" password "tada" and access. Granted,
if we change this to roll_admin, which is not a role that we have, we get access
tonight.

Notice the cool thing about this deny acts in the scrap, the method we're not
returning the value. We can just call `$this->denyAccessUnlessGranted()` and that
interrupts the controller. Meaning the code down here has never executed if this
fails, that happens because internally in order to deny access and Symfony, all you
need to do is throw a special access, denied exception. So this line is actually
throwing that exception. We can actually rewrite this one line in a longer way, just
to be a little bit, to be a bit more descriptive. That one line is identical. The
saying, if not `$this->isGranted()`. So there's another helper method on the base
class called `isGranted()` `ROLE_ADMIN` instead of return, during exception that just
returns true or false. And then we can throw the exception by saying, throw 
`$this->createAccessDeniedException()`, and I'll say

> No access for you!

Okay.

That does the same thing as before. And this message you pass to the exception is
only going to be seen by developers I'll hold command or control to kind of jump into
this control to this method. You can see that there's an `AbstractController` and
there's nothing special here. It just throws `AccessDeniedException`. So you could
really throw this exact exception anytime you want, in order to stop execution and
deny access. I close that and refresh. We get the same thing as before. There's one
other interesting way to deny access in a controller. And it works. If you have 
`sensio/framework-extra-bundle` installed, which we do instead of writing your security
rules in PHP, you can write them as PHP, annotations, or attributes. Check it out
above our controller. I'm going to say,  `@IsGranted("ROLE_ADMIN")`. I'll hit tab to auto,
complete that, to add the use statement, and then inside double quotes, I'll pass
this `ROLE_ADMIN`. If we try that access denied the developers, see a slightly
different error message, but the end user would just see a 4 0 3 page. As I
mentioned, if you're using a PHP eight, then you could use a PHP attribute here.

No, I'm not gonna do that. Then you can use this as a PHP attribute instead of an
annotation. One of the coolest things about the is granted annotation or attribute is
that you can also use it upon the controller class. So above question controller, I
can say `@IsGranted("ROLE_ADMIN")` And then suddenly

Rural admin would be required for, to execute every controller on this page. I will
do that because well, that only admins give you the homepage, but that is a really
useful feature. All right, back down at our new let's change this back to `ROLE_USER`,
just to this page, kind of works again. Next let's start adding right now. Every user
has just roll user. Let's start adding extra roles to some users in the database to
differentiate. We differentiate between normal users and admins will also learn how
to check authorization rules in twig so that we can conditionally render links up on
our page, like log in or log out in the right situation.

