# Upgrading Encore and your assets/ Setup

Just two recipes left to update! Let's do `webpack-encore-bundle` next. This recipe has changed quite a bit over the past year and a half, so depending on how old your version is, this might be easy, *or* it might be a little bit more involved. To see what we're working with, let's run:

```terminal
git status
```

All right, so I have a *number* of modified and deleted files, *and* some conflicts. Let's go through the conflicts first, starting with `assets/app.js`. As you can see here, I added a new custom `collapse` functionality from bootstrap. I'm not sure why this conflicted, but it's an easy fix.

Next is `bootstrap.js`. This might actually be a *new* file for you, depending on how old your application is. This file was added a while ago, and its job is to initialize Stimulus in your application and load all of the files in your controller's directory as Stimulus controllers. In this case, I already *had* this file, but apparently the expression for how it finds the files changed slightly. The new version is probably better, so I'll use it instead.

The next conflict is `controllers.json`. I'm not sure why this is conflicting either, but I have a feeling that I've added these files manually in the past, and when I upgraded the recipe, it tried to re-add them. I want to keep my custom version right here. If you have an older project, it would be *adding* all of these files.

Another conflict is in `/styles/app.css`. The same thing happened here. It actually added this file all the way at the bottom with just a body background-color. I must have added this file manually before, so I'm getting a conflict. We want make sure we keep all of our custom stuff and... good!

The *last* conflict is down here in `package.json`. This one is a little more interesting. My project was *already* using Stimulus. As you can see, I have `stimulus` down here and I also have Symfony's `stimulus-bridge`, which helps bring stimulus *into* Symfony. The updated recipe now has `@hotwired/stimulus`, and instead of `"@symfony/stimulus-bridge": "^2.0.0"`, it has `"@symfony/stimulus-bridge": "^3.0.0"`. So what happened here? When Stimulus went from version 2 to version 3, they didn't really change anything except for renaming the library from `stimulus` to `@hotwired/stimulus`. In order to get version 3 to work, we need version 3 of `stimulus-bundle` instead of version 2. I'm going to take this as an opportunity to upgrade from Stimulus 2 to Stimulus 3, so I'll keep this `@hotwired/stimulus` and put it up here so it's in alphabetical order. Let's also use version 3 of `stimulus-bridge`. And even though it doesn't *really* matter since this version constraint allows *any* version one, I'll also use the new `webpack-encore` version and then fix the conflict. The other thing you want to make sure you do is delete `stimulus`. We don't want version 2 of `stimulus` in there anymore. Fantastic!

Because we just changed some files in our `package.json` file, I'm going to go to my other tab here which is running Encore, hit "ctrl" + "C", and then run:

```terminal
yarn install
```

or

```terminal
node install
```

Perfect! Now I'll clear this and run

```terminal
yarn watch
```

to rerun Encore. And... it fails! It's got this long error message, but it eventually says:

`/assets/controllers/answer-vote_controller.js
contains a reference to the file "stimulus"`

The most important, but *boring* part when you upgrade from Stimulus 2 to 3 is you need to go into all of your controllers and change this `import { Controller } from 'stimulus'` to `import { Controller } from '@hotwired/stimulus'`. It's *that* simple. I'm also going to delete `hello_controller.js` while I'm here. This is an example controller that the recipe just gave me. In my other controller here, I'll change this to `@hotwired/stimulus`. Awesome! Now let's close

```terminal
yarn watch
```

and try rerunning it. And... we still get an error. Dang... This coming from `/@symfony/ux-chartjs/dist/controller.js`.

In my project, I've installed one of these Symfony UX packages, which are PHP packages that *also* give you some JavaScript. Apparently, the JavaScript for that package is still referencing `stimulus` instead of the new `@hotwired/stimulus`. What this tells me is that I probably need to upgrade that PHP package. So, in `composer.json`, down here in `symfony/ux-chartjs`, if you do some research, you'll find out that there's a new version 2 out that supports Stimulus 3. I'll go over here to my main terminal tab and run

```terminal
composer up symfony/ux-chartjs
```

to upgrade that *one* package. And... nice! We've upgraded to version 2.1.0. Now it wants us to run:

```terminal
npm install --force
```

*or*

```terminal
yarn install --force
```

That re-initializes the JavaScript from that package. One thing I want to highlight for this *particular* package is that when we upgraded to version 2 in our `package.json` file, it actually upgraded our `chart.js` dependency from version 2.9 to 3.4. That's because the JavaScript in this new version is meant to work with `chart.js` 3 instead of `chart.js` 2. So it made that change *for* us. We don't need to do anything here, but it's good to be aware of this.

At last! We should be ready to go. Run

```terminal
yarn watch
```

and... got it! It builds successfully! Over the main terminal tab, go ahead and add everything, since we've fixed all of our conflicts and made all of those changes. And commit! Got it!

Now, dear friends, we are on to the *last* update. It's `zenstruck_foundry.yaml`. This is an easy one. Run:

```terminal
git status
```

It is, once again, environment configuration going into a main file. So let's commit that. Beautiful! And we are *done*. All of our recipes are updated! And remember, part of the reason we did that is because some of those recipes actually replaced old deprecated code with new code. Hopefully, when we refresh the page, it not only still works, but we'll have less deprecations. On my project, if I refresh a couple of times, it looks like I'm settling in at about 22. Progress!

Next, it's time to actually take a look at the deprecations we have left and start squashing these. Let's start with security.
