# Actualizaciones de recetas con recipes:update

¡Sigamos actualizando las recetas! Hay un montón de ellas que hacer, pero la mayoría serán fáciles. Nos moveremos rápidamente, pero destacaré los cambios importantes a medida que avancemos.

## actualización de la receta symfony/consola

Para la siguiente actualización, vamos a saltar a `symfony/console` ya que es otra importante.

```terminal-silent
composer recipes:update symfony/console
```

Esto actualiza sólo un archivo: `bin/console`. Comprueba los cambios con:

```terminal
git diff --cached bin/console
```

Hmm. Ha pasado de ser un poco largo a ser... ¡bastante corto! Esto es, una vez más, el componente Symfony Runtime en acción. El código para arrancar Symfony para la consola se ha trasladado a `symfony/runtime`. Y... esto arregló nuestro comando `bin/console`, que estaba roto desde que actualizamos la receta de FrameworkBundle.

Confirmemos este cambio... y sigamos:

```terminal-silent
composer recipes:update
```

## receta symfony/twig-bundle

Baja hasta `symfony/twig-bundle`. Es el número `7`. Voy a limpiar la pantalla y... ¡bien! Tenemos conflictos. ¡Emocionante! Borraré el registro de cambios, ya que lo he mirado. Vale, esto ha borrado un archivo de configuración específico del entorno... y entonces tenemos dos conflictos. Vamos a ver `config/packages/twig.yaml`.

Una vez más, vemos la nueva función de configuración específica del entorno. Estas cosas de`when@test` solían vivir en `config/packages/test/twig.yaml`, pero ahora se han trasladado aquí. Y como tengo una configuración personalizada de `form_themes`, entraba en conflicto. Queremos mantener ambas cosas.

[[[ code('1ab964c841') ]]]

El segundo conflicto está en `templates/base.html.twig`. Nuestro `base.html.twig` está bastante personalizado, así que probablemente no tengamos que preocuparnos por ningún cambio nuevo. La receta añadió un nuevo `favicon` por defecto. Probablemente no lo utilices, ya que tendrás el tuyo propio. Para solucionar este conflicto, ya que mi proyecto no tiene todavía un `favicon`, copiaré lo nuevo, usaré nuestro código, pero pegaré el `favicon`.

[[[ code('10d8e81961') ]]]

Perfecto Ahora podemos confirmar todo.

## actualización de la receta doctrine/doctrine-bundle

¡Sigamos adelante!

```terminal
composer recipes:update
```

Trabajaremos en el resto de arriba a abajo. Lo siguiente es `doctrine/doctrine-bundle`. Esta es una actualización genial. Una vez más, voy a limpiar la pantalla y ejecutar:

```terminal
git status
```

Se ha producido un conflicto dentro del archivo `.env`... que es probablemente el cambio menos interesante. Recientemente, la receta de DoctrineBundle empezó a enviarse con PostgreSQL como base de datos por defecto. Puedes cambiarlo totalmente para que sea lo que quieras, pero PostgreSQL es un motor de base de datos tan bueno que empezamos a enviarlo como sugerencia por defecto.

Pero yo estoy usando MySQL en este proyecto, así que voy a mantenerlo. Pero para ser superguay, al menos tomaré su nueva configuración de ejemplo... que parece un poco diferente... y actualizaré mis comentarios encima con ella. Luego utilizaré mi versión del conflicto. El resultado final son unos cuantos retoques en los comentarios, pero nada más.

[[[ code('d15400b32d') ]]]

Los otros cambios de la receta se refieren a los archivos de configuración, y seguro que puedes ver lo que ocurre. Ha eliminado dos archivos de configuración específicos del entorno y ha actualizado el principal. Hmm.

Abre `config/packages/doctrine.yaml`. Efectivamente, en la parte inferior vemos `when@test`y `when@prod`. ¡Qué bien! Ahora todo está en un solo archivo. Sólo asegúrate de que si tienes alguna configuración personalizada en los antiguos archivos eliminados, la trasladas a este archivo.

[[[ code('b8f9574c69') ]]]

Otro cambio nuevo es este `dbname_suffix` bajo `when@test`. Esto es genial. Cuando ejecutes pruebas, esto reutilizará automáticamente la misma configuración de conexión a la base de datos, pero con un nombre de base de datos diferente: tu nombre normal seguido de `_test`. Y esta parte elegante del final hace que sea muy fácil ejecutar pruebas paralelas con Paratest. Esto garantizará que cada proceso paralelo utilice un nombre de base de datos diferente. Todo esto lo consigues, de forma gratuita, gracias a la receta actualizada.

Hay otro cambio en este archivo, y es importante. En PHPStorm, puedo ver que la actualización de la receta ha eliminado la línea `type: annotation`. Ahora mismo, seguimos utilizando anotaciones en nuestro proyecto para la configuración de las entidades. Vamos a cambiar eso en unos minutos para utilizar los atributos de PHP 8, que va a ser increíble. Pero de todos modos, en la configuración de DoctrineBundle, ya no necesitas esta línea `type: annotation`. Si no la tienes, el formato correcto se detectará automáticamente. Si Doctrine ve anotaciones, cargará anotaciones; si ve atributos de PHP 8, los cargará. Así que la mejor configuración es no tenerla... lo que le dice a Doctrine que descubra las cosas por nosotros.

Una vez más, añade todos estos cambios, haz un commit, y... ¡continuemos! ¡Bueno, sigamos en el próximo capítulo, donde actualizaremos DoctrineExtensionsBundle, algunas recetas de depuración, enrutamiento, seguridad y más!
