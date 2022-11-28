# Autenticación manual

Nuestro formulario de registro funcionaría si lo probamos. Pero, tras el registro, quiero también autenticar automáticamente al usuario... para que no tenga que registrarse y luego iniciar inmediatamente la sesión... eso sería una tontería.

Hasta ahora, toda la autentificación se ha hecho... de forma indirecta: el usuario hace una petición, algún autentificador la gestiona y... ¡voilà! Pero en este caso, queremos autenticar al usuario directamente, escribiendo código dentro de un controlador.

## Hola UserAuthenticatorInterface

Y... esto es totalmente posible, autocableando un servicio específicamente para esto. Añade un nuevo argumento aquí arriba de tipo `UserAuthenticatorInterface` y lo llamaré `$userAuthenticator`:

[[[ code('c4a8802408') ]]]

Este objeto te permite simplemente... autentificar cualquier objeto de `User`. Justo antes de la redirección, vamos a hacer eso: `$userAuthenticator->authenticateUser()` y necesitamos pasarle a esto unos cuantos argumentos. El primero es el `User` que queremos autenticar:

[[[ code('b5cd8a365d') ]]]

Fácil. El segundo es un "autentificador" que quieres utilizar. Este sistema funciona básicamente tomando tu objeto `User` y... como "pasándolo por" uno de tus autentificadores.

Si siguiéramos utilizando nuestro `LoginFormAuthenticator` personalizado, pasar este argumento sería realmente fácil. Podríamos simplemente autoconectar el servicio `LoginFormAuthenticator` aquí arriba y pasarlo.

## Inyectar el servicio para form_login

Pero, en nuestro archivo `security.yaml`, nuestra principal forma de autenticación es `form_login`:

[[[ code('f9772f6b10') ]]]

Esto activa un servicio de autenticación entre bastidores, al igual que nuestro `LoginFormAuthenticator` personalizado. La parte complicada es averiguar cuál es ese servicio e inyectarlo en nuestro controlador.

Así que tenemos que investigar un poco. En tu terminal, ejecuta

```terminal
symfony console debug:container
```

y busca `form_login`:

```terminal-silent
symfony console debug:container form_login
```

En esta lista, veo un servicio llamado `security.authenticator.form_login.main`... y recuerda que "main" es el nombre de nuestro cortafuegos. Este es el id del servicio que queremos. Si te preguntas por el servicio que hay encima de esto, si lo compruebas, verás que es un servicio "abstracto". Una especie de servicio "falso" que se utiliza como plantilla para crear el servicio real para cualquier cortafuegos que utilice`form_login`.

En cualquier caso, voy a pulsar "1" para obtener más detalles. Vale, genial: este servicio es una instancia de`FormLoginAuthenticator`, que es la clase principal que hemos visto antes.

De vuelta a nuestro controlador, añade otro argumento de tipo `FormLoginAuthenticator`:

[[[ code('d3fa6e439c') ]]]

Luego, aquí abajo, pasa el nuevo argumento a `authenticateUser()`:

[[[ code('3af742fe35') ]]]

Esto no funcionará todavía, pero sigue conmigo.

El argumento final a `authenticateUser()` es el objeto `Request`... que ya tenemos... es nuestro primer argumento del controlador:

[[[ code('b04059ccfe') ]]]

## authenticateUser devuelve una respuesta

¡Ya está! ¡Ah, y una cosa genial de `authenticateUser()` es que devuelve un objeto`Response`! En concreto, el objeto `Response` del método`onAuthenticationSuccess()` de cualquier autentificador que hayamos pasado. Esto significa que, en lugar de redirigir a la página de inicio, podemos devolver esto y, dondequiera que ese autentificador redirija normalmente, redirigiremos allí también, que podría ser la "ruta de destino".

## Vinculación del servicio form_login

¡Vamos a probar esto! Actualiza el formulario de registro para ser recibido con... ¡un impresionante error!

> No se puede autoenlazar el argumento `$formLoginAuthenticator`.

Hmm. Sí que hemos tecleado ese argumento con la clase correcta:`FormLoginAuthenticator`:

[[[ code('c42db48b01') ]]]

¡El problema es que éste es un raro ejemplo de un servicio que no está disponible para el autocableado! Así que tenemos que configurarlo manualmente.

Afortunadamente, si no sabíamos ya qué servicio necesitamos, el mensaje de error nos da una gran pista. Dice:

> ... no existe tal servicio, tal vez debas asignar un alias de esta clase al
> servicio existente `security.authenticator.form_login.main` 

Sí, nos ha dado el id del servicio que necesitamos cablear.

Ve a copiar el nombre del argumento - `formLoginAuthenticator` - y luego abre`config/services.yaml`. Debajo de `_defaults`, añade un nuevo `bind` llamado`$formLoginAuthenticator` ajustado a `@` y luego... Iré a copiar ese largo id de servicio... y lo pegaré aquí:

[[[ code('ed99d4c355') ]]]

Esto dice: siempre que un servicio tenga un argumento `$formLoginAuthenticator`, pásale este servicio.

Eso... si refrescamos... eliminará nuestro error.

Bien, ¡registremos por fin un nuevo usuario! Utilizaré mi correo electrónico de la vida real... y luego cualquier contraseña... siempre que tenga 6 caracteres: nuestro formulario de registro venía preconstruido con esa regla de validación. Y... lo tenemos. Abajo, en la barra de herramientas de depuración de la web, ¡estamos registrados como Merlín! Siento el poder mágico.

Siguiente: a veces denegar el acceso no es tan sencillo como comprobar un rol. Por ejemplo, ¿qué pasaría si tuvieras una página de edición de preguntas y ésta tuviera que ser accesible sólo para el creador de esa pregunta? Es el momento de descubrir un poderoso sistema dentro de Symfony llamado votantes.
