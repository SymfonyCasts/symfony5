# Dirs Server

Coming soon...

I really want you to understand the magic behind Symfony, how your application really
works. So let's look at the directory structure very quickly. In our, in our small
project, there's actually only three directories that you even need to think about.
The first one is this `public/` directory. It is the document root, so that's where we
point our web server app and that's, which means that if you, any public files like
images or CSS files will go inside the `public/` directory. This `index.php` file here
is called the front controller. This is the actual file that your web server is
executing. When you go to the site, you'll probably never need to touch anything in
this file. In fact, you almost, in reality, you almost never need to think about the
public directory at all. The reality is that there are only two directories that you
really need to think about. `config/` and `src/`. The, the `config/` directory is for well
configuration. You're going to see YAML files in here that control how your
application works and we'll talk a lot more about this later. The `src/` directory is
for your PHP files and there's only one right now, but every time we build a PHP
file, it's going to go into the `src/` directory and that's it. Config goes in,
`config/` PHP class classes go into `src/`.

Our project also has a `composer.json` file, which specifies our dependencies when we
originally created the project, that command use composer to install these
dependencies into the `vendor/` directory including Symfony itself. Okay, so we got our
application running by using the nice built into PHP web server here to start a local
development server pointing at the `public/` directory. That's cool, but I'm going to
hit control + C to stop that because there's a much better way to do that because we
have that Symfony CLI installed. We can say 

```terminal
symfony serve
```

and that's it. The first
time you run this, it may ask you about installing a certificate and that is
actually, that's optional, but if you say yes, it actually starts the web server up
with HTTPS. Yes, we get local HTTPS functional.

It's not, if I go over and refresh, you'll see that see the little lock icon. There.
We are actually seeing this at HTTPS which is awesome. When you want to stop the
web server, you can hit control + C, you see it streams the logs to stop that and there
are number of other options you can pass on any of these commands. You can pass `--help`

```terminal-silent
symfony serve --help
```

it's can tie to a different document route or a different port if that's
what you want. Or yeah, no TLS. If you want to disable the HTTPS for some reason. Now
when you actually use the Symfony command, I actually do Symfony colon start. I
actually run Symfony. It's server colon start.

No I don't.

I actually do Symfony server colon run.

Oh I know, I do.

I actually do 

```terminal
symfony serve -d
```

`-d` means to run as Damon. It does the exact
same thing except that did just running in the background and um, and when you
refresh everything still works. You can say 

```terminal
symfony server:status
```

to see
where that server is running. And you can say 

```terminal
symfony server:stop
```

if you want to stop it. And then down here we will start it again.
 
```terminal-silent
symfony serve -d
```
 
That's simply serve, serve command has
other super powers like the ability to attach a domain, but we'll leave all that
stuff related. Okay. The last thing I want to do before we start coding, let's make
sure that our editor is set up. Now look, you can use whatever editor you want with
Symfony, but developing and Symfony with PHP storm, which is what you see here is an
absolute delight, so I highly recommend giving it a try. Now to really make it
awesome. There are two things that you need to know, so I'm going to go to Petri
[inaudible] preferences and the first thing to do is go to plugins and then
marketplace and search for Symfony.

Really, I just want to hear these Symfonys support and this thing is awesome. It's
been downloaded almost 4 million times because it is incredible. I'll click into it.
If you don't have this installed, go ahead and install it. The other thing there, the
other two other plugins, we want to get our PHP annotations and PHP toolbox, so I
have to say I searched for TG box here. It's a piece we toolbox peach. Meditation's
simply support. These are the three that you're going to want. Stop after you install
them in piece storm. We'll need you to restart.

And then once you've restarted, actually wants you to come right back to preferences
and then search the top box for Symfony. Once you have that simply plugin installed,
you actually need to enable it on a project by project basis and make sure you hit
that. Enable up there in the hip. Fly down there. It does, says they this change
needs a restart, but I don't think that's true. The second thing to really make this
work well for you is search for composer and you'll find a little languages,
frameworks, PHP composer section. It makes you have the synchronized IDE settings
with `composer.json`, that's just going to make your life a lot nicer. All right,
I'll hit okay and we are ready. So let's dive in. Let's start creating some pages and
see what Symfony is all about.

