# Personalizar los mensajes de error y añadir el cierre de sesión

Cuando falla el inicio de sesión, almacenamos el `AuthenticationException` en la sesión -que explica lo que ha ido mal- y luego redirigimos a la página de inicio de sesión:

[[[ code('9252e2de82') ]]]

En esa página, leemos esa excepción de la sesión utilizando este bonito servicio`AuthenticationUtils`:

[[[ code('1c1ebcec46') ]]]

Y finalmente, en la plantilla, llamamos al método `getMessageKey()` para mostrar un mensaje seguro que describa por qué ha fallado la autenticación:

[[[ code('2a83126eb5') ]]]

Por ejemplo, si introducimos un correo electrónico que no existe, veremos

> No se pudo encontrar el nombre de usuario.

A nivel técnico, esto significa que no se ha podido encontrar el objeto `User`. Genial... pero para nosotros no es un gran mensaje porque nos estamos conectando a través de un correo electrónico. Además, si introducimos un usuario válido - `abraca_admin@example.com` - con una contraseña no válida, vemos

> Credenciales no válidas.

Este es un mensaje mejor... pero no es súper amigable.

## ¿Traducción de los mensajes de error?

Entonces, ¿cómo podemos personalizarlos? La respuesta es sencilla y... quizá un poco sorprendente: los traducimos. Compruébalo: en la plantilla, después de `messageKey`, añade`|trans` para traducirlo. Pásale dos argumentos. El primero es `error.messageData`. No es demasiado importante... pero en el mundo de la traducción, a veces tus traducciones pueden tener valores "comodín"... y aquí pasas los valores de esos comodines. El segundo argumento se llama "dominio de traducción"... que es casi como una categoría de traducción. Pasa `security`:

[[[ code('cbbe36edc0') ]]]

Si tienes un sitio multilingüe, todos los mensajes centrales de autentificación ya han sido traducidos a otros idiomas... y esas traducciones están disponibles en un dominio llamado `security`. Así que al utilizar el dominio `security` aquí, si cambiamos el sitio al español, obtendríamos instantáneamente mensajes de autenticación en español.

Si nos detuviéramos ahora... ¡no cambiaría absolutamente nada! Pero como estamos pasando por el traductor, tenemos la oportunidad de "traducir" estas cadenas del inglés a... ¡un inglés diferente!

En el directorio `translations/` -que deberías tener automáticamente porque el componente de traducción ya está instalado- crea un nuevo archivo llamado`security.en.yaml`: `security` porque estamos utilizando el dominio de traducción `security` y `en` para el inglés. También puedes crear archivos de traducción `.xlf` - YAML es simplemente más fácil para lo que necesitamos hacer.

Ahora, copia el mensaje de error exacto, incluyendo el punto, pégalo -lo envolveré entre comillas para estar seguro- y pon algo diferente como

> ¡Contraseña no válida introducida!

[[[ code('54fa2fd217') ]]]

¡Genial! Intentémoslo de nuevo. Entra como `abraca_admin@example.com` con una contraseña no válida y... ¡mucho mejor! Probemos con un correo electrónico incorrecto.

Bien, repite el proceso: copia el mensaje, ve al archivo de traducción, pégalo... y cámbialo por algo un poco más fácil de usar como

> ¡Email no encontrado!

[[[ code('5a99fcf551') ]]]

Intentémoslo de nuevo: el mismo correo electrónico, cualquier contraseña y... ¡ya está!

> Correo electrónico no encontrado.

¡Muy bien! ¡Nuestro autentificador está hecho! Cargamos el `User` desde el correo electrónico, comprobamos su contraseña y manejamos tanto el éxito como el fracaso. ¡Booya! Vamos a añadir más cosas a esto más adelante -incluyendo la comprobación de contraseñas de usuarios reales- pero esto es totalmente funcional.

## Cerrar la sesión

Vamos a añadir una forma de cerrar la sesión. Así... como si el usuario fuera a `/logout`, se... ¡se cierra la sesión! Esto empieza exactamente como esperas: necesitamos una ruta y un controlador.

Dentro de `SecurityController`, copiaré el método `login()`, lo pegaré, lo cambiaré a `/logout`, `app_logout` y llamaré al método `logout`:

[[[ code('3568dae894') ]]]

Para realizar el cierre de sesión propiamente dicho... no vamos a poner absolutamente nada de código en este método. En realidad, lanzaré un nuevo `\Exception()` que diga "logout() nunca debe ser alcanzado":

[[[ code('34d6cf405b') ]]]

Deja que me explique. El cierre de sesión funciona un poco como el inicio de sesión. En lugar de poner alguna lógica en el controlador, vamos a activar algo en nuestro cortafuegos que diga

> Si el usuario va a `/logout`, intercepta esa petición, cierra la sesión del usuario
> y redirígelo a otro lugar.

Para activar esa magia, abre `config/packages/security.yaml`. En cualquier lugar de nuestro cortafuegos, añade `logout: true`:

[[[ code('4e44f617e9') ]]]

Internamente, esto activa un "oyente" que busca cualquier petición a `/logout`.

## Configurar el cierre de sesión

Y en realidad, en lugar de decir simplemente `logout: true`, puedes personalizar cómo funciona esto. Busca tu terminal y ejecuta:

```terminal
symfony console debug:config security
```

Como recordatorio, este comando te muestra toda tu configuración actual bajo la clave `security`. Así que toda nuestra configuración más los valores por defecto.

Si ejecutamos esto... y encontramos el cortafuegos `main`... mira la sección `logout`. Todas estas claves son los valores por defecto. Observa que hay una llamada`path: /logout`. Por eso está escuchando la URL `/logout`. Si quisieras cerrar la sesión a través de otra URL, sólo tendrías que modificar esta clave aquí.

Pero como aquí tenemos `/logout`... y eso coincide con nuestro `/logout` de aquí, esto debería funcionar. Por cierto, quizá te preguntes por qué necesitamos crear una ruta y un controlador ¡Buena pregunta! En realidad no necesitamos un controlador, nunca será llamado. Pero sí necesitamos una ruta. Si no tuviéramos una, el sistema de rutas provocaría un error 404 antes de que el sistema de cierre de sesión pudiera hacer su magia. Además, es bueno tener una ruta, para poder generar una URL hacia ella.

Bien: ¡probemos esto! Primero inicia sesión: `abraca_admin@example.com` y contraseña `tada`. Genial: estamos autentificados. Ve manualmente a `/logout` y... ¡ya hemos cerrado la sesión! El comportamiento por defecto del sistema es cerrar la sesión y redirigirnos a la página de inicio. Si necesitas personalizarlo, hay algunas opciones. En primer lugar, en la clave `logout`, puedes cambiar `target` por alguna otra URL o nombre de ruta.

Pero también podemos engancharnos al proceso de cierre de sesión a través de un oyente de eventos, un tema del que hablaremos hacia el final del tutorial.

Siguiente: vamos a dar a cada usuario una contraseña real. Esto implicará hacer un hash de las contraseñas, para poder almacenarlas de forma segura en la base de datos, y luego comprobar esas contraseñas hash durante la autenticación. Symfony facilita ambas cosas.
