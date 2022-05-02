# Upgrading Encore and your assets/ Setup

Just two recipes left to update! Let's do `webpack-encore-bundle` next. This recipe
has changed quite a bit over the past year and a half, so depending on how old your
version is, this might be easy.... *or* maybe not so easy. Let's say, "interesting".

To see what we're working with, run:

```terminal
git status
```

All right, so we have a *number* of modified and deleted files *and* some conflicts.
Let's go through the conflicts first, starting with `assets/app.js`. As you can see,
I enabled some custom `Collapse` functionality from bootstrap. I'm not sure why
this conflicted, but it's an easy fix.

Next is `bootstrap.js`. This might actually be a *new* file for you, depending on how
old your recipe was. This file was added a while ago, and its job is to initialize
Stimulus into our app and load all of the files in the `controllers/` directory
as Stimulus controllers. In this case, I already *had* this file, but apparently
the expression for how it finds the files changed slightly. The new version is
probably better, so I'll use it instead.

Next up is `controllers.json`. I'm not sure why this is conflicting either, I
have a feeling that I may have added these files manually in the past... and now
the recipe upgrade is *re-adding* them. I want to keep my custom version.
If you have an older project, the recipe update would have just *added* all of
these as new files.

Another conflict is in `styles/app.css`. The same thing happened here. The recipe
added this file... all the way at the bottom... with just a body background-color.
I must have added this file manually... so conflict! Keep all of our custom stuff
and... good!

## Hello @hotwired/Stimulus v3

The *last* conflict is down here in `package.json`. This one is a bit more
interesting. My project was *already* using Stimulus: I have `stimulus` down here
and also Symfony's `stimulus-bridge`. The updated recipe now has `@hotwired/stimulus`,
and instead of `"@symfony/stimulus-bridge": "^2.0.0"`, it has
`"@symfony/stimulus-bridge": "^3.0.0"`.

So what's going on? First, Stimulus version *3* was released. But... the only
real difference between version 2 and 3 is that they renamed the library from
`stimulus` to `@hotwired/stimulus`. And in order to get version 3 to work, we
*also* need version 3 of `stimulus-bridge`... instead of 2.

So let's take this as a golden opportunity to upgrade from Stimulus 2 to Stimulus 3.
So, keep `@hotwired/stimulus`... but move it up so it's in alphabetical order. Let's
also use version 3 of `stimulus-bridge`. And even though it doesn't *really* matter
since this version constraint allows *any* version `one`, I'll also use the new
`webpack-encore` version... and then fix the conflict. Oh, the other thing you want
to make sure you do is delete `stimulus`. We don't want version 2 of `stimulus` in
there at *all* anymore.

Fantastic! Because we just changed some files in our `package.json` file, find your
terminal tab that's running Encore, hit "ctrl" + "C", and then run:

```terminal
yarn install
```

or

```terminal
node install
```

Perfect! I'll clear this and run:

```terminal
yarn watch
```

to rerun Encore. And... it fails! That's a... long error message... but it eventually
says:

`assets/controllers/answer-vote_controller.js contains a reference to the file "stimulus"`.

The most important, but *boring* part when you upgrade from Stimulus 2 to 3 is that
you need to go into all of your controllers and change this
the `import { Controller } from 'stimulus'` to
`import { Controller } from '@hotwired/stimulus'`.

It's *that* simple. I'm also going to delete `hello_controller.js` while I'm here.
This is an example controller that the recipe just gave me. In the other controller
here, change to `@hotwired/stimulus`.

Awesome! Stop `yarn watch` again.. and re-run it:

```terminal-silent
yarn watch
```

Dang! We still get an error! This is coming from
`@symfony/ux-chartjs/dist/controller.js`.

## Upgrading UX Libraries

In my project, I've installed one of the Symfony UX packages, which are PHP
packages that *also* give you some JavaScript. Apparently, the JavaScript for that
package is still referencing `stimulus` instead of the new `@hotwired/stimulus`. What
this tells me is that I probably need to upgrade that PHP package. So, in
`composer.json`, down here on `symfony/ux-chartjs`, if you do some research, you'll
find out that there's a new version 2 out that, which supports Stimulus 3.

After changing that, find your main terminal tab and run:

```terminal
composer up symfony/ux-chartjs
```

to upgrade that *one* package. And... nice! We've upgraded to version 2.1.0. Now it
wants us to run:

```terminal
npm install --force
```

*or*

```terminal
yarn install --force
```

That re-initializes the JavaScript from that package. One thing I want to highlight
for this *particular* package is that when we upgraded to version 2 in our
`package.json` file, it actually upgraded our `chart.js` dependency from version 2.9
to 3.4. That's because the JavaScript in this new version is meant to work with
`chart.js` 3 instead of `chart.js` 2. So it made that change *for* us. We don't need
to do anything here, but it's good to be aware of this.

At last! We should be ready to go. Run

```terminal
yarn watch
```

and... got it! It builds successfully! Over in the main terminal tab, go ahead and
add everything, since we've fixed all of our conflicts and made all of those changes.
And commit!

## Upgrading Foundry's Recipe

Now, dear friends, we are onto the *last* update. It's `zenstruck/foundry`.
This is an easy one. Run:

```terminal
git status
```

It is, once again, environment configuration going into a main file. So let's commit
that. Beautiful! And we are *done*! All of our recipes are updated! And remember,
part of the reason we did all of this is because some of those recipes replaced old
deprecated code with new *shiny* code. Hopefully, when we refresh the page, our
site will not only still *work*, but will have less deprecations. On my project,
if I refresh a few times, it looks like I'm settling in at about 22. Progress!

We *do* need to squash those deprecations. But next, one *other* thing we need
to do is... upgrade our code to PHP 8! This is another spot where Rector can help!
