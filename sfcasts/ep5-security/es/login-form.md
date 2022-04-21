# Construir un formulario de inicio de sesión

Hay muchas maneras de permitir que tus usuarios se conecten... una de ellas es un formulario de conexión que carga a los usuarios desde la base de datos. Eso es lo que vamos a construir primero.

La forma más sencilla de construir un sistema de formulario de acceso es ejecutando un comando`symfony console make:auth`. Eso generará todo lo que necesitas. Pero como queremos aprender realmente la seguridad, vamos a hacerlo paso a paso... sobre todo a mano.

Antes de que empecemos a pensar en la autenticación del usuario, primero tenemos que construir una página de inicio de sesión, que... si lo piensas... ¡no tiene nada que ver con la seguridad! Es sólo una ruta, un controlador y una plantilla normales de Symfony que renderizan un formulario. Vamos a hacer un poco de trampa para hacer esto. Ejecuta:

```terminal
symfony console make:controller
```

Respuesta `SecurityController`. ¡Genial! Ve a abrir la nueva clase:`src/Controller/SecurityController.php`:

[[[ code('24aee2e699') ]]]

Aquí no hay nada demasiado sofisticado. Vamos a personalizarla para que sea una página de inicio de sesión: establece la URL como `/login`, llama a la ruta `app_login` y cambia el nombre del método a `login()`:

[[[ code('087856b4a0') ]]]

Para la plantilla, llámala `security/login.html.twig`... y no pases ninguna variable por ahora:

[[[ code('4920e303c7') ]]]

Abajo, en el directorio `templates/`, abre `templates/security/`... y cambia el nombre de la plantilla a `login.html.twig`:

[[[ code('8bf913ebce') ]]]

Para empezar, voy a sustituir completamente esta plantilla y a pegar una nueva estructura: puedes copiarla del bloque de código de esta página:

[[[ code('2aa7be2247') ]]]

Aquí no hay nada del otro mundo: extendemos `base.html.twig`, anulamos el bloque `title`... y tenemos un formulario que envía un POST de vuelta a `/login`. No tiene un atributo `action`, lo que significa que se envía de vuelta a esta misma URL. El formulario tiene dos campos -de entrada `name="email"` y de entrada `name="password"` - y un botón de envío... todo ello con clases de Bootstrap 5 para que tenga un buen aspecto.

Vamos a añadir un enlace a esta página desde `base.html.twig`. Busca el registro. Genial. Justo antes de esto, añade un enlace con `{{ path('app_login') }}`, que diga "Log In"... y dale algunas clases para que se vea bien:

[[[ code('b38c40d998') ]]]

¡Vamos a comprobarlo! Actualiza la página de inicio... y haz clic en el enlace. ¡Hola página de inicio de sesión!

Y por supuesto, si rellenamos el formulario y lo enviamos... ¡no pasa absolutamente nada! Tiene sentido. Se envía de nuevo a `/login`... pero como todavía no tenemos ninguna lógica de procesamiento de formularios... la página simplemente se vuelve a presentar.

Así que lo siguiente: vamos a escribir ese código de procesamiento. Pero... ¡sorpresa! No vivirá en el controlador. Es hora de crear un autentificador y aprender todo sobre los cortafuegos de Symfony.
