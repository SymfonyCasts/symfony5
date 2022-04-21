# Aprovechando el propietario de la pregunta

Ahora que cada `Question` tiene un `owner` -un objeto `User` -, ¡es hora de celebrarlo! En el frontend, podemos empezar a renderizar datos reales... en lugar de tener siempre la misma foto del gato y la misma pregunta escrita por la misma Tisha. Ambas están codificadas, aunque nos encanta la gata Tisha aquí en SymfonyCasts.

Empieza en la página de inicio. Abre `templates/question/homepage.html.twig`. Y... aquí es donde hacemos un bucle con las preguntas. Primero, para el avatar, podemos utilizar el método de ayuda que hemos creado antes: `{{ question.owner.avatarUri }}`:

[[[ code('563d8574b2') ]]]

A continuación... hacia abajo, aquí es donde imprimimos el nombre del propietario de la pregunta. Vamos a utilizar `question.owner.displayName`:

[[[ code('b6a9704faa') ]]]

100 puntos de experiencia por utilizar dos métodos personalizados seguidos.

Y ahora... ¡nuestra página empieza a parecer real! Haz clic en una pregunta. Hagamos lo mismo para la página del programa. Abre esa plantilla: `show.html.twig`.

Para el avatar, utiliza `question.owner.avatarUri`:

[[[ code('68e62d526a') ]]]

Luego... aquí abajo, para el nombre, `{{ question.owner.displayName }}`:

[[[ code('56d4799e57') ]]]

Ah, y se me ha olvidado hacer una cosa. Copia eso, vuelve a subir al avatar... para que también podamos actualizar el atributo `alt`:

[[[ code('b88680b41f') ]]]

También tengo que hacerlo en la página de inicio... aquí está:

[[[ code('2049427214') ]]]

¡Probemos esto! Actualiza la página y... ¡somos dinámicos!

## Crear la página de edición de preguntas

En un sitio real, probablemente vamos a necesitar una página en la que el propietario de esta pregunta pueda editar sus detalles. No vamos a construir esto hasta el final -no quiero sumergirme en el sistema de formularios- pero vamos a ponerlo en marcha. Y esto nos va a llevar a una situación de seguridad realmente interesante.

En `src/Controller/QuestionController.php`... encuentra la acción `show()`. Vamos a hacer trampa copiando esto y pegándolo. Cambia la URL a `/questions/edit/{slug}`, modifica el nombre de la ruta y actualiza el nombre del método. Dentro, sólo hay que renderizar una plantilla: `question/edit.html.twig`:

[[[ code('b336a9cc15') ]]]

¡Genial! En `templates/question/`, crea esto: `edit.html.twig`.

Pondré una plantilla básica:

[[[ code('7647e94174') ]]]

Aquí no hay nada especial, excepto que estoy imprimiendo el texto de la pregunta dinámica. En realidad no hay un formulario... ya que nos estamos centrando en la seguridad... pero haz como si lo hubiera.

## Enlace a la página de edición

Antes de probar esta página, vuelve a la plantilla de presentación de preguntas. Vamos a añadir un enlace de edición para ayudar al propietario. En realidad, busca el `h1`. Aquí vamos.

Envuelve esto en un div con `class="d-flex justify-content-between"`... y luego ciérralo y haz una sangría:

[[[ code('8834968757') ]]]

Ahora añade un enlace con `href=` `path('app_question_edit')` . Y, por supuesto, tenemos que pasarle a esto el comodín: `id` ajustado a `question.id`. Oh... espera, en realidad, el comodín es `slug`:

[[[ code('df02d00a9c') ]]]

Así que usa `slug` ajustado a `question.slug`:

[[[ code('a2ab2a991c') ]]]

Genial. Después, di "Editar"... y dale a esto unas cuantas clases para que quede más bonito.

Gracias a esto... ¡tenemos un botón de edición! Oh, ¡pero necesitamos un poco de margen! Añade `mb-2`:

[[[ code('e8701a1343') ]]]

y... mucho mejor. Haz clic en eso. Esta es la página de edición de la pregunta... que en realidad no es una página de edición... pero finge que lo es.

Ahora volvamos al tema de la seguridad. Porque... no podemos dejar que cualquiera acceda a esta página: sólo el propietario de esta pregunta debe poder editarla.

Así que dentro de `QuestionController`, necesitamos una comprobación de seguridad. Primero tenemos que asegurarnos de que el usuario está conectado. Hazlo con `$this->denyAccessUnlessGranted()`pasando por `IS_AUTHENTICATED_REMEMBERED`:

[[[ code('a98fa7d89b') ]]]

Gracias a esto, tenemos garantizado que obtendremos un objeto `User` si decimos `$this->getUser()`. Podemos utilizarlo: si `$question->getOwner()` no es igual a `$this->getUser()`, entonces alguien que no es el propietario está intentando acceder a esta página. Niega el acceso con `throw $this->createAccessDeniedException()`. Diré:

> ¡No eres el propietario!

Pero, recuerda, estos mensajes de error sólo se muestran a los desarrolladores:

[[[ code('dea2a6f944') ]]]

Vale, pues ahora mismo no estoy conectado en absoluto. Así que si refrescamos, nos devuelve a la página de inicio de sesión. Así que... ¡bien! ¡Acabamos de evitar con éxito que cualquier persona que no sea el propietario acceda a esta página de edición!

Pero... malas noticias amigos: No me gusta esta solución. No me gusta poner ninguna lógica de seguridad manual dentro de mi controlador. ¿Por qué? Porque significa que vamos a tener que repetir esa lógica en Twig para ocultar o mostrar el botón de edición. ¿Y qué pasa si nuestra lógica se vuelve más compleja? ¿Qué pasa si puedes editar una pregunta si eres el propietario o si tienes `ROLE_ADMIN`? Ahora tendríamos que actualizar y mantener la lógica duplicada en dos lugares como mínimo. No, no queremos duplicar nuestras reglas de seguridad.

Así que a continuación vamos a aprender sobre el sistema de votantes, que es la clave para centralizar toda esta lógica de autorización de una forma bonita.
