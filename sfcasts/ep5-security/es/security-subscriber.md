# Crear un suscriptor de eventos de seguridad

Éste es nuestro objetivo: si un usuario intenta iniciar la sesión pero aún no ha verificado su correo electrónico, tenemos que hacer que falle la autenticación.

Si quieres detener la autenticación por alguna razón, probablemente quieras escuchar el `CheckPassportEvent`: que se llama justo después de que se ejecute el método `authenticate()` en cualquier autenticador y... su trabajo consiste en hacer cosas como ésta.

## Creación del Suscriptor de Eventos

En tu directorio `src/`, no importa dónde, pero voy a crear un nuevo directorio llamado `EventsSubscriber/`. Dentro, añade una clase llamada`CheckVerifiedUserSubscriber`. Haz que ésta implemente `EventSubscriberInterface` y luego ve al menú "Código"->"Generar" -o `Command`+`N` en un Mac- y dale a "Implementar métodos" para generar el que necesitamos: `getSubscribedEvents()`:

[[[ code('123553ade2') ]]]

Dentro, devuelve un array con todos los eventos que queremos escuchar, que es uno solo. Digamos que `CheckPassportEvent::class` establece el método de esta clase que debe ser llamado cuando se envíe ese evento. Qué tal, `onCheckPassport`:

[[[ code('4d97fd928b') ]]]

Arriba, añade esto: `public function onCheckPassport()`... y esto recibirá este objeto de evento. Así que `CheckPassportEvent $event`. Empieza con`dd($event)` para que podamos ver su aspecto:

[[[ code('58fdb65eba') ]]]

Ahora, sólo con crear esta clase y hacer que implemente`EventSubscriberInterface`, gracias a la función de "autoconfiguración" de Symfony, ya será llamada cuando ocurra el `CheckPassportEvent`. Y... si quieres ponerte técnico, nuestro suscriptor escucha el `CheckPassportEvent` en todos los cortafuegos. Para nosotros, sólo tenemos un cortafuegos real, así que no importa:

[[[ code('ba66da6ebd') ]]]

Pero si tuvieras varios cortafuegos reales, se llamaría a nuestro suscriptor siempre que se activara el evento para cualquier cortafuegos. Si lo necesitas, puedes añadir una pequeña configuración adicional para dirigirte a uno solo de los cortafuegos.

## Ajustar la prioridad de los eventos

De todos modos, ¡probemos esto! Inicia sesión como `abraca_admin@example.com`. Hemos puesto la bandera `isVerified` en las instalaciones como verdadera para todos los usuarios... pero aún no hemos recargado la base de datos. Así que este usuario no será verificado.

Intenta escribir una contraseña no válida y enviarla. Sí Ha llegado a nuestro `dd()`. Así que esto funciona. Pero si escribo un correo electrónico no válido, nuestro escuchador no se ejecuta. ¿Por qué?

Tanto la carga del usuario como la comprobación de la contraseña ocurren a través de oyentes del `CheckPassportEvent`: el mismo evento que estamos escuchando. La incoherencia en el comportamiento -el hecho de que nuestro oyente se haya ejecutado con una contraseña no válida pero no con un correo electrónico no válido- se debe a la prioridad de los oyentes.

Vuelve a tu terminal. Ah, cada evento muestra una prioridad, y el valor por defecto es cero. Déjame hacer esto un poco más pequeño para que podamos leerlo. Ya está.

Fíjate bien: nuestro oyente es llamado antes que el `CheckCredentialsListener`. Por eso llamó a nuestro oyente antes de que la comprobación de la contraseña pudiera fallar.

Pero eso no es lo que queremos. No queremos hacer nuestra comprobación "está verificada" hasta que sepamos que la contraseña es válida: no hay razón para exponer si la cuenta está verificada o no hasta que sepamos que el usuario real está iniciando la sesión.

La cuestión es: queremos que nuestro código se ejecute después de `CheckCredentialsListener`. Para ello, podemos dar a nuestro oyente una prioridad negativa. Modifica la sintaxis: establece el nombre del evento en una matriz con el nombre del método como primera clave y la prioridad como segunda. ¿Qué tal un 10 negativo?

[[[ code('a2fbde8e3a') ]]]

Gracias a esto, el usuario tendrá que introducir un correo electrónico y una contraseña válidos antes de que se llame a nuestro oyente. Pruébalo: vuelve a `abraca_admin@example.com`, contraseña `tada` y... ¡hermoso!

## Utilizar el objeto de evento

Echa un vistazo al objeto de evento que nos han pasado: está lleno de cosas buenas. Contiene el autentificador que se utilizó, por si necesitamos hacer algo diferente en función de eso. También contiene el `Passport`... que es enorme porque contiene el objeto`User` y las insignias... porque a veces necesitas hacer cosas diferentes en función de las insignias del pasaporte.

Dentro de nuestro suscriptor, pongámonos a trabajar. Para obtener el usuario, primero tenemos que obtener el pasaporte: `$passport = $event->getPassport()`. Ahora, añade si no`$passport` es un `instanceof UserPassportInterface`, lanza una excepción:

[[[ code('f1de8e770c') ]]]

Esta comprobación no es importante y no es necesaria en Symfony 6 y superiores. Básicamente, esta comprobación asegura que nuestro `Passport` tiene un método `getUser()`, que en la práctica, siempre lo tendrá. En Symfony 6, la comprobación no es necesaria en absoluto porque la clase`Passport` tiene literalmente siempre este método.

Esto significa que, aquí abajo, podemos decir `$user = $passport->getUser()`. Y luego añadamos una comprobación de cordura: si `$user` no es una instancia de nuestra clase `User`, lanza una excepción: "Tipo de usuario inesperado":

[[[ code('7a7b95600c') ]]]

En la práctica, en nuestra aplicación, esto no es posible. Pero es una buena forma de dar una pista a mi editor -o a las herramientas de análisis estático- de que `$user` es nuestra clase Usuario. Gracias a esto, cuando digamos if not `$user->getIsVerified()`, se autocompletará ese método:

[[[ code('4096b84c31') ]]]

## Fallo de autenticación

Bien, si no estamos verificados, tenemos que hacer que falle la autenticación. ¿Cómo lo hacemos? Resulta que, en cualquier momento del proceso de autenticación, podemos lanzar un `AuthenticationException` -de Seguridad- y eso hará que la autenticación falle:

[[[ code('44c23b05a6') ]]]

Y hay un montón de subclases de esta clase, como `BadCredentialsException`. Puedes lanzar cualquiera de ellas porque todas extienden a `AuthenticationException`.

Compruébalo. Actualicemos y... ¡ya está!

> Se ha producido una excepción de autenticación.

Ese es el mensaje de error genérico vinculado a la clase `AuthenticationException`... no es un mensaje de error muy bueno. Pero ha hecho el trabajo.

¿Cómo podemos personalizarlo? O bien lanzando una excepción de autenticación diferente que coincida con el mensaje que quieres -como `BadCredentialsException` - o bien tomando el control total lanzando la clase especial`CustomUserMessageAuthenticationException()`. Pásale este mensaje para que se lo muestre al usuario:

> Por favor, verifica tu cuenta antes de iniciar la sesión.

[[[ code('aae53638d5') ]]]

Veamos cómo funciona esto. Mantén `Cmd` o `Ctrl` y haz clic para abrir esta clase. No es ninguna sorpresa: extiende `AuthenticationException`. Si intentas pasar un mensaje de excepción personalizado a `AuthenticationException` o a una de sus subclases, normalmente ese mensaje no se mostrará al usuario.

Esto se debe a que cada clase de excepción de autenticación tiene un método `getMessageKey()`que contiene un mensaje codificado... y eso es lo que se muestra al usuario. Esto se hace por seguridad, para que no expongamos accidentalmente algún mensaje de excepción interno a nuestros usuarios. Por eso, las diferentes subclases de excepción de autenticación nos dan mensajes diferentes.

Sin embargo, hay algunos casos en los que quieres mostrar un mensaje realmente personalizado. Puedes hacerlo utilizando esta clase. Esto fallará la autenticación igual que antes, pero ahora nosotros controlamos el mensaje. Muy bonito.

¡Pero podemos hacerlo aún mejor! En lugar de decir simplemente "por favor, verifique su cuenta", redirijamos al usuario a otra página en la que podamos explicarle mejor por qué no puede iniciar la sesión y darle la oportunidad de volver a enviar el correo electrónico. Esto requerirá una segunda escucha y un serio trabajo en equipo. Eso es lo siguiente.
