# Passport

Coming soon...

On a basic level offending getting a user when we submit the log and form is pretty
simple. We're going to read the submitted email, query the database for that user,
and eventually check the user's password. The weird thing about Symfony security
system is that we're not going to write this logic in the controller. Nope. When we
post to `/login`, our authenticator is going to intercept that request and do all the
work itself. This means that when we post it to `/login`, our controller will actually
never be executed. Now that our authenticators activated at the start of each
request, Symfony is calling the `supports()` method on our class. Our job is to return
`true`. If this request contains authentication info that we know how to process. In
other words, if this is a request that we should try to authenticate, if not, and if
it's not, we should return `false`.

If we return `false`, we don't fail authentication. It just means that our authentic
here doesn't know how to authenticate this request and our situation. All right. So
let's think when does our authenticator, when is our authenticator going to work?
It's magic. If you think about it, our authenticators should be called whenever the
current request is a post request to `/login`. That means someone just submitted the
long form. So literally inside of here, we'll say return `$request->getPathInfo()`
This is a fancy phone is the method that returns the URL of the current page.
So if the path info `= '/login'`, and if `$request->isMethod('POST')` then we want to return
`true` to see what happens next down in `authenticate()` let's `dd('authenticate')`

Okay. So if re supports returns false, no other methods on our authenticator are
called and the request continues like normal. We can see this go refresh the
homepage. Yup. These `supports()` method return `false`. And the page kept loading in the
web debug toolbar. There's a new security icon where it says authenticated. No, but
now go to the log and form and fill and submit it. I'm going to use [inaudible]
`abraca_admin@example.com`, that come that's the real user that we have in our database. And
then we'll use any password and submit. And yes, it hit our `dd('authenticate')`. If
supports returns true Symfony, then calls authenticate. Our job here is to well
authenticate. The user more specifically, the job of authenticate is to communicate
two important things. First, who we are specifically, which user object we are. And
second, some proof of who we are in the case of a login form. That would be by
validating the user's password. Of course our users don't actually have a password
yet. So we'll fake it.

We communicate these two things by returning a passport object return, new `Passport()`
passport object. The passport is a simple object that holds things called badges,
where a badge is just a little piece of information that goes in your passport. The
two most important badges are a User Badge and some sort of credentials batch that
helps us prove where that user let's start by grabbing our sip, the posted email and
password. So I'll say `$email = $request->request->get('email')`. So 
`$request->request` is how you read it. `POST` data and Symfony. And very simply in my
template, the name of the field is `email`. So I'm reading the `email` field right here.
So nothing fancy. I'm also going to paste that copy and paste that to create a
`$password` variable that reads the `password` field from our form.

Now, instead of the passport, the first argument is always the user badge. So we'll
say new `UserBadge`. And then we just pass that our user identifier for us. That's
going to be the `$email`. We'll talk. I'm going to talk more about this in a second and
what it does, but this is just some, this is the main identifier for your user, which
could, you could use to help find your `User` object, or you can do something custom.
You'll see that in a second for the second argument, we need to pass some sort of
credentials. Eventually we're going to pass it and call it a `PasswordCredentials`.
But since we don't, I usually don't have passwords yet. Let's pass them and call it a
`CustomCredentials()` and pass this a callback with a `$credentials` arguments, and then a
`$user` argument type into with our `User` class Inside of here. I'm just going to do
`dd($credentials, $user)`  so we can see what those are. And then the second argument of
credentials is actually what our credentials are. So for us, that's a `$password`. If
the `CustomCredentials` thing is a little fuzzy for you, don't worry.

This will all be easier when we see it in action, but on a high level, it sort of
makes sense. We're passing this password object and it contains two things on it, who
we are identified by the email and some sort of a credential process where we're
going to prove whether or not we're that we're that user. And a second, I'm gonna add
some logic in here that, uh, checks to make sure that our password is the word TETA.
All right. So with just this, let's go back to the log and form. And I am going to
submit, remember I'm submitting with a, using an email address that actually exists
in the database. And when I do awesome,

It had RDD FUBAR is what I entered for my password. And you can see for the users
actually dumping that user entity from the database. So hold on a second, whoa.
Somehow it knew to query for the `User` object using that email. Here's how this works.
After we returned the passport object, the security system first tries to find the
`User` object from the `UserBadge`. If you just pass one argument to user badge, it does
this by leveraging your user provider. Okay. Remember that thing in security that
Jamo up here called providers. So we have a user provider, that's an entity user
provider and has property `email`. So basically this is an object that's really good at
queering, the user table using the `email` property. So behind the scenes, when we
return just this string here, it looks up a user using the `email` property, thanks to
our user provider.

That's not the only way to load the user as you'll see in a second. But that's the
easiest way. If Symfony, if this process is able to load the user, then it checks our
credentials for us. That means it executes this callback where we're just dumping
some data more on that in a moment. What happens if this process fails to find that
user, like we have an email that doesn't exist in the database. We'll talk about that
in a few minutes too. Anyways, the point is just passing the user identifier for us,
the email and allowing our user provider to query for that user is the easiest way to
do this. But you can always do your own query logic. Let's pretend that we need some
custom query or in addition to email and password, there's actually an email and a
company ID that we use in the query.

If you need to do a custom query, you can absolutely do that right here. So the top
of the class, I'm going to add public function `__construct()`, and I'm going
to inject my `UserRepository` dervice I'll then it all to enter and go to initialize
properties to create that property and set it down below the `UserBadge` has an
optional second argument called a user loader. It's a callable so we can pass it a
function. First argument, I'll call `$userIdentifier`. So if you pass a callable here,
then when Symfony loads your user, it will call this function instead of your user
provider. So our job in here is to query for the user. The user identifier here is
just going to be our email. So what we pass it, the first diagram here is just passed
over to our callback. So that makes our job pretty simple.

So when we say `$user = $this->userRepository->findOneBy()`, and I'll say
`email` set to `$userIdentifier`. This is where you could use whatever custom query you
want to fetch that user. Now, if you do a call back like this and you can't find the
user need to actually throw a special exception. So if not `$user`
`throw new UserNotFoundException()` that will cause authentication to fail
with a authentication to fail. And then at the bottom just return `$user`. This is
basically identical to what our user provider is doing a second ago. So it shouldn't
make any difference in our application, but you can see how you have the power to who
your, for the user, however you want to.

So over here, when I refresh, we had the exact same results as before. So anyways, if
a user object is found, simply then checks our credentials for customer credentials.
It executes this callback. Our job is to check their credentials. So like check the
password and return true if they're valid and false, if they're not. So let's pretend
that all users have the same password, Ted. In other words, we can say return
`$credentials`, which will match the password argument. I should mention that `=== 'tada'`
If we return driven from this process, authentication is successful. If we
return false authentication fails to see this go down to authentication success, and
let's say `dd('success')`, and then do the same thing on authentication failure. We're
gonna talk more about these methods in a second, but they're kind of obvious, right?
If I'm litigation successful, this method will be called. If we fail, this method
will be called. Alright, let's try it. I'm going to go directly back to /log into
low. The login form use abraca admin, at example.com. Let's say real user having the
database and then our password to that when we submit yes, success authentication
complete. Even if it doesn't look like much yet. So next let's do something on
success. Like redirect to another page. We're also going to learn about the other
critical job of a user provider, refreshing the users from the session at the
beginning of each request.

