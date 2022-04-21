# Datos QR y escaneo con una aplicación de autenticación

Bien, comprobación de estado. Cualquier usuario puede activar la autenticación de dos factores en su cuenta haciendo clic en este enlace. Entre bastidores, cuando lo hacen, rellenamos el `totpSecret` en el objeto `User`, lo guardamos en la base de datos y, a continuación, mostramos un código QR que el usuario puede escanear. Este código QR es una imagen elegante que contiene dos datos. La primera es el correo electrónico de nuestro usuario. O, más concretamente, si me desplazo hasta los "métodos totp" en `User`, contiene lo que devolvemos de`getTotpAuthenticationUsername()`:

[[[ code('f509a0deeb') ]]]

Lo segundo que contiene la imagen del código QR es el `totpSecret`. En un minuto, voy a escanear este código con una aplicación de autenticación, que me permitirá generar el código correcto de autenticación de dos factores que necesitaré para iniciar la sesión. Lo hace aprovechando ese secreto.

## Añadir información adicional al código QR

Pero primero, hay algo de información extra que podemos añadir al código QR. Dirígete a `config/packages/scheb_2fa.yaml`. En `totp:`, una de las cosas más importantes que puedes añadir se llama `issuer`. Voy a ponerlo en `Cauldron Overflow`:

[[[ code('e9821d2ec8') ]]]

Eso, literalmente, acaba de añadir nueva información a la imagen del código QR. Observa la imagen cuando la actualizamos. ¿Lo ves? ¡Ha cambiado!

Gracias a esto, además de los `email` y `totpSecret`, el código contiene ahora una clave de "emisor". Si quieres conocer toda la información extra que puedes poner aquí, consulta la documentación o lee sobre la autenticación totp en general. Porque, por ejemplo, "emisor" no es más que un "concepto totp"... que ayuda a las apps autenticadoras a generar una etiqueta para nuestro sitio cuando escaneamos este código.

## Escaneando con nuestra aplicación autenticadora

Llegados a este punto, quiero fingir que somos un usuario real y probar todo el flujo. Si fuéramos un usuario real, sacaríamos nuestro teléfono, abriríamos una app autentificadora -como Google authenticator o Authy- y escanearíamos este código.

A mí me gusta usar Authy, así es como se ve para mí. Agrego una nueva cuenta, escaneo y... ¡ya está! Lee mi correo electrónico y el "emisor" del código QR y sugiere un nombre y un logotipo. Si tu empresa es conocida, es posible que adivine el logotipo correcto, pero también puedes añadir un `image` a tu código QR de la misma manera que hemos añadido el "emisor". Cuando acepto esto, ¡me da los códigos!

## Iniciando la sesión

¡Así que ya estamos listos! ¡Vamos a probarlo! Cierra la sesión... y vuelve a entrar con`abraca_admin@example.com`, contraseña `tada`. Envía y... ¡muy bien! En lugar de iniciar la sesión, se nos redirige a la página de autenticación de dos factores Esto ocurre por dos razones. En primer lugar, el usuario tiene activada la autenticación de dos factores en su cuenta. Concretamente, este método `isTotpAuthenticationEnabled()` devolvió true. En segundo lugar, el "token" de seguridad -esa cosa interna que envuelve a tu objeto`User` cuando te conectas- coincide con uno de los tokens de nuestra configuración. En concreto, obtenemos el `UsernamePasswordToken` cuando nos conectamos a través del mecanismo `form_login`.

Si intentamos ir a cualquier otro lugar del sitio, nos devuelve aquí. El único lugar al que podemos ir es `/logout` si queremos cancelar el proceso. Esto se debe a que el paquete de dos factores ahora denegará el acceso a cualquier página de nuestro sitio a menos que lo hayas permitido explícitamente a través de las reglas de `access_control`, como hicimos para`/logout` y para la URL que muestra este formulario. Este formulario es feo, pero lo arreglaremos pronto.

Bien, volvamos a fingir que soy un usuario real. Abriré mi aplicación de autentificación, teclearé un código válido: 5, 3, 9, 9, 2, 2 y... ¡ya está! ¡Ya hemos iniciado la sesión! ¡Qué bien!

A continuación, vamos a personalizar ese formulario de autenticación de dos factores... porque era feo.
