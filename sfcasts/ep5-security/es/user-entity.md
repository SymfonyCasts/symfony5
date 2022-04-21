# Personalizar la clase de usuario

Lo bueno de la clase `User` es que... ¡es nuestra clase! Mientras implementemos`UserInterface`, podemos añadir lo que queramos:

[[[ code('3a25cd7778') ]]]

Por ejemplo, me gustaría almacenar el nombre de mis usuarios. Así que vamos a añadir una propiedad para eso. En tu terminal, ejecuta:

```terminal
symfony console make:entity
```

Editaremos la entidad `User`, añadiremos una propiedad `firstName`, haremos que sea una cadena, de 255 de longitud... y diremos "sí" a anulable. Hagamos que esta propiedad sea opcional en la base de datos.

Ya está De vuelta a la clase `User`, ¡no hay sorpresas! Tenemos una nueva propiedad... y nuevos métodos getter y setter:

[[[ code('e5a12c2c11') ]]]

Ve a generar una migración para nuestro nuevo `User`. En el terminal, ejecuta

```terminal
symfony console make:migration
```

¡Genial! Gira y abre eso para asegurarte de que no esconde ninguna sorpresa:

[[[ code('45c667b8e8') ]]]

Ejecuta: `CREATE TABLE user` con las columnas `id`, `email`, `roles` y `first_name`. Cierra esto... y ejecútalo:

```terminal
symfony console doctrine:migrations:migrate
```

¡Éxito!

## Añadiendo las entidades de los usuarios

Y como la entidad `User` es... una entidad normal de Doctrine, también podemos añadir usuarios ficticios a nuestra base de datos utilizando el sistema de accesorios.

Abre `src/DataFixtures/AppFixtures.php`. Vamos a utilizar Foundry para ayudarnos a cargar los datos. Así que vamos a crear una nueva fábrica de Foundry para `User`. Como nos estamos divirtiendo tanto ejecutando comandos en este vídeo, vamos a colar uno... o tres más:

```terminal
symfony console make:factory
```

¡Sí! Queremos una para `User`. Ve a abrirlo: `src/Factory/UserFactory.php`:

[[[ code('4a4c542689') ]]]

Nuestro trabajo en `getDefaults()` es asegurarnos de que todas las propiedades necesarias tienen buenos valores por defecto. Establece `email` en `self::faker()->email()`, no estableceré ninguna función por ahora y establece `firstName` en `self::faker()->firstName()`:

[[[ code('014926ecd4') ]]]

¡Genial! En `AppFixtures`, en la parte inferior, crea un usuario: `UserFactory::createOne()`. Pero utiliza un correo electrónico específico para que podamos iniciar sesión con él más tarde. Qué tal,`abraca_admin@example.com`:

[[[ code('60eeaa3729') ]]]

Luego, para rellenar un poco el sistema, añade `UserFactory::createMany(10)`:

[[[ code('2671011665') ]]]

¡Vamos a probarlo! De vuelta al terminal, ejecuta:

```terminal
symfony console doctrine:fixtures:load
```

¡No hay errores! Comprueba la nueva tabla:

```terminal
symfony console doctrine:query:sql 'SELECT * FROM user'
```

Y... ¡ahí están! Ahora que tenemos usuarios en la base de datos, tenemos que añadir una o varias formas para que se autentiquen. ¡Es hora de construir un formulario de acceso!
