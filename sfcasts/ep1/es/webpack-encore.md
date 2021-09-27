# Hola Webpack Encore

Nuestra configuración de CSS y JavaScript está correcta: tenemos el directorio
`public/` con los archivos `app.css` y `question_show.js`. Dentro de nuestros
templates - por ejemplo `base.html.twig` - incluimos los archivos con la etiqueta
tradicional link o script. Claro, utilizamos la función `{{ asset() }}`, pero esta no
hace nada importante. Symfony para nada está tocando nuestros archivos del frontend.

Eso está bien. Pero si quieres ponerte serio con el desarrollo de frontend - como
utilizar un framework como React o Vue - necesitas llevarlo al siguiente nivel.

Para hacerlo, vamos a utilizar una librería de Node llamada Webpack: la cual es una
herramienta estándar en la industria para el manejo de los archivos del frontend.
Combina y unifica tus archivos CSS y JavaScript... aunque eso es solo la punta del
iceberg de lo que puede hacer.

Pero... para hacer que Webpack funcione en *realidad* bien necesitas de mucha
configuración complicada. Asi que, en el mundo de Symfony, utilizamos una *grandiosa*
librería llamada Webpack Encore. Es una capa ligera por *encima* de Webpack que...
¡Lo hace más fácil! Y tenemos todo un
[tutorial gratuito] (https://symfonycasts.com/screencast/webpack-encore)
aquí en SymfonyCasts.

Pero tengamos un curso rápido ahora mismo.

## Instalando Webpack Encore

Primero, asegúrate que tienes node instalado:

```terminal-silent
node -v
```

Y también yarn:

```terminal-silent
yarn -v
```

***TIP
Si no tienes Node o Yarn instalado - ve manuales oficiales sobre como
instalarlos para _tu_ SO. Para Node, ve https://nodejs.org/en/download/ y para
Yarn: https://classic.yarnpkg.com/en/docs/install . Recomendamos utilizar Yarn en la
versión 1.x para seguir este tutorial.
***

Yarn es un gestor de paquetes para Node... básicamente es un Composer para Node.

Antes de que instalemos Encore, asegúrate de guardar todos tus cambios - Yo ya lo
hice. Luego corre:

```terminal
composer require "encore:^1.8"
```

Espera... hace un minuto dije que Encore es una librería de *Node*. Entonces, por qué
lo estamos instalando con Composer? Excelente pregunta! Este comando en realidad *no*
instala Encore. Nop, instala un diminuto bundle llamado `webpack-encore-bundle`, el
cual ayuda a *integrar* nuestra app de Symfony con Webpack Encore. Lo *mejor* de esto
es que el bundle contiene una receta *muy* útil. Mira esto, corre:

```terminal
git status
```

Wow! La receta hizo *bastante* por nosotros! Algo interesante es que modificó nuestro
archivo `.gitignore`. Ábrelo en tu editor.

[[[ code('28c0dcbd53') ]]]

Bien! Ahora ignoramos `node_modules/` - el cual es la version de Node del directory
`vendor/` - y algunas otras rutas.

La receta también agregó algunos archivos YAML, los cuales ayudan a configurar
algunas cosas - pero en realidad no necesitas verlos.

Lo *más* importante que hizo la receta fue darnos estos 2 archivos: `package.json` -
el cual es el `composer.json` de Node - y `webpack.config.js`, el cual es el archivo
de configuración para Webpack Encore.

Revisa el archivo `package.json`. Esto le dice a Node qué librerías debería descargar
y ya tiene las cosas básicas que necesitamos. Aún más
importante: `@symfony/webpack-encore`.

[[[ code('0d929354c6') ]]]

## Instalando Dependencias de Node con Yarn

Para decirle a Node que instale esas dependencias, corre:

```terminal
yarn install
```

Este comando lee `package.json` y descarga un *montón* de archivos y directorios
dentro de la nueva carpeta `node_modules/`. Puede tomar algunos minutos en descargar
todo y construir un par de paquetes.

Cuando termine, vas a ver dos cosas nuevas. Primero, tienes un nuevo y flamante
directorio `node_modules/` con *demasiadas* cosas en él. Y esto ya está siendo
ignorado por git. Segundo, creó un archivo `yarn.lock`, el cual tiene la misma
función que `composer.lock`. Asi que... debes hacer commit del archivo `yarn.lock`,
pero no te preocupes por él.

Ok, Encore está instalado! A continuación, vamos a refactorizar nuestra configuración
del fronted para utilizarlo.
