# Votante personalizado

Para que el sistema de seguridad entienda lo que significa cuando comprobamos el acceso a `EDIT`en un objeto `Question`, necesitamos un votante personalizado. Y... para ayudarnos, podemos generarlo.

Busca tu terminal y ejecuta:

```terminal
symfony console make:voter
```

Llamémoslo `QuestionVoter`. A menudo tengo una clase de votante por objeto en mi sistema del que necesito comprobar el acceso. Y... ¡listo!

## Añadir la lógica del votante

Vamos a comprobarlo: `src/Security/Voter/QuestionVoter.php`:

[[[ code('e1f964e255') ]]]

Como siempre, la ubicación de esta clase no supone ninguna diferencia. Lo importante es que nuestro votante implementa `VoterInterface`. Bueno, no directamente... pero si abres la clase del núcleo que extendemos, puedes ver que implementa `VoterInterface`. La cuestión es: en cuanto creemos una clase que implemente `VoterInterface`, cada vez que se llame al sistema de autorización, Symfony llamará ahora a nuestro método`supports()` y básicamente preguntará:

> ¡Eh! ¿Entiendes cómo se vota en este `$attribute` y en este `$subject`?

Para nosotros, voy a decir si `in_array($attribute, ['EDIT'])`. Así que, básicamente, si el atributo que se pasa es igual a `EDIT`:

[[[ code('9a805ccca2') ]]]

Sólo estoy utilizando una matriz por si más adelante admitimos otros atributos en este votante, como `DELETE`.

De todos modos, si el `$attribute` es `EDIT` y el `$subject` es una instancia de`Question`, entonces sí, sabemos cómo votar esto:

[[[ code('6b1ba43625') ]]]

Si devolvemos `false`, significa que nuestro votante se "abstendrá" de votar. Pero si devolvemos true, entonces Symfony llama a `voteOnAttribute()`:

[[[ code('60903a6f36') ]]]

Muy sencillo, tenemos que tomar el atributo -en nuestro caso `EDIT` - y el`$subject` -en nuestro caso un objeto `Question` - y determinar si el usuario debe o no tener acceso devolviendo `true` o `false`.

Voy a empezar añadiendo algunas cosas que ayudarán a mi editor. En primer lugar, para obtener el objeto `User` actual, utiliza este `$token` y llama a `$token->getUser()`:

[[[ code('a2262c5ed7') ]]]

El único problema es que mi editor no sabe que se trata de una instancia de mi clase específica `User`: sólo sabe que se trata de algún `UserInterface`. Para ayudar, añadiré `@var User $user` por encima de esto:

[[[ code('b4079058a3') ]]]

Incluso mejor, podría añadir una sentencia if para comprobar si `$user` no es una instancia de `User` y lanzar una excepción:

[[[ code('79e190254d') ]]]

De hecho, lo haré aquí abajo. Sabemos que `$subject` será una instancia de nuestra clase`Question`. Para ayudar a nuestro editor a saber eso, digamos que si no `$subject` es un`instanceof` `Question` , entonces lanzamos un nuevo `Exception` y simplemente decimos "se ha pasado un tipo equivocado":

[[[ code('fe27b510c7') ]]]

Eso no debería ocurrir nunca, pero estamos codificando a la defensiva. Y lo que es más importante, mi editor -o herramientas de análisis estático como PHPStan- sabrá ahora de qué tipo es la variable`$subject`.

Por último, aquí abajo, el código generado tiene un caso de conmutación para manejar múltiples atributos. Eliminaré el segundo caso... y haré que el primero sea `EDIT`. Y... ni siquiera necesito el `break` porque voy a devolver true si `$user` es igual a `$subject->getOwner()`:

[[[ code('50467fee64') ]]]

¡Vamos a probarlo! De vuelta al navegador, no estoy conectado. Así que si volvemos... a una página de preguntas... y hacemos clic en "editar"... el acceso sigue estando denegado. Iniciamos la sesión con nuestro usuario normal. Y entonces... el acceso sigue siendo denegado... lo que tiene sentido. Somos un usuario administrador... pero no somos el propietario de esta pregunta.

¡Así que vamos a entrar como el propietario! Vuelve a la página de inicio y haz clic en una pregunta. Para que sea más obvio qué usuario es el propietario, temporalmente, abre`templates/question/show.html.twig` y... aquí abajo, después del nombre de visualización, sólo para ayudar a la depuración, imprime `question.owner.email`:

[[[ code('c0224416be') ]]]

Y... genial. Copia el correo electrónico y ¡utilicemos la suplantación! Al final de la URL, añade `?_switch_user=`, pega ese correo electrónico y... ¡boom! ¡El acceso está garantizado gracias a nuestro votante! Podemos probarlo. Entra en el perfilador y desplázate hacia abajo. Aquí está: acceso concedido para `EDIT` de este objeto `Question`. Me encanta esto.

## Uso del votante en Twig

Ahora que tenemos este genial sistema de votantes, podemos ocultar y mostrar inteligentemente el botón de edición. De vuelta a `show.html.twig`, envuelve la etiqueta de anclaje con if`is_granted()` pasando la cadena `EDIT` y el objeto pregunta:

[[[ code('d2e97bc5a6') ]]]

¿No es genial? Deberíamos seguir teniendo acceso, y... cuando refrescamos, sigue ahí. Pero si salgo de la suplantación... y vuelvo a hacer clic en la pregunta, ¡ha desaparecido!

## Permitir también que los usuarios administradores editen

Pero tengo un reto más. ¿Podríamos hacer que se pueda editar una pregunta si eres el propietario o si tienes `ROLE_ADMIN`. Claro que sí Para ello, en el votante, sólo tenemos que buscar ese rol. Para ello, necesitamos un nuevo servicio.

Añade un constructor y autocablea el servicio `Security` desde el componente Symfony. Voy a pulsar `Alt`+`Enter` y a ir a "Inicializar propiedades" para configurar las cosas:

[[[ code('ec073a9d9a') ]]]

Ya hemos hablado antes de este servicio: lo utilizamos para obtener el objeto Usuario actualmente autenticado desde dentro de un servicio. También se puede utilizar para comprobar la seguridad desde dentro de un servicio.

Incluso antes del caso del interruptor, añadamos: si `$this->security->isGranted('ROLE_ADMIN')`entonces siempre devuelve `true`:

[[[ code('acfc1f7edf') ]]]

Para que los usuarios administradores puedan hacer cualquier cosa. Oh, pero, ¡no quería añadir ese signo de exclamación!

Como estamos conectados como usuarios administradores...., en cuanto refresquemos, tendremos el botón de editar... y funciona. ¡Qué bien!

Lo siguiente: Vamos a añadir un sistema de confirmación por correo electrónico a nuestro formulario de registro.
