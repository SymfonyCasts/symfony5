# Authenticator & Security Upgrade

Coming soon...

All right time to fix these DEP applications. So we can upgrade two Symfony six. If
you go to any page in your site and Like we've already done a and then click the
deprecation down here, you'll see this big Le list. But a lot of these are the same
thing. It's talking about. Something about guard being deprecated, Probably the
biggest change going from Symfony 5.4 to Symfony six is a new security system, but
don't worry. It's not that much different from the old one. The upgrade path is easy.
So basically what we need to do is prepare our system for, So let's update our
security system to work with the new system. We're going to start this actually
inside of our user entity.

So in

Addition to user interface, add a second password authenticated user interface. So
what happened here is that previously user interface had a lot of different methods
on it, including get password. This didn't always make sense because some security
systems have users that don't have passwords. Like for example, if you log in via
some single sign on where a totally different application handles passwords, so to
make this cleaner in Symfony's six, you always have to implement user interface, but
this only has a few simple methods on it. Then if your applica, if your user has a
password that your application actually checks, then you implement password
authenticated, user interface as well. So it basically makes life E easier For
applications that have users that don't check the user's password. All right. Another
change

Relates to down here, if you look for get username. So get username is a method that
lives on user interface, but its name was always confusing. Cause it made it seem
like you needed to have a username when really what this method is supposed to return
is some unique user identifier. So because of that in Symfony six, this has been
renamed from get username to get user identifier. So I'm just going to copy that, get
user identifier and have the exact same thing. We do need to keep this username
method for now because we're still on Symfony 5.4. But once the upgrade is Symfony
six, we can safely remove this. All right? But the biggest change in Symfony
security, you can see in config packages, security.yamal it's. This enable
authenticator manager. When we upgraded the recipe gave us this config, but it had it
set to true. What this basically does is switch from the, the old security system to
the new security system. And what that means

In practice is that all of the ways that you authenticate like a custom authenticator
or form_login or HTB basic, all of these have been, been converted it from an old
authentication system to a new authenticator system. For the most part, if you're
using something like form login in here, you won't even notice you can change. You
can turn on the new system, you can set this to true. And even though the internals
of form_login are suddenly going to be very different. Everything is, is just going
to work exactly the same it was before. So in a lot of ways, the new security system
is an internal refactoring to make life a lot cleaner and simpler inside the court.
However, If you have a custom guard authenticator, like we have, we need to convert
this to the new authenticator system. So let's do that open up that class source
security login form authenticator, and you can already see the abstract form login
authenticator from the old system is deprecated. So change this to Login form a

No.

This changes from abstract form login authenticator to abstract login form
authenticator. It's almost the same name, but this is the new class that does the
same job was the old class, But it's not deprecated. And then we don't need to
implement this password authenticated interface. That's an old thing for guard. All
right. So you can immediately see that this is mad because I now need to implement a
new method called authenticate. So I'm going to go down below supports and go do code
generate or command and on the Mac and implement that new authenticate method. This
is the core of the new authenticator system. And we're going to talk about it in a
few minutes, But first The old authenticator system and the new a authenticator
system actually share a lot of the same methods. Like for example, they both have a
method in here called supports, but the new system has a bull return type. So as soon
as they add that, you can see PhpStorm is happy,

All

Turn type on that From HTB foundation. I'm also, while I'm hearing, I'm going to
rename this provider key To firewall name, I that's actually how it's named now that
doesn't make any difference, but it just makes it more clear. This is always the
firewall name. Then down here for on authentication failure, I'm going to add the
response return type there as well, and actually for on authentication success. I
just remember this can be a nullable response in some authentication systems. You
will not return a response, even though we are returning a response right here.
Finally, We do have a get log in URL, but in the new system, this has passed a
request argument And it returns a strength.

Awesome.

So now we still need to fill in some guts here, but at least we are implementing the
abstract functions correctly. All right, the next step we can do this is kind of cool
is we can delete the supports method, the reason, and you can see it. If you jump
into the base class, is that in the new system, the supports method is implemented
for you basically checks to make sure that this is a post request To, and that the
current URL = the login URL. So basically make sure that it says I support
authenticating this request if this is a post request to the login URL. So that was
actually exactly what we had before down here written a little bit differently, but
it's the same thing. So I'm going to delete the supports method. Okay. Finally, let's
get down to this authenticate method. So in the old guard system, we kind of split up
authentic authentication into a few methods. We had get credentials where we grab
some information. We had get user where we found the user object, and then we had
check credentials where we checked the password. All three of these things are now
combined into the authenticate method,

But with a couple of nice bonuses for, for example, as you'll see a second, it's no
longer going to be our responsibility check the password that will now happen
automatically. So anyways, Our job in authenticate is to return a passport. So go
ahead and add a passport return type. The reason that wasn't added for us is because
that was actually changed from Symfony 5.3 to 5.4 from passport interface to
passport, long story short, you should have a return type passport on there, and then
we'll return a new passport. If you're new to this system, you should check out our
Symfony five security tutorial, which talks all about this new system. So I'll kind
of go through the basics here Before I fill in this passport. I'm going to grab all
of the information from the request for the email password. And CSRF token Ms. Set
these all as variables. So I'll say email = Password equals. And actually I'll say
the CSF password token for later. So the first argument to the passport is going to
be a new user badge.

And what you pass here is the user identifier. So in our system, we're logging in via
the email. Now, if you want to, you can stop right there. If you just pass a single
argument to user badge, then Symfony is going to use your user provider from secure
to that yam to find that user, I have an entity provider here, which tells Symfony to
try to locate the user in the database via the email property. So it would in fact,
just find, be able to take this email and go find the user object. But in the old
system, I kind of did this all manually by querying the user repository for the
email. And sometimes you, if you have some custom logic, you will need to do it
manually. So I'm going to kind of show you the longer, more manual version up here.
And that is where you pass a function as a second argument, This is going to be past
the user identifier that you pass. So the email Inside here, your job is to take this
user identifier. So the email And return the user. So I'll say user = this->entity
manager,

Arrow get repository user class. I also could have injected the user repository
directly. That's probably a better idea. And then find one by Email And then user
identifier. And then down, we have to do, if not user, we actually need to throw a
new user, not found exception Because this callback needs to always return a user or
throw that exception. Perfect. All right. The second argument down here actually
don't need a semi, but a comma. Second argument is a new password credential And we
pass this. The password is submitted password and that's all we need to do here. So
this is a really cool thing where we don't actually need to check the password
ourselves. We just need to pass this password credentials thing, and there's going to
be another system. That's going to check the hashed password in the database
automatically. Finally, we can pass an array of extra badges. We want to pass. We
need just one badge. It's the new CSF RF CSRF token badge. This is because our login
form uses a CSRF token. You can see that we actually

Checked it manually before we don't need to do that anymore. We can just pass the
string authenticate as the first argument that matches the string that we're using in
our login template. So if we look in templates, security log, do H twig. I look for
CSR token. We just use whatever string we use here. When we generate it, that's the
same string we need to use here. And then we're going to pass it. The, the submitted
CRS CSRF token, which for us is going to request error, request->GI. And then the
name of the field is underscore. CSRF_token in. You can see that in the login form,
And that is all we need to do just by passing that token, that badge here, the CSRF
token is going to be validated. And the last thing I'll do here is I don't need to do
this, but I'm going to pass a new, remember me badge. If you use the remember me
system, then you and need to pass this, or remember me badge. It tells the system
that you opt into the remember me system. You'll still need to either have a remember
me Check box here.

Or if you want to always enable it, You can say enable. But if you do have remember
me stuff here in order to activate it, you need to also have, remember me under your
firewall, which I actually don't have right now. So if I wanted to remember me to
work, I would need to add, remember me under my firewall. All right. And we are done
if that was a lot back up and watch our Symfony security tutorial. So we can explain
all these things in a little more detail. But the cool thing is that We don't need
the GI credentials method anymore user method, or the check credentials method
anymore, or this get password method anymore. It's just as simple as authenticate On
authentication success on authentication failure and get log URL. We can even
celebrate up here by removing a whole bunch of old use statements. Yay. And if we
look at our construction here, a few of these arguments we don't need, we don't need
the CSR token manager or the user password Hasher interface, cause we're not checking
the CSF token or the, um, password, uh, manually anymore. And that gives us two more
use statements that we can delete.

Okay? So at this point, our one custom authenticator has been moved to the new
authenticator system, which means in security, that YAML, we are ready to switch to
the new system. So say enable authenticator, authenticator manager. True. And also
sort if custom authenticators aren't under a guard key anymore. They're now under a
custom Authenticator key And we'll put it right directly below that. All right,
moment of truth. We just completely switched security systems to the new system. So
let's head back the homepage and It works and check out those depre went down from
like 45 to four. Yikes. That's awesome. And if you look at them, one of 'em talking
about the child node in coders at path security is deprecated use password hatchers
instead, This is another change we saw when we upgraded the, uh, security bundle
recipe. Originally we had in coders here, this tells Symfony what password algorithm
to use to, uh, ask your users and the new, this has been reamed to password hatchers.
And instead of having our custom class here, you can just always use this config, or
it basically says any class that implements password authenticated user interface,
which will, which our user class will always implement, use the auto algorithm. So
use this new config. If you did have some different algorithm here, move that down to
this line, but ultimately delete the encoders. We don't need that anymore. It's
reading from password hatchers

And now on the homepage, We have even less D two. All right. Let's try to log in. Oh,
I'm checking my login for man. I think I missed some conflicts on my base layout
earlier. Just fix that real quick templates based that HML twig. Yep. I was sloppy.
This is early away from way earlier. When we upgraded the twig bundle recipe, I
hadn't even noticed. There we go. That's better. All right. We haven't. You are
called admin@example.com password TA da, sign in, and it works By the way. Speaking
about securities and firewalls, there is a new command you can use to debug your
firewall a little bit. It's called debug firewall. If you run a have no arguments, it
will tell you your two are your firewall names and we can rerun it with name. And it
just gives us some information about it tells us what authenticators we have for this
also, um, our user provider's using and also the entry point, which is something that
we talk about, uh, in our, in our security tutorial, Our team. Next, we are going to
crush these last few deprecations And learn how we can be sure that we didn't miss
any.
