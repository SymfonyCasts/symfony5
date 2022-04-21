# Personalizar el formulario de autenticación de dos factores

Acabamos de iniciar la sesión con éxito utilizando la autenticación de dos factores. ¡Guau! Pero el formulario en el que hemos introducido el código era feo. ¡Es hora de arreglarlo! Cierra la sesión... y vuelve a entrar... con nuestro correo electrónico habitual... y la contraseña `tada`. Este es nuestro feo formulario.

¿Cómo podemos personalizarlo? Bueno, la maravillosa documentación, por supuesto, podría decírnoslo. Pero vamos a ser intrigantes y ver si podemos descubrirlo por nosotros mismos. Busca tu terminal y carga la configuración actual de este paquete:`symfony console debug:config`... y luego, busca el archivo de configuración, copia la clave raíz - `scheb_two_factor` - y pégala.

```terminal-silent
symfony console debug:config scheb_two_factor
```

¡Genial! Vemos `security_tokens` con `UsernamePasswordToken`... eso no es ninguna sorpresa porque es lo que tenemos aquí. Pero esto también nos muestra algunos valores por defecto que no hemos configurado específicamente. El que nos interesa es `template`. Esta es la plantilla que se renderiza actualmente para mostrar la página de dos factores "introduce el código".

## Anulando la plantilla

Vamos a comprobarlo. Copia la mayor parte del nombre del archivo, pulsa `Shift`+`Shift`, pega y... ¡aquí está! No es demasiado complejo: tenemos una variable `authenticationError` que muestra un mensaje si escribimos un código no válido.

Entonces... básicamente tenemos un formulario con una acción establecida en la ruta de envío correcta, una entrada y un botón.

Para personalizar esto, baja al directorio `templates/security/` y crea un nuevo archivo llamado, qué tal, `2fa_form.html.twig`. Pondré una estructura para empezar:

[[[ code('43bb31d012') ]]]

Esto extiende `base.html.twig`... pero todavía no hay nada dinámico: el formulario es un gran TODO.

Así que, obviamente, esto no está hecho... pero, ¡intentemos usarlo de todos modos! De nuevo en`config/packages/scheb_2fa.yaml`, bajo `totp`, añade `template` ajustado a`security/2fa_form.html.twig`:

[[[ code('b31dd9d788') ]]]

De vuelta al navegador, actualiza y... ¡sí! ¡Esa es nuestra plantilla!

Ah, y ahora que esto renderiza una página HTML completa, tenemos de nuevo nuestra barra de herramientas de depuración web. Pasa el ratón por encima del icono de seguridad para ver una cosa interesante. Estamos, más o menos, autentificados, pero con este `TwoFactorToken` especial. Y si te fijas, no tenemos ningún rol. Por lo tanto, estamos como conectados, pero sin ningún rol.

Y además, el paquete de dos factores ejecuta un escuchador al inicio de cada petición que garantiza que el usuario no puede intentar navegar por el sitio en este estado de media sesión: detiene todas las peticiones y las redirige a esta URL. Y si se desplaza hacia abajo, incluso en esta página, todas las comprobaciones de seguridad devuelven el ACCESO DENEGADO. El paquete de dos factores se engancha al sistema de seguridad para provocar esto.

De todos modos, vamos a rellenar la parte del formulario TODO. Para ello, copia toda la plantilla del núcleo, y pégala sobre nuestro TODO:

[[[ code('44c21c48fa') ]]]

Ahora... es cuestión de personalizar esto. Cambia el error `p` por un `div`con `class="alert alert-error"`. Eso debería ser `alert-danger`... Lo arreglaré en un momento. A continuación, voy a eliminar los enlaces para autenticar de forma diferente porque sólo soportamos totp. Para el `input` necesitamos`class="form-control"`. Luego, aquí abajo, dejaré estas secciones `displayTrusted`y `isCsrfProtectionEnabled`... aunque no las estoy usando. Puedes activarlas en la configuración. Por último, quita el `p` alrededor del botón, cámbialo por un`button` -me gustan más-, pon el texto dentro de la etiqueta... y luego añádele unas cuantas clases.

Ah, y también voy a mover el enlace "Cerrar sesión" un poco hacia arriba... limpiarlo un poco... y añadir algunas clases adicionales:

[[[ code('fcb4207684') ]]]

¡Uf! Con un poco de suerte, eso debería hacer que se vea bastante bien. Refresca y... ¡qué bien! Bah, excepto por una pequeña cita extra en mi "Inicio de sesión". Siempre hago eso. Ya está, se ve mejor:

[[[ code('27a73edc89') ]]]

Si escribimos un código no válido... ¡error! Ah, pero no es rojo... la clase debería ser `alert-danger`. ¡Por eso probamos las cosas! Y ahora... esto es mejor:

[[[ code('8171648715') ]]]

Si escribimos un código válido desde mi aplicación Authy, ¡lo tenemos! ¡Misión cumplida!

Además, aunque no hablemos de ellos, el paquete de dos factores también admite "códigos de respaldo" y "dispositivos de confianza", en los que un usuario puede elegir omitir la futura autenticación de dos factores en un dispositivo específico. Consulta la documentación para conocer los detalles.

Y... ¡lo hemos conseguido! ¡Enhorabuena por tu increíble trabajo! Se supone que la seguridad es un tema árido y aburrido, pero a mí me encanta este tema. Espero que hayas disfrutado del viaje tanto como yo. Si hay algo que no hayamos cubierto o todavía tienes algunas preguntas, estamos aquí para ti en la sección de comentarios.

Muy bien amigos, ¡hasta la próxima!
