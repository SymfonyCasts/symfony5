# Impersontation

Coming soon...

Have you ever had a situation where you're helping someone online and it would be so
much easier if you could see what they're seeing on their screen, or if you could
just temporarily take over and fix the problem yourself. Yeah. Just click the little
pay-per-click clip icon to attach the file. It should be like near the bottom. It's a
paperclip Symfony. Can't help teach your family how to attach files to an email, but
it can help your customer service people via a feature called impersonation. Very
simply. We can give some users the superpower to temporary when they log in as
someone else. Here's how first we need to enable the feature. So in `security.yaml`
under our firewall somewhere.

Add, `switch_user: true`. Yes. This activated a new way to authenticate. So now we
have our `CustomAuthenticator`. We have a `form_login`. We have remember me and we also
have `switch_user`. How does it work? We can now go to any URL and say, add 
`?_switch_user=` And then the email address of a
user we want to switch to. If I pop back over to our fixtures class 
`src/Fixtures/AppFixtures` and scroll down, we have one other user who's emailing out,
which is `abraca_user@example.com`. And I paste up here and access denied. Of
course not. Anyone can do this. Can switch users. You need a special role. That role
is called `ROLE_ALLOWED_TO_SWITCH`. So let's give it to our admin users. We can do this
via role hierarchy. So up here `ROLE_ADMIN` has `ROLE_COMMENT_ADMIN` `ROLE_USER_ADMIN`,
and now let's, let's give them a `ROLE_ALLOWED_TO_SWITCH`

And now, whoa, we switched to users. That's a different icon and most important they
be down here. We can say `abraca_user@example.com` and even see up here who the
original and uh, class is the way this works behind the scenes is that we enter the
email address in the URL and then Symfony leverages our user provider to load that.
Remember we have a user provider that knows how to load users from the database by
querying on their email property. So that's why we use email in the URL to exit and
go back to our original user. You can do `?_switch_user=`
 and then put a special `_exit` in. But before we do that, once
a customer service person has switched to another account, we want to make it, make
sure they don't forget that they switched. So let's make a very obvious indicator on
our page that we are currently switched so that we remember to exit. I'm going to
make this header background red to do that open the base layout `templates/base.html.twig`
And let's see all the way on top. Here we go here, body and nav.

I'm going to break this onto multiple lines. And the here, the way that we can check
to see if we are currently impersonating is we can say `is_granted()` and especially the
past special role called `ROLE_PREVIOUS_ADMIN`. So if we are currently say
impersonating someone, then we will have this role. So if we have this, I will say
`style="background-color: red"`, and I need an `!important` on there to override one of my
classes. Cool. And that's it. So refresh, yes, a very hard to ignore signal that we
are impersonating to help the user log out. Let's add one other link. So let's go
down here to our dropdown menu. And once again, I'll check if `is_granted('ROLE_PREVIOUS_ADMIN')`
And if, and we'll add one more link inside of here and what we can do
here is we can generate just like a link to the homepage. But when I do that, I'll
pass an extra `_switch_user=_exit`. So this second argument to path
is not only how we fill in route wildcards, you pass anything that is not found in
the route wild card. It will be added as a query parameter. So this shouldn't give us
exactly what we want. Then down here, I'll say exit impersonation.

All right, try that refresh. It's very obvious. We are impersonating an ex
impersonation and we are back as abraca admin. At example, that calm, sweet, by the
way, if you need more control over which users someone is allowed to switch to, you
can listen to a `SwitchUserEvent` to prevent switching, throw in `AuthenticationException`
 more on listeners later. Next, let's talk a little bit, bit about API
authentication. And when you do add, do not need a fancy API token authentication
system.

