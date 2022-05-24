# Actualizaciones y limpiezas finales

Mientras hacemos todas estas actualizaciones importantes, podemos asegurarnos de que todo está actualizado. Cuando ejecutamos

```terminal
composer outdated
```

nos da una lista de todas las cosas que aún tenemos que actualizar. Como he mencionado, vamos a ignorar `knplabs/knp-markdown-bundle`. Pero si lo tienes en un proyecto real, refactorízalo para usar `twig/markdown-extra`.

## Actualización de doctrine/dbal a la v3

Lo que me interesa es `doctrine/dbal`, que tiene una nueva versión mayor a la que podemos actualizar. Pero... esto plantea la pregunta: ¿Por qué no se actualizó automáticamente cuando hicimos `composer up`? Ejecuta

```terminal
composer why-not doctrine/dbal 3
```

para averiguar qué nos impide actualizar a la versión 3 de este paquete. ¡Claro! Lo estamos reteniendo. Dice que nuestro proyecto requiere`doctrine/dbal (^2.13)`. Ups...

Dirígete a `composer.json` y... efectivamente: `^2.13`. Cámbialo por la última `^3.3`. Es el momento de la verdad. Ejecuta

[[[ code('b11850acb9') ]]]

```terminal
composer up
```

Y... ¡guau! ¡Se ha actualizado! Haz

```terminal
composer outdated
```

de nuevo. ¡Muy bien! Aparte de `knp-markdown-bundle`, esto está vacío.

Acabamos de realizar una importante actualización de la versión. Así que la nueva versión contiene interrupciones de compatibilidad con versiones anteriores. Tendrás que mirar el CHANGELOG de la biblioteca un poco más a fondo para asegurarte de que no te afecta. Pero puedo decirte que la mayoría de los cambios se refieren a si utilizas directamente `doctrine/dbal`, por ejemplo para hacer consultas directamente en DBAL. Normalmente, cuando trabajas con el ORM de Doctrine y las entidades -incluso si haces consultas personalizadas- no haces eso. En nuestro sitio... parece que estamos bien.

## Actualizaciones finales de la receta

Ahora que hemos actualizado de Symfony 5.4 a 6.0, es posible que algunas recetas tengan nuevas versiones a las que podamos actualizar. Ejecuta:

```terminal
composer recipes:update
```

¡Uy! Tengo que confirmar mis cambios:

```terminal
git commit -m 'upgrading doctrine/dbal from 2 to 3'
```

¡Perfecto! Ahora ejecuta

```terminal
composer recipes:update
```

y... ¡guay! Hay dos. Empieza con `symfony/routing`. Y... ¡tenemos conflictos! Ejecuta:

```terminal
git status
```

## Carga de atributos de la ruta en movimiento

El problema está en `config/routes.yaml`. Vamos a comprobarlo. Vale, anteriormente comenté esta ruta 

[[[ code('a045dab4ee') ]]]

La actualización de la receta añadió las importaciones `controllers` y `kernel`. Mantengamos sus cambios. En realidad están importando nuestras anotaciones o atributos de ruta desde el directorio `../src/Controller`... y también te permiten añadir rutas y controladores directamente a tu archivo `Kernel.php`.

[[[ code('06b59dcc73') ]]]

Dice `type: annotation`... pero ese importador es capaz de cargar anotaciones o atributos de PHP 8. Una de las cosas buenas de Symfony 6 es que puedes cargar atributos de ruta sin necesidad de ninguna librería externa. Es simplemente... parte del sistema de rutas. Por esa razón, estas importaciones de rutas se añadieron a nuestro archivo principal`config/routes.yaml` cuando instalamos `symfony/routing`.

Sigue adelante y confirma eso. Este cambio tendrá aún más sentido cuando actualicemos la receta final.

Ejecuta

```terminal
composer recipes:update
```

de nuevo y, esta vez, vamos a actualizar la receta `doctrine/annotations`. Es interesante que haya eliminado `config/routes/annotations.yaml`. Si te fijas bien, ¡en realidad contenía las dos líneas que se añadieron con la anterior actualización de la receta!

Esto es lo que pasa. Antes de PHP 8 -cuando sólo teníamos rutas de anotación- la biblioteca`doctrine/annotations` debía importar las anotaciones de las rutas. Así que sólo te dimos estas líneas de importación una vez que instalaste esa biblioteca.

Pero ahora que utilizamos rutas de atributos, ¡eso ya no es cierto! Ya no necesitamos el paquete `doctrine/annotations`. Por eso, ahora te damos inmediatamente estas líneas de importación de rutas de atributos en cuanto instalas el componente de rutas.

Si miramos aquí, nada cambia en nuestro front end. Todas nuestras rutas siguen funcionando.

## Eliminar el código innecesario

Finalmente, ahora que estamos en Symfony 6, podemos eliminar algo de código que sólo era necesario para que las cosas siguieran funcionando en Symfony 5. No hay mucho de esto que yo sepa... lo único que se me ocurre es en `User.php`.

Como he mencionado antes, en Symfony 6, `UserInterface`... Voy a pinchar en eso... cambió el nombre de `getUsername()` a `getUserIdentifier()`. En Symfony 5.4, para eliminar las desapariciones pero mantener el funcionamiento de tu código, necesitamos tener ambos métodos. Pero en cuanto actualices a Symfony 6, ¡ya no necesitas el antiguo! Sólo asegúrate de que no lo llamas directamente desde tu código.

[[[ code('1f9ea6bbee') ]]]

Otro punto aquí abajo... es `getSalt()`. Este es un método antiguo relacionado con el hash de las contraseñas, y ya no es necesario en Symfony 6. Los algoritmos modernos de hash de contraseñas se encargan del salado por sí mismos, así que esto es completamente inútil.

Y... ¡eso es todo equipo! ¡Hemos terminado! ¡Nuestra aplicación Symfony 6 está totalmente actualizada! Hemos actualizado las recetas, actualizado el código a PHP 8, estamos usando atributos de PHP 8 en lugar de anotaciones y mucho más. Eso fue una tonelada de cosas... y acabamos de modernizar nuestra base de código a lo grande.

Creo que esto merece una pizza entera para celebrarlo. Luego vuelve, porque quiero hacer una prueba rápida de algunas nuevas características de las que no hemos hablado. Son las siguientes.
