# Role Hierarchy

Coming soon...

[inaudible]

Right now, our site has two types of users, normally users and admin users. If you're
a normal user, you can vote on answers and probably do a bunch of other things before
we're done. If you were an admin, you can go to the admin section of our site.

There's not much here yet, but in theory, an admin user might have access to edit
questions, edit answers, or manage user data. And a lot of sites are just as simple.
You're either a normal user or an admin user. And if you're an admin user who has
access to all admin stuff, but if you're in a bigger company, then you probably have
a lot of different types of admin users. Some will have access to some sections in
others will have access to other sections. The question is what's the best way to
organize our roles to accomplish this. There are really only two possibilities. The
first is to assign roles to users that are named after the types of users. You have
like role human resources or roll it or roll person who owns the company. But I don't
love this. You end up in weird situations where if you're above a controller, You're
above a controller and you think I need to allow access to roll human resources and
roll it, Which is just a little bit weird and hard to manage. Instead of I prefer a
second option where we create where we protect our controllers with roles that
describe what access that role gives you. For example, at the bottom of this
controller, let's create a fake page

Called /admin /comments. So kind of a pretend Page for moderating comments on our
site, or actually, you know, I should call us

Admin /admin /answers and I'll call us admin answers. And this is a pretend answers
admin page. So instead of trying to put some rolls up here that say that human
resources, we're all human resources, shouldn't an RA human. It should have access to
this. Instead, I'm going to say this->deny access, unless granted I'm going to use
role comment, admin, a role that describes exactly what is being protected. I love
how simple that is. There's just one problem. If I go to /admin /answers, I get
access denied because I don't have this role, even though I'm supposed to be an admin
user. So the problem with this approach is that each time you create a new section of
your site and you protect it with a new role, you then need to go add this rule to
every single user in the database that should have access to this new section. That
sounds like a pain in the butt. Fortunately, Symfony has a feature to have just for
this it's called role hierarchy, open up the config packages, security .yaml anywhere
inside of here, but I'll put it near the top. We can say role hierarchy.

And then below this, we can say, well,_admin and set this to an array. And here we'll
say roll comment, admin. This looks just as simple as it is. It says, if you have
role admin, then you should also automatically have role comment admin. So if I
refresh the page, now it works. So the idea is that for each group in your company
like human resources, or it, you would create a new item in role hierarchy, like role
human resources, and then set this to an array of whatever permissions it should
have, whatever roles like. For example, let's pretend that we are also protecting
another controller with role user admin.

In this case, if you have raw human resources, then you automatically get role user
admin, which gives you access to some con future some controller. And if your role
admin, maybe this is people in it that we can give you access to common admin and
user admin. So each time we add a new section to recite, we only need to go to this
role hierarchy and add it to whatever groups we want. Then when you're creating your
users, like in your fixtures or in an admin section, you just need to assign them the
one role that that relates to who they are. So users in human resources, we get this
one role and only I need to be assigned this one role. All right. Speaking of admin
users, when you're debugging a customer's issue on your site, sometimes it would be
really useful if you could temporarily log in to that user's account and see what
they're seeing in Symfony. That's totally possible. Let's talk about impersonation
next.

