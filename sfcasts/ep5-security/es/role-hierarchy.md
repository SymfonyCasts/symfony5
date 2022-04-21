# Jerarquía de roles

Ahora mismo, nuestro sitio tiene dos tipos de usuarios: usuarios normales y usuarios administradores. Si eres un usuario normal, puedes votar en las respuestas y probablemente hacer un montón de cosas más una vez que hayamos terminado. Si eres un administrador, también puedes ir a la sección de administración.

Aquí todavía no hay mucho... pero en teoría, un usuario administrador podría tener acceso a editar preguntas, respuestas o gestionar los datos de los usuarios. Y... muchos sitios son así de sencillos: eres un usuario normal o un usuario administrador.

## Organizar los nombres de los roles

Pero en una empresa más grande, las cosas pueden no ser tan sencillas: puedes tener muchos tipos de usuarios administradores. Algunos tendrán acceso a algunas secciones y otros a otras. La pregunta es: ¿cuál es la mejor manera de organizar nuestros roles para lograr esto?

Bueno, en realidad sólo hay dos posibilidades. La primera es asignar roles a los usuarios que se denominan según el tipo de usuario. Por ejemplo, asignas roles a usuarios como `ROLE_HUMAN_RESOURCES` o `ROLE_IT` o `ROLE_PERSON_WHO_OWNS_THE_COMPANY`. Luego, deniegas el acceso a los controladores utilizando estas cadenas. Pero... Esto no me gusta. Acabas en situaciones extrañas en las que, en un controlador, te das cuenta de que tienes que permitir el acceso a `ROLE_HUMAN_RESOURCES` o `ROLE_IT`, lo cual es un lío.

Bien, ¿cuál es la segunda opción? Proteger los controladores con nombres de rol que describan el acceso que te da ese rol. Por ejemplo, en la parte inferior de este controlador, vamos a crear una supuesta página de administrador para moderar las respuestas. Establece la URL como `/admin/answers`... y llámala `adminAnswers()`:

[[[ code('5f955a2737') ]]]

Imagina que nuestro departamento de "recursos humanos" y el de informática deben tener acceso a esto. Pues bien, como he dicho antes, no quiero intentar poner aquí una lógica que permita `ROLE_HUMAN_RESOURCES` o `ROLE_IT`.

En su lugar, di `$this->denyAccessUnlessGranted()` y pasa esto `ROLE_COMMENT_ADMIN`, un nombre de rol que acabo de inventar que describe lo que se está protegiendo:

[[[ code('03adc888dc') ]]]

¡Oh, tonto Ryan! Debería haber llamado a esto `ROLE_ANSWER_ADMIN` - sigo usando "comentario" cuando quiero decir "respuesta". Esto funcionará bien - pero `ROLE_ANSWER_ADMIN`es realmente el mejor nombre.

De todos modos, lo que me encanta de esto es lo claro que es el controlador: no puedes acceder a esto a menos que tengas un rol específico para este controlador. Sólo hay un problema: si vamos a `/admin/answers`, se nos deniega el acceso... porque no tenemos ese rol.

Probablemente puedes ver el problema de este enfoque. Cada vez que creemos una nueva sección y la protejamos con un nuevo nombre de rol, tendremos que añadir ese rol a cada usuario de la base de datos que deba tener acceso. ¡Eso parece un dolor de cabeza!

## Hola role_hierarchy

Afortunadamente, Symfony tiene una función justo para esto, llamada jerarquía de roles. Abre`config/packages/security.yaml` y, en cualquier lugar dentro de aquí... pero lo pondré cerca de la parte superior, añade `role_hierarchy`. Debajo de esto, di `ROLE_ADMIN` y pon esto en una matriz. Por ahora, sólo incluye `ROLE_COMMENT_ADMIN`:

[[[ code('61503ccb28') ]]]

Esto parece tan simple como lo es. Dice:

> Si tienes `ROLE_ADMIN`, entonces automáticamente también tienes `ROLE_COMMENT_ADMIN`.

¿El resultado? Si refrescamos la página, ¡acceso concedido!

La idea es que, para cada "tipo" de usuario -como el de "recursos humanos", o el de informática-, crees un nuevo elemento en `role_hierarchy` para ellos, como `ROLE_HUMAN_RESOURCES`configurado con una matriz de los roles que deba tener.

Por ejemplo, supongamos que también protegemos otro controlador de administración con `ROLE_USER_ADMIN`:

[[[ code('a924281df2') ]]]

En este caso, si tienes `ROLE_HUMAN_RESOURCES`, entonces obtienes automáticamente`ROLE_USER_ADMIN`... que te da acceso a modificar los datos del usuario. Y si tienes`ROLE_ADMIN`, quizás también puedas acceder a esta sección:

[[[ code('0bcf2d1471') ]]]

Con esta configuración, cada vez que añadamos una nueva sección a nuestro sitio y la protejamos con un nuevo rol, sólo tendremos que ir a `role_hierarchy` y añadirla a los grupos que la necesiten. No necesitamos cambiar los roles en la base de datos para nadie. Y en la base de datos, la mayoría -o todos- los usuarios sólo necesitarán un rol: el que representa el "tipo" de usuario que son, como `ROLE_HUMAN_RESOURCES`.

Hablando de usuarios administradores, cuando estamos depurando un problema de un cliente en nuestro sitio, a veces sería muy útil que pudiéramos entrar temporalmente en la cuenta de ese usuario... sólo para ver lo que está viendo. En Symfony, eso es totalmente posible. Vamos a hablar de la suplantación de identidad a continuación.
