# Verificar el correo electrónico tras el registro

En algunos sitios, después del registro, tienes que verificar tu correo electrónico. Seguro que estás familiarizado con el proceso: te registras, te envían un enlace especial a tu correo electrónico, haces clic en ese enlace y ¡voilà! Tu correo electrónico está verificado. Si no haces clic en ese enlace, dependiendo del sitio, puede que no tengas acceso a ciertas secciones... o puede que no puedas entrar en absoluto. Eso es lo que vamos a hacer.

Cuando ejecutamos originalmente el comando `make:registration-form`, nos preguntó si queríamos generar un proceso de verificación por correo electrónico. Si hubiéramos dicho que sí, nos habría generado un código. Dijimos que no... para poder construirlo a mano, aprender un poco más sobre su funcionamiento y personalizar un poco las cosas.

## Propiedad User.isVerified

Pero antes de pasar a enviar el correo electrónico de verificación, dentro de nuestra clase `User`, necesitamos alguna forma de rastrear si un usuario ha verificado o no su correo electrónico. Vamos a añadir un nuevo campo para ello. Ejecuta:

```terminal
symfony console make:entity
```

Actualiza `User`, añade una propiedad `isVerified`, de tipo booleano, no anulable y... ¡perfecto! Dirígete a la clase. Veamos... aquí vamos: `$isVerified`:

[[[ code('7b6a00197d') ]]]

Pongamos por defecto esto en `false`:

[[[ code('2106a7e246') ]]]

Bien, es hora de la migración:

```terminal
symfony console make:migration
```

Ve a comprobarlo y... impresionante. Se ve exactamente como esperamos:

[[[ code('6bd47260f7') ]]]

¡Ejecútalo!

```terminal
symfony console doctrine:migrations:migrate
```

¡Precioso! Hagamos una cosa más relacionada con la base de datos. Dentro de`src/Factory/UserFactory.php`, para hacer la vida más sencilla, pon `$isVerified` en `true`:

[[[ code('9f079af27f') ]]]

Así, por defecto, se verificarán los usuarios de nuestras instalaciones. Pero no me preocuparé de recargar mis accesorios todavía.

## ¡Hola VerifyEmailBundle!

Bien: ¡ahora vamos a añadir el sistema de confirmación por correo electrónico! ¿Cómo? Aprovechando un bundle! En tu terminal, ejecuta

```terminal
composer require symfonycasts/verify-email-bundle
```

¡Hey, los conozco! Este bundle nos proporciona un par de servicios que nos ayudarán a generar una URL firmada que incluiremos en el correo electrónico y que luego validará esa URL firmada cuando el usuario haga clic en ella. Para que esto funcione, abre`RegistrationController`. Ya tenemos nuestro método `register()` que funciona. Ahora necesitamos otro método. Añade la función pública `verifyUserEmail()`. Sobre ella, dale una ruta: `@Route("/verify")` con `name="app_verify_email"`:

[[[ code('0bac7d3cc4') ]]]

Cuando el usuario haga clic en el enlace "confirmar correo electrónico" en el correo electrónico que le enviamos, esta es la ruta y el controlador al que le llevará ese enlace. De momento lo dejaré vacío. Pero finalmente, su trabajo será validar la URL firmada, lo que demostrará que el usuario hizo clic en el enlace exacto que le enviamos.

## Envío del correo electrónico de confirmación

Arriba, en la acción `register()`, es donde tenemos que enviar ese correo electrónico. Como he mencionado antes, puedes hacer diferentes cosas en tu sitio en función de si el correo electrónico del usuario está verificado o no. En nuestro sitio, vamos a impedir completamente que el usuario se registre hasta que su correo electrónico esté verificado. Así que voy a eliminar lo de `$userAuthenticator`:

[[[ code('fa2c533db4') ]]]

Y sustituirlo por la redirección original a `app_homepage`:

[[[ code('e95c6f8006') ]]]

Arriba, podemos eliminar algunos argumentos.

Genial. Ahora tenemos que generar el enlace de confirmación del correo electrónico firmado y enviarlo al usuario. Para ello, autocablea un nuevo servicio de tipo`VerifyEmailHelperInterface`. Llámalo `$verifyEmailHelper`:

[[[ code('51da6f14d2') ]]]

A continuación, después de guardar el usuario, vamos a generar esa URL firmada. Esto... parece un poco raro al principio. Digamos que `$signatureComponents` es igual a`$verifyEmailHelper->generateSignature()`:

[[[ code('fe1fd88609') ]]]

El primer argumento es el nombre de la ruta de verificación. Para nosotros, será `app_verify_email`:

[[[ code('b114cea228') ]]]

Así que lo pondré aquí. A continuación, el identificador del usuario - `$user->getId()` - y el correo electrónico del usuario,`$user->getEmail()`:

[[[ code('4ebe1c6095') ]]]

Ambos se utilizan para "firmar" la URL, lo que ayudará a demostrar que este usuario hizo clic en el enlace del correo electrónico que le enviamos:

## Verificar el correo electrónico sin estar conectado

Pero ahora tenemos un punto de decisión. Hay dos formas diferentes de utilizar el VerifyEmailBundle. La primera es cuando, cuando el usuario hace clic en el enlace de confirmación del correo electrónico, esperas que haya iniciado la sesión. En esta situación, abajo en`verifyUserEmail()`, podemos utilizar `$this->getUser()` para averiguar quién está intentando verificar su correo electrónico y utilizarlo para ayudar a validar la URL firmada.

El otro modo, que es el que vamos a utilizar, es permitir que el usuario no esté conectado cuando haga clic en el enlace de confirmación de su correo electrónico. Con este modo, necesitamos pasar un array como argumento final para incluir el id del usuario:

[[[ code('e933d8bdb6') ]]]

El objetivo de este método `generateSignature()` es generar una URL firmada. Y gracias a este último argumento, esa URL contendrá ahora un parámetro de consulta `id`... que podemos utilizar abajo en el método `verifyUserEmail()` para consultar el `User`. Lo veremos pronto.

Llegados a este punto, en una aplicación real, tomarías esta cosa de `$signatureComponents`, la pasarías a una plantilla de correo electrónico, la usarías para renderizar el enlace y luego enviarías el correo. Pero esto no es un tutorial sobre el envío de correos electrónicos, aunque tenemos ese [tutorial](https://symfonycasts.com/screencast/mailer). Así que voy a tomar un atajo. En lugar de enviar un correo electrónico, di `$this->addFlash('success')` con un pequeño mensaje que diga: "Confirma tu correo electrónico en:" y luego la URL firmada. Puedes generar eso diciendo `$signatureComponents->getSignedUrl()`:

[[[ code('52ed379578') ]]]

No hemos hablado de los mensajes flash. Son básicamente mensajes temporales que puedes poner en la sesión... y luego renderizarlos una vez. He puesto este mensaje en la categoría `success`. Gracias a esto, en `templates/base.html.twig`, justo después de la navegación -por lo que está en la parte superior de la página- podemos renderizar cualquier mensaje flash de `success`. Añade para `flash in app.flashes()` y luego busca esa clave `success`. Dentro, añade `div` con `alert`, `alert-success` y renderiza el mensaje:

[[[ code('fd0081fe0d') ]]]

Esto del flash no tiene nada que ver con la confirmación del correo electrónico... es sólo una característica de Symfony que se utiliza más comúnmente cuando se manejan formularios. Pero es un buen atajo para ayudarnos a probar esto.

A continuación: ¡hagamos... eso! Probemos nuestro formulario de registro y veamos qué aspecto tiene esta URL firmada. A continuación, rellenaremos la lógica para verificar esa URL y confirmar a nuestro usuario.
