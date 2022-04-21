# make:user

Independientemente de cómo se autentifiquen tus usuarios -un formulario de inicio de sesión, una autenticación social o una clave de la API-, tu sistema de seguridad necesita algún concepto de usuario: alguna clase que describa la "cosa" que ha iniciado la sesión.

Sí, el paso 1 de la autenticación es crear una clase `User`. ¡Y hay un comando que puede ayudarnos! Busca tu terminal y ejecuta:

```terminal
symfony console make:user
```

Como recordatorio, `symfony console` es sólo un atajo para `bin/console`... pero como estoy usando la integración de Docker con el servidor web Symfony, llamar a `symfony console`permite al binario `symfony` inyectar algunas variables de entorno que apuntan a la base de datos de Docker. No importará para este comando, pero sí para cualquier comando que hable con la base de datos.

Bien, primera pregunta:

> El nombre de la clase de usuario

Normalmente, será `User`... aunque sería mejor utilizar algo como`HumanoidEntity`. Si la "cosa" que entra en tu sitio se llamaría mejor `Company` o `University` o `Machine`, utiliza ese nombre aquí.

> ¿Quieres almacenar los datos de los usuarios en la base de datos a través de Doctrine? 

Para nosotros: es un sí rotundo... pero no es un requisito. Tus datos de usuario pueden estar almacenados en algún otro servidor... aunque incluso en ese caso, a menudo es conveniente almacenar algunos datos adicionales en tu base de datos local... en cuyo caso también dirías que sí aquí.

Siguiente:

> Introduce un nombre de propiedad que será el nombre de visualización único para el usuario.

Yo voy a utilizar `email`. Esto no es tan importante, y explicaré cómo se utiliza en unos minutos. Por último:

> ¿Necesitará esta aplicación hacer un hash y comprobar las contraseñas de los usuarios?

Sólo tienes que decir que sí si será responsabilidad de tu aplicación comprobar la contraseña del usuario cuando se conecte. Vamos a hacer esto... pero voy a decir que no. Lo añadiremos manualmente un poco más tarde.

Pulsa enter y... ¡listo!

## La clase y la entidad de usuario

Bien. ¿Qué ha hecho esto? En primer lugar, ha creado una entidad `User` y una `UserRepository`... exactamente lo mismo que se obtiene normalmente al ejecutar `make:entity`. Vamos a ver esa nueva clase `User`: `src/Entity/User.php`:

[[[ code('8e6eda8dca') ]]]

En primer lugar, se trata de una entidad normal y aburrida de Doctrine: tiene anotaciones -o quizás atributos de PHP 8 para ti- y un id. Es... sólo una entidad: no tiene nada de especial.

## Interfaz de usuario y métodos obsoletos

Lo único que le importa a Symfony es que tu clase de usuario implemente`UserInterface`. Mantén pulsado `Command` o `Ctrl` y haz clic para saltar al código del núcleo para ver esto.

Esta interfaz realmente sólo tiene 3 métodos: `getUserIdentifier()` el que ves documentado encima de la interfaz, `getRoles()`... y otro más abajo llamado `eraseCredentials()`. Si estás confundido sobre por qué estoy omitiendo todos estos otros métodos, es porque están obsoletos. En Symfony 6, esta interfaz sólo tendrá esos 3: `getUserIdentifier()`, `getRoles()` y`eraseCredentials()`.

En nuestra clase `User`, si te desplazas hacia abajo, el comando `make:user` implementó todo esto por nosotros. Gracias a cómo hemos respondido a una de sus preguntas,`getUserIdentier()` devuelve el correo electrónico:

[[[ code('daffcb5f9b') ]]]

Esto... no es demasiado importante: es sobre todo una representación visual de tu objeto Usuario... se utiliza en la barra de herramientas de depuración de la web... y en algunos sistemas opcionales, como el sistema "recuérdame".

Si estás usando Symfony 5 como yo, te darás cuenta de que los métodos obsoletos se siguen generando. Son necesarios sólo por compatibilidad con versiones anteriores, y puedes eliminarlos una vez que estés en Symfony 6.

El método `getRoles()` se ocupa de los permisos:

[[[ code('8f9902b19e') ]]]

más adelante se hablará de ello. Además, `getPassword()` y `getSalt()` están obsoletos:

[[[ code('e14298d8b1') ]]]

Seguirás necesitando el método `getPassword()` si compruebas las contraseñas en tu sitio, pero ya lo veremos más adelante. Por último, `eraseCredentials()` forma parte de`UserInterface`:

[[[ code('52a0596cad') ]]]

pero no es muy importante y también hablaremos de ello más adelante.

Así que a alto nivel... si ignoras los métodos obsoletos... y el no tan importante`eraseCredentials()`, lo único que debe tener nuestra clase `User` es un identificador y un método que devuelva la matriz de roles que debe tener este usuario. Sí... es sobre todo una entidad de `User`.

## "proveedores": El proveedor de usuarios

El comando `make:user` también hizo un ajuste en nuestro archivo `security.yaml`: puedes verlo aquí:

[[[ code('7186cc18b0') ]]]

Añadió lo que se llama un "proveedor de usuario", que es un objeto que sabe cómo cargar tus objetos de usuario... ya sea que cargues esos datos desde una API o desde una base de datos. Como estamos usando Doctrine, podemos usar el proveedor incorporado `entity`: sabe cómo obtener nuestros usuarios de la base de datos usando la propiedad `email`.

Quería que vieras este cambio... pero el proveedor de usuarios no es importante todavía. Te mostraré exactamente cómo y dónde se utiliza a medida que avancemos.

A continuación: tenemos un control total sobre el aspecto de nuestra clase `User`. ¡El poder! Así que vamos a añadirle un campo personalizado y a cargar nuestra base de datos con un buen conjunto de usuarios ficticios.