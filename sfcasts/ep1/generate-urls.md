# Generate Urls

Coming soon...

Go back to the show page for a question. This logo up here right now doesn't go
anywhere. You can see it just added a little hashtag there. This really needs to link
to the homepage. This comes from our layout, so it comes from `based.html.twig` and
here it is right here. `navbar-brand`, `href=` pound sign. So we want, that's the link
to the homepage. So how did we do that? Did we just do `/` well you can, but in Symfony
and most frameworks, there's a better way we can ask Symfony to generate a route,
generate the URL to this homepage route. I'll show you how that's done in a second,
but first I want you to spin over and run 

```terminal
php bin/console debug:router
```

This is one of
the debugging commands instead of the console and it lists all of the routes in the
system. And notice since last time we ran this, we have a whole bunch of new routes.
These are routes that power the web, debug toolbar and also the profiler. So Symfony
automatically added these because we're in dev mode and it helps load the web debug
toolbar down here. What I really want to look at though is this name. I want to say
every route has an internal name including the two routes that we made so far. Have
`app_question_homepage` and `app_questions_show`. Where did that come from?

In fact, when you use route, every route must have a name, but when do you use
annotation routes? The name is optional and if you don't give you route, a name
Symfony will generate one for you automatically, which is fine until you need to link
to that page. As soon as you need to link to the homepage or the show page, you
should give the route a, an explicit name so that it's not auto-generated. I need to
remove, improve that explanation. To do that after the URL, say `name=""`
and here let's say `app_homepage`, try to keep my route names short, but by adding app
on her score in the beginning, it makes it more find-able later. If I, for example,
needed to find all of these routes in my project.

Now that I have this, if I run `debug:router` again, 

```terminal-silent
php bin/console debug:router
```

you can see I'm in control of that
route. Okay. So I'll copy that `app_homepage` and then I'm going to `base.html.twig`
When you're tweak template, the way that you can link to something is
that I was saying curly curly and then using a function called `{{ path() }}` first. Argument
of this function is the name of the route and that's it. When we go over and refresh.
Now this links to the homepage route pitiful. Well, it's also linked to the
[inaudible], uh, on the home page. We have two hard questions right now. Let's
actually turn both of these in links cause both of these right now, same thing, or
just linking to pound sign. So once again, this time we want to link to the route
above these show controllers. So once again, let's give this a name, 
`name="app_question_show"`.

And I'll copy that. And then let's go into the `templates/question/homepage.html.twig`
template. Let's see. Okay, right here below the voting. Here is the first link.
This is for the reversing a spell text right here. So once again, we're going to get
rid of the pound sign and say curly curly path, open parentheses and then paste in
`app_questions_show`. But we can't just stop there if we refresh now we get big air. It
says some mandatory parameters are missing. It's slug to generate a, you were off the
route and that makes sense. We can't just say generate a, generate the URL to this
route because that route has a wild card. So Symfony needs to know what slug do we
want to put right inside this wild card so fast that there's a second argument here.
So comma and then a new curly brace, close curly brace.

This is a lot like JavaScript. This is basically an array or a hash inside of here.
Spacing doesn't matter, but I'll say `slug` and since this is just a hard-coded article
right now, I'm just going to say `reversing-a-spell` was kind of hard coded in there.
All right, let's copy that entire thing cause there's one other link down here for
that same article and then this is the second question, but on here, and I'll paste,
change it to `pausing-a-spell` to match the name, and I'll copy that entire link and go
down to the one last spot there and paste. Obviously when we query a database, we'll
make this a bit fancier, but if you go over and refresh that works perfectly and
click reversing a spell, you can see the URL up here. Go back and hit cut, pausing a
spell, and that works perfectly as well. All right, next let's bring a little bit of
Ajax into our site and start talking about JSON responses.

