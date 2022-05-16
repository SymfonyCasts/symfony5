# Actualizaciones de seguridad

Es hora de arreglar estas depreciaciones para que finalmente podamos actualizar a Symfony 6. Ve a cualquier página del sitio y haz clic en las deprecaciones de la barra de herramientas de depuración web para ver la lista. Es una lista grande... pero muchas de ellas están relacionadas con lo mismo: la seguridad.

El mayor cambio -y quizás el más maravilloso- en Symfony 5.4 y Symfony 6, es el nuevo sistema de seguridad. Pero no te preocupes. No es muy diferente del antiguo... y la ruta de actualización es sorprendentemente fácil.

## UserInterface, getPassword y PasswordAuthenticatedUserInterface

Para el primer cambio, abre la entidad `User`. Además de `UserInterface`, añade un segundo `PasswordAuthenticatedUserInterface`. Hasta hace poco, `UserInterface`tenía un montón de métodos, entre ellos `getPassword()`

[[[ code('e9bfb6bfc1') ]]]

Pero... esto no siempre tenía sentido. Por ejemplo, algunos sistemas de seguridad tienen usuarios que no tienen contraseñas. Por ejemplo, si tus usuarios se conectan a través de un sistema de inicio de sesión único, entonces no hay contraseñas que manejar. Bien, el usuario puede introducir su contraseña en ese sistema... pero en lo que respecta a nuestra aplicación, no hay contraseñas.

Para hacer esto más limpio, en Symfony 6, se eliminó `getPassword()` de`UserInterface`. Así que siempre tienes que implementar `UserInterface`... pero entonces el método `getPassword()` y su `PasswordAuthenticatedUserInterface`son opcionales.

## UserInterface: getUsername() -> getUserIdentifier()

Otro cambio se refiere a `getUsername()`. Este método vive en `UserInterface`... pero su nombre siempre era confuso. Hacía parecer que era necesario tener un nombre de usuario... cuando en realidad, este método se supone que devuelve cualquier identificador de usuario único, no necesariamente un nombre de usuario. Por eso, en Symfony 6, se ha cambiado el nombre de `getUsername()` a `getUserIdentifier()`. Copia esto, pégalo, cambia `getUsername` por `getUserIdentifier()`... y ya está.

[[[ code('6d0889f816') ]]]

Por ahora tenemos que mantener `getUsername()` porque todavía estamos en Symfony 5.4... pero una vez que actualicemos a Symfony 6, podemos eliminarlo con seguridad.

## Nuevo sistema de seguridad: enable_authenticator_manager

Pero el mayor cambio en el sistema de seguridad de Symfony se encuentra en`config/packages/security.yaml`. Es este `enable_authenticator_manager`. Cuando actualizamos la receta, nos dio esta configuración... pero estaba establecida en `true`

[[[ code('3466e83445') ]]]

Esta pequeñísima línea de aspecto inocente nos permite cambiar del antiguo sistema de seguridad al nuevo. Y lo que esto significa, en la práctica, es que todas las formas de autenticación -como un autentificador personalizado o `form_login` o `http_basic` - comenzarán de repente a utilizar un sistema completamente nuevo bajo el capó.

En su mayor parte, si utilizas uno de los sistemas de autenticación integrados, como `form_login` o `http_basic`... probablemente no notarás ningún cambio. Puedes activar el nuevo sistema estableciendo esto como verdadero... y todo funcionará exactamente como antes.... aunque el código detrás de `form_login` será de repente muy diferente. En muchos sentidos, el nuevo sistema de seguridad es una refactorización interna para hacer el código del núcleo más legible y para darnos más flexibilidad, cuando la necesitemos.

## Conversión Guardia -> Autenticador personalizado

Sin embargo, si tienes algún autentificador personalizado de `guard`... como nosotros, tendrás que convertirlo al nuevo sistema de autentificadores... que de todas formas es súper divertido... ¡así que hagámoslo!

Abre nuestro autentificador personalizado: `src/Security/LoginFormAuthenticator.php`. Ya podemos ver que `AbstractFormLoginAuthenticator` del antiguo sistema está obsoleto. Cámbialo por `AbstractLoginFormAuthenticator`.

[[[ code('8ba94eb55e') ]]]

Lo sé, es casi el mismo nombre: sólo hemos intercambiado "Formulario" y "Inicio de sesión". Si tu autentificador personalizado no es para un formulario de inicio de sesión, entonces cambia tu clase a`AbstractAuthenticator`.

Ah, y ya no necesitamos implementar `PasswordAuthenticatedInterface`: eso era algo para el antiguo sistema.

## Añadir los nuevos métodos del autentificador

El antiguo sistema de guardia y el nuevo sistema de autentificador hacen lo mismo: averiguan quién está intentando iniciar sesión, comprueban la contraseña y deciden qué hacer en caso de éxito o fracaso. Pero el nuevo estilo de autentificador se siente bastante diferente. Por ejemplo, puedes ver inmediatamente que PhpStorm está furioso porque ahora tenemos que implementar un nuevo método llamado `authenticate()`.

Bien, bajaré a `supports()`, iré a "Generar código" -o "cmd" + "N" en un Mac- e implementaré ese nuevo método `authenticate()`. Este es el núcleo del nuevo sistema de autentificación... y vamos a hablar de él en unos minutos.

[[[ code('62d97273bb') ]]]

Pero los sistemas antiguo y nuevo comparten varios métodos. Por ejemplo, ambos tienen un método llamado `supports()`... pero el nuevo sistema tiene un tipo de retorno `bool`. En cuanto añadimos eso, PhpStorm se alegra.

[[[ code('e446272141') ]]]

Abajo, en `onAuthenticationSuccess()`, parece que también tenemos que añadir un tipo de retorno aquí. Al final, añade el tipo `Response` de HttpFoundation. ¡Bien! Y mientras trabajamos en este método, cambia el nombre del argumento `$providerKey` por`$firewallName`.

[[[ code('907739307b') ]]]

No hace falta que lo hagas, simplemente es el nuevo nombre del argumento... y es más claro.

A continuación, abajo, en `onAuthenticationFailure()`, añade allí también el tipo de retorno `Response`. Ah, y para `onAuthenticationSuccess()`, acabo de recordar que esto puede devolver un `Response` anulable. En algunos sistemas -como la autenticación con token de la API- no devolverá una respuesta.

[[[ code('780942b5ca') ]]]

Por último, seguimos necesitando un método `getLoginUrl()`, pero en el nuevo sistema, éste acepta un argumento `Request $request` y devuelve un `string`.

[[[ code('87b5769d3e') ]]]

Muy bien, todavía tenemos que rellenar las "tripas", pero al menos tenemos todos los métodos que necesitamos.

## Eliminación de supports() para los autentificadores de "inicio de sesión de formulario

Y de hecho, ¡podemos eliminar uno de ellos! Eliminar el método `supports()`.

[[[ code('8a3ab4b226') ]]]

Vale, este método sigue siendo necesario para los autentificadores personalizados y su función es la misma que antes. Pero, si saltas a la clase base, en el nuevo sistema, el método`supports()` está implementado para ti. Comprueba que la petición actual es un `POST` y que la URL actual es la misma que la de inicio de sesión. Básicamente, dice

> Apoyo a la autentificación de esta petición si se trata de una petición POST al formulario de inicio de sesión.

Antes escribimos nuestra lógica de forma un poco diferente, pero eso es exactamente lo que estábamos comprobando.

Bien, es hora de llegar a la carne de nuestro autentificador personalizado: el método `authenticate()`. Hagámoslo a continuación.
