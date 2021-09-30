# Webpack Encore: La Grandeza de Javascript

***TIP 
Ahora la receta agrega estos dos archivos en un lugar ligeramente diferente:
* `assets/app.js`
* `assets/styles/app.css`

Pero el propósito de cada uno es exactamente el mismo.
***

Muy bien: Así es como funciona todo esto. La receta agregó una nuevo
directorio `assets/`
con un par de archivos CSS y JS como ejemplo. El archivo `app.js` básicamente hace un
`console.log()` de algo:

[[[ code('c6a71046c8') ]]]

El `app.css` cambia el color del fondo a gris ligero:

[[[ code('f43de8ec0a') ]]]

Webpack Encore está completamente configurado por un solo
archivo: `webpack.config.js`.

[[[ code('6f832a3e78') ]]]

No hablaremos mucho sobre este archivo - lo vamos a guardar para el tutorial sobre
Encore - pero ya está configurado para *apuntar* a los archivos `app.js` y `app.css`:
Encore sabe que necesita procesarlos.

## Corriendo Encore

Para ejecutar Encore, ve a tu terminal y corre:

```terminal
yarn watch
```

Este es un atajo para correr `yarn run encore dev --watch`. ¿Qué hace esto? Lee esos
dos archivos en `assets/`, hace algo de procesamiento, y emite una versión
*construida* de cada uno dentro del nuevo directorio `public/build/`. Aquí está el
archivo `app.css` ya construido... y el archivo `app.js`. Si corriéramos Encore en
modo de producción - el cual es solamente otro comando - *minificaría* el contenido
de cada archivo.

## Incluyendo los Archivos CSS y JS Construidos

Ocurren muchas otras cosas interesantes, pero esta es la idea básica: ponemos el
código en el directorio `assets/`, pero apuntamos a los archivos *construidos* en
nuestros templates.

Por ejemplo, en `base.html.twig`, en vez de apuntar al viejo archivo `app.css`,
queremos apuntar al que está en el directorio `build/`. Eso es muy simple, pero
WebpackEncoreBundle tiene un atajo para hacerlo incluso más fácil:
`{{ encore_entry_link_tags() }}` y pasa este `app`, porque ese es el nombre del
archivo fuente - se le llama "entry" en el mundo de Webpack.

[[[ code('5b5d122a07') ]]]

Abajo, agrega la etiqueta script con `{{ encore_entry_script_tags('app') }}`.

[[[ code('b39b2c4f5f') ]]]

¡Vamos a probarlo! Ve al navegador y refresca. ¿Funcionó? ¡Lo hizo! El color de fondo
es gris... y si abro la consola, ahí está el log:

> Hello Webpack Encore!

Si miras la fuente HTML, ahí no está ocurriendo nada especial: tenemos una simple
etiqueta link apuntando a `/build/app.css`.

## Moviendo nuestro Código a Encore

Ahora que esto está funcionando, vamos a mover *nuestro* CSS hacia el nuevo sistema.
Abre `public/css/app.css`, copia todo esto, luego haz click derecho y borrar el
archivo. Ahora abre el *nuevo* `app.css` dentro de `assets/` y pega.

[[[ code('1fcae3bccb') ]]]

*Tan pronto* como hago eso, cuando refresco... ¡Funciona! ¡Nuestro CSS está de
vuelta! La razón es que - si revisas tu terminal - `yarn watch` está *observando* a
nuestros archivos por cambios. Tan pronto modificamos el archivo `app.css`, esto
vuelve a leer el archivo y arroja una nueva versión dentro del
directorio `public/build`. Esa es la razón por la cual corremos esto en segundo
plano.

Hagamos lo mismo para nuestro JavaScript particular. Abre `question_show.js` y, en
vez de tener un archivo JavaScript específico por página - donde solo incluimos esto
en nuestra página "show" - para mantener las cosas simples, voy a poner esto dentro
del nuevo `app.js`, el cual es cargado en *cada* página.

[[[ code('d32dc534aa') ]]]

Luego ve a borrar el directorio `public/js/` completamente... y `public/css/`.
También abre `templates/question/show.html.twig` y, al final, remueve la vieja
etiqueta script.

[[[ code('72d626d0d5') ]]]

Con algo de suerte, Encore ya *reconstruyó* mi `app.js`. Asi que si damos click para
ver una pregunta - Voy a refrescar solo para estar seguros - y... da click en los
íconos para votar. ¡Si! Todavía funciona.

## Instalando e Importando Librerías Externas (jQuery)

Ya que estamos usando Encore, existen algunas cosas *muy* interesantes que podemos
hacer. Esta es una: en vez de enlazar a una CDN o descargar jQuery directamente en
nuestro proyecto y agregarlo al commit, podemos *importar* jQuery e instalarlo en
nuestro directorio `node_modules/`... lo cual es *exactamente* como lo haríamos en
PHP: Instalamos una librería pública dentro de `vendor/` en vez de descargarla
manualmente.

Para hacer eso, abre una nueva terminal y corre:

```terminal
yarn add jquery --dev
```

Esto es lo equivalente a correr el comando `composer require`: Agrega jquery al
archivo `package.json` y lo descarga dentro de `node_modules/`. La parte `--dev` no
es importante.

Después, dentro de `base.html.twig`, remueve por completo jQuery del layout.

[[[ code('09aa8d7543') ]]]

Si regresas a tu navegador y refrescas la página ahora... Está completamente roto:

> $ is not defined

...viniendo de `app.js`. Eso tiene sentido: *Solamente* descargamos jQuery en nuestro
directorio `node_modules/` - aquí puedes encontrar un directorio llamado `jquery` - pero 
aún no lo estamos *usando*.

¿Cómo lo utilizamos? Dentro de `app.js`, descomentariza la línea del
`import: import $ from 'jquery'`.

[[[ code('78bf71af69') ]]]

Esto "carga" el paquete `jquery` que instalamos y lo *asigna* a la variable `$`.
Todas esas variables $ de más abajo están haciendo referencia al valor que
importamos.

Esta es la parte *realmente* interesante: sin hacer *ningún* otro cambio, cuando
refrescamos, ¡Funciona! Webpack se *dio* cuenta que estamos importando `jquery` y
automáticamente lo empaquetó *dentro* del archivo `app.js` final. Importamos las
cosas que necesitamos, y Webpack se encarga de... empaquetar todo.

***TIP
De hecho, Webpack los separa en multiples archivos por cuestión de eficiencia.
En realidad, jQuery vive dentro de un archivo diferente en public/build/ ¡Pero eso no
es importante!
***

## Importando el CSS de Bootstrap

Podemos hacer lo mismo para el CSS de Boostrap. En `base.html.twig`, arriba, elimina
la etiqueta que *enlaza* a Bootstrap.

[[[ code('d084eb8896') ]]]

Nada nuevo, cuando refrescamos, nuestro sitio se ve terrible.

Para arreglarlo, encuentra tu terminal y corre:

```terminal
yarn add bootstrap --dev
```

Esto descarga el paquete de `bootstrap` dentro de `node_modules/`. Este paquete
contiene ambos JavaScript y CSS. Queremos activar el CSS.

Para hacerlo, abre `app.css` y, en la parte de arriba, utiliza la vieja y confiable
sintaxis `@import`. Dentro de las comillas, escribe `~bootstrap`:

[[[ code('01ba1837f0') ]]]

En CSS, la `~` es una forma especial de decir que quieres cargar el CSS del paquete
de `bootstrap` dentro de `node_modules/`.

Ve al navegador, refresca y... estamos de vuelta! Webpack vio el import, tomó el CSS
del paquete de bootstrap, y lo incluyó en el archivo `app.css` final. ¿Qué tan bueno
es eso?

## ¿Qué Otras Cosas Puede Hacer Encore?

Esto es solo el comienzo de lo que Webpack Encore puede hacer. También puede
minificar tus archivos para producción, puede compilar código Sass o LESS, viene con
soporte para React y Vue.js, maneja versiones para los archivos y más. Para aprender
más, mira nuestro tutorial gratuito
sobre [Webpack Encore](https://symfonycasts.com/screencast/webpack-encore).

Y... ¡Eso es todo para este tutorial! ¡Felicitaciones por llegar al final junto
conmigo! Ahora ya entiendes las partes más importantes de Symfony. En el siguiente
tutorial, vamos a hacer crecer incluso aún *más* tu potencial de Symfony al revelar
el secreto de los servicios. Serás imparable.

Como siempre, si tienes preguntas, problemas o tienes una historia divertida - especialmente
si involucra a tu gato - nos *encantaría* escuchar sobre ti en los comentarios.

Muy bien amigos - ¡Nos vemos la próxima vez!
