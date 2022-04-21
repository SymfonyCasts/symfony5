# composer require seguridad

¡Bienvenidos de nuevo amigos! Estoy muy contento de que hayáis tropezado con mi tutorial de seguridad de Symfony 5 por un montón de razones. La primera es que, bueno... eh... el sitio que hemos estado construyendo NO tiene seguridad... y los rapaces están empezando a sacudir los pomos de las puertas.

La otra razón es que, una vez que lleguemos al cobertizo de mantenimiento en el otro lado del recinto, vamos a explorar el nuevo sistema de seguridad de Symfony, llamado sistema "autentificador". Ooh. Si has utilizado el sistema antiguo, te sentirás como en casa. Si eres nuevo en la seguridad de Symfony, has elegido un buen momento para empezar. El nuevo sistema es más fácil de aprender y entender... pero también es más potente.

## Configuración del Proyecto

Y como el sistema de seguridad no se va a poner en marcha por sí solo, pongámonos a trabajar. Para aprender a autenticar, autorizar y hacer otras cosas interesantes de seguridad a nivel profesional, deberías descargar el código del curso desde esta página y codificar conmigo. Cometer errores en el mundo real.... sí, es la mejor manera de recordar estas cosas.

Después de descomprimir el archivo, encontrarás un directorio `start/` con el mismo código que ves aquí. Abre el archivo `README.md` para obtener todas las instrucciones de configuración. El último paso será buscar un terminal, entrar en el proyecto e iniciar un servidor web. Para ello voy a utilizar el binario `symfony`:

```terminal
symfony serve -d
```

Esto inicia un nuevo servidor en https://127.0.0.1:8000. Ábrelo en tu navegador... o sé perezoso y ejecuta

```terminal
symfony open:local
```

para... "delegar" el trabajo a otra persona. ¡Saluda a Cauldron Overflow! Un sitio de preguntas y respuestas para brujas y magos, que... por desgracia... siguen lanzando sus hechizos en directo en producción sin probarlos... y normalmente un viernes por la tarde. Por supuesto. Luego vienen aquí a preguntar cómo deshacer el daño.

## Instalando Seguridad

Como la filosofía de Symfony es empezar poco a poco y permitirte instalar las cosas que necesitas más tarde, ahora mismo nuestra aplicación... no tiene literalmente un sistema de seguridad.

Eso no es divertido, ¡así que vamos a instalar uno! Vuelve a tu terminal y ejecuta:

```terminal
composer require security
```

Esto instala el paquete de seguridad de Symfony. Cuando termine... ejecuta

```terminal
git status
```

para ver lo que hizo su receta. Además de las cosas normales, ha añadido un nuevo archivo de configuración: `security.yaml`. Vamos a comprobarlo:`config/packages/security.yaml`:

[[[ code('1bd870f3b8') ]]]

Como habrás adivinado por su nombre, ¡este archivo alimenta el sistema de seguridad! Cuando terminemos, cada sección de aquí te resultará sencilla y aburrida. Me encanta cuando las cosas de programación son aburridas.

## enable_authenticator_manager

Oh, ¿pero ves esta clave `enable_authenticator_manager`?

[[[ code('880f2debfa') ]]]

En Symfony 5.3 -la versión que estoy utilizando- los sistemas de seguridad antiguos y nuevos conviven y puedes elegir cuál quieres Cuando pones`enable_authenticator_manager` en `true`, estás activando el nuevo sistema. ¡Sí! ¡Brillante! Si estás trabajando en un proyecto heredado y necesitas aprender el sistema antiguo, echa un vistazo a nuestro tutorial [Seguridad en Symfony 4](https://symfonycasts.com/screencast/symfony4-security). ¡También es muy bueno!

## Autenticación y Autorización

De todos modos, cuando se habla de seguridad, hay dos grandes partes: la autenticación y la autorización. La autenticación plantea la pregunta "¿quién eres? Y "¿puedes demostrarlo?" Los usuarios, los formularios de inicio de sesión, las cookies "recuérdame", las contraseñas, las claves API... todo eso está relacionado con la autenticación.

La autorización plantea una pregunta diferente: "¿Deberías tener acceso a este recurso?" A la autorización no le importa mucho quién eres... se trata de permitir o denegar el acceso a diferentes cosas, como diferentes URLs o controladores.

En Symfony, o realmente en cualquier sistema de seguridad, la autenticación es la parte complicada. Quiero decir, ¡sólo piensa en cuántas formas hay de autenticarse! Formularios de inicio de sesión, autenticación con tokens de la API, autenticación social con OAuth, SSO, LDAP, ponerse un bigote falso y pasar con confianza por delante de un guardia de seguridad. Es decir... las posibilidades son infinitas. Pero también creo que la autenticación es súper divertida.

Así que a continuación: vamos a empezar nuestro viaje hacia el nuevo y brillante sistema de autenticación creando la parte más básica de la autenticación: una clase de usuario.