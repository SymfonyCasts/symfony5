# Upgrading Encore and your assets/ Setup

Just two recipes left to update! Let's do `webpack-encore-bundle` next. This recipe
changed quite a bit over the past year and a half, so depending on how old your
version is, this might be easy.... *or* maybe not so easy. Hmm, let's say that
it might be "interesting".

To see what we're working with, run:

```terminal
git status
```

Ok: we have a *number* of modified and deleted files *and* some conflicts.
Let's go through those first, starting with `assets/app.js`. As you can see,
I enabled some custom `Collapse` functionality from bootstrap. I'm not sure why
this conflicted, but it's an easy fix.

[[[ code('25832477e1') ]]]

Next is `bootstrap.js`. This might actually be a *new* file for you, depending on how
old your recipe was. The job of this file is to initialize the Stimulus JavaScript
library and load all of the files in the `controllers/` directory as Stimulus
controllers. In this case, I already *had* this file, but apparently the expression
for how it finds the files changed slightly. The new version is probably better,
so let's use that.

[[[ code('ebce24514b') ]]]

Next up is `controllers.json`. I'm not sure why this is conflicting either... I
have a feeling that I may have added these files manually in the past... and now
the recipe upgrade is *re-adding* them. I want to keep my custom version.

[[[ code('bd3b4aed39') ]]]

Next up is `styles/app.css`. The same thing happened here. The recipe
added this file... all the way at the bottom... with just a body background-color.
I must have added this file manually... so conflict! Keep all of our custom stuff
and... good!

[[[ code('00d6621040') ]]]

## Hello @hotwired/Stimulus v3

The *last* conflict is down here in `package.json`. This one is a bit more
interesting. My project was *already* using Stimulus: I have `stimulus` down here
and also Symfony's `stimulus-bridge`. The updated recipe now has `@hotwired/stimulus`,
and instead of `"@symfony/stimulus-bridge": "^2.0.0"`, it has
`"@symfony/stimulus-bridge": "^3.0.0"`.

So what's going on? First, Stimulus version *3* was released. Yay! But... the only
real difference between version 2 and 3 is that they renamed the library from
`stimulus` to `@hotwired/stimulus`. And in order to get version 3 to work, we
*also* need version 3 of `stimulus-bridge`... instead of 2.

So let's take this as a golden opportunity to upgrade from Stimulus 2 to Stimulus 3.
As a bonus, after upgrading, you'll get cool new debugging messages in your browser's
console when working with Stimulus locally.

Anyways, keep `@hotwired/stimulus`... but move it up so it's in alphabetical order.
Use version 3 of `stimulus-bridge`... and even though it doesn't *really* matter
since this version constraint allows *any* version `1`, I'll also use the new
`webpack-encore` version... and then fix the conflict. Oh, and be sure to
delete `stimulus`. We don't want version 2 of `stimulus` hanging around and
confusing things.

[[[ code('5eefb686c5') ]]]

Fantastic! Because we just changed some files in `package.json`, find your
terminal tab that's rocking Encore, hit "ctrl" + "C", and then run:

```terminal
yarn install
```

or

```terminal
npm install
```

Perfect! Now restart Encore:

```terminal
yarn watch
```

And... it fails!? That's a long error message... but it eventually says:

> `assets/controllers/answer-vote_controller.js contains a reference to the
> file "stimulus"`.

The most important, but *boring* part of upgrading from Stimulus 2 to 3 is that
you need to go into all of your controllers and change
`import { Controller } from 'stimulus'` to
`import { Controller } from '@hotwired/stimulus'`.

[[[ code('fd1a46cd51') ]]]

But it's *that* simple. I'm also going to delete `hello_controller.js`...
this is just an example controller that the recipe gave us. In the last controller,
change to `@hotwired/stimulus`.

[[[ code('eaf18a032d') ]]]

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
find out that there's a new version 2 out that supports Stimulus 3.

[[[ code('f77dece130') ]]]

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

That re-initializes the JavaScript from the package. One thing I want to highlight
for this *particular* package is that when we upgraded to version 2 in our
`composer.json` file, Flex then updated our `chart.js` dependency from version 2.9
to 3.4. That's because the JavaScript in this new version is meant to work with
`chart.js` 3 instead of `chart.js` 2. Flex made that change *for* us. We don't need
to do anything here, but it's good to be aware of that.

At last! We should be ready to go. Run

```terminal
yarn watch
```

and... got it! Successful build! Over in the main terminal tab, let's
add everything... since we fixed all of the conflicts... and commit!

## Upgrading Foundry's Recipe

Now, dear friends, we are on the *last* update. It's `zenstruck/foundry`.
This is an easy one. Run:

```terminal
git status
```

It is, once again, environment configuration going into a main file. So let's commit
that. 

[[[ code('80c6b85687') ]]]

And... we're *done*! All of our recipes are updated! And remember, part of 
the reason we did all of this is because some of those recipes replaced old
deprecated code with new *shiny* code. Hopefully, when we refresh the page, our
site will not only still *work*, but will have less deprecations. On my project,
if I refresh a few times, it looks like I'm settling in at about 22. Progress!

We *do* need to squash those deprecations. But next, one *other* thing we need
to do is... upgrade our code to PHP 8! This is another spot where Rector can help!
