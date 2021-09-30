# Generando URLs

Vuelve a la página "show" para una cuestión. El logo de arriba es un link... que no
va a ninguna parte aún. Este *debería* llevarnos a la página de inicio.

Como forma parte del layout, el link vive en `base.html.twig`. Aquí está:
`navbar-brand` con `href="#"`.

[[[ code('9faea27c3a') ]]]

Para hacer que esto nos lleve a la página de inicio, podemos simplemente cambiarlo a `/`,
¿Cierto? *Podrías* hacerlo, pero en Symfony, una mejor forma es pedirle a Symfony que
*genere* una URL hacia esta ruta. De esta forma, si decidimos cambiar esta URL en el
futuro, todos nuestros links se actualizarán automáticamente.

## ¡Cada Ruta Tiene un Nombre!

Para ver cómo hacer esto, ve a tu terminal y corre:

```terminal
php bin/console debug:router
```

Esto muestra un listado de *cada* ruta del sistema... ¡Y, hey! Desde la última vez que
lo corrimos, hay un *montón* de rutas nuevas. Estas alimentan a la barra de herramientas
debug y el profiler y son agregadas automáticamente por el WebProfilerBundle cuando
estamos en modo `dev`.

De todas formas, lo que *realmente* quiero ver es la columna "Name". *Toda* ruta tiene un
nombre interno, incluyendo las dos rutas que hicimos. Aparentemente sus nombres son
`app_question_homepage` y `app_question_show`. Pero... eh... ¿De dónde vinieron? ¡No
recuerdo haber escrito ninguno de éstos!

Entonces... A cada ruta *debe* serle dada un nombre interno. Pero cuando usas rutas en
anotación... te deja hacer trampa: elige un nombre *por ti* basado en la clase y método
del controlador... ¡Lo cual es asombroso!

Pero... tan pronto como necesitas generar la URL de una ruta, yo recomiendo darle un
nombre *explícito*, en lugar de depender de este nombre autogenerado, el cual podría
cambiar de repente si le cambias el nombre al método. Para darle un nombre a una ruta,
agrega `name=""` y... Que tal: `app_homepage`.

[[[ code('41da313f69') ]]]

Me gusta mantener los nombres de mis rutas cortos, pero `app_` lo hace lo suficientemente
largo como para poder realizar una búsqueda a partir de esta cadena si alguna vez lo
necesito.

*Ahora*, si corremos `debug:router` nuevamente:

```terminal-silent
php bin/console debug:router
```

¡Bien! Tomamos el control del nombre de nuestra ruta. Copia el nombre `app_homepage` y
luego vuelve a `base.html.twig`. El objetivo es simple, queremos decir:

> ¡Hey symfony! ¿Puedes por favor decirme la URL para la ruta `app_homepage`?

Para hacer esto en Twig, usa `{{ path() }}` y pásale el nombre de la ruta.

[[[ code('c164d6ba40') ]]]

¡Eso es todo! Cuando volvemos y refrescamos... *Ahora* esto va hacia la página principal.

## Apuntando a una Ruta con {Comodines}

En la página principal, tenemos dos preguntas escritas a mano... y cada una tiene dos
links que actualmente no van a ninguna parte. ¡Arreglémoslos!

Paso uno: ahora que queremos generar una URL de esta ruta, encuentra la ruta y agrega
`name="app_question_show"`.

[[[ code('ed0b336b2a') ]]]

Copia esto y abre el template: `templates/question/homepage.html.twig`. Veamos...
Justo debajo de la parte de votar, aquí está el primer link a una pregunta que dice
"Reversing a spell". Quita el signo numeral, agrega `{{ path() }}` y pega
`app_question_show`.

Pero... no podemos detenernos aquí. ¡Si probamos la página ahora, un error glorioso!

> Algunos parámetros obligatorios están faltando - "slug"

¡Eso tiene sentido! ¡No podemos simplemente decir "genera la URL hacia
`app_question_show`" porque esa ruta tiene un comodín! Symfony necesita saber qué
valor debería usar para `{slug}`. ¿Cómo le decimos? Agrega un *segundo* parámetro
a `path()` con `{}`. El `{}` es un array asociativo de Twig... nuevamente, tal como
en JavaScript. Pásale `slug` igual a... Veamos... Esta es una pregunta escrita a mano
por el momento, así que escribe `reversing-a-spell`.

[[[ code('fad5a0b0dc') ]]]

Cópialo *todo*, porque hay un link más aquí abajo para la misma pregunta. Para la
segunda pregunta... Pégalo nuevamente, pero cámbialo a `pausing-a-spell` para igualar
el nombre. Copiaré eso... Encuentra la última ocurrencia... Y pégalo.

[[[ code('dc81dc99c3') ]]]

Más adelante, cuando implementemos una base de datos, vamos a mejorar esto y evitaremos
repetirnos tantas veces. ¡Pero! Si volvemos, refrescamos... ¡Y hacemos click en el link,
funciona! Ambas páginas van hacia la misma ruta, pero con un valor diferente para el
slug.

A continuación, llevemos nuestro sitio al siguiente nivel, al crear una interface API
JSON que consumiremos con JavaScript.
