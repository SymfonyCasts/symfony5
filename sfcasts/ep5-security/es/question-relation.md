# Hacer preguntas propiedad de los usuarios

Nuestro sitio tiene usuarios y estas preguntas son creadas por esos usuarios. Por lo tanto, en la base de datos, cada `Question` debe estar relacionado con el `User` que lo creó mediante una relación Doctrine. Ahora mismo, si abres `src/Entity/Question.php`, ese no es el caso. No hay nada que lo relacione con el `User` que lo creó. Es hora de arreglar eso. Lo necesitaremos para poder hablar correctamente de los votantes

## Generar la relación

Busca tu terminal y ejecuta:

```terminal
symfony console make:entity
```

Vamos a modificar la entidad `Question` y añadir una nueva propiedad llamada `owner`, que será el "usuario" que posee este `Question`. Necesitamos una relación ManyToOne. Si alguna vez no estás seguro, escribe "relación" y te guiará a través de un asistente para ayudarte. Será una relación con la clase `User`... y la propiedad `owner` no será anulable: cada pregunta debe ser propiedad de algún usuario.

A continuación nos pregunta si queremos mapear el otro lado de la relación para que podamos decir `$user->getQuestions()`. Eso puede ser útil, así que digamos que sí. Y llamaremos a esa propiedad `questions`. Por último, voy a decir que no a la eliminación de huérfanos. Y... ¡listo!

Si has pasado por nuestro tutorial sobre las relaciones de Doctrine, sabrás que aquí no hay nada especial. Esto añadió una relación `ManyToOne` sobre una nueva propiedad `$owner`... e hizo métodos getter y setter en la parte inferior:

[[[ code('8b4029a4c4') ]]]

En la clase `User`, también mapeó el lado inverso de la relación:

[[[ code('adf96c33e7') ]]]

Vamos a hacer una migración para este cambio:

```terminal
symfony console make:migration
```

Y... como de costumbre, iremos al nuevo archivo de migración... para asegurarnos de que contiene sólo lo que esperamos. Sí: `ALTER TABLE question`, añade `owner_id`y luego las cosas de la clave foránea:

[[[ code('d8e644dca1') ]]]

## Arreglar la migración

Vamos a ejecutarlo:

```terminal
symfony console doctrine:migrations:migrate
```

Y... ¡falló! No pasa nada. Falla porque ya hay filas en la tabla `question`. Así que añadir un nuevo `owner_id` `NOT NULL` hace que esos registros existentes... exploten. En el tutorial de relaciones de Doctrine, hablamos de cómo manejar, arreglar y probar responsablemente las migraciones fallidas. Como ya hablamos de ello allí, voy a tomar el camino más fácil aquí y simplemente eliminar nuestra base de datos:

```terminal
symfony console doctrine:database:drop --force
```

Luego crearé una base de datos nueva:

```terminal
symfony console doctrine:database:create
```

Y migrar de nuevo.

```terminal-silent
symfony console doctrine:migrations:migrate
```

Ahora ya funciona. Recarga las instalaciones:

```terminal
symfony console doctrine:fixtures:load
```

## Asignación de propietarios en las instalaciones

Y... ¡eso también explotó! ¡Vamos! La inserción en la pregunta está fallando porque`owner_id` no puede ser nula. Eso tiene sentido: aún no hemos entrado en nuestras instalaciones y no hemos asignado un propietario a cada pregunta.

Hagámoslo. Abre `src/Factory/QuestionFactory.php`. Nuestro trabajo en `getDefaults()`, es proporcionar un valor por defecto para cada propiedad requerida. Así que ahora voy a añadir una clave `owner` establecida en `UserFactory::new()`:

[[[ code('4685cbb39a') ]]]

Gracias a esto, si ejecutamos `QuestionFactory` sin anular ninguna variable, se creará un nuevo usuario para cada nueva pregunta.

Pero dentro de nuestros accesorios, eso... no es exactamente lo que queremos. Dirígete a la parte inferior, donde creamos los usuarios. Lo que quiero hacer es crear primero estos usuarios. Y luego, cuando creemos las preguntas aquí arriba... oh, en realidad aquí mismo, quiero usar un usuario aleatorio de los que ya hemos creado.

Para ello, primero tenemos que mover nuestros usuarios a la parte superior para que se creen primero:

[[[ code('d1a4effae6') ]]]

Luego, aquí abajo para nuestras preguntas principales, pasar una función al segundo argumento y devolver un array... para que podamos anular la propiedad `owner`. Ponlo en`UserFactory::random()`:

[[[ code('05bd527622') ]]]

No me voy a preocupar de hacer esto también para las preguntas no publicadas aquí abajo... pero podríamos.

Bien: probemos de nuevo los accesorios:

```terminal
symfony console doctrine:fixtures:load
```

Esta vez... ¡funcionan!

¡Genial! Así que vamos a aprovechar la nueva relación en nuestro sitio para imprimir el propietario real de cada pregunta. También vamos a iniciar una página de edición de preguntas y luego... tendremos que averiguar cómo hacer que sólo el propietario de cada pregunta pueda acceder a ella.
