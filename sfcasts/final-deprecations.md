# Hunting Down the Final Deprecations

All right team! Let's fix the last few deprecations. One tricky thing about deprecations is that, sometimes, they come from third-party bundles. I don't have any examples here, but sometimes you'll get deprecations and if you look into it, you'll realize they're not your fault. They're coming from a library or a bundle you're using. In that case, you'll need to upgrade that bundle, and *hope* there's a new version that doesn't have any deprecations. We actually *did* have some examples of that *way* back at the beginning of the tutorial, but we've already run `composer update` a few times, and we've upgraded all of our dependencies to versions that don't have any deprecations. Yay, efficiency!

All right, let's take a look at this list down here. It says that, in Symfony 5.1, `ROLE_PREVIOUS_ADMIN` is deprecated and we should use `IS_IMPERSONATOR` instead. And you can show the context or trace on this to try to get more information about it, such as where it lives, but that isn't always obvious. You can see here that this one is coming from `base.html.twig`.

Let's go check that out over in `/templates/base.html.twig`. I'll search for "previous admin". In another tutorial, we used this to check to see if you were currently impersonating a user and we could use it to change the background to red so it was really obvious. To fix this deprecation, very simply, we just change this to `IS_IMPERSONATOR`. Easy, right? I'll copy that... and there's one other spot on this page where we need to do the same thing: `IS_IMPERSONATOR`. Done! One less deprecation!

While we're talking about this, go to `/config/packages/security.yaml` and head down to `access_control`. I have a couple pages here - `/logout`, `/admin/login`, and `/login` - that I want to make *absolutely* sure are accessible by *everyone*, even if they're not logged in. In order to do this before, we put these rules on top and used `IS_AUTHENTICATED_ANONYMOUSLY`. So if I go to `/logout`, *only* this `access_control` is matched and the `role` is authenticated anonymously because it always returns `true`, and it allows access. In Symfony 6, `IS_AUTHENTICATED_ANONYMOUSLY` has changed to `PUBLIC_ACCESS`, so I'm going to use that in both places.

If you're wondering why we didn't have a deprecation for that, this is a rare case where Symfony was unable to catch that deprecated path and show it to you. This doesn't happen very often, but it's a situation where a tool like SymfonyInsight can catch it, even when Symfony itself can't.

Okay, the last deprecation I have on the list says:

`SessionInterface aliases are deprecated, use
"$requestStack->$getSession()" instead. It is
being referenced by the "App/Security/
LoginFormAuthenticator" service.`

Let's go check that out in `/src/Security/Voter/LoginFormAuthenticator.php`. If you look here, you can see I'm autowiring the `$session` service. In Symfony 6, the `$session` service doesn't exist anymore. There are some technical reasons for this, but long story short, the session is not really a *true* service. What you're supposed to do now is get it from the request instead. This really isn't *that* big of deal. We can remove the `SessionInterface` constructor argument, and I don't need this use statement anymore either. Then, if I search for "session", you can see I was using it down here in `onAuthenticationSuccess`. Fortunately, this already passes us the `$request` object, so we can just say `$request->getSession()`. This gives us the session object off of the `$request`.

All right, if we head back to the homepage and refresh... no deprecations! And if we surf around our site a little bit... I'm not seeing any deprecations on any of these pages. Woohoo! Does this mean we're done? Well, we've manually tested all of the pages that were with `GET` requests, but what about `POST` requests like submitting the login form or submitting the registration form? Or what about API endpoints? We have one called `/api/me`, which doesn't work because I'm not logged in. Log *back* in as "abraca_admin@example.com" with password "tada" and then... `/api/me` works. Cool!

We can't see the web debug toolbar for this, but you probably already know the trick. We can go to `/_profiler`, and it will show us the last ten requests. Here's the `POST` request with `/login`. If we go down to Logs, that had no deprecations. If I go back, I can also check our API endpoint, and if we look at Logs again, it had no deprecations either. Yay!

Another option, instead of just checking the profiler all the time, is to go over your terminal and we can tail the log file. Say:

```terminal
tail -f var/log/dev.log
```

This is something that *constantly* streams logs. I'm going to hit "ctrl" + "C" because I'm actually going to grep that for deprecation: `| grep deprecation`. Now it will sit here and if any logs come through that have deprecations, we'll see them. For example, let's go register as a new user. I'll log out, then "Sign up". It asks me for my name, my email, and a password, and then we'll "Agree" to the terms. Submit and... oh, my password is too short. I'll fix that really quick, hit "Register" again and... beautiful! That works! But if we scroll over, it says:

`Since symfony/framework-bundle 5.4, Method "[...]
/AbstractController::getDoctrine()" is
deprecated,
inject an instance of ManagerRegistry in your
controller instead.`

It's not easy to see where this is coming from in my code from here, but I *did* just re-register. So I'm going to go check out `RegistrationController.php`. What it's complaining about is right here - this `getDoctrine()` is deprecated. Instead of using this, we'll just inject the `$entityManager`. At the end of the argument list here, we'll hotwire one more argument: `EntityManagerInterface $entityManager`. Beautiful! Down here, we can just delete that line because `$entityManager` is now being injected. And *that* is another deprecation gone!

Are we done now? *Probably.* Our project is pretty small, so checking out the pages manually is not that big of a deal, but for bigger projects, it might be more difficult. And you *really* want to be sure that you didn't miss anything before you upgrade.

One really great option for this on production is actually to *log* your deprecations. Open `/config/packages/monolog.yaml` and go down to `when@prod`. You can see there are a number of handlers here. By default, it's going to log all errors as a standard error. But down here it has this `deprecation` thing. This says it's going to log any deprecation messages (that's what this `channels: [deprecation]` means) to `php://stderr`. So if you *are* going to have a production system set up to capture logs that go to `php://stderr`, you can deploy your site, let it run for a day or a week, and then check this for any deprecation log messages. If you want to use a file instead, you can just change this path to a deprecation file, like `%kernel.logs/_dir%/deprecations.log`. I'm not going to use this, so I'll change it back. That's my favorite thing to do: Deploy it, and then you get to see whether or not you still have deprecations from up on production.

At this point, I'm not seeing any more deprecations on our web debug toolbar, so I think we've removed all of them. Woo! And that means we are ready for Symfony 6! Let's make the switch next.
