# Consulta de usuario personalizada y credenciales

En la pantalla, vemos un `dd()` de la contraseña que introduje en el formulario de acceso y el objeto de entidad `User` para el correo electrónico que introduje. ¡Algo, de alguna manera, supo tomar el correo electrónico introducido y consultar por el Usuario!

## UserBadge y el proveedor de usuarios

Así es como funciona esto. Después de que devolvamos el objeto `Passport`, el sistema de seguridad intenta encontrar el objeto `User` a partir de `UserBadge`. Si sólo le pasas un argumento a `UserBadge` -como es nuestro caso-, lo hace aprovechando nuestro proveedor de usuarios. ¿Recuerdas esa cosa de `security.yaml` llamada `providers`?

[[[ code('f87f38f48d') ]]]

Como nuestra clase `User` es una entidad, estamos utilizando el proveedor `entity` que sabe cómo cargar usuarios utilizando la propiedad `email`. Así que, básicamente, se trata de un objeto que es muy bueno para consultar la tabla de usuarios a través de la propiedad `email`. Así que cuando pasamos sólo el correo electrónico a `UserBadge`, el proveedor de usuarios lo utiliza para consultar `User`.

Si se encuentra un objeto `User`, Symfony intenta entonces "comprobar las credenciales" de nuestro pasaporte. Como estamos utilizando `CustomCredentials`, esto significa que ejecuta esta llamada de retorno... en la que volcamos algunos datos. Si no se encuentra un `User` - porque hemos introducido un correo electrónico que no está en la base de datos - la autenticación falla. Pronto veremos más sobre estas dos situaciones.

## Consulta de usuario personalizada

En cualquier caso, la cuestión es la siguiente: si sólo pasas un argumento a `UserBadge`, el proveedor de usuarios carga el usuario automáticamente. Eso es lo más fácil de hacer. E incluso puedes personalizar un poco esta consulta si lo necesitas - busca "[Usar una consulta personalizada para cargar el usuario](https://bit.ly/sf-entity-provider-query)" en los documentos de Symfony para ver cómo hacerlo.

O... puedes escribir tu propia lógica personalizada para cargar el usuario aquí mismo. Para ello, vamos a necesitar el `UserRepository`. En la parte superior de la clase, añade`public function __construct()`... y autoconduce un argumento `UserRepository`. Pulsaré`Alt`+`Enter` y seleccionaré "Inicializar propiedades" para crear esa propiedad y establecerla:

[[[ code('5185cc13c9') ]]]

En `authenticate()`, `UserBadge` tiene un segundo argumento opcional llamado cargador de usuario. Pásale una llamada de retorno con un argumento: `$userIdentifier`:

[[[ code('301b8c197a') ]]]

Es bastante sencillo: si le pasas un callable, cuando Symfony cargue tu `User`, llamará a esta función en lugar de a tu proveedor de usuario. Nuestro trabajo aquí es cargar el usuario y devolverlo. El `$userIdentifier` será lo que hayamos pasado al primer argumento de `UserBadge`... así que el `email` en nuestro caso.

Digamos que `$user = $this->userRepository->findOneBy()` para consultar `email` se ajusta a`$userIdentifier`:

[[[ code('53f59221e8') ]]]

Aquí es donde puedes utilizar cualquier consulta personalizada que quieras. Si no podemos encontrar al usuario, tenemos que lanzar una excepción especial. Así que si no es `$user`,`throw new UserNotFoundException()`. Eso hará que falle la autenticación. En la parte inferior, devuelve `$user`:

[[[ code('928f4a4a21') ]]]

Esto... es básicamente idéntico a lo que hacía nuestro proveedor de usuarios hace un minuto... así que no cambiará nada. Pero puedes ver que tenemos el poder de cargar el`User` como queramos.

Actualicemos. Sí El mismo volcado que antes.

## Validación de las credenciales

Bien, si se encuentra un objeto `User` - ya sea desde nuestro callback personalizado o desde el proveedor de usuarios - Symfony comprueba a continuación nuestras credenciales, lo que significa algo diferente dependiendo del objeto de credenciales que pases. Hay 3 principales:`PasswordCredentials` - lo veremos más adelante, un `SelfValidatingPassport` que sirve para la autenticación de la API y no necesita ninguna credencial - y `CustomCredentials`.

Si usas `CustomCredentials`, Symfony ejecuta la llamada de retorno... y nuestro trabajo es "comprobar sus credenciales"... sea lo que sea que eso signifique en nuestra aplicación. El argumento `$credentials`coincidirá con lo que hayamos pasado al segundo argumento de `CustomCredentials`. Para nosotros, eso es la contraseña enviada:

[[[ code('1c2c324707') ]]]

¡Imaginemos que todos los usuarios tienen la misma contraseña `tada`! Para validarlo, devuelve true si `$credentials === 'tada'`:

[[[ code('e22b8c8d1d') ]]]

¡Seguridad hermética!

## Fallo y éxito de la autenticación

Si devolvemos `true` desde esta función, ¡la autenticación ha sido un éxito! ¡Vaya! Si devolvemos `false`, la autenticación falla. Para comprobarlo, baja a `onAuthenticationSuccess()` y `dd('success')`. Haz lo mismo dentro de `onAuthenticationFailure()`:

[[[ code('cbdce16714') ]]]

Pronto pondremos código real en estos métodos... pero su propósito se explica por sí mismo: si la autenticación tiene éxito, Symfony llamará a `onAuthenticationSuccess()`. Si la autenticación falla por cualquier motivo - como un correo electrónico o una contraseña no válidos - Symfony llamará a `onAuthenticationFailure()`.

¡Vamos a probarlo! Vuelve directamente a `/login`. Utiliza de nuevo el correo electrónico real -`abraca_admin@example.com` con la contraseña correcta: `tada`. Envía y... ¡sí! llamó a `onAuthenticationSuccess()`. ¡La autenticación se ha completado!

Lo sé, todavía no parece gran cosa... así que a continuación, vamos a hacer algo en caso de éxito, como redirigir a otra página. También vamos a conocer el otro trabajo crítico de un proveedor de usuarios: refrescar el usuario de la sesión al principio de cada petición para mantenernos conectados.