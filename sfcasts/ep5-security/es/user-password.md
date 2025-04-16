# Dar contraseñas a los usuarios

A Symfony realmente no le importa si los usuarios de tu sistema tienen contraseñas o no. Si estás construyendo un sistema de inicio de sesión que lee las claves API de una cabecera, entonces no hay contraseñas. Lo mismo ocurre si tienes algún tipo de sistema SSO. Tus usuarios pueden tener contraseñas... pero las introducen en algún otro sitio.

Pero para nosotros, sí queremos que cada usuario tenga una contraseña. Cuando antes utilizamos el comando `make:user`, nos preguntó si queríamos que nuestros usuarios tuvieran contraseña. Respondimos que no... para poder hacer todo esto manualmente. Pero en un proyecto real, yo respondería "sí" para ahorrar tiempo.

## PasswordAuthenticatedUserInterface

Sabemos que todas las clases de Usuario deben implementar `UserInterface`:

[[[ code('a901b7fc72') ]]]

Entonces, si necesitas comprobar las contraseñas de los usuarios en tu aplicación, también tienes que implementar una segunda interfaz llamada `PasswordAuthenticatedUserInterface`:

[[[ code('e820720fba') ]]]

Esto requiere que tengas un nuevo método: `getPassword()`.

Si estás utilizando Symfony 6, aún no tendrás esto, así que añádelo:

[[[ code('8000636fbc') ]]]

Yo lo tengo porque uso Symfony 5 y el método `getPassword()` es necesario por compatibilidad con versiones anteriores: antes formaba parte de `UserInterface`.

Ahora que nuestros usuarios tendrán una contraseña, y que estamos implementando`PasswordAuthenticatedUserInterface`, voy a eliminar este comentario encima del método:

[[[ code('98fb443723') ]]]

## Almacenar una contraseña hash para cada usuario

Vale, olvidémonos de la seguridad por un momento. En su lugar, centrémonos en el hecho de que necesitamos poder almacenar una contraseña única para cada usuario en la base de datos. ¡Esto significa que nuestra entidad de usuario necesita un nuevo campo! Busca tu terminal y ejecuta:

```terminal
symfony console make:entity
```

Actualicemos la entidad `User`, para añadir un nuevo campo llámalo `password`... que es una cadena, 255 de longitud es exagerado pero está bien... y luego di "no" a anulable. Pulsa intro para terminar.

De vuelta en la clase `User`, es... en su mayor parte no sorprendente. Tenemos una nueva propiedad `$password`... y al final, un nuevo método `setPassword()`:

[[[ code('924e58807e') ]]]

Fíjate que no ha generado un método `getPassword()`... porque ya teníamos uno. Pero tenemos que actualizarlo para que devuelva `$this->password`:

[[[ code('a7cf7f951e') ]]]

Algo muy importante sobre esta propiedad `$password`: no va a almacenar la contraseña en texto plano. ¡Nunca jamás almacenes la contraseña en texto plano! Es la forma más rápida de tener una brecha de seguridad... y perder amigos.

En su lugar, vamos a almacenar una versión cifrada de la contraseña... y dentro de un minuto veremos cómo generar esa contraseña cifrada. Pero antes, hagamos la migración para la nueva propiedad:

```terminal
symfony console make:migration
```

Echa un vistazo a ese archivo para asegurarte de que todo se ve bien:

[[[ code('772e4bbbf3') ]]]

***TIP
Si utilizas PostgreSQL, deberás modificar tu migración. Añade `DEFAULT ''` al final para que la nueva columna pueda añadirse sin error```terminal
$this->addSql('ALTER TABLE user ADD password VARCHAR(255) NOT NULL DEFAULT \'\'');
```
***

Y... ¡lo hace! Ciérralo... y ejecútalo:

```terminal
symfony console doctrine:migrations:migrate
```

## El password_hashers Config

¡Perfecto! Ahora que nuestros usuarios tienen una nueva columna de contraseña en la base de datos, vamos a rellenarla en nuestras fijaciones. Abre `src/Factory/UserFactory.php` y busca `getDefaults()`.

De nuevo, lo que no vamos a hacer es poner en `password` la contraseña en texto plano. No, esa propiedad `password` tiene que almacenar la versión hash de la contraseña.

Abre `config/packages/security.yaml`. Esto tiene un poco de configuración en la parte superior llamada `password_hashers`, que le dice a Symfony qué algoritmo hash debe utilizar para el hash de las contraseñas de usuario:

[[[ code('e96fca06bd') ]]]

Esta configuración dice que cualquier clase `User` que implemente`PasswordAuthenticatedUserInterface` - lo que nuestra clase, por supuesto, hace - utilizará el algoritmo `auto` donde Symfony elige el último y mejor algoritmo automáticamente.

## El servicio Password Hasher

Gracias a esta configuración, tenemos acceso a un servicio "hasher" que es capaz de convertir una contraseña de texto plano en una versión hash utilizando este algoritmo `auto`. De vuelta a`UserFactory`, podemos utilizarlo para establecer la propiedad `password`:

[[[ code('3a51c825fc') ]]]

En el constructor, añade un nuevo argumento: `UserPasswordHasherInterface $passwordHasher`. Pulsaré `Alt`+`Enter` e iré a "Inicializar propiedades" para crear esa propiedad y establecerla:

[[[ code('bdebb42f7a') ]]]

A continuación, podemos establecer `password` en `$this->passwordHasher->hashPassword()` y luego pasarle alguna cadena de texto sin formato.

Bueno... para ser sincero... aunque espero que esto tenga sentido a alto nivel... esto no funcionará del todo porque el primer argumento de `hashPassword()` es el objeto `User`... que aún no tenemos dentro de `getDefaults()`.

No pasa nada, porque de todas formas me gusta crear una propiedad `plainPassword` en `User` para facilitar todo esto. Añadámoslo a continuación, terminemos las fijaciones y actualicemos nuestro autenticador para validar la contraseña. Ah, pero no te preocupes: esa nueva propiedad`plainPassword` no se almacenará en la base de datos.
