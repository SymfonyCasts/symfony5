# Recordarme siempre y "signature_properties"

Ahora que tenemos el sistema "recuérdame" funcionando, ¡juguemos con él! En lugar de dar al usuario la opción de activar "recuérdame", ¿podríamos... activarlo siempre?

En este caso, ya no necesitamos la casilla "Recuérdame", así que la eliminamos por completo.

## always_remember_me: true

Hay dos formas de "forzar" al sistema remember me a establecer siempre una cookie aunque no esté la casilla de verificación. La primera es en `security.yaml`: establecer `always_remember_me:` en `true`:

[[[ code('3fbeb74383') ]]]

Sí, acabo de escribir mal `remember`... ¡así que no lo hagas!

Con esto, nuestro autentificador sigue necesitando añadir un `RememberMeBadge`:

[[[ code('53fffef279') ]]]

Pero el sistema ya no buscará esa casilla. Mientras vea esta insignia, añadirá la cookie.

## Habilitación en el RememberMeBadge

La otra forma de habilitar la cookie "Recuérdame" en todas las situaciones es a través de la propia insignia. Comenta la nueva opción. Bueno... déjame arreglar mi error tipográfico y luego comentarlo:

[[[ code('4f3746fe59') ]]]

Dentro de `LoginFormAuthenticator`, en la propia insignia, puedes llamar a `->enable()`... que devuelve la instancia de la insignia:

[[[ code('671672a0e7') ]]]

Esto dice:

> No me interesa ninguna otra configuración ni la casilla de verificación: Definitivamente quiero que el
> sistema remember me añada una cookie.

¡Vamos a probarlo! Borra la sesión y la cookie `REMEMBERME`. Esta vez, cuando iniciemos la sesión... ¡oh, token CSRF no válido! Eso es porque acabo de matar mi sesión sin refrescar - ¡tonto Ryan! Refresca e inténtalo de nuevo.

¡Muy bien! ¡Tenemos la cookie `REMEMBERME`!

## Asegurar las cookies Remember Me: Invalidar al cambiar los datos del usuario

Hay una cosa con la que debes tener cuidado cuando se trata de las cookies "Recuérdame". Si un usuario malintencionado consiguiera de algún modo acceder a mi cuenta -por ejemplo, si robara mi contraseña-, podría, por supuesto, iniciar la sesión. Normalmente, eso es un asco... pero en cuanto lo descubra, podría cambiar mi contraseña, lo que les desconectaría.

Pero... si ese mal usuario tiene una cookie de `REMEMBERME`... entonces, aunque cambie mi contraseña, seguirá conectado hasta que esa cookie caduque... lo que podría ser dentro de mucho tiempo. Estas cookies son casi tan buenas como las reales: actúan como "billetes de autentificación gratuitos". Y siguen funcionando -independientemente de lo que hagamos- hasta que caducan.

Afortunadamente, en el nuevo sistema de autenticación, hay una forma muy interesante de evitar esto. En `security.yaml`, debajo de `remember_me`, añade una nueva opción llamada`signature_properties` configurada en un array con `password` dentro:

[[[ code('60c1150718') ]]]

Me explico. Cuando Symfony crea la cookie remember me, crea una "firma" que demuestra que esta cookie es válida. Gracias a esta configuración, ahora obtendrá la propiedad`password` de nuestro `User` y la incluirá en la firma. Luego, cuando esa cookie se utilice para autenticarse, Symfony volverá a crear la firma utilizando el `password` del `User` que está actualmente en la base de datos y se asegurará de que las dos firmas coincidan. Así que si el `password` de la base de datos es diferente a la contraseña que se utilizó para crear originalmente la cookie... ¡la coincidencia de la firma fallará!

En otras palabras, para cualquier propiedad de esta lista, si incluso una de estas cambia en la base de datos en ese `User`, todas las cookies "recuérdame" para ese usuario serán invalidadas instantáneamente.

Así que si un usuario malo me roba la cuenta, todo lo que tengo que hacer es cambiar mi contraseña y ese usuario malo será expulsado.

Esto es superguay verlo en acción. Actualiza la página. Si modificas la configuración de`signature_properties`, se invalidarán todas las cookies de `REMEMBERME` en todo el sistema: así que asegúrate de que la configuración es correcta cuando lo configures por primera vez. Observa: si borro la cookie de sesión y actualizo... ¡sí! No estoy autentificado: la cookie de `REMEMBERME` no ha funcionado. Sigue ahí... pero no es funcional.

Iniciemos la sesión - con nuestra dirección de correo electrónico normal... y la contraseña... para que obtengamos una nueva cookie remember me que se crea con la contraseña con hash.

¡Genial! Y ahora, en condiciones normales, las cosas funcionarán como siempre. Puedo borrar la cookie de sesión, actualizarla y seguiré conectado.

Pero ahora, vamos a cambiar la contraseña del usuario en la base de datos. Podemos hacer trampa y hacer esto en la línea de comandos:

```terminal
symfony console doctrine:query:sql 'UPDATE user SET password="foo" WHERE email = "abraca_admin@example.com"'
```

Poner la contraseña en `foo` es una auténtica tontería... ya que esta columna debe contener una contraseña con hash... pero estará bien para nuestros propósitos. Pulsa y... ¡fantástico! Esto imita lo que ocurriría si cambiara la contraseña de mi cuenta.

Ahora, si somos el usuario malo, la próxima vez que volvamos al sitio... ¡de repente habremos cerrado la sesión! ¡Una barbaridad! ¡Y yo también me habría salido con la mía si no fuera por vosotros, niños entrometidos! La cookie "recuérdame" está ahí... pero no funciona. Me encanta esta función.

Volvamos atrás... y recarguemos nuestras instalaciones para arreglar mi contraseña:

```terminal-silent
symfony console doctrine:fixtures:load
```

Y... una vez hecho esto, vuelve a conectarte como `abraca_admin@example.com`, contraseña `tada`.

A continuación: ¡es hora de tener un viaje de poder y empezar a negar el acceso! Veamos`access_control`: la forma más sencilla de bloquear el acceso a secciones enteras de tu sitio.
