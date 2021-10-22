# Custom User Query & Credentials

Coming soon...

Here's how this works.
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
