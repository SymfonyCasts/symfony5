# Suplantación: switch_user

¿Alguna vez te has encontrado en una situación en la que estás ayudando a alguien en línea... y sería mucho más fácil si pudieras ver lo que está viendo en su pantalla... o, mejor, si pudieras hacerte cargo temporalmente y solucionar el problema tú mismo?

> Sí, sólo tienes que hacer clic en el pequeño icono del clip para adjuntar el archivo. Debería
> estar como cerca de la parte inferior... un clip. ¿Qué es "adjuntar un archivo"? Oh...
> es... como enviar un "paquete"... pero en Internet.

Ah, los recuerdos. Symfony no puede ayudar a enseñar a tu familia cómo adjuntar archivos a un correo electrónico, pero sí puede ayudar a tu personal de atención al cliente a través de una función llamada suplantación de identidad. Muy sencillo: esto da a algunos usuarios el superpoder de iniciar sesión temporalmente como otra persona.

## Activar el autentificador switch_user

Así es como se hace. En primer lugar, tenemos que habilitar la función. En `security.yaml`, bajo nuestro cortafuegos en algún lugar, añade `switch_user: true`:

[[[ code('daae602127') ]]]

Esto activa un nuevo autentificador. Así que ahora tenemos nuestro `CustomAuthenticator`,`form_login`, `remember_me` y también `switch_user`.

¿Cómo funciona? Bien, ahora podemos "iniciar sesión" como cualquiera añadiendo `?_switch_user=`a la URL y luego una dirección de correo electrónico. Vuelve al archivo de accesorios -`src/Fixtures/AppFixtures.php` - y desplázate hacia abajo. Tenemos otro usuario cuyo correo electrónico conocemos: es `abraca_user@example.com`:

[[[ code('279828d135') ]]]

Cópialo, pégalo al final de la URL y...

> Acceso denegado.

Por supuesto No podemos permitir que cualquiera haga esto. El autentificador sólo lo permitirá si tenemos un rol llamado `ROLE_ALLOWED_TO_SWITCH`. Vamos a dárselo a nuestros usuarios administradores. Podemos hacerlo a través de `role_hierarchy`. Aquí arriba, `ROLE_ADMIN` tiene`ROLE_COMMENT_ADMIN` y `ROLE_USER_ADMIN`. Vamos a darles también`ROLE_ALLOWED_TO_SWITCH`:

[[[ code('3ea8c54417') ]]]

Y ahora... ¡vaya! ¡Hemos cambiado de usuario! ¡Es un icono de usuario diferente! Y lo más importante, abajo en la barra de herramientas de depuración de la web, vemos `abraca_user@example.com`... e incluso muestra quién es el usuario original.

Entre bastidores, cuando introdujimos la dirección de correo electrónico en la URL, el autentificador `switch_user`la cogió y luego aprovechó nuestro proveedor de usuarios para cargar ese objeto`User`. Recuerda: tenemos un proveedor de usuarios que sabe cómo cargar usuarios de la base de datos consultando su propiedad `email`:

[[[ code('32de4f2d36') ]]]

Por eso usamos `email` en la URL.

Para "salir" y volver a nuestro usuario original, añade de nuevo `?_switch_user=` con el especial `_exit`.

## Cambios de estilo durante la suplantación

Pero antes de hacer eso, una vez que una persona del servicio de atención al cliente se ha cambiado a otra cuenta, queremos asegurarnos de que no olvida que se ha cambiado. Así que vamos a añadir un indicador muy obvio a nuestra página de que actualmente estamos "cambiados": hagamos este fondo de cabecera rojo.

Abre el diseño base: `templates/base.html.twig`. En la parte superior... busca el `body` y el`nav`... y lo dividiré en varias líneas. ¿Cómo podemos comprobar si estamos suplantando a alguien? Di `is_granted()` y pasa esto`ROLE_PREVIOUS_ADMIN`. Si estás suplantando a alguien, tendrás este rol.

En ese caso, añade `style="background-color: red"`... con `!important` para anular el estilo nav:

[[[ code('029f69127c') ]]]

¡Vamos a verlo! Actualiza y... ¡ja! Es una pista muy obvia de que estamos suplantando.

## Ayudar al usuario a acabar con la suplantación

Para ayudar al usuario a acabar con la suplantación, vamos a añadir un enlace. Baja al menú desplegable. Una vez más, comprueba si `is_granted('ROLE_PREVIOUS_ADMIN')`. Copia el enlace de abajo... pégalo... y envía al usuario a - `app_homepage` pero pasa un parámetro extra`_switch_user` establecido en `_exit`.

Si pasas algo al segundo argumento de `path()` que no sea un comodín en la ruta, Symfony lo establecerá como parámetro de consulta. Así que esto debería darnos exactamente lo que queremos. Para el texto, di "Salir de la suplantación":

[[[ code('28ff890967') ]]]

¡Inténtalo! Refresca. Es obvio que estamos suplantando... pulsa "Salir de la suplantación" y... volvemos a ser `abraca_admin@example.com`. ¡Qué bien!

Por cierto, si necesitas más control sobre los usuarios a los que se puede cambiar, puedes escuchar el evento `SwitchUserEvent`. Para evitar el cambio, lanza un evento`AuthenticationException`. Más adelante hablaremos de los escuchadores de eventos.

A continuación: hagamos un breve descanso para hacer algo totalmente divertido, pero... no relacionado con la seguridad: construir una ruta de usuario de la API.
