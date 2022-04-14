# Form Improvements for Symfony 6

Coming soon...

It's time to show some new features. Well, actually there are a ton of new features.
We've already seen a lot of them and I, I don't have time to show you every single
one. Fortunately, if you have Symfony.com/blog post, the new stuff is really well
documented. Click down on, on this, uh, living on the edge. You can actually see blog
posts that are categorized by that version. So here is a bunch of blog posts about
what's new in Symfony 5.1, like the new security system, here's stuff. That's new in
Symfony 5.3 and stuff that's new in 75.4 /6.0. So I, I mean, if you want to go deep
and see all the new stuff, it has been documented beautifully up here in the blog
post, but I want to show you one that has to do with the form component Since simply
five, three, we have a nice new feature called form field sorting. So if you go to
the registration page, this renders four fields inside of a form, Let's go open the
template for that's templates, registration, register, HW, and exam running all those
four form fields by hand. I'm going to replace that with the very lazy form widget
registration form,

Which just dumps out all the fee fields in whatever order it wants. That looks weird
To fix this. We can open up the form type for this, which is source form registration
form type. So now every single field has a new option called priority. So we're going
to add that one by one. So first name, uh, pass Noel for the type. So it keeps
guessing. And then I'm going to set prior two, four, cause I want this to be the
first field. Then up here for email, that'll be the second field. So I'll pass no
again And set priority Two, three, Then passwords next Priority two. And finally
agree to terms is the last one. So we'll set that to priority one And now it looks
great again. So if you want to be lazy running your fields, now you can do the at and
not have to worry about them being in some weird order while we're on the topic of
forms. Open up the controller for this src/Controller registration controller in
Symfony 5.3 need to check that version. When you render a template with the form,
there's a new shortcut you can use instead of render say render form. And then the
only other difference is that you take the create view off of the form. So this is
really simple. Render form is just like render it still renders this template. It
still passes any of these variables into the template. But if it finds, if it sees
that any of the variables you're passing into a template is a form. It calls the
create view method for you. So it's just a nice little shortcut.

This also does one other change, which won't be very noticeable on a valid. If you
have a validation error, It's going to set the status code to 4 22 that won't look
any different in your browser.

I put too short of a password. Doesn't look any different your browser, but
technically status code is now 4 22 that doesn't confuse your browser in any way. The
reason we did that is a it's technically more correct to have an error status code on
a validation error and B if you're using turbo, this is it. So that turbo knows that
your form validation fail. So you get that for free just by using this nice new
shortcut method. All right, that was easy. Next Symfony comes with some nice and
optional Docker integrations for local development. Some parts of this integration
has recently changed. So let's see how we can use Docker to get a cool email catching
system added to our help added to our app. That'll help us test emails. That's next.

