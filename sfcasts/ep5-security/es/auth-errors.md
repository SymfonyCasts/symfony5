# Cuando falla la autenticación

Vuelve al formulario de inicio de sesión. ¿Qué ocurre si falla el inicio de sesión? En este momento, hay dos formas de fallar: si no podemos encontrar un `User` para el correo electrónico o si la contraseña es incorrecta. Probemos primero con una contraseña incorrecta.

## onAuthenticationFailure & AuthenticationException

Introduce un correo electrónico real de la base de datos... y luego cualquier contraseña que no sea "tada". Y... ¡sí! Nos encontramos con el `dd()`... que viene de `onAuthenticationFailure()`:

[[[ code('4567400b59') ]]]

Así que, independientemente de cómo fallemos la autenticación, acabamos aquí, y se nos pasa un argumento`$exception`. También vamos a tirar eso:

[[[ code('a27b26687f') ]]]

Vuelve... y actualiza. ¡Genial! Es un `BadCredentialsException`.

Esto es genial. Si la autenticación falla -no importa cómo falle- vamos a acabar aquí con algún tipo de `AuthenticationException`. `BadCredentialsException`
es una subclase de ese .... al igual que el `UserNotFoundException` que estamos lanzando desde nuestro callback del cargador de usuarios:

[[[ code('c80f79af3d') ]]]

Todas estas clases de excepción tienen algo importante en común. Mantén pulsado `Command` o`Ctrl` para abrir `UserNotFoundException` y verlo. Todas estas excepciones de autenticación tienen un método especial `getMessageKey()` que contiene una explicación segura de por qué ha fallado la autenticación. Podemos utilizarlo para informar al usuario de lo que ha ido mal.

## hide_user_not_found: Mostrar errores de nombre de usuario/correo electrónico no válidos

Así que esto es lo más importante: cuando la autenticación falla, es porque algo ha lanzado un `AuthenticationException` o una de sus subclases. Y así, como estamos lanzando un `UserNotFoundException` cuando se introduce un correo electrónico desconocido... si intentamos iniciar la sesión con un correo electrónico incorrecto, esa excepción debería pasarse a`onAuthenticationFailure()`.

Vamos a probar esa teoría. En el formulario de inicio de sesión, introduce un correo electrónico inventado... y... envía. ¡Ah! Seguimos obteniendo un `BadCredentialsException`! Esperaba que ésta fuera la verdadera excepción lanzada: la `UserNotFoundException`.

En la mayoría de los casos... así es como funciona. Si lanzas un`AuthenticationException` durante el proceso de autentificación, esa excepción se te pasa a `onAuthenticationFailure()`. Entonces puedes utilizarla para averiguar qué ha ido mal. Sin embargo, `UserNotFoundException` es un caso especial. En algunos sitios, cuando el usuario introduce una dirección de correo electrónico válida pero una contraseña incorrecta, puede que no quieras decirle al usuario que, de hecho, se encontró el correo electrónico. Así que dices "Credenciales no válidas" tanto si no se encontró el correo electrónico como si la contraseña era incorrecta.

Este problema se llama enumeración de usuarios: es cuando alguien puede probar los correos electrónicos en tu formulario de acceso para averiguar qué personas tienen cuentas y cuáles no. Para algunos sitios, definitivamente no quieres exponer esa información.

Por eso, para estar seguros, Symfony convierte `UserNotFoundException` en un`BadCredentialsException` para que introducir un correo electrónico o una contraseña no válidos dé el mismo mensaje de error. Sin embargo, si quieres poder decir "Correo electrónico no válido" -lo que es mucho más útil para tus usuarios- puedes hacer lo siguiente

Abre `config/packages/security.yaml`. Y, en cualquier lugar bajo la clave raíz `security`, añade una opción `hide_user_not_found` establecida como `false`:

[[[ code('a8f4d243a9') ]]]

Esto le dice a Symfony que no convierta `UserNotFoundException` en un `BadCredentialsException`.

Si refrescamos ahora... ¡boom! Nuestro `UserNotFoundException` se pasa ahora directamente a `onAuthenticationFailure()`.

## Almacenamiento del error de autenticación en la sesión

Bien, pensemos. En `onAuthenticationFailure()`... ¿qué queremos hacer? Nuestro trabajo en este método es, como puedes ver, devolver un objeto `Response`. Para un formulario de inicio de sesión, lo que probablemente queramos hacer es redirigir al usuario de vuelta a la página de inicio de sesión, pero mostrando un error.

Para poder hacerlo, vamos a guardar esta excepción -que contiene el mensaje de error- en la sesión. Digamos `$request->getSession()->set()`. En realidad podemos utilizar la clave que queramos... pero hay una clave estándar que se utiliza para almacenar los errores de autenticación. Puedes leerla desde una constante: `Security` - la del componente de seguridad de Symfony - `::AUTHENTICATION_ERROR`. Pasa `$exception` al segundo argumento:

[[[ code('262638317d') ]]]

Ahora que el error está en la sesión, vamos a redirigirnos a la página de inicio de sesión. Haré trampa y copiaré el `RedirectResponse` de antes... y cambiaré la ruta a`app_login`:

[[[ code('fdb1b638ff') ]]]

## AuthenticationUtils: Renderizando el error

¡Genial! A continuación, dentro del controlador `login()`, tenemos que leer ese error y renderizarlo. La forma más directa de hacerlo sería coger la sesión y leer esta clave. Pero... ¡es incluso más fácil que eso! Symfony proporciona un servicio que tomará la clave de la sesión automáticamente. Añade un nuevo argumento de tipo`AuthenticationUtils`:

[[[ code('ab7490f229') ]]]

Y luego dale a `render()` un segundo argumento. Vamos a pasar una variable `error` a Twig configurada como `$authenticationUtils->getLastAuthenticationError()`:

[[[ code('f16f02e8d4') ]]]

Eso es sólo un atajo para leer esa clave de la sesión.

Esto significa que la variable `error` va a ser literalmente un objeto`AuthenticationException`. Y recuerda, para averiguar qué ha ido mal, todos los objetos `AuthenticationException` tienen un método `getMessageKey()` que devuelve una explicación.

En `templates/security/login.html.twig`, vamos a devolver eso. Justo después del `h1`, digamos que si `error`, entonces añade un `div` con `alert alert-danger`. Dentro renderiza`error.messageKey`:

[[[ code('c9adc53e92') ]]]

No quieres usar `error.message` porque si tuvieras algún tipo de error interno -como un error de conexión a la base de datos- ese mensaje podría contener detalles sensibles. Pero `error.messageKey` está garantizado que es seguro.

¡Hora de probar! ¡Refrescar! ¡Sí! Somos redirigidos de nuevo a `/login` y vemos:

> No se ha podido encontrar el nombre de usuario.

Ese es el mensaje si no se puede cargar el objeto `User`: el error que viene de `UserNotFoundException`. No es un gran mensaje... ya que nuestros usuarios se conectan con un correo electrónico, no con un nombre de usuario.

Así que, a continuación, vamos a aprender a personalizar estos mensajes de error y a añadir una forma de cerrar la sesión.
