# Añadir tipos de propiedades a las entidades

Una nueva característica se coló en Doctrine hace un tiempo, y es súper genial. Ahora Doctrine puede adivinar alguna configuración sobre una propiedad a través de su tipo. Empezaremos con las propiedades de relación. Pero antes, quiero asegurarme de que mi base de datos está sincronizada con mis entidades. Ejecuta:

```terminal
symfony console doctrine:schema:update --dump-sql
```

Y... ¡sí! Mi base de datos sí se parece a mis entidades. Volveremos a ejecutar este comando más tarde, después de hacer un montón de cambios... porque nuestro objetivo no es realmente cambiar nada de la configuración de nuestra base de datos: sólo simplificarla. Ah, y sí, esto ha volcado un montón de depreciaciones... las arreglaremos... eventualmente... ¡Lo prometo!

## Eliminación de targetEntity

Este es el cambio número uno. Esta propiedad `question` contiene un objeto `Question`. Así que vamos a añadir un tipo `Question`. Pero tenemos que tener cuidado. Tiene que ser un `Question` anulable. Aunque sea necesario en la base de datos, después de instanciar el objeto, la propiedad no se rellenará instantáneamente: al menos temporalmente, no se establecerá. Verás que hago esto con todos mis tipos de propiedades de entidad. Si es posible que una propiedad sea `null` -aunque sea por un momento- debemos reflejarlo.

[[[ code('45f929546f') ]]]

También voy a inicializar esto con `= null`. Si eres nuevo en los tipos de propiedad, esto es lo que pasa. Si añades un tipo a una propiedad... y luego intentas acceder a ella antes de que esa propiedad se haya establecido en algún valor, obtendrás un error, como

> No se puede acceder a la propiedad de tipo Answer::$question antes de la inicialización.

Sin un tipo de propiedad, el `= null` no es necesario, pero ahora sí. Gracias a esto, si instanciamos un `Answer` y luego llamamos a `getQuestion()` antes de que se establezca esa propiedad, las cosas no explotarán.

Vale, añadir tipos de propiedades está bien: hace que nuestro código sea más limpio y ajustado. Pero hay otra gran ventaja: ¡ya no necesitamos el `targetEntity`! Ahora Doctrine es capaz de resolverlo por nosotros. Así que borra esto... ¡y celébralo!

[[[ code('8e5a44c12a') ]]]

Entonces... sigue yendo a `Question`. Estoy buscando específicamente campos de relación. Éste es un `OneToMany`, que contiene una colección de `$answers`. Vamos a añadir un tipo aquí... pero en un minuto. Centrémonos primero en las relaciones de `ManyToOne`.

Aquí abajo, en `owner`, añade `?User`, `$owner = null`, y luego deshazte de `targetEntity`.

[[[ code('5b73d33004') ]]]

Y luego en `QuestionTag`, haz lo mismo: `?Question $question = null`... y da la vuelta de la victoria eliminando `targetEntity`.

[[[ code('fdb63095ef') ]]]

Y... aquí abajo... ¡una vez más! `?Tag $tag = null`... y despídete de`targetEntity`.

[[[ code('d0e193d1fc') ]]]

¡Qué bien! Para asegurarnos de que no hemos estropeado nada, vuelve a ejecutar el comando `schema:update` de antes:

```terminal-silent
symfony console doctrine:schema:update --dump-sql
```

Y... ¡todavía estamos bien!

## Añadir tipos a todas las propiedades

Bien, vayamos más allá y añadamos tipos a todas las propiedades. Esto supondrá más trabajo, pero el resultado merece la pena. En el caso de `$id`, será un `int` anulable... y lo inicializaremos a `null`. Gracias a ello, no necesitamos `type: 'integer'`: Doctrine ya puede resolverlo.

[[[ code('b57ef42441') ]]]

Para `$content`, una cadena anulable... con `= null`. Pero en este caso, sí necesitamos mantener `type: 'text'`. Cuando Doctrine ve el tipo `string`, adivina`type:  'string'`... que contiene un máximo de 255 caracteres. Como este campo contiene mucho texto, anula la suposición con `type: 'text'`.

[[[ code('d1d76cdc69') ]]]

## ¿Inicializa el campo de la cadena como nulo o ''?

Por cierto, algunos os preguntaréis por qué no uso `$content = ''`en su lugar. Diablos, ¡entonces podríamos eliminar la nulidad de `?` en el tipo! ¡Es una buena pregunta! La razón es que este campo es obligatorio en la base de datos. Si inicializamos la propiedad a comillas vacías... y tengo un error en mi código por el que me olvidé de establecer la propiedad `$content`, se guardaría con éxito en la base de datos con el contenido establecido en una cadena vacía. Al inicializarlo a `null`, si nos olvidamos de establecer este campo, explotará antes de entrar en la base de datos. Entonces, podemos arreglar ese error... en lugar de que guarde silenciosamente la cadena vacía. Puede que sea furtivo, pero nosotros lo somos más.

Bien, ¡continuemos! Gran parte de esto será un trabajo intenso... así que avancemos lo más rápido posible. Añade el tipo a `username`... y elimina la opción Doctrina `type`. También podemos eliminar `length`... ya que el valor por defecto siempre ha sido `255`. La propiedad `$votes`se ve bien, pero podemos deshacernos de `type: 'integer'`. Y aquí abajo para `$status`, esto ya tiene el tipo, así que elimina `type: 'string'`. Pero tenemos que mantener el `length` si queremos que sea más corto que el 255.

[[[ code('7483772e0c') ]]]

Pasamos a la entidad `Question`. Dale a `$id` el tipo... elimina su opción `type` Doctrina, actualiza `$name`... elimina todas sus opciones.... y repite esto para `$slug`. Observa que `$slug` todavía utiliza una anotación de `@Gedmo\Slug`. Lo arreglaremos en un minuto.

Actualiza `$question`... y luego `$askedAt`. Esto es un `type: 'datetime'`, así que va a contener una instancia de `?\DateTime`. También la inicializaré a null. Ah, y me olvidé de hacerlo, pero ahora podemos eliminar `type: 'datetime'`.

[[[ code('67b6a1213f') ]]]

## Tipificación de las propiedades de la colección

Y ahora volvemos a la relación `OneToMany`. Si miras hacia abajo, esto se inicializa en el constructor a un `ArrayCollection`. Así que podrías pensar que deberíamos usar `ArrayCollection` para el tipo. Pero en su lugar, digamos `Collection`.

Esa es una interfaz de Doctrine que implementa `ArrayCollection`. Tenemos que utilizar `Collection` aquí porque, cuando busquemos un `Question` en la base de datos y obtengamos la propiedad `$answers`, Doctrine la establecerá en un objeto diferente: un `PersistentCollection`. Así que esta propiedad puede ser un `ArrayCollection`, o un `PersistentCollection`... pero en todos los casos, implementará esta interfaz`Collection`. Y esto no necesita ser anulable porque se inicializa dentro del constructor. Haz lo mismo con `$questionTags`.

[[[ code('3431e42217') ]]]

Aunque no lo creas, ¡estamos en la recta final! En `QuestionTag`... haz nuestros cambios habituales en `$id`... y luego baja a `$taggedAt`. Este es un tipo `datetime_immutable`, así que utiliza `\DateTimeImmutable`. Fíjate en que no lo he hecho anulable y no lo estoy inicializando a null. Eso es simplemente porque lo estamos estableciendo en el constructor. Así nos garantizamos que siempre contendrá una instancia de`\DateTimeImmutable`: nunca será nula.

[[[ code('7e6d2f0e16') ]]]

Bien, ahora a `Tag`. Haz nuestro habitual baile de `$id`. Pero espera... en `QuestionTag`, me olvidé de quitar el `type: 'integer'`. No hace nada... simplemente no es necesario. Y... lo mismo para `type: 'datetime_immutable`.

De vuelta en `Tag`, sigamos con la propiedad `$name`... esto es todo normal...

[[[ code('a3b1c6a68a') ]]]

Luego salta a nuestra última clase: `User`. Aceleraré los aburridos cambios en `$id` y `$email`... y `$password`. Eliminemos también el PHP Doc de `@var` que está por encima de éste: ahora es totalmente redundante. Hagamos lo mismo con `$plainPassword`. Diablos, este `@var` ni siquiera estaba bien - ¡debería haber sido `string|null`!

Vamos a hacer un acercamiento a los últimos cambios: `$firstName`, añade `Collection` a`$questions`... y no hace falta `type` para `$isVerified`.

[[[ code('1e4343d0a9') ]]]

Y... ¡hemos terminado! Esto ha sido una faena. Pero en adelante, el uso de tipos de propiedades significará un código más ajustado... y menos configuración de Doctrine.

Pero... veamos si hemos estropeado algo. Ejecuta `doctrine:schema:update` por última vez:

```terminal-silent
symfony console doctrine:schema:update --dump-sql
```

¡Está limpio! Hemos cambiado una tonelada de configuración, pero en realidad no ha cambiado cómo se mapea ninguna de nuestras entidades. Misión cumplida.

## Actualización de la anotación Gedmo\Slug

Ah, y como prometimos, hay una última anotación que tenemos que cambiar: está en la entidad `Question`, encima del campo `$slug`. Proviene de la biblioteca de extensiones de Doctrine. El rector no lo ha actualizado... pero es súper fácil. Siempre que tengas Doctrine Extensions 3.6 o superior, puedes utilizarlo como atributo. Así que`#[Gedmo\Slug()]` con una opción `fields` que tenemos que establecer en un array. Lo bueno de los atributos PHP es que... ¡sólo son código PHP! Así que escribir un array en atributos... es lo mismo que escribir un array en PHP. Dentro, pasa `'name'`... usando comillas simples, como solemos hacer en PHP.

[[[ code('e56a121ed0') ]]]

Bien, equipo: acabamos de dar un gran paso adelante en nuestro código base. A continuación, vamos a centrarnos en las desaprobaciones restantes y a trabajar para aplastarlas. Vamos a empezar con el elefante en la habitación: la conversión al nuevo sistema de seguridad. Pero no te preocupes Es más fácil de lo que crees
