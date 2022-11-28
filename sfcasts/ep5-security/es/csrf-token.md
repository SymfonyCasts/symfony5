# Sistema de eventos de seguridad y protección Csrf

Después de devolver el objeto `Passport`, sabemos que ocurren dos cosas. En primer lugar, el`UserBadge` se utiliza para obtener el objeto `User`:

[[[ code('8043d344be') ]]]

En nuestro caso, como le pasamos un segundo argumento, sólo llama a nuestra función, y nosotros hacemos el trabajo. Pero si sólo pasas un argumento, entonces el proveedor del usuario hace el trabajo.

Lo segundo que ocurre es que se "resuelve" la "placa de credenciales":

[[[ code('c2f81c4c1a') ]]]

Originalmente lo hacía ejecutando nuestra llamada de retorno. Ahora comprueba la contraseña del usuario en la base de datos.

## El sistema de eventos en acción

Todo esto está impulsado por un sistema de eventos realmente genial. Después de nuestro método `authenticate()`, el sistema de seguridad envía varios eventos... y hay un conjunto de oyentes de estos eventos que hacen diferentes trabajos. Más adelante veremos una lista completa de estos oyentes... e incluso añadiremos nuestros propios oyentes al sistema.

## UserProviderListener

Pero veamos algunos de ellos. Pulsa `Shift`+`Shift` para que podamos cargar algunos archivos del núcleo de Symfony. El primero se llama `UserProviderListener`. Asegúrate de "Incluir elementos que no sean del proyecto"... y ábrelo.

Se llama después de que devolvamos nuestro `Passport`. Primero comprueba que el`Passport` tiene un `UserBadge` -siempre lo tendrá en cualquier situación normal- y luego coge ese objeto. A continuación, comprueba si la placa tiene un "cargador de usuario": es la función que pasamos al segundo argumento de nuestro `UserBadge`. Si la placa ya tiene un cargador de usuario, como en nuestro caso, no hace nada. Pero si no lo tiene, establece el cargador de usuarios en el método `loadUserByIdentifier()` de nuestro proveedor de usuarios.

Es... un poco técnico... pero esto es lo que hace que nuestro proveedor de usuario en`security.yaml` se encargue de cargar el usuario si sólo pasamos un argumento a `UserBadge`.

## CheckCredentialsListener

Vamos a comprobar otra clase. Cierra ésta y pulsa `Shift`+`Shift` para abrir`CheckCredentialsListener`. Como su nombre indica, se encarga de comprobar las "credenciales" del usuario. Primero comprueba si el `Passport` tiene una credencial`PasswordCredentials`. Aunque su nombre no lo parezca, los objetos "credenciales" son sólo insignias... como cualquier otra insignia. Así que esto comprueba si el `Passport` tiene esa insignia y, si la tiene, coge la insignia, lee la contraseña en texto plano de ella y, finalmente aquí abajo, utiliza el hasher de contraseñas para verificar que la contraseña es correcta. Así que esto contiene toda la lógica del hash de la contraseña. Más abajo, este oyente también se encarga de la insignia `CustomCredentials`.

## Las insignias deben ser resueltas

Así que tu `Passport` siempre tiene al menos estas dos insignias: la `UserBadge` y también algún tipo de "insignia de credenciales". Una propiedad importante de las insignias es que cada una debe estar "resuelta". Puedes ver esto en `CheckCredentialsListener`. Cuando termina de comprobar la contraseña, llama a `$badge->markResolved()`. Si, por alguna razón, no se llamara a este `CheckCredentialsListener` debido a alguna configuración errónea... la insignia quedaría "sin resolver" y eso haría que la autenticación fallara. Sí, después de llamar a los listeners, Symfony comprueba que todas las insignias se han resuelto. Esto significa que puedes devolver con confianza`PasswordCredentials` y no tener que preguntarte si algo ha verificado realmente esa contraseña.

## Añadir protección CSRF

Y aquí es donde las cosas empiezan a ponerse más interesantes. Además de estas dos insignias, podemos añadir más insignias a nuestro `Passport` para activar más superpoderes. Por ejemplo, una cosa buena para tener en un formulario de inicio de sesión es la protección CSRF. Básicamente, añades un campo oculto a tu formulario que contenga un token CSRF... y luego, al enviar, validas ese token.

Hagamos esto. En cualquier lugar dentro de tu formulario, añade una entrada `type="hidden"`,`name="_csrf_token"` - este nombre podría ser cualquier cosa, pero es un nombre estándar - y luego `value="{{ csrf_token() }}"`. Pásale la cadena `authenticate`:

[[[ code('9977c4552a') ]]]

Ese `authenticate` también podría ser cualquier cosa... es como un nombre único para este formulario.

Ahora que tenemos el campo, copia su nombre y dirígete a `LoginFormAuthenticator`. Aquí, tenemos que leer ese campo de los datos POST y luego preguntar a Symfony:

> ¿Es válido este token CSRF?

Bueno, en realidad, esa segunda parte ocurrirá automáticamente.

¿Cómo? El objeto `Passport` tiene un tercer argumento: un array de otras fichas que queramos añadir. Añade una: una nueva `CsrfTokenBadge()`:

[[[ code('f3c14d4273') ]]]

Esto necesita dos cosas. La primera es el identificador del token CSRF. Digamos `authenticate`:

[[[ code('3bda663081') ]]]

esto sólo tiene que coincidir con lo que hayamos utilizado en el formulario. El segundo argumento es el valor enviado, que es `$request->request->get()` y el nombre de nuestro campo: `_csrf_token`:

[[[ code('9503679fc6') ]]]

Y... ¡ya hemos terminado! Internamente, un oyente se dará cuenta de esta insignia, validará el token CSRF y resolverá la insignia.

¡Vamos a probarlo! Ve a `/login`, inspecciona el formulario... y encuentra el campo oculto. Ahí está. Introduce cualquier correo electrónico, cualquier contraseña... pero lía el valor del token CSRF. Pulsa "Iniciar sesión" y... ¡sí! ¡Token CSRF inválido! Ahora bien, si no nos metemos con el token... y utilizamos cualquier correo electrónico y contraseña... ¡bien! El token CSRF era válido... así que continuó con el error del correo electrónico.

A continuación: vamos a aprovechar el sistema "recuérdame" de Symfony para que los usuarios puedan permanecer conectados durante mucho tiempo. Esta función también aprovecha el sistema de oyentes y una insignia.