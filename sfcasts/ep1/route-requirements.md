# Routing Requirements

Coming soon...

the profiler for that specific Ajax requests. You have all the same information that
you're normally used to having, but for your actual, for the Ajax request, that is
one of the killer features. No, of course. When inside of my JavaScript value and
notice that I chose to make a post request to this end point. And that makes sense
because this end point eventually is actually going to be changing something in the
database. So we don't want a best practice that we don't allow people to make a get
requests to it. We want to make a post request to it, but technically speaking we can
still just make a get request. I guess just to put it in my browser if I want to,
Hey, I'm voting.

So to fix that I'm gonna go on a `CommentController` and one of the things you can do
here is say that this should only match one specific method. So to do that I'm going
to add `methods=` , and you can put an array here, a multiple methods, but I'm
just going to say double quote `"POST"`. And as soon as you do that through refresh over
here, this now gets a four for no route found because only the post methods is
matched. And actually a cool way to see that. Another way is to run a

```terminal
php bin/console router:match /comments/10/vote/up
```
What you can do here is I'm going to go and copy the URL to my
Ajax end point. You can give this a URL and it will tell you which route in the
system it matches. You can see that it almost matched this common boat route, but
this was a get request and it doesn't match the post.

If you want to do a, you can also pass gas as medicals post if you want to say what
would match my post request

```terminal-silent
php bin/console router:match /comments/10/vote/up --method=POST
```

and boom,  it shows you which route matched. And um, and
of course this tells you like which controller, uh, that route points to. So that's
really cool. The other little thing that's not quite right here is the direction
we're expecting it to be up or down. But technically somebody could put a banana
right there. In fact, let's go over here and change this to banana

```terminal-silent
php bin/console router:match /comments/10/vote/banana --method=POST
```

and it matches a
route. It's not the end of the world, it's just going to downvote it automatically,
but it's not really as good as it should be. So normally these wildcards match
anything. But if you want, you can make them a little bit more specific. The way you
do that is by doing inside the curly race.

After the name, you say open `<>` instead of here, you can put a
regular expression that you want this to match. So in our case, we can say `up|down`
literally up or down. Now let me go over and refresh.

```terminal-silent
php bin/console router:match /comments/10/vote/banana --method=POST
```

It doesn't match because
banana does not match up or down. But if we change this to up, it matches. Another
common one you'll see here is, um, we can use it. Fry ID is `<\d+>` means match a
digit of any length. I'm actually not going to put that here, even if my ID is an
integer. In reality, if somebody did put banana, eventually, it's just going to fail
to find that in the database and it's not going to cause a problem anyways, so don't
really need that level of specificity. All right, next let's get a preview into, and
let's spin over and close this. Just refresh the page and double check. This still
works and it does. So next, let's get a sneak peek into the most fundamental part of
Symfony services.

