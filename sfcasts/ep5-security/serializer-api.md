# User API & the Serializer

Most of our pages so far have been normal HTML pages. So let's create a pure API
endpoint that returns JSON information about the currently-authenticated user.
This might be and endpoint that we call from our own JavaScript... or maybe you're
creating an API for someone *else* to consume. But more on that later.

Let's create a new controller for this called `UserController` and make it extend
our `BaseController` class. Inside, add a method called `apiMe()`. Add the
`@Route()` - autocomplete the one from the Symfony Component - and set the URL to
`/api/me`.

This isn't a very *restful* endpoint, but it's often a very *convenient* one to have.
To require authentication to use this endpoint, add
`@IsGranted("IS_AUTHENTICATED_REMEMBERED")`.

*I'm* using a mixture of annotations and PHP code to deny access in this project.
Choose whichever one you want in *your* app. Inside the method, we can just say:
return `$this->json()` And pass it the current user, which is `$this->getUser()`.

That's beautiful! Let's try it. We *are* logged in right now... so we can go to
`/api/me` and see... absolutely nothing! Just empty braces!

Ok, by default, when you call `$this->json()`, this passes the data to Symfony's
`JsonResponse` class. And then *that* class calls PHP's `json_encode()` function
on our `User` object. In PHP, unless you do extra work, when pass an object to
`json_encode()`, all it does is include the *public* properties. Since our `User`
class doesn't *have* any public properties... we get nothing back.

## Leveraging the Serializer

In a real application, this isn't good enough. So instead, we're going to rely on
Symfony's serializer component. Let's get it installed. At your terminal, run:

```terminal
composer require serializer
```

This installs the serializer pack, which include's Symfony's `serializer` component
as well as a few other libraries that help the serializer work in a really smart
way. But it doesn't have a recipe that does anything fancy: it just installs coad.

One of the cool things about using `$this->json()` is that as soon as the Symfony
serializer is installed, it will automatically start using it to serialize your data
instead of the normal `json_encode()`. In other words, when we refresh the endpoint,
it works!

## Adding Serialization Groups

We're not going to talk too much about how the Symfony serializer works - we talk
a lot about it in our API Platform tutorials - but let's at least get some basics.


By default, the serializer will serialize any public property or any property that
has a "getter" on it. Heck, it will even serialize `displayName` - which is *not*
a real property - because there is a `getDisplayName()` method.

In reality... this is too much information to include in the endpoint. So let's take
a little more control. We can do this by telling the serializer to only serialize
fields that are in a specific *group*. To do that, pass 200 for the status code,
an empty headers array - both of which are the default values - so that we can get
to the fourth `$context` option... which is sort of like options that you pass to
the serializer. Pass one in called `groups` set to an array. I'm going to invent
a group called `user:read`... because we are "reading" data from "user".

Copy that group name. Now, inside the `User` entity, we need to add this group to
every field that we want to include in the API. For example, let's include `id`.
Above the property, add an annotation or PHP attribute: `@Groups()`. Make
sure that you auto-complete the one from Symfony's serializer to get the `use`
statement on top. Inside, I'll paste `user:read`.

Copy that and... let's expose `email`, we don't want to expose `roles`, yes to
`firstName` and... that's it. We could also put the group above `getDisplayName()`
if we wanted to include that... or `getAvatarUri()`... actually I *will* add it
there.

Let's try it! Refresh and... super cool! We have those 4 fields!

And notice one thing: even though this is an "API endpoint"... and our API endpoint
requires us to be logged in, we can *totally* access this even though we don't have
a fancy API token authentication system. We have access thanks to our normal session
cookie.

So that leads us to our next question: if you have API endpoints like this, do you
need an API token authentication system or not? Let's tackle that topic next.