# Annotations to Attributes

Now that we're on PHP 8, let's convert our PHP annotations to more hip and happening PHP 8 attributes. Refactoring annotations to attributes is basically just busy work. If you want, you can do it by hand. Attributes and annotations work exactly the same way and use the same classes. There's only a slight difference in syntax, where you use colons to separate arguments because this is using PHP named arguments.

As simple as that may sound, let's *not* do that by hand. This is another spot where Rector can help us. If you search for "rector annotations to attributes", you'll find a blog post that tells you the exact import configuration that you need in `rector.php`. Copy these three things, and before we paste this in, go over and add everything, and then commit. Perfect! All right, back over in `rector.php`, I'll replace our *one* line with these *four* lines, except we don't need the `NetteSetList` and we'll need a couple of extra use statements. I'll retype the "t" in `DoctrineSetList`, hit "tab", and do the same thing on `SensiolabsSetList`. Nice! This will upgrade Doctrine annotations to *attributes*, which are things like routes and serialization groups, and also Sensiolabs annotations to attributes, which are things like the `IsGranted` security attribute.

Okay, you know the drill. Let's run

```terminal
vendor/bin/rector process src
```

and see what happens. Whoa... this is awesome! Look! It beautifully refactored this annotation to an attribute and it did this *all over* the place. We have routes up here, and all of our entity annotations, like the `Answer` entity here, have been converted to attributes. That was a *ton* of work that this just did automatically. Though it did, as Rector often does, mess up some of our coding standards. For example, all the way at the bottom, you can see that it *did* refactor this `Route` annotation to an attribute, but then it added a little extra space before our `Response` return type. That's no problem. Typically, after you run Rector, you'll just want to run PHP CS Fixer to correct some of these issues. So I'll run:

```terminal
tools/php-cs-fixer/vendor/bin/php-cs-fixer fix
```

Perfect! You can see it made a number of PHP CS fixes to bring our code back in line. All right, if we run

```terminal
git diff
```

we can see all of the things it changed. The `Route` annotation changed into an attribute, and PHP CS Fixer just put our `Response` return type back the way it was before.

This is awesome! You can even see how it refactored the `IsGranted` from SensioFrameworkExtraBundle into an attribute. But if you keep scrolling down until you find an entity... here we go... there is a *little* problem here. It actually killed the line breaks between my properties. It's not very obvious on the diff, but if you open any entity... yikes! Things look *very* cramped in here all of the sudden. I don't really like this style, because I prefer to have line breaks between my properties. We *could* do that by hand, but this tells me that I'm probably missing a rule in my PHP CS Fixer config, because it should have done this for me.

I'm going to open `php-cs-fixer.php`, and the rule that we want, in this case, is called `class_attribute_separation`, where we can describe, in an array, all of the different parts of our class and whether or not we want them to have spaces. So, for example, we can say `['method' => 'one']`, which says we want to have *one* empty line between all of our methods. We can also say `['property' => 'one']`, which gives us one empty line break between our properties. There's also another one called `trait import` that I'll set to `one`. That gives us one empty line between our trait imports, which is something that we have at the top of `Answer.php`. Thanks to that little change, if you run PHP CS Fixer again... oh... I got an error.

```
The rules contain unknown fixers:
"class_attribute_separation"
```

I meant to say `class_attributes_separation` with an "s". What a great error, though. Let me try that again and... Cool! It changed five files, and if you check those... they're back! Awesome! With just a few commands, we have now converted our entire site from annotations to attributes. Woo! And we can go even further!

Next, let's add property types to our entities. That's going to allow us to have *less* doctrine config.
