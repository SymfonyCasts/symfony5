# La Receta de Twig

Salvo que estés creando una API pura - y hablaremos de retornar JSON más tarde
en este tutorial - necesitarás escribir algo de HTML. Y... poner texto o HTML
en un controlador así es... horrible.

No te preocupes! Symfony tiene una *excelente* integración con una *increíble* librería
de templates llamada Twig. Hay solo un problema: nuestra app de Symfony es *tan* pequeña
que Twig ni siquiera está instalado! Ah, pero eso no es *realmente* un problema... gracias
al sistema de recetas.

## Instalar Twig

Vuelve a https://flex.symfony.com y haz una búsqueda por "template". Ahí está!
Aparentemente la librería de templates recomendada por Symfony es also llamado `twig-pack`.
¡Instalémosla!

```terminal
composer require template
```

Esto instala algunos paquetes... Y sí! 2 recetas! Veamos lo que hicieron:

```terminal
git status
```

## Chequeando los Cambios de la Receta

Wow, impresionante. Muy bien: los cambios en `composer.json` `composer.lock`
y `symfony.lock` eran de esperarse. *Todo lo demás* fue hecho por estas recetas.

## ¿Qué son los Bundles?

Veamos `bundles.php` primero:

```terminal
git diff config/bundles.php
```

Interesante: agregó dos lineas. Abre ese archivo: `config/bundles.php`.

[[[ code('4dc1ee719f') ]]]

Un "bundle" es un *plugin* de Symfony. Comúnmente, cuando quieres agregar una funcionalidad
a tu app, instalas un bundle. Y cuando instalas un bundle, necesitas
*habilitarlo* en tu aplicación. Hace mucho tiempo atrás, lo hacíamos manualmente.
Pero gracias a Symfony Flex, siempre que instalas un bundle de Symfony,
automáticamente actualiza este archivo para habilitarla por tí. Así que... ahora que hemos
hablado de este archivo, probablemente jamás necesitarás pensar en esto de nuevo.

## Los directorios templates/ y config/

La receta también agregó un directorio `templates/`. Así que si te preguntabas donde se
supone que viven tus templates... la receta contestó esa pregunta!
También agregó un archivo de layout `base.html.twig` del cual hablaremos pronto.

[[[ code('f9e2431ee2') ]]]

Entones... aparentemente nuestros templates se supone que viven en `templates/`.
¿Pero por qué? Quiero decir, esa ruta está fijada en algún archivo interno de la
librería de Twig? No! Vive justo en nuestro código, gracias al archivo
`twig.yaml` que fue creado por la receta. Revisémoslo: `config/packages/twig.yaml`.

[[[ code('0f072819a3') ]]]

Hablaremos más sobre estos archivos YAML en otro tutorial. Pero sin comprender demasiado
sobre este archivo, él mismo... ya tiene sentido! Esta configuración `default_path`
apunta al directorio `templates/`. ¿Quieres que tus templates vivan en algún otro lugar?
Solo cambia esto y... Listo! Tú tienes el control.

Por cierto, no te preocupes por esta rara sintaxis `%kernel.project_dir%`.
Aprenderemos sobre esto más adelante. Pero básicamente, es una forma sofisticada de
apuntar al directorio raíz de nuestro proyecto.

La receta también creó otro archivo `twig.yaml` el cual es menos importante:
`config/packages/test/twig.yaml`. El mismo hace un *pequeño* cambio a Twig
para tus tests automatizados. Los detalles no importan realmente. El punto es:
Hemos instalado Twig y su receta se encargó de todo lo demás.
Estamos 100% listos para usarlo en nuestra app. ¡Hagamos esto a continuación!
