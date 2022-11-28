# Redirección personalizada cuando "Email no verificado"

Es genial que podamos escuchar el `CheckPassportEvent` y hacer que la autenticación falle lanzando cualquier excepción de autenticación, como esta`CustomUserMessageAuthenticationException`:

[[[ code('4f86425dd6') ]]]

Pero ¿qué pasa si, en lugar del comportamiento normal de fallo -en el que redirigimos a la página de inicio de sesión y mostramos el error-, queremos hacer algo diferente? ¿Qué pasa si, justo en esta situación, queremos redirigir a una página totalmente diferente para poder explicar que su correo electrónico no está verificado... y tal vez incluso permitirles reenviar ese correo electrónico?

Bueno, por desgracia, no hay forma -en este evento- de controlar la respuesta de fallo. No hay `$event->setResponse()` ni nada parecido.

Así que no podemos controlar el comportamiento del error desde aquí, pero podemos controlarlo escuchando un evento diferente. Desde este evento "señalaremos" que la cuenta no ha sido verificada, buscaremos esa señal desde un oyente de eventos diferente y redirigiremos a esa otra página. No pasa nada si esto aún no tiene sentido: vamos a verlo en acción.

## Crear una clase de excepción personalizada

Para empezar, tenemos que crear una clase de excepción de autenticación personalizada. Esto servirá como "señal" de que estamos en esta situación de "cuenta no verificada".

En el directorio `Security/`, añade una nueva clase: ¿qué tal`AccountNotVerifiedAuthenticationException`. Haz que extienda `AuthenticationException`. Y luego... no hagas absolutamente nada más:

[[[ code('848e3c237c') ]]]

Ésta es sólo una clase marcadora que utilizaremos para indicar que está fallando la autenticación debido a un correo electrónico no verificado.

De vuelta al suscriptor, sustituye el `CustomUserMessageAuthenticationException` por`AccountNotVerifiedAuthenticationException`. No necesitamos pasarle ningún mensaje:

[[[ code('73c8e27894') ]]]

Si nos detenemos en este momento, esto no será muy interesante. El inicio de sesión sigue fallando, pero volvemos al mensaje genérico:

> Se ha producido una excepción de autenticación

Esto se debe a que nuestra nueva clase personalizada extiende `AuthenticationException`... y ese es el mensaje genérico que se obtiene de esa clase. Así que esto no es lo que queremos todavía, ¡pero el paso 1 está hecho!

## Escuchar el evento LoginFailureEvent

Para el siguiente paso, recuerda del comando `debug:event` que uno de los escuchadores que tenemos es para un `LoginFailureEvent`, que, como su nombre indica, se llama cada vez que falla la autenticación.

Vamos a añadir otro oyente en esta clase para eso. Digamos que`LoginFailureEvent::class` se ajusta a, qué tal, `onLoginFailure`. En este caso, la prioridad no importará:

[[[ code('61f59f0a91') ]]]

Añade el nuevo método: `public function onLoginFailure()`... y sabemos que éste recibirá un argumento `LoginFailureEvent`. Al igual que antes, empieza con`dd($event)` para ver cómo queda:

[[[ code('40a37351a2') ]]]

Así que, con un poco de suerte, si fallamos en el inicio de sesión -por cualquier motivo- se llamará a nuestro oyente. Por ejemplo, si introduzco una contraseña incorrecta, ¡sí! Se llama. Y fíjate en que el`LoginFailureEvent` tiene una propiedad de excepción. En este caso, contiene un`BadCredentialsException`.

Ahora entra con la contraseña correcta y... se golpea de nuevo. Pero esta vez, fíjate en la excepción. ¡Es nuestro `AccountNotVerifiedAuthenticationException` personalizado! Así que el objeto `LoginFailureEvent` contiene la excepción de autenticación que causó el fallo. Podemos utilizarlo para saber -desde este método- si la autenticación falló debido a que la cuenta no está verificada.

## Redirigir cuando la cuenta no está verificada

Así que, si no `$event->getException()` es una instancia de`AccountNotVerifiedAuthenticationException`, entonces simplemente devuelve y permite que el comportamiento de fallo por defecto haga lo suyo:

[[[ code('d2033dfd9b') ]]]

Finalmente, aquí abajo, sabemos que debemos redirigir a esa página personalizada. Vamos... a crear esa página rápidamente. Hazlo en `src/Controller/RegistrationController.php`. En la parte inferior, añade un nuevo método. Lo llamaré `resendVerifyEmail()`. Encima de esto, añade `@Route()` con, qué tal `/verify/resend` y el nombre es igual a`app_verify_resend_email`. Dentro, sólo voy a renderizar una plantilla: return`$this->render()`, `registration/resend_verify_email.html.twig`:

[[[ code('093f8613f8') ]]]

¡Vamos a hacer eso! Dentro de `templates/registration/`, crea`resend_verify_email.html.twig`. Voy a pegar la plantilla:

[[[ code('00bdad4348') ]]]

Aquí no hay nada del otro mundo. Sólo explica la situación.

He incluido un botón para reenviar el correo electrónico, pero te dejo la implementación a ti. Yo probablemente lo rodearía de un formulario que haga un POST a esta URL. Y luego, en el controlador, si el método es POST, utilizaría el paquete de correo electrónico de verificación para generar un nuevo enlace y reenviarlo. Básicamente, el mismo código que utilizamos tras el registro.

De todos modos, ahora que tenemos una página funcional, copia el nombre de la ruta y vuelve a nuestro suscriptor. Para anular el comportamiento normal de los fallos, podemos utilizar un método`setResponse()` en el evento.

Empieza con `$response = new RedirectResponse()` -vamos a generar una URL para la ruta en un minuto- y luego con `$event->setResponse($response)`:

[[[ code('d5a84a00cc') ]]]

Para generar la URL, necesitamos un método `__construct()` -permíteme deletrearlo correctamente- con un argumento `RouterInterface $router`. Pulsa `Alt`+`Enter` y ve a "Inicializar propiedades" para crear esa propiedad y establecerla:

[[[ code('6d9e31c4ff') ]]]

Aquí abajo, estamos en el negocio: `$this->router->generate()` con`app_verify_resend_email`:

[[[ code('1361f5e4e6') ]]]

¡Donezo! Fallamos la autenticación, nuestro primer oyente lanza la excepción personalizada, buscamos esa excepción desde el oyente de `LoginFailureEvent`... y establecemos la redirección.

¡Hora de probar! Refresca y... ¡lo tienes! Nos envían a `/verify/resend`. ¡Me encanta!

A continuación: vamos a terminar este tutorial haciendo algo superguay, superdivertido y... un poco friki. Vamos a añadir la autenticación de dos factores, completada con elegantes códigos QR.
