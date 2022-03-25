Hola Amigos! y *bienvenidos* al mundo de Symfony 5... el cual *resulta* ser 
mi mundo favorito! Ok, quizás Disneylandia es mi mundo *favorito*... pero
programar en Symfony 5 está en *segundo* lugar...

Symfony 5 es simple y eficiente: es muy veloz, empieza en pequeño, pero crece conforme
a tu aplicación. Y esto *no* es solo jerga de Marketing! Tu aplicación de Symfony 
*literalmente* crecerá conforme necesites más funcionalidades. Ya hablaremos de eso más
tarde.

Symfony 5 es *también* el producto de *años* de trabajo sobre experiencia de desarrollo.
Básicamente, la gente detrás de Symfony quiere que *ames* utilizarlo sin sacrificar calidad.
Asi es, escribes código del cual estás orgulloso, amas el proceso, *y* construyes cosas 
rápidamente.

Symfony es también el framework *más rápido* de PHP, lo cual no nos sorprende: - su
creador *también* creó el sistema de análisis de rendimiento de PHP llamado Blackfire.
Por lo que el rendimiento siempre está en la mira.

***SEEALSO
Mira nuestro [Blackfire.io: Revealing Performance Secrets with Profiling](https://symfonycasts.com/screencast/blackfire)
curso sobre Blackfire.
***

## Descargando el instalador de Symfony

Entonces... Manos a la obra! Empieza por abrir http://symfony.com y dar click
en "Download". Lo que estamos *apunto* de descargar *no* es realmente Symfony.
Es un ejecutable que va a hacer que tu experiencia de desarrollo con
Symfony sea... Excelente.

Como estoy en una Mac, voy a copiar este comando. para luego abrir una terminal - yo 
ya tengo una abierta. No importa en *donde* lo ejecutes. Pégalo!

```terminal-silent
curl -sS https://get.symfony.com/cli/installer | bash
```

Esto *simplemente* descarga un archivo ejecutable y, para mi, lo guarda en mi carpeta
home. Para poder hacerlo ejecutable en *cualquier* lugar en el sistema, Voy a seguir
el consejo del comando y lo moveré a otro lugar:

```terminal-silent
mv /Users/weaverryan/.symfony/bin/symfony /usr/local/bin/symfony
```

Ok, inténtalo!

```terminal
symfony --version
```

Symfony está vivo! Saluda al CLI de Symfony: una herramienta de linea de comandos 
que nos va a ayudar con varias cosas a lo largo de nuestro camino hacia la gloria
de programación.

## Empezando una nueva aplicación de Symfony

Su *primer* trabajo será ayudarnos en crear un nuevo projecto de Symfony 5. Ejecuta:

```terminal
symfony new cauldron_overflow
```

Donde `cauldron_overflow` será el *directorio* donde la nueva aplicación vivirá.
Este *también* resulta ser el nombre del sitio que vamos a construir... Pero ya 
hablaremos de eso más tarde.

Detrás de escenas, este comando no está haciendo nada especial: clona un 
repositorio de Git llamado `symfony/skeleton` y luego utiliza Composer para 
instalar las dependencias del proyecto. Hablaremos más sobre ese repositorio 
*y* de Composer un poco más adelante.

Cuando termine, muévete al nuevo directorio:

```terminal
cd cauldron_overflow
```

Y luego *ábrelo* en tu editor favorito. 
Yo ya lo tengo abierto en *mi* editor favorito: PhpStorm, solo abre 
Archivo -&gt; Abrir Directorio y selecciona la carpeta del nuevo proyecto.
En fin, saluda a tu totalmente nuevo, brillante, prometedor proyecto de Symfony 5.

## Nuestra aplicación es diminuta!

Antes de comenzar a mover aquí y allá, vamos a crear un nuevo repositorio de git y
hacer un commit. Pero espera... Ejecuta:

```terminal
git status
```

> En la rama master, nada por hacer commit.

Sorpresa! El comando `new` de Symfony ya inicializó el repositorio de Git por
nosotros e hizo el primer commit. Puedes verlo tras ejecutar:

```terminal
git log
```

> Add initial set of files

Perfecto! Aunque, personalmente me hubiera gustado un mensaje ligeramente 
más épico... pero está bien.

Voy a oprimir "q" para salir.

Mencioné anteriormente que Symfony empieza en *pequeño*. Para probarlo, podemos 
ver una lista de *todos* los archivos agregados en el commit. Tras ejecutar:

```terminal
git show --name-only
```

Eso es! Nuestro proyecto, el cual está *completamente* listo para trabajar con 
Symfony tiene menos de 15 archivos... si no cuentas archivos como `.gitignore`.
Simple y eficiente.

## Revisando los Requerimientos

Conectemos un servidor web a nuestra aplicación y veámoslo en acción! Primero, 
asegurate que tu computadora tenga todo lo que necesita Symfony al ejecutar:

```terminal
symfony check:req
```

Para revisar los requerimientos. Estamos bien - pero si tienes algún problema y 
necesitas ayuda, menciónalo en los comentarios.

## Iniciando el Servidor Web de PHP

Para poner el proyecto en marcha, regresa a PhpStorm. Vamos a hablar más sobre 
cada directorio pronto. Pero la *primer* cosa que tienes que saber es que el directorio 
`public/` es el "documento raíz". Esto significa que necesitas apuntar tu servidor web -
como Apache o Nginx - a este directorio. Symfony tiene documentación sobre como hacerlo.

Pero! para facilitarnos la vida, en vez de configurar un servidor web en *nuestra* maquina,
podemos usar el servidor integrado de PHP. En la raíz de to proyecto, ejecuta:

```terminal
php -S 127.0.0.1:8000 -t public/
```

Tan pronto hacemos eso Podemos regresar a nuestro navegador e ir a 
http://localhost:8000 para descubrir... Bienvenido a Symfony 5! Ooh, que elegancia!

Siguiente: tan *fácil* como fue ejecutar ese servidor web de PHP, Voy a mostrarte 
aun una *mejor* opción para el desarrollo local. Ahora vamos a conocer el *significado* 
de los directorios en nuestra nueva aplicación *y* asegurarnos de que tenemos algunos 
plugins instalados en PhpStorm... los cuales hacen trabajar con Symfony todo un placer.