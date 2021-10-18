# Install

Coming soon...

Welcome back friends. I'm so pleased that you've stumbled into my Symfony five
security tutorial for a bunch of reasons. And this course we're going to be talking
about Symfony's new security system called the authenticator system. Ooh. If you've
used the old system, you'll feel right at home. If you're new to Symfony security, it
shows a great time to start. The new system is easier to learn and understand, but
it's also more powerful. We've got a lot of shiny things to explore. So let's dive
right in To learn how to authenticate and authorize at a pro level. Download the
course code from this page and code along with me making real world mistakes. Yeah,
it's the best way to remember this stuff. After unzipping the file, you'll find a
start directory with the same code that you see here. Pop open this, that MD file for
all of the setup instructions. The last step will be to find a terminal, move into
the project and start a web server. I'm going to use these Symfony binary for this
Symfony serv dash D. That starts up a new server@onetoseven.zero to zero.one, colon
8,000. Go open that in your browser or be lazy and run Symfony open local to make
somebody else do it and say hello to

Okay.

Say hello to cauldron overflow. A question answer site for witches and wizards, who
unfortunately tend to cast their spells on production first. And then come ask
questions here later about ha how to undo the damage because Symfony starts small and
you install components when, and if you need them. All right, actually it doesn't
have any security system right now. That's no fun. So let's install one, go back to
your terminal and run. Composer requires security. This is all Symfony's security
bundle. And after it finishes all run, I'll clear the screen and run get status. In
addition to the normal stuff, it added one its recipe added one new configuration
file config packages, security that GMO let's go check that out. I think packages
security.yaml, as you can probably guess by the name. This file is the heart of the
security system. And by the time we're done, each part should seem simple and boring.

Oh, but see this enable authenticator manager lock key on top in Symfony five, the
old and new security systems that live side by side, and you get to choose which one
you want when you set, enable authenticator manager to true that actually activates
the new system. Yay. Shiny. If you're working on a legacy project and want to learn
the old system, check out our Symfony for security tutorial. It's pretty cool too. I
guess anyways, when you talk about security, there are two big parts authentication
and authorization authentication asks the question, who are you? And can you prove it
users and things like logging forms where you say who you are and prove it with a
password or all parts of authentication, authorization asks a different question.
Should you have access to this resource authorization? Doesn't care much about who
you are. It's all about allowing or denying access to different things like different
URLs or controllers in Symfony or really any security system authentication is the
hard part. And it can say, and it's in part because it can take so many forms like
logging form, API authentication, uh, [inaudible] social authentication, you name it,
but it's also a super fun topic. So next let's start our journey into the new shiny,
authentic Gator security system by creating the most basic part of authentication a
user class.

