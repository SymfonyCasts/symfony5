# Form Improvements for Symfony 6

Let's explore some new features! There are *tons* of them, and we've already
seen a bunch. I don't have time to show *everything* but *fortunately*, I don't
need to! If you go to https://symfony.com/blog, the new stuff is *really*
well-documented. Click on "Living on the Edge". Here, you can see blog posts that
are categorized by each version. This is a collection of blog posts about what's
new in Symfony 5.1, like the new security system. And... here are posts about
what's new in Symfony 5.3, *or* 5.4 through 6.0. So if you want to go deeper and
see *all* the new stuff, it's been *beautifully* documented in these posts.

The new features *I* want to show right now have to do with the form component.

## Form Field Sorting

Since Symfony 5.3, we have a nice new feature called Form Field Sorting. If you go
to the registration page, this renders four fields. Let's open the template for that:
`templates/registration/register.html.twig`. I'm rendering all the fields by hand.
Let's *replace* this with the very lazy `{{ form_widget(registrationForm) }}`...
which just dumps out all of the fields in whatever order they're added.

[[[ code('a50b830724') ]]]

Unfortunately... now the form... looks *weird*. To fix this, open the form type
class for this, which is `src/Form/RegistrationFormType.php`. Every single
field now has an option called `priority`. Let's add that.

Starting with `firstName`, pass `null` for the type so Symfony keeps guessing. Then,
set `priority` to `4`, because I want this to be the first field. `email` should
be the second field, so pass `null` again and set its `priority` to `3`. Then give
`plainPassword` a `priority` of `2`... and finally set `agreeTerms` to `priority`
`1`.

[[[ code('1faae474c8') ]]]

And now... it looks great! So if you want to lazily render your fields, you can do
that... and not have to worry about them being in a strange order.

## Hello renderForm()

While we're on the topic of forms, open up the controller for this page:
`src/Controller/RegistrationController.php`. In Symfony 5.3, when you render a
template and pass in a form, there's a new shortcut! Instead of `render()` say
`renderForm()`. The only other difference is that you get to *remove* the
`->createView()` call.

[[[ code('fcdc601d94') ]]]

That's it! this `renderForm()` method is *just like* `render()`. It *still*
renders this template, and it *still* passes any of these variables *into* the
template. But if any of the variables we're passing are a "form" object, it calls
the `createView()` method *for* us... which is nice!

This also makes one other change, which isn't very noticeable. If you have a
validation error, your controller will now return a response with its status code
set to 422. But that won't look any different in your browser. If I submit a password
that's too short, it all looks the same... though the status code *is* now 422.

Symfony made this change for two reasons. First... it's just technically more correct
to have an *error* status code if there is a validation error. And second, if you're
using Turbo, this is needed so that Turbo knows that your form validation failed.
You get that for free just by using the new shortcut method.

Next, Symfony comes with some nice and *optional* Docker integration for local
development. Some parts of this integration have recently changed. Let's see how
we can use Docker to get a cool email catching system added to our app that will
help us *test* emails.
