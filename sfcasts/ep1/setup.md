# Setup

Coming soon...

Hey friends. Oh and welcome to our tutorial about Symfony 5. I am so excited that
you're here. I love nothing more.

Then playing with the latest versions of Symfony and this is the best one ever. Symfony
5 is a lean and mean. It's fast and it's tiny. It actually grows with you. It
grows with you as your application gets more bigger. In fact, a new Symfony 5 project is a
single file, but more on that later developing in Symfony 5 is also just super fun. There's
been a huge focus for many years now in Symfony about developer experience, just
making it something that's great to work with. But Symfony does this without
sacrificing quality. You get to build code that you love. It's high quality and love
the process.

It's also one of the fastest SIF, it's the fastest major PHP framework. All right, so
let's get started already. First, start by going to http://symfony.com
and then clicking the download button up here. We're going to download first is not
actually Symfony. It's a little executable tool that's going to make local
development with Symfony. Super awesome, so because I'm a Mac, I'll hit copy over
here. Then open a terminal, I have one already open and I will paste that, command

```terminal-silent
curl -sS https://get.symfony.com/cli/installer | bash
```

this down with the small executable file and then on a Mac in order. I can make that
globally available by copying this command here and then see if it works. Type
Symfony, say hello to your new best friend at these Symfony executable Symfonys CLI
executable. It's going to do many, many cool things for us, but don't worry because
we're going to see them along the way to actually start a new project.

We can use this new executable 

```terminal
symfony new cauldron_overflow
```

`cauldron_overflow` is
this name of the super important site that we're building because we've noticed a lot
of witches and wizards blowing each other up, not quite getting their spells correct,
so they need a place, their own stack overflow to ask questions about what they're
doing wrong behind the scenes. This clones a project called `symfony/skeleton`.
I'll show you that a bit more later into a new directory called `cauldron_overflow/` and
then installs the composer dependencies. We'll talk more about composer as well also.
So I'll move into this by saying I'll clear my screen and then move into this by
saying 

```terminal
cd cauldron_overflow
```

And then I'm going to open this in my favorite editor PHP storm. I have a little a
short call called peace storm. Move into the directory and then open this in your
favorite editor. I highly recommend using PHP storm. I've already opened the project
over here and you can just go to file open directory and find this directory to boom
open this thing up right here. And what we have right now is super small. And before
we get any further, let's create a new git repository and commit this. But hold on a
second because check this out. Everyone 

```terminal
git status
```

it says on branch master nothing
to commit. The Symfony executable already started a new git repository for us and
made the first commit. You can see it 

```terminal
git log
```

add an initial set of files. Wow. I
probably would have used a much more excited to commit message like Oh mg. we're
developing in Symfony 5 but this will do so. It already committed the files for us
and we can see all the files that committed by saying 

```terminal
git show --name-only
```

So as you can see, the project we're working with is super small. If you kind
of ignore the that you had to get ignore files. Here we have just about 10 files to
start with. Symfony starts small and lean.

Okay, so how can we get this project up and running? Well, the first one we can do is
run another command called 

```terminal
symfony check:req
```

for check requirements. That's going to
run some basic checks on Peter, makes sure everything's set up. If you have any
problems with this, you can fix them or let us know.

Do you actually get the project running? If I look back in PHP storm here, we're
gonna talk more about these directories pretty soon. But the first thing you need to
know is that the `public/` directory is the document root. So we need to point our web
server at the `public/` directory. Now, of course you're free to use apache, nginx
whatever you want, and there's documentation on how to get that all set up. But to
keep things super simple, we're going to use right now just the built in PHP web
server. You can literally run 

```terminal
php -S 127.0.0.1:8000 -t public/
```

The point at the PO which says to make the document with the `public/`
directory, and as soon as we do that, we can spin over here, go to `http://localhost:8000`
to find. Welcome to Symfony 5 Ooh, fancy. All right, so next, as easy as
that was to get going, we're going to, I'm going to show you an even better way to
run a local web server. Then we're going to take a look at some of these files here
and make sure that our editor is set up to work with Symfony because if you get piece
of your storm set up correctly to work with Symfony, you are absolutely going to be
blown away by how cool it is.

