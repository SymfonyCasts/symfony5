# Assets: CSS, Imágenes, etc

Vamos muy bien pero, Cielos! Nuestro sitio está muy *feo*. Es hora de
arreglarlo.

Si descargas el código del curso en esta página, después de que lo descomprimas,
encontrarás el directorio `start/` con el directorio `tutorial/` ahí dentro: el
mismo directorio `tutorial/` que ves aquí. Vamos a copiar algunos archivos de
ahí en los próximos minutos.

## Copiando el Layout Base y el Archivo CSS principal

El primero es `base.html.twig.` Lo voy a abrir, copiar el contenido, cerrarlo, y
luego abriré nuestro `templates/base.html.twig.` Pega el nuevo contenido aquí.

[[[ code('21a000cf1e') ]]]

Esto no fué un gran cambio: sólo agregó algunos archivos CSS - incluyendo
Bootstrap - y un poco de HTML básico. Pero tenemos los mismos bloques que
antes: `{% block body %}` en el medio, `{% block javascripts %}`
, `{% block title %}`, etc.

Date cuenta que los link tags están *dentro* del bloque llamado `stylesheets`.
Pero eso aun no es importante. Explicaré porque está hecho de esa forma dentro
de poco.

[[[ code('13ee9de667') ]]]

Uno de los link tags está apuntando a `/css/app.css`. Ese es *otro* archivo que
vive en el directorio `tutorial/`. De hecho, selecciona el
directorio `images/` *y* `app.css` y cópialos. Ahora, selecciona el
directorio `public/` y pégalos. Agrega otro directorio `css/` y mueve app.css
adentro.

Recuerda: el directorio `public/` es nuestro documento raíz. Así que si
necesitas que un archivo sea accesible por un usuario del navegador, entonces
necesita vivir aquí. La ruta
`/css/app.css` cargará el archivo `public/css/app.css`.

Vamos a ver como se ve! Muévete hacia tu navegador y refresca. *Mucho* mejor. El
centro aun se ve terrible... pero eso es porque no hemos agregado ninguna
etiqueta HTML al template para esta página.

## A Symfony le Importan tus Assets

Así que hagamos una pregunta... y respondámosla: que funcionalidad nos ofrece
Symfony cuando se trata de CSS y JavaScript? La respuesta es... ninguna... o
muchas!

Symfony tiene dos niveles diferentes de integración con CSS y JavaScript. Por el
momento estamos usando el nivel básico. De hecho, por ahora, Symfony no está
haciendo
*nada* por nosotros: creamos un archivo CSS, luego le agregamos un link tag muy
tradicional con HTML. Symfony *no* está haciendo nada: todo depende de ti.

El *otro* tipo de integración de *mayor* nivel es utilizar algo llamado Webpack
Encore:
una *fantástica* librería que maneja minificación de archivos, soporte de Sass,
soporte a React o VueJS y otras muchas cosas. Te voy a dar un curso rápido sobre
Webpack Encore al final de este tutorial.

Pero por ahora, lo vamos a mantener simple: Crearás archivos CSS o de
JavaScript, los pondrás dentro del directorio `public/`, y luego crearás
un `link` o `script` tag que apunte a ellos.

## La No Tán Importante Función asset()

Bueno, de hecho, incluso con esta integración "básica", hay *una* pequeña
funcionalidad de Symfony que debes de utilizar.

Antes de mostrartelo, en PhpStorm abre preferencias... y busca de nuevo por "
Symfony"
para encontrar el plugin de Symfony. Ves esa option de directorio web? Cambiala
a
`public/` - solía ser llamada `web/` en versiones anteriores de Symfony. Esto
nos ayudará a tener un mejor autocompletado próximamente. Presiona "Ok".

Así es como funciona: cada vez que hagas referencias a un archivo estático en tu
sitio - como un archivo CSS, JavaScript o imagen, en vez de solo
escribir `/css/app.css`, debes de usar la función de Twig llamada `asset()`.
Entonces, `{{ asset() }}` y luego la misma ruta que antes, pero sin la `/`
inicial: `css/app.css`.

[[[ code('e90509371d') ]]]

Qué es lo que hace está increíble función `asset()`? Prácticamente.. nada. De
hecho, esto va a retornar *exactamente* la misma ruta que antes: `/css/app.css`.

Entonces porque nos molestamos en utilizar una función que no hace nada? Bueno,
en realidad *
hace* *dos* cosas... las cuales pueden o no interesarte. Primero, si decides
instalar tu aplicación en un *subdirectorio* de un dominio - como por ejemplo
`ILikeMagic.com/cauldron_overflow`, la función `asset()` automáticamente agrega
el prefijo
`/cauldron_overflow` a todas las rutas. *Grandioso!* si es que te interesa.

La *segunda* cosa que hace es más útil: si decides instalar tus assets a un CDN,
con agregar una linea a un archivo de configuración, repentinamente, Symfony
agregará el prefijo en
*todas* las rutas con la URL de tu CDN.

Asi que... en realidad no es *tán* importante, pero si utilizas `asset()` en
todos lados, serás feliz en caso de que luego lo necesites.

Pero... si refrescamos... sorpresa! El sitio exploto!

> Acaso olvidaste correr `composer require symfony/asset`? La función `asset` no existe.

Que tan genial es eso? Recuerda, Symfony empieza en pequeño: instalas las cosas
sólo
*cuando* las necesitas. En este caso, estamos tratando de utilizar una
funcionalidad que no está instalada... por lo tanto Symfony nos da el comando *
exacto* que tenemos que correr. Copialo, abre la terminal y ejecuta:

```terminal
composer require symfony/asset
```

Cuando termine... regresa al navegador y... funciona. Si observas la fuente HTML
y buscas `app.css`... Asi es! está imprimiendo la misma ruta que antes.

## Mejorando la página "show"

Hagamos que el centro de nuestra página se vea un poco mejor. De vuelta en el
directorio
`tutorial/`, abre `show.html.twig`, copia el contenido, ciérralo, luego abre
nuestra versión: `templates/question/show.html.twig`. Pega el nuevo código.

[[[ code('7807b55f2a') ]]]

Recuerda, aquí no está pasando nada importante: seguimos sobreescribiendo el
mismo bloque
`title` y `body`. Estamos usando la misma variable `question` y seguimos
haciendo el mismo ciclo sobre `answers` aquí abajo. Solo tenemos mucha más
sintaxis HTML... lo cual... tu sabes... hace que luzca bien.

Al refrescar... mira! Hermoso! De vuelta en el template, nota que esta página
tiene algunas tags `img`... pero *no* están usando la función `asset()`. Hay que
arreglarlo. Utilizaré un atajo!
Simplemente escribo "tisha", oprimo tab y... boom! el resto se agrega solo!
Buscar por `img`... y reemplaza también esta con "tisha". Te preguntas quien es
tisha? Oh, es solo una de los multiples gatos que tenemos aquí en el staff de
SymfonyCasts. Esta controla a Vladimir.

[[[ code('c3b798bd91') ]]]

Por cierto, en una aplicación real, en vez de que estas imágenes sean archivos
estáticos en el proyecto, podrían ser archivos que los usuarios *suben*. No te
preocupes: tenemos todo un tutorial sobre como [manejar la subida de archivos](https://symfonycasts.com/screencast/symfony-uploads).

Asegurate de que esto funciona y... si funciona.

## Puliendo la Homepage

La *última* página que no hemos estilizado es el homepage... la cual en este
momento... imprime un texto. Abre el
controlador: `src/Controller/QuestionController.php`. Asi es! Solamente retorna
un nuevo objeto `Response()` y texto. Podemos hacerlo mejor. Cambialo
por `return $this->render()`. Llamemos al
template `question/homepage.html.twig.` y... por ahora... No creo que
necesitemos pasar alguna variable al template... Asi que dejaré vacío el segundo
argumento.

[[[ code('597721a2c8') ]]]

Dentro de `templates/question/`, crea un nuevo archivo: `homepage.html.twig`.

La mayoría de los templates empiezan de la *misma* forma. Genial consistencia!
En la parte de arriba, `{% extends 'base.html.twig' %}`, `{% block body %}`
y `{% endblock %}`. En medio, agrega más HTML para ver si esto funciona.

[[[ code('34a7e7af54') ]]]

Muy bien... refresca la página y... excelente! Excepto por la parte de que se ve
horrible.

Robemos algo de código del directorio `tutorial/` *una* última vez.
Abre `homepage.html.twig`. Esto es *solo* un montón de HTML estático para hacer
que se vea mejor. Copialo, cierra ese archivo... y luego pegalo en nuestro
código `homepage.html.twig`

[[[ code('5a7ba368ed') ]]]

Y ahora... se ve *mucho* mejor.

Así que esta es la integración *básica* de CSS y Javascript dentro de Symfony:
tu te encargas de manejarlo. Claro, *debes* de utilizar la función `asset()`,
pero no hace nada muy impresionante.

Si quieres más, estás de suerte! En el *último* capítulo, llevaremos nuestros
assets al siguiente nivel. Te va a fascinar.

A continuación: nuestro sitio tiene algunos links! Y todos te llevan a ninguna
parte!
Aprendamos como generar URLs con rutas.
