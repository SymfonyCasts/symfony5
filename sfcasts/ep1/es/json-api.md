# Rutas JSON en la API

Una de las funcionalidades en nuestro sitio... la cual aun no funciona... es la de
votar a favor o en contra en las respuestas de las preguntas. Eventualmente, cuando
hagas click arriba o abajo, esto hará un request tipo AJAX a una ruta de una API que
vamos a crear. Esa ruta va a guardar el voto en la base de datos y va a *responder*
con un JSON que contendrá el *nuevo* total de votos y así nuestro JavaScript podrá
actualizar el contador.

Aún no tenemos una base de datos en nuestra aplicación, pero estamos listos para
construir *todas* las otras partes de esta funcionalidad.

## Creando una Ruta JSON

Comencemos por crear una ruta tipo JSON para la API a la cual accederemos con AJAX
cuando el usuario vote en una respuesta arriba o abajo.

*Podríamos* crear esto en `QuestionController` como un nuevo método. Pero como esta
ruta en *realidad* trabaja con un "comment", vamos a crear un *nuevo* controlador.
Llámalo `CommentController`.

Como la vez pasada, vamos a escribir `extends AbstractController` y presionar tab
para que PhpStorm autocomplete esto y agregue el `import` en la parte de arriba. Al
extender de esta clase nos brinda métodos de atajo... y me encantan los atajos!

[[[ code('68ae2e381a') ]]]

Dentro, crea una *función pública*. Puede tener cualquier nombre... que tal
`commentVote()`. Agrega la ruta arriba: `/**`, luego `@Route`. Autocompleta la del
componente Routing para que asi PhpStorm agregue el `import`.

Para la URL, que tal `/comments/{id}` - esto eventualmente será el id del comentario
específico en la base de datos - `/vote/{direction}`, donde `{direction}` será
cualquiera de las palabras `arriba` o `abajo`.

y como tenemos estos dos comodines, podemos agregar dos argumentos: `$id`
y `$direction`. Empezaré con un comentario: el `$id` será *súper* importante después
cuando tengamos una base de datos... pero no lo vamos a usar por ahora.

[[[ code('fbedbf7c06') ]]]

Sin una base de datos, vamos a simular la lógica. Si `$direction == 'up'`, entonces
normalmente guardaríamos el voto a favor en la base de datos y consultaríamos el
nuevo total de votos. En vez de eso, escribe `$currentVoteCount = rand(7, 100)`.

[[[ code('8346685dbe') ]]]

El conteo de votos está escrito directamente en el template con un total de 6. Así
que esto hará que el nuevo conteo de votos parezca ser un *nuevo* número mayor que
este. En el else, haz lo opuesto: un número aleatorio entre 0 y 5.

[[[ code('afd174ce03') ]]]

Si, esto será *mucho* más interesante cuando tengamos una base de datos, pero va a
funcionar muy bien para nuestro propósito.

## Regresando un JSON?

La pregunta ahora es: después de "Guardar" el voto en la base de datos, que debería
de retornar el controlador? Bueno, probablemente debería retornar un JSON... y *sé*
que quiero incluir el nuevo conteo en la respuesta para que nuestro JavaScript pueda
utilizarlo y actualizar el número de votos.

Así que... como regresamos un JSON? Recuerda: nuestro *único* trabajo en un
controlador es retornar un objeto de tipo Symfony `Response`. JSON no es nada más que
una respuesta cuyo contenido es una cadena JSON en vez de HTML. Así que *podemos*
poner: `return new Response()` con `json_encode()` con algún dato.

Pero! en vez de eso, `return new JsonResponse()` - autocompleta esto para que
PhPStorm agregue el `import`. Pasa un array con los datos que queremos. Que tal pasar
la llave `votes` con `$currentVoteCount`.

[[[ code('fea6b50fbc') ]]]

Ahora... *tal vez* estés pensando:

> Ryan! Te la pasas diciendo que debemos retornar un objeto Response... y acabas de
> retornar algo diferente. Esto es una locura!

Es un punto *válido*. Pero! si presionas Command or Ctrl y das click en la clase
`JsonResponse`, vas a aprender que `JsonResponse hereda de Response`. Esta clase no
es nada más que un atajo para crear respuestas tipo JSON: esto hace el JSON encode a
los datos que le pasamos *y* se asegura que la cabecera `Content-Type` sea asignada a
`application/json`, la cual ayuda a las librerías AJAX a entender que estamos
regresando un JSON.

Así que... ah! Probemos nuestra nueva y brillante ruta de la API! Copia la URL, abre
un nueva nueva pestaña en el navegador, pega y llena los comodines: que tal 10 para
el `{id}` y para el voto "up". Presiona enter. Hola ruta JSON!

El punto clave más importante aquí es: las respuestas JSON no son nada especiales.

## El Método atajo json()

La clase `JsonResponse` nos hace la vida más sencilla.. pero podemos ser aún más
*flojos*! En vez de `new JsonResponse` simplemente escribe return `$this->json()`.

[[[ code('65cd13bc2d') ]]]

Esto no cambia nada: es solo un atajo para crear el *mismo* objeto `JsonResponse`.
Pan comido.

## El Serializador de Symfony

Por cierto, uno de los "componentes" de Symfony se llama "Serializer", y es *muy*
bueno convirtiendo *objetos* a JSON o XML. Aún no lo hemos instalado, pero *si* lo
hiciéramos, el `$this->json()` empezaría a utilizarlo para serializar cualquier cosa
que le pasemos. No haría ninguna diferencia en nuestro caso donde pasamos un array,
pero significa que podrías empezar a pasar *objetos* a `$this->json()`. Si quieres
saber más - o quieres construir una muy sofisticada API - ve nuestro tutorial sobre
[API Platform](https://symfonycasts.com/screencast/api-platform): un increíble bundle
de Symfony para construir APIs.

A continuación, escribamos algo de JavaScript que hará un llamado AJAX a nuestra
nueva ruta. También vamos a aprender como agregar JavaScript global *y* JavaScript
específico a una página
