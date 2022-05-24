# Actualizando a Symfony 6.0

¡Por fin ha llegado el momento de actualizar a Symfony 6! ¡Woo!

## Rector se actualiza a 6.0

Pero antes, por si acaso, vamos a ejecutar Rector una vez más. Vuelve al repositorio de Rector, haz clic en el enlace de Symfony, y... roba el mismo código que teníamos antes. Pégalo en nuestro archivo `rector.php`. Luego, al igual que hicimos para Symfony 5.4, cambia `SymfonySetList` por `SymfonyLevelSetList`, y esta vez, di`UP_TO_SYMFONY_60`.

[[[ code('8ba578b07b') ]]]

En teoría, no debería haber ninguna diferencia de código entre Symfony 5.4 y 6.0... aunque a veces hay pequeñas limpiezas que puedes hacer una vez que hayas actualizado.

Ejecutemos esto y veamos qué ocurre. Digamos:

```terminal
vendor/bin/rector process src/
```

Y... vale. Ha hecho un cambio. Se trata de nuestro suscriptor de eventos: ha añadido un tipo de retorno `array`. Esto se hizo porque, en el futuro, esta interfaz puede añadir un tipo de retorno`array`. Así que ahora nuestro código es compatible con el futuro.

[[[ code('469b470d19') ]]]

## Actualización a través de Composer

Una vez hecho esto, ¡vamos a actualizar! En `composer.json`, tenemos que encontrar las bibliotecas principales de Symfony y cambiar su versión de `5.4.*` a `6.0.*`. Tomemos el camino más perezoso y hagámoslo con un "Find & Replace".

[[[ code('b20f0683ca') ]]]

¡Genial! Como antes, no vamos a tocar ninguna biblioteca de Symfony que no forme parte del paquete principal y que siga su propio esquema de versiones. Ah, y en el fondo, esto también cambió `extra.symfony.require` a `6.0.*`.

Así que, ¡estamos listos! Como antes, podríamos decir:

```terminal
composer up 'symfony/*'
```

Pero... No me voy a molestar en eso. Actualicemos todo con sólo:

```terminal
composer up
```

Y... ¡fracasa! Hmm. Una de las librerías que estoy usando es`babdev/pagerfanta-bundle`... y aparentemente requiere PHP 7.2... pero nosotros estamos usando PHP 8. Si miras más allá, hay algunos errores sobre`pagerfanta-bundle[v2.8.0]` que requieren `symfony/config ^3.4 || ^4.4 || ^5.1`, pero no Symfony 6. Entonces, ¿qué está pasando aquí? Resulta que `pagerfanta-bundle[v2.8.0]`no es compatible con Symfony 6. ¡Ja!

Ejecuta

```terminal
composer outdated
```

para ver una lista de paquetes obsoletos. Oooh! `babdev/pagerfanta-bundle` tiene una nueva versión `3.6.1`. Entra en `composer.json` y búscalo... ¡aquí está! Cambia su versión a `^3.6`.

[[[ code('2ac1f8804a') ]]]

Se trata de una actualización de versión mayor. Así que puede contener algunas interrupciones de compatibilidad con versiones anteriores. Lo comprobaremos en un momento. Prueba:

```terminal
composer up
```

de nuevo y... ¡lo hace! ¡Todo se ha actualizado a Symfony 6!

## Arreglando PasswordUpgraderInterface::upgradePassword()

Y luego... para celebrarlo... inmediatamente explotó mientras se limpiaba la caché. Uh oh... Creo que nos hemos perdido una deprecación:

> En `UserRepository`, `upgradePassword([...]): void` debe ser compatible con
> `PasswordUpgraderInterface`.

Si quieres ver esto en color, puedes refrescar la página de inicio para ver lo mismo.

Por cierto, en Symfony 5.4, ahora podemos hacer clic en este icono para copiar la ruta del archivo a nuestro portapapeles. Ahora, si vuelvo a mi editor, pulso "shift" + "shift" y pego, salto directamente al archivo -e incluso a la línea- donde está el problema.

Y... ¡uf! PhpStorm no está contento. Eso es porque el método `upgradePassword()` pasó de requerir un `UserInterface` a requerir un`PasswordAuthenticatedUserInterface`. Así que sólo tenemos que cambiarlo y... ¡listo!

[[[ code('936b7a4e9f') ]]]

De vuelta a nuestro terminal, si ejecutamos

```terminal
php bin/console cache:clear
```

Ahora está contento. Todavía tenemos algunas desaprobaciones aquí abajo de una biblioteca diferente... pero voy a ignorarlas. Vienen de un paquete obsoleto que... Realmente necesito eliminar por completo de este proyecto.

## Actualizando PagerFanta

Vamos a asegurarnos de que la página de inicio funciona. ¿No funciona? Obtenemos

> Se ha intentado cargar la clase `QueryAdapter` del espacio de nombres "`Pagerfanta\Doctrine\ORM`.

Esto no debería ser una sorpresa... ya que actualizamos pagerfanta-bundle de 2.8 a 3.6.

Esta es una situación en la que tienes que encontrar la página de GitHub de la biblioteca y esperar que tengan un documento de actualización. Este sí lo tiene. Si lo lees con atención, descubrirás que un montón de clases que antes formaban parte de Pagerfanta ahora se han dividido en bibliotecas independientes. Así que si queremos utilizar este `QueryAdapter`, tenemos que instalar un paquete independiente. Hazlo con:

```terminal
composer require pagerfanta/doctrine-orm-adapter
```

Genial... y si refrescamos ahora... ¿otro error? Este es aún mejor:

> Función desconocida `pagerfanta`. ¿Te has olvidado de ejecutar
> `composer require pagerfanta/twig` en `question/homepage.html.twig`?.

La integración de Twig también se trasladó a su propio paquete... así que también tenemos que ejecutar ese comando:

```terminal-silent
composer require pagerfanta/twig
```

Y... después de hacerlo... ¡está vivo! ¡Tenemos un proyecto Symfony 6! ¡Woohoo! Si hacemos clic, las cosas parecen funcionar bien. ¡Lo hemos conseguido!

## Comprobación de paquetes desactualizados

En nuestra línea de comandos, ejecuta

```terminal
composer outdated
```

para ver todos los paquetes obsoletos que nos quedan. La lista es ahora muy corta. Un paquete es `knplabs/knp-markdown-bundle`, que está totalmente actualizado... pero ha sido abandonado. Si lo tienes en un proyecto real, refactorízalo para utilizar`twig/markdown-extra`. No me voy a molestar, pero por eso está en esta lista.

Lo más importante aquí es que `doctrine/dbal` tiene una nueva versión mayor, así que ¡eh! Ya que estamos aquí actualizando cosas, ¡actualicémoslo también! Eso a continuación, junto con algunas limpiezas finales.
