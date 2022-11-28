# AbstractLoginFormAuthenticator y redireccionamiento a la URL anterior

Tengo que confesar algo: en nuestro autentificador, ¡hemos hecho demasiado trabajo! Sí, cuando construyes un autenticador personalizado para un "formulario de inicio de sesión", Symfony proporciona una clase base que puede hacer la vida mucho más fácil. En lugar de extender `AbstractAuthenticator` extiende`AbstractLoginFormAuthenticator`:

[[[ code('af94d77b5d') ]]]

Mantén `Command` o `Ctrl` para abrir esa clase. Sí, extiende `AbstractAuthenticator`y también implementa `AuthenticationEntryPointInterface`. ¡Genial! Eso significa que podemos eliminar nuestro redundante `AuthenticationEntryPointInterface`:

[[[ code('dd9c4f1277') ]]]

La clase abstracta requiere que añadamos un nuevo método llamado `getLoginUrl()`. Dirígete a la parte inferior de esta clase y ve a "Código"->"Generar" -o `Command`+`N` en un Mac- y luego a "Implementar métodos" para generar `getLoginUrl()`. Para el interior, roba el código de arriba... y devuelve `$this->router->generate('app_login')`:

[[[ code('c6bbfeee02') ]]]

La utilidad de esta clase base es bastante fácil de ver: ¡implementa tres de los métodos por nosotros! Por ejemplo, implementa `supports()` comprobando si el método es POST y si la cadena `getLoginUrl()` coincide con la URL actual. En otras palabras, hace exactamente lo mismo que nuestro método `supports()`. También gestiona`onAuthenticationFailure()` -almacenando el error en la sesión y redirigiendo de nuevo a la página de inicio de sesión- y también el punto de entrada - `start()` - redirigiendo, una vez más, a `/login`.

Esto significa que... oh sí... ¡podemos eliminar código! Veamos: eliminar `supports()`,`onAuthenticationFailure()` y también `start()`:

[[[ code('330f716792') ]]]

Mucho más bonito:

[[[ code('7d180a1d61') ]]]

Asegurémonos de que no rompemos nada: vamos a `/admin` y... ¡perfecto! El método `start()` nos sigue redirigiendo a `/login`. Entremos con`abraca_admin@example.com`, contraseña `tada` y... ¡sí! Eso también sigue funcionando: nos redirige a la página de inicio... porque eso es lo que estamos haciendo dentro de`onAuthenticationSuccess`:

[[[ code('447c13013f') ]]]

## TargetPathTrait: Redirección inteligente

Pero... si lo piensas... eso no es lo ideal. Ya que en un principio intentaba ir a `/admin`... ¿no debería el sistema ser lo suficientemente inteligente como para redirigirnos de nuevo allí después de que hayamos entrado con éxito? Sí Y eso es totalmente posible.

Vuelve a cerrar la sesión. Cuando un usuario anónimo intenta acceder a una página protegida como `/admin`, justo antes de llamar a la función del punto de entrada, Symfony almacena la URL actual en algún lugar de la sesión. Gracias a esto, en `onAuthenticationSuccess()`, podemos leer esa URL -que se denomina "ruta de destino"- y redirigirla allí.

Para ayudarnos a hacer esto, ¡podemos aprovechar un trait! En la parte superior de la clase`use TargetPathTrait`:

[[[ code('e38933e9b5') ]]]

Luego, abajo, en `onAuthenticationSuccess()`, podemos comprobar si se ha almacenado una "ruta de destino" en la sesión. Lo hacemos diciendo si`$target = $this->getTargetPath()` - pasando la sesión -`$request->getSession()` - y luego el nombre del cortafuegos, que en realidad tenemos como argumento. Esa es la clave `main`:

[[[ code('69dd96e2b4') ]]]

Esta línea hace dos cosas a la vez: establece una variable `$target` a la ruta de destino y, en la sentencia if, comprueba si ésta tiene algo. Porque, si el usuario va directamente a la página de inicio de sesión, entonces no tendrá una ruta de destino en la sesión.

Así que, si tenemos una ruta de destino, redirige a ella: `return new RedirectResponse($target)`:

[[[ code('8194d2af2b') ]]]

¡Hecho y listo! Si mantienes `Command` o `Ctrl` y haces clic en `getTargetPath()` para saltar a ese método central, puedes ver que es súper sencillo: sólo lee una clave muy específica de la sesión. Esta es la clave que el sistema de seguridad establece cuando un usuario anónimo intenta acceder a una página protegida.

¡Vamos a probar esto! Ya hemos cerrado la sesión. Dirígete a `/admin`. Nuestro punto de entrada nos redirige a `/login`. Pero además, entre bastidores, Symfony acaba de fijar la URL`/admin` en esa clave de la sesión. Así que cuando nos conectamos ahora con nuestro correo electrónico y contraseña habituales... ¡impresionante! ¡Se nos redirige de nuevo a `/admin`!

Siguiente: um... seguimos haciendo demasiado trabajo en `LoginFormAuthenticator`. ¡Maldita sea! Resulta que, a menos que necesitemos algunas cosas especialmente personalizadas, si estás construyendo un formulario de inicio de sesión, puedes omitir por completo la clase del autentificador personalizado y confiar en un autentificador central de Symfony.
