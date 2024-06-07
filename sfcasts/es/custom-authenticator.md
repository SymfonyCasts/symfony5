# Método personalizado authenticator authenticate()

Actualmente estamos convirtiendo nuestro antiguo autenticador Guard al nuevo sistema de autenticadores. Y, muy bien, estos dos sistemas comparten algunos métodos, como `supports()`,`onAuthenticationSuccess()` y `onAuthenticationFailure()`.

La gran diferencia está dentro del nuevo método `authenticate()`. En el antiguo sistema Guard, dividimos la autenticación en varios métodos. Teníamos `getCredentials()`, donde obteníamos cierta información, `getUser()`, donde encontrábamos el objeto `User`, y`checkCredentials()`, donde comprobábamos la contraseña. Estas tres cosas se combinan ahora en el método `authenticate()`... con algunas bonificaciones. Por ejemplo, como verás en un segundo, ya no es responsabilidad nuestra comprobar la contraseña. Eso ahora ocurre automáticamente.

## El objeto Pasaporte

Nuestro trabajo en `authenticate()` es sencillo: devolver un `Passport`. Sigue adelante y añade un tipo de retorno`Passport`. Esto es realmente necesario en Symfony 6. No se añadió automáticamente debido a una capa de desaprobación y al hecho de que el tipo de retorno cambió de `PassportInterface` a `Passport` en Symfony 5.4.

[[[ code('224d189c16') ]]]

En cualquier caso, este método devuelve un `Passport`... así que hazlo: `return new Passport()`. Por cierto, si eres nuevo en el sistema de autenticadores personalizados y quieres aprender más, echa un vistazo a nuestro [Tutorial de seguridad de Symfony 5](https://symfonycasts.com/screencast/symfony5-security) donde hablamos de todo esto. Ahora repasaré lo básico, pero los detalles están ahí.

Antes de rellenar el `Passport`, coge toda la información del `Request` que necesitemos... pega... luego establece cada uno de estos como variables:`$email =`, `$password =`... y preocupémonos del token CSRF más tarde.

[[[ code('bf93e07d3e') ]]]

El primer argumento del `Passport` es un `new UserBadge()`. Lo que pasas aquí es el identificador de usuario. ¡En nuestro sistema, nos identificamos a través del correo electrónico, así que pasa`$email`!

Y... si quieres, puedes detenerte aquí. Si sólo pasas un argumento a`UserBadge`, Symfony utilizará el "proveedor de usuario" de `security.yaml` para encontrar a ese usuario. Estamos utilizando un proveedor `entity`, que le dice a Symfony que intente consultar el objeto `User` en la base de datos a través de la propiedad `email`.

## Consulta de usuario personalizada opcional

En el sistema antiguo, hacíamos todo esto manualmente consultando el `UserRepository`. Eso ya no es necesario. Pero a veces... si tienes una lógica personalizada, puede que aún necesites encontrar al usuario manualmente.

Si tienes este caso de uso, pasa un `function()` al segundo argumento que acepta un argumento `$userIdentifier`. Ahora, cuando el sistema de autenticación necesite el objeto Usuario, llamará a nuestra función y nos pasará el "identificador de usuario"... que será lo que hayamos pasado al primer argumento. Es decir, el correo electrónico.

Nuestro trabajo consiste en utilizarlo para devolver el usuario. Empieza con`$user = $this->entityManager->getRepository(User::class)`

Y sí, podría haber inyectado el `UserRepository` en lugar del gestor de entidades... eso sería mejor... pero esto está bien. Luego`->findOneBy(['email' => $userIdentifier])`.

Si no encontramos ningún usuario, necesitamos `throw` a `new UserNotFoundException()`. Luego, `return $user`.

[[[ code('77bc8de249') ]]]

El primer argumento `Passport` ¡ya está!

## ContraseñaCredenciales

Para el segundo argumento, aquí abajo, cambia mi mal punto y coma por una coma - entonces di`new PasswordCredentials()` y pasa esto al enviado `$password`.

[[[ code('7568ad9eac') ]]]

¡Eso es todo lo que necesitamos! Así es: ¡no necesitamos comprobar la contraseña! Pasamos un `PasswordCredentials()`... ¡y luego otro sistema se encarga de comprobar la contraseña enviada con la contraseña hash de la base de datos! ¿No es genial?

## Insignias adicionales

Por último, `Passport` acepta una matriz opcional de "insignias", que son "cosas" extra que quieres añadir... normalmente para activar otras funciones.

Nosotros sólo necesitamos pasar una: una `new CsrfTokenBadge()`. Esto se debe a que nuestro formulario de acceso está protegido por un token CSRF. Antes, lo comprobábamos manualmente. ¡Lamentable!

¡Pero ya no! Pasa la cadena `authenticate` al primer argumento... que sólo tiene que coincidir con la cadena utilizada cuando generamos el token en la plantilla:`login.html.twig`. Si busco `csrf_token`... ¡ahí está!

Para el segundo argumento, pasa el token CSRF enviado:`$request->request->get('_csrf_token')`, que también puedes ver en el formulario de acceso.

[[[ code('a7e461d829') ]]]

Y... ¡listo! Sólo con pasar la insignia, se validará el token CSRF.

Ah, y aunque no hace falta que lo hagamos, también voy a pasar un`new RememberMeBadge()`. Si utilizas el sistema "Recuérdame", entonces necesitas pasar esta insignia. Indica al sistema que "aceptas" que se establezca una cookie "Recuérdame" si el usuario inicia sesión utilizando este autenticador. Pero aún necesitas tener una casilla de verificación "Recuérdame" aquí... para que funcione. O, para activarlo siempre, añade `->enable()` en la insignia.

[[[ code('8acb02ab56') ]]]

Y, por supuesto, nada de esto funcionará a menos que actives el sistema `remember_me`en tu cortafuegos, cosa que aún no tengo. Seguirá siendo seguro añadir esa insignia... pero no habrá ningún sistema que la procese y añada la cookie. Por lo tanto, la insignia será ignorada.

## ¡Borrar métodos antiguos!

En fin, ¡ya hemos terminado! Si eso te ha parecido abrumador, retrocede y mira nuestro tutorial sobre Seguridad en Symfony para obtener más contexto.

Lo bueno es que ya no necesitamos `getCredentials()`, `getUser()`,`checkCredentials()`, ni `getPassword()`. Todo lo que necesitamos es`authenticate()`, `onAuthenticationSuccess()`, `onAuthenticationFailure()`, y`getLoginUrl()`. Incluso podemos celebrarlo aquí eliminando un montón de viejas declaraciones de uso. ¡Sí!

Ah, y mira el constructor. Ya no necesitamos `CsrfTokenManagerInterface`ni `UserPasswordHasherInterface`: ambas comprobaciones se hacen ahora en otra parte. Y... eso nos da dos sentencias `use` más que eliminar.

[[[ code('4d91137ae4') ]]]

## Activar el nuevo sistema de seguridad

Llegados a este punto, nuestro único autentificador personalizado se ha trasladado al nuevo sistema de autentificadores. Esto significa que, en `security.yaml`, ¡estamos listos para cambiar al nuevo sistema! Di `enable_authenticator_manager: true`.

[[[ code('d73484c8b8') ]]]

Y estos autentificadores personalizados ya no están bajo una clave `guard`. En su lugar, añade `custom_authenticator` y añade esto directamente debajo.

[[[ code('7ade8ffdcc') ]]]

Vale, ¡llegó la hora de la verdad! Acabamos de cambiar completamente al nuevo sistema. ¿Funcionará? Vuelve a la página de inicio, recarga y... ¡funciona! ¡Y echa un vistazo a esas depreciaciones! Hemos pasado de unas 45 a 4. ¡Woh!

Algunas de ellas están relacionadas con otro cambio de seguridad. A continuación: actualicemos al nuevo `password_hasher` y comprobemos un nuevo comando para depurar cortafuegos de seguridad.
