# La configuración del proyecto y el plan

¡Hola amigos! Si eres como yo, probablemente tienes un proyecto Symfony 5 - o 10 - por ahí esperando a ser actualizado a Symfony 6. Bueno... ¡has venido al lugar correcto! ¡Eso es exactamente lo que vamos a hacer en este tutorial! Pero, ¡más que eso! Se trata de una actualización especialmente interesante, porque también implica la actualización de nuestro código para utilizar PHP 8. Y eso incluye una transformación del uso de anotaciones a atributos de PHP 8. Necesito encontrar mi monóculo, porque nos estamos poniendo elegantes. También incluye varias otras características de PHP 8, que realmente te van a gustar. Además, por primera vez, vamos a utilizar una herramienta llamada "Rector" para automatizar todo lo posible. Y... porque no puedo evitarlo, descubriremos nuevas y bonitas características de Symfony 6 por el camino.

## Poner en marcha el proyecto

¡Muy bien! Para empezar esta fiesta de la actualización, deberías codificar conmigo. Descarga el código del curso desde esta página y descomprímelo para encontrar un directorio `start/`con el mismo código que ves aquí. Sigue este archivo `README.md` para ver todos los detalles de la configuración. Ya he seguido la mayor parte de estos pasos... pero todavía tengo que construir mis activos de Webpack Encore e iniciar un servidor web. Así que vamos a hacerlo

En mi terminal (esto ya está dentro del proyecto), ejecuta

```terminal
yarn install
```

o

```terminal
npm install
```

para descargar los paquetes de Node. Quiero que esto se ejecute correctamente porque vamos a actualizar algunas de nuestras herramientas JavaScript un poco más tarde.

Luego ejecuta

```terminal
yarn watch
```

o

```terminal
npm run watch
```

para construir los activos del frontend... y luego observa los cambios.

Para el último paso: abre una nueva pestaña de terminal y pon en marcha un servidor web local. Voy a utilizar el servidor Symfony de forma normal ejecutando:

```terminal
symfony serve -d
```

Y... ¡impresionante! Eso inicia un nuevo servidor web en https://127.0.0.1:8000. Haré clic en él y diré... ¡"Hola" a Cauldron Overflow! ¡Mi viejo amigo! Este es el sitio que hemos estado construyendo a lo largo de nuestra serie Symfony 5. Y si compruebas su archivo `composer.json`... y buscas aquí abajo cosas de Symfony... whoa... es viejo. Todas las librerías principales de Symfony son de la versión "5.0". Eso fue hace años. ¡Era tan joven entonces!

## El plan

Esta es nuestra estrategia de actualización. Primer paso: vamos a actualizar nuestro proyecto a Symfony 5.4. Esto es seguro porque Symfony no incluye ninguna ruptura de compatibilidad hacia atrás en la actualización de versiones menores. Así que cada vez que actualices sólo este número intermedio -llamado número "menor", como 5.0 a 5.4- siempre será seguro.

Segundo paso: una vez que estemos en Symfony 5.4, para preparar nuestro código para Symfony 6, todo lo que tenemos que hacer es buscar y arreglar todas las depreciaciones de nuestro código. Una vez que las hayamos arreglado, será seguro pasar a Symfony 6. Para encontrar esas depreciaciones, vamos a utilizar algunas herramientas, como "Rector" para actualizar partes de nuestro código, el nuevo sistema de actualización de recetas y el probado "informe de depreciaciones" de Symfony.

Después de todo eso, una vez que tengamos un proyecto Symfony 5.4 sin depreciaciones... podemos simplemente "darle al interruptor" y actualizar a Symfony 6. ¡Fácil!

Y al final, cubriremos algunas nuevas características más que podrían gustarte ¿Estás listo? ¡Genial! Vamos a actualizar nuestro sitio a Symfony 5.4 a continuación.
