# Anotaciones a atributos

Ahora que estamos en PHP 8, vamos a convertir nuestras anotaciones de PHP en los atributos de PHP 8, que están más de moda. Refactorizar las anotaciones a atributos es básicamente... un trabajo muy ocupado. Puedes hacerlo a mano: los atributos y las anotaciones funcionan exactamente igual y utilizan las mismas clases. Incluso la sintaxis es sólo un poco diferente: utilizas dos puntos para separar los argumentos... porque en realidad estás aprovechando los argumentos con nombre de PHP. Genial.

## Configurar Rector para actualizar las anotaciones

Así que la conversión es sencilla... pero uf, no me entusiasma hacer todo eso manualmente. Afortunadamente, ¡Rector vuelve al rescate! Busca "rector annotations to attributes" para encontrar una entrada del blog que te dice la configuración exacta de importación que necesitamos en `rector.php`. Copia estas tres cosas. Ah, y a partir de Rector 0.12, hay un nuevo objeto `RectorConfig` más sencillo que verás en esta página. Si tienes esa versión, no dudes en utilizar ese código.

Ah, y antes de pegar esto, busca tu terminal, añade todo... y luego confirma. Perfecto

De vuelta en `rector.php`, sustituye la única línea por estas cuatro líneas... excepto que no necesitamos la `NetteSetList`... y tenemos que añadir unas cuantas declaraciones `use`. Volveré a escribir la "t" en `DoctrineSetList`, pulsaré "tab", y haré lo mismo para`SensiolabsSetList`.

[[[ code('e0640cbb60') ]]]

Ahora, ya sabes lo que hay que hacer. Ejecuta

```terminal
vendor/bin/rector process src
```

y mira lo que pasa. Vaya... ¡esto es impresionante! Mira! Ha refactorizado maravillosamente esta anotación a un atributo y... ¡lo ha hecho por todas partes! Tenemos rutas aquí arriba. Y todas nuestras anotaciones de entidades, como la entidad `Answer` también se han convertido. Eso fue una tonelada de trabajo... ¡todo automático!

[[[ code('8d77ced2f8') ]]]

[[[ code('8b2965fb32') ]]]

## Arreglando PHP CS

Aunque, como hace a veces Rector, estropeó algunas de nuestras normas de codificación. Por ejemplo, hasta el final, refactorizó esta anotación `Route` a un atributo... pero luego añadió un pequeño espacio extra antes del tipo de retorno `Response`. Eso no es un problema. Después de ejecutar Rector, siempre es una buena idea ejecutar PHP CS Fixer. Hazlo:

```terminal
tools/php-cs-fixer/vendor/bin/php-cs-fixer fix
```

Me encanta. Un montón de correcciones para que nuestro código vuelva a estar en línea. Ejecuta

```terminal
git diff
```

para ver cómo quedan las cosas ahora. La anotación `Route` se ha convertido en un atributo... y PHP CS Fixer ha vuelto a poner el tipo de retorno `Response` como estaba antes. Rector incluso refactorizó `IsGranted` de SensioFrameworkExtraBundle a un atributo.

Pero si sigues desplazándote hacia abajo hasta que encuentres una entidad... aquí vamos... ¡oh! ¡Se ha cargado los saltos de línea entre nuestras propiedades! No es súper obvio en el diff, pero si abres cualquier entidad... ¡vaya! Esto parece... estrecho. Me gustan los saltos de línea entre las propiedades de mis entidades.

[[[ code('6ff510a109') ]]]

Podríamos arreglar esto a mano... pero me pregunto si podemos enseñar a PHP CS Fixer a hacer esto por nosotros.

Abre `php-cs-fixer.php`. La regla que controla estos saltos de línea se llama`class_attributes_separation` con una "s" - lo arreglaré en un minuto. Ponlo en una matriz que describa todas las diferentes partes de nuestra clase y cómo debe comportarse cada una. Por ejemplo, podemos decir `['method' => 'one']` para decir que queremos una línea vacía entre cada método. También podemos decir `['property' => 'one']` para tener un salto de línea entre nuestras propiedades. También hay otro llamado `trait_import`. Ponlo también en `one`. Eso nos da una línea vacía entre nuestras importaciones de rasgos, que es algo que tenemos encima de `Answer`.

[[[ code('ad6d04f79f') ]]]

Ahora prueba de nuevo con php-cs-fixer:

```terminal-silent
tools/php-cs-fixer/vendor/bin/php-cs-fixer fix
```

¡Ups!

> Las reglas contienen fijadores desconocidos: "class_attribute_separation"

Quise decir `class_attributes_separation` con una "s". Sin embargo, qué gran error. Probemos de nuevo y... ¡genial! Ha cambiado cinco archivos, y si los compruebas... ¡han vuelto!

[[[ code('b249f94c45') ]]]

Con sólo unos pocos comandos hemos convertido todo nuestro sitio de anotaciones a atributos. ¡Guau!

A continuación, vamos a añadir tipos de propiedades a nuestras entidades. Eso nos va a permitir tener menos configuración de entidades gracias a una nueva función de Doctrine.
