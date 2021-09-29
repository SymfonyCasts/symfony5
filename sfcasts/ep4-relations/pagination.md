# Pagination

Coming soon...

What's that one more features to our site that that's specific the doctrine, a page
Nadir. So right now on our homepage, we are rendering every question on the site and
that's not very realistic. Let's instead render 10 on each page with some page nation
links. Now, page nation doesn't have com core with Dr. Murray Symfony, but there are
two great libraries to help with this. Actually it does come home with doctrine can
be page Nader in page your content. Both of these are really good. And I have a hard
time choosing between them since in our Symfony for tutorial, I covered K and P page
here. So in this tutorial, I'll cover page or Fanta search for pagerfanta bundle.
And you'll find that they get a page under the BabDev, uh, organization. If you
scroll down a little bit, you can find a link to their website with their
documentation. Now, this is Pedro font, hold button, pager font hub bundle, which is
a wrapper around a pager font howl library that contains most of the functionality.
So the documentation is kind of split between the bundle and the actual library. So
I'm going to open the documentation for the library over in another tab. All right.
So let's get those installed, uh, click installation. All I need is copy of the
composer require line, spin over our terminal and install it

```terminal
composer require babdev/pagerfanta-bundle
```

Perfect. And here and 

```terminal
git status
```

You can see all I did was the composer file and it
just enabled the bundle automatically. All right. So the controller for the home page
on our site is `src/Controller/QuestionController::homepage()` action. Right now we're
calling this custom repository method, which is returning an array of question
objects. So the big difference when you use a page Nader is that we will no longer
make the execute the query directly. Our job is going to be to create a query
builder, and then pass that to the page Nader that will then allow the page data to
figure out what page you're on and add the limit and offset to the query for you. In
other words we need to do is instead of returning an array of question objects, we're
now going to return a query builder. Since I'm only using this in one place, I am
free to change this method. Let's rename it to

`createAskedOrderedByNewestQueryBuilder()`. It will return a `QueryBuilder`. And then
down here, all I need to do is get rid of, to `getQuery()` and `getResult()`. Now over in
our controller, this is not going to be a `$questions` anymore. This is now going to be
and `$queryBuilder = $repository->createAskedOrderedByNewestQueryBuilder()`. Beautiful.
Okay. Our next step is to create a `Pagerfanta` object. You can see the under
rendering pager Fontus. So then this is fairly simple. We created this new page or
fond to object, and because we're using doctrine or M because what we want a page
name is a doctrine or I'm query. We create this new `QueryAdapter` and pass our 
`$queryBuilder` in. So this is so let's say `$pagerfanta = new Pagerfanta()`. Perfect. And
inside of here, I'll say `new QueryAdapter()`. Oh my project. Isn't finding a query
adapter. So this is kind of a weird, but also really cool thing about the pager Fanta
library. If you go back over to the library down here and click page nation adapters,
this Pedro Pedro Fanta actually works with [inaudible] lots of different things.

I'll actually click down to available adapters. So for example, if you want to
actually, uh, page a relationship property, you can use something called their
collection adapter. If you are using the doctrine D ball, which is the, uh, kind of a
lower level version of the doctrine program, then you can use this single table query
adapter. Or if you're like, there's a Manuel, Manuel DB is supported, or if you're
like us using the doctrine ORM, then you can use the query adapter. But all of these
are actually installed as separate packages, which is why we don't have that class.
So I'm going to copy this package name here, run over and say 

```terminal
composer require pagerfanta/doctrine-orm-adapter
```

Now over here, once it indexes, I can say new 
`QueryAdapter`, perfect. And pass it my `$queryBuilder`. And then on this page and find the
object. You can configure a few things like, for example, I'll say `->setMaxPerPage(5)`
just so page nation is really obvious. And then now here, we're not passing
`questions` anymore into the tempo. We're actually going to pass the us past a `pager`
variable set to `pagerfanta`

Alright, so let's pop into the homepage template here and scroll up. So the is
property was used right here. We're looping over it. That makes sense. Questions used
to be an array of question objects. Now we're passing in a pager object. So there's
the cool thing about that pager object. You can to get the results from it. You can
just loop over it. So literally all we need to do is hear, say for question in pager
at the moment we do that, it's going to execute the query. It needs to get the exact
results that we want for that page. All right. So let's go back to the home page. You
can see right now we have lots of questions. If we refresh now 1, 2, 3, 4, 5. Yes, we
got it. Only five items on this page. It works and check out the query down here. If
we open it up and say view formatted query, this is pretty nuts. Remember we have a
pretty complicated query on this page. It actually takes our con complicated query,
wraps it in a different query. And what it's doing here is trying to actually, um,
Get all the IDs

From the first page So we can have super complex queries and the page and enter still
works. All right. So what about page nation links? Like how do we get to page to
Page? Avanti makes that pretty easy. Let's scroll down and see right after the end
for, we can render it by saying curly curly `pagerfant()` and a facet. `pager` says,
page your content comes from the library. So spend over well it's sort of does he
spent over a, you actually had an unknown `pagerfanta()` function. This is a another
thing that's kind of a plug-in to the library.

So if you click back to their docs and go to Installation and set up, it actually
lists a whole bunch of different adapters on here. And it's also a special package.
If you want twigs support for pager Fanta. So copy that spin over one, saw one more
package. 

```terminal
composer require pagerfanta/twig
```

All right, so now we're gonna spend over reinforced that page. It works and got its
those links are super ugly. We'll fix that in a second, but if you hover over them
and you can see, it goes to each one, adds a different question. `?page=` and
there's four page pages because we have 20 results. So this isn't an automatically
update to have a correct number of pages based on how many results you actually have
and how many you're showing per page. So let's go to page two and Hmm, I think this
is actually the same results as page one. And if I look down here, even though you
see question on page two, Pedro font is still highlights. Page one, is it? That's the
page we're on that's because page Fanta actually doesn't know what page we're on. We
need to help it by reading this query primer and passing it in. This is a fairly
simple thing to recreate, to read the query parameter only the request object. So
I'll add a `$request` argument type PennDOT with `Request` class from HTTPfoundation, And
then down here, say `$pagerfanta->setCurrentPage()`, and then `$request->query->get('page', 1)`
arrow, get page and no pass one as a second argument, that'd be the default value. If
there is no query power. Now one word of warning. At the time of recording, you can't
switch these two lines. You need to set the max for page. Then the current page, if
you swap them something weird happens. It's a known bug and it may get fixed, but to
be safe, put it in these, in this order.

All right, so now I wanna refresh beautiful. It sees that we're on page two. Let's
see, this is the results for this page two. If we go to page three bads in different
set of results, we've got a page for beautiful. All right. So let's talk about making
this prettier. You can totally customize how these page nation links look as much as
you want, but there are also several built in, uh, sort of themes for them, including
one for a bootstrap five. So to configure the bundle,

If you go to the fall configuration, you can see there's something called the fault
of view. We can change this to Twitter, bootstrap five. Now when we install the
bundle, it didn't create a configuration file for us. That's fine. That's just
because the bundle author chose, uh, chose not to ship one. That's fine. We just can
create one ourselves. So I'm gonna copy of this key men, go to `config/packages/` and
create a new file called they ever `babdev_pagerfanta.yaml`. Yeah.
Now technically this file could be called whatever you want. And the name of the file
doesn't matter, but this is obviously good choice under here will say `default_view:`.
And we'll say `twitter_bootstrap5`. If you've dug into the documentation, you'd
find that this is one of the themes they have available. All right. When we refresh
now. Oh, interesting. I did not see that It's been over here Manually clear our cache

```terminal-silent
php bin/console cache:clear
```


just in case it's possible that it's not noticing my new config file now I refresh
there it is. Yeah. So I rare a little bogging Symfonys cache there where it didn't
see that new file that looks much better

And we could still customize the CSS, how that looks. What if I didn't want to use
query parameters up here? What if I, instead of wanting to have something like
literally, you know, `/2` instead of questions on our page, we can
totally do that. We are in control. So over in question controller here, I'm going to
add a new class curly brace `/{page}`. Now I need to be very careful because this is a
wild card. And if there's any URLs below this that are just /one thing, it could
interact, uh, run into them so far. I don't have any.

So just be careful with that, but to make it even a little bit, uh, tighter, I'm
going to say less than greater than inside of your `\d+` . So that means it's
only going to match a route where it's /and then this is a digit of any length. This
is a regular expression. So it's gonna be a page wildcard. But if I go to /foo, it
won't match this route. And then down here, I'll give this an `int $page` argument. I'll
default it to 1 so that the, you know, allow the user just to go to /and old pass
one. And for the page argument now down here and said the request object, we can just
pass in page. And in fact, we don't even need the request object anymore.

All right. So we tried that for refresh. Now it's actually going to jump from page to
page one because it does not renew this query parameter anymore, but now I can click
page two. Yes, it's /two. Page three is /three. Alright, team. Congratulations on
finishing both doctrine courses. It's one of the most important parts of Symfony and
also one of the ones that makes you the most powerful. It's probably going to, it's
going to unlock you lots of stuff. So as usual, let us know what you're building down
in the comments. If you have any questions we're here for you and let us know what
other content you want to see.

