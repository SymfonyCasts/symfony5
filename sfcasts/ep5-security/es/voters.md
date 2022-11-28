# Votantes

Cuando necesitamos denegar el acceso a algo, podemos hacerlo en un par de lugares diferentes, como `access_control` en `security.yaml`:

[[[ code('084d23e027') ]]]

O de varias maneras dentro de un controlador. Y cuando denegamos el acceso, sabemos que podemos hacerlo comprobando un rol como `ROLE_ADMIN` o comprobando una de las cadenas especiales como `IS_AUTHENTICATED_REMEMBERED`. Parece bastante sencillo, ¿verdad? Si utilizamos algo como `ROLE_ADMIN`, está claro que llama a `getRoles()`en el `User` y deniega o permite el acceso.

## Presentación: el sistema de votantes

Así que todo esto es... básicamente cierto. Pero en realidad, cada vez que se llama al sistema de autorización, ya sea a través de `access_control`, `->denyAccessUnlessGranted()`, o incluso de la anotación/atributo`IsGranted()`, ocurre algo más interesante internamente: se activa lo que se llama el sistema de votantes.

Podemos ver esto. Actualiza la página y luego haz clic en el icono de seguridad de la barra de herramientas de depuración de la web para saltar al perfilador. Cerca de la parte inferior de esta página, como vimos antes, encontrarás un "Registro de decisiones de acceso" que muestra todas las veces que se llamó al sistema de autorización durante esta petición. Aparentemente, se llamó un montón de veces. La mayoría de ellas nos representan tratando de averiguar si debemos mostrar u ocultar los enlaces de votación para cada respuesta.

Pero fíjate en este pequeño enlace "Mostrar detalles del votante". Cuando haces clic, hay dos "votantes". El primero ha votado `ACCESS_DENIED` y el segundo ha votado`ACCESS_ABSTAIN`.

Cuando llamas al sistema de autorización, hace un bucle sobre estas cosas llamadas votantes y pregunta a cada uno:

> ¿Sabes cómo decidir si el usuario tiene o no `IS_AUTHENTICATED_REMEMBERED`,
> o `ROLE_ADMIN`... o cualquier cadena que le pasemos.

En la práctica, exactamente uno de estos votantes dirá que sí entiende cómo votar sobre esa cadena, y responderá con `ACCESS_DENIED` o`ACCESS_GRANTED`. Todos los demás votantes devolverán `ACCESS_ABSTAIN`... que sólo significa que no quieren votar de una manera u otra.

Así que, por ejemplo, cada vez que llamas al sistema de autorización y le pasas una de esas cadenas `IS_AUTHENTICATED_`, es este `AuthenticatedVoter` el que sabe cómo decidir si el usuario tiene eso o no.

El `RoleHierarchyVoter`, bueno, probablemente lo puedes adivinar. Es el responsable de votar cualquier cosa que empiece por `ROLE_`. Internamente, ese votador comprueba si el usuario tiene ese rol. Bueno, técnicamente comprueba el "token"... pero eso no es demasiado importante. También tiene en cuenta nuestra configuración de `role_hierarchy`.

Y, por cierto, aunque esto se llame sistema de "votantes", en todos los casos, todos los votantes, excepto uno, se abstendrán, lo que significa que no votan. Nunca tendrás una situación en la que tengas 5 votantes y 3 con acceso a voto concedido y 2 con acceso a voto denegado. Podrías crear votantes que hicieran eso, pero no lo harás.

## Pasar "atributos" personalizados a la autorización

Hasta ahora, denegar el acceso en nuestro sitio ha sido bastante sencillo. Hemos querido comprobar si el usuario está conectado, o hemos comprobado si tiene un rol específico.

Pero la seguridad no siempre es tan sencilla. Para nuestra página de edición de preguntas, no podemos limitarnos a comprobar un rol global. Tenemos que comprobar si el usuario actual es el propietario de esta pregunta. Sí: la lógica de seguridad es específica para algunos datos. En este caso, el objeto `Question`. Poner la lógica en el controlador funcionó, pero significa que vamos a tener que duplicar esta lógica en nuestra plantilla Twig para ocultar o mostrar el enlace "editar pregunta".

La forma de arreglar esto es creando nuestro propio votador personalizado que centralice nuestra lógica. Para ello, elimina todo este código y sustitúyelo por`$this->denyAccessUnlessGranted()`.

Aquí es donde las cosas se ponen interesantes: vamos a "inventar" una nueva cadena para pasársela a esto. Estas cadenas -que hasta ahora habías pensado que eran "roles"- se llaman en realidad atributos. Digamos `EDIT`. Me lo acabo de inventar. Verás cómo se utiliza en un minuto.

Luego, aún no lo hemos visto, pero también puedes pasar un segundo argumento a`denyAccessUnlessGranted()`, que es algún dato relacionado con esta comprobación de seguridad. Pasa el objeto `Question`:

[[[ code('914c3b8d76') ]]]

Vale, para ahora mismo y haz clic en la página de edición. Ooh, obtenemos "acceso denegado". Bueno, nos redirige a la página de acceso... pero eso significa que no tenemos acceso. Haz clic en cualquier enlace de la barra de herramientas de depuración de la web para saltar al perfilador, haz clic en "Últimos 10", y luego busca la petición a la página de edición de la pregunta. Haz clic para ver la información de su perfil... y baja a la sección de Seguridad.

En la parte inferior, bajo el "Registro de decisiones de acceso", el acceso fue denegado para el atributo "EDITAR" y este objeto `Question`. Si miras los detalles de los votantes... ¡oh! Todos se abstuvieron. Así que todos los votantes dijeron:

> No tengo ni idea de cómo votar el atributo "EDITAR" y un objeto `Question`.

Si todos los votantes se abstienen, tenemos el acceso denegado.

Siguiente: vamos a arreglar esto añadiendo nuestro propio votante personalizado que sí sabe cómo votar en esta situación. Una vez que hayamos terminado, haremos que nuestra lógica sea aún más compleja permitiendo también que los usuarios administradores accedan a la página de edición.
