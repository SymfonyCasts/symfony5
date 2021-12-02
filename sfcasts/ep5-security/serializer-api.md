# User API & the Serializer

Most of our pages so far have been normal HTML pages. So let's create a pure API
endpoint that returns JSON data about the currently-authenticated user.
This might be an endpoint that we call from our own JavaScript... or maybe you're
creating an API for someone *else* to consume. More on that later.

Let's create a new controller for this called `UserController`... and make it extend
our `BaseController` class:

[[[ code('86930fcdb0') ]]]

Inside, add a method called `apiMe()`. Give this an `@Route()` - autocomplete the one
from the Symfony Component - and set the URL to `/api/me`:

[[[ code('a982ace648') ]]]

This isn't a very *restful* endpoint, but it's often a *convenient* one to have.
To require authentication to use this endpoint, add
`@IsGranted("IS_AUTHENTICATED_REMEMBERED")`:

[[[ code('b17ba3ad0f') ]]]

I'm using a mixture of annotations and PHP code to deny access in this project.
Choose whichever one you like better for *your* app. Inside the method, we can just
say: return `$this->json()` and pass it the current user: `$this->getUser()`:

[[[ code('d69eb8320b') ]]]

That's beautiful! Let's try it. We *are* logged in right now... so we can go to
`/api/me` and see... absolutely nothing! Just empty braces!

By default, when you call `$this->json()`, it passes the data to Symfony's
`JsonResponse` class. And then *that* class calls PHP's `json_encode()` function
on our `User` object. In PHP, unless you do extra work, when you pass an object to
`json_encode()`, all it does is include the *public* properties. Since our `User`
class doesn't *have* any public properties:

[[[ code('c42669d2d8') ]]]

We get a boring response back.

## Leveraging the Serializer

This... isn't good enough. So instead, let's leverage Symfony's serializer component.
To get it installed, at your terminal, run:

```terminal
composer require "serializer:1.0.4"
```

This installs the serializer pack, which includes Symfony's Serializer component
as well as a few other libraries that help it work in a really smart way. But it
doesn't have a recipe that does anything fancy: it just installs code.

One of the cool things about using `$this->json()` is that as soon as the Symfony
serializer is installed, it will automatically start using *it* to serialize the data
instead of the normal `json_encode()`. In other words, when we refresh the endpoint,
it works!

## Adding Serialization Groups

We're not going to talk too much about how the Symfony serializer works - we talk
a lot about it in our API Platform tutorials. But let's at least get some basics.

By default, the serializer will serialize any public property or any property that
has a "getter" on it. Heck, it will even serialize `displayName` - which is *not*
a real property - because there is a `getDisplayName()` method.

In reality... this is too much info to include in the endpoint. So let's take
more control. We can do this by telling the serializer to only serialize
fields that are in a specific *group*. Pass 200 for the status code, an empty
headers array - both of which are the default values - so that we can get
to the fourth `$context` argument:

[[[ code('c3dd98356c') ]]]

This is sort of like "options" that you pass to the serializer. Pass one called
`groups` set to an array. I'm going to invent a group called `user:read`...
because we're "reading" from "user":

[[[ code('cb80558d0e') ]]]

Copy that group name. Now, inside the `User` entity, we need to add this group to
every field that we want to include in the API. For example, let's include `id`.
Above the property, add an annotation or PHP attribute: `@Groups()`. Make
sure you auto-complete the one from Symfony's serializer to get the `use`
statement on top. Inside, I'll paste `user:read`:

[[[ code('cac2e3d5a0') ]]]

Copy that and... let's expose `email`, we don't want to expose `roles`, yes to
`firstName` and... that's it:

[[[ code('f868f7a472') ]]]

We could also put the group above `getDisplayName()` if we wanted to include that...
or `getAvatarUri()`... actually I *will* add it there:

[[[ code('b91f60669e') ]]]

Let's try it! Refresh and... super cool! We have those 4 fields!

And notice one thing: even though this is an "API endpoint"... and our API endpoint
requires us to be logged in, we can *totally* access this... even though we don't have
a fancy API token authentication system. We have access thanks to our normal session
cookie.

So that leads us to our next question: if you have API endpoints like this, do you
need an API token authentication system or not? Let's tackle that topic next.
