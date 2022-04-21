# Hacer un hash de las contraseñas en texto plano y de las contraseñas-credenciales

El proceso de guardar la contraseña de un usuario siempre es el siguiente: empieza con una contraseña en texto plano, haz un hash de la misma, y luego guarda la versión hash en el `User`. Esto es algo que vamos a hacer en los accesorios... pero también lo haremos en un formulario de registro más adelante... y también lo necesitarías en un formulario de cambio de contraseña.

## Añadir un campo plainPassword

Para facilitar esto, voy a hacer algo opcional. En `User`, arriba, añade una nueva propiedad `private $plainPassword`:

[[[ code('3039188a5b') ]]]

La clave es que esta propiedad no se persistirá en la base de datos: es sólo una propiedad temporal que podemos utilizar durante, por ejemplo, el registro, para almacenar la contraseña simple.

A continuación, iré a "Código"->"Generar" -o `Command`+`N` en un Mac- para generar el getter y el setter para esto. El getter devolverá un `string` nulo:

[[[ code('648a12326d') ]]]

Ahora, si tienes una propiedad `plainPassword`, querrás encontrar`eraseCredentials()` y poner `$this->plainPassword` en null:

[[[ code('706879f074') ]]]

Esto... no es realmente tan importante. Después de que la autenticación sea exitosa, Symfony llama a `eraseCredentials()`. Es... sólo una forma de "borrar cualquier información sensible" de tu objeto `User` una vez que se ha realizado la autenticación. Técnicamente nunca estableceremos `plainPassword` durante la autenticación... así que no importa. Pero, de nuevo, es algo seguro.
# Hacer un hash de la contraseña en los accesorios

De vuelta a `UserFactory`, en lugar de establecer la propiedad `password`, establece`plainPassword` como "tada":

[[[ code('d7696c3fe7') ]]]

Si nos detuviéramos ahora, se establecería esta propiedad... pero entonces la propiedad `password` seguiría siendo `null`... y explotaría en la base de datos porque esa columna es necesaria.

Así que, después de que Foundry haya terminado de instanciar el objeto, tenemos que ejecutar algún código adicional que lea el `plainPassword` y lo someta a hash. Podemos hacerlo aquí abajo, en el método`initialize()`... mediante un gancho "después de la instanciación":

[[[ code('b54d0979fd') ]]]

Esto está muy bien: llama a `$this->afterInstantiate()`, pásale una llamada de retorno y, dentro de digamos si `$user->getPlainPassword()` -por si acaso lo anulamos a`null` -, entonces `$user->setPassword()`. Genera el hash con`$this->passwordHasher->hashPassword()` pasándole el usuario al que estamos tratando de hacer el hash - así que `$user` - y luego lo que sea la contraseña simple:`$user->getPlainPassword()`:

[[[ code('5917e3424d') ]]]

¡Hecho! Vamos a probar esto. Busca tu terminal y ejecuta:

```terminal
symfony console doctrine:fixtures:load
```

Esto te llevará un poco más de tiempo que antes, porque hacer el hash de las contraseñas requiere un uso intensivo de la CPU. Pero... ¡funciona! Comprueba la tabla `user`:

```terminal
symfony console doctrine:query:sql 'SELECT * FROM user'
```

Y... ¡lo tengo! ¡Cada usuario tiene una versión con hash de la contraseña!

## Validación de la contraseña: PasswordCredentials

Por último, estamos preparados para comprobar la contraseña del usuario dentro de nuestro autentificador. Para ello, tenemos que hacer un hash de la contraseña simple enviada y luego compararla de forma segura con el hash de la base de datos.

Bueno, no necesitamos hacerlo... porque Symfony lo hará automáticamente. Compruébalo: sustituye `CustomCredentials` por un nuevo `PasswordCredentials` y pásale la contraseña en texto plano enviada:

[[[ code('b991369992') ]]]

¡Ya está! Pruébalo. Accede con nuestro usuario real - `abraca_admin@example.com` - y copia eso, y luego una contraseña errónea. ¡Muy bien! ¡Contraseña no válida! Ahora introduce la contraseña real `tada`. ¡Funciona!

¡Es increíble! Cuando pones un `PasswordCredentials` dentro de tu `Passport`, Symfony lo utiliza automáticamente para comparar la contraseña enviada con la contraseña con hash del usuario en la base de datos. Eso me encanta.

Todo esto es posible gracias a un potente sistema de escucha de eventos dentro de la seguridad. Vamos a aprender más sobre eso a continuación y veremos cómo podemos aprovecharlo para añadir protección CSRF a nuestro formulario de acceso... con unas dos líneas de código.
