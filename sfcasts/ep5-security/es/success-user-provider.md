# Éxito de la autenticación y actualización del usuario

Hagamos un rápido repaso de cómo funciona nuestro autentificador. Después de activarlo en `security.yaml`:

[[[ code('3447f68059') ]]]

Symfony llama a nuestro método `supports()` en cada petición antes del controlador:

[[[ code('9aa0a7925a') ]]]

Como nuestro autentificador sabe cómo manejar el envío del formulario de inicio de sesión, devolvemos true si la petición actual es un `POST` a `/login`. Una vez que devolvemos true, Symfony llama a `authenticate()` y básicamente pregunta:

> Bien, dime quién está intentando iniciar sesión y qué prueba tiene.

Respondemos a estas preguntas devolviendo un `Passport`:

[[[ code('919c5f7405') ]]]

El primer argumento identifica al usuario y el segundo argumento identifica alguna prueba... en este caso, sólo una devolución de llamada que comprueba que la contraseña enviada es `tada`. Si somos capaces de encontrar un usuario y las credenciales son correctas... ¡entonces estamos autentificados!

¡Ya lo vimos al final del último vídeo! Cuando iniciamos la sesión utilizando el correo electrónico de un usuario real en nuestra base de datos y la contraseña `tada`... golpeamos esta declaración `dd()`:

[[[ code('ca2d37baa5') ]]]

## onAuthenticationSuccess

Si la autenticación tiene éxito, Symfony llama a `onAuthenticationSuccess()` y pregunta:

> ¡Felicidades por la autenticación! ¡Estamos súper orgullosos! Pero... ¿qué debemos hacer ahora?

En nuestra situación, después del éxito, probablemente queramos redirigir al usuario a alguna otra página. Pero para otros tipos de autenticación podrías hacer algo diferente. Por ejemplo, si te estás autenticando mediante un token de la API, devolverías `null`desde este método para permitir que la petición continúe hacia el controlador normal.

En cualquier caso, ese es nuestro trabajo aquí: decidir qué hacer "a continuación"... que será "no hacer nada" - `null` - o devolver algún tipo de objeto `Response`. Vamos a redirigir.

Dirígete a la parte superior de esta clase. Añade un segundo argumento -`RouterInterface $router` - utiliza el truco `Alt`+`Enter` y selecciona "Inicializar propiedades" para crear esa propiedad y establecerla:

[[[ code('804ca50ec4') ]]]

De vuelta a `onAuthenticationSuccess()`, necesitamos devolver `null` o un `Response`. Devuelve un nuevo `RedirectResponse()` y, para la URL, di `$this->router->generate()`y pasa `app_homepage`:

[[[ code('4f33ea5ea2') ]]]

Déjame ir... vuelve a comprobar que el nombre de la ruta .... debe estar dentro de`QuestionController`. Sí, `app_homepage` es correcta:

[[[ code('0aaa06f6a1') ]]]

No estoy seguro de por qué PhpStorm cree que falta esta ruta... definitivamente está ahí.

De todos modos, vamos a entrar desde cero. Vamos directamente a `/login`, introducimos`abraca_admin@example.com` - porque es un correo electrónico real en nuestra base de datos - y la contraseña "tada". Cuando enviamos... ¡funciona! ¡Somos redirigidos! ¡Y estamos conectados! Lo sé gracias a la barra de herramientas de depuración de la web: conectado como `abraca_admin@example.com`, autentificado: Sí.

Si haces clic en este icono para entrar en el perfil, hay un montón de información jugosa sobre la seguridad. Vamos a hablar de las partes más importantes de esto a medida que avancemos.

## Información sobre la autenticación y la sesión

Vuelve a la página de inicio. Fíjate en que, si navegamos por el sitio, seguimos conectados... que es lo que queremos. Esto funciona porque los cortafuegos de Symfony son, por defecto, "stateful". Es una forma elegante de decir que, al final de cada petición, el objeto `User` se guarda en la sesión. Luego, al inicio de la siguiente petición, ese objeto `User` se carga desde la sesión... y seguimos conectados.

## Actualizar el usuario

¡Esto funciona muy bien! Pero... hay un problema potencial. Imagina que nos conectamos en el ordenador del trabajo. Luego, nos vamos a casa, iniciamos la sesión en un ordenador totalmente diferente y cambiamos algunos de nuestros datos de usuario, como por ejemplo, cambiamos nuestro `firstName` en la base de datos a través de una sección de "edición de perfil". Cuando volvamos al trabajo al día siguiente y actualicemos el sitio, Symfony cargará, por supuesto, el objeto `User` de la sesión. Pero... ¡ese objeto `User` tendrá ahora el `firstName` equivocado! Sus datos ya no coincidirán con lo que hay en la base de datos... porque estamos recargando un objeto "viejo" de la sesión.

Afortunadamente... esto no es un problema real. ¿Por qué? Porque al principio de cada petición, Symfony también refresca el usuario. Bueno, en realidad nuestro "proveedor de usuarios" hace esto. Volviendo a `security.yaml`, ¿recuerdas esa cosa del proveedor de usuarios?

[[[ code('4d62903fc8') ]]]

Sí, tiene dos funciones. En primer lugar, si le damos un correo electrónico, sabe cómo encontrar a ese usuario. Si sólo le pasamos un único argumento a `UserBadge`, el proveedor de usuarios hace el trabajo duro de cargar el `User` desde la base de datos:

[[[ code('7c2fd2789a') ]]]

Pero el proveedor de usuarios también tiene un segundo trabajo. Al comienzo de cada petición, refresca el `User` consultando la base de datos para obtener datos nuevos. Todo esto ocurre automáticamente en segundo plano.... ¡lo cual es genial! Es un proceso aburrido, pero crítico, del que tú, al menos, deberías ser consciente.
# Cambio de usuario === Cierre de sesión

Ah, y por cierto: después de consultar los datos frescos de `User`, si algunos datos importantes del usuario han cambiado -como los de `email`, `password` o `roles` - se te cerrará la sesión. Se trata de una función de seguridad: permite que un usuario, por ejemplo, cambie su contraseña y haga que se cierre la sesión de cualquier usuario "malo" que haya podido acceder a su cuenta. Si quieres saber más sobre esto, busca`EquatableInterface`: es una interfaz que te permite controlar este proceso.

Averigüemos qué ocurre cuando falla la autenticación. ¿Dónde va el usuario? ¿Cómo se muestran los errores? ¿Cómo vamos a tratar la carga emocional del fracaso? La mayor parte de eso es lo siguiente.
