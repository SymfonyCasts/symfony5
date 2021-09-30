# Profiler: El mejor amigo de tu Debugger

Estamos teniendo un *muy* buen progreso - Deberías estar orgulloso! Veamos qué
archivos hemos modificado:

```terminal-silent
git status
```

Agrega Todo:

```terminal-silent
git add .
```

Y haz commit:

```terminal-silent
git commit -m "Added some Twiggy goodness"
```

## Instalando el Profiler

Porque *ahora* quiero instalar una de mis herramientas de symfony
favoritas. Corre:

```terminal
composer require profiler --dev
```

Estoy usando `--dev` porque el profiler es una herramienta que sólo necesitaremos
mientras estamos en *desarrollo*: No será usada en producción. Esto significa que
Composer lo agrega a la sección `require-dev` de `composer.json`. No es tan
importante, pero es la forma correcta de hacerlo.

***TIP
En proyectos nuevos, en vez de `symfony/profiler-pack`, podrías ver 3 paquetes aquí,
incluyendo `symfony/web-profiler-bundle`. ¡No hay problema! Explicaremos esto
en algunos minutos.
***

[[[ code('3b179e857b') ]]]

Y... en este punto, *no* debería sorprendernos que esto ha instalado una receta!

Corre:

```terminal
git status
```

## Saluda a la Barra de Herramientas Web Debug

¡Oh, wow! Agregó *tres* archivos de configuración. Gracias a éstos, el módulo
funcionará *al instante*. Pruébalo: de vuelta a tu navegador, refresca la página.
¡Saluda a la barra de herramientas debug! La dichosa barrita en la parte inferior.
Ahora esto aparecerá en *cada* página HTML mientras estamos desarrollando.
Nos muestra el código de status, cuál controlador y ruta usamos, velocidad,
memoria, llamadas Twig e incluso más íconos aparecerán a medida que empezamos a
usar más partes de symfony.

## Y Saluda al Profiler

La *mejor* parte es que puedes hacer click en cualquier de estos íconos para
saltar... al *profiler*. Esta es básicamente la version expandida de la barra de
herramientas y está llena de información sobre la carga de la página, incluyendo
la información del request, response e incluso una maravillosa pestaña de
performance. Esta *no solo* es una buena manera de hacer un debug del performance
de tu aplicación, *también* es una gran manera... de simplemente entender qué está
sucediendo dentro de Symfony. 

Hay otras secciones para Twig, configuración, cacheo y eventualmente habrá una
pestaña para ver las queries a la base de datos. A propósito, esto no es solo para
páginas HTML: *también* puedes acceder al profiler para las llamadas AJAX que
haces a tu app. Te mostraré cómo más adelante.

## Las Funciones dump() y dd()

Cuando instalamos el profiler, también obtuvimos otra herramienta útil llamada
`dump()`. Haré click en atrás un par de veces para ir a la página. Abre el
controlador: `src/Controller/QuestionController.php`.

Imagina que queremos ver una variable. Normalmente, usaría `var_dump()`. En vez
de ello, usa `dump()` y vamos a imprimir el `$slug` y... qué tal el propio
objeto `$this`.

[[[ code('277ed16960') ]]]

Cuando refrescamos, órale! Funciona *exactamente* como `var_dump()` excepto...
*muchísimo* más bello y útil. El controlador aparentemente tiene una propiedad
llamada `container`... y podemos ir más y más profundo.

Y si eres *muy* haragán... Cómo la mayoría de nosotros lo es... también puedes
usar `dd()` lo cual significa `dump()` y luego `die()`.

[[[ code('8ac0d89ffd') ]]]

Ahora cuando refrescamos... hace el dump, pero *también* termina la ejecución en
la página. Hemos perfeccionado el desarrollo basado en dump-and-die. ¿Creo que
deberíamos estar orgullosos?

## Instalando el Paquete de Debug

Cámbialo de vuelta a `dump()`... y *sólo* hagamos `dump($this)`.

[[[ code('fc22997937') ]]]

Hay *otra* librería que podemos instalar para herramientas de debug. Esta es
menos importante - pero de todas formas buena para tener en cuenta. En tu terminal,
corre:

```terminal
composer require debug
```

Esta vez *no* estoy usando `-- dev` porque esto instalará algo que sí quiero en
producción. Esto instala el DebugBundle - eso no es algo que necesitemos en
producción - pero *también* instala Monolog, que es una librería de logueo.
Y probablemente sí querramos loguear cosas en producción.

## Paquetes Composer?

Antes de hablar de lo que esto nos dió, hecha un vistazo al nombre del paquete
que instaló: `debug-pack`. Esta no es la primera vez que hemos instalado
una librería con "pack" en su nombre.

Un "pack" es un concepto especial en Symfony: Es como un tipo de paquete "falso"
cuya única función es ayudar a instalar varios paquetes al mismo tiempo. Echale
un vistazo: copia el nombre del paquete, busca tu navegador, y ve a
https://github.com/symfony/debug-pack. Orale! No es nada más que un archivo
`composer.json`! Esto nos da una manera fácil de instalar *solo* este paquete...
pero en realidad obtener *todas* estas librerías.

***TIP
En mi proyecto, instalar un "pack" solo agregaría *una* linea a `composer.json`:
`symfony/debug-pack`. Pero a partir de `symfony/flex` 1.9, cuando instalas un
pack, en vez de agregar `symfony/debug-pack` a `composer.json`, agregará 5
paquetes. Aún obtienes el mismo código, pero esto facilita el manejo de las
versiones de los paquetes.
***

Así que gracias a esto, tenemos dos nuevas cosas en nuestra aplicación. La
primera es un logguer! Si refrescamos la página... y hacemos click en el profiler,
tenemos la sección "Logs" que nos muestra *todos* los logs para este request.
Estos *también* son guardados en el archivo `var/log/dev.log`.

La segunda cosa nueva en nuestra aplicación es... bueno... si miraste atentamente,
el `dump()` desapareció de la página! El DebugBundle integra la función `dump()`
incluso *más* dentro de Symfony. Ahora si usamos *dump()*, en vez de imprimirlo en
la mitad de la página, lo pone aquí abajo en la barra de herramientas debug.
Puedes hacer click en ella para ver una versión más grande. No es tan importante...
Es solo otro ejemplo de cómo Symfony se vuelve más listo a medida que instalas más
cosas.

## El Comando server:dump

Oh, ya que estamos hablando de ello, el DebugBundle nos dió un nuevo
comando de la consola. En tu terminal, corre:

```terminal
php bin/console server:dump
```

Esto inicia un pequeño servidor detrás de escena. *Ahora*, siempre que se ejecute
`dump()` en nuestro código, aún se muestra en nuestra barra de herramientas...
Pero *también* se imprime en la terminal! Esa es una excelente manera de ver
información pedida en los requests de AJAX. Presionaré Control-C para detenerlo.

## Expandiendo Packs

Oh, y hablando de estos "packs", si abres el archivo `composer.json`, el único
problema con los packs es que aquí sólo vemos `debug-pack` version 1.0:
no podemos controlar las versiones de los paquetes de dentro. Simplemente obtienes
cualquiera que sea la versión que el pack solicita.

[[[ code('e5f946509a') ]]]

Si necesitas mas control, no hay problema... Sólo extrae el pack:

```terminal
composer unpack symfony/debug-pack
```

Eso hace exactamente lo que esperas: quita `debug-pack` de `composer.json` y
*agrega* los paquetes subyacentes, como `debug-bundle` y `monolog`. Ah,
y como el `profiler-pack` es una dependencia del `debug-pack`, está en ambos
lugares. Removeré el extra del `require`.

[[[ code('fce7601089') ]]]

A continuación, hagamos nuestro sitio más bello incluyendo CSS en nuestra
aplicación.
