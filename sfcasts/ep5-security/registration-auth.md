# Registration Form

Let's add a registration form to our site. There's a funny thing about registration
forms: they have basically nothing to do with security! Think about it: the point
of a registration form is just to insert new users into the database. So creating
a registration form is *really* not any different than creating a form to insert *any*
data into your database.

And to make things *even* simpler, we're going to cheat... by generating code. Find
your terminal and run:

```terminal
symfony console make:registration-form
```

Ooh! This gives us an error! It says:

> Missing packages: run `composer require form validator`

In this Symfony 5 series, we haven't talked about the Form component. And that's
in part because it hasn't changed much since our
[Symfony 4](https://symfonycasts.com/screencast/symfony4-forms) tutorial. We're
not going to go into too much detail about it right now, but we *do* need it to
run this command. So let's install both packages:

```terminal
composer require form validator
```

Awesome. When that finishes, run:

```terminal
symfony console make:registration-form
```

again. Cool! So the first question asks:

> Do we want to add a `@UniqueEntity` validation annotation to our `User` class
> to make sure duplicate accounts aren't created.

You almost *definitely* want to say "Yes" so that the user gets a validation error if they
enter an email that's already taken.

Next:

> Do you want to send an email to verify the user's email address after registration?

We're going to add this later, but I want to do it manually. So say "No".

> Do you want to automatically authenticate the user after registration?

That sounds awesome, but say "No", because we're *also* going to do that manually.
I know, I'm making us work! The last question is:

> What route should the user be redirected to after registration?

Let's just use our homepage route. So that's number 16 for me. And... done!

## Checking out the Generated Code

This command just gave us a `RegistrationController`, a form type, and a template
that renders that form. Let's... go check that stuff out!

Start with the controller: `src/Controller/RegistrationController.php`:

[[[ code('80844ba36b') ]]]

Again, we're not going to talk much about the Form component. But, on a high level,
this controller creates a `User` object and then, on submit, it hashes the plain password
that was submitted and then saves the `User`. This is exactly the same thing
that we're doing in our fixtures to create users: there's nothing special about
this at all.

## Fixing the Form Styling

So... let's see what this looks like! Head over to `/register` to see... the world's
ugliest form! We... can do better. The template for this page is
`registration/register.html.twig`. Open that up:

[[[ code('4990e01f5d') ]]]

and... I'm just going to add a couple of divs to give this more structure. Awesome...
then indent all of this form stuff to be inside of those... and then we just need
3 closing divs on the bottom:

[[[ code('68fb0e02f8') ]]]

Cool. That doesn't really fix the form... but at least our ugly form sort of
appear in the center of the page. Oh, but let me fix my typo on the `mt-4`. And...
yea, that looks better.

To fix the form itself, we can tell Symfony to output the form with markup that's
Bootstrap 5-friendly. This is... kind of a topic for the form tutorial, but it's
easy. Go to `config/packages/twig.yaml`. Here, add an option called `form_themes`
with one new item: `boostrap_5_layout.html.twig`:

[[[ code('60a8a4fc2c') ]]]

Try it now and... woh! That made a *huge* difference! Oh, but let me add one
more class to that registration button... so that it's not invisible: `btn-primary`:

[[[ code('7d6f30ca9a') ]]]

Cool.

And while we're making things look and work nicely, we can finally make the
"Sign up" button.. actually go somewhere. In `base.html.twig`, search for
"Sign up" - here it is - set the `href` to `path()` and target the new route, which...
if we look... is called `app_register`:

[[[ code('c9412b5ca4') ]]]

So `path('app_register')`:

[[[ code('a121687c21') ]]]

Beautiful!

This *would* now work if we tried it. *But*, before we do, I want to add one other
feature to this. After successfully submitting the registration form, I want to
automatically authenticate the user. Is that possible? Of course! Let's do it next.
