# Access Control

Coming soon...

We've talked a lot about authentication, the process of logging in things that work.
We now can log in. In fact, I'm already logged in. Whoo. So let's get our first dose
of authorization. That's where you deny access to different parts of our site. The
easiest way to deny access is actually right inside of `config/packages/security.yaml`
it's via `access_control:` Took it out on uncomment. This first access
control right here,

The path is a regular expression. So this basically says if URL, starts with
`/admin`, so `/admin` or `/admin*`, then only allow access at the user has ROLE_ADMIN.
We'll talk more about roles in a second, but our user does not have that role. So
let's try to go to a URL. Let's try to go to a URL that matches this path. We
actually do have a small admin section on our site, which we can get to by going to
`/admin`. So let's try it, make sure you're logged in, logged in and go to `/admin` and
access denied. We get kicked out with a 403 error

On production. You can customize what the 403 error page looks like in addition to
customizing what the 404 error page it looks like. All right. So let's talk about
this roll stuff here. So very simply open up your `User` class `src/Entity/User.php`
Here's how this works. The moment that we log in Symfony calls this `getRoles()`,
method. This is part of `UserInterface`. We return an array of whatever roles this
user should have. The `make:user` command generated this in such a way that we always
have at least one role called `ROLE_USER`

So, as a reminder, this `$roles` property is an array property that stores as JSON in
the database. So the database, you can give your users as many roles as you want so
far when we've created our, we haven't given them any rules yet. So our world's
property is empty, but thanks to how they get roles. Method is written. Our user will
at least have role on our store user. It's done this way because all users need to
have at least one role. So by convention, we always give them at least ROLE_USER. The
only rule about these roles strings that they must start with `ROLE_`. And
later in this tutorial, we'll understand why. Anyways, the moment we log in simply
calls `getRoles()`. We return the array of roles and it stores those. We can actually
see this down on the web debug toolbar. If we click on the icon there, we can see
roles, `ROLE_USER`. So then when we go to `/admin`, this matches our first access control
here. It checks to see if we have `ROLE_ADMIN`, we don't, and it denies access. Now,
one key thing about the way access control works. And we'll see this a little bit.
We'll talk more about this later is that only one rule ever matches. So if you ever
had a, uh, two entries like this, if I went to /admin, that would match the first
rule and only use the first rule. So it's a bit like routing where it only matches
one at a time for now. That's just something to be aware of.

And that's it. Access controls are give us a really easy way to secure entire
sections of our site, but it's just one way to that to deny access. We'll soon. Talk
about how you can deny access on a controller by controller basis. But before we do,
I know that if I go, I try to access to this page without the role I get the 4 0 3
forbidden. But what if I try to access to this page as an anonymous user go to /log
out? Cool. We're now not logged in and go back to /admin. Whoa, an error full
authentication is required to access this resource. Next, let's talk about the entry
point of your firewall, the way that you help anonymous users log in.

