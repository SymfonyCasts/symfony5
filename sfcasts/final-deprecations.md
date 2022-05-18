# Hunting Down the Final Deprecations

All right team! Let's fix these last few deprecations. One of the trickiest things
about these is that, sometimes, they come from third-party bundles. I don't have
any examples here, but sometimes you'll get a deprecation and... if you look into
it, you'll realize it's not your fault. It's coming from a library or a bundle
you're using. When this happens, you need to upgrade that bundle, and *hope* there's
a new version without any deprecations. We actually *did* have some examples
of this *way* back at the beginning of the tutorial. But... we've already run
`composer update` a few times, and have, apparently, upgraded all of our dependencies
to versions *without* deprecations. Yay, efficiency!

## ROLE_PREVIOUS_ADMIN -> IS_IMPERSONATOR

Ok, let's take a look at this list. It says that, in Symfony 5.1,
`ROLE_PREVIOUS_ADMIN` is deprecated and we should use `IS_IMPERSONATOR` instead.
You can show the context or trace to try to get more info, like *where* this is
coming from. It isn't always obvious... and that's one of the trickiest things
about deprecations. But *this* one is coming from `base.html.twig`.

Great! Open `templates/base.html.twig` and search for "previous_admin". In an
earlier tutorial, we used this to check if we are currently impersonating a user
with Symfony's `switch_user` feature. If we *are*, we changed the background to
red to make it really obvious.

To fix the deprecation, very simply, change this to `IS_IMPERSONATOR`. Copy that...
because there's one other spot on this page where we need to do the same thing:
`IS_IMPERSONATOR`. Done! One less deprecation!

## IS_AUTHENTICATED_ANONYMOUSLY -> PUBLIC_ACCESS

While we're talking security, open up `config/packages/security.yaml` and head down
to `access_control`. I have a few entries - `/logout`, `/admin/login` - that I want
to make *absolutely* sure are accessible by *everyone*, even
users that are *not* logged in. To do, we added these rules on top and,
*previously* used `IS_AUTHENTICATED_ANONYMOUSLY`. So if I go to `/logout`, *only*
this `access_control` is matched... and since the `role` is
`IS_AUTHENTICATED_ANONYMOUSLY` access is *always* granted.

In Symfony 6, `IS_AUTHENTICATED_ANONYMOUSLY` has changed to `PUBLIC_ACCESS`. So
use that in both places.

If you're wondering why we didn't have a deprecation for this... well... it's
a rare case where Symfony is unable to *catch* that deprecated path and show it to
us. This doesn't happen very often, but it's a situation where a tool like
SymfonyInsight can help catch this.... even when Symfony itself can't.

## The Deprecated Session Service

Okay, the last deprecation on the list says:

> `SessionInterface` aliases are deprecated, use `$requestStack->getSession()`
> instead. It's being referenced by the `LoginFormAuthenticator` service.

Let's go check that out! Open `src/Security/LoginFormAuthenticator.php`. Ahh.
I'm autowiring the `SessionInterface` service. In Symfony 6, that service *no*
longer exists. There are some technical reasons for this... but long story
short, the session wasn't ever, really a *true* service. What you're supposed to
do now is get it from the `Request`.

So, no big deal. Remove the `SessionInterface` constructor argument... and we don't
need this `use` statement anymore either. Now search for "session". We're using it
down in `onAuthenticationSuccess()`. Fortunately, this already passes us the
`$request` object! So we can just say `$request->getSession()`.

## Hunting Down the Final Deprecations

Done! So... did we do it? Have we achieved zero deprecations and spiritual
enlightenment? Go back to the homepage, refresh and... we did! Well, at least
that first part... no deprecations! And if we surf around our site a bit... I'm
not seeing any deprecations on *any* of these pages!

Does this mean we're done? Well, we've manually tested all of the pages that we
can click on. But what about `POST` requests... like submitting the login or
registration forms? And what about API endpoints? We have one called
`/api/me`... which doesn't work because I'm not logged in. Log *back* in as
"abraca_admin@example.com" with password "tada" and then... yea, `/api/me` works.

We can't see the web debug toolbar for this request, but I bet you already know
the trick. Go to `/_profiler` to see the last ten requests. Here's the `POST`
request to `/login`. Go down to Logs. Great! That had no deprecations. Go back and
also check the API endpoint. If we look at Logs again, it *also* had no
deprecations. We're on a roll!

Another option, instead of checking the profiler all the time, is to go over to
your terminal and tail the log file:

```terminal
tail -f var/log/dev.log
```

This will *constantly* stream any new logs. Actually, hit "ctrl" + "C" and run that
again, but grep for `deprecation`:

```terminal-silent
tail -f var/log/dev.log | grep deprecation
```

Perfect. Now, if any logs come through that contain the word "deprecation", we'll
see them. And since deprecated code paths trigger a log in the `dev` environment,
this is a powerful tool.

## Deprecated $this->getDoctrine() Method

For example, let's go register as a new user. I'll log out, then "Sign up". It asks
me for my name, email, and a password. Click to "Agree" to some made-up terms and
submit. Oh, my password is too short: my own validation rules coming back to haunt me!
Fix that, hit "Register" again and... it works!

But if we go *back* to our terminal... rut roo!

> Since symfony/framework-bundle 5.4, method `AbstractController::getDoctrine()`
> is deprecated. Inject an instance of `ManagerRegistry` in your controller instead.

It's not easy to see where this is coming from in our code, but we *did* just
register... so let's open up `RegistrationController`. Ah, it's complaining about
this right here: the `getDoctrine()` method is deprecated.

Instead of using this, we can inject the `$entityManager`. At the end of the argument
list, autowire `EntityManagerInterface $entityManager`. And... then down here,
delete this line because `$entityManager` is now being injected. Another deprecation
gone!

## Logging Deprecations on Production

Are we done *now*? *Probably.* Our project is pretty small, so checking all the pages
manually isn't that big of a deal. But for bigger projects, it might be... a
*huge* deal to check everything manually! And you *really* want to be sure that
you didn't miss anything before you upgrade.

One great option to make sure you didn't miss anything is to *log* your deprecations
on production. Open `config/packages/monolog.yaml` and go down to `when@prod`. This
has a number of handlers that will log all errors to `php://stderr`. There's also
a `deprecation` section. With this config, Symfony will log any deprecation
messages (that's what this `channels: [deprecation]` means) to `php://stderr`.

This means that you can deploy, wait for an hour, day or week, then... just check
the log! If you want to log to a file instead, change the path to something like
`%kernel.logs_dir%/deprecations.log`.

So that's *my* favorite thing to do: deploy it, and then see - in the *real* world -
whether or not anyone is still hitting deprecated code paths.

At this point, I'm not seeing any more deprecations on our web debug toolbar, so I
think we're done! And *that* means we're ready for Symfony 6! Let's do the upgrade
next!
