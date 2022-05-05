# Adding Property Types to Entities

A new feature snuck into Doctrine a while back, and it's *super* cool. Doctrine can
now *guess* some configuration about a property via its *type*. We'll start with
the relationship properties. But first, I want to make sure that my database is in
sync with my entities. Run:

```terminal
symfony console doctrine:schema:update --dump-sql
```

And... yep! My database *does* look like my entities. We'll run this command again
later after we make a bunch of changes... because our goal isn't actually to
*change* any of our database config: just to simplify it. Oh, and yes, this
dumped out a bunch of deprecations... we *will* fix those... eventually... I promise!

## Removing targetEntity

So here's change number one. This `question` property holds a `Question` object.
So let's add a `Question` *type*. But we have to be careful. It needs to be a
*nullable* `Question`. Even though this is required in the database, after
we instantiate the object, the property won't *instantly* be populated: it will,
at least temporarily, *not* be set. You'll see me do this with all of my entity
property types. If it's *possible* for a property to be `null` - even for a
moment - we need to reflect that.

I'm also going to initialize this with `= null`. If you're new to property types,
here's the deal. If you add a type to a property... then try to access it *before*
that property has been set to some value, you'll get an error, like

> Typed property Answer::$question must not be accessed before initialization.

*Without* a property type, the `= null` isn't needed, but now it is. Thanks to
this, if we instantiate an `Answer` and then call `getQuestion()` before that
property is set, things won't explode.

Ok, so adding property types is nice: it makes our code cleaner and tighter. *But*,
there's another big advantage: we don't need the `targetEntity` anymore! Doctrine
is now able able to figure that out for us. So delete this... and celebrate!

Then... keep going to `Question`. I'm looking specifically for relationship fields.
This one is a `OneToMany`, which holds a collection of `$answers`. We *are* going
to add a type here... but in a minute. Let's focus on the `ManyToOne` relationships
first.

Down here, for `owner`, add `?User`, `$owner = null`, then get rid of `targetEntity`.
And then in `QuestionTag`, do the same thing: `?Question $question = null`...
and do your victory lap by removing `targetEntity`.

And... down here... one more time! `?Tag $tag = null`... and say bye bye to
`targetEntity`.

Sweet! To make sure we didn't mess anything up, re-run the `schema:update` command
from earlier:

```terminal-silent
symfony console doctrine:schema:update --dump-sql
```

And... we're still good!

## Adding Types to All Properties

Ok, let's go further and add types to *every* property. This will be more work,
but the result is worth it. For `$id`, this will be a nullable `int`... and
initialize it to `null`. Thanks to that, we don't need `type: 'integer'`: Doctrine
can now figure that out.

For `$content`, a nullable string... with `= null`. But in this case, we *do* need
to keep `type: 'text'`. When Doctrine sees the `string` type, it *guesses*
`type:  'string'`... which holds a maximum of 255 characters. Since this field
holds a *lot* of text, override the guess with `type: 'text'`.

## Initialize string Field to null or ''?

By the way, some of you might be wondering why I don't use `$content = ''`
instead. Heck, then we could remove the nullable `?` on the type! That's a good
question! The reason is that this field is required in the database. If we initialize
the property to empty quotes... and I had a bug in my code where I *forgot* to set
the `$content` property, it would *successfully* save to the database with content
set to an empty string. By initializing it to `null`, if we forget to set this
field, it will *explode* before it enters the database. Then, we can fix that
bug... instead of it just silently saving the empty string. It may be sneaky, but
we're *sneakier*.

Okay, let's keep going! A lot of this will be busy work... so let's move as quickly
as we can. Add the type to `username`... and remove the Doctrine `type` option.
We can also delete `length`... since the default has always been `255`. The `$votes`
property looks good, but we can get rid of `type: 'integer'`. And down here
for `$status`, this already has the type, so delete `type: 'string'`. But we *do*
need to keep the `length` if we want it to be shorter than 255.

Moving on to the `Question` entity. Give `$id` the type... remove its `type` Doctrine
option, update `$name`... delete *all* of its options.... and repeat this for `$slug`.
Notice that `$slug` still uses an annotation from `@Gedmo\Slug`. We'll fix that
in a minute.

Update `$question`... then `$askedAt`. This is a `type: 'datetime'`, so that's
going to hold a `?\DateTime` instance. I'll also initialize it to null. Oh, and
I forgot to do it, but we *could* now remove `type: 'datetime'`.

## Typing Collection Properties

And now we're back to the `OneToMany` relationship. If you look down, this is
initialized in the constructor to an `ArrayCollection`. So you might think we should
use `ArrayCollection` for the type. But instead, say `Collection`.

That's an interface from Doctrine that `ArrayCollection` implements. We need to
use `Collection` here because, when we *query* for a `Question` from the database
and then fetch the `$answers` property, Doctrine will set that to a *different*
object: a `PersistentCollection`. So this property might be an `ArrayCollection`,
*or* a `PersistentCollection`... but in all cases, it will implement this
`Collection` interface. And this does *not* need to be nullable because it's
initialized *inside* the constructor. Do the same thing for `$questionTags`.

Believe it our not, we're in the home stretch! In `QuestionTag`... make our
usual `$id` changes... then head down to `$taggedAt`. This is a `datetime_immutable`
type, so use `\DateTimeImmutable`. Notice that I did *not* make this nullable
and I'm not *initializing* it to null. That's simply because we're setting this
in the constructor. So we're guaranteed that it will *always* hold a
`\DateTimeImmutable` instance: it will never be null.

Ok, now to `Tag`. Do our usual `$id` dance. But wait... back in `QuestionTag`, I
forgot to remove the `type: 'integer'`. It doesn't hurt anything... it's just
not needed. And... same for `type: 'datetime_immutable`.

Back over in `Tag`, let's keep going with the `$name` property... this is all normal...
then jump to our *last* class: `User`. I'll speed through the boring changes
to `$id` and `$email`... and `$password`. Let's also remove the `@var` PHP Doc
above this: that's now totally redundant. Do that same thing for `$plainPassword`.
Heck, this `@var` wasn't even right - it should have been `string|null`!

Let's zoom through the last changes: `$firstName`, add `Collection` to
`$questions`... and no `type` needed for `$isVerified`.

And... we're done! This *was* a chore. But going forward, using property types
will mean tighter code... and less Doctrine config.

But... let's see if we messed anything up. Run `doctrine:schema:update` one
last time:

```terminal-silent
symfony console doctrine:schema:update --dump-sql
```

It's clean! We changed a ton of config, but that didn't actually change how
any of our entities are mapped. Mission accomplished.

## Updating Gedmo\\Slug Annotation

Oh, and as promised, there's one last annotation that we need to change: it's
in the `Question` entity above the `$slug` field. This comes from the Doctrine
extensions library. Rector didn't update it... but it's super easy. As long as you
have Doctrine Extensions 3.6 or higher, you can use this as an attribute. So
`#[Gedmo\Slug()]` with a `fields` option that we need to set to an array. The cool
thing about PHP attributes are... they're just PHP code! So writing an array in
attributes... is the same as writing an array in PHP. Inside, pass `'name'`...
using single quotes, just like we usually do in PHP.

Ok team: we just took our codebase a *huge* step forward. Next, let's dial
in on these remaining deprecations and work on squashing them. We're going to start
with the elephant in the room: converting to the new security system. But
don't worry! It's easier than you might think!
