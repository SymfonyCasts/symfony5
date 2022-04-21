# Activación de 2FA

Bien: este es el flujo. Cuando enviemos un correo electrónico y una contraseña válidos, el paquete de dos factores lo interceptará y nos redirigirá a un formulario de "introducir el código". Para validar el código, leerá el `totpSecret` que está almacenado para ese `User`:

[[[ code('9ebfcaa82d') ]]]

Pero para saber qué código debe escribir, el usuario tiene que activar primero la autenticación de dos factores en su cuenta y escanear un código QR que le proporcionamos con su aplicación de autenticación.

Construyamos ahora ese lado de las cosas: la activación y el código QR.

Ah, pero antes de que se me olvide otra vez, en el último capítulo añadimos una nueva propiedad a nuestro `User`... y se me olvidó hacer una migración para ella. En tu terminal, ejecuta:

```terminal
symfony console make:migration
```

Vamos a comprobar ese archivo:

[[[ code('1a16dc338a') ]]]

Y... bien. Sin sorpresas, añade una columna a nuestra tabla. Ejecuta eso:

```terminal
symfony console doctrine:migrations:migrate
```

## Añadir una forma de Activar 2fa

Este es el plan. Un usuario no tendrá activada la autenticación de dos factores por defecto, sino que la activará haciendo clic en un enlace. Cuando lo hagan, generaremos un`totpSecret`, se lo pondremos al usuario, lo guardaremos en la base de datos y le mostraremos un código QR para que lo escanee.

Dirígete a `src/Controller/SecurityController.php`. Vamos a crear la ruta que activa la autenticación de dos factores: `public function enable2fa()`. Dale una ruta: ¿qué tal `/authenticate/2fa/enable` - y `name="app_2fa_enable"`:

[[[ code('f065555703') ]]]

Sólo ten cuidado de no empezar la URL con `/2fa`... eso está reservado para el proceso de autenticación de dos factores:

[[[ code('57bf07143b') ]]]

Dentro del método, necesitamos dos servicios. El primero es un servicio autoconvocable del paquete - `TotpAuthenticatorInterface $totpAuthenticator`. Que nos ayudará a generar el secreto. El segundo es `EntityManagerInterface $entityManager`:

[[[ code('4790c48a42') ]]]

Y, por supuesto, sólo puedes utilizar esta ruta si estás autentificado. Añade`@IsGranted("ROLE_USER")`. Permíteme volver a escribir eso y pulsar el tabulador para que aparezca la declaración `use`en la parte superior:

[[[ code('16275df6ab') ]]]

***TIP
Este párrafo siguiente es... ¡equivocado! Utilizar `ROLE_USER` no obligará a un usuario a volver a introducir su contraseña si sólo está autenticado a través de una cookie "recuérdame". Para ello, debes utilizar `IS_AUTHENTICATED_FULLY`. Y eso es lo que debería haber utilizado aquí.
***

En su mayor parte, he utilizado `IS_AUTHENTICATED_REMEMBERED` por seguridad... para que sólo tengas que iniciar sesión... aunque sea a través de una cookie "recuérdame". Pero aquí estoy utilizando `ROLE_USER`, que es efectivamente idéntico a`IS_AUTHENTICATED_FULLY`. Eso es a propósito. El resultado es que si el usuario se autentificó... pero sólo gracias a una cookie "recuérdame", Symfony le obligará a volver a escribir su contraseña antes de llegar aquí. Un poco de seguridad extra antes de habilitar la autenticación de dos factores.

De todos modos, digamos `$user = this->getUser()`... y luego si no`$user->isTotpAuthenticationEnabled()`:

[[[ code('3dae53adf9') ]]]

Hmm, quiero ver si la autenticación totp no está ya habilitada... pero no me aparece el autocompletado para esto.

Ya sabemos por qué: el método `getUser()` sólo sabe que devuelve un `UserInterface`. Lo hemos arreglado antes haciendo nuestro propio controlador base. Vamos a ampliarlo:

[[[ code('28974a24e9') ]]]

Aquí abajo, si no es `$user->isTotpAuthenticationEnabled()` -por lo que si el usuario no tiene ya un `totpSecret` - vamos a establecer uno:`$user->setTotpSecret()` pasando por `$totpAuthentiator->generateSecret()`. Luego, guarda con `$entityManager->flush()`.

En la parte inferior, por ahora, sólo `dd($user)` para que podamos asegurarnos de que esto funciona:

[[[ code('22d7b5917d') ]]]

## Enlazando con la Ruta

¡Genial! ¡Vamos a enlazar con esto! Copia el nombre de la ruta... y abre`templates/base.html.twig`. Busca "Cerrar sesión". Ya está. Pegaré ese nombre de ruta, duplicaré todo `li`, limpiaré las cosas, pegaré el nuevo nombre de ruta, eliminaré mi código temporal y diré "Activar 2FA":

[[[ code('5cedd99f24') ]]]

¡Hora de probar! Ah, pero antes, en tu terminal, recarga tus instalaciones:

```terminal
symfony console doctrine:fixtures:load
```

Eso hará que todos los usuarios tengan correos electrónicos verificados para que podamos iniciar la sesión. Cuando esto termine, inicia la sesión con `abraca_admin@example.com`, contraseña `tada`. Precioso. A continuación, pulsa "Habilitar 2FA" y... ¡ya está! Se accede a nuestro volcado de usuarios! Y lo más importante, ¡tenemos un conjunto de `totpSecret`!

¡Eso es genial! Pero el último paso es mostrar al usuario un código QR que pueda escanear para configurar su aplicación de autenticación. Hagamos eso a continuación.
