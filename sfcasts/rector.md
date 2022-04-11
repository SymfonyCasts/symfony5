# Automating Upgrades with Rector

Coming soon...

Now that we're on Symfony 5.4. Our job is simple hunt down and update all of our
deprecated code. As soon as we do that, it will be safe to upgrade to Symfony six
that's because the only difference between Symfony 5.4 and 6.0 is that all the
deprecated code paths are removed. Fortunately, Symfony is amazing and tells us via
the web Debu toolbar. Exactly all the deprecated code paths that we, But
understanding what all of these mean isn't always easy. So before we even try, we are
going to automate as much of this as possible, And we're going to do that with a tool
called rector, head to github.com/rector PHP /rector. This is an awesome command line
tool With1 job to automate all sorts of upgrades to your code, like upgrading your,
the code, your code from Sy, From being Symfony five, 5.0 compatible two Symfony 5.4
compatible or upgrading your code to the PHP. Eight compatible. This is a massively
powerful tool. And if you want to read more about it, they've even written a book
where you can go deeper and also help support the project. All right, so let's get
this thing installed

Head over to your Head, your terminal and run composer require Rector /rector-dev To
install the command aligned tool. Beautiful. Now, in order for rector to work, it
needs a config file and we can boost step one by running rector with vendor bin
rector, a knit Awesome. That creates a rector.PHP file, which we can see over here at
the root of our project inside of this callback function here, our job is to
configure which types of upgrades we want to apply. We are going to start with a set
of Symfony upgrades. If you look back on their documentation, you'll see a little
link to Symfony where actually tells you about a whole bunch of builtin Symfony rules
that it has. So down here, I'm going to copy the inside of their static function And
then paste it over what I have. So basically this sets up rector and kind of points
at a, a cache file that we'll have that helps us do its job. And it tells it that we
want to upgrade our code to be Symfony 5.2 compatible, upgrade our code to some
Symfony code quality standards. If you wanted to know a little bit more about what
these went, you could open this constant and kind of follow the code. And then
another rule about constructive injection. I need to look up what that means exactly,

But of course we don't want to upgrade code is Symfony 5.2 compatible code. We want
to upgrade all the way to Symfony 5.4. So you might expect me to put, just put five
at four right here, and I could do that Instead. I'm going to run Symfony level set
list and then say upgrade to Symfony five, four. Oh, it looks like I also need to add
a U Sy down here for Symfony set list. Let me retype that and hit tab. Great. What
the up two Symfony 5.4 means is that it'll include all the updates For, to, to
upgrade a code of 5.1 5.2 5.3 and 5.4. So instead of listing, needing to list those
all individually, we can say up two Symfony 5.4, and it will take care of all of
them. And that's it. So now we're ready to run this before we do. I'm pretty
interested in what changes this will make. So I'm going to Commit all my changes,
creating to Symfony 5.4 and installing rector. Perfect. Now to run rector, we're
going to say vendor bin Rector, and then process. And we can point at a directory to
process. So I'm going to say source, you could also pass, uh, point it at the config
and templates directory, but the vast majority of the stuff it's going to do is on
the source directory

And it's working And awesome. Eight files have been changed by rec here. Let's scroll
all the way up to the top here And check out the rule. So this is cool, cause it
shows you the file that was changed, the change that was made in it. And even below
kind, it tells you what rules did it apply to get there. So one thing it change is
user password en coder to user password Hasher. That's A new interface name. It
changed user, not font exception to username, not font exception to the new user, not
font exception. So are all just low level things that all just fixes to deprecated
code that we may or may not have been aware of. And also a change, a change to Ker
change the use statement there, and then a couple of other similar changes as you go
along. And also this is part of the coding style, added a re spots return type to all
of our controllers. So it didn't make a ton of changes, But it did fix a couple of
our depre,

But

You may have noticed it's not perfect. One problem is that We don't see it too much
with these changes, but sometimes rector will mess with your coding style. That's
because rector doesn't really what your coding style is. So it doesn't even try
second while it did change these classes like user password and coder interface to
user password hash, your interface, it in line the U the whole namespace here,
instead of adding a use statement And a third, it didn't change any very names. So
even though it changed this argument to a user password Hasher interface, the
arguments still called password in coder and the property's still called password in
coder worse. The user password Hasher has a different method on it, and it didn't
update the code belonging down here to ch change that method. So rector is this great
starting point to kind of catch a bunch of things, but we are going to need to Take
what it did and sort of finish the job. Sometimes we're going to do that next. And
part of that, we're going to do by hand. But part of that, we're going to do
automatically with PHP C S fixer.
