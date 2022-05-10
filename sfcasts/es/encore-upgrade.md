# Actualizar Encore y sus activos/configuración

¡Sólo quedan dos recetas por actualizar! La siguiente es `webpack-encore-bundle`. Esta receta ha cambiado bastante a lo largo del último año y medio, así que dependiendo de lo antigua que sea tu versión, esto podría ser fácil.... o quizás no tan fácil. Digamos que puede ser "interesante".

Para ver con qué estamos trabajando, ejecuta:

```terminal
git status
```

Vale: tenemos una serie de archivos modificados y eliminados y algunos conflictos. Vamos a revisarlos primero, empezando por `assets/app.js`. Como puedes ver, he habilitado una funcionalidad personalizada de `Collapse` desde bootstrap. No estoy seguro de por qué esto entraba en conflicto, pero es una solución fácil.

[[[ code('25832477e1') ]]]

Lo siguiente es `bootstrap.js`. Este puede ser un archivo nuevo para ti, dependiendo de la antigüedad de tu receta. La función de este archivo es inicializar la biblioteca JavaScript de Stimulus y cargar todos los archivos del directorio `controllers/` como controladores de Stimulus. En este caso, ya tenía este archivo, pero aparentemente la expresión de cómo encuentra los archivos cambió ligeramente. La nueva versión es probablemente mejor, así que vamos a utilizarla.

[[[ code('ebce24514b') ]]]

El siguiente es `controllers.json`. Tampoco estoy seguro de por qué está en conflicto... Tengo la sensación de que puede que haya añadido estos archivos manualmente en el pasado... y ahora la actualización de la receta los está volviendo a añadir. Quiero mantener mi versión personalizada.

[[[ code('bd3b4aed39') ]]]

Lo siguiente es `styles/app.css`. Aquí ocurrió lo mismo. La receta añadió este archivo... hasta el fondo... con sólo un color de fondo del cuerpo. Debo haber añadido este archivo manualmente... ¡tan conflictivo! Mantén todas nuestras cosas personalizadas y... ¡bien!

[[[ code('00d6621040') ]]]

## Hola @hotwired/Stimulus v3

El último conflicto está aquí abajo en `package.json`. Este es un poco más interesante. Mi proyecto ya utilizaba Stimulus: tengo `stimulus` aquí abajo y también `stimulus-bridge` de Symfony . La receta actualizada tiene ahora `@hotwired/stimulus`, y en lugar de `"@symfony/stimulus-bridge": "^2.0.0"`, tiene`"@symfony/stimulus-bridge": "^3.0.0"`.

Entonces, ¿qué ocurre? En primer lugar, se ha lanzado la versión 3 de Stimulus. ¡Sí! Pero... la única diferencia real entre la versión 2 y la 3 es que cambiaron el nombre de la biblioteca de`stimulus` a `@hotwired/stimulus`. Y para que la versión 3 funcione, también necesitamos la versión 3 de `stimulus-bridge`... en lugar de la 2.

Así que tomemos esto como una oportunidad de oro para actualizar de Stimulus 2 a Stimulus 3. Como ventaja, después de actualizar, obtendrás nuevos y geniales mensajes de depuración en la consola de tu navegador cuando trabajes con Stimulus localmente.

De todos modos, mantén `@hotwired/stimulus`... pero muévelo hacia arriba para que esté en orden alfabético. Utiliza la versión 3 de `stimulus-bridge`... y aunque realmente no importa, ya que esta restricción de versión permite cualquier versión `1`, también utilizaré la nueva versión`webpack-encore`... y luego arreglaré el conflicto. Ah, y asegúrate de eliminar `stimulus`. No queremos que la versión 2 de `stimulus` ande por ahí confundiendo las cosas.

[[[ code('5eefb686c5') ]]]

¡Fantástico! Como acabamos de cambiar algunos archivos en `package.json`, busca la pestaña de tu terminal que está rockeando a Encore, pulsa "ctrl" + "C", y luego ejecuta:

```terminal
yarn install
```

o

```terminal
npm install
```

¡Perfecto! Ahora reinicia Encore:

```terminal
yarn watch
```

Y... ¡falla!? Es un mensaje de error muy largo... pero al final dice

&gt `assets/controllers/answer-vote_controller.js contains a reference to the
> file "stimulus"`.

La parte más importante, aunque aburrida, de la actualización de Estímulo 2 a 3 es que tienes que entrar en todos tus controladores y cambiar`import { Controller } from 'stimulus'` a`import { Controller } from '@hotwired/stimulus'`.

[[[ code('fd1a46cd51') ]]]

Pero es así de sencillo. También voy a eliminar `hello_controller.js`... esto es sólo un controlador de ejemplo que nos dio la receta. En el último controlador, cambia a `@hotwired/stimulus`.

[[[ code('eaf18a032d') ]]]

¡Impresionante! Vuelve a parar `yarn watch`.. y vuelve a ejecutarlo:

```terminal-silent
yarn watch
```

¡Diablos! ¡Seguimos obteniendo un error! Esto viene de`@symfony/ux-chartjs/dist/controller.js`.

## Actualización de las bibliotecas UX

En mi proyecto, he instalado uno de los paquetes UX de Symfony, que son paquetes de PHP que también proporcionan algo de JavaScript. Aparentemente, el JavaScript de ese paquete sigue haciendo referencia a `stimulus` en lugar de al nuevo `@hotwired/stimulus`. Lo que esto me dice es que probablemente tengo que actualizar ese paquete PHP. Así que, en`composer.json`, aquí abajo en `symfony/ux-chartjs`, si investigas un poco, descubrirás que hay una nueva versión 2 que soporta el Estímulo 3.

[[[ code('f77dece130') ]]]

Después de cambiar eso, busca la pestaña principal de tu terminal y ejecuta

```terminal
composer up symfony/ux-chartjs
```

para actualizar ese paquete. Y... ¡qué bien! Hemos actualizado a la versión 2.1.0. Ahora quiere que ejecutemos

```terminal
npm install --force
```

o

```terminal
yarn install --force
```

Esto reinicia el JavaScript del paquete. Una cosa que quiero destacar de este paquete en particular es que cuando actualizamos a la versión 2 en nuestro archivo`composer.json`, Flex actualizó nuestra dependencia de `chart.js` de la versión 2.9 a la 3.4. Esto se debe a que el JavaScript de esta nueva versión está pensado para funcionar con`chart.js` 3 en lugar de `chart.js` 2. Flex hizo ese cambio por nosotros. No tenemos que hacer nada aquí, pero es bueno tenerlo en cuenta.

¡Por fin! Deberíamos estar listos para empezar. Ejecuta

```terminal
yarn watch
```

y... ¡ya está! ¡Construcción exitosa! En la pestaña principal del terminal, vamos a añadir todo... ya que hemos arreglado todos los conflictos... ¡y a confirmar!

## Actualización de la receta de Foundry

Ahora, queridos amigos, estamos en la última actualización. Se trata de `zenstruck/foundry`. Ésta es fácil. Ejecuta:

```terminal
git status
```

Es, una vez más, la configuración del entorno que va a un archivo principal. Así que vamos a confirmarlo 

[[[ code('80c6b85687') ]]]

Y... ¡hemos terminado! ¡Todas nuestras recetas están actualizadas! Y recuerda que parte de la razón por la que hemos hecho todo esto es porque algunas de esas recetas han sustituido el viejo código obsoleto por el nuevo código brillante. Con suerte, cuando actualicemos la página, nuestro sitio no sólo seguirá funcionando, sino que tendrá menos depreciaciones. En mi proyecto, si refresco unas cuantas veces, parece que me estoy asentando en unas 22. ¡Progreso!

Tenemos que aplastar esas depreciaciones. Pero a continuación, otra cosa que tenemos que hacer es... ¡actualizar nuestro código a PHP 8! ¡Este es otro punto en el que Rector puede ayudar!
