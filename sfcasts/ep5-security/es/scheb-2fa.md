# autenticación de 2 factores y tokens de autenticación

Para nuestro último truco en este tutorial, vamos a hacer algo divertido: añadir la autenticación de dos factores. Esto puede adoptar varias formas, pero el flujo básico es el siguiente, que probablemente te resulte familiar. Primero, el usuario envía un correo electrónico y una contraseña válidos al formulario de inicio de sesión. Pero entonces, en lugar de iniciar la sesión, se les redirige a un formulario en el que tienen que introducir un código temporal.

Este código puede ser algo que le enviemos por correo electrónico o por mensaje de texto a su teléfono... o puede ser un código de una aplicación de autentificación como Google authenticator o Authy. Una vez que el usuario rellene el código y lo envíe, estará finalmente conectado.

## Instalación del paquete scheb/2fa

En el mundo de Symfony, tenemos la gran suerte de contar con una fantástica biblioteca que nos ayuda con la autenticación de dos factores. Busca Symfony 2fa para encontrar la biblioteca [scheb/2fa](https://github.com/scheb/2fa). Desplázate hacia abajo... y haz clic en la documentación, que se encuentra en Symfony.com. Luego dirígete a la página de instalación.

¡Genial! ¡Vamos a instalar esta cosa! En tu terminal, ejecuta

```terminal
composer require "2fa:^5.13"
```

Donde 2fa es un alias de Flex para el nombre real del paquete.

Una vez que esto termine... Ejecutaré:

```terminal
git status
```

para ver qué ha hecho la receta del bundle. Genial: ha añadido un nuevo archivo de configuración... y también un nuevo archivo de rutas.

Ese archivo de rutas, que vive en `config/routes/scheb_2fa.yaml`, añade dos rutas a nuestra aplicación:

[[[ code('38055913ea') ]]]

La primera mostrará el formulario de "introducir el código" que vemos después de enviar nuestro correo electrónico y contraseña. La segunda ruta es la URL a la que se enviará este formulario.

## Configuración del paquete / Setup

De vuelta a la documentación, vamos a repasar esto. El paso 2 - habilitar el paquete - lo ha hecho Flex automáticamente... y el paso 3 - definir las rutas - se ha gestionado gracias a la receta. ¡Muy bien!

El paso 4 es configurar el cortafuegos. Esta parte sí tenemos que hacerla.

Empieza por copiar el material de `two_factor`. Luego abre`config/packages/security.yaml`. Esta nueva configuración puede vivir en cualquier lugar bajo nuestro cortafuegos`main`. La pegaré después de `form_login`... y podemos eliminar este comentario: destacaba que `2fa_login` debía coincidir con el nombre de la ruta en nuestro archivo de rutas, lo cual hace:

[[[ code('133af9ac3c') ]]]

Ah, y ¿recuerdas que la función de la mayoría de las claves de nuestro cortafuegos es activar otro autentificador? Pues la clave `two_factor` no es una excepción: activa un nuevo autentificador que gestiona el envío del formulario "introduce tu código" que veremos en unos minutos.

El README también recomienda un par de controles de acceso, que son una buena idea. Cópialos... y pégalos en la parte superior de nuestro `access_control`:

[[[ code('a8c8ef8531') ]]]

Este segundo se asegura de que no puedas ir a `/2fa` -que es la URL que muestra el formulario "introduce tu código"- a menos que ya hayas enviado tu correo electrónico y contraseña válidos. Cuando estás en esa especie de estado de "entrecruzamiento", el paquete 2fa se asegura de que tengas este atributo `IS_AUTHENTICATED_2FA_IN_PROGRESS`:

[[[ code('3082409c74') ]]]

La primera entrada -para `/logout` - se asegura de que si estás en ese estado "intermedio", todavía puedes cancelar el inicio de sesión yendo a `/logout`. Pero cambia esto por `PUBLIC_ACCESS`:

[[[ code('94d4f305ea') ]]]

## Configurar los security_tokens

El último paso del README es configurar este `security_tokens` config.

Me explico. Cuando enviamos un correo electrónico y una contraseña válidos en el formulario de inicio de sesión, el sistema de autenticación de dos factores -a través de un oyente- va a decidir si debe interrumpir la autenticación e iniciar el proceso de autenticación de dos factores... en el que redirige al usuario al formulario de "introducir el código".

Si lo pensamos bien, definitivamente queremos que esto ocurra cuando un usuario se registre a través del formulario de acceso. Pero... probablemente no querríamos que esto ocurriera si, por ejemplo, un usuario se autentificara a través de un token de la API. El paquete necesita una forma de averiguar si queremos o no 2fa en función de cómo se acaba de autenticar el usuario.

No hemos hablado mucho de ello, pero siempre que te conectas, te autentificas con un determinado tipo de objeto token. Este objeto token es... una especie de envoltura del objeto `User`... y casi nunca te preocupas por él.

Pero, diferentes sistemas de autenticación -como `form_login` o `remember_me` - utilizan diferentes clases de tokens... lo que significa que puedes averiguar cómo se conectó originalmente el usuario, mirando el token actualmente autenticado.

Por ejemplo, esta clase de token superior es en realidad el token que obtienes si te conectas a través del autentificador `form_login`. Te lo demostraré. Pulsa `Shift`+`Shift` y busca `FormLoginAuthenticator`. Dentro... tiene un método `createAuthenticatedToken()`, un método que tiene todo autentificador. Devuelve un nuevo `UsernamePasswordToken`.

Este es el punto. Si iniciamos la sesión a través de este autentificador... y la clase de token correspondiente aparece en nuestra configuración de `scheb_two_factor`, el proceso de autentificación de dos factores se hará cargo y redirigirá al usuario al formulario de "introducir el código".

Vamos a ver qué aspecto tiene nuestro archivo: `config/packages/scheb_2fa.yaml`:

[[[ code('0081450452') ]]]

Por defecto, la única clase no comentada es `UsernamePasswordToken`, lo cual es perfecto para nosotros.

Pero fíjate en el último comentario. Si te estás autentificando mediante un autentificador personalizado -como hemos hecho antes-, debes utilizar esta clase.

Veamos exactamente por qué es así. Abre nuestro `LoginFormAuthenticator` personalizado. Ya no lo usamos, pero haz como si lo hiciéramos. Esto extiende`AbstractLoginFormAuthenticator`:

[[[ code('63ec494730') ]]]

Mantén pulsado `Cmd` o `Ctrl` para abrirlo... luego abre su clase base `AbstractAuthenticator`. Desplázate un poco hacia abajo y... ¡hola `createAuthenticatedToken()`! Esto devuelve un nuevo`PostAuthenticatedToken`. Y así, por defecto, esta es la clase token que obtienes con un autentificador personalizado.

Estas clases de token no son superimportantes... básicamente todas extienden el mismo `AbstractToken`... y en su mayoría sólo ayudan a identificar cómo se ha conectado el usuario.

Aprovechando este conocimiento, junto con la configuración scheb, puedes decirle al paquete de dos factores qué autenticadores requieren la autenticación de dos factores y cuáles no.

Ah, y si utilizas dos autenticadores personalizados... y sólo uno de ellos necesita la autenticación de dos factores, tendrás que crear una clase de token personalizada y anular el método `createAuthenticatedToken()` de tu autenticador para que lo devuelva. Entonces podrás apuntar sólo a la clase personalizada aquí.

¡Uf! Puede parecer que no hemos hecho mucho todavía... aparte de escucharme hablar de tokens... pero el paquete ya está... básicamente configurado. Pero ahora tenemos que elegir cómo recibirán los tokens nuestros usuarios. ¿Los enviaremos por correo electrónico? ¿O utilizarán una aplicación de autentificación con un código QR? Vamos a hacer lo segundo.
