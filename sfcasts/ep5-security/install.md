# composer require security

Welcome back friends! I'm *so* pleased that you've stumbled into my Symfony 5
security tutorial for a bunch of reasons. The first is that well... uh... the
site that we've been building has NO security... and the velociraptors are starting
to jiggle the door handles.

The *other* reason is that, after having NO issues going to the other side of the
compound to a maintenance shed, we're going to explore Symfony's new security system,
called the "authenticator" system. Ooh. If you've used the old system, you'll feel
right at home. If you're new to Symfony security, slow cap! You chose a great time
to start. The new system is easier to learn and understand... but it's also more
powerful.

## Project Setup

Since the security system isn't going to come online by itself, let's dive right in.
To learn how to authenticate & authorize & do other cool security stuff at a *pro*
level, you should definitely download the course code from this page and code along
with me. Making real-world mistakes.... yeah, it's the best way to remember this
stuff.

After unzipping the file, you'll find a `start/` directory with the same code that
you see here. Pop open the `README.md` file for all of the setup instructions. The
last step will be to find a terminal, move into the project and start a web server.
I'm going to use the `symfony` binary for this:

```terminal
symfony serve -d
```

This starts up a new server at `127.0.0.1:8000`. Open that in your browser... or
be lazy and run:

```terminal
symfony open:local
```

to... "delegate" the work to someone else. Say hello to Cauldron Overflow! A question
and answer site for witches and wizards, who... unfortunately... keep casting their
spells live on production *first* without testing them... and usually on a Friday
afternoon. Sheesh. Then they come here to ask how to undo the damage.

## Installing Security

Because Symfony's philosophy is to start small and then allow you to install the
stuff you need later, right now our app... literally does *not* have a security
system installed.

That's no fun, so let's install one! Go back to your terminal and run:

```terminal
composer requires security
```

This installs Symfony's security bundle. After it finishes... run:

```terminal
git status
```

To see what its recipe did. In addition to the normal stuff, it added one new
configuration file: `security.yaml`. Let's go check that out:
`config/packagessecurity.yaml`. As you have hopefully guessed by its name, this
file powers the security system! And by the time we're done, each section in here
will be simple and boring to you. I *love* when programming stuff is boring.

## enable_authenticator_manager

Oh, but see this `enable_authenticator_manager` key? In Symfony 5.3 - the version
I'm using - the old and new security systems live side-by-side and you get to *choose*
which one you want! When you set `enable_authenticator_manager` to `true`, you are
activating the *new* system. Yay! Shiny! If you're working on a legacy project and
need to learn the *old* system, check out our Symfony 4 security tutorial. It's pretty
cool too... I guess.

## Authentication & Authorization

*Anyways*, when you talk about security, there are two big parts: authentication
and authorization. Authentication asks the question, "who are you"? And "can you prove
it?" Users, login forms, remember me systems, passwords... all of that stuff is
related to authentication.

Authorization asks a different question: "Should you have access to this resource?"
Authorization Doesn't care much about *who* you are... it's all about allowing or
denying access to different things, like different URLs or controllers.

In Symfony, or really in *any* security system, authentication is the hard part.
I mean, just think about how many *ways* there are to authenticate! Login forms,
API token authentication, social authentication with OAuth, LDAP, SSO's, sneaking
past the guard while your friend distracts them. I mean... the possibilities
are endless. But I think authentication is *also* the *most* fun.

So next: let's start on the journey into the new shiny authenticator system by
creating the most basic part of the authentication system: a user class.
