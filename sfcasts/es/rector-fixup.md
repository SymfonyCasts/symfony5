# Limpiezas y ajustes posteriores a Rector

Rector acaba de automatizar varios cambios en nuestra aplicación que son necesarios para eliminar las desapariciones en Symfony 5.4. Además, ha realizado algunas refactorizaciones adicionales, como añadir el tipo de retorno opcional `Response` en nuestros controladores.

Pero por muy bonito que sea, no es perfecto. Todos los nombres de las clases están inline, en lugar de tener una declaración `use`. Y aunque ha cambiado el nombre de algunas interfaces, no ha cambiado el nombre de los métodos a los que llamamos en esos objetos para reflejar el cambio. Pero no hay que preocuparse. El rector nos ha dado un gran comienzo y nos ha ayudado a poner de relieve varios cambios que debemos hacer. Ahora, vamos a terminar el trabajo.

## Instalación de php-cs-fixer

En primer lugar, para estos largos nombres de clase sin declaración `use` y, en general, para los estilos de codificación, Rector no sabe qué estilo de codificación preferimos, así que ni siquiera intenta formatear las cosas correctamente. La recomendación oficial es utilizar una herramienta en tu proyecto como PHP CS Fixer para reformatear el código después de ejecutar Rector. De todos modos, PHP CS Fixer es una gran herramienta... así que vamos a instalarla para que nos ayude en nuestro camino.

Puedes instalar PHP CS Fixer de varias formas, pero curiosamente, la forma recomendada -y la que a mí me gusta- es instalarlo a través de Composer en su propio directorio. Ejecuta:

```terminal
mkdir -p tools/php-cs-fixer
```

Aquí no hay nada especial: sólo un nuevo directorio `tools/` con `php-cs-fixer/`dentro. Ahora instálalo en ese directorio ejecutando`composer require --working-dir=tools/php-cs-fixer` - eso le dice a Composer que se comporte como si lo estuviera ejecutando desde dentro de `tools/php-cs-fixer` - y luego`friendsofphp/php-cs-fixer`.

Si te preguntas por qué no instalamos esto directamente en nuestras dependencias principales de`composer.json`, bueno... eso es un poco complicado. PHP CS Fixer es una herramienta ejecutable independiente. Si la instalo en las dependencias de nuestra aplicación, podría causar problemas si algunas de sus dependencias no coinciden con las versiones que ya tenemos en nuestra aplicación. En realidad, este es un problema potencial siempre que se instala cualquier biblioteca. Pero como todo lo que necesitamos es un binario independiente... no hay razón para mezclarlo en nuestra app. Podríamos haber hecho lo mismo con Rector.

Esto nos da, en ese directorio, los archivos `composer.json` y `composer.lock`. Y en su directorio `vendor/bin`... sí: `php-cs-fixer`. Ese es el ejecutable.

Y como tenemos un nuevo directorio `vendor/`, abre el archivo raíz `.gitignore` y, al final, ignora esto: `/tools/php-cs-fixer/vendor`. Y ya que estamos aquí, ignoremos también `/.php-cs-fixer.cache`. Ese es un archivo de caché que PHP CS Fixer creará cuando haga su trabajo.

## Añadir php-cs-fixer Config

Lo último que tenemos que hacer es añadir un archivo de configuración. Aquí arriba, crea un nuevo archivo llamado`.php-cs-fixer.php`. Dentro, voy a pegar unas 10 líneas de código. Esto es bastante sencillo. Le dice a PHP CS Fixer dónde encontrar nuestros archivos `src/`... y luego, debajo, qué reglas aplicar. Estoy utilizando un conjunto de reglas bastante estándar de Symfony.

Y... ¡estamos listos para ejecutar esto! Para ver lo que hace, en la línea de comandos, añade todos los cambios a git con:

```terminal
git add .
```

Y luego revísalos:

```terminal-silent
git status
```

Pero no los confirmes todavía. Todavía quiero poder revisar los cambios que ha hecho Rector antes de confirmarlos finalmente. Pero al menos, ahora, podremos ver lo que hace PHP CS Fixer.

Vamos a ejecutarlo:

```terminal
./tools/php-cs-fixer/vendor/bin/php-cs-fixer fix
```

Y... ¡qué bien! Ha modificado 6 archivos. ¡Vamos a verlos!

```terminal
git diff
```

¡Genial! Ha eliminado los nombres de clase largos de `Response` en toda nuestra base de código. También ha eliminado algunas declaraciones antiguas de `use` que no necesitamos. Así que el código de Rector sigue sin ser perfecto, ¡pero ha sido un buen paso para mejorarlo!

## Arreglar el código del lanzador de contraseñas

Para las correcciones finales, las haremos manualmente profundizando en los cambios que hizo Rector, uno por uno. Te ayudaré acercándonos a los lugares que necesitan ser actualizados.

El primero es `RegistrationController`: `src/Controller/RegistrationController.php`. Este es uno de los lugares donde cambió `UserPasswordEncoderInterface` por`UserPasswordHasherInterface`. Fíjate en que PHP CS Fixer arregló muchos de los nombres de clase largos e inline... pero no todos. Depende de si ya había una declaración `use` para esa clase o no.

Así que vamos a arreglar esto a mano. Pasa el ratón por encima de la clase, pulsa "alt" + "enter" y luego ve a "Simplificar FQN". Eso lo acorta y añade la declaración `use` en la parte superior.

Pero hay otro problema. Si rastreamos hasta donde se utiliza esto, antes llamábamos a `->encodePassword()`. Pero... ¡ese método no existe en la nueva interfaz! Tenemos que llamar a `->hashPassword()`.

También voy a cambiar el nombre del argumento. Ve a "Refactorizar" y luego a "Renombrar" y llámalo `$userPasswordHasher`... sólo porque es un nombre más apropiado.

Lo siguiente es `src/Factory/UserFactory.php` para el mismo cambio. Desplázate hacia abajo y... una vez más, tenemos un nombre de clase largo. Pulsa "alt" + "enter" y ve a "Simplificar FQN" para añadir esa declaración `use`. Luego... vamos a "Refactorizar" y "Renombrar" el argumento a `$passwordHasher`... bien... y "Refactorizar", "Renombrar" la propiedad también a `$passwordHasher`.

Por último, a continuación, tenemos que llamar a `->hashPassword()` en lugar de a `->encodePassword()`.

Ya está

Sólo hay un punto más en el que necesitamos este mismo cambio:`src/Security/LoginFormAuthenticator.php`. Más adelante refactorizaremos esta clase para utilizar el nuevo sistema de seguridad... pero al menos hagamos que funcione. Busca el argumento`UserPasswordHasherInterface`, acórtalo con "Simplificar FQN"... luego renombra el argumento a `$passwordHasher`... y renombra la propiedad a`$passwordHasher`.

Luego comprobamos dónde se utiliza esto... Buscaré "hasher"... ¡allí vamos! En la línea 84, el `->isPasswordValid()` existe realmente en la nueva interfaz, así que éste es un caso en el que no necesitamos cambiar nada más.

Ah, pero ya que estamos aquí, el `UserNotFoundException` es otro nombre de clase largo. Vuelve a pulsar "Simplificar FQN".

Muy bien Eso debería ser todo.

La gran pregunta ahora es: ¿funciona nuestra aplicación? Si volvemos a la página de inicio... no lo hace. ¿Volvemos a la página de Bienvenida a Symfony? Eso es raro...

Vuelve a tu terminal y ejecuta:

```terminal
php bin/console debug:router
```

Vaya. De hecho, todas nuestras rutas han desaparecido. Esto se debe a otro cambio que hizo Rector y al que debemos prestar mucha atención. Está dentro de nuestra clase `Kernel`. Vamos a hablar más sobre esta clase más adelante, cuando actualicemos nuestras recetas. Rector cambió el argumento a `RoutingConfigurator`, pero no actualizó el código de abajo. Así que, de nuevo, Rector es muy bueno para encontrar algunos de estos cambios, pero siempre debes comprobar dos veces el resultado final.

Afortunadamente, todo el método `configureRoutes()` se ha trasladado a este`MicroKernelTrait` - hecho del que hablaré más adelante. Así que ya no necesitamos este método en nuestra clase. En cuanto lo eliminamos, se utiliza la versión correcta del trait... nuestras rutas vuelven a .... y la página funciona! Woohoo!

Y espero que tengamos unas cuantas desapariciones menos que antes. Ahora veo 58. ¡Progreso!

¿Y qué es lo siguiente? Hemos actualizado nuestras dependencias y automatizado algunos de los cambios que necesitamos con Rector. Bueno, todavía hay una cosa más que podemos hacer antes de empezar a repasar cada deprecación manualmente: actualizar nuestras recetas. Y esto se ha vuelto mucho más fácil que la última vez que se actualizó. Veamos cómo a continuación.
