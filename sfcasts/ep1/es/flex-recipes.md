# Cómo Funcionan las Recetas

¿Dónde viven estas recetas Flex? Viven... en la *nube*. Específicamente, si miras
en https://flex.symfony.com, puedes clickear para ver la
receta de cualquier paquete. Esto va a... interesante: un repositorio GitHub
llamado `symfony/recipes`.

Ve a la página principal de ese repositorio. Este es *el* repositorio central para
recetas, organizado por el nombre de los paquetes... y luego cada paquete puede tener
diferentes recetas para cada versión. Nuestra receta vive en
`sensiolabs/security-checker/4.0`.

## El Código de la Receta

Cada receta tiene *al menos* este archivo `manifest.json`, el cual describe todas las
"cosas" que tiene que hacer. Este `copy-from-recipe` dice que el contenido del
directorio `config/` en la receta debería ser copiado a nuestro proyecto.
*Esta* es la razón por la cual un archivo `config/packages/security_checker.yaml` fue
copiado a nuestra aplicación.

De vuelta en el manifesto, la sección `composer-scripts` le dice a Flex
que agregue esta linea a nuestro archivo `composer.json`... y los aliases definen...
bueno... los aliases que deberían *corresponderse* con este paquete.

Hay algunas cosas *más* que una receta puede hacer, pero esta es la idea básica.

Así que... *todas* las recetas de Symfony viven en *este* repositorio.
Mmm, en realidad, esto no es así: Todas las recetas de symfony viven en este repositorio
*o* en otro llamado `recipes-contrib`. No hay diferencia entre estos, excepto que el
control de calidad es más alto para las recetas del repositorio *principal*.

## Usando Composer Para Ver Recetas

Otra forma de ver los detalles de las recetas es a través del mismo Composer. Corre:

```terminal
composer recipes
```

Estas son las 7 recetas que fueron instaladas en nuestra aplicación. Y si corremos:

```terminal
composer recipes sensiolabs/security-checker
```

Podemos ver más detalles, como la URL de la receta y los archivos que copió a nuestra
aplicación.

El sistema de recetas siempre será nuestro *mejor* amigo: permitiendo que nuestra app
empiece pequeña, pero que crezca *automáticamente* cuando instalamos nuevos paquetes.

## Removiendo un Paquete & Receta

Oh, y si decides que debes *remover* un paquete, su receta será *desinstalada*.
Echa un vistazo:

```terminal
composer remove sec-checker
```

Eso - claro está - removerá el paquete... pero *también* "desconfiguró" la receta.
Cuando corremos:

```terminal
git status
```

Está limpio! Revirtió el cambio en `composer.json` y removió el archivo de
configuración.

[[[ code('eff0f785dc') ]]]

A continuación: Instalemos Twig - el sistema de templates de Symfony - para poder
crear templates HTML. La receta de Twig va a hacer que esto sea *muy* fácil.
