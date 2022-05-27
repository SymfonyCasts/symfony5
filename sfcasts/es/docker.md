# Integración mejorada de Docker y correos de prueba

Symfony ha tenido soporte para Docker durante un tiempo, en particular, para ayudar al desarrollo web local. Por ejemplo, tengo PHP instalado localmente. Así que no estoy usando Docker para obtener el propio PHP. Pero mi proyecto tiene un archivo `docker-compose.yml` que define un servicio de base de datos. Recuerda que el servidor web local que estamos utilizando proviene del binario Symfony... y es inteligente. Detecta automáticamente que tengo`docker-compose` ejecutándose con un servicio `database`... y así lee los parámetros de conexión de este contenedor y los expone como una variable de entorno `DATABASE_URL`.

¡Comprueba esto! En cualquier página, haz clic en la barra de herramientas de depuración web. Asegúrate de que estás en "Petición/Respuesta", y luego ve a "Parámetros del servidor". Desplázate hacia abajo para encontrar`DATABASE_URL` configurado como (en mi caso) `127.0.0.1` en el puerto `56239`. Tal y como está configurado mi`docker-compose.yml`, creará un nuevo puerto aleatorio cada vez que se inicie.

[[[ code('9f0635bf6f') ]]]

El binario de Symfony averiguará entonces de qué puerto aleatorio se trata y creará la variable de entorno en consecuencia. Finalmente, como es normal, gracias a nuestra configuración de`config/packages/doctrine.yaml`, la variable de entorno `DATABASE_URL` se utiliza para hablar con la base de datos. Así que el binario de Symfony más Docker es una buena manera de arrancar rápida y fácilmente servicios externos como una base de datos, una búsqueda elástica, o más.

## Nueva integración de Docker con las recetas de Flex

Recientemente, Symfony ha llevado esto al siguiente nivel. En Symfony.com, encontrarás una entrada de blog llamada [Introducing Docker support](https://symfony.com/blog/introducing-docker-support). La idea es bastante sencilla. Cuando instalas un nuevo paquete -Doctrine, por ejemplo- la receta de ese paquete puede venir con alguna configuración de Docker. Y así, con sólo instalar el paquete, obtienes la configuración de Docker automáticamente.

¡Veamos esto en acción! Puesto que ya tenemos Doctrine instalado, instalemos Mailer, que vendrá con `docker-compose` config para un servicio llamado MailCatcher. En tu terminal, ejecuta:

```terminal
composer require mailer
```

¡Impresionante! Nos detiene y nos pregunta:

> La receta de este paquete contiene alguna configuración de Docker.
> ¿Quieres incluir la configuración Docker de las recetas?

Voy a decir `p` por "Sí permanentemente". Si no quieres las cosas de Docker, ¡no te preocupes! Contesta no o "No permanentemente" y no te lo volverá a preguntar.

Y... ¡listo! Ahora podemos ejecutar

```termional
git status
```

para ver que ha actualizado las cosas normales, pero también nos ha dado un nuevo`docker-compose.override.yml`. Si no estás familiarizado, Docker leerá primero`docker-compose.yml` y luego leerá `docker-compose.override.yml`. El propósito del archivo de anulación es cambiar la configuración que es específica de tu máquina, en este caso, nuestra máquina local.

[[[ code('6cb0c70f6b') ]]]

El nuevo archivo añade un servicio llamado `mailer`... que arranca algo llamado MailCatcher. MailCatcher es una herramienta de depuración local que inicia un servidor SMTP al que puedes enviar correos electrónicos. Y luego te ofrece una interfaz gráfica de usuario web en la que puedes revisar esos correos electrónicos... dentro de una bandeja de entrada ficticia.

Este servicio vive dentro de `docker-compose.override.yml` porque sólo queremos que este servicio se ejecute localmente cuando estemos haciendo desarrollo local. Si utilizas Docker para desplegar tu sitio, tendrás una configuración local diferente para producción. Si no estás desplegando con Docker, toda esta configuración puede vivir en tu archivo principal `docker-compose.yml` si lo deseas.

## Probar MailCatcher

De todos modos, antes de empezar a utilizar este servicio, vamos a configurarlo para enviar un correo electrónico. Abre `src/Controller/RegistrationController.php`. Ya estamos utilizando`symfonycasts/verify-email-bundle`... pero en lugar de enviar realmente el correo electrónico de verificación, sólo vamos a poner la URL de verificación directamente en un mensaje flash. Fue un atajo que hice durante el tutorial de Seguridad.

[[[ code('483b6501dc') ]]]

Pero ahora, vamos a enviar un correo electrónico real. Iré al final de la clase y pegaré una nueva función privada, que puedes obtener de los bloques de código de esta página. Vuelve a escribir la "e" en `MailerInterface` y pulsa "tab" para añadir esa declaración de `use`... y haz lo mismo con la "l" en `Email`. Selecciona la de `Symfony\Component\Mime`.

[[[ code('d67fab0014') ]]]

¡Perfecto! Esto enviará un correo electrónico de verificación muy sencillo que sólo contiene el enlace de verificación.

Ahora, en el método `register()`, añade un nuevo argumento al final:`MailerInterface $mailer`. Luego, aquí abajo, elimina el `TODO`... y sustitúyelo por `$this->sendVerificationEmail()` pasando por `$mailer`, `$user`, y `$signedUrl`. Finalmente, en el flash `success`, cambia el mensaje para decirle al usuario que debe comprobar su correo electrónico.

[[[ code('c69e90aa0b') ]]]

Bien, ya tenemos este nuevo archivo `docker-compose.override.yml` con MailCatcher. Sin embargo, ese contenedor aún no se está ejecutando. Pero, ignora eso por un momento... y veamos si podemos hacer funcionar el correo electrónico.

Vuelve a la página de Registro... ¡Ups! Obtenemos un error:

> Variable de entorno no encontrada: "MAILER_DSN".

¡Por supuesto! El servicio mailer necesita esta variable de entorno para indicarle dónde debe enviar los correos electrónicos. Puedes encontrarla dentro de `.env`: la receta del mailer nos dio la var. de entorno `MAILER_DSN`, pero está comentada. Descomenta eso.

[[[ code('7d546e7ff9') ]]]

Por defecto, envía los correos a lo que se llama "transporte nulo"... lo que significa que cuando enviamos correos... no van a ninguna parte. No se entregan realmente... lo que es una buena configuración para el desarrollo.

Refresca, añade una dirección de correo electrónico falsa, regístrate y... ¡funciona! Por supuesto, no envió el correo electrónico a ninguna parte... pero aún podemos ver, más o menos, cómo sería el correo electrónico.

¿Cómo? Haz clic en cualquier enlace para entrar en el Perfilador, haz clic en "Últimos 10", busca la petición POST de `/register` y haz clic en ella. Aquí abajo, ve a la sección "Correos electrónicos" y... ¡voilà! Muestra nuestro correo electrónico con una vista previa en HTML. Y vaya que es feo... pero eso es culpa mía. Por cierto, la vista previa HTML es una nueva característica de Symfony 5.4.

## Iniciando el servicio MailCatcher

Bien, esto es genial. Pero veamos cómo MailCatcher también puede ayudarnos a depurar los correos electrónicos. En primer lugar, si aún no tienes un archivo `docker-compose.yml`, crea uno. Todo lo que necesitas es la línea `version` en la parte superior. Así tendremos un archivo `docker-compose.yml` y un archivo`docker-compose.override.yml`.

Ahora, busca tu terminal y ejecuta:

```terminal
docker-compose up -d
```

Ya tengo `docker-compose` ejecutándose para mi contenedor de base de datos, pero esto iniciará ahora el contenedor `mailer`, que inicializará un nuevo servidor SMTP de captación de correo.

Vale... entonces, ¿cómo configuramos `mailer` para que entregue a este servidor SMTP desde MailCatcher? De todas formas, ¿en qué puerto está funcionando ese servidor SMTP? La respuesta es... ¡no lo sabemos! Y no nos importa.

Observa esto. Vuelve a cualquier página, actualiza... y luego haz clic en el Perfilador. Una vez más, asegúrate de que estás en la sección "Petición/Respuesta" y luego ve a "Parámetros del servidor". Desplázate hasta `MAILER_URL`.

¡Woh! `MAILER_URL` se ha convertido de repente en `smtp://127.0.0.1:65320`!

Esto es lo que ha ocurrido. Cuando iniciamos el servicio `mailer`, Docker expuso el puerto`1025` de ese contenedor -que es el servidor SMTP- a un puerto aleatorio de mi máquina anfitriona. El binario de Symfony vio eso, leyó el puerto aleatorio y luego, al igual que con la base de datos, expuso una variable de entorno `MAILER_URL` que apunta a él. En otras palabras, ¡nuestros correos electrónicos ya se enviarán a MailCatcher!

¡Vamos a probarlo! Me registraré de nuevo con otra dirección de correo electrónico, aceptaré las condiciones y... ¡genial! ¡No hay error! Para ver el correo electrónico, podríamos volver a entrar en el Perfilador como hemos hecho hace un momento. Pero en teoría, si eso se envió a MailCatcher, deberíamos poder ir a la interfaz de usuario de MailCatcher y revisar el mensaje allí. La pregunta es: ¿dónde está la UI de `MailCatcher`? ¿En qué puerto se está ejecutando? Porque también se está ejecutando en un puerto aleatorio.

Para ayudarte con esto, pasa el ratón por encima de la sección "Servidor" de la barra de herramientas de depuración web. Puedes ver que detecta que `docker-compose` se está ejecutando, está exponiendo algunas variables de entorno de Docker, ¡e incluso ha detectado Webmail! Haz clic en "Abrir" para entrar en MailCatcher... ¡y ahí está nuestro correo electrónico!

Si envías más correos, aparecerán aquí como una pequeña bandeja de entrada.

Y... ¡eso es todo! ¡Felicidades! ¡Acabas de actualizar tu aplicación a Symfony 6! ¡Y a PHP 8! ¡Y a los atributos de PHP! ¡Qué cosas más chulas!

Si tienes alguna pregunta o te encuentras con algún problema durante la actualización del que no hayamos hablado, estamos aquí para ti en los comentarios. Muy bien, amigos, ¡hasta la próxima!
