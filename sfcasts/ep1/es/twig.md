# Twig ❤️

Hagamos que la acción `show()` del controlador renderé código HTML usando un template.
Tan *pronto* como quieras representar un template, necesitarás que tu controlador herede 
del `AbstractController`. No olvides permitir que PhpStorm lo autocomplete para que pueda 
agregar el `import` necesario.

Ahora, obviamente, un controlador no *necesita* heredar esta clase base - A Symfony no le 
interesa eso. *Pero*, es *usual* heredar del `AbstractController` por una simple 
razón: nos brinda métodos útiles!

[[[ code('71f9a2e8a4') ]]]

## Rendereando un Template

El primer método útil es `render`. Podemos decir: `return this->render()` y pasar dos 
argumentos. El primero es el nombre del archivo del template: podemos poner lo que sea aquí, 
pero usualmente - porque valoramos nuestra cordura - lo nombramos igual que el 
controlador: `question/show.html.twig`.

El segundo argumento es un array de todas las variables que queremos pasar al template. 
Eventualmente, vamos a hacer una query específica a la base de datos y pasaremos los datos 
al template. Por el momento, hay que fingirlo. Voy a copiar la linea `ucwords()` y borrar el 
código viejo. Pasemos una variable al template llamada - que tal: `question` - asignada a 
este string.

[[[ code('1926626360') ]]]

Es hora de una pregunta! Qué valor crees que regresa el método `render()`? Un string? 
alguna otra cosa? La respuesta es: un objeto `Response`... conteniendo HTML. Porque 
recuerda: la *única* regla de un controlador es que *siempre* debe de regresar un objeto 
tipo `Response`.

***TIP
Un controlador *puede* regresar algo *distinto* a un objeto Response, pero no te
preocupes por eso ahorita... o tal vez nunca.
***

## Creando el Template

Entonces, creemos ese template! Dentro de `templates/`, crea el subdirectorio
`question`, luego un nuevo archivo llamado `show.html.twig`. Empecemos sencillo: un `<h1>` 
y luego `{{ question }}` para representar la *variable* question. Y... voy a poner un poco 
más de sintaxis.

[[[ code('1f01513b8b') ]]]

## Las 3 Sintaxis de Twig!

*Acabamos* de escribir nuestro primer código de Twig! Twig es *muy* amigable: es un simple 
archivo HTML hasta que escribes una de sus *dos* sintaxis.

La primera es la sintaxis "imprime algo". `{{`, lo que quieres imprimir, luego `}}`.
Dentro de las llaves, estás escribiendo código en Twig... el cual es muy similar a JavaScript.
Esto imprime la variable `question`. Si pones comillas alrededor, imprimirá la *palabra* `question`.
Y claro, puedes hacer cosas mas complejas - como el operador terneario. Es decir, es *muy* 
similar a JavaScrip.

La *segunda* sintaxis es la que yo llamo "haz algo". Va de esta forma `{%` seguido por lo que 
quieres hacer, por ejemplo un `if` o un `for`. Hablaremos más de esto en un momento.

Y... eso es todo! O estás imprimiendo algo con `{{` o *haciendo* algo, como 
un `if`, con `{%`.

Ok, una *pequeña* mentira, *existe* una tercera sintaxis... pero es solo para 
comentarios: `{#`, el comentario... luego `#}`.

[[[ code('ae7ce3ba5c') ]]]

Veamos si funciona! Abre la página, refresca y... Lo tenemos! Si miras el código fuente, puedes
notar que *no* hay una estructura HTML aun. Es literalmente la estructura de nuestro template
y nada mas. Le vamos a agregar una estructura base en algunos minutos.

## Haciendo Bucles con el Tag {%

Ok: tenemos una pregunta falsa. Creo que se merece algunas respuestas falsas!
De regreso al controlador, en la acción `show()`, voy a pegar 3 respuestas falsas.

[[[ code('9dbcca778c') ]]]

Como he dicho, una vez que hayamos hablado sobre base de datos, vamos a hacer un query 
en lugar de esto. Pero para comenzar, esto va a funcionar de maravilla. Pasalas al template 
como la *segunda* variable llamada `answers`.

[[[ code('4847bce1ac') ]]]

De regreso al template. Como las podríamos imprimir? No podemos solo decir `{{ answers }}`...
porque es un array. Lo que *realmente* queremos hacer es *recorrer* el array e imprimir cada 
respuesta individual. Para poder hacer esto, *tenemos* que hacer uso
de nuestra primer función "haz algo"! Se vería algo así: `{% for answer in answers %}`.
y la mayoría de las etiquetas "haz algo" también tienen una etiqueta de cierre: `{% endfor %}`.

Ponle una etiqueta `ul` alrededor y, dentro del ciclo, di `<li>` y `{{ answer }}`.

[[[ code('c91fba0be4') ]]]

Me fascina! Ok navegador, refresca! Funciona! Digo, está muy, *muy* feo... pero lo 
vamos a arreglar pronto.

## La Referencia de Twig: Tags, Filtros, Funciones 

Dirígete a https://twig.symfony.com. Twig es su propia librería con su
*propia* documentación. Aquí hay un montón de cosas útiles... Pero lo que *realmente* me 
gusta está aquí abajo: la [Referencia de Twig](https://twig.symfony.com/doc/3.x/#reference).

Ves esas "Etiquetas" a la izquierda? Esas son *todas* las etiquetas "Haz algo" que existen. 
Asi es, *siempre* será `{%` y luego *una* de estas palabras - por ejemplo, `for`, `if` 
o `{% set`. Si intentas `{% pizza`, yo voy a pensar que es gracioso, pero Twig te va a gritar.

Twig también tiene funciones... como cualquier lenguaje... y una agradable funcionalidad 
llamada "tests", la cual es algo única. Esto te permite decir cosas como: 
`if foo is defined` o `if number is even`.

Pero la *mayor* y *mejor* sección es la de los "filtros". Los filtros son básicamente 
funciones... pero más hipster. Mira el filtro `length`. Los filtros funcionan como las 
"cadenas" en la linea de comandos: solo que aquí unimos la variable `users` en el filtro `length`, 
el cual solo los cuenta. El valor va de izquierda a derecha. Los filtros son en realidad 
funciones... con una sintaxis más amigable.

Usemos este filtro para imprimir el *número* de respuestas. Voy a poner algunos paréntesis, 
luego `{{ answer|length }}` Cuando lo probamos... de lujo!

[[[ code('136272c6c0') ]]]

## Herencia con Templates de Twig: extends

En este punto, ya eres *apto* para convertirte en un profesional de Twig. Solo hay *una* 
funcionalidad importante más de la cual hablar. y es una buena: herencia de templates.

La mayoría de nuestras páginas van a compartir una estructura HTML. Actualmente, no contamos 
con *ninguna* estructura HTML. Para hacer una, *arriba* del template, 
escribe `{% extends 'base.html.twig' %}`.

[[[ code('5db9f912d5') ]]]

Esto le dice a Twig que queremos usar el template `base.html.twig` como la estructura base. 
En este momento, este archivo es *muy* básico, pero es *nuestro* para modificarlo - y lo 
haremos pronto. 

Pero si refrescas la página... huye! Un gran error!

> Un template que hereda de otro no puede incluir contenido fuera de los bloques de Twig.

Cuando *heredas* de un template, estás diciendo que quieres que el contenido de este template 
vaya *dentro* de `base.html.twig`. Pero... donde? debería Twig ponerlo arriba? Abajo?
En algún lugar del medio? Twig no lo sabe!

Estoy seguro que ya habías notado estos bloques, como `stylesheets`, `title` y `body`. Los 
bloques son "hoyos" donde un template hijo puede *agregar* contenido. No podemos *simplemente* 
heredar de `base.html.twig`: necesitamos decirle en cuál *bloque* debe ir el contenido. El 
bloque `body` es el lugar perfecto.

Como hacemos esto? Arriba del contenido agrega `{% block body %}`, y después, `{% endblock %}`.

[[[ code('e74ca95c2e') ]]]

Ahora intentalo. Funciona! No pareciera que es mucho... porque la estructura base es tan simple,
pero si revisas el código fuente de la página, *tenemos* la estructura HTML básica.

## Agregar, Remover, Cambiar Bloques?

Por cierto, estos bloques en `base.html.twig` no son especiales: los puedes renombrar,
moverlos de lugar, agregar o remover. Entre más bloques agregues, más flexible es
tu template "hijo" para agregar contenido en lugares diferentes.

La mayoría de los bloques existentes están vacíos... pero el bloque *puede* definir contenido 
por *defecto*. Como el bloque `title`. Ves ese `Welcome`? No es sorpresa, ese es el título 
actual de la página.

Como se encuentra dentro de un bloque, podemos *sobreescribirlo* en cualquier template. 
Mira esto: en donde sea dentro de `show.html.twig`, escribe `{% block title %}`, Question, 
imprime la pregunta, luego `{% endblock %}`.

[[[ code('21972d43f6') ]]]

Esta vez cuando recargamos... tenemos un *nuevo* título!

Ok, con Twig en nuestras espaldas, vamos a ver una de las funcionalidades más *útiles* 
de Symfony... y tu nuevo mejor amigo para depurar: Symfony profiler.
