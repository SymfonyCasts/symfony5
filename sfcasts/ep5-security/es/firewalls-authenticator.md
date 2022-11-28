# Cortafuegos y autenticadores

Construimos este formulario de inicio de sesión haciendo una ruta, un controlador y renderizando una plantilla:

[[[ code('db53d89860') ]]]

Muy sencillo. Cuando enviamos el formulario, se hace un POST de vuelta a `/login`. Así que, para autenticar al usuario, es de esperar que pongamos algo de lógica aquí: como si se tratara de una petición POST, leer el correo electrónico y la contraseña POSTados, consultar el objeto `User`... y, finalmente, comprobar la contraseña. ¡Eso tiene mucho sentido! Y eso no es en absoluto lo que vamos a hacer.

## Hola cortafuegos

El sistema de autenticación de Symfony funciona de una manera... un poco mágica, que supongo que es adecuada para nuestro sitio. Al inicio de cada petición, antes de que Symfony llame al controlador, el sistema de seguridad ejecuta un conjunto de "autenticadores". El trabajo de cada autentificador es mirar la petición, ver si hay alguna información de autentificación que entienda -como un correo electrónico y una contraseña enviados, o una clave de la API que esté almacenada en una cabecera- y, si la hay, utilizarla para consultar al usuario y comprobar la contraseña. Si todo eso ocurre con éxito, entonces... ¡boom! Autenticación completa.

Nuestro trabajo es escribir y activar estos autentificadores. Abre`config/packages/security.yaml`. Recuerda las dos partes de la seguridad: la autenticación (quién eres) y la autorización (qué puedes hacer).

La parte más importante de este archivo es `firewalls`:

[[[ code('bb6e00ac72') ]]]

Un cortafuegos tiene que ver con la autenticación: su trabajo es averiguar quién eres. Y, por lo general, tiene sentido tener sólo un cortafuegos en tu aplicación... incluso si hay varias formas diferentes de autenticarse, como un formulario de inicio de sesión y una clave de API y OAuth.

## El cortafuegos "dev"

Pero... woh woh woh. Si casi siempre queremos un solo cortafuegos... ¿por qué hay ya dos? Así es como funciona: al inicio de cada petición, Symfony recorre la lista de cortafuegos, lee la clave `pattern` -que es una expresión regular- y encuentra el primer cortafuegos cuyo patrón coincida con la URL actual. Así que sólo hay un cortafuegos activo por petición.

Si te fijas bien, ¡este primer cortafuegos es falso! Básicamente, busca si la URL empieza por `/_profiler` o `/_wdt`... y luego establece la seguridad en `false`:

[[[ code('7d4e1725bb') ]]]

En otras palabras, básicamente se está asegurando de que no se crea un sistema de seguridad tan épico que... bloquea la barra de herramientas de depuración web y el perfilador.

Así que... en realidad, sólo tenemos un cortafuegos real llamado `main`. No tiene la clave `pattern`, lo que significa que coincidirá con todas las peticiones que no coincidan con el cortafuegos `dev`. Ah, ¿y los nombres de estos cortafuegos - `main` y `dev`? No tienen ningún sentido.

## Activar los autentificadores

La mayor parte de la configuración que vamos a poner debajo del cortafuegos está relacionada con la activación de los autentificadores: esas cosas que se ejecutan al principio de cada petición y que intentan autentificar al usuario. Pronto añadiremos parte de esa configuración. Pero estas dos claves superiores hacen algo diferente. `lazy` permite que el sistema de autenticación no autentique al usuario hasta que lo necesite y `provider` vincula este cortafuegos al proveedor de usuarios del que hemos hablado antes. Deberías tener estas dos líneas... pero ninguna es terriblemente importante:

[[[ code('57caeb0679') ]]]

## Crear una clase de autenticador personalizada

De todos modos, cada vez que queramos autentificar al usuario -como cuando enviamos un formulario de acceso- necesitamos un autentificador. Hay algunas clases de autentificadores principales que podemos utilizar, incluida una para los formularios de inicio de sesión.... y te mostraré algunas de ellas más adelante. Pero para empezar, vamos a construir nuestra propia clase de autentificador desde cero.

Para ello, ve al terminal y ejecuta:

```terminal
symfony console make:auth
```

Como puedes ver, puedes seleccionar "Autenticador de formularios de inicio de sesión" para engañar y generar un montón de código para un formulario de inicio de sesión. Pero como estamos construyendo cosas desde cero, selecciona "Autentificador vacío" y llámalo `LoginFormAuthenticator`.

Espectacular. Esto hizo dos cosas: creó una nueva clase de autentificador y también actualizó`security.yaml`. Abre primero la clase: `src/Security/LoginFormAuthenticator.php`:

[[[ code('3507d77a21') ]]]

La única regla sobre un autentificador es que necesita implementar`AuthenticatorInterface`... aunque normalmente extenderás `AbstractAuthenticator`... que implementa `AuthenticatorInterface` por ti:

[[[ code('5f4050a81e') ]]]

Hablaremos de lo que hacen estos métodos uno por uno. En cualquier caso, `AbstractAuthenticator` es agradable porque implementa un método súper aburrido para ti.

Una vez que activemos esta nueva clase en el sistema de seguridad, al principio de cada petición, Symfony llamará a este método `supports()` y básicamente preguntará

> ¿Ves información de autenticación en esta petición que entiendas?

Para demostrar que Symfony llamará a esto, vamos a `dd('supports')`:

[[[ code('57cf2a3e49') ]]]

## Activar los autenticadores con custom_authenticators

Bien, entonces, ¿cómo activamos este autentificador? ¿Cómo le decimos a nuestro cortafuegos que debe utilizar nuestra nueva clase? En `security.yaml`, ¡ya tenemos el código que lo hace! Esta línea `custom_authenticator` fue añadida por el comando `make:auth`:

[[[ code('6212a2e3eb') ]]]

Así que si tienes una clase de autentificador personalizada, así es como la activas. Más adelante, veremos que puedes tener varios autentificadores personalizados si quieres.

En cualquier caso, ¡esto significa que nuestro autentificador ya está activo! Así que vamos a probarlo. Actualiza la página de inicio de sesión. ¡Accede al método `supports()`! De hecho, si vas a cualquier URL, se encontrará con nuestro `dd()`. En cada petición, antes del controlador, Symfony pregunta ahora a nuestro autentificador si soporta la autentificación en esta petición.

A continuación, vamos a rellenar la lógica del autentificador y conseguir que nuestro usuario inicie la sesión
