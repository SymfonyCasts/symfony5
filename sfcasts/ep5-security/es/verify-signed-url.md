# Verificación de la URL firmada del correo electrónico de confirmación

Ahora estamos generando una URL firmada que normalmente incluiríamos en un correo electrónico de "confirmación de la dirección de correo electrónico" que enviamos al usuario tras el registro. Para simplificar las cosas, sólo vamos a renderizar esa URL en la página después del registro.

## Eliminando nuestro Bind no utilizado

Vamos a ver qué aspecto tiene. Refresca y... ¡ah! ¡Un error de aspecto terrible!

> Se ha configurado un enlace para un argumento llamado `$formLoginAuthenticator` en
> `_defaults`, pero no se ha encontrado el argumento correspondiente.

Así que, hasta hace unos minutos, teníamos un argumento para nuestra acción `register()` que se llamaba `$formLoginAuthenticator`. En `config/services.yaml`, hemos configurado un "bind" global que decía

> Siempre que un servicio autocableado tenga un argumento llamado `$formLoginAuthenticator`,
> por favor, pasa este servicio.

[[[ code('882f3addc8') ]]]

Una de las cosas buenas de bind es que si no hay un argumento que coincida en ninguna parte de nuestra aplicación, lanza una excepción. Intenta asegurarse de que no estamos cometiendo una errata accidental.

En nuestra situación, ya no necesitamos ese argumento. Así que elimínalo. Y ahora... ¡nuestra página de registro está viva!

## Comprobando la URL de verificación

¡Hagamos esto! Introduce un correo electrónico, una contraseña, acepta las condiciones y pulsa registrar. ¡Genial! Aquí está nuestra URL de confirmación por correo electrónico. Puedes ver que va a`/verify`: que dará a nuestra nueva acción `verifyUserEmail()`. También incluye una caducidad. Eso es algo que puedes configurar... es el tiempo de validez del enlace. Y tiene un `signature`: que es algo que ayudará a demostrar que el usuario no se ha inventado esta URL: definitivamente viene de nosotros.

También incluye un `id=18`: nuestro identificador de usuario.

## Verificar la URL firmada

Así que nuestro trabajo ahora es ir al método del controlador `verifyUserEmail` aquí abajo y validar esa URL firmada. Para ello, necesitamos unos cuantos argumentos: el objeto `Request` -para poder leer los datos de la URL-, un`VerifyEmailHelperInterface` para ayudarnos a validar la URL y, por último, nuestro `UserRepository` -para poder consultar el objeto `User`:

[[[ code('f2723a14dc') ]]]

Y en realidad, ese es nuestro primer trabajo. Digamos que `$user = $userRepository->find()` y encontrar el usuario al que pertenece este enlace de confirmación leyendo el parámetro de consulta `id`. Así que, `$request->query->get('id')`. Y si, por alguna razón, no podemos encontrar el `User`, vamos a lanzar una página 404 lanzando`$this->createNotFoundException()`:

[[[ code('4c1eedf886') ]]]

Ahora podemos asegurarnos de que la URL firmada no ha sido manipulada. Para ello, añade un bloque try-catch. Dentro, di `$verifyEmailHelper->validateEmailConfirmation()`y pasa un par de cosas. Primero, la URL firmada, que... es la URL actual. Obténla con `$request->getUri()`. A continuación, pasa el identificador del usuario - `$user->getId()` y luego el correo electrónico del usuario - `$user->getEmail()`:

[[[ code('0db135a3f6') ]]]

Esto asegura que la identificación y el correo electrónico no han cambiado en la base de datos desde que se envió el correo de verificación. Bueno, el id definitivamente no ha cambiado... ya que lo acabamos de utilizar para la consulta. Esta parte sólo se aplica realmente si confías en que el usuario esté conectado para verificar su correo electrónico.

De todos modos, si esto tiene éxito... ¡no pasará nada! Si falla, lanzará una excepción especial que implementa `VerifyEmailExceptionInterface`:

[[[ code('e45fac579f') ]]]

Así que, aquí abajo, sabemos que la verificación de la URL ha fallado... tal vez alguien se ha equivocado. O, más probablemente, el enlace ha caducado. Digamos al usuario la razón aprovechando de nuevo el sistema flash. Digamos `$this->addFlash()`, pero esta vez poniéndolo en una categoría diferente llamada `error`. Luego, para decir lo que ha ido mal, utiliza `$e->getReason()`. Por último, utiliza `redirectToRoute()` para enviarlos a algún sitio. ¿Qué tal la página de registro?

[[[ code('d1a77dfa67') ]]]

Para mostrar el error, vuelve a `base.html.twig`, duplica todo este bloque, pero busca los mensajes de `error` y utiliza `alert-danger`:

[[[ code('315db02373') ]]]

¡Uf! Probemos el caso del error. Copia la URL y luego abre una nueva pestaña y pégala. Si voy a esta URL real... funciona. Bueno, todavía tenemos que hacer algo más de codificación, pero llega a nuestro TODO en la parte inferior del controlador. Ahora juega con la URL, como eliminar algunos caracteres... o ajustar la caducidad o cambiar el `id`. Ahora... ¡sí! Ha fallado porque nuestro enlace no es válido. Si el enlace estuviera caducado, verías un mensaje al respecto.

Así que, por fin, ¡acabemos con el caso feliz! En la parte inferior de nuestro controlador, ahora que sabemos que el enlace de verificación es válido, hemos terminado. Para nuestra aplicación, podemos decir `$user->isVerified(true)` y almacenarlo en la base de datos:

[[[ code('5a032845ce') ]]]

Veamos... necesitamos un argumento más: `EntityManagerInterface $entityManager`:

[[[ code('e0e6137ac4') ]]]

Aquí abajo, utiliza `$entityManager->flush()` para guardar ese cambio:

[[[ code('7aa66d12a2') ]]]

Y demos a esto un feliz mensaje de éxito:

> ¡Cuenta verificada! Ya puedes conectarte.

Bueno, la verdad es que todavía no impedimos que se conecten antes de verificar su correo electrónico. Pero lo haremos pronto. De todos modos, termina redirigiendo a la página de inicio de sesión: `app_login`:

[[[ code('3cf0b00443') ]]]

Si quieres ser aún más genial, podrías autenticar manualmente al usuario de la misma manera que lo hicimos antes en nuestro controlador de registro. Eso está totalmente bien y depende de ti.

De vuelta a mi pestaña principal... copia ese enlace de nuevo, pégalo y... ¡estamos verificados! ¡Qué bien!

Lo único que queda por hacer es impedir que el usuario se registre hasta que haya verificado su correo electrónico. Para ello, primero tenemos que conocer los eventos que ocurren dentro del sistema de seguridad. Y para mostrarlos, aprovecharemos una nueva función muy interesante: el estrangulamiento del inicio de sesión.
