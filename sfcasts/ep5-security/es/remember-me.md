# Sistema de recordarme

Otra buena característica de un formulario de acceso es la casilla "recuérdame". Aquí almacenamos una cookie "recuérdame" de larga duración en el navegador del usuario, de modo que cuando cierre su navegador -y por tanto, pierda su sesión- esa cookie le mantendrá conectado... durante una semana... o un año... o lo que configuremos. Añadamos esto.

## Habilitar el sistema remember_me

El primer paso es ir a `config/packages/security.yaml` y activar el sistema. Lo hacemos diciendo `remember_me:` y, a continuación, estableciendo una pieza de configuración necesaria: `secret`: establecer en `%kernel.secret%`:

[[[ code('dde07bfd10') ]]]

Esto se utiliza para "firmar" el valor de la cookie remember me... y el parámetro `kernel.secret`viene en realidad de nuestro archivo `.env`:

[[[ code('6520cecf1b') ]]]

Sí, este `APP_SECRET` acaba convirtiéndose en el parámetro `kernel.secret`... al que podemos hacer referencia aquí.

Como es normal, hay un montón de otras opciones que puedes poner en `remember_me`... y puedes ver muchas de ellas ejecutando:

```terminal
symfony console debug:config security
```

Busca la sección `remember_me:`. Una importante es `lifetime:`, que es el tiempo de validez de la cookie "Recuérdame".

Antes he dicho que la mayor parte de la configuración que ponemos bajo nuestro cortafuegos sirve para activar diferentes autentificadores. Por ejemplo, `custom_authenticator:`activa nuestro `LoginFormAuthenticator`:

[[[ code('7583c42f79') ]]]

Lo que significa que ahora se llama a nuestra clase al inicio de cada petición y se busca el envío de un formulario de acceso. La configuración de `remember_me` también activa un autentificador: un autentificador central llamado `RememberMeAuthenticator`. En cada petición, éste busca una cookie "recuérdame" -que crearemos en un segundo- y, si está ahí, la utiliza para autenticar al usuario.

## Añadir la casilla de verificación "Recuérdame

Ahora que esto está en su sitio, nuestro siguiente trabajo es establecer esa cookie en el navegador del usuario después de que se conecte. Abre `login.html.twig`. En lugar de añadir siempre la cookie, dejemos que el usuario elija. Justo después de la contraseña, añade un div con algunas clases, una etiqueta y una entrada `type="checkbox"`,`name="_remember_me"`:

[[[ code('10140cd345') ]]]

El nombre - `_remember_me` - es importante y tiene que ser ese valor. Como veremos en un minuto, el sistema busca una casilla de verificación con este nombre exacto.

Bien, actualiza el formulario. Genial, ¡tenemos una casilla de verificación! Aunque... es un poco feo... creo que se ha estropeado algo. Usa `form-check` y démosle a nuestra casilla de verificación`form-check-input`:

[[[ code('867adfe627') ]]]

Ahora... ¡mejor!

## Optar por la Cookie Remember Me

Si marcáramos la casilla y la enviáramos... no pasaría absolutamente nada diferente: Symfony no establecería una cookie "Recuérdame".

Esto se debe a que nuestro autentificador necesita anunciar que admite el establecimiento de cookies remember me. Esto es un poco raro, pero piénsalo: el hecho de que hayamos activado el sistema `remember_me` en `security.yaml` no significa que queramos que SIEMPRE se establezcan cookies remember me. En un formulario de inicio de sesión, definitivamente. Pero si tuviéramos algún tipo de autenticación con token de la API... entonces no querríamos que Symfony intentara establecer una cookie remember me en esa petición de la API.

En cualquier caso, todo lo que tenemos que añadir es una pequeña bandera que diga que este mecanismo de autenticación sí admite añadir cookies remember me. Hazlo con una insignia: new `RememberMeBadge()`:

[[[ code('874b4eb269') ]]]

¡Eso es todo! Pero hay una cosa rara. Con el `CsrfTokenBadge`, leemos el token POSTed y se lo pasamos a la insignia. Pero con `RememberMeBadge`... no hacemos eso. En su lugar, internamente, el sistema "recuérdame" sabe que debe buscar una casilla llamada, exactamente, `_remember_me`.

Todo el proceso funciona así. Después de que nos autentifiquemos con éxito, el sistema "recuérdame" buscará esta insignia y mirará si esta casilla está marcada. Si ambas cosas son ciertas, añadirá la cookie "recuérdame".

Veamos esto en acción. Actualiza la página... e introduce nuestro correo electrónico normal, la contraseña "tada", haz clic en la casilla "Recuérdame"... y pulsa "Iniciar sesión". La autenticación se ha realizado con éxito No es ninguna sorpresa. Pero ahora abre las herramientas de tu navegador, ve a "Aplicación", busca "Cookies" y... ¡sí! Tenemos una nueva cookie `REMEMBERME`... que caduca dentro de mucho tiempo: ¡es decir, dentro de 1 año!

## Ver cómo nos autentifica la cookie RememberMe

Para demostrar que el sistema funciona, elimina la cookie de sesión que normalmente nos mantiene conectados. Observa lo que ocurre cuando actualizamos. ¡Seguimos conectados! Eso es gracias al autentificador `remember_me`.

Cuando te autentificas, internamente, tu objeto `User` se envuelve en un objeto "token"... que normalmente no es demasiado importante. Pero ese token muestra cómo te has autentificado. Ahora dice `RememberMeToken`... lo que demuestra que la cookie "Recuérdame" fue la que nos autenticó.

Ah, y si te preguntas por qué Symfony no ha añadido una nueva cookie de sesión... eso es sólo porque la sesión de Symfony es perezosa. No lo verás hasta que vayas a una página que utilice la sesión - como la página de inicio de sesión. Ahora está de vuelta.

Y... ¡eso es todo! Además de nuestro `LoginFormAuthenticator`, ahora hay un segundo autentificador que busca información de autentificación en una cookie de`REMEMBERME`.

Sin embargo, podemos hacer todo esto un poco más elegante. A continuación, vamos a ver cómo podríamos añadir una cookie "Recuérdame" para todos los usuarios cuando se conecten, sin necesidad de una casilla de verificación. También vamos a explorar una nueva opción del sistema "recuérdame" que permite invalidar todas las cookies "recuérdame" existentes si el usuario cambia su contraseña.
