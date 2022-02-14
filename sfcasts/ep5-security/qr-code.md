# Rendering the QR Code

Ok, we've just added a URL the user can go to in order to *enable* two-factor
authentication on their account. What this *really* means is pretty simple: we
generate a `totpSecret` and save it to their user record in the database. Thanks
to this, when the user tries to log in, the 2-factor bundle will notice this and
send them to the "fill in the code" form.

But, in order to *know* what code to enter, the user needs to set up an authenticator
app. And to do *that*, we need to render a QR code they can scan.

## Dumping the QR Content

How? The `$totpAuthenticator` has a method that can help. Try dumping
`$totpAuthenticator->getQRContent()` and pass it `$user`:

[[[ code('29bf3f6c6f') ]]]

When we refresh we see... a super weird-looking URL! *This* is the info that we
need to send to our authenticator app. It contains our email address - that's
just a label that will help the app - and most importantly the totp secret,
which the app will use to generate the codes.

In theory, we could enter this URL manually into an authenticator app. But, pfff.
That's crazy! In the real world, we translate this string into a QR code image.

## Generating the QR Code

Fortunately, this is *also* handled by the Scheb library. If you scroll
down a bit, there's a spot about QR codes. If you want to generate one, you
need one last library. Actually, *right* after I recorded this, the maintainer
deprecated this `2fa-qr-code` library! Dang! So, you *can* still install it, but
I'll also show you how to generate the QR code *without* it. The library was
deprecated because, well, it's pretty darn easy to create the QR code even
without it.

Anyways, I'll copy that, find my terminal, and paste.

```terminal
composer require scheb/2fa-qr-code
```

To use the *new* way of generating QR codes - which I recommend - skip this
step and instead run:

```terminal
composer require "endroid/qr-code:^3.0"
```

While that's working. Head back to the docs... and copy this controller from the
documentation. Over in `SecurityController`, at the bottom, paste.
I'll tweak the URL to be `/authentication/2fa/qr-code` and call the route
`app_qr_code`:

[[[ code('7bc6207163') ]]]

I also need to re-type the "R" on `QrCodeGenerator` to get its use statement:

[[[ code('ced3c623d5') ]]]

If you're using the *new* way of generating the QR codes, then your controller
should like this instead. You can copy this from the code block on this page:

```php
namespace App\Controller;

use Endroid\QrCode\Builder\Builder;
use Scheb\TwoFactorBundle\Security\TwoFactor\Provider\Totp\TotpAuthenticatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends BaseController
{
    // ...

    /**
     * @Route("/authentication/2fa/qr-code", name="app_qr_code")
     * @IsGranted("ROLE_USER")
     */
    public function displayGoogleAuthenticatorQrCode(TotpAuthenticatorInterface $totpAuthenticator)
    {
        $qrCodeContent = $totpAuthenticator->getQRContent($this->getUser());
        $result = Builder::create()
            ->data($qrCodeContent)
            ->build();

        return new Response($result->getString(), 200, ['Content-Type' => 'image/png']);
    }
}
```

This special endpoint *literally* returns the QR code *image*, as a png. Oh, and
I forgot it here, but you should add an `@IsGranted("ROLE_USER")` above this:
only authenticated users should be able to load this image.

Anyways, the user won't go to this URL *directly*: we'll use it inside an `img`
tag. But to see if it's working, copy the URL, paste that into your browser and...
sweet! Hello QR code!

Finally, after the user enables two-factor authentication, let's render a template
with an image to this URL. Return `$this->render('security/enable2fa.html.twig')`.

Copy the template name, head into `templates/security`, and create that:
`enable2fa.html.twig`. I'll paste in a basic structure... it's just an `h1` that
tells you to scan the QR code... but no image yet:

[[[ code('4c9a5088af') ]]]

Let's add it: an `img` with `src` set to `{{ path() }}` and then the route name
to the controller we just built. So `app_qr_code`. For the alt, I'll say
`2FA QR code`:

[[[ code('928cd73a36') ]]]

Sweet! Time to try the whole flow. Start on the homepage, enable two-factor
authentication and... yes! We see the QR code! We are ready to scan this and
try logging in.

## Making the User Confirm The Scanned the QR Code

Oh, but before we do, in a real app, I would probably add an *extra* property on
my user, called `isTotpEnabled` and use *that* in the `isTotpAuthenticationEnabled()`
method on my `User` class. Why? Because it would allow us to have the following flow. First,
the user clicks "Enable two-factor authentication", we generate the `totpSecret`,
save it, and render the QR code. So, *exactly* what we're doing now. *But*, that new
`isTotpEnabled` flag would still be *false*. So if something went wrong and the
user never scanned the QR code, they would *still* be able to log in *without*
us requiring the code. *Then*, at the bottom of this page, we could add a
"Confirm" button. When the user clicks that, we would *finally* set that
`isTotpEnabled` property to true. Heck, you could even require the user to enter
a code from their authenticator app to *prove* they set things up: the
`TotpAuthenticatorInterface` service has a `checkCode()` method in case you ever
want to manually check a code.

Next: let's scan this QR code with an authenticator app and finally try the full
two-factor authentication flow. We'll then learn how to customize the "enter the
code template" to match our design.
