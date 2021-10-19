# Building a Login Form

There are a lot of ways that you could allow your users to log in, like a login form
that loads users from the database. That's what we're going to build first.

The easiest way to build a login form system is by running a
`symfony console make:auth` command. That will generate everything you need. But
since we want to *really* learn security, let's do this step-by-step... mostly by
hand.

Before we start thinking about authenticating the user, we *first* need to build
a log in page, which... if you think about it... has nothing to do with security.
It's just a normal Symfony route, controller & template that renders a form. Let's
cheat a little to build this. Run:

```terminal
symfony console make:controller
```

Answer `SecurityController`. Cool! Go open up the new controller class:
`src/Controller/SecurityController.php`. Nothing too fancy here. Let's customize
this to be a login page: set the URL to `/login`, call the route `app_login` and
rename the method to `login()`. Then, for the template, call it
`security/login.html.twig`... and let's not pass any variables right now.

Down in the `templates/` directory, open `template/security/`... and rename the
template to `login.html.twig`.

To get started, I'm going to completely replace this template and paste in
a new structure: you can copy this from the code block on this page. There's nothing
fancy here: we extend `base.html.twig`, override the `title` block... then we have
a form that submits a POST right back to `/login`. It doesn't have an `action`
attribute, which means it submits back to this same URL. Then we have two form
fields - input `name="email"` and input `name="password"` - and a submit button.
All of this has Bootstrap 5 classes to make it look nice.

Let's add a link to this page from `base.html.twig`. Search for sign up. Cool.
Right *before* this, add a link with `{{ path('app_login') }}`, say "Log In""...
and then give this a couple of classes to make it look nice.

Ok! Let's check this out! Refresh the home page... and click the link. Hello log
in page!

And of course, if we fill out the form and submit... absolutely nothing happens!
That makes sense. This submits right back to `/login`... but because we don't have
any form-processing logic yet... the page just re-renders.

So next: let's write that processing code. But... surprise! It won't live in the
controller. Time to create an authenticator and learn all about Symfony firewalls.
