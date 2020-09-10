# Foundry: Fixture Model Factories

In the `load()` method of the fixture class, we can create as much dummy data as
we want. Right now... we're creating exactly *one* `Question`... which isn't
making for a very realistic experience.

If we created *more* questions... and especially in the future when we will have
multiple database tables that relate to each other, this class would start to get
ugly. It's... already kind of ugly.

## Hello Foundry!

No, we deserve better! Let's use a super fun new library instead. Google for
"Zenstruck Foundry" and find its [GitHub Page](https://github.com/zenstruck/foundry).

Foundry is *all* about creating Doctrine entity objects in an easy, repeatable
way. It's perfect for fixtures as well as for functional tests where you want to
seed your database with data at the start of each test. It even has extra
features for test assertions!

The bundle was created by [Kevin Bond](https://github.com/kbond) - a *long* time
Symfony contributor and friend of mine who's been creating some *really* excellent
libraries lately. Foundry is Canadian for fun!

## Installing Foundry

Let's get to work! Scroll down to the installation, copy the composer require
line, find your terminal and paste. The `--dev` is here because we only need
to load dummy data in the `dev` & `test` environments.

```terminal-silent
composer require zenstruck/foundry --dev
```

While that's running, head back to the docs. Let me show you what this bundle is
all about. Suppose you have entities like `Category` or `Post`. The idea is that,
for each entity, we will generate a corresponding *model factory*. So, a `Post`
entity will have a `PostFactory` class, which will look something like this.

Once we have that, we can configure some default data for the entity class and
then... start creating objects!

I know I explained that quickly, but that's because we're going to see this in
action. Back at the terminal... let's wait for this to finish. I'm actually
recording at my parents' house... where the Internet is *barely* a step up from
dial-up.

After an edited break where I ate a sandwich and watched Moana, this finally
finishes.

## make:factory

Let's generate one of those fancy-looking model factories for `Question`. To
do that, run:

```terminal
symfony console make:factory
```

I also could have run `bin/console make:factory`... because this command doesn't
need the database environment variables... but it's easier to get in the habit of
*always* using `symfony console`.

Select `Question` from the list and... done! Go check out the new class
`src/Factory/QuestionFactory.php`.

[[[ code('4c507c3280') ]]]

## Adding Default Values

The only method that we need to worry about right now is `getDefaults()`. The
idea is that we'll return an array of all of the data needed to create a `Question`.
For example, we can set a `name` key to our dummy question name - "Missing pants".

[[[ code('f01e32d755') ]]]

This works a bit like Twig. When Foundry sees the `name` key, it will
call the `setName()` method on `Question`. Internally, this uses Symfony's
property-access component, which I'm mentioning, because it also supports passing
data through the constructor if you need that.

Copy the rest of the dummy code from our fixture class, delete it... and delete
*everything* actually. 

[[[ code('4085c5d08a') ]]]

Back in `QuestionFactory`, paste!

But we need to convert all of this into array keys. As *exciting* as this is...
I'll... type really fast.

[[[ code('4a38bfd803') ]]]

And.... done! Phew...

## Using the Factory

Ok! We now have a simple array of "default" values that are enough to create a
valid `Question` object. Our `QuestionFactory` is ready! Let's use it in
`AppFixtures`.

How? First, say `QuestionFactory::new()`. That will give us a new *instance* of the
`QuestionFactory`. Now `->create()` to create a *single* `Question`.

[[[ code('08efce95a6') ]]]

Done! Ok, it's *still* not interesting - it will create just *one* `Question`...
but let's try it! Re-run the fixtures:

```terminal
symfony console doctrine:fixtures:load
```

Answer yes and... no errors! Head over to the browser, refresh and... oh! Zero
questions! Ah, my *one* question is probably unpublished. Load the fixtures again:

```terminal-silent
symfony console doctrine:fixtures:load
```

Refresh and... there it is!

## createMany()

At this point, you might be wondering: why is this better? Valid question. It's
better because we've only just *started* to scratch the service of what Foundry
can do. Want to create 20 questions instead of just one? Change `create()` to
`createMany(20)`.

[[[ code('f2d0b3d06a') ]]]

That's it. Reload the fixtures again:

```terminal-silent
symfony console doctrine:fixtures:load
```

Then go check out the homepage. Hello 20 questions created with one line
of very readable code.

But wait there's *more* Foundry goodness! Foundry comes with built-in
support for a library called faker. A handy tool for creating *truly* fake
data. Let's improve the quality of our fake data *and* see a few other cool things
that Foundry can do next.
