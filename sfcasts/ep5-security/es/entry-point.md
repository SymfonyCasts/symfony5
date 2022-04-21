# El punto de entrada: invitar a los usuarios a conectarse

Vuelve a entrar utilizando `abraca_admin@example.com` y la contraseña `tada`. Cuando vamos a`/admin`, como hemos visto antes, obtenemos "Acceso denegado". Esto se debe a la`access_control`... y al hecho de que nuestro usuario no tiene `ROLE_ADMIN`.

Pero si lo cambiamos por `ROLE_USER` -un rol que sí tenemos-, el acceso está garantizado:

[[[ code('7b8ce90256') ]]]

Y conseguimos ver unos gráficos impresionantes.

Probemos una cosa más. Cerremos la sesión, es decir, vayamos manualmente a `/logout`. Ahora que no hemos iniciado la sesión, si vamos directamente a `/admin`: ¿qué debería ocurrir?

Bueno, en este momento, obtenemos una gran página de error con un código de estado 401. Pero... ¡eso no es lo que queremos! Si un usuario anónimo intenta acceder a una página protegida de nuestro sitio, en lugar de un error, queremos ser súper amables e invitarle a iniciar la sesión. Como tenemos un formulario de entrada, significa que queremos redirigir al usuario a la página de entrada.

## ¡Hola punto de entrada!

Para saber qué hacer cuando un usuario anónimo accede a una página protegida, cada cortafuegos define algo llamado "punto de entrada". El punto de entrada de un cortafuegos es literalmente una función que dice

> ¡Esto es lo que debemos hacer cuando un usuario anónimo intenta acceder a una página protegida!

Cada autentificador de nuestro cortafuegos puede o no "proporcionar" un punto de entrada. Ahora mismo, tenemos dos autentificadores: nuestro `LoginFormAuthenticator` personalizado y también el autentificador `remember_me`:

[[[ code('ddd3325d0c') ]]]

Pero ninguno de ellos proporciona un punto de entrada, por lo que, en lugar de redirigir al usuario a una página... o algo diferente, obtenemos este error genérico 401. Algunos autenticadores incorporados -como `form_login`, del que hablaremos pronto- sí proporcionan un punto de entrada... y lo veremos.

## Hacer de nuestro autentificador un punto de entrada

Pero, de todos modos, ninguno de nuestros autenticadores proporciona un punto de entrada... ¡así que vamos a añadir uno!

Abre nuestro autentificador: `src/Security/LoginFormAuthenticator.php`. Si quieres que tu autentificador proporcione un punto de entrada, todo lo que tienes que hacer es implementar una nueva interfaz: `AuthenticationEntryPointInterface`:

[[[ code('f9a465e3b4') ]]]

Esto requiere que la clase tenga un nuevo método... que en realidad ya tenemos aquí abajo. Se llama `start()`. Descomenta el método. Luego, dentro, muy simplemente, vamos a redirigir a la página de inicio de sesión. Voy a robar el código de arriba:

[[[ code('23f0197632') ]]]

¡Y listo!

En cuanto un autentificador implemente esta interfaz, el sistema de seguridad lo notará y empezará a utilizarlo. Literalmente, si un usuario anónimo intenta acceder a una página protegida, ahora llamará a nuestro método `start()`... y le redirigiremos a la página de inicio de sesión.

Observa: ¡refresca! ¡Bum! Nos lleva a la página de inicio de sesión.

## Un cortafuegos tiene exactamente UN punto de entrada

Pero hay una cosa importante que hay que entender sobre los puntos de entrada. Cada cortafuegos sólo puede tener uno. Piensa que en el momento en que entramos en `/admin` como usuario anónimo.... no estamos intentando entrar a través de un formulario de acceso... o a través de un token de la API. Somos verdaderamente anónimos. Por eso, si tuviéramos varios autentificadores que proporcionaran cada uno un punto de entrada, nuestro cortafuegos no sabría cuál elegir. Necesita un punto de entrada para todos los casos.

Ahora mismo, como sólo uno de nuestros dos autentificadores proporciona un punto de entrada, sabe que debe utilizarlo. Pero, ¿y si no fuera así? Veamos qué pasaría. Busca tu terminal y genera un segundo autentificador personalizado:

```terminal
symfony console make:auth
```

Crea un autentificador vacío... y llámalo `DummyAuthenticator`.

¡Qué bonito! Así se creó una nueva clase llamada `DummyAuthenticator`:

[[[ code('49d1d77f06') ]]]

Y también actualizó `custom_authenticator` en `security.yaml` para utilizar ambas clases personalizadas:

[[[ code('1f3c47ab8b') ]]]

En la nueva clase, dentro de `supports()`, devuelve `false`:

[[[ code('b872859623') ]]]

No... vamos a convertir esto en un autentificador real.

Si nos detuviéramos ahora mismo... e intentáramos ir a `/admin`, seguiría utilizando el punto de entrada de `LoginFormAuthenticator`. Pero ahora implementa`AuthenticationEntryPointInterface`:

[[[ code('9cbad5a26a') ]]]

Y luego baja... y descomenta el método `start()`. Para el cuerpo, sólo `dd()`un mensaje... porque esto no se ejecutará nunca:

[[[ code('b638cf9435') ]]]

Ahora el cortafuegos se dará cuenta de que tenemos dos autentificadores que proporcionan un punto de entrada cada uno. Y así, cuando refresquemos cualquier página, entrará en pánico. El error dice

> ¡Ejecuta por ti liiiiii!

Oh, espera, en realidad dice

> Como tienes varios autentificadores en el cortafuegos "principal", tienes que establecer la
> `entry_point` clave a uno de tus autentificadores.

Y nos dice, de forma muy útil, los dos autentificadores que tenemos. En otras palabras: nos hace elegir.

Copia la clave `entry_point`... y luego, en cualquier lugar del cortafuegos, di`entry_point:` y apunta al servicio `LoginFormAuthenticator`:

[[[ code('272d436b1a') ]]]

Técnicamente podemos apuntar a cualquier servicio que implemente`AuthenticationEntryPointInterface`... pero normalmente lo pongo en mi autentificador.

Ahora... si volvemos a `/admin`.... ¡funciona bien! Sabe que debe elegir el punto de entrada de `LoginFormAuthenticator`.

Hablando de `LoginFormAuthenticator`... um... ¡hemos estado haciendo demasiado trabajo dentro de él! Eso es culpa mía - estamos haciendo las cosas de la manera más difícil para... ya sabes... ¡"aprender"! Pero a continuación, vamos a eliminar eso y aprovechar una clase base de Symfony que nos permitirá eliminar un montón de código. También vamos a aprender algo llamado `TargetPathTrait`: una forma inteligente de redirigir al usuario en caso de éxito.
