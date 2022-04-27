# Actualización a Symfony 5.4

El primer paso para actualizar nuestra aplicación a Symfony 6 es actualizar todas las librerías de Symfony a la 5.4. Y... eso es bastante fácil: es sólo una cosa del compositor.

## Ajustando la Restricciones de versiones de Composer

En `composer.json`, tenemos bastantes librerías que empiezan por `symfony/`. La mayoría de ellas forman parte del proyecto "principal" de Symfony y siguen el conocido versionado de Symfony, con versiones como 5.0, 5.1, hasta 5.4 y luego 6.0. Esos son los paquetes en los que nos vamos a centrar para actualizarlos.

Pero algunos de ellos, como `symfony/maker-bundle`, siguen su propio esquema de versiones. ¡Qué diva! No vamos a preocuparnos de actualizarlos ahora, pero nos aseguraremos de que, al final, lo hayamos actualizado todo.

Bien, lo que tenemos que hacer es cambiar todos estos `5.0.*` por `5.4.*`. Voy a hacer un "Buscar y reemplazar" para sustituir `5.0.*` por `5.4.*`. Pulsa "Reemplazar todo".

[[[ code('ead5944d18') ]]]

¡Muy bien! Y fíjate que, además de los paquetes en sí, también hemos tenido que cambiar la clave `extra.symfony.require`. Se trata de una optimización del rendimiento de Flex: básicamente se asegura de que Flex sólo tenga en cuenta los paquetes de Symfony que coincidan con esta versión. Sólo tienes que asegurarte de no olvidarte de actualizarla.

Bien... veamos. Esto actualizó un montón de bibliotecas. Para asegurarnos de que no nos hemos perdido nada, busca `symfony/`... y desplázate un poco hacia abajo. El `monolog-bundle` tiene su propio versionado, así que está bien. Pero, ooh... me he perdido una: `symfony/routing`. Por alguna razón, ésta ya estaba en Symfony 5.1. Así que vamos a cambiarlo también a `5.4.*`.

Y... todo lo demás parece estar bien: cada uno se cambia a `5.4.*` o tiene su propia estrategia de versionado... y no vamos a preocuparnos por ello ahora.

## Actualizando las Dependencias

Para actualizarlas realmente, en tu terminal, podríamos intentar actualizar sólo los paquetes de Symfony con:

```terminal
composer up 'symfony/*'
```

Es muy probable que eso falle... porque para actualizar todos los paquetes de Symfony, habrá que actualizar algún otro paquete, como`symfony/proxy-manager-bridge`. Si quisieras, podrías añadir eso al comando`composer up`... o añadir la bandera `-W`, que indica a Composer que actualice todas las bibliotecas de `symfony/` y sus dependencias.

Pero... Yo voy a actualizar todo con:

```terminal
composer up
```

Mira: en nuestro archivo `composer.json`, las restricciones de versión de todos los paquetes (Symfony y otras bibliotecas) son realmente buenas Permiten actualizaciones de versiones menores, como de la 4.0 a la 4.1, pero no permiten actualizaciones de versiones mayores. Así que si hubiera una nueva versión 5 de esta biblioteca, al ejecutar `composer up` no se actualizaría a esa nueva versión mayor.

En otras palabras, la actualización sólo debería actualizar las versiones menores... y éstas, en teoría, no contendrán ninguna ruptura. Así que hagamos esto:

```terminal
composer up
```

Y... ¡hola actualizaciones! ¡Vaya! ¡Mira qué lista tan grande! Muchas cosas de Symfony... pero también muchas otras librerías.

Vale, así que ha sido una gran actualización. ¿Sigue funcionando el sitio? No lo sé Dirígete, actualiza y... ¡funciona! ¡Symfony es increíble!

## Revisando las Depreciaciones

Ahora que estamos en Symfony 5.4, podemos ver la lista completa de rutas de código obsoletas que encontramos al renderizar esta página. Tu número variará... y el número puede incluso cambiar cuando actualices la página... eso se debe a que algunas páginas utilizan la caché. Parece que tengo unas 71 depreciaciones.

Si haces clic en esto, genial. Podemos ver cuáles son todas ellas.

Así que en este punto, nuestro trabajo es sencillo... pero no necesariamente fácil. Tenemos que buscar cada una de estas desaprobaciones, averiguar qué código hay que cambiar, y luego hacer ese cambio. Algunas serán bastante obvias... y otras no.

Así que, antes de intentar buscarlas manualmente, vamos a hacer algo más automático. Somos programadores, ¿verdad? Utilicemos una herramienta llamada Rector para automatizar todos los cambios posibles en nuestro código. Eso es lo siguiente.
