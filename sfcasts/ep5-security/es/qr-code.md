# Renderización del código QR

Vale, acabamos de añadir una URL a la que el usuario puede ir para activar la autenticación de dos factores en su cuenta. Lo que esto significa en realidad es bastante sencillo: generamos un `totpSecret` y lo guardamos en su registro de usuario en la base de datos. Gracias a esto, cuando el usuario intente iniciar sesión, el bundle de 2 factores se dará cuenta de ello y lo enviará al formulario "rellenar el código".

Pero, para saber qué código debe introducir, el usuario necesita configurar una aplicación autenticadora. Y para ello, necesitamos generar un código QR que puedan escanear.

## Volcar el contenido del QR

¿Cómo? El `$totpAuthenticator` tiene un método que puede ayudar. Prueba a volcar`$totpAuthenticator->getQRContent()` y pásale `$user`:

[[[ code('29bf3f6c6f') ]]]

Cuando actualizamos vemos... ¡una URL de aspecto super raro! Esta es la información que necesitamos enviar a nuestra aplicación autenticadora. Contiene nuestra dirección de correo electrónico -que es sólo una etiqueta que ayudará a la app- y, lo más importante, el totp secret, que la app utilizará para generar los códigos.

En teoría, podríamos introducir esta URL manualmente en una app autenticadora. Pero, ¡eso es una locura! En el mundo real, traducimos esta cadena en una imagen de código QR.

## Generar el código QR

Afortunadamente, de esto también se encarga la biblioteca Scheb. Si te desplazas un poco hacia abajo, hay un apartado sobre códigos QR. Si quieres generar uno, necesitas una última biblioteca. En realidad, justo después de que grabara esto, ¡el encargado de mantener esta biblioteca `2fa-qr-code` la dejó obsoleta! ¡Dang! Así que aún puedes instalarla, pero también te mostraré cómo generar el código QR sin ella. La librería fue eliminada porque, bueno, es bastante fácil crear el código QR incluso sin ella.

De todos modos, copiaré esto, buscaré mi terminal y lo pegaré.

```terminal
composer require "scheb/2fa-qr-code:^5.12.1"
```

***TIP
Para utilizar la nueva forma de generar códigos QR -que recomiendo- sáltate este paso y en su lugar ejecuta```terminal
composer require "endroid/qr-code:^3.0"
```
***

Mientras eso funciona. Vuelve a la documentación... y copia este controlador de la documentación. En `SecurityController`, en la parte inferior, pega. Modificaré la URL para que sea `/authentication/2fa/qr-code` y llamaré a la ruta`app_qr_code`:

[[[ code('7bc6207163') ]]]

También tengo que volver a escribir la "R" en `QrCodeGenerator` para obtener su declaración de uso:

[[[ code('ced3c623d5') ]]]

***TIP
Si estás utilizando la nueva forma de generar los códigos QR, entonces tu controlador debería parecerse a esto. Puedes copiarlo del bloque de código de esta página:```php
namespace App\Controller;

use Endroid\QrCode\QrCode;
// ...

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
        $qrCode = new QrCode($qrCodeContent);

        return new Response($qrCode->writeString(), 200, ['Content-Type' => 'image/png']);
    }
}
```Esta ruta especial devuelve literalmente la imagen del código QR, como un png. Ah, y lo olvidé aquí, pero deberías añadir un `@IsGranted("ROLE_USER")` encima de esto: sólo los usuarios autentificados deberían poder cargar esta imagen. De todas formas, el usuario no irá a esta URL directamente: la utilizaremos dentro de una etiqueta `img`. Pero para ver si funciona, copia la URL, pégala en tu navegador y... ¡listo! Hola código QR! Por último, después de que el usuario active la autenticación de dos factores, vamos a renderizar una plantilla con una imagen a esta URL. Devuelve `$this->render('security/enable2fa.html.twig')`. Copia el nombre de la plantilla, entra en `templates/security`, y crea eso:`enable2fa.html.twig`. Voy a pegar una estructura básica... es sólo un `h1` que te dice que escanees el código QR... pero aún no hay imagen:[[[ code('4c9a5088af') ]]]Vamos a añadirla: un `img` con `src` ajustado a `{{ path() }}` y luego el nombre de la ruta al controlador que acabamos de construir. Así que `app_qr_code`. Para el alt, diré`2FA QR code`:[[[ code('928cd73a36') ]]]¡Genial! Es hora de probar todo el flujo. Comienza en la página de inicio, activa la autenticación de dos factores y... ¡sí! ¡Vemos el código QR! Estamos listos para escanearlo e intentar iniciar sesión.## Hacer que el usuario confirme que ha escaneado el código QR Oh, pero antes de hacerlo, en una aplicación real, probablemente añadiría una propiedad extra en mi usuario, llamada `isTotpEnabled` y la utilizaría en el método `isTotpAuthenticationEnabled()`de mi clase `User`. ¿Por qué? Porque nos permitiría tener el siguiente flujo. En primer lugar, el usuario hace clic en "Activar autenticación de dos factores", generamos el `totpSecret`, lo guardamos, y renderizamos el código QR. Es decir, exactamente lo que estamos haciendo ahora. Pero, esa nueva bandera`isTotpEnabled` seguiría siendo falsa. Así, si algo saliera mal y el usuario nunca escaneara el código QR, seguiría pudiendo iniciar sesión sin que le pidiéramos el código. Luego, al final de esta página, podríamos añadir un botón "Confirmar". Cuando el usuario haga clic en él, finalmente estableceremos la propiedad`isTotpEnabled` en true. Incluso podrías pedir al usuario que introdujera un código desde su aplicación de autenticación para demostrar que ha configurado todo: el servicio`TotpAuthenticatorInterface` tiene un método `checkCode()` por si alguna vez quieres comprobar manualmente un código. A continuación: vamos a escanear este código QR con una aplicación de autenticación y, finalmente, probar el flujo completo de autenticación de dos factores. A continuación, aprenderemos a personalizar la "plantilla de introducción del código" para adaptarla a nuestro diseño.
***
