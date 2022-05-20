# A la caza de los últimos depredadores

¡Muy bien equipo! Vamos a arreglar estas últimas depreciaciones. Una de las cosas más complicadas de estas es que, a veces, provienen de paquetes de terceros. No tengo ningún ejemplo aquí, pero a veces recibirás una desaprobación y... si lo investigas, te darás cuenta de que no es culpa tuya. Viene de una biblioteca o de un paquete que estás utilizando. Cuando esto ocurre, tienes que actualizar ese paquete y esperar que haya una nueva versión sin depreciaciones. De hecho, ya tuvimos algunos ejemplos de esto al principio del tutorial. Pero... ya hemos ejecutado`composer update` unas cuantas veces y, aparentemente, hemos actualizado todas nuestras dependencias a versiones sin depreciaciones. Sí, ¡eficiencia!

## ROLE_PREVIOUS_ADMIN -> IS_IMPERSONATOR

Bien, echemos un vistazo a esta lista. Dice que, en Symfony 5.1,`ROLE_PREVIOUS_ADMIN` está obsoleto y que deberíamos usar `IS_IMPERSONATOR` en su lugar. Puedes mostrar el contexto o rastrear para intentar obtener más información, como de dónde viene esto. No siempre es obvio... y esa es una de las cosas más complicadas de las depreciaciones. Pero ésta viene de `base.html.twig`.

¡Genial! Abre `templates/base.html.twig` y busca "previous_admin". En un tutorial anterior, lo utilizamos para comprobar si estamos suplantando a un usuario con la función `switch_user` de Symfony. Si lo estamos, cambiamos el fondo a rojo para que sea realmente obvio.

Para arreglar la desaprobación, muy sencillo, cambia esto por `IS_IMPERSONATOR`. Cópialo... porque hay otro punto en esta página donde tenemos que hacer lo mismo:`IS_IMPERSONATOR`. ¡Ya está! ¡Una depreciación menos!

[[[ code('b15f70c72e') ]]]

## IS_AUTHENTICATED_ANONYMOUSLY -> PUBLIC_ACCESS

Mientras hablamos de seguridad, abre `config/packages/security.yaml` y dirígete a `access_control`. Tengo unas cuantas entradas - `/logout`, `/admin/login` - que quiero asegurarme absolutamente de que son accesibles para todo el mundo, incluso para los usuarios que no han iniciado sesión. Para ello, añadimos estas reglas en la parte superior y, previamente, utilizamos `IS_AUTHENTICATED_ANONYMOUSLY`. De modo que si voy a `/logout`, sólo se empareja este `access_control`... y como el `role` es`IS_AUTHENTICATED_ANONYMOUSLY` el acceso está siempre concedido.

En Symfony 6, `IS_AUTHENTICATED_ANONYMOUSLY` ha cambiado a `PUBLIC_ACCESS`. Así que úsalo en ambos sitios.

[[[ code('04e65f6c37') ]]]

Si te preguntas por qué no tenemos una deprecación para esto... bueno... es un caso raro en el que Symfony no es capaz de captar esa ruta depreciada y mostrárnosla. Esto no ocurre muy a menudo, pero es una situación en la que una herramienta como SymfonyInsight puede ayudar a detectar esta.... incluso cuando el propio Symfony no puede hacerlo.

## El servicio de sesión desaprobado

Bien, la última deprecación de la lista dice

> `SessionInterface` los alias están obsoletos, utiliza `$requestStack->getSession()`
> en su lugar. Está siendo referenciado por el servicio `LoginFormAuthenticator`.

¡Vamos a comprobarlo! Abre `src/Security/LoginFormAuthenticator.php`. Ahh. Estoy autoconectando el servicio `SessionInterface`. En Symfony 6, ese servicio ya no existe. Hay algunas razones técnicas para ello... pero resumiendo, la sesión nunca fue, realmente, un verdadero servicio. Lo que se supone que tienes que hacer ahora es obtenerla de `Request`.

Así que no hay problema. Elimina el argumento del constructor `SessionInterface`... y tampoco necesitamos ya esta declaración `use` 

[[[ code('2152a23e26') ]]]

Ahora busca "sesión". La usamos en `onAuthenticationSuccess()`. 
Afortunadamente, ¡esto ya nos pasa el objeto`$request`! 
Así que podemos decir simplemente `$request->getSession()`.

[[[ code('0bd37f4dab') ]]]

## Buscando las últimas desapariciones

¡Ya está! Entonces... ¿lo hemos conseguido? ¿Hemos conseguido cero depreciaciones y la iluminación espiritual? Vuelve a la página de inicio, actualiza y... ¡lo hemos conseguido! Bueno, al menos la primera parte... ¡sin depreciaciones! Y si navegamos un poco por nuestro sitio... ¡no veo ninguna deprecación en ninguna de estas páginas!

¿Significa esto que hemos terminado? Bueno, hemos comprobado manualmente todas las páginas en las que podemos hacer clic. Pero ¿qué pasa con las peticiones de `POST`... como el envío de los formularios de inicio de sesión o de registro? ¿Y qué pasa con las rutas de la API? Tenemos uno llamado`/api/me`... que no funciona porque no estoy conectado. Vuelve a entrar como "abraca_admin@example.com" con la contraseña "tada" y entonces... sí, `/api/me` funciona.

No podemos ver la barra de herramientas de depuración de la web para esta petición, pero seguro que ya conoces el truco. Ve a `/_profiler` para ver las diez últimas peticiones. Aquí está la petición de `POST`a `/login`. Baja a Registros. ¡Genial! Eso no tenía depreciaciones. Vuelve y comprueba también la ruta de la API. Si volvemos a mirar los registros, tampoco había desaprobaciones. ¡Estamos de enhorabuena!

Otra opción, en lugar de comprobar el perfilador todo el tiempo, es ir a tu terminal y seguir el archivo de registro:

```terminal
tail -f var/log/dev.log
```

De este modo, se transmitirá constantemente cualquier registro nuevo. En realidad, pulsa "ctrl" + "C" y ejecuta eso de nuevo, pero grep para `deprecation`:

```terminal-silent
tail -f var/log/dev.log | grep deprecation
```

Perfecto. Ahora, si llega algún registro que contenga la palabra "deprecación", lo veremos. Y como las rutas de código desaprobadas activan un registro en el entorno `dev`, ésta es una poderosa herramienta.

## Método $this->getDoctrine() obsoleto

Por ejemplo, vamos a registrarnos como nuevo usuario. Voy a cerrar la sesión, y luego a "Registrarme". Me pide mi nombre, mi correo electrónico y una contraseña. Haz clic en "Aceptar" unas condiciones inventadas y envíalo. Oh, mi contraseña es demasiado corta: ¡mis propias reglas de validación vuelven a perseguirme! Arregla eso, pulsa "Registrarse" de nuevo y... ¡funciona!

Pero si volvemos a nuestro terminal... ¡rut roo!

> Desde symfony/framework-bundle 5.4, el método `AbstractController::getDoctrine()`
> está obsoleto. Inyecta una instancia de `ManagerRegistry` en tu controlador en su lugar.

No es fácil ver de dónde viene esto en nuestro código, pero acabamos de registrarnos... así que abramos `RegistrationController`. Ah, aquí se queja de esto: el método `getDoctrine()` está obsoleto.

En lugar de utilizarlo, podemos inyectar el método `$entityManager`. Al final de la lista de argumentos, autowire `EntityManagerInterface $entityManager`. Y... luego aquí abajo, borra esta línea porque ahora se inyecta `$entityManager`. ¡Otra deprecación desaparecida!

[[[ code('cce454fa67') ]]]

## Registrar las depreciaciones en producción

¿Ya hemos terminado? Probablemente. Nuestro proyecto es bastante pequeño, así que comprobar todas las páginas manualmente no es un gran problema. Pero para proyectos más grandes, podría ser... ¡un gran problema comprobarlo todo manualmente! Y realmente quieres estar seguro de que no te has dejado nada antes de actualizar.

Una gran opción para asegurarte de que no se te ha escapado nada es registrar tus depreciaciones en producción. Abre `config/packages/monolog.yaml` y baja a `when@prod`. Esto tiene una serie de manejadores que registrarán todos los errores en `php://stderr`. También hay una sección `deprecation`. Con esta configuración, Symfony registrará cualquier mensaje de depreciación (eso es lo que significa este `channels: [deprecation]` ) en `php://stderr`.

[[[ code('d0647f8722') ]]]

Esto significa que puedes desplegar, esperar una hora, un día o una semana, y luego... ¡consultar el registro! Si en cambio quieres registrar en un archivo, cambia la ruta a algo como`%kernel.logs_dir%/deprecations.log`.

Así que eso es lo que más me gusta hacer: desplegarlo, y luego ver -en el mundo real- si alguien sigue o no dando con las rutas de código obsoletas.

En este momento, no veo más desaprobaciones en nuestra barra de herramientas de depuración web, así que creo que hemos terminado ¡Y eso significa que estamos listos para Symfony 6! ¡Hagamos la actualización a continuación!
