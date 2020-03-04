# Smart Routes: POST-only & Validate {Wildcards}

Inside our JavaScript, we're making a POST request to the endpoint. And that
makes sense. The topic of "which HTTP method" - like GET, POST, PUT, etc -
you're *supposed* to use for an API endpoint... can get complicated. But because
our endpoint will eventually *change* something in the database, as a
best-practice, we don't want to allow people to make a `GET` request to it. Right
now, we can make a GET request by just putting the URL in our browser. Hey!
I just voted!

To tighten this up, in `CommentController`, we can make our route smarter: we can
tell it to *only* match if the method is POST. To do that add `methods="POST"`.

As *soon* as we do that, when we refresh... 404 not found! The route no longer
matches.

## The router:match Command

Another cool way to see this is at your terminal. Run:
`php bin/console router:match`. Then go copy the URL... and paste it.

```terminal-silent
php bin/console router:match /comments/10/vote/up
```

This fun command tells us which *route* matches a given URL. In this case,
*no* routes match, but it tells us that it *almost* matched the
`app_comment_commentvote` route.

To see if a `POST` request would match this route, pass `--method=POST`:

```terminal-silent
php bin/console router:match /comments/10/vote/up --method=POST
```

And... boom! It shows us the route that matched and ALL its details, including
the controller.

## Restricting what a {Wildcard} Matches

But there's something else that's not quite right with our route. We're *expecting*
that the `{direction}` part will either be `up` or `down`. But... technically,
somebody could put `banana` in the URL. In fact, let's try that: change the
direction to `banana`:

```terminal-silent
php bin/console router:match /comments/10/vote/banana --method=POST
```

Yes! We vote "banana" for this comment! This isn't the end of the world... if a
bad user tried to hack our system and did this, it would just be a down vote.
But we can make this better.

As you know, *normally* a wildcard matches *anything*. However, if you want, you
can control that with a regular expression. Inside the `{}`, but after the name,
add `<>`. Inside, say `up|down`.

*Now* try the `router:match` command:

```terminal-silent
php bin/console router:match /comments/10/vote/banana --method=POST
```

Yes! It does *not* match because `banana` is not up or down. If we change this
to `up`, it works:

```terminal-silent
php bin/console router:match /comments/10/vote/up --method=POST
```

## Making id Only Match an Integer?

By the way, you might be tempted to *also* make the `{id}` wildcard smarter.
Assuming we're using auto-increment database ids, we know that `id` should be
an integer. To make this route only match if the `id` part is a number, you an add
`<\d+>`, which means: match a "digit" of any length.

But... I'm actually *not* going to put that here. Why? Eventually, we're going to
use `$id` to query the database. If somebody puts `banana` here, who cares? The
query won't find any comment with an id of `banana` and we will add some code to
return a 404 page. Even if somebody tries an SQL injection attack, as you'll learn
later in our database tutorial, it will *still* be ok, because the database layer
protects against this.

Let's make sure everything still works. I'll close one browser tab and refresh the
show page. Yea! Voting still looks good.

Next, let's get a sneak peek into the most *fundamental* part of Symfony: services.
