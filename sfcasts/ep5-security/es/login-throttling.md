# Estrangulamiento de inicio de sesión y eventos

El sistema de seguridad de Symfony viene repleto de cosas interesantes, como recordar mi nombre, suplantación de identidad y votantes. Incluso tiene soporte incorporado para un autentificador de "enlace de inicio de sesión", también conocido como "enlaces mágicos de inicio de sesión". En este caso, envías un enlace por correo electrónico a tu usuario y éste hace clic en él para iniciar la sesión.

Otra función muy interesante es el estrangulamiento del inicio de sesión: una forma de evitar que alguien de una única dirección IP pruebe las contraseñas una y otra vez en tu sitio... intentando iniciar sesión una y otra vez. Y es súper fácil de usar.

## Activar login_throttling

En tu cortafuegos, habilítalo con `login_throttling: true`:

[[[ code('32379f1247') ]]]

Si te detienes ahí mismo... y actualizas cualquier página, obtendrás un error:

> El estrangulamiento de inicio de sesión requiere el componente Rate Limiter.

¡Y luego un útil comando para instalarlo! ¡Muy bien! Cópialo, gira a tu terminal y ejecútalo:

```terminal
composer require symfony/rate-limiter
```

Este paquete también instala un paquete llamado `symfony/lock`, que tiene una receta. Ejecuta

```terminal
git status
```

para ver lo que ha hecho. Es interesante. Creó un nuevo `config/packages/lock.yaml`, y también modificó nuestro archivo `.env`.

Para hacer un seguimiento de los intentos de acceso, el sistema de estrangulamiento necesita almacenar esos datos en algún lugar. Para ello utiliza el componente `symfony/lock`. Dentro de nuestro archivo`.env`, en la parte inferior, hay una nueva variable de entorno `LOCK_DSN` que se establece en `semaphore`:

[[[ code('1a3da672ac') ]]]

Un semáforo... es básicamente una forma súper sencilla de almacenar estos datos si sólo tienes un único servidor. Si necesitas algo más avanzado, consulta la documentación de`symfony/lock`: muestra todas las diferentes opciones de almacenamiento con sus pros y sus contras. Pero esto nos vendrá muy bien.

Así pues, el paso 1 fue añadir la configuración de `login_throttling`. El paso 2 fue instalar el componente Rate Limiter. Y el paso 3 es... ¡disfrutar de la función! Sí, ¡hemos terminado!

Refrescar. No hay más errores. Por defecto, esto sólo permitirá 5 intentos de acceso consecutivos para el mismo correo electrónico y dirección IP por minuto. Vamos a probarlo. Uno, dos, tres, cuatro, cinco y... ¡el sexto es rechazado! Nos bloquea durante 1 minuto. Tanto el máximo de intentos como el intervalo se pueden configurar. De hecho, podemos verlo.

En tu terminal, ejecuta:

```terminal
symfony console debug:config security
```

Y... busca `login_throttling`. Ahí está. Sí, este `max_attempts` está predeterminado a 5 y `interval` a 1 minuto. Ah, y por cierto, esto también bloqueará que la misma dirección IP haga 5 veces el `max_attempts` para cualquier correo electrónico. En otras palabras, si la misma dirección IP intentara rápidamente 25 correos electrónicos diferentes, los seguiría bloqueando. Y si quieres una primera línea de defensa impresionante, también te recomiendo encarecidamente que utilices algo como Cloudflare, que puede bloquear a los malos usuarios incluso antes de que lleguen a tu servidor... o activar las defensas si tu sitio es atacado desde muchas direcciones IP.

## Profundizando en cómo funciona el estrangulamiento del inicio de sesión

Así que... creo que esta función es bastante genial. Pero lo más interesante para nosotros es cómo funciona entre bastidores. Funciona a través del sistema de oyentes de Symfony. Después de iniciar la sesión, ya sea con éxito o sin éxito, se envían una serie de eventos a lo largo de ese proceso. Podemos engancharnos a esos eventos para hacer todo tipo de cosas interesantes.

Por ejemplo, la clase que contiene la lógica de la aceleración del inicio de sesión se llama`LoginThrottlingListener`. Vamos a... ¡abrirla! Pulsa `Shift`+`Shift` y abre`LoginThrottlingListener.php`.

Espectacular. Los detalles dentro de esto no son demasiado importantes. Puedes ver que utiliza algo llamado limitador de velocidad... que se encarga de comprobar si se ha alcanzado el límite. En última instancia, si se ha alcanzado el límite, lanza esta excepción, que provoca el mensaje que hemos visto. Para los que estén atentos, esa excepción se extiende a `AuthenticationException`... y recuerda que puedes lanzar un`AuthenticationException` en cualquier punto del proceso de autenticación para que falle.

En cualquier caso, este método está escuchando un evento llamado `CheckPassportEvent`. Éste se envía después de que se llame al método `authenticate()` desde cualquier autentificador. En este punto, la autentificación aún no ha tenido éxito... y el trabajo de la mayoría de los oyentes de `CheckPassportEvent` es hacer alguna comprobación extra y fallar la autentificación si algo ha ido mal.

Esta clase también escucha otro evento llamado `LoginSuccessEvent`... que... bueno, es bastante obvio: se envía después de cualquier autenticación con éxito. Esto restablece el limitador de velocidad en caso de éxito.

Así que esto está muy bien, y es nuestra primera visión de cómo funciona el sistema de eventos. A continuación, vamos a profundizar descubriendo que casi todas las partes de la autenticación las realiza un oyente. Entonces, crearemos el nuestro.
