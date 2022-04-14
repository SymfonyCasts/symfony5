# Hunting Down the Final Deprecations

Coming soon...

All right team. Let's fix these last few. Deprecations Now one tricky thing about
deprecations is that sometimes they come from third party bundles. I don't have any
examples here, but sometimes you'll get deprecations and if you kind of look into it,
you'll realize they're not your fault. They're coming from a library or bundle you're
using. So in that case, what you're going to get to do is go and upgrade that bundle.
Hopefully they have a new version that doesn't have any depre. We actually did have
some examples of that way, the beginning of the tutorial, but we've already run
composer, update a few count a few times, and we've upgraded all of our dependencies
to versions that don't have any depre. Yay. All right. So right down here, we're just
going to go down. We're just going to look at this list. It says that in Symfony 5.1
roll previous admin deprecated and we should use is impersonator instead. And you can
kind of show the context on this Or the trace on this to try to get some more, more
items from, it's not always obvious where it comes from, but you can actually, this
is coming from our base.H team that twig.

So let's go check that out. Templates base.H twig. And I'm a search for previous
admin. So previously this was how you could check to see if you were currently
impersonating a user and we use it to change the background to red. So it was really
obvious. Very simply we changed this to is Impersonator. So it's just that simple.
I'll copy that. There's one other spot on this page where I have that same thing is
impersonator Done. One less deprecation while we're talking about this, go to config
packages, secure to that YAML and head down to access control. So I have a couple
pages here /logout and /admin /login that I wanted to absolutely make sure our
access, everyone, even if you're not logged in the way you do that is you put these
rules on top and you use is authenticated anonymously. So if I go to /logout, this
access control only this access control is matched and role is authenticated
anonymously always returns true. And so it allows access in symp six. This is
authenticated and anonymously Has changed to public access. So I'm going to use that
in bold spots.

Now, if you're wondering why we didn't have a deprecation about that, this is a rare
case where Symfony was unable to kind of catch that deprecated path and show it to
you. This is, uh, this doesn't happen very often, but this is something where a tool
like Symfony insight can catch the, even when Symfony itself. Can't

All right. So the last depre I have on list list is something about Seth interface.
Uh, alias is deprecated use request, error stack->gets session. Instead it is being
referenced by the login form authenticator service. So let's go check that out.
Source security login form authenticator. If you look in the error I'm auto wiring,
the session service. So basically in Symfony six, the session service doesn't exist
anymore. There are some technical reasons for this, but the long and short of it are
that the session is not really a true service. It's a little bit more like a, And so
what you're supposed to do is get it from the request instead, This really isn't a
big, that big of deal so we can remove the session interface, uh, constructive
argument. Uh, I actually don't need this youse statement anymore. And then if I
search for a session, you can see I was using it down here in, on authentication
success. Fortunately, this already passes us to request object. So we can just say
request-> get session. So you now get the session object off of the request. All
right. So if we head back to the homepage now,

No deprecations and we can kind of surf around our site a little bit, And I'm not
seeing any deprecations on any of these pages.

Yeah.

So, So are we done well, we've manually tested all the pages that were with get
requests, but what about post requests like submitting the login form or submitting
the registration form Or about API N points? We have one called /API /me, which
doesn't work, cuz I'm not logged in Log back in as a avenue example.com/ti and then
/API /me works cool, but we can't see the web Depot tool R for this, but you probably
know the trick we can go to slash_profiler And it'll show us the last 10 requests and
we can find a post request. For example, here's the post request with the /login. And
we go down to logs that had no depre. If I go back, I can also check our API N point
can go down to logs and it had no depre. So yay. Another option instead of just
checking the profiler all the time is to go over your terminal and we can tail the
log file. So I'm going to tail-F bar log a. This is something that just is constantly
streaming logs, but I'm going to head control C cause I'm actually going to grip that
for

Deprecation. And now it's going to sit here and if any logs come through that have we
will see them. So for example, let's go register for a new user. So I'll log out.
I'll sign up, Gives me email agree the terms, oh, I have two good of password, uh,
validation there, Sign up and beautiful. That works awesome. But if we scroll over,
it says since Symfony 5.4, the abstract controller get doctrine method is deprecated
Inject an instance of manager registry into your controller. Instead, It's not
exactly easy to see it from here where this is coming from in my code, but I did just
re register. So I'm going to go check out registration controller. What is
complaining about is right here, this aggregate doctrine is deprecated Instead just
inject the entity manager. So I'll go to the end of my argument list here. We'll OT
wire, one more argument, entity manager, interface, entity manager, beautiful. And
down here, I could just delete that line cuz entityManager is now being injected and
that is another deprecation gone. So are we done? Probably Our project is pretty
small. So checking out the pages manually is not that big of a deal, but for bigger
projects, it might be more difficult. And you know, you just really want to be sure
that you didn't miss anything before you upgrade.

Fortunately, If you search for new and symp fiber 0.3, logging improvements, you'll
find a blog post here that talks about log depre into a separate file. Oh wait, no, I
don't want to talk about that. So one really great option for this on production is
actually to log your depre. So open config packages, monolog that YAML and go down to
when at prod. So you can see this is a number of handlers here. So by default, it's
going to basically log all errors to standard error. But down here it has this
deprecation thing. This says it's going to deprecate any, um, deprecation log
messages. That's what this channel's deprecation means. Two PHP standard error. So if
you are to have a production system set up To, um, capture logs that go to PHP
standard air, what you can do is deploy your site, let it run for a day or a week and
then check this for any deprecation log messages. Or if you want to use a file
instead, you can just change this path to a deprecation file. So let me like present
kernel.Log /deprecation.log, something like that. I'll change that back. So that's my
favorite thing to do, deploy it. And then you get a see for real whether or not you
still have deprecations from up on production. All right. But at this point I'm
seeing clear depre things on our web by two of our, I think we have removed all the
depre woo. And that means we are ready for Symfony six. Let's upgrade next.
