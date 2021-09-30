# Bienvenidos a nuestra pequeña Aplicación y setup de PhpStorm

Uno de mis objetivos principales en este tutorial será ayudarte a
entender *realmente* cómo funciona Symfony, tu aplicación.

Para empezar, echemos un vistazo a la estructura de carpetas.

## El Directorio public/

Hay solo 3 directorios que debes tener en cuenta. Primero, `public/`
es el documento raíz: el cual contendrá todos los archivos que deben
ser accesibles por un navegador. Y... por ahora hay uno solo: `index.php`:

[[[ code('36cb7c15bf') ]]]

Éste se llama el "front controller": un término complejo que los programadores
inventaron para decir que este archivo es el que ejecuta tu servidor web.

Pero, en realidad, salvo poner archivos CSS o imágenes en `public/`,
casi nunca tendrás que pensar en ello.

## src/ y config/

Así que... En realidad te mentí. Hay en verdad *sólo dos* directorios que
debes tener en cuenta: `config/` y `src/`. `config/` tiene... ehh... perritos?
No, `config/` tiene archivos de configuración y `src/` es donde tu código
PHP estará. Es así de simple.

Dónde está Symfony? Nuestro proyecto *comenzó* con un archivo `composer.json`:

[[[ code('e8bb6427f4') ]]] 
 
el cual contiene todas las librerías de terceros que nuestra aplicación
*necesita*. Detrás de escenas, el comando `symfony new` utilizó a composer
para instalarlas... Lo cual es una forma *sofisticada* de decir que
Composer descargó un montón de librerías dentro del directorio `vendor/`...
Incluyendo Symfony.

Más adelante hablaremos de los otros archivos y directorios, pero éstos todavía
no nos importan.

## Utilizando el Servidor Web Local de Symfony

Hace algunos minutos, usamos PHP para iniciar un servidor web local. Bien. Pero
presiona Ctrl+C para salir del mismo. Por qué? Porque esa herramienta binaria
symfony que instalamos viene con un servidor local mucho mas poderoso.

Ejecuta: 

```terminal
symfony serve
```

Eso es todo. La primera vez que lo corres, podría preguntarte sobre
instalar un certificado. Esto es opcional. Si lo instalas - yo lo hice -
iniciará el servidor web con https. Sip, tienes https local con cero esfuerzo.
Una vez que corre, ve a tu navegador y refresca. Funciona! Y ese pequeño candado
prueba que estamos usando https.

Para parar el servidor, solo presiona Control + C. Puedes ver todas estas
opciones de comando al ejectuar: 

```terminal
symfony serve --help 
```

Como por ejemplo, formas de controlar el número de puerto

Cuando uso este comando, usualmente corro: 

```terminal
symfony serve -d
```

-d significa correr como un daemon. Hace exactamente lo mismo excepto
que *ahora* corre en segundo plano... Lo que significa que puedo seguir
usando esta terminal. Si corro:

```terminal
symfony server:status
```
 
Me muestra que el servidor está corriendo y

```terminal
symfony server:stop
```

Lo apagará. Iniciemoslo de nuevo: 

```terminal-silent
symfony serve -d
```

## Instalando Plugins de PhpStorm

Ok: estamos a punto de comenzar a escribir *un montón* de código... ai que quiero
asegurarme de que tu editor está listo para trabajar. Y, claro, puedes usar
cualquier editor que tu quieras. Pero mi *mejor* recomendación es PhpStorm!
En serio, hace que desarrollar en Symfony sea un *sueño*! Y no, las buenas
personas de PhpStorm no me están pagando para decir esto... aunque... *sí*
patrocinan a varios desarrolladores de código libre en PHP... lo que lo hace
aún mejor.

Para tener un *fantástico* PhpStorm, tienes que hacer dos cosas. Primero,
abre Preferencias, selecciona "Complementos" y click en "Marketplace".
Haz una búsqueda por "Symfony". Este plugin es *increíble*... probado
por casi 4 millones de descargas. Esto nos dará *toda clase* de
auto-completes e inteligencia extra para Symfony.
 
Si no lo tienes aún, instálalo. Deberías también instalar los plugins
"PHP Annotations" y "PHP toolbox". Si realizas una búsqueda por "php toolbox"...
puedes ver los tres de ellos. Instálalos y luego reinicia PhpStorm.

Una vez reiniciado, vuelve a Preferencias y haz una búsqueda por Symfony.
Además de instalar este plugin, tienes que habilitarlo en cada proyecto.
Haz click en Habilitar y luego Aplicar. Dice que tienes que reiniciar PhpStorm...
pero no creo que eso sea necesario.

La *segunda* cosa que tienes que hacer en PhpStorm es buscar Composer y
encontrar la sección "Idiomas y Frameworks", "PHP", "Composer".
Asegúrate de que la opción "Sincronizar ajustes IDE con composer.json"
está activada... lo cual automáticamente configura algunas funciones útiles.

Haz click en "Ok" y... estamos listos! A continuación, vamos a crear nuestra primerísima
página y veremos de qué se trata symfony.
