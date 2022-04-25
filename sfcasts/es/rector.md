# Automatizar las actualizaciones con Rector

Ahora que estamos en Symfony 5.4, nuestro trabajo es sencillo: buscar y actualizar todo nuestro código obsoleto. Tan pronto como hagamos eso, será seguro actualizar a Symfony 6. Eso es porque la única diferencia entre Symfony 5.4 y 6.0 es que todas las rutas de código obsoleto se eliminan.

Afortunadamente, Symfony es increíble y nos dice -a través de la barra de herramientas de depuración web- exactamente qué código está obsoleto. Pero entender lo que significa todo esto... no siempre es fácil. Así que antes de intentarlo, vamos a automatizar todo lo posible, y lo haremos con una herramienta llamada Rector.

## Instalación de Rector

Dirígete a https://github.com/rectorphp/rector. Se trata de una impresionante herramienta de línea de comandos con un único trabajo: automatizar todo tipo de actualizaciones de tu código, como actualizar tu código de compatible con Symfony 5.0 a compatible con Symfony 5.4. O actualizar tu código para que sea compatible con PHP 8. Es una herramienta poderosa... y si quieres aprender más sobre ella, incluso han publicado un libro en el que puedes profundizar... y también ayudar a apoyar el proyecto.

Muy bien, ¡vamos a instalar esta cosa! Dirígete a tu terminal y ejecuta:

```terminal
composer require rector/rector --dev
```

¡Hermoso! Para que rector funcione, necesita un archivo de configuración. Y podemos arrancar uno ejecutando rector con:

```terminal
./vendor/bin/rector init
```

¡Impresionante! Eso crea el archivo `rector.php`... que podemos ver en la raíz de nuestro proyecto. Dentro de esta función de devolución de llamada, nuestro trabajo consiste en configurar qué tipos de actualizaciones queremos aplicar. Esto se llama "reglas" o a veces "listas de conjuntos" o reglas. Vamos a empezar con un conjunto de actualizaciones de Symfony.

## Configurar Rector para la actualización de Symfony

¡Si echas un vistazo a la documentación, verás un enlace a un [repositorio de Symfony](https://github.com/rectorphp/rector-symfony) donde te habla de un montón de "reglas" de Symfony -palabra elegante para "actualizaciones"- que ya han preparado! ¡Muy amable por su parte!

A continuación, copia el interior de su función callback... y pégalo sobre lo que tenemos. Esto apunta a Rector a un archivo de caché que le ayuda a hacer su trabajo... y lo más importante, le dice a Rector que queremos actualizar nuestro código para que sea compatible con Symfony 5.2, así como actualizar nuestro código a algunas normas de calidad de código de Symfony y de inyección de "constructores". Si quieres saber más sobre lo que hacen, puedes seguir las constantes para ver el código.

Pero, espera, ¡no queremos actualizar nuestro código a Symfony 5.2! Queremos actualizarlo por completo a Symfony 5.4. Podrías esperar que pusiera simplemente "54" aquí. Y podríamos hacerlo. Pero en lugar de eso, voy a utilizar`SymfonyLevelSetList::UP_TO_SYMFONY_54`. Oh... parece que también tengo que añadir una declaración`use` para `SymfonySetList::`. Déjame volver a escribir eso, pulsar "tab" y... ¡genial!

En fin. Tenemos que actualizar nuestro código de la 5.0 a la 5.1... luego de la 5.1 a la 5.2... y así hasta la Symfony 5.4. Eso es lo que significa `UP_TO_SYMFONY_54`: incluirá todas las "reglas" para actualizar nuestro código a la 5.1, 5.2, 5.3 y finalmente a la 5.4.

Y... ¡ya está! Estamos listos para ejecutar esto. Pero antes de hacerlo, tengo curiosidad por saber qué cambios hará esto. Así que vamos a añadir todos los cambios a git... y a confirmarlos. ¡Perfecto!

## Ejecutar Rector

Para ejecutar Rector, digamos `./vendor/bin/rector process src/`. También podríamos dirigirlo a los directorios `config/` o `templates/`... pero la gran mayoría de los cambios que hará se aplican a nuestras clases en `src/`:

```terminal-silent
vendor/bin/rector process src/
```

Y... ¡funciona! ¡Espectacular! El rector ha cambiado ocho archivos. Desplacémonos hasta la parte superior. Esto es genial: te muestra el archivo que se modificó, el cambio real y, debajo, qué reglas causaron ese cambio.

Una de las modificaciones que hizo es `UserPasswordEncoderInterface` a`UserPasswordHasherInterface`. Es un buen cambio: la antigua interfaz queda obsoleta en favor de la nueva. También cambió `UsernameNotFoundException` por`UserNotFoundException`. Otra buena actualización de bajo nivel de un código obsoleto.

También hubo un cambio en una clase en `Kernel`... y algunas otras cosas similares. Cerca del final, la lista de conjuntos de calidad de código Symfony añadió un tipo de retorno `Response` a cada controlador. Eso es opcional... ¡pero bonito!

Así que no hizo una tonelada de cambios, pero arregló algunas desaprobaciones sin que tuviéramos que hacer nada.

Aunque... no es perfecto. Un problema es que, a veces, Rector se mete con tu estilo de codificación. Eso es porque Rector no entiende realmente cuál es tu estilo de codificación... y por eso ni siquiera lo intenta. Pero eso es por diseño y será fácil de arreglar.

En segundo lugar, aunque cambió la interfaz de `UserPasswordEncoderInterface` a`UserPasswordHasherInterface`, inlineó todo el nombre de la clase... en lugar de añadir una declaración `use`.

Y tercero, no cambió ningún nombre de variable. Así que aunque cambió este argumento a `UserPasswordHasherInterface`, el argumento sigue llamándose`$passwordEncoder`... junto con la propiedad. Y lo que es peor, el`UserPasswordHasherInterface` tiene un método diferente... y no actualizó el código aquí abajo para utilizar ese nuevo nombre de método.

Así que Rector es un gran punto de partida para captar un montón de cambios. Pero vamos a tener que coger lo que hemos encontrado y terminar el trabajo. Hagamos eso a continuación. Haremos parte de eso a mano... pero gran parte automáticamente con PHP CS Fixer.
