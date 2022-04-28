# Actualizar la importante receta de FrameworkBundle

En tu terminal, ejecuta:

```terminal
composer recipes
```

Como probablemente sabes, cada vez que instalamos un nuevo paquete, ese paquete puede venir con una receta que hace cosas como añadir archivos de configuración, modificar ciertos archivos como `.env`, o añadir otros archivos. Con el tiempo, Symfony realiza actualizaciones de estas recetas. A veces son menores... como la adición de un comentario en un archivo de configuración. Pero otras veces, son mayores, como cambiar el nombre de las claves de configuración para que coincidan con los cambios en el propio Symfony. Y aunque no tienes que actualizar tus recetas, es una gran manera de mantener tu aplicación como una aplicación estándar de Symfony. También es una forma gratuita de actualizar el código obsoleto
# Hola recipes:update

Hasta hace poco, la actualización de las recetas era un dolor de cabeza. Si no estás familiarizado, ¡consulta nuestro tutorial "Actualizar a Symfony 5"! Yikes. ¡Pero ya no! A partir de Symfony Flex 1.18 o 2.1, Composer tiene un comando propio `recipes:update`. Literalmente, parchea tus archivos a la última versión... y es increíble. ¡Vamos a probarlo!

Ejecuta:

```terminal
composer recipes:update
```

Antes de ejecutar esto, nos dice que confirmemos todo lo que hemos estado trabajando. ¡Gran idea! Diré que estamos

> actualizando algo de código a Symfony 5.4 con Rector

```terminal-silent
git add .
git commit -m "upgrading some code to Symfony 5.4 with Rector"
```

¡Perfecto! Prueba de nuevo el comando `recipes:update`. La razón por la que quiere que nuestra copia de trabajo esté limpia es porque está a punto de parchear algunos archivos... lo que podría implicar conflictos.

Empecemos por `symfony/framework-bundle`, porque es el más importante. Los archivos más importantes de nuestro proyecto provienen de esta receta. Voy a pulsar `4`, despejar la pantalla, y ¡adelante!

Entre bastidores, esto comprueba el aspecto de la receta cuando la instalamos originalmente, lo compara con el aspecto actual de la receta y genera un diff que luego aplica a nuestro proyecto. En algunos casos, como éste, esto puede causar algunos conflictos, lo cual es bastante genial. La mejor parte puede ser que genera un registro de cambios que contiene todos los pull requests que han contribuido a estas actualizaciones. Si necesitas averiguar por qué ha cambiado algo, esto será tu amigo.

Ah, pero crear el registro de cambios requiere hacer un montón de llamadas a la API de GitHub, así que es posible que Composer te pida un token de acceso personal, como acaba de hacer conmigo. En algunos casos raros con una receta gigante como `framework-bundle`, si tu receta es muy, muy antigua, puede que te aparezca este mensaje aunque hayas dado un token de acceso a Composer. Si esto ocurre, sólo tienes que esperar 1 minuto... y volver a introducir tu código de acceso. Enhorabuena, acabas de alcanzar el límite de la API por minuto de GitHub.

De todos modos, ahí está el CHANGELOG. No suele ser tan largo, pero esta receta es la más importante y... bueno... estaba horriblemente desactualizada. Ah, y si tienes un terminal de moda como yo -esto es iTerm- puedes hacer clic en estos enlaces para saltar directamente al pull request, que vivirá en https://github.com/symfony/recipes.

## Cambios en el .env

Muy bien, vamos a repasar los cambios que ha hecho esto. Esta es la receta más grande e importante, así que quiero cubrir todo.

Como ya he hecho los deberes, borraré el registro de cambios y correré:

```terminal
git status
```

Woh. Ha hecho un montón de cambios, incluyendo tres conflictos. ¡Qué divertido! Vamos a verlos primero. Muévete y empieza dentro de `.env`. Veamos: aparentemente la receta eliminó estas líneas `#TRUSTED_PROXIES` y `#TRUSTED_HOSTS` 

[[[ code('71db1a63ff') ]]]

Ambas se establecen ahora en un archivo de configuración. Y aunque todavía puedes establecer una variable de entorno y hacer referencia a ella desde ese archivo de configuración, la receta ya no incluye estos comentarios. No estoy seguro de por qué esto ha causado un conflicto, pero vamos a eliminarlos.

## Cambios en services.yaml

El siguiente conflicto está en `config/services.yaml`. Este es bastante sencillo. Esta es nuestra configuración y abajo, la nueva configuración. La receta ha eliminado la entrada `App\Controller\`. Esto... nunca fue necesario a no ser que hagas controladores súper elegantes que no extiendan `AbstractController`. Se eliminó de la receta por simplicidad. También parece que la receta actualizada reformatea el `exclude` en varias líneas, lo que está bien. Así que tomemos su versión por completo.

[[[ code('6ce8a07342') ]]]

## Cambios en src/Kernel.php

El conflicto final está en `src/Kernel.php`... donde puedes ver que nuestra parte tiene un montón de código... y la suya no tiene nada.

¿Recuerdas que mencioné que `configureRoutes()` se trasladó a `MicroKernelTrait`? Pues resulta que todos estos métodos se trasladaron a `MicroKernelTrait`. Así que, a menos que tengas alguna lógica personalizada -lo que es bastante raro-, puedes borrarlo todo.

[[[ code('a8c5798ce7') ]]]

Bien, de vuelta al terminal, vamos a añadir esos tres archivos:

```terminal-silent
git add .env config/services.yaml src/Kernel.php
```

Y luego ejecuta

```terminal
git status
```

para ver qué más ha hecho la actualización de la receta.

## Se ha actualizado public/index.php y se ha eliminado bootstrap.php

Interesante. Eliminó `config/bootstrap.php` y modificó `public/index.php`. Están relacionados. Mira el diff de `index.php`:

```terminal-silent
git diff --cached public/index.php
```

Este archivo solía requerir `config/bootstrap.php`. Y el trabajo de ese archivo era leer y configurar todas las variables de entorno:

```terminal-silent
git diff --cached config/
```

Vamos a ver el nuevo `public/index.php`. Aquí está. Ahora esto requiere `vendor/autoload_runtime.php`. Y el archivo es mucho más corto que antes. Lo que estamos viendo es el nuevo componente Runtime de Symfony en acción 

[[[ code('903d5ebef5') ]]]

Puedes consultar su [entrada de blog de introducción](https://symfony.com/blog/new-in-symfony-5-3-runtime-component) para saber más sobre él.

Básicamente, el trabajo de arrancar Symfony y cargar todas las variables de entorno se ha extraído al componente Runtime. Pero... en realidad aún no tenemos ese componente instalado... por lo que, si intentamos actualizar la página, lo pasaremos mal:

> No se ha podido abrir `autoload_runtime.php`.

Para solucionar esto, dirígete a tu terminal y ejecuta

```terminal
composer require symfony/runtime
```

Este paquete incluye un plugin de Composer... por lo que nos preguntará si confiamos en él. Di "sí". Entonces se instala... ¡y enseguida explota cuando intenta borrar la caché! Ignora eso por ahora: lo arreglaremos en unos minutos. Se trata de actualizar otra receta.

Pero si probamos nuestro sitio... ¡funciona!

## Nueva configuración específica del entorno

Bien, ¡ya casi hemos terminado! De vuelta al terminal, veamos qué más ha cambiado:

```terminal-silent
git status
```

Fíjate en que ha eliminado `config/packages/test/framework.yaml`, pero ha modificado`config/packages/framework.yaml`. Este es probablemente el cambio más común que verás cuando actualices tus recetas hoy.

Abre `config/packages/framework.yaml`. Al final... hay una nueva sección `when@test`

[[[ code('9e6558d29c') ]]]

A partir de Symfony 5.3, ahora puedes añadir una configuración específica del entorno utilizando esta sintaxis. 
Esta configuración solía vivir dentro de `config/packages/test/framework.yaml`. 
Pero para simplificar, la receta ha eliminado ese archivo y sólo ha movido esa configuración al final de este archivo.

De vuelta al terminal, difunde ese archivo... que esconde otros dos cambios:

```terminal-silent
git diff --cached config/packages/framework.yaml
```

La receta también cambió `http_method_override` por `false`. Eso desactiva, por defecto, una función que probablemente no estabas utilizando de todos modos. También ha cambiado`storage_factory_id` por `session.storage.factory.native`. Esto tiene que ver con cómo se almacena tu sesión. Internamente, la clave cambió de `storage_id` a`storage_factory_id`, y ahora debería estar configurada.

## Configuración del enrutamiento específico del entorno

De vuelta al terminal, veamos los cambios finales:

```terminal-silent
git status
```

Hablando de configuración específica del entorno, puedes hacer el mismo truco con los archivos de enrutamiento. ¿Ves cómo ha eliminado `config/routes/dev/framework.yaml`, pero ha añadido`config/routes/framework.yaml`? Si abrimos `config/routes/framework.yaml`, ¡sí! tiene `when@dev` e importa las rutas que nos permiten probar nuestras páginas de error.

[[[ code('8c7bee0d3c') ]]]

Este es otro ejemplo de cómo la receta mueve la configuración fuera del directorio de entorno y dentro del archivo de configuración principal... sólo por simplicidad.

## El nuevo archivo preload.php

Por último, la receta ha añadido un archivo `config/preload.php`. Éste es bastante sencillo, y aprovecha la funcionalidad de precarga de PHP 

[[[ code('a250923ee6') ]]]

Básicamente, en producción, si apuntas tu `php.ini`, `opcache.preload` a este archivo, ¡obtendrás un aumento de rendimiento gratuito! Es así de sencillo. Bueno... casi así de sencillo. Lo único que tienes que hacer es reiniciar tu servidor web en cada despliegue... o PHP-FPM si lo utilizas. En SymfonyCasts lo aprovechamos para aumentar el rendimiento.

Y... ¡uf! La mayor actualización de la receta está hecha. Así que vamos a añadirlo todo y a confirmarlo. Porque a continuación, ¡más actualizaciones de recetas! Pero con FrameworkBundle detrás de nosotros, el resto será más fácil y rápido.
