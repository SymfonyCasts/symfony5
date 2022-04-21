# Eventos y escuchas de seguridad

Si has utilizado Symfony durante un tiempo, probablemente sabrás que Symfony envía eventos durante el proceso de petición-respuesta y que puedes escucharlos. Para ver estos eventos y sus oyentes, podemos ejecutar:

```terminal
symfony console debug:event
```

No voy a profundizar demasiado, pero, este evento `kernel.request` se despacha en cada petición antes de que se llame al controlador. Esto significa que todos estos oyentes se ejecutan antes que nuestro controlador. Los oyentes de este evento `kernel.response`son llamados después de nuestro controlador.

Estos dos eventos no tienen... nada que ver con el sistema de seguridad. Pero resulta que nuestro cortafuegos también envía varios eventos durante el proceso de autenticación, y también podemos escucharlos.

Para ver una lista de todos los oyentes de estos eventos, podemos ejecutar de nuevo `debug:event`, pero con un `--dispatcher=` especial fijado en `security.event_dispatcher.main`:

```terminal-silent
symfony console debug:event --dispatcher=security.event_dispatcher.main
```

Lo sé, parece un poco raro... pero esto nos permite listar los oyentes de eventos para el despachador de eventos que es específico del cortafuegos `main`.

## Mirando los eventos y oyentes de seguridad del núcleo

Y... ¡impresionante! Un conjunto totalmente diferente de eventos y escuchadores. Esto es genial. Vuelve a mirar nuestra clase personalizada `LoginFormAuthenticator`. Ya no la utilizamos, pero puede ayudarnos a entender qué eventos se envían a través del proceso.

Sabemos que, en nuestro método `authenticate()`, nuestro trabajo es devolver el `Passport`:

[[[ code('2b25b58375') ]]]

Entonces, después de llamar al método `authenticate()` -en cualquier autentificador- Symfony despacha `CheckPassportEvent`. Hay un montón de oyentes interesantes para esto.

Por ejemplo, `UserProviderListener` es básicamente responsable de cargar el objeto `User`, `CheckCredentialsListener` es responsable de comprobar la contraseña,`CsrfProtectionListener` valida el token CSRF y `LoginThrottlingListener`comprueba... el estrangulamiento del inicio de sesión.

Si falla la autenticación, hay un evento diferente para eso: `LoginFailureEvent`. Ahora mismo, nuestra aplicación sólo tiene un oyente - `RememberMeListener` - que borra la cookie "recuérdame" si el usuario tenía una.

Cuando el inicio de sesión tiene éxito, Symfony envía `LoginSuccessEvent`. Esto ya tiene 5 oyentes en nuestra aplicación, incluyendo el oyente que establece la cookie "recuérdame".

También hay un evento que se envía cuando se cierra la sesión... para que puedas ejecutar código o incluso controlar lo que ocurre, como a dónde se redirige al usuario.

El siguiente - `TokenDeauthenticatedEvent` - es un poco más sutil. Se envía si el usuario "pierde" la autenticación... pero no se cierra la sesión. Básicamente se envía si cambian ciertos datos del usuario. Por ejemplo, imagina que estás conectado en dos ordenadores y luego cambias tu contraseña en el primero. Cuando actualices el sitio en el segundo ordenador, serás "desautenticado" porque tu contraseña ha cambiado en otra máquina. En ese caso, se envía este evento.

Ah, y este `security.authentication.success` no es demasiado importante, es muy similar a `LoginSuccessEvent`.

Conocer estos eventos es fundamental porque quiero hacer que si el usuario intenta iniciar sesión con un correo electrónico que no ha sido verificado, lo impidamos y le mostremos un bonito mensaje.

Para ello, vamos a poner en marcha nuestro propio receptor de eventos que tiene la capacidad de hacer que la autenticación falle.
