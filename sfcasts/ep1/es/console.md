# La amada herramienta bin/console

Guardemos nuestro progreso hasta ahora. Voy a limpiar la pantalla y ejecutaré:

```terminal
git status
```

Interesante: Hay algunos archivos *nuevos* aquí que yo no creé. No te preocupes: 
Vamos a hablar *precisamente* de eso en el siguiente capítulo. Agrega todo con:

```terminal
git add .
```

*Normalmente*... Este comando puede ser peligroso - accidentalmente podríamos 
agregar algunos archivos que *no* queremos al commit! Afortunadamente, nuestro 
proyecto viene con un archivo `.gitignore` precargado que ignora cosas importantes 
como `vendor/` y otras rutas de las cuales hablaremos más tarde. Por ejemplo, `var/`
contiene el caché y los archivos de logs. El punto es, que Symfony nos cuida la espalda.

Guarda los cambios con:

```terminal
git commit -m "Lo estamos haciendo en grande con esto de Symfony"
```

## Hola comando bin/console 

Puedes interactuar de *dos* maneras diferentes con tu aplicación de Symfony. 
La primera es al cargar una página en tu navegador. La *segunda* es con un útil 
comando llamado `bin/console`. En tu terminal, ejecuta:

```terminal
php bin/console
```

¡Orale! Este comando enlista un *montón* de cosas diversas que puedes hacer con eso,
incluidas *múltiples* herramientas de depuración. Ahora, para desmitificar este asunto 
un poco, existe `literalmente` un directorio `bin/` en nuestra aplicación con un archivo 
llamado `console` adentro. Así que esta cosa `bin/console` no es un comando global que se 
ha instalado en nuestro sistema: estamos, literalmente ejecutando un archivo PHP.

El comando `bin/console` puede hacer *muchas* cosas - y descubriremos mis características favoritas
a lo largo del camino. Por ejemplo, ¿Quieres ver un listado para *cada* ruta en tu aplicación?
Ejecuta:

```terminal
php bin/console debug:router
```

¡Sip! Ahí están nuestras *dos* rutas... además de otra que Symfony agrega automáticamente 
durante el desarrollo.

La herramienta `bin/console` contiene *muchos* comandos útiles como este. Pero la lista 
de comandos que soporta *no* es estática. Nuevos comandos pueden ser agregados 
por *nosotros*... *O* por nuevos paquetes que instalemos en nuestro proyecto. Este es 
mi "no tan sutil" presagio.

A continuación: Hablemos de Symfony Flex, alias con Composer y el sistema de recetas.
Básicamente, las herramientas que hacen a Symfony verdaderamente único.
