# Rendering the QR Code

Coming soon...

All right. So the last
of those processes after user hits this, when we need to show them that QR code,
that's the key to getting their authenticator app set up back in our security
controller. That to a TBF indicator actually has a method to kind of do this as tot
of that-> give QR content and you can pass it. The user object that will read
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
/authentication /to FFA /Q R-code. And I'll change the route name
to an app_QR code. You also need to re-type the R on this QR code
generator to get the use data for that. Awesome. So what this is is it's actually an
endpoint that is going to return and image, which is the QR code. So you were using,
I go to this, we're actually going to implement this as an image tag, but to see if
it's
working, we can go over here and actually try that inside of our, you were out and
awesome QR code. So the last step is that one, the user enables two factor
authentication. We're going to very simply render template with that image tag to
this URL. So let's return This error, render security /enabled to FAA that HTML
that twig, and we don't need to pass in any variables. I'll copy that template name,
go into template security and create enable to eBay.HTML, twig.

I don't know,

Inside of this, I'm warring and paste a template, which basically just has an h1
that says use offi or Google authenticator to scan that QR code. There's no arc QR
code yet to add one, we need to add an image tag with source. What sort of sets your
{{ path, and then the route name to that controller that we just graded down
here. So apt QR code, and then for the alt we'll say to F a Q R code, That's it. All
right. So let's head back here. Kind of do the whole flow. So I'm on the homepage. I
want to enable two factor authentication, add beautiful. We have a QR code. So next
let's scan this with our authenticator app and try the two factor authentication
walls to learn how to customize the, enter the code template to match our design.


---> NOTE about how you would probably not actually save the totpSecret until they
confirmr that they've scanned the QR code