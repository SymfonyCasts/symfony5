# Las cadenas especiales ISAUTHENTICATED

Si simplemente necesitamos averiguar si el usuario está conectado o no, buscamos en `ROLE_USER`:

[[[ code('d17e63413a') ]]]

Esto funciona.... simplemente por cómo está construida nuestra aplicación: funciona porque en `getRoles()`, nos aseguramos de que todo usuario conectado tiene al menos este rol:

[[[ code('af16a6932b') ]]]

## Comprobando si Logged In: IS_AUTHENTICATED_FULLY

Genial. Pero esto me hace preguntarme: ¿hay una forma más "oficial" en Symfony de comprobar si un usuario está conectado? ¡Resulta que sí la hay! Comprobación de`is_granted('IS_AUTHENTICATED_FULLY')`:

[[[ code('62d6a954ac') ]]]

Por cierto, todo lo que pasemos a `is_granted()` en Twig -como `ROLE_USER` o`IS_AUTHENTICATED_FULLY` - también podemos pasarlo al método `isGranted()` en el controlador, o a `denyAccessUnlessGranted()`... o a `access_control`. Todos ellos llaman al sistema de seguridad de la misma manera.

Seguro que te has dado cuenta de que `IS_AUTHENTICATED_FULLY` no empieza por `ROLE_`. ¡Sí! Los roles deben empezar por `ROLE_`... pero esta cadena no es un rol: la gestiona un sistema totalmente diferente: una parte del sistema de seguridad que simplemente devuelve`true` o `false` en función de si el usuario está conectado o no.

Así que, en la práctica, esto debería tener el mismo efecto que `ROLE_USER`. Cuando actualizamos... ¡sí! No hay cambios.

## Registro de decisiones de acceso en el Perfilador

Haz clic en el enlace de seguridad de la barra de herramientas de depuración de la web para entrar en el perfilador. Desplázate hasta el final para encontrar algo llamado "Registro de decisiones de acceso". Esto es superguay: Symfony hace un seguimiento de todas las veces que se llamó al sistema de autorización durante la petición y cuál fue el resultado.

Por ejemplo, esta primera comprobación fue para `ROLE_ADMIN`, que probablemente viene de`access_control`: como fuimos a `/admin`, esta regla coincidió y se comprobó para `ROLE_ADMIN`. La siguiente comprobación es de nuevo para `ROLE_ADMIN` -probablemente para mostrar el enlace del administrador en Twig- y luego está la comprobación para `IS_AUTHENTICATED_FULLY`para mostrar el enlace de entrada o salida. El acceso fue concedido para los tres.

## Recordarme autentificado: IS_AUTHENTICATED_REMEMBER

Además de `IS_AUTHENTICATED_FULLY`, hay otro par de cadenas especiales que puedes pasar al sistema de seguridad. La primera es `IS_AUTHENTICATED_REMEMBERED`, que es súper potente... pero puede ser un poco confusa.

Así es como funciona. Si estoy conectado, entonces siempre tengo`IS_AUTHENTICATED_REMEMBERED`. Eso... hasta ahora debería sonar idéntico a`IS_AUTHENTICATED_FULLY`. Pero, hay una diferencia clave. Supongamos que me conecto, cierro el navegador, lo abro y lo actualizo... de modo que estoy conectado gracias a una cookie que me recuerda. En esta situación, tendré `IS_AUTHENTICATED_REMEMBERED` pero no tendré `IS_AUTHENTICATED_FULLY`. Sí, sólo tienes `IS_AUTHENTICATED_FULLY`si te has conectado durante esta sesión del navegador.

Podemos ver esto. Dirígete a tu navegador, abre tus herramientas de depuración, ve a Aplicación y luego a Cookies. Oh... ¡mi cookie remember me ha desaparecido! Esto... fue un error que cometí. Cierra la sesión... y luego ve a `security.yaml`.

Anteriormente, pasamos de utilizar nuestro `LoginFormAuthenticator` personalizado a `form_login`. Ese sistema funciona totalmente con las cookies remember me. Pero también hemos eliminado la casilla de verificación de nuestro formulario de inicio de sesión. Y, dentro de nuestro autentificador, confiábamos en llamar a `enable()` en el `RemmeberMeBadge` para forzar la fijación de la cookie:

[[[ code('3b5c40ebed') ]]]

El autentificador principal `form_login` añade definitivamente el `RememberMeBadge`, que anuncia que opta por el sistema "recuérdame". Pero no llama a`enable()` en él. Esto significa que tenemos que añadir una casilla de verificación al formulario... o, en `security.yaml`, añadir `always_remember_me: true`:

[[[ code('cd891443a7') ]]]

Volvamos a conectarnos ahora: `abraca_admin@example.com`, contraseña `tada` y... ¡ya está! Ahí está mi cookie `REMEMBERME`.

Vale: como acabamos de iniciar la sesión -por lo que nos hemos "conectado durante esta sesión", estamos "autentificados completamente". Pero, si cerrara el navegador -lo que imitaré borrando la cookie de sesión- y actualizara... seguimos conectados, pero ahora estamos conectados gracias a la cookie remember me. Puedes verlo a través de `RememberMeToken`.

¡Y mira aquí arriba! ¡Tenemos los enlaces "Iniciar sesión" y "Registrarse"! Sí, ahora no estamos en`IS_AUTHENTICATED_FULLY` porque no nos hemos autentificado durante esta sesión.

Esto es una forma larga de decir que si utilizas las cookies "recuérdame", la mayoría de las veces debes utilizar `IS_AUTHENTICATED_REMEMBERED` cuando simplemente quieras saber si el usuario está conectado o no:

[[[ code('476d5129f4') ]]]

Y luego, si hay un par de partes de tu sitio que son más sensibles -como quizás la página de "cambio de contraseña"- entonces protégelas con `IS_AUTHENTICATED_FULLY`. Si el usuario intenta acceder a esta página y sólo tiene `IS_AUTHENTICATED_REMEMBERED`, Symfony ejecutará realmente su punto de entrada. En otras palabras, los redirigirá al formulario de acceso.

Refresca la página y... ¡sí! Los enlaces correctos han vuelto.

## PUBLIC_ACCESS y access_control

Vale, hay otras cadenas especiales similares a `IS_AUTHENTICATED_REMEMBERED`, pero sólo una más que creo que es útil. Se llama `PUBLIC_ACCESS`... y devuelve verdadero el 100% de las veces. Sí, todo el mundo tiene `PUBLIC_ACCESS`, aunque no esté conectado.

Así que... puede que pienses: ¿cómo es posible que eso sea útil? ¡Es una buena pregunta!

Mira de nuevo `access_control` en `security.yaml`. Para acceder a cualquier URL que empiece por `/admin`, necesitas `ROLE_ADMIN`:

[[[ code('78d71fe446') ]]]

Pero imagina que tuviéramos una página de acceso en la URL `/admin/login`.

Vamos a crear un controlador ficticio para esto. En la parte inferior de`AdminController`, añade `public function adminLogin()`... con una ruta -`/admin/login` - y, dentro, devuelve un nuevo `Response()` con:

> Finge que la página de inicio de sesión del administrador debe ser pública

[[[ code('46f3fe93fd') ]]]

Cierra la sesión... y ve a `/admin/login`. ¡Acceso denegado! Somos redirigidos a`/login`. Y realmente, si `/admin/login` fuera nuestra página de inicio de sesión, entonces seríamos redirigidos a `/admin/login`... que nos redirigiría a `/admin/login`... que nos redirigiría a `/admin/login`... que... bueno, ya te haces una idea: nos quedaríamos atrapados en un bucle de redirecciones. Y, además, ¡qué mal!

En `security.yaml`, queremos poder exigir `ROLE_ADMIN` para todas las URL que empiecen por `/admin`... excepto para `/admin/login`. La clave para hacerlo es `PUBLIC_ACCESS`

Copiar el control de acceso y pegarlo arriba. Recuerda: sólo coincide un `access_control` por petición y coincide de arriba a abajo. Así que podemos añadir una nueva regla que coincida con cualquier cosa que empiece por `/admin/login` y que requiera `PUBLIC_ACCESS`... ¡que siempre devolverá true!

[[[ code('d925ab6636') ]]]

Gracias a esto, si vamos a cualquier cosa que empiece por `/admin/login`, sólo coincidirá con este `access_control`... ¡y se concederá el acceso!

Pruébalo: ve a `/admin/login` y... ¡se carga!

A continuación: hemos hablado de los roles y hemos hablado de denegar el acceso de varias formas diferentes. Así que pasemos al objeto `User`: cómo podemos preguntar a Symfony quién está conectado.
