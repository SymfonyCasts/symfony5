# 2fa con TOTP (Time-Based One Time Password)

Puede que aún no lo parezca, pero el paquete ya está configurado... excepto por una gran pieza que falta: ¿cómo queremos que nuestros usuarios obtengan el token temporal que introducirán en el formulario?

En los documentos, hay 3 opciones... bueno, sólo 2. Las dos primeras consisten en utilizar una aplicación de autentificación, como Google Authenticator o Authy. La otra opción es enviar el código por correo electrónico.

Vamos a utilizar esta autenticación "totp", que es básicamente lo mismo que el autenticador de Google y significa "contraseña de un solo uso basada en el tiempo".

La lógica para esto vive en realidad en una biblioteca separada. Copia la línea requerida por Composer, busca tu terminal y pégala:

```terminal
composer require "scheb/2fa-totp:^5.13"
```

Esta vez no hay ninguna receta ni nada extravagante: simplemente se instala la biblioteca. A continuación, si vuelves a la documentación, tenemos que habilitar esto como método de autenticación dentro del archivo de configuración. Eso está en `config/packages/scheb_2fa.yaml`. Pégalo en la parte inferior:

[[[ code('07da8ee239') ]]]

## Implementación de TwoFactorInterface

El último paso, si miras la documentación, es hacer que nuestro `User`implemente un `TwoFactorInterface`. Abre nuestra clase de usuario: `src/Entity/User.php`, añade `TwoFactorInterface`:

[[[ code('8dd345887d') ]]]

Luego dirígete a la parte inferior. Ahora ve al menú "Código"->"Generar" -o`Command`+`N` en un Mac- y elige implementar métodos para generar los 3 que necesitamos:

[[[ code('780611284e') ]]]

Hermoso. Así es como funciona la autenticación TOTP. Cada usuario que decida activar la autenticación de dos factores para su cuenta tendrá un secreto TOTP -una cadena aleatoria- almacenado en una propiedad. Ésta se utilizará para validar el código y servirá para ayudar al usuario a configurar su aplicación de autenticación cuando active por primera vez la autenticación de dos factores.

Los métodos de la interfaz son bastante sencillos.`isTotpAuthenticationEnabled()` devuelve si el usuario ha activado o no la autenticación de dos factores... y podemos comprobar simplemente si la propiedad está establecida. El método`getTotpAuthenticationUsername()` se utiliza para ayudar a generar algo de información sobre el código QR. El último método - `getTotpAuthenticationConfiguration()` - es el más interesante: determina cómo se generan los códigos, incluyendo el número de dígitos y la duración de cada uno. Normalmente, las aplicaciones de autenticación generan un nuevo código cada 30 segundos.

Copia la propiedad `$totpSecret`, desplázate hasta las propiedades de nuestra clase y pégala:

[[[ code('3b2a6c09f2') ]]]

Luego vuelve a la parte inferior y utiliza el menú "Código"->"Generar" para generar un getter y un setter para esto. Pero podemos hacerlo más bonito: dale al argumento un tipo de cadena anulable, un tipo de retorno `self` y devuelve `$this`... porque el resto de nuestros establecedores son "fluidos" como éste:

[[[ code('460433c71f') ]]]

Para el getter... vamos a eliminarlo por completo. No lo vamos a necesitar... y es un valor algo sensible.

Vamos a rellenar los tres métodos. Robaré el código del primero... y lo pegaré:

[[[ code('78c19377b5') ]]]

Para el nombre de usuario, en nuestro caso, devuelve `$this->getUserIdentifier()`, que en realidad es nuestro correo electrónico:

[[[ code('0bd9391389') ]]]

Para el último método, copia la configuración de los documentos... y pega:

[[[ code('cad44e1d9e') ]]]

Vuelvo a escribir el final de `TotpConfiguration` y pulso el tabulador para que PhpStorm añada la declaración `use` encima:

[[[ code('bab3f6be02') ]]]

Pero, ten cuidado. Cambia el 20 por el 30, y el 8 por el 6:

[[[ code('904e73d993') ]]]

Esto dice que cada código debe durar 30 segundos y contener 6 dígitos. La razón por la que utilizo estos valores exactos -incluyendo el algoritmo- es para dar soporte a la aplicación Google Authenticator. Otras aplicaciones, aparentemente, te permiten ajustar estos valores, pero Google Authenticator no lo hace. Así que, si quieres apoyar a Google Authenticator, quédate con esta configuración.

Bien, ¡nuestro sistema de usuarios está listo! En teoría, si estableciéramos un valor `totpSecret` para uno de nuestros usuarios en la base de datos, y luego intentáramos iniciar sesión como ese usuario, seríamos redirigidos al formulario "introduce tu código". Pero, nos falta un paso.

Siguiente: vamos a añadir una forma de que un usuario active la autenticación de dos factores en su cuenta. Cuando lo haga, generaremos un `totpSecret` y, lo que es más importante, lo utilizaremos para mostrar un código QR que el usuario puede escanear para configurar su aplicación de autenticación.
