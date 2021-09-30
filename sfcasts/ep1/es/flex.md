# Flex, Recetas & Aliases

Vamos a instalar un paquete *totalmente* nuevo dentro de nuestra aplicación llamado
"security checker". El verificador de seguridad es una herramienta que revisa las dependencias de tu aplicación
y te dice si alguna de estas tiene vulnerabilidades de seguridad conocidas. Pero, confidencialmente, tan *genial* 
como lo es..., la razón *real* por la que quiero instalar esta librería es porque es una *gran* manera de ver el
importantísimo sistema de "recetas" de Symfony.

En tu terminal, ejecuta:

```terminal
composer require sec-checker
```

En una aplicación real, probablemente *deberías* pasar `--dev` y agregar esto a tu 
dependencia *dev*... pero eso no nos preocupa a nosotros.

## Flex Aliases

No obstante, *hay* algo extraño aquí. Específicamente... `sec-checker` *no* es un 
nombre de paquete válido! En el mundo de Composer, *cada* paquete *debe* 
ser `algo/algo-más`: no puede ser solamente `sec-checker`. 
Entonces que diantres está pasando?   

De devuelta en PhpStorm, abre `composer.json`. Cuando iniciamos el proyecto, 
solamente teníamos unas *pocas* dependencias en este archivo. Una de ellas 
es `symfony/flex`.

[[[ code('4bf6b1df52') ]]]

Este es un *plugin* de composer que agrega *dos* características especiales al 
mismo Composer. El primero se llama "aliases".

En tu navegador, ve a http://flex.symfony.com para encontrar una larga página llena 
de paquetes. Busca por `security`. Mejor, busca por `sec-checker`. Bingo! La misma 
dice que hay un paquete llamado `sensiolabs/security-checker` y tiene los 
aliases de `sec-check`, `sec-checker`, `security-checker` y algunos más. 

El sistema de alias es simple: pues Symfony Flex se encuentra en nuestra 
aplicación, podemos decir `composer require security-checker`, y *realmente* 
descargará `sensiolabs/security-checker`. 

Puedes ver esto en nuestra termina: dijimos `sec-checker`, pero al final 
descargó `sensiolabs/security-checker`. Eso es algo que también Composer agregó 
a nuestro archivo `composer.json` Entonces... las aliases son una agradable 
característica de atajo... pero es realmente genial! Casi que puedes *adivinar* un 
alias cuando quieras instalar algo. Necesitas una bitácora? 
Ejecuta `composer require logger` para conseguir la bitácora recomendada.
Necesitas enviar algo por correo electrónico? `composer require mailer` 
Necesitas comer un pastel? `composer require cake`!

## Recetas de Flex

La *segunda* característica que Flex agrega a Composer es la más *importante*.
Es el sistema de recetas

En la terminal, después de instalar el paquete, nos menciona:

> Symfony operations: 1 recipe
> configuring sensiolabs/security-checker.

Interesante. Ejecuta:

```terminal
git status
```

Wow! Esperábamos que `composer.json` y `composer.lock` fueran modificados...
así es como Composer trabaja. Pero algo *también* modificó al archivo 
`symfony.lock`... y agregó un archivo totalmente nuevo `security_checker.yaml`!

Muy bien, primero `symfony.lock` es un archivo que es manejado por Flex. 
Tú no necesitas preocuparte por el, pero *deberías* asignarlo. Mantiene una 
gran lista de cuáles recetas se han instalado.

Entonces, ¿Quién creó el otro archivo? Ábrelo con `config/packages/security_checker.yaml`.

[[[ code('ae0e8f67cb') ]]]

Cada paquete que instales *puede* tener una receta de Flex. La idea es *maravillosamente* 
simple. En lugar de decirle a la gente que instale un paquete y *después* crear 
este archivo, y actualizar este otro para hacer que las cosas funcionen, Flex 
ejecuta una *receta* la cual... lo hace por ti! Este archivo ha sido agregado a la 
receta `sensiolabs/security-checker`!

No necesitas preocuparte por las especificaciones de que está *dentro* de este archivo 
por el momento. El punto es, *gracias* a este archivo, tenemos un nuevo comando `bin/console`.
Ejecuta:

```terminal
php bin/console
```

Ves ese comando `security:check`? No estaba hace un segundo. Está ahí *ahora*
gracias al nuevo archivo YAML. Intenta:

```terminal
php bin/console security:check
```

Ningún paquete tiene vulnerabilidades conocidas! Genial!

## Como funcionan las recetas

Aquí está el panorama en *general*: gracias al sistema de receta, siempre que instales un 
paquete, Flex realizará una comprobación si el paquete tiene una receta y, si lo tiene, lo
instalará. Una receta puede hacer muchas cosas, como agregar archivos, crear directorios, o
incluso *modificar* archivos nuevos, como agregar líneas a tu 
archivo `.gitignore`

El sistema de recetas *cambia las reglas del juego*. Me *encanta*, ya que cada vez que 
necesito una nueva librería, todo lo que tengo que hacer es instalarla. No necesito agregar 
archivos de configuración o modificar algo, pues la receta automatiza todo ese trabajo 
aburrido.

## Las Recetas pueden Modificar Archivos

De hecho, esta receta hizo algo *más* que no nos dimos cuenta. En la terminal, ejecuta:

```terminal
git diff composer.json
```

Esperábamos que Composer agregara esta nueva línea a la sección `require`. Pero *también* 
hay una nueva línea bajo la sección de `scripts`. Lo cual fue hecho por la receta.

[[[ code('28230b4aec') ]]]

Gracias a esto, cada vez ejecutes:

```terminal
composer install
```

Después de terminar, automáticamente el comando security checker.

El punto es: para usar el comando security checker, lo *único* que teníamos que hacer era...
instalarlo. Su receta se hizo cargo del resto de la configuración.

Ahora... si te estás preguntando:

> Oye! Dónde rayos vive esta receta? Puedo verla?

Esa es una *gran* pregunta! Vamos a averiguar donde viven las recetas y como se ven a continuación.
