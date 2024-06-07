# Método personalizado del autentificador authenticate()

Actualmente estamos convirtiendo nuestro antiguo autentificador de la Guardia en el nuevo sistema de autentificación. Y... estos dos sistemas comparten muchos métodos, como `supports()`,`onAuthenticationSuccess()` y `onAuthenticationFailure()`.

La gran diferencia está en el nuevo método `authenticate()`. En el antiguo sistema Guard, dividimos la autenticación en varios métodos. Teníamos `getCredentials()`, en el que cogíamos alguna información, `getUser()`, en el que encontrábamos el objeto `User`, y`checkCredentials()`, en el que comprobábamos la contraseña. Estas tres cosas se combinan ahora en el método `authenticate()`... con algunas bonificaciones. Por ejemplo, como verás en un segundo, ya no es nuestra responsabilidad comprobar la contraseña. Eso ahora ocurre automáticamente.

## El objeto Pasaporte

Nuestro trabajo en `authenticate()` es sencillo: devolver un `Passport`. Sigue adelante y añade un tipo de retorno`Passport`. Esto es realmente necesario en Symfony 6. No se añadió automáticamente debido a una capa de desaprobación y al hecho de que el tipo de retorno cambió de `PassportInterface` a `Passport` en Symfony 5.4.

De todos modos, este método devuelve un `Passport` aquí... así que hazlo: `return new Passport()`. Por cierto, si eres nuevo en el nuevo sistema de autentificadores personalizados y quieres aprender más, echa un vistazo a nuestro [tutorial de seguridad de Symfony 5](https://symfonycasts.com/screencast/symfony5-security) donde hablamos de todo esto. Ahora repasaré lo básico, pero los detalles están allí.

Antes de rellenar el `Passport`, coge toda la información del `Request` que necesitemos... pega... y luego establece cada una de ellas como variables:`$email =`, `$password =`... y preocupémonos del token CSRF más tarde.

El primer argumento del `Passport()` es un `new UserBadge()`. Lo que se pasa aquí es el identificador del usuario. ¡En nuestro sistema, nos registramos a través del correo electrónico, así que pasa`$email`!

Y... si quieres, puedes parar aquí. Si pasas sólo un argumento a`UserBadge`, Symfony utilizará tu "proveedor de usuario" de `security.yaml` para encontrar ese usuario. Nosotros estamos usando un proveedor `entity`, que le dice a Symfony que intente consultar el objeto `User` en la base de datos a través de la propiedad `email`.

## Consulta personalizada opcional del usuario

En el sistema antiguo, hacíamos todo esto manualmente consultando el `UserRepository`. Eso ya no es necesario... pero a veces... si tienes una lógica personalizada, todavía querrás encontrar al usuario manualmente.

Si tienes este caso de uso, pasa un `function()` como segundo argumento que acepte un argumento `$userIdentifier`. Con esta configuración, cuando el sistema de autenticación necesite el objeto Usuario, llamará a nuestra función y nos pasará el "identificador de usuario"... que será lo que hayamos pasado al primer argumento. Es decir, el correo electrónico.

Nuestro trabajo es utilizarlo para devolver el usuario. Comienza con`$user = $this->entityManager->getRepository(User::class)`

Y sí, podría haber inyectado el `UserRepository` en lugar del gestor de entidades. Eso sería mejor... pero esto está bien. Luego `->findOneBy(['email' => $userIdentifier])`.

Si no encontramos un usuario, necesitamos `throw` a `new UserNotFoundException()`. Luego, `return $user`.

¡El primer argumento `Passport` está hecho!

## ContraseñaCredenciales

Para el segundo argumento, aquí abajo, cambia mi mal punto y coma por una coma - entonces di`new PasswordCredentials()` y pasa esto el enviado `$password`.

Eso es todo lo que tenemos que hacer aquí. Sí, no necesitamos comprobar realmente la contraseña. Pasamos un `PasswordCredentials()`... y luego hay otro sistema que se encarga de comprobar la contraseña enviada con la contraseña con hash en la base de datos. ¿No es genial?

## Insignias adicionales

Por último, el `Passport` acepta una matriz de "insignias", que son "cosas" extra que quieres añadir... normalmente para activar otras funciones.

Nosotros sólo necesitamos pasar uno: un `new CsrfTokenBadge()`. Esto se debe a que nuestro formulario de acceso está protegido por un token CSRF. Antes, lo comprobábamos manualmente. ¡Qué pena!

Pero ya no necesitamos hacerlo. Pasa la cadena `authenticate` al primer argumento... que sólo tiene que coincidir con la cadena utilizada cuando generamos el token en la plantilla: `login.html.twig`. Si busco `csrf_token`... ¡ahí está! utiliza la misma cadena que utilizamos aquí.

Para el segundo argumento, pasa el token CSRF enviado:`$request->request->get('_csrf_token')`, que también puedes ver en el formulario de acceso.

Y... ¡listo! Sólo con pasar la insignia, el token CSRF será validado.

Ah, y aunque no es necesario hacerlo, también voy a pasar un`new RememberMeBadge()`. Si utilizas el sistema "Recuérdame", entonces sí necesitas pasar esta insignia. Indica al sistema que "aceptas" que se
establezca una cookie "Recuérdame" si el usuario inicia sesión utilizando este autenticador. Pero aún necesitas tener una casilla de verificación "Recuérdame" aquí... para que funcione. O, para activarlo siempre, añade `->enable()` en la insignia.

Y, por supuesto, nada de esto funcionará a menos que actives el sistema `remember_me`en tu cortafuegos, lo cual aún no tengo. Sigue siendo seguro añadir esa placa... pero no habrá ningún sistema que la procese y añada la cookie.

## ¡Eliminación de métodos antiguos!

De todos modos, ¡hemos terminado! Si eso te pareció abrumador, retrocede y mira nuestro tutorial de seguridad de Symfony para obtener más contexto.

Lo bueno es que ya no necesitamos `getCredentials()`, `getUser()`,`checkCredentials()`, o `getPassword()`. Todo lo que necesitamos es`authenticate()`, `onAuthenticationSuccess()`, `onAuthenticationFailure()`, y`getLoginUrl()`. Incluso podemos celebrarlo aquí eliminando un montón de viejas declaraciones de uso. ¡Sí!

Ah, y mira el constructor aquí. Ya no necesitamos `CsrfTokenManagerInterface`ni `UserPasswordHasherInterface`: ambas comprobaciones se hacen en otro lugar no por nosotros. Y eso nos da dos declaraciones de uso más para eliminar.

## Activar el nuevo sistema de seguridad

Llegados a este punto, nuestro único autentificador personalizado se ha trasladado al nuevo sistema de autentificación. Esto significa que, en `security.yaml`, estamos preparados para cambiar al nuevo sistema. Digamos `enable_authenticator_manager: true`.

Y estos autentificadores personalizados ya no están bajo una clave `guard`. En su lugar, añade `custom_authenticator` y añade esto directamente debajo.

Bien, ¡el momento de la verdad! Acabamos de cambiar completamente al nuevo sistema. ¿Funcionará? Vuelve a la página de inicio, recarga y... ¡funciona! ¡Y fíjate en las depreciaciones! Hemos pasado de unas 45 a 4. ¡Woh!

Y algunas de ellas están relacionadas con otro cambio de seguridad. A continuación: actualicemos al nuevo `password_hasher` y comprobemos un nuevo comando para depurar los cortafuegos de seguridad.