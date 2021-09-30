# JavaScript, AJAX y el Profiler

Este es nuestro próximo objetivo: escribir algo de JavaScript para que cuando hagamos
click en los íconos de arriba o abajo, se realice un request AJAX a nuestra ruta JSON.
Este "simula" guardar el voto en la base de datos y retorna el nuevo recuento de votos,
el cual usaremos para actualizar el número de votos en la página.

## Agregando Clases js- al Template

El template de esta página es: `templates/question/show.html.twig`. Para cada respuesta,
tenemos estos links de `votar-arriba` y `votar-abajo`. Voy a agregar algunas clases a
esta sección para ayudar a nuestro JavaScript. En el elemento `vote-arrows`,
agrega una clase `js-vote-arrows`: lo usaremos en el JavaScript para encontrar el
elemento. Luego, en el link de `vote-up`, agrega un atributo data llamado
`data-direction="up"`. Haz lo mismo para el link de abajo: `data-direction="down"`.
Esto nos ayudará a saber en cuál link se hizo click. Finalmente, rodea el numero de
votos - el 6 - con un span que contenga otra clase: `js-vote-total`. Usaremos esto para
encontrar el elemento para poder actualizar ese número.

[[[ code('096aba564c') ]]]

## Agregando JavaScript Dentro del Bloque javascripts.

Para simplificar las cosas, el código JavaScript que escribiremos usará jQuery.
De hecho, si tu sitio usa jQuery, *probablemente* querrás incluir jQuery en *cada*
página... Lo cual significa que queremos agregar una etiqueta `script` a
`base.html.twig`. En la parte de abajo, fíjate que tenemos un bloque llamado
`javascripts`. Dentro de este bloque, voy a pegar una etiqueta `<script>` para
descargar jQuery desde un CDN. Puedes copiar esto desde el bloque de código
en esta página, o ir a jQuery para obtenerlo.

***TIP
En los nuevos proyectos de Symfony, el bloque `javascripts` se encuentra en la parte
superior de este archivo - dentro de la etiqueta `<head>`. Puedes dejar el bloque
`javascripts` en `<head>` o moverlo aquí abajo. Si lo dejas dentro de `head`, asegúgate
de agregar un atributo `defer` a cada etiqueta `script`:
Esto hará que tu JavaScript sea ejecutado *luego* de que la página termine de cargar.
***

[[[ code('dfaa4f6a88') ]]]

Si te preguntas *por qué* pusimos esto dentro del bloque `javascripts`... Más allá de
que "parece" un lugar lógico, te mostraré por qué en un minuto. Ya que, *técnicamente*,
si pusiéramos esto *luego* del bloque `javascripts` o antes, no habría ninguna
diferencia por el momento. Pero ponerlos dentro va a ser útil pronto.

Para nuestro propio JavaScript, dentro del directorio `public/`, crea un nuevo
directorio llamado `js/`. Y luego, un archivo: `question_show.js`.

Esta es la idea: usualmente tendrás algún código JavaScript que querrás incluir en
cada página. No tenemos ninguno por el momento, pero si lo *tuviéramos*, yo crearía
un archivo `app.js` y agregaría una etiqueta `script` para ello en `base.html.twig`.
Luego, en ciertas páginas, podrías necesitar incluir algún JavaScript específico
para la página, como por ejemplo, para hacer funcionar el voto de comentarios que
solo vive en una página.

Esto es lo que estoy haciendo y esta es la razón por la que creé un archivo llamado
`question_show.js`: Es JavaScript específico para esa página.

Dentro de `question_show.js`, voy a pegar al rededor de 15 líneas de código.

[[[ code('8ce718cf9e') ]]]

Esto encuentra el elemento `.js-vote-arrows` - el cual agregamos aquí - encuentra
cualquier etiqueta dentro del mismo, y registra una función para el evento `click` allí.
Al hacer click, hacemos una llamada AJAX a `/comments/10` - el 10 es escrito a mano por
ahora - `/vote/` y luego leemos el atributo `data-direction` del elemento `<a>` para
saber si este es un voto `arriba` o `abajo`. Al finalizar exitosamente, jQuery nos pasa
los datos JSON de nuestra llamada. Renombremos esa variable a `data` para ser más
exactos.

[[[ code('b564ad8fa7') ]]]

Luego usamos el campo `votes` de los datos - porque en nuestro controlador, estamos
retornando una variable `votes` - para actualizar el total de votos.

## Sobreescribiendo el Bloque javascripts.

Entonces... ¿Cómo incluimos este archivo? Si quisiéramos incluir esto en *cada* página,
sería bastante fácil: agrega otra etiqueta script abajo de jQuery en `base.html.twig`.
Pero queremos incluir esto *solo* en la página show. Aquí es donde tener el script de
jQuery dentro del bloque `javascripts` es útil. Porque, en un template "hijo",
podemos *sobreescribir* ese bloque.

Echemos un vistazo: en `show.html.twig`, no importa donde - pero vayamos al final,
di `{% block javascripts %} {% endblock %}`. Dentro, agrega una etiqueta `<script>`
con `src=""`. Ah, tenemos que recordar usar la función `asset()`. Pero... PhpStorm
nos sugiere `js/question_show.js`. Selecciona ese. ¡Muy bien! Agregó la función
`asset()` por nosotros.

[[[ code('ebeb877032') ]]]

Si paráramos ahora, esto literalmente *sobreescribiría* el bloque `javascripts` de
`base.html.twig`. Por lo que jQuery no sería incluido en la página. ¡En vez de
*sobreescribir* el bloque, lo que *realmente* queremos es *agregar* algo a él!
En el HTML final, queremos que nuestra nueva etiqueta `script` vaya justo *debajo*
de jQuery.

¿Cómo podemos hacer esto? Sobre nuestra etiqueta script, di `{{ parent() }}`.

[[[ code('9e813983d0') ]]]

¡Me encanta! La función `parent()` toma el contenido del bloque *padre*, y lo imprime.

¡Probémoslo! Refresca y... Haz click en up. ¡Se actualiza! Y si hacemos click en down,
vemos un número muy bajo.

## Requests AJAX en el Profiler

Ah, y ¿Ves este número "6" aquí abajo en la barra de herramientas debug? Esto es genial.
Refresca la página. Fíjate que el ícono *no* está aquí abajo. ¡Pero, tan pronto como
nuestra página hace una llamada AJAX, aparece! Sip, la barra de herramientas debug
*detecta* llamadas AJAX y las enlista aquí. ¡La mejor parte es que puedes usar esto
para saltar al *profiler* para cualquiera de estos requests! Voy a hacer click con el
botón derecho y abriré este link de voto "abajo" en una nueva pestaña.

Este es el profiler completo para la llamada en *todo* su esplendor. Si usas `dump()`
en alguna parte de tu código, la variable volcada para esa llamada AJAX estará aquí.
Y luego, tendremos una sección de base de datos aquí. Esta es una funcionalidad
*maravillosa*.

A continuación, ajustemos nuestra ruta de la API: No deberíamos poder hacer un request
GET al mismo - como si lo abriéramos en nuestro navegador. Y... ¿Tenemos algo que valide
que el comodín `{direction}`... de la URL sea `up` o `down` pero nada más? Todavía no.
