# Login Form

Coming soon...

There are a lot of ways that you could allow your users to log in like a login form
that loads users from the database, which is what we're going to build first. But
users could also log in via OAUTH sometimes called social login or authenticate via
an API key or eldap or anything else you dream up. Let's start with a log form. The
easiest way to build a log informed system is by running `symfony console make:auth`
command that will generate everything you need. But since we want to master security,
let's do this. Step-by-step mostly by hand. Before we start thinking about
authenticating the user, we first need to build a log in page, which if you think
about it has nothing to do with security. It's just a normal Symfony route controller
and template that renders a form. Let's cheat a little to make this run 

```terminal
symfony console make:controller
```

`SecurityController`
Perfect printed a class and a template. Let's go open up that new controller class
`src/Controller/SecurityController`, nothing too fancy here. Let's customize this
to be a log-in page. So I'll make the URL `/login`. Well, I'll call the name `app_login`
rename, any method to `login()`. And then for the temple, it's called
`security/login.html.twig` And right now let's not pass in any variables.
So couldn't be simpler down in the templates directory. I'll got a `template/security/`
and I'm going to right click on this and go to on the template, say refactor rename.
And I'll rename this to `login.html.twig` That's way beautiful

To get us started. I'm going to completely replace this template and Peyton paste in
a new structure. Now there is nothing fancy here or extending `base.html.twig`
them over any of the title block. And then for the main part here, we have a form
that we'll post right back to `/login`. It doesn't have an action attribute, which
means it will submit back to the same URL. Then we have two form fields, input 
`name="email"` and input `name="password"` us and a submit button. All of this has given
bootstrap 5 classes so that it looks kind of nice. Let's go at a link to this page
from `base.html.twig` So inside of here, I'll search for sign up. So I
already have a sign up button on the right. So right before that, what a drift =
curly curly `path('app_login')`, I'll say login, and then we'll give this a couple of
classes to make it look less like `nav-link` and `text-black-50`. All right, let's try
this. Refresh the home page. There's our link quick and hello. Log-in page

And of course, if I fill this out and sit and submit it, absolutely nothing happens
this summits that makes sense. This submits right back to `/login`. So the submit did
happen, but because we don't have any form processing logic yet the page just re
renders. So next let's write that processing code by creating our very first
authentic Gator and learning about Symfony firewalls.

