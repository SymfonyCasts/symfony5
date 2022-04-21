# El autentificador y el pasaporte

A nivel básico, autenticar a un usuario cuando enviamos el formulario de acceso es... bastante sencillo. Tenemos que leer el `email` enviado, consultar la base de datos para ese objeto`User`... y finalmente comprobar la contraseña del usuario.

## La seguridad de Symfony no ocurre en un controlador

Lo raro del sistema de seguridad de Symfony es que... no vamos a escribir esta lógica en el controlador. No. Cuando hagamos un POST a `/login`, nuestro autentificador va a interceptar esa petición y hará todo el trabajo por sí mismo. Sí, cuando enviemos el formulario de inicio de sesión, nuestro controlador en realidad nunca se ejecutará.

## El método supports()

Ahora que nuestro autentificador está activado, al inicio de cada petición, Symfony llamará al método `supports()` de nuestra clase. Nuestro trabajo es devolver `true` si esta petición "contiene información de autenticación que sabemos procesar". Si no, devolvemos `false`. Si devolvemos `false`, no fallamos en la autenticación: sólo significa que nuestro autenticador no sabe cómo autenticar esta petición... y la petición continúa procesándose con normalidad... ejecutando cualquier controlador con el que coincida.

Así que pensemos: ¿cuándo queremos que nuestro autenticador "haga su trabajo"? ¿Qué peticiones "contienen información de autenticación que sabemos procesar"? La respuesta es: siempre que el usuario envíe el formulario de inicio de sesión.

Dentro de `supports()` devuelve true si `$request->getPathInfo()` -es un método elegante para obtener la URL actual- es igual a `/login` y si `$request->isMethod('POST')`:

[[[ code('7d0098ac83') ]]]

Así que si la petición actual es un POST a `/login`, queremos intentar autentificar al usuario. Si no, queremos permitir que la petición continúe de forma normal.

Para ver lo que ocurre a continuación, baja en `authenticate()`, `dd('authenticate')`:

***TIP
`PassportInterface` está obsoleto desde Symfony 5.4: utiliza en su lugar `Passport` como tipo de retorno.
***

[[[ code('743dc917b8') ]]]

¡Hora de probar! Ve a actualizar la página de inicio. ¡Sí! El método `supports()` devolvía`false`... y la página seguía cargándose con normalidad. En la barra de herramientas de depuración de la web, tenemos un nuevo icono de seguridad que dice "Autenticado: no". Pero ahora ve al formulario de inicio de sesión. Esta página sigue cargándose con normalidad. Introduce `abraca_admin@example.com` -que es el correo electrónico de un usuario real de la base de datos- y una contraseña cualquiera -yo utilizaré `foobar`-. Envíalo y... ¡lo tienes! ¡Ha llegado a nuestro `dd('authenticate')`!

## El método authenticate()

Así que si `supports()` devuelve true, Symfony llama a `authenticate()`. Este es el corazón de nuestro autentificador... y su trabajo es comunicar dos cosas importantes. En primer lugar, quién es el usuario que está intentando iniciar sesión -en concreto, qué objeto de`User` es- y, en segundo lugar, alguna prueba de que es ese usuario. En el caso de un formulario de acceso, eso sería una contraseña. Como nuestros usuarios aún no tienen contraseña, la falsificaremos temporalmente.

## El objeto Pasaporte: UserBadge y Credenciales

Comunicamos estas dos cosas devolviendo un objeto `Passport`: return new`Passport()`:

[[[ code('7ff1720cce') ]]]

Este simple objeto es básicamente un contenedor de cosas llamadas "insignias"... donde una insignia es un pequeño trozo de información que va en el pasaporte. Las dos insignias más importantes son `UserBadge` y una especie de "insignia de credenciales" que ayuda a demostrar que este usuario es quien dice ser.

Empieza por coger el correo electrónico y la contraseña que te han enviado:`$email = $request->request->get('email')`. Si no lo has visto antes,`$request->request->get()` es la forma de leer los datos de `POST` en Symfony. En la plantilla de inicio de sesión, el nombre del campo es `email`... así que leemos el campo POST `email`. Copia y pega esta línea para crear una variable `$password` que lea el campo`password` del formulario:

[[[ code('5143281c67') ]]]

A continuación, dentro del `Passport`, el primer argumento es siempre el `UserBadge`. Di`new UserBadge()` y pásale nuestro "identificador de usuario". Para nosotros, ese es el `$email`:

[[[ code('21f09737a4') ]]]

Hablaremos muy pronto de cómo se utiliza esto.

El segundo argumento de `Passport` es una especie de "credencial". Eventualmente le pasaremos un `PasswordCredentials()`.... pero como nuestros usuarios aún no tienen contraseñas, utiliza un nuevo `CustomCredentials()`. Pásale una devolución de llamada con un argumento `$credentials`y un argumento `$user` de tipo-indicado con nuestra clase `User`:

[[[ code('cc26c9624a') ]]]

Symfony ejecutará nuestra llamada de retorno y nos permitirá "comprobar las credenciales" de este usuario de forma manual... sea lo que sea que eso signifique en nuestra aplicación. Para empezar, `dd($credentials, $user)`. Ah, y `CustomCredentials` necesita un segundo argumento, que es cualquiera de nuestras "credenciales". Para nosotros, eso es `$password`:

[[[ code('f033f60434') ]]]

Si esto de `CustomCredentials` es un poco confuso, no te preocupes: realmente tenemos que ver esto en acción.

Pero en un nivel alto... es algo genial. Devolvemos un objeto `Passport`, que dice quién es el usuario -identificado por su `email` - y una especie de "proceso de credenciales" que probará que el usuario es quien dice ser.

Bien: con sólo esto, vamos a probarlo. Vuelve al formulario de acceso y vuelve a enviarlo. Recuerda: hemos rellenado el formulario con una dirección de correo electrónico que sí existe en nuestra base de datos.

Y... ¡impresionante! `foobar` es lo que envié para mi contraseña y también está volcando el objeto de entidad `User` correcto de la base de datos! Así que... ¡oh! De alguna manera, supo consultar el objeto `User` utilizando ese correo electrónico. ¿Cómo funciona eso?

La respuesta es el proveedor de usuarios Vamos a sumergirnos en eso a continuación, para saber cómo podemos hacer una consulta personalizada para nuestro usuario y terminar el proceso de autenticación.
