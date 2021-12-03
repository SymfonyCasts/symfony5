# Login Throttling

Coming soon...

Um, simply a secure system has a lot of cool stuff in it. Like remember me, cookies,
impersonation voters even has built in support for eight magic link authenticator,
where you email a link to your user and they click that to log in one other really
cool feature is log-in throttling a way to prevent someone from a single IP address
from testing passwords on your site, by trying to log in over and over and over and
over again. And it's super easy to use. So under your firewall, all you need to do is
enable it. So you can do that by saying `login_throttling: true`

If you stop right there and refresh any page, you're going to get that air. It says,
this requires the rate limiter component. Cool. Let's copy that composer require line
spin or whatever terminal and Ron 

```terminal
composer require symfony/rate-limiter
```

This package has a also installed something called `symfony/lock`, which has a recipe
I'll run, get status to see what it did. Interesting. So create a new 
`config/packages/lock.yaml` file, and also modified our `.env`. So in order to sort of keep
track of, who's been trying to log in the log and throttling system needs to store
that data somewhere. And it used the `symfony/lock` component to do that inside of
our `.env` file at the bottom. There's a new `LOCK_DSN`, which is set to summit summit
for this is basically a string. And you can see example above of storing the locks in
Postgres of where to store this information. Uh, `semaphore` is the easiest place to store
stuff.

It's an easy way to keep track of things on a single machine. So if you had multiple
servers, you would need to use something else like Postgres or Redis, but this will
work great for our situation. And that's it. The rate limiter components going to S
the logging throttling is gonna start using the, uh, lock component. The lock
component will S savings at the Semafore, which otherwise we can try this for
refresh. It works again. So by default, it's going to block five log in attempts from
the same user. So one do three or five. Now the sixth one doesn't work and it locks
you out. It also blocks, um, attempts from the same IP address and any email. If you
hit 50 of those within a minute, I need to look up the specifics on that. All of this
can be configured and it's documented how you can configure it. And we can even say
some of the configuration options by running 

```terminal
symfony console debug:config:security
```

and seeing the default configuration under that log and thrive. So you can see max
attempts at five minutes interval one minute.

So that's just a really cool thing that you get for free. I would recommend using
this and also potentially using it with something like CloudFlare, which can offer
you additional production. Um, but one of the most interesting things for us about
this is how this works. It works via Symfony's listener system. After we log in,
whether successfully or failed a number of events are dispatched through that
process, and you can hook into them to do different things. So the code that runs,
this is actually a listener called `LoginThrottlingListener`. You can open it and
let it shift + shift `LoginThrottlingListener.php`. And here it is the
specifics on this aren't too important.

You can see it's using something called a rate limiter that kind of checks thing, and
ultimately throws this exception, which causes the message that we saw this 
`checkPassport()`, uh, method `CheckPassportEvent`. It's called every after every
authentication. I need to get the words right before that. So also another listen to
I called on successful log in, which is called after we successfully log in and you
can see it resets the limiter. So once you are successful, it kind of clears things
out. So this is really cool, and it's kind of our first vision into how the, the
event system works. Let's look at an event system further next and use it to prevent
our user from logging in. If their email address is not yet confirmed.

