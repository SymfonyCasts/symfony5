# Annotations to Attributes

Now that we're on PHP 8, let's convert our PHP annotations to the more hip and
happening PHP 8 attributes. Refactoring annotations to attributes is basically just...
busy work. If you want, you can do it by hand: attributes and annotations work exactly
the same way and use the same classes. Even the syntax is only slightly different:
you use colons to separate arguments because you're actually leveraging PHP *named*
arguments.

## Configuring Rector to Upgrade Annotations

So, converting it simple... but oof, I am *not* excited to do *all* of that manually.
Fortunately, this is another spot where Rector comes to save the day! Search for
"rector annotations to attributes" to find a blog post that tells you the exact
import configuration we need in `rector.php`. Copy these three things. Oh, and
starting in Rector 0.12, there's a new, simpler `RectorConfig` that you'll see
on this page. If you have that version, feel free to use it.

Oh, but before we paste this in, find your terminal, add everything... and then
commit. Perfect!

Ok, back over in `rector.php`, replace the *one* line with these *four* lines...
except we don't need the `NetteSetList`... and we need to add a few `use` statements.
I'll retype the "t" in `DoctrineSetList`, hit "tab", and do the same for
`SensiolabsSetList`.

Okay, you know the drill. Run

```terminal
vendor/bin/rector process src
```

and see what happens. Whoa... this is awesome! Look! It beautifully refactored this
annotation to an attribute and... it did this *all over* the place! We have routes
up here. And all of our entity annotations, like the `Answer` entity have *also*
been converted to attributes. That was a *ton* of work... all automatic!

## Fixing PHP CS

Though it did, as Rector sometimes does, mess up some of our coding standards. For
example, all the way at the bottom, you can see that it *did* refactor this `Route`
annotation to an attribute... but then it added a little extra space before the
`Response` return type. That's no problem. After you run Rector, it's always a
good idea to run PHP CS Fixer. Do it:

```terminal
tools/php-cs-fixer/vendor/bin/php-cs-fixer fix
```

Perfect! It made a bunch of PHP CS fixes to bring our code back in line. Run

```terminal
git diff
```

to see how things look now. The `Route` annotation changed into an attribute... and
PHP CS Fixer put our `Response` return type back the way it was before. And it
even refactored `IsGranted` from SensioFrameworkExtraBundle into an attribute.

But if you keep scrolling down until you find an entity... here we go... uh oh!
It killed the line breaks between my properties! It's not super obvious on the diff,
but if you open any entity... yikes! This looks *cramped* in here. I *like* the
line breaks in my entities.

We *could* fix this by hand... but I'm wondering if we can teach PHP CS Fixer to
do this for us.

Open `php-cs-fixer.php`. The rule that controls these line breaks is called
`class_attribute_separation`. Set this to an array that describes all of the different
parts of our class and whether or not we want them to have line breaks. For example,
we can say `['method' => 'one']`, which says we want to have *one* empty line between
all of our methods. We can also say `['property' => 'one']`, which gives us one empty
line break between our properties. There's also another one called `trait_import`.
Set that to `one` too. That gives us one empty line between our trait imports, which
is something that we have on top of `Answer`.

Let's try php-cs-fixer again:

```terminal-silent
tools/php-cs-fixer/vendor/bin/php-cs-fixer fix
```

Whoops!

> The rules contain unknown fixers: "class_attribute_separation"

I meant to say `class_attributes_separation` with an "s". What a great error though.
Let's try that again and... Cool! It changed five files, and if you check those...
they're back!

With just a few commands we've converted our entire site from annotations to
attributes. Woo!

Next, let's add property types to our entities. That's going to allow us to have
*less* Doctrine config.
