# form_login: El autentificador incorporado

Las clases de autentificadores personalizados como ésta nos dan mucho control. Por ejemplo, imagina que, además de los campos de correo electrónico y contraseña, necesitaras un tercer campo, como un menú desplegable de "empresa"... y utilizaras ese valor -junto con el `email` - para consultar el `User`. Hacerlo aquí sería... ¡bastante sencillo! Coge el campo`company` POST, úsalo en tu consulta personalizada y celébralo con nachos.

Pero un formulario de acceso es algo bastante común. Y por eso, Symfony viene con un autentificador de formularios de inicio de sesión incorporado que podemos... ¡simplemente usar!

## Comprobando el Core FormLoginAuthenticator

Vamos a abrirlo y comprobarlo. Pulsa `Shift`+`Shift` y busca`FormLoginAuthenticator`.

Lo primero que hay que observar es que extiende la misma clase base que nosotros. Y si te fijas en los métodos -hace referencia a un montón de opciones- pero en última instancia... hace lo mismo que nuestra clase: `getLoginUrl()` genera una URL a la página de inicio de sesión... y `authenticate()` crea un `Passport` con `UserBadge`,`PasswordCredentials`, un `RememberMeBadge` y un `CsrfTokenBadge`.

Tanto `onAuthenticationSuccess` como `onAuthenticationFailure` descargan su trabajo a otro objeto... pero si miraras dentro de ellos, verías que básicamente hacen lo mismo que nosotros.

## Usar form_login

Así que vamos a usar esto en lugar de nuestro autentificador personalizado... lo que yo haría en un proyecto real a menos que necesite la flexibilidad de un autentificador personalizado.

En `security.yaml`, comenta el autentificador de nuestro cliente... y también comenta la configuración de `entry_point`:

[[[ code('be0ed4dbe7') ]]]

Sustitúyelo por una nueva clave `form_login`. Esto activa ese autentificador. Abajo, esto tiene un montón de opciones - te las mostraré en un minuto. Pero hay dos importantes que necesitamos: `login_path:` establecido a la ruta a tu página de inicio de sesión... así que para nosotros eso es `app_login`... y también el `check_path`, que es la ruta a la que se somete el formulario de inicio de sesión... que para nosotros también es `app_login`: nos sometemos a la misma URL:

[[[ code('41c3d74eae') ]]]

## Configurando el punto_de_entrada como form_login

Y... ¡eso es todo para empezar! ¡Vamos a probarlo! Actualiza cualquier página y... ¡error! Un error que hemos visto:

> Como tienes varios autentificadores en el firewall "principal", necesitas
> establecer "punto_de_entrada" en uno de ellos: o bien `DummyAuthenticator`, o bien `form_login`.

Ya he mencionado que algunos autenticadores proporcionan un punto de entrada y otros no. El autentificador `remember_me` no proporciona uno... pero nuestro`DummyAuthenticator` sí lo hace y también `form_login`. Su punto de entrada redirige a la página de inicio de sesión.

Así que, como tenemos varios, tenemos que elegir uno. Establece `entry_point:` como `form_login`:

[[[ code('7adff8ad2e') ]]]

## Personalizar los nombres de los campos del formulario de inicio de sesión

Ahora si refrescamos... genial: no hay error. Así que vamos a intentar iniciar la sesión. En realidad... Primero cerraré la sesión... eso sigue funcionando... luego entraré con `abraca_admin@example.com`contraseña `tada`. Y... ¡ah! ¡Otro error!

> La clave "_nombredeusuario" debe ser una cadena, dada NULL.

Y viene de `FormLoginAuthenticator::getCredentials()`. Vale, pues cuando utilices el built-in `form_login`, tienes que asegurarte de que algunas cosas están alineadas. Abre la plantilla de inicio de sesión: `templates/security/login.html.twig`. Nuestros dos campos se llaman `email`... y `password`:

[[[ code('acf108cb3c') ]]]

Resulta que Symfony espera que estos campos se llamen `_username`y `_password`... por eso nos da este error: está buscando un parámetro POST `_username`... pero no está ahí. Afortunadamente, este es el tipo de cosas que puedes configurar.

Busca tu terminal favorito y ejecuta

```terminal
symfony console debug:config security
```

para ver toda la configuración de seguridad actual. Desplázate hacia arriba... y busca`form_login`... aquí está. Hay un montón de opciones que te permiten controlar el comportamiento de `form_login`. Dos de las más importantes son `username_parameter`y `password_parameter`. Vamos a configurarlas para que coincidan con nuestros nombres de campo.

Así, en `security.yaml` añade `username_parameter: email` y`password_parameter: password`:

[[[ code('b2bd377267') ]]]

Esto le dice que lea el parámetro `email` POST... y luego pasará esa cadena a nuestro proveedor de usuarios... que se encargará de consultar la base de datos.

Vamos a probarlo. Actualiza para volver a enviar y... ¡ya está! ¡Ya hemos iniciado la sesión!

La moraleja de la historia es la siguiente: usar `form_login` te permite tener un formulario de inicio de sesión con menos código. Pero mientras que usar una clase de autentificador personalizada es más trabajo... tiene una flexibilidad infinita. Así que, es tu elección.

A continuación: vamos a ver algunas otras cosas que podemos configurar en el formulario de inicio de sesión y a añadir una característica totalmente nueva: rellenar previamente el campo del correo electrónico cuando falle el inicio de sesión.
