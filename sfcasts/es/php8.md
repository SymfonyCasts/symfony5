# Actualización a PHP 8

No perdamos de vista nuestro objetivo. Ahora que hemos actualizado a Symfony 5.4, en cuanto eliminemos todas estas depreciaciones, podremos actualizar con seguridad a Symfony 6. Pero Symfony 6 requiere PHP 8, y yo he estado construyendo este proyecto en PHP 7. Así que el siguiente paso es actualizar nuestro código para que sea compatible con PHP 8. En la práctica, eso significa actualizar partes de nuestro código para utilizar algunas nuevas y geniales características de PHP 8. ¡Vaya! Y este es otro punto en el que Rector puede ayudarnos.

## ¡Rector actualiza a PHP 8!

Empieza por abrir `rector.php` y eliminar las tres líneas de actualización de Symfony. Sustitúyelas por `LevelSetList::UP_TO_PHP_80`. Al igual que con Symfony, puedes actualizar específicamente a PHP 7.3 o 7.4, pero tienen estas bonitas declaraciones `UP_TO_[...]`que actualizarán nuestro código a través de todas las versiones de PHP hasta PHP 8.0.

[[[ code('624efe53db') ]]]

Y... ¡eso es todo lo que necesitamos!

En tu terminal, he confirmado todos mis cambios, excepto el que acabamos de hacer. Así que ahora podemos ejecutar:

```terminal
vendor/bin/rector process src
```

¡Genial! Vamos a revisar algunos de estos cambios. Si quieres profundizar más, busca la entrada del blog [getrector.org](https://getrector.org/blog/2020/11/30/smooth-upgrade-to-php-8-in-diffs), que te muestra cómo hacer lo que acabamos de hacer... pero también te da más información sobre lo que hizo Rector y por qué.

Por ejemplo, uno de los cambios que hace es sustituir las sentencias `switch()` por una nueva función de PHP 8 `match()`. Esto explica eso... y muchos otros cambios. Ah, y la gran mayoría de estos cambios no son necesarios: no tienes que hacerlos para actualizar a PHP 8. Simplemente están bien.

## Promoción de las propiedades de PHP 8

El cambio más importante, que casualmente es el más común, es algo llamado "Propiedades Promocionadas". Esta es una de mis características favoritas en PHP 8, y puedes verla aquí. En PHP 8, puedes añadir una palabra clave `private`, `public`, o`protected` justo antes de un argumento en el constructor... y eso creará esa propiedad y la establecerá a este valor. Así que ya no tienes que añadir una propiedad manualmente ni establecerla a continuación. Sólo tienes que añadir `private` y... ¡listo!

[[[ code('9ab94501d9') ]]]

La gran mayoría de los cambios en este archivo son exactamente eso... aquí hay otro ejemplo en `MarkdownHelper`. La mayoría de los demás cambios son menores. Se han modificado algunas funciones de devolución de llamada para utilizar la nueva sintaxis corta `=>`, que en realidad es de PHP 7.4 

[[[ code('fa54ec03f3') ]]]

También puedes ver, aquí abajo, un ejemplo de refactorización de las sentencias `switch()` para utilizar la nueva función `match()` 

[[[ code('ae1ff2b43f') ]]]

Todo esto es opcional, pero es bueno que nuestro código se haya actualizado para utilizar algunas de las nuevas funciones. Si me desplazo un poco más hacia abajo, verás más de esto.

## ¿Tipos de propiedades de las entidades?

Ah, y dentro de nuestras entidades, fíjate en que, en algunos casos, ¡se han añadido tipos de propiedades! En el caso de `$roles`, esta propiedad se inicializa en una matriz. Rector se dio cuenta de ello... así que añadió el tipo `array` 

[[[ code('cbbfe91cbc') ]]]

En otros casos, como `$password`, vio que tenemos PHPDoc por encima, así que también añadió el tipo allí 

[[[ code('d80a7f97b8') ]]]

Sin embargo, esto es un poco cuestionable. El `$password` también podría ser nulo.

Abre `src/Entity/User.php` y baja hasta `$password`. El rector le dio un tipo `string`... ¡pero eso está mal! Si te fijas en el constructor de aquí abajo, no inicializamos `$password` a ningún valor... lo que significa que empezará `null`. Así que el tipo correcto para esto es un `?string` anulable . La razón por la que Rector hizo esto mal es... bueno... ¡porque tenía un error en mi documentación!. Esto debería ser`string|null`

[[[ code('d74a5cc7b3') ]]]

Uno de los mayores cambios que he realizado en mi código durante el último año, más o menos desde que se publicó PHP 7.3, ha sido añadir tipos de propiedades como ésta, tanto en mis clases de entidad como en mis clases de servicio. Si esto ha sido un poco confuso, no te preocupes. Vamos a hablar más sobre los tipos de propiedades dentro de las entidades en unos minutos. Puedes ver que Rector ha añadido algunas, pero a muchas de nuestras propiedades todavía les faltan.

## Configurando PHP 8 en composer.json

Bien, nuestro código debería estar ahora preparado para PHP 8. ¡Yay! Así que vamos a actualizar nuestras dependencias para PHP 8. En `composer.json`, bajo la clave `require`, actualmente dice que mi proyecto funciona con PHP 7.4 o 8. Voy a cambiar eso para que sólo diga`"php": "^8.0.2"`, que es la versión mínima para Symfony 6.0 

[[[ code('fcc930eb39') ]]]

Por cierto, Symfony 6.1 requiere PHP 8.1. Así que si vas a actualizarte a eso muy pronto, puedes saltar directamente a la 8.1.

Hay otra cosa que tengo aquí abajo, cerca de la parte inferior. Veamos... aquí vamos. En`config`, `platform`, tengo PHP configurado en 7.4. Eso asegura que si alguien está usando PHP 8, Composer todavía se asegurará de descargar dependencias compatibles con PHP 7.4. Cambia esto a `8.0.2`.

[[[ code('d34f920232') ]]]

¡Qué bien! Y ahora, como estamos usando PHP 8 en nuestro proyecto, es muy probable que algunas dependencias puedan ser actualizadas. Ejecuta:

```terminal
composer up
```

Y... ¡sí! Hay varias. Parece que `psr/cache`, `psr/log`, y`symfony/event-dispatcher-contracts` se han actualizado. Lo más probable es que todas estas nuevas versiones requieran PHP 8. Antes no podíamos actualizar, pero ahora sí. Si vamos a nuestra página y recargamos... ¡todo sigue funcionando!

## Actualizar Symfony Flex

Otra cosa en `composer.json` es el propio Symfony Flex. Flex utiliza su propio esquema de versiones, y la última versión es la 2.1. En este momento, la versión 2 de Flex y la versión 1 de Flex son idénticas... excepto que Flex 2 requiere PHP 8. Ya que estamos usando eso, ¡actualicemos! Cambia la versión a `^2.1`... luego vuelve a tu terminal y ejecuta

```terminal
composer up
```

una vez más. ¡Muy bien!

¡Muy bien, equipo! Nuestro proyecto ya utiliza PHP 8. Para celebrarlo, vamos a refactorizar y pasar de usar anotaciones a atributos nativos de PHP 8. OOOoo. Me encanta este cambio... en parte porque Rector lo hace súper fácil.
