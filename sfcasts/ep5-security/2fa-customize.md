# Customize The 2-Factor Auth Form

We just successfully logged in using two-factor authentication. Woo! But, the form
where we entered the code was *ugly*. Time to fix that! Log out... then log back
in… with our usual email… and password `tada`. Here's our ugly form.

How can we customize this? Well, the wonderful documentation, of course, could tell
us. But let's be tricky and see if we can figure it out for ourselves. Find your
terminal and load the current configuration for this bundle:
`symfony console debug:config`... and then, find the config file, copy the root
key - `scheb_two_factor` - and paste.

```terminal-silent
symfony console debug:config scheb_two_factor
```

Awesome! We see `security_tokens` with `UsernamePasswordToken`… that's no surprise
because that's what we have here. But this also shows us some default values that we
have not specifically configured. The one that's interesting to *us* is `template`.
*This* is the template that's currently rendered to show the two-factor "enter the code"
page.

## Overriding the Template

Let's go check it out. Copy most of the file name, hit Shift+Shift, paste
and... here it is! It's not too complex: we have an
`authenticationError` variable that renders a message if we type an invalid code.

Then… we basically have a form with an action set to the correct submit path, an
input and a button.

To customize this, go down into the `templates/security/` directory and create a
new file called, how about, `2fa_form.html.twig`. I'll paste in a structure to get
us started. This extends `base.html.twig`... but there's nothing dynamic yet: the
form is a big TODO.

So obviously, this isn't done... but, let's try to use it anyways! Back in
`config/packages/scheb_2fa.yaml`, under `totp`, add `template` set to
`security/2fa_form.html.twig`.

Back at the browser, refresh and... yes! That's our template!

Oh, and now that this renders a full HTML page, we have our web debug toolbar
again. Hover over the security icon to see one interesting thing. We're,
sort of, authenticated, but with this special `TwoFactorToken`. And if you look
closer, we don't have any roles. So, we are *kind of* logged in, but without
any roles.

And also, the two-factor bundle executes a listener at the start of
each request that guarantees the user can't try to navigate the site in this
half-logged-in state: it stops all requests and redirects them back to this URL. And
if you scroll down, even *on* this page, all security checks return
ACCESS DENIED. The two-factor bundle hooks into the security system to cause this.

Anyways, let's fill in the form TODO part. For this, copy *all* of the core template,
and paste it over our TODO.

Now... it's just a matter of customizing this. Change the error `p` to a `div`
with `class="alert alert-error"`. That should be `alert-danger`... I'll fix it
in a minute. Below, I'm going to remove the links to authenticate in a different
way because we're only supporting totp. For the `input` we need
`class="form-control"`. Then all the way down here, I'll leave these `displayTrusted`
and `isCsrfProtectionEnabled` sections... though I'm not using them. You can activate
these in the config. Finally, remove the `p` around the button, change it to a
`button` - I just like those better - put the text inside the tag... then add a few
classes to it.

Oh, and I'm also going to move the "log out" link up a bit… clean it up
a little... and add some extra classes.

Phew! With any luck, that should make it look *fairly* good. Refresh and... sweet!
Bah, except for a little extra quotation on my “…Login”. I always do that. There
we go, that looks better.

If we type an invalid code... error! Oh, but it's not red... the class should
be `alert-danger`. That's why we test things! And now... that’s better.

If we type a *valid* code from my Authy app, we've got it! Mission accomplished!

Also, even though we won't talk about them, the two-factor bundle also supports
"backup codes" and "trusted devices" where a user can choose to skip future
two-factor authentication on a specific device. Check out their docs for the details.

And... we made it! Congrats on your incredibly hard work! Security is *supposed* to be
a dry, boring topic, but I absolutely *love* this stuff. I hope you enjoyed the
journey as much as I did. If there's something we didn't cover or you still have
some questions, we're here for you down in the comments section.

All right friends, see ya next time!
