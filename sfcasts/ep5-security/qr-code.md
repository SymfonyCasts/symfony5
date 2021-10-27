# Qr Code

Coming soon...

All right. Here's the flow.

When we submit a valid email and password, the two factor bundle will intercept that
and redirect us to some, enter the code form screen, to validate that code. It's
going to read the Tio P secret that's on that user object that stored in that user.
But in order to know what code to type in the user is going to need to first have
first activated two factor authentication on their account and scanned a QR code into
Google authenticator or offi. So let's build that side of things first, before I
forget we added a new property to our user. So we need a migration for that. It's
been over and run symphony and console and make migration go check out that file and
go no surprises as one column to our table. Run that symphony console doctrine
migrations migrate. All right, here's the plan users. A user will not have two factor
authentication enabled by default to activate it. They're going to click a link on
the navigation when they do we'll generate a T O T P secret for that user. Save it to
the database and show the user a QR code to scan,

Head over to source control or security controller. Let's set up that end point.
That's going to activate two factor authentication. So I'll say public function
Enable to have a And above this. I will give us the route at route, how bout slash
authentication slash to FAA slash enable. And I'll call this name equals half
underscore two, if I underscore enable

What's up, bud.

Yeah. And the only thing to be careful with here is that you don't start the URL with
slash to eBay because that is kind of reserved for the two factor authentication
process. All right, inside of here, we're gonna need two different services. First
one, you can wire QTP authenticator interface and I'll call that Tio OTP
authenticator. That's going to help us generate that to TP secret and then entity
manager interface and to new managers. So we can actually save the user. Oh, and
above this, of course you can only hit this route if you're authenticated. So I'll
use the app is granted and I'll say, enroll, underscore user, let me read type that
and tabs. I get the use of that notice I've been kind of using for the most part is
authenticated remembered here so that you just have to be logged in even via remember
me cookie, I'm using a roll user here. So then if the user is only authenticated via,
remember me cookie, it will actually force them to type their password and begin
before getting here just a little extra security before we enable two factor
authentication. All right, let's say user equals this arrow get user.

And then I'll say if user, if not user error is to OTP, let's check to see if to
prevent obligations already. That enabled notice. I'm not getting audit completion on
this. That's because they get user method only knows that this returns user
interface, where she already fixed that earlier. I kind of making our own base
controllers. Let's extend that now down here, if not user out is UTP authentication
navel. So if it's not already enabled was a user outset TNTP secrets. And here we say
to TP authenticator, arrow generate secret. Cool. And below this, we'll say in a new
manager arrow flush now for now at the bottom, I'm just going to D D user so we can
make sure that this is working cool. Let's go ahead and link to this. I'm going to
copy to ramen and then go down into templates slash and base studies to twig And
let's search for a log out. There we go. So we're going to put another link kind of
like right here. So let me paste that route name. Actually, we want a whole new ally
here. I'll paste that ally and I kind of steal that route name, clean up my temporary
goad. And now we're here for the text. We'll say enable it to have a,

Alright, let's try this. So I'm not logged in and ask let's log in Havre admin, at
example.com password.

Okay.

So actually before we log in, go over and reload your fixtures. All of our users have
their account enabled

Pumpkin.

Oh, okay, buddy. Good. That'd be perfect time. I'm finished finishing some recording
right now. Probably just a couple minutes. All right. Once it finishes spin over and
let's enter our Avar admin, uh, example.com the password and beautiful,

Uh, here had the dropdown hit, enable to a bay and awesome. It hits our user dump.
And most importantly, we have a T a T P C a T T P secret set. All right. So the last
of those processes after user hits this, when we need to show them that QR code,
that's the key to getting their authenticator app set up back in our security
controller. That to a TBF indicator actually has a method to kind of do this as tot
of that arrow, give QR content and you can pass it. The user object that will read
the two TPC grit and dump this, which is sort of helpful. This is the URL that an
authenticator app needs in order to set itself up. You can see it's got our TTB
identifier and our secret, but it's not very user-friendly. We want to transform that
into a Q R code. Fortunately, this is also handled by this library. If you scroll
down a bit, there's a spot about Q R codes. If you want to generate a QR code, you
need yet one last library. So copy that composer require line spin over and run that

```terminal
composer require scheb/2fa-qr-code
```

While that's working. I'm going to go down and copy this controller from the
documentation. Then we'll head over to security controller

And I'm going to paste it there. I'm going to tweak the URL here a little bit to be
slash authentication slash to FFA slash Q R dash code. And I'll change the route name
to an app underscore QR code. You also need to re-type the R on this QR code
generator to get the use data for that. Awesome. So what this is is it's actually an
endpoint that is going to return and image, which is the QR code. So you were using,
I go to this, we're actually gonna implement this as an image tag, but to see if it's
working, we can go over here and actually try that inside of our, you were out and
awesome QR code. So the last step is that one, the user enables two factor
authentication. We're going to very simply render template with that image tag to
this URL. So let's return This error, render security slash enabled to FAA that HTML
that twig, and we don't need to pass in any variables. I'll copy that template name,
go into template security and create enable to eBay dot HTML, twig.

I don't know,

Inside of this, I'm warring and paste a template, which basically just has an H one
that says use offi or Google authenticator to scan that QR code. There's no arc QR
code yet to add one, we need to add an image tag with source. What sort of sets your
curly curly path, and then the route name to that controller that we just graded down
here. So apt QR code, and then for the alt we'll say to F a Q R code, That's it. All
right. So let's head back here. Kind of do the whole flow. So I'm on the homepage. I
want to enable two factor authentication, add beautiful. We have a QR code. So next
let's scan this with our authenticator app and try the two factor authentication
walls to learn how to customize the, enter the code template to match our design.

