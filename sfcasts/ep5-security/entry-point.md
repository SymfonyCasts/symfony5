# Entry Point

Coming soon...

Let's see what just happened again. First let's actually log back in 
abraca_admin@example.com password to that. When we go to `/admin`, like we saw earlier, we get
access tonight. This is, this is because of the access control and the fact that our
user does not have a `ROLE_ADMIN`,

But if we change this to `ROLE_USER`, a role that we do have then access, granted,
those are very impressive stats, but now I'm going to log out. So go manually 
`/logout` and go back to `/admin` question is what should happen when an a, so when I go to
/admin, I should not have access to that page. And that's true. I don't have access
and I get a 401 status code. So on production, the user would see a 401 error
page, but wait, let's think that is not what we want. The event anonymous user tries
to access a protected page on our site instead of an error, we want to invite them to
log in. In other words, we want to redirect them to the login page. That's how every
site on the planet works. Okay.

In order to figure out what to do when an anonymous user accesses a protected page
like this, each firewall defined something called an entry point. An entry point is
literally a function that says here's what we should do with the user. When an
anonymous user access as a protected page, every authenticator under our firewall may
or may not provide an entry point. Right now, we have two authenticators. We have our
custom log in form of care. And also the remember me authenticator and neither of
those provide an entry point, which is why instead of redirecting the user to a page
or doing something different, we just get a 401, error, there are some built in
authenticators like `form_login`, which we'll talk about soon that do provide an
authenticator and we'll see that. But anyways, none of ours provides an entry point.

So let's add one, open up your `LoginFormAuthenticator` `src/Security/LoginFormAuthenticator`
If you want your authenticator to provide an entry point, you need to
implement a new interface. So say implements, `AuthenticationEntryPointInterface`.
This requires you to have one new method, which we actually already have down here.
It's called `start()` on, come at the `start()` method inside. Very simply. We're going to
redirect the log-in page. I'll steal the code pop here. Exactly. And that's it. And
as soon as we implement that interface, the security system is going to see that. And
if an anonymous user tries to access a protected page, it's going to call our start
method and we're going to redirect to the log in page, watch refresh, boom. It knocks
us over to the log-in page, but there's one important thing to understand about entry
points. F every firewall can have only one entry point. Think about it at the moment
we go to `/admin` as an anonymous user. We're not trying to log in via, uh, we're not
trying to log in via a login form or an API token or anything else. We are anonymous.
And so the firewall

Needs to know what one thing it should do for the user Right now, since only one of
our two authenticators is providing an entry point. It knows to use this one, but if
we had, what, if that were not the case, we would get an air here. Let me show you.
Let's generate a second custom authenticator 

```terminal
symfony console make:auth
```

We'll generate
an empty authenticator, and I'm going to call it just `DummyAuthenticator`.

Beautiful. As you can see, is it generated in a new class called `DummyAuthenticator`
and it actually updated a `custom_authenticator:` to now accept an array of
authenticators. Now, both of our custom authenticators are active to start inside
`supports()`. I'm just going to return false without authenticators, not ever actually
going to do anything. Now, if we stopped right here and I tried to go to /admin, it
would still hit our entry, our one entry point and redirect a log in page. But now
let's implement `AuthenticationEntryPointInterface` Then go down here on common,
out the start method. And for the body, I'm just going to do a `dd()`. Tell me
DummyAuthenticators::start. This won't actually be executed. So at this point, the
security system is going to notice that we have two authenticators that each have an
entry point. And so when we refresh any page, we get a gigantic air because you have
multiple authenticators in firewall main. You need to set the `entry_point:` key to one
of your authenticators. And it tells me that the two authenticators that have 
`entry_points:`. So in other words, it's making us choose. So I'm going to copy this entry
point key here, and then anywhere under our firewall, I'll say, enter your blank
colon. And then I'll point that to my authentic air. Technically I can point this to
any class that implements authentication entry point interface. But usually I put
those, I put that inside of my authenticator.

Now let me go back to `/admin`. It works fine. It knows to choose the entry point from
our `LoginFormAuthenticator`. Next speaking of our log in form authenticator, we've
been doing too much work inside of here. Let's leverage a special base class from
Symfony that will let us delete a bunch of coat. We're also going to learn about
something called the target path trait, a way to intelligently redirect the user on
success.

