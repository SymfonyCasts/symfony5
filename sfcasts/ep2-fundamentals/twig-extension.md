# Twig Extension

Coming soon...

When we installed the `KnpMarkdownBundle` earlier, it gave us a new service in our
container that helped us parse markdown. But also if you look at 
`templates/question/show.html.twig` down here where we print out the answers. That
bundle also gave us a service that provided a custom twig filter. We could suddenly
say `{{ answer|markdown }}` and that would trans lay that into markdown. That's how
we're getting this behavior down here. The only problem is that if you remember, and
we created our own `MarkdownHelper` that uses that markdown parser service but also
caches it. So the problem is that when we use this `markdown` filter inside of twig and
that's using the markdown parser directly from the bundle and it's skipping our cache
layer, what we really want to do is have a custom filter like this, but when we use
it, it actually calls our `MarkdownHelper` service so that we can take advantage of
our caching. So let's take this a piece at a time. The first thing we need to do is
we need to figure out how we can add custom functions or filters to TWIG. You do
that by creating a class. It's actually a service called eight Twig Extension and
`MakerBundle` can help generate that for us. So if I spend over or I'd 

```terminal
php bin/console make:
```

to get my whole list and perfect, you can see there's a `make:twig-extension`
So let's say

```terminal
php bin/console make:twig-extension
```

they'll ask us for the name of the class, we can call it anything. Let's call it
`MarkdownExtension` and that's it. Created a new `src/Twig/MarkdownExtension.php`
file. So let's go check that out.

Cool. Just like last time, just like last time with our command, twig is instantly
aware of this extension. And right now what it actually does it as a custom filter
called `filter_name` and a custom function called `function_name`. And the idea is that
if somebody used this filter, then twig would actually call the `doSomething` method
down here and we would return some value to we instill and tweak is actually already
using this. Uh, it's already aware of this class. I can prove it by going over to my
terminal and running
 
```terminal
php bin/console debug:twig
``` 
 
And if we search up here

for `filter_name`, that's the name of our filter there it is `filter_name`. And the
reason that tweak is already aware of this class is not because it lives in a `Twig/`
directory. We could call this anything. It's once again, thanks to that little auto
configure feature. So when Symfony looks at this service and notices that it extends
the twig `AbstractExtension` and it says, Oh, you must want this to be a twig
extension. So I'll tell twig about your service. It's a long way of saying that all
we needed to do is create this last and everything works. So let's start customizing
it. Let's create a new filter called

`parse_markdown` music, a different name than markdown here just so they don't collide
with each other. And when somebody uses that filter, it should call a new `parseMarkdown()`
markdown method that we'll add on this class. And the way that they `getFunctions()`
method. We don't need that because we don't. We need to create a new functions and
then we'll call this public function `parseMarkdown()`. And for now, let's just return
test. All right, let's try it and `show.html.twig`. I'll change this to you to
use `parse_markdown`. All right, flip over, refresh, and it works. Our, our twig
extension is alive. Okay, so now let's make it use our `MarkdownHelper`. So once
again, we're in a familiar spot. We're inside of a service because this is a service.
It's a class that does work. We're instead of a service and we need access to another
service. We need access to this `MarkdownHelper`. How did we do it the same way as
always, we create a public function, `__construct()`. And then we
auto wire that in by saying `MarkdownHelper $markdownHelper`. I'll hit escape to
unselect that and then go to All + Enter

and go to "Initialize properties" to create that property and set it down below. Down
here. Couldn't be simpler. Now we can say, return `$this->markdownHelper->parse()`
and pass it `$value`.

That is a beautiful example of how organizing things into services allows you to
reuse them effortlessly, so let's try it. Whoever refresh and, Oh that doesn't quite
look right, it's working. You can see the code here but it's output escaping it.
Remember by default when you rendered things in twig it outputs, escapes out, escapes
them so we could add a `|raw` here earlier to `|raw` here to tell not to do that,
but there's also a way in twig did say that this filter itself is safe and should not
be escaped and the way you do that is actually shows us up here in the examples is we
can add a little option.

I will. Third argument which is going to be `'is_safe' => ['html']`. This basically says it's
safe to print this out in HTML without output escaping, so back refresh and it works.
People, friends, congratulations on making it through the Symfony fundamental scores.
This really is going to unlock your potential. Everything you're going to do from
here on in Symfony is going to be related to services, configuration, auto wiring.
You're going to really have a leg up on taking on any feature that you need to build
or using any part of Symfony. So join us in the next course where we are going to
really take this at a site up to the next level by introducing a database layer and
pulling things to the database. Our friends, if you have any questions, we're always
here for you in the comments. Let us know. See you next time.

