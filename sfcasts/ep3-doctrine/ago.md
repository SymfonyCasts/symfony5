# Ago

Coming soon...

All right. Let's print this date, make that dynamic, the `$askedAt` date. So this should
be simple enough. Um, one thing to remember is that the `$askedAt` is actually nullable. It
was true. It's it's not going to be set on all questions because some questions might
not be published yet. So I want to make sure that we account for that. So obviously
say `{% if question.askedAt %}` that and that'll put an `{% else %}` and, and, `{% endif %}`, if it's
actually not published, so I'll do that one first. I'm just going to say unpublished,
and I'm probably in a VR eventually in a real app, we wouldn't let users see on
published questions, but maybe a user can see their own unpublished question. So if
they ever did that, we want to show on published here. Now to print the question. The
easiest thing to do is just to say curly curly `question.askedAt` that a lot of
you're probably going to say, Hey, Ryan, sorry, that's not going to work.

And you are right. Object of class. Date time could not be converted to string
because we know that when we have a `datetime` type in doctrine, it's stored in your
code is a `DateTime` object, which is really nice. Cause daytime objects are great to
work with, but it also means we can't just run around and print them. So to fix this,
we can say `|date()` and the types of the `date()` filter. And then we can give it a
format like `Y-m-d H:i:s`which, which I have memorized because I have been
programming for so long that gives us this format here, which is technically correct,
but not terribly friendly. So whenever I deal with dates, one of the things I like to
do is make them relative. I like to print strings that say things like asked 10
minutes ago, things like that.

So let's go back here. And actually the first thing I want to do is actually put my
asked, asked back, here we go. And now I want to convert this into that nice string.
Um, now there's not the functionality in Symfony to do that, but there is a really
small bundle that we can install. I can do this. I'm going to say a 

```terminal
composer require knplabs/knp-time-bundle
```

What'd you could find if you Google Symfony
ago. No, as we know when we install bundles, the main thing that Bumble's give us
our services. And in this case, the button gives us one main service that provides a
twig filter, a tweak filter called `ago`. So it's pretty awesome. We can now pop
over here and say `|ago`. And that's it. And I refresh now it works asked one
month ago. Awesome. So that's a great little thing to put into your site, and then
you don't even have to worry about you. Don't have to worry about time zones. Next.
Let's add more queries to our site for the homepage.

