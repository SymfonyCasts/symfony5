# ¿Utilizar o no la autenticación por token de la API?

Ésta es la pregunta del millón cuando se trata de la seguridad y las API: ¿necesita mi sitio algún tipo de autentificación por token de API? Es muy probable que la respuesta sea no. Incluso si tu aplicación tiene algunas rúbricas de API -como la nuestra-, si estás creando estas rúbricas únicamente para que tu propio JavaScript para tu propio sitio pueda utilizarlas, entonces no necesitas un sistema de autenticación por token de API. No, tu vida será mucho más sencilla si utilizas un formulario de acceso normal y una autenticación basada en la sesión.

La autenticación basada en la sesión es precisamente la razón por la que tenemos acceso a este punto final: nos hemos conectado previamente... y nuestra cookie de sesión se utiliza para autenticarnos. Esto funciona igual de bien en una página real que en un punto final de la API.

Para probarlo, antes de empezar el tutorial, he creado un controlador Stimulus llamado `user-api_controller.js`:

[[[ code('4597498472') ]]]

Es muy sencillo: hace una petición a la API... y registra el resultado. Vamos a utilizarlo para hacer una petición de API a `/api/me` para demostrar que las llamadas Ajax pueden acceder a las rutas autenticadas.

Para activar el controlador Stimulus, abre `templates/base.html.twig`... y encuentra el elemento `body`: ese es un lugar fácil para adjuntarlo: si`is_granted('IS_AUTHENTICATED_REMEMBERED')`, entonces `{{ stimulus_controller() }}`y el nombre: `user-api`:

[[[ code('9f9198037d') ]]]

Así, nuestro JavaScript será llamado sólo si estamos conectados. Para pasar la URL a la ruta, añade un segundo argumento con `url` establecido en `path('app_user_api_me')`:

[[[ code('19883b887a') ]]]

Y me doy cuenta de que aún no he dado a nuestro punto final de la API un nombre de ruta... así que vamos a hacerlo:

[[[ code('fd339be44f') ]]]

De nuevo en `base.html.twig`, ¡sí! Mi editor parece feliz ahora.

Vale, vuelvo a la página de inicio, inspecciono el elemento, voy a la consola y... ¡ahí están mis datos de usuario! La petición Ajax envía la cookie de sesión y así... la autenticación funciona.

Así que si lo único que necesita utilizar tu API es tu propio JavaScript, ahórrate un montón de problemas y utiliza simplemente un formulario de acceso. Y si quieres ponerte elegante y enviar tu inicio de sesión por medio de Ajax, puedes hacerlo perfectamente. De hecho, si usas Turbo, eso ocurre automáticamente. Pero si quieres escribir algún JavaScript personalizado, no hay problema. Sólo tienes que utilizar Ajax para enviar el formulario de inicio de sesión y la cookie de sesión se establecerá automáticamente de forma normal. Si decides hacer esto, el único ajuste que necesitarás es hacer que el autentificador del formulario de inicio de sesión devuelva JSON en lugar de redirigir. Yo probablemente volvería a utilizar mi `LoginFormAuthenticator` personalizado porque sería súper fácil devolver JSON desde`onAuthenticationSuccess()`:

[[[ code('c546e163b4') ]]]

## Cuando sí necesitas tokens de la API

Entonces, ¿cuándo necesitamos un sistema de autenticación por token de API? La respuesta es bastante sencilla: si alguien que no sea el JavaScript de tu propio sitio necesita acceder a tu API... incluso si tu JavaScript vive en un dominio completamente diferente. Si te encuentras en esta situación, probablemente vas a necesitar algún tipo de sistema de tokens de API. Si necesitas OAuth o un sistema más sencillo... depende. No cubriremos los tokens de la API en este tutorial, pero creamos un sistema bastante bueno en nuestro tutorial [Symfony 4 Security](https://symfonycasts.com/screencast/symfony4-security), que puedes consultar.

Siguiente: ¡vamos a añadir un formulario de registro!
