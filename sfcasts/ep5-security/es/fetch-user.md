# Obtención del objeto de usuario

Una de las increíbles características de nuestro sitio es que puedes votar por arriba y por abajo cada respuesta. Ahora mismo, ni siquiera necesitas estar conectado para hacerlo. Vamos a cambiar eso.

## Requerir el inicio de sesión para votar

Encuentra el controlador que gestiona la llamada Ajax que se realiza cuando votamos: es`src/Controller/AnswerController.php`... el método `answerVote()`. Bien: quiero exigir al usuario que se identifique para utilizar esta ruta. Hagámoslo con una anotación... o atributo: `@IsGranted`... luego selecciona esa clase y dale al tabulador para que añada la declaración `use` que necesitamos arriba. Dentro, utiliza`IS_AUTHENTICATED_REMEMBERED`:

[[[ code('3ef39ea3f3') ]]]

Como estamos utilizando el sistema remember me, ésta es la forma correcta de comprobar si el usuario está simplemente conectado.

Si nos detenemos ahora, porque no estamos conectados, no podremos votar. Pero va a tener un aspecto extraño en el frontend porque los enlaces de votación siguen siendo visibles. Así que vamos a ocultarlos.

La plantilla para esta sección es `templates/answer/_answer.html.twig`. Veamos... abajo... aquí están las flechas de votación. Así que básicamente queremos ocultar toda esta sección `div`si no estamos conectados. Si `is_granted('IS_AUTHENTICATED_REMEMBERED')`, busca el cierre `div`... aquí está, y añade `endif`:

[[[ code('2e330efd5b') ]]]

Cuando actualizamos... ¡sí! Los enlaces de votación han desaparecido.

## Obtención del objeto usuario desde un controlador

En una aplicación real, cuando guardemos el voto en la base de datos, probablemente también almacenaremos quién ha votado, para evitar que un usuario vote varias veces la misma respuesta. No vamos a hacer eso ahora... pero vamos a probar algo más sencillo: vamos a registrar un mensaje que incluya la dirección de correo electrónico de quien vota.

Pero espera: ¿cómo averiguamos quién ha iniciado la sesión? En un controlador, es muy fácil: utiliza el acceso directo `$this->getUser()`. Compruébalo: en la parte superior, diré`$logger->info('')` con el mensaje

> {usuario} está votando la respuesta {respuesta}

[[[ code('f62da21ec6') ]]]

Pásale un segundo argumento, que se llama "contexto" del registrador. Esto no tiene relación con la seguridad... es simplemente genial. El segundo argumento es una matriz con cualquier dato extra que quieras almacenar junto con el mensaje. Por ejemplo, podemos poner `answer`a `$answer->getId()`:

[[[ code('a142db305a') ]]]

Y... si utilizas este ingenioso formato `{answer}`, el contexto `answer` se incluirá automáticamente en el mensaje. Lo veremos en un momento.

Para el `user`, obtén el usuario actual con `$this->getUser()`... es así de fácil. Esto nos dará el objeto `User`... y entonces podemos llamar a un método en él, como`->getUserIdentifier()`, que sabemos que será el correo electrónico:

[[[ code('c594edaac6') ]]]

¡Genial! ¡Vamos a probar esta cosa! Primero... tenemos que iniciar la sesión - `abraca_admin@example.com`, contraseña `tada`. Y... ¡lo conseguimos! Nos redirige de nuevo a `/admin/login` porque, hace unos minutos, hemos intentado acceder a esto y nos ha redirigido al formulario de inicio de sesión. Así que técnicamente sigue en la sesión como nuestra "ruta de destino".

Dirígete a la página de inicio, haz clic en una pregunta... ¡y vota! En la barra de herramientas de depuración de la web, podemos ver esa llamada Ajax... e incluso podemos abrir el perfilador de esa petición haciendo clic en el enlace. Dirígete a `Logs`. ¡Dulce!

> `abraca_admin@example.com` está votando la respuesta 498

## Clase base del controlador personalizada

De vuelta al controlador, sabemos que `$this->getUser()` devolverá nuestro objeto `User`... lo que significa que podemos llamar a los métodos que tenga. Por ejemplo, nuestra clase`User` tiene un método `getEmail()`:

[[[ code('79518e2ccf') ]]]

Así que esto funcionará. Pero fíjate en que mi editor no ha autocompletado eso. ¡Qué pena!

Mantén pulsado `Command` o `Ctrl` y haz clic en `getUser()`. Esto nos hace saltar al núcleo`AbstractController`. Ah... el método anuncia que devuelve un `UserInterface`, ¡lo cual es cierto! Pero, más concretamente, sabemos que devolverá nuestra entidad `User`. Desgraciadamente, como este método no lo dice, no obtenemos un buen autocompletado.

Yo uso mucho `$this->getUser()` en mis controladores... así que me gusta "arreglar" esto ¿Cómo? Creando una clase base de controlador personalizada. Dentro del directorio `Controller/`, crea una nueva clase llamada `BaseController`.

Puedes hacer que sea `abstract`... porque nunca la usaremos directamente. Hazla extendida `AbstractController` para que tengamos los métodos normales de acceso directo:

[[[ code('9d1e13378b') ]]]

Crear un controlador base personalizado es... una buena idea: puedes añadir los métodos abreviados adicionales que quieras. Luego, en tus controladores reales, extiendes esto y... ¡diviértete! Ahora mismo sólo voy a hacer esto en `AnswerController`... sólo para ahorrar tiempo:

[[[ code('b15b58f0d2') ]]]

De todos modos, si nos detenemos ahora... ¡felicidades! Esto no cambia nada porque`BaseController` extiende `AbstractController`. Para resolver nuestro problema, no necesitamos añadir un nuevo método abreviado... sólo tenemos que dar a nuestro editor una pista para que sepa que `getUser()` devuelve nuestro objeto `User`... y no sólo un `UserInterface`.

Para ello, encima de la clase, añade `@method` y luego `User` y `getUser()`:

[[[ code('a4d29fd066') ]]]

¡Hecho! De nuevo en `AnswerController`, vuelve a escribir `getEmail()` y... ¡sí! ¡Obtenemos el autocompletado!

¡Genial! Así que la forma de obtener el usuario actual en un controlador es `$this->getUser()`. Pero hay algunos otros lugares en los que podríamos necesitar hacer esto, como en Twig o desde un servicio. Vamos a verlos a continuación.
