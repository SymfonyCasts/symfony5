# Annotations to Attributes

Coming soon...

Now that we're on PHP eight, let's convert our PHP annotations to more hipster PHP,
eight attributes, refactoring, annotations to attributes is basically just busy work.
If you want, you can do it by hand attributes and annotations work exactly the same
way You use the same classes. And then the syntax is just a little bit different
where you use colons To separate the arguments, because this is using PHP named
arguments, But let's not do that by hand. This is other spot where rector can help
us. If you search for rector annotations to attributes, you'll find a blog post that
tells you The exact import stuff, imports, configuration that you need in rector.PHP.
So let's copy these three things Before I put those in Let's set over in, Add
everything and then I'll commit. Perfect. All right. Back over in rector.PHP, I'll
replace our one line with these four lines, uh, except we don't need the Netty set
list and we'll need a couple of extra use statements. I'll retype the T and doctrine
set list, hit tab and do the same thing on Sensio labs set list. Perfect. So, so
upgrade doctrine, annotations to attributes, simply annotations to attributes. Those
are things like, uh, routes and serialization groups. And also since labs,
annotations to attributes, which are things like, um, I is granted, uh, security
attribute,

All right, you know the drill. Now you run vendor, then rector process source. Let's
see what happens. Whoa, this is awesome. Look, beautifully refactored this annotation
to an attribute and it did this all over the place. We have routes somewhere up here,
there we go. I'll find all of the entity annotations. This is our answer entity.
These have all been converted to attributes. So that was a ton of work. That, that
thing just did automatically Though it did, as rector often does mess up some of our
coding standards. So for example, all the way at the bottom, you can see that it did
refract this, uh, an route annotation to an attribute, but then it added a little
extra space before our response return type. So that's fine. The typical thing is
after you're in rector run at pH B C fixer to fix things back up a little bit. So
I'll run tools, PHCs fixer vendor bin PHCs fixer fix And perfect. You can see it made
a number of PHP CS fixes to bring our code back in line. All right. So if we run, get
status, we going to get D. Now We can get a good idea of the things that died.
Perfect. So you can see that the route annotation was changing in attribute and PHCs
fixer just kind of put our response return type back the way it was before.

So this is awesome. The, you can even see how it refactored the is granted from
Sensio framework, extra bundle into an attribute, but if you keep scrolling down
until you find an entity, Here we go. There is a little problem here. It actually
killed my line breaks between my properties. It's not very obvious on the D but if
you open any entity, yikes, you can see suddenly things look very tight in here. I do
not like this style. I want to have line breaks between my properties like that. So
we could do the at by hand, but this kind of tells me that I'm probably missing a, a
rule in my pH B CS fixer config, because it could probably do that for me. And that's
exactly right. So I'm going to open.PHCs fixer.PHP. And the rule that we want in this
case Is called class attribute

Separation, where we can describe in an array. All the different spaces, line breaks
are not all the different parts of our class and whether or not we want them to have
spaces. So for example, we can say method one, it says we want to have one empty line
between all of our methods. We can also say a property one. So one empty line break
between our properties. And there's also another one called a trait import. So I'll
set that to one. So I'll have one empty line between our trait imports, which is
something that we have at the top of answer.PHP. So now thanks to that little change.
If you run PHC fix again. Oh, I got air. The rule contains unknown fixers class
attribute separation. I meant to say Class attributes, separation. What a great error
though. Just let me try that again. Cool. Change five files. And now if you check
those there back Soak awesome by with just a few commands, we now converted our
entire site from annotations to attributes. Woo. And we can go further next let's add
property types to our entities. That's actually going to allow us to have less
doctrine config.
