# Annotations to Attributes

Now that we're on PHP 8, let's convert our PHP annotations to the more hip and
happening PHP 8 attributes. Refactoring annotations to attributes is basically just...
busy work. You *can* do it by hand: attributes and annotations work exactly
the same and use the same classes. Even the syntax is only a little different:
you use colons to separate arguments... because you're actually leveraging PHP
*named* arguments. Neato.

## Configuring Rector to Upgrade Annotations

So, converting is simple... but oof, I am *not* excited to do *all* of that manually.
Fortunately, Rector comes back to the rescue!! Search for "rector annotations to
attributes" to find a blog post that tells you the exact import configuration we
need in `rector.php`. Copy these three things. Oh, and starting in Rector 0.12,
there's a new, simpler `RectorConfig` object that you'll see on this page. If you
have that version, feel free to use *that* code.

Oh, and before we paste this in, find your terminal, add everything... and then
commit. Perfect!

Back over in `rector.php`, replace the *one* line with these *four* lines...
except we don't need the `NetteSetList`... and we need to add a few `use` statements.
I'll retype the "t" in `DoctrineSetList`, hit "tab", and do the same for
`SensiolabsSetList`.

[[[ code('e0640cbb60') ]]]

Now, you know the drill. Run

```terminal
vendor/bin/rector process src
```

and see what happens. Whoa... this is awesome! Look! It beautifully refactored this
annotation to an attribute and... it did this *all over* the place! We have routes
up here. And all of our entity annotations, like the `Answer` entity have *also*
been converted. That was a *ton* of work... all automatic!

[[[ code('8d77ced2f8') ]]]

[[[ code('8b2965fb32') ]]]

## Fixing PHP CS

Though it did, as Rector sometimes does, mess up some of our coding standards. For
example, all the way at the bottom, it *did* refactor this `Route` annotation to
an attribute... but then it added a little extra space before the `Response` return
type. That's no problem. After you run Rector, it's always a good idea to run PHP
CS Fixer. Do it:

```terminal
tools/php-cs-fixer/vendor/bin/php-cs-fixer fix
```

Love it. A bunch of fixes to bring our code back in line. Run

```terminal
git diff
```

to see how things look now. The `Route` annotation changed into an attribute... and
PHP CS Fixer put the `Response` return type back the way it was before. Rector
even refactored `IsGranted` from SensioFrameworkExtraBundle into an attribute.

But if you keep scrolling down until you find an entity... here we go... uh oh!
It killed the line breaks between our properties! It's not super obvious on the diff,
but if you open any entity... yikes! This looks... *cramped*. I *like* the
line breaks between my entity properties.

[[[ code('6ff510a109') ]]]

We *could* fix this by hand... but I'm wondering if we can teach PHP CS Fixer to
do this for us.

Open `php-cs-fixer.php`. The rule that controls these line breaks is called
`class_attributes_separation` with an "s" - I'll fix that in a minute. Set this
to an array that describes all of the different parts of our class and how each
should behave. For example, we can say `['method' => 'one']` to say that we want
*one* empty line between each method. We can also say `['property' => 'one']` to
have one line break between our properties. There's also another called `trait_import`.
Set that to `one` too. That gives us an empty line between our trait imports, which
is something that we have on top of `Answer`.

[[[ code('ad6d04f79f') ]]]

Now try php-cs-fixer again:

```terminal-silent
tools/php-cs-fixer/vendor/bin/php-cs-fixer fix
```

Whoops!

> The rules contain unknown fixers: "class_attribute_separation"

I meant to say `class_attributes_separation` with an "s". What a great error though.
Let's try that again and... cool! It changed five files, and if you check those...
they're back!

[[[ code('b249f94c45') ]]]

With just a few commands we've converted our entire site from annotations to
attributes. Woo!

Next, let's add property types to our entities. That's going to allow us to have
*less* entity config thanks to a new feature in Doctrine.
