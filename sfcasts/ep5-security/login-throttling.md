# Login Throttling & Events

Symfony's security system comes packed with a lot of cool stuff, like remember me,
impersonation and voters. Heck, it even has built in support for a "login link"
authenticator - also known as "magic login links". That's where you email a link
to your user and they click *that* to log in.

One other really cool feature is login throttling: a way to prevent someone from
a single IP address from testing passwords over and over again on your site... by
trying to log in over and over and over again. And it's super easy to use.

## Activating login_throttling

Under your firewall, enable it with `login_throttling: true`.

If you stopped right there... and refreshed any page, you're going to get an error:

> Login Throttling requires the RateLimiter component.

And then a *helpful* command to install it! Nice! Copy that, spin over to your
terminal and run:

```terminal
composer require symfony/rate-limiter
```

This package also installs a package called `symfony/lock`, which has a recipe.
Run:

```terminal
git status
```

to see what it did. Interesting. It created a new `config/packages/lock.yaml`,
and *also* modified our `.env` file.

To keep track of the login attempts, the throttling system needs to store that
data somewhere. It uses the `symfony/lock` component to do that. Inside of our
`.env` file, at the bottom, there's a new `LOCK_DSN` environment variable which
is set to `semaphore`. A semaphore... is basically a super easy way to store this
data *if* you only have a single server. If you need something more advanced,
check out the `symfony/lock` documentation: it shows all the different storage
options with their pros and cons. But this will work *great* for us.

So, step 1 was to add the `login_throttling` config. Step 2 was to install the
`rate-limiter` component. And step 3 is... to enjoy the feature! Yea, we're done!

Refresh. No more error. By default, this will only allow *5* consecutive log in
attempts for the same email and IP address per minute. Let's try it. One, two,
three, four, five and... the sixth one is rejected! It locks us out for 1 minute.
Both the max attempts and interval can be configured. Actually, we can see that.

At your terminal, run:

```terminal
symfony console debug:config security
```

And... look for `login_throttling`. There it is. Yup, this `max_attempts` defaults
to 5 and `interval` to 1 minute. Oh, and by the way, this will *also* block the
same IP address from making 5 *times* the `max_attempts` for *any* email. In other
words, if the same IP address quickly tried 25 *different* emails, it would still
block them. And if you want an awesome first line of defense, I would also highly
recommend using something like Cloudflare, which can block bad users even before
they hit your server... or enable defenses if your site is attacked from many IP
addresses.

## Digging into How Login Throttling Works

So... I think this feature is pretty cool. But the most interesting thing for *us*
about it is how it works behind-the-scenes. It works via Symfony's listener system.
After we log in, whether successfully or unsuccessfully, a number of events are
dispatched throughout that process. We can hook *into* those event to do all sorts
of cool things.

For example, the class that holds the login throttling logic is called
`LoginThrottlingListener`. Let's... open it up! Hit Shift + Shift and open
`LoginThrottlingListener.php`.

Awesome. The details inside of this aren't too important. You can see it's using
something called a rate limiter... which does the checking of if the limit has
been hit. Ultimately, if the limit *has* been hit, it throws this exception, which
causes the message that we saw. For those of you watching closely, that exception
extends `AuthenticationException`... and remember, you can throw an
`AuthenticationException` at *any* point in the authentication process to make it
fail.

Anyways, this method is listening to an event called `CheckPassportEvent`. This
is dispatched after the `authenticate()` method is called from any authenticator.
At this point, authentication isn't successful yet... and the job of most listeners
to `CheckPassportEvent` is to do some extra checking and fail authentication if
something went wrong.

This class also listens to another event called `LoginSuccessEvent`... which... well,
it's kind of obvious: this is dispatched after any successful authentication. This
resets the rate limiter on success.

So this is *really* cool, and it's our first vision into how the event system
works. Next, let's go deeper by discovering that almost *every* part of authentication
is done by a listener. Then, we'll create our *own*.
