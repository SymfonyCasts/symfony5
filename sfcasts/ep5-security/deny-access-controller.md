# Denying Access in a Controller

I like using access control in `security.yaml` to help me protect entire sections
of my site... like everything under `/admin` requires some role:

[[[ code('c56f5732f9') ]]]

But most of the time, I protect my site on a controller-by-controller basis.

Open `QuestionController` and find the `new()` action:

[[[ code('4f40a84be6') ]]]

This... obviously... is not a *real* page... but we're *totally* going to finish
it someday... probably.

Let's pretend that this page *does* work and *anyone* on our site should be
allowed to ask new questions... but you *do* need to be logged in to load
this page. To enforce that, in the controller - on the first line - let's
`$this->denyAccessUnlessGranted('ROLE_USER')`:

[[[ code('ac4b1fce3b') ]]]

So if the user does *not* have `ROLE_USER` - which is only possible if you're *not*
logged in - then deny access. Yup, denying access in a controller is just that easy.

Let's log out... then go to that page: `/questions/new`. Beautiful! Because we're
anonymous, it redirected us to `/login`. Now let's log in - `abraca_admin@example.com`,
password `tada` and... access granted!

If we change this to `ROLE_ADMIN`... which is *not* a role that we have, we get access
denied:

[[[ code('c7427c75f4') ]]]

## The AccessDeniedException

One cool thing about the `denyAccessUnlessGranted()` method is that we're not
*returning* the value. We can just say `$this->denyAccessUnlessGranted()` and that
interrupts the controller.... meaning the code down here is *never* executed.

This works because, to deny access in Symfony, you actually throw a special
*exception* class: `AccessDeniedException`. This line *throws* that exception.

We can actually rewrite this code in a longer way... just for the sake of learning.
This one line is identical to saying: if *not* `$this->isGranted('ROLE_ADMIN')` -
`isGranted()` is *another* helper method on the base class - then throw that
special exception by saying `throw $this->createAccessDeniedException()` with:

> No access for you!

[[[ code('3975570dd2') ]]]

That does the same thing as before.... and the message you pass to the exception
is only going to be seen by *developers*. Hold `Command` or `Ctrl` to jump into
the `createAccessDeniedException()` method... you can see that it lives in
`AbstractController`. This method is *so* beautifully boring: it creates and
returns a new `AccessDeniedException`. *This* exception is the key to denying
access, and you could throw it from *anywhere* in your code.

Close that... and then go refresh. Yup, we get the same thing as before.

## Denying Access with IsGranted Annotation/Attribute

There's one other interesting way to deny access in a controller... and it works
if you have `sensio/framework-extra-bundle` installed, which we do. Instead of writing
your security rules in PHP, you can write them as PHP annotations or attributes.
Check it out: above the controller, say `@IsGranted()` - I'll hit tab to autocomplete
that so I get the `use` statement - then `"ROLE_ADMIN"`:

[[[ code('23b430be9b') ]]]

If we try this... access denied! We as developers see a slightly different error
message, but the end user would see the same 403 error page. Oh, and if you're
using PHP 8, you *can* use `IsGranted` as a PHP attribute instead of an annotation:

```php
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class QuestionController extends AbstractController
{
    // ...
    /**
     * ...
     */
    #[IsGranted("ROLE_ADMIN")]
    public function new()
    {
        return new Response('Sounds like a GREAT feature for V2!');
    }
    // ...
}
```

## Denying Access to an Entire Controller Class

One of the *coolest* things about the `IsGranted` annotation or attribute is
that you can use it up on the controller *class*. So above `QuestionController`,
add `@IsGranted("ROLE_ADMIN")`:

```php
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * @IsGranted("ROLE_ADMIN")
 */
class QuestionController extends AbstractController
{
    // ...
    public function new()
    {
        return new Response('Sounds like a GREAT feature for V2!');
    }
    // ...
}
```

Suddenly, `ROLE_ADMIN` will be required to execute *any* controller in this
file. I *won't* do this... because then only admin users could access my homepage,
but it's a great feature.

Ok, back down in `new()`, let's change this to `ROLE_USER`... so that the
page kind of works again:

[[[ code('9f7991fe97') ]]]

Right now, every user has *just* `ROLE_USER`. So next: let's start adding extra roles
to some users in the database to differentiate between normal users and admins.
We'll also learn how to check authorization rules in Twig so that we can conditionally
render links - like "log in" or "log out" - in the right situation.
