# Roles dinámicos

Antes hemos hablado de cómo, en el momento en que un usuario se conecta, Symfony llama al método `getRoles()`en el objeto `User` para averiguar qué roles tendrá ese usuario:

[[[ code('9e0c2bdb98') ]]]

Este método lee una propiedad de la matriz `$roles` que está almacenada en la base de datos como JSON... y luego añade siempre `ROLE_USER` a la misma.

Hasta ahora, no hemos dado a ningún usuario ningún papel adicional en la base de datos... así que todos los usuarios tienen sólo `ROLE_USER`. Puedes ver esto en la barra de herramientas de depuración de la web: haz clic para saltar al perfilador. Sí, tenemos `ROLE_USER`.

Esto es demasiado aburrido... ¡así que vamos a añadir algunos verdaderos usuarios administradores! Primero, abre`config/packages/security.yaml`... y, debajo de `access_control`, cambia esto para requerir de nuevo `ROLE_ADMIN`:

[[[ code('01c978807b') ]]]

Recuerda: los roles son sólo cadenas que inventamos... pueden ser cualquier cosa: `ROLE_USER`
`ROLE_ADMIN` `ROLE_PUPPY`, `ROLE_ROLLERCOASTER`... lo que sea. La única regla es que deben empezar por `ROLE_`. Gracias a esto, si vamos a `/admin`... ¡acceso denegado!

## Rellenar los roles en la base de datos

Vamos a añadir algunos usuarios administradores a la base de datos. Abre la clase de accesorios:`src/DataFixtures/AppFixtures.php`. Veamos... aquí abajo, vamos a crear un usuario personalizado y luego 10 usuarios aleatorios. Haz que este primer usuario sea un administrador: pon`roles` en una matriz con `ROLE_ADMIN`:

[[[ code('14b41cb9af') ]]]

Vamos a crear también un usuario normal que podamos utilizar para iniciar la sesión. Copia el código de `UserFactory`, pégalo, usa `abraca_user@example.com`... y deja `roles` vacío:

[[[ code('63ff90001a') ]]]

¡Hagámoslo! En tu terminal, ejecuta:

```terminal
symfony console doctrine:fixtures:load
```

Cuando termine... gira y actualiza. ¡Hemos cerrado la sesión! Eso es porque, al cargar el usuario desde la sesión, nuestro proveedor de usuarios intentó refrescar el usuario desde la base de datos... pero el antiguo usuario con su antiguo id había desaparecido gracias a las fijaciones. Vuelve a entrar en .... con la contraseña `tada` y... ¡acceso concedido! ¡Estamos de enhorabuena! Y en el perfilador, tenemos los dos roles.

## Comprobación del acceso dentro de Twig

Además de comprobar o imponer los roles a través de `access_control`... o desde dentro de un controlador, a menudo también necesitamos comprobar los roles en Twig. Por ejemplo, si el usuario actual tiene `ROLE_ADMIN`, pongamos un enlace a la página del administrador.

Abre `templates/base.html.twig`. Justo después de este enlace de respuestas... así que déjame buscar "respuestas"... ahí vamos, añade if, y luego utiliza una función especial de `is_granted()` para comprobar si el usuario tiene `ROLE_ADMIN`:

[[[ code('74c25e62d6') ]]]

¡Es así de fácil! Si es así, copia el enlace nav aquí arriba... pega... envía al usuario a `admin_dashboard` y di "Admin":

[[[ code('825e167e28') ]]]

Cuando refresquemos... ¡ya está!

Hagamos lo mismo con los enlaces "iniciar sesión" y "registrarse": sólo los necesitamos si no estamos conectados. Aquí abajo, para comprobar simplemente si el usuario está conectado, utiliza`is_granted('ROLE_USER')`... porque, en nuestra aplicación, todos los usuarios tienen al menos ese rol. Añade `else`, `endif`, y luego haré una sangría. Si hemos iniciado la sesión, podemos pegar para añadir un enlace "Cerrar sesión" que apunte a la ruta `app_logout`:

[[[ code('55cab805d1') ]]]

¡Genial! Refresca y... mucho mejor. ¡Esto parece un sitio real!

A continuación, vamos a conocer unas cuantas "cadenas" especiales que puedes utilizar con la autorización: cadenas que no empiezan por `ROLE_`. Utilizaremos una de ellas para mostrar cómo podemos denegar fácilmente el acceso a todas las páginas de una sección excepto a una.
