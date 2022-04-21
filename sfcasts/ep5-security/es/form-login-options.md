# Más configuración de form_login

Utilizar `form_login` no es tan flexible como una clase de autentificador personalizada... aunque se pueden configurar muchas cosas.

Por ejemplo, ahora mismo, no comprueba nuestro token CSRF. Habilita eso diciendo `enable_csrf: true`:

[[[ code('09a3e4b868') ]]]

¡Eso es! En las opciones, cuando activas la protección CSRF, busca un campo oculto llamado `_csrf_token` con la cadena `authenticate` utilizada para generarlo. Afortunadamente, en nuestra plantilla, ya estamos utilizando ambas cosas... así que esto va a funcionar.

## Ver la lista completa de opciones

Y hay aún más formas de configurarlo. Recuerda: para obtener esta configuración, he ejecutado `debug:config security`... que muestra tu configuración actual, incluyendo los valores por defecto. Pero aquí no se muestran todas las opciones. Para ver una lista completa, ejecuta`config:dump security`.

```terminal-silent
symfony console config:dump security
```

En lugar de mostrar tu configuración actual, esto muestra una enorme lista de configuraciones de ejemplo. Esta es una lista mucho más grande... aquí está `form_login`. Mucho de esto lo hemos visto antes... pero `success_handler` y `failure_handler` son nuevos. Puedes buscarlos en la documentación para aprender a controlar lo que ocurre tras el éxito o el fracaso.

Pero también, más adelante, vamos a conocer una forma más global de engancharse al proceso de éxito o fracaso registrando un oyente de eventos.

## Renderización de "último_nombre_de_usuario" en el formulario de inicio de sesión

De todos modos, ya no vamos a utilizar nuestro `LoginFormAuthenticator`, así que puedes eliminarlo.

Y... ¡Tengo buenas noticias! ¡El autentificador principal está haciendo una cosa que nuestra clase nunca hizo! En `authenticate()`... llama a `getCredentials()` para leer los datos POST. Déjame buscar "sesión"... ¡yup! Esto me llevó a`getCredentials()`. De todos modos, después de coger el correo electrónico enviado - en este código que se almacena como `$credentials['username']` - guarda ese valor en la sesión.

Lo hace para que, si falla la autenticación, podamos leerlo y rellenar previamente la casilla del correo electrónico en el formulario de acceso.

¡Vamos a hacerlo! Ve a nuestro controlador: `src/Controller/SecurityController.php`. Este`AuthenticationUtils` tiene otro método útil. Pasa una nueva variable a la plantilla llamada `last_username` -puedes llamarla `last_email` si quieres- y ponla en `$authenticationUtils->getLastUsername()`:

[[[ code('55833098cd') ]]]

Una vez más, esto es sólo un ayudante para leer una clave específica de la sesión.

Ahora, en la plantilla - `login.html.twig` - aquí arriba en el campo de correo electrónico, añade`value="{{ last_username }} "`:

[[[ code('6dd9591db8') ]]]

¡Genial! Si vamos a `/login`... ¡ya está ahí por haber rellenado el formulario hace un minuto! Si introducimos un correo electrónico diferente... ¡sí! Eso también se pega.

A continuación: volvamos a la autorización aprendiendo a denegar el acceso en un controlador... de varias maneras.
