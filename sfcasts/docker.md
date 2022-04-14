# Enhanced Docker Integration

Coming soon...

Symfony has had support for Docker for a while in particular, to help with local web
development. For example, I have PHP installed locally. I'm not using Docker for
that, but my project has a Docker composed Yamo file that defines a database service.
The Symfony binary. Remember that we are running A local web server that we're using.
It comes from the Sy binary And it's smart. It automatically detects That I have
Docker composed running with a database service. It reads the connection parameters
to this container and exposes them as a database URL environment. Variable. I can
show you on any page, click into the web. <inaudible> two of our on request response,
go to server parameters and scroll down to find database_URL set to in my case to 1
27, 0 0 1 on port 56, 2 39, the way that my doctor composes set up, it's going to
create a new random port every time. And the Symfony binary will figure out what
random port it is and create this environment. Then just like normal. Thanks to our
config packages doctrine YMO configuration. The database URL environment. Variable is
used to talk to the database. So the Symfony binary plus Docker is a nice way to
quickly and easily boot up X journal services like a database elastic search or more

Recently Symfony took this to the next level. You find a blog post called introducing
Docker support. And the idea is pretty simple. When you install a new package, for
example, doctrine, If that package That packages recipe may ship with some Docker
Configuration. And so just by installing the package, you can get that doc
configuration automatically. Let's see this in action. Since we already have doctrine
installed, Let's install mailer, which comes with the Docker composed for something
called mail catcher, Right? Website, your terminal, a composer require mailer And
awesome it and says, this may create a Docker and composed that Yama or update Docker
file. Do you want to include Docker configuration from recipes? I'm going to say P
for yes. Permanently. So if you don't want the Docker stuff, you going to say no or
no permanently, and it's never going to ask you again And done going to run, get
status and you say update the normal stuff, but it also has a new Docker composed
override.YAML. So I now have a Docker composed YAML file. I had this before, and that
recipe gave me a new Docker composed.override.YAML file it if you're not too familiar
with the difference between these files, DACA reads both of these, but DACA composed
override.yamal is kind of meant for, um, is meant for service overrides that are
specific to your environment. So in our case, this,

I need to, you explain this better mail. Catcher is a tool for local development.
When you run it, it spins up an SMTP server that you can send emails to. And that has
a nice little web gooey where you can review those emails. So this is inside of a
Docker compos, oh, override that yamal because we only want this service to be
running locally when we are doing local development. So in case you were using Docker
to actually send your site to production, you would have different, um, configuration
for production Anyways. But before we even start using this service, let's set up a
few things in our app to send emails

First head over to src/Controller, registration controller. We're going to send a
proper verification email after we send, after we register right now, um, we're using
the Symfony cast verify email bundle, but instead of actually sending an email, we're
just putting the URL directly in a flash message. It was a shortcut we made during
the security tutorial, but now I'm going to go to the bottom of this and paste some
code, which you can get on this page. Then I'll retype the E on mailer interface and
hit tab to add that use statement and the L on email and hit tab. This is the one
from Symfony component mine to add that use statement. Perfect. So this will send A
very simple verification email link that just contains a link to verify our email
Back all the way up on the register method. Add a new argument at the, at the end
mail or interface Mailer. Perfect. And then down here inside of success, I'll get rid
of this to do, And we'll say this->send verification email. We're going to pass this
at the mailer, the user, and also the signed URL that they need to click. And then
for the success, we can just change this message a little bit

To say that they should check their email. Okay. So again, we got this new Docker
composed file with a mail catcher. We have not actually restarted Docker composed to
get this running. So we're going to ignore this for a second and see if we can get
emails sending. So if you click back to the register page, oops,

We get an air environment, variable not found mailer_DSN. So now that we're finally
using the mailer for the first time, the mailer service needs mailer DSN to tell
where to send emails, this environment variable, you can find in.N when we install
mailer, it gives us this, it just comments it out in case for some reason, we never
actually need mailer. So let's uncommon that, and you can see by default, it sends to
what's called the null transport, which means that we can send emails, but they will
go absolutely nowhere, which is actually kind of a nice setting for development.
Watch I'll show you want to refresh the page. It, it works now Put a fake email
address register, and it worked, of course, the email didn't send anywhere, but we
can still see more or less what the email look like. Click any link to go into the
profiler and click last 10, find the post request for registered click in that. And
down here, we can click emails and we can see what our email look like, including an
HTL preview. I know it's pretty ugly because I didn't actually do any work on it,

But this is a great way to debug your emails. It's not perfect. This is a new feature
from Symfony 5.4, But there's a new, another kind of cool way to debugger emails and
that is using mail catcher. So let's spin over and restart Docker compose. If you
don't already have a Docker composed at Yama file, go ahead and make one. All you
need to do is have a version on top and that's it that we have a Docker was that Yama
file and a Docker composed override. So I'm going to go over here and run Docker,
compose a-D. I already have Docker composed running for my database container, And
that will now start my mail container. So that just started a mail catcher when which
exposed a new SMTP port, we can send emails to, and also a new web gooey that we can
check out. So here's the trick. How, How do we configure mailer to point to mail
catcher? Like what port is it running on? And the answer is we don't know, and we
don't care. Check this out, Click back to any page refresh and then click back to the
profiler, go to request response server parameters and scroll down and look for
mailer URL. Check this out. The mail or URL is suddenly set to SMTP://1 27 0 0 1,:6 5
3 2 0. So what happened is

When we started the Mail catcher service Internally, it expose the 10 25 port of the
container, which is the S and T P messages to a random port on my host. The Symfony
binary saw that read what the random port was and just like what the database
exposed, a mail UR URL environment, variable that points to it. In other words, our
emails are automatic already going to send to mail catcher, Watch let's try it. Let's
sign up again. Some other email address, Agree to the terms and cool. No error. So it
seems like that worked. And we could go back into the profiler like we did a second
ago and review that

Message there. But in theory, if that sent to mail catcher, we should be able to go
to the mail catcher UI and review the message there. The question is, where's the
mail catcher UI. Like what port is that running on? Because that's also running on
another random port. So to help this down on this little server thing on the web
Depot toolbar, you can see some information. You can see that it detects Docker
composed running. It's exposing some environment variables from Docker and it even
detected web mail. And we can click open to head into mail catcher, and there is our
email. So you can see it here, the HDL plane text. If you send more messages, this do
this. They're just going to show up here like a nice little inbox. So a great tool
for, um, helping debug emails locally. And that's it congrats. You've just upgraded
her app two Symfony six

<affirmative>

And PHP eight and PHP attributes instead of annotations cool stuff. There are a lot
more features that we don't have time to cover, but if you have any questions or hit
any problems during your upgrade that we didn't talk about, we're here for you down
in the comments. All right, friends. See you next time.
