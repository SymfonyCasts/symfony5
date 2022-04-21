# Formulario de registro

Vamos a añadir un formulario de registro a nuestro sitio. Los formularios de registro tienen algo curioso: ¡no tienen básicamente nada que ver con la seguridad! Piénsalo: el objetivo de un formulario de registro es simplemente insertar nuevos usuarios en la base de datos. Así que crear un formulario de registro no es realmente diferente de crear un formulario para insertar cualquier dato en tu base de datos.

Y para simplificar aún más las cosas, vamos a hacer trampa... generando código. Busca tu terminal y ejecuta:

```terminal
symfony console make:registration-form
```

¡Ooh! ¡Esto nos da un error! Dice:

> Faltan paquetes: ejecuta `composer require form validator`

En esta serie de Symfony 5, no hemos hablado del componente Formulario. Y eso es en parte porque no ha cambiado mucho desde nuestro tutorial de [Symfony 4](https://symfonycasts.com/screencast/symfony4-forms). No vamos a entrar en demasiados detalles sobre él ahora, pero lo necesitamos para ejecutar este comando. Así que vamos a instalar ambos paquetes:

```terminal
composer require form validator
```

Genial. Cuando termine, ejecuta

```terminal
symfony console make:registration-form
```

de nuevo. ¡Genial! Así que la primera pregunta es:

> ¿Queremos añadir una anotación de validación `@UniqueEntity` a nuestra clase `User` 
> para asegurarnos de que no se crean cuentas duplicadas.

Casi seguro que quieres decir "Sí" para que el usuario reciba un error de validación si introduce un correo electrónico que ya está cogido.

Siguiente:

> ¿Quieres enviar un correo electrónico para verificar la dirección de correo electrónico del usuario después del registro?

Esto lo añadiremos más adelante, pero quiero hacerlo manualmente. Entonces di "No".

> ¿Quieres autentificar automáticamente al usuario tras el registro?

Eso suena genial, pero di "No", porque también vamos a hacerlo manualmente. Lo sé, ¡nos estoy haciendo trabajar! La última pregunta es:

> ¿A qué ruta debe ser redirigido el usuario tras el registro?

Vamos a utilizar nuestra ruta de la página de inicio. Así que esa es la número 16 para mí. Y... ¡listo!

## Comprobando el código generado

Este comando acaba de darnos un `RegistrationController`, un tipo de formulario, y una plantilla que renderiza ese formulario. Vamos a... ¡comprobarlo!

Empieza con el controlador: `src/Controller/RegistrationController.php`:

[[[ code('80844ba36b') ]]]

De nuevo, no vamos a hablar mucho del componente Formulario. Pero, a grandes rasgos, este controlador crea un objeto `User` y luego, al enviarlo, hace un hash de la contraseña simple que se ha enviado y luego guarda el `User`. Esto es exactamente lo mismo que estamos haciendo en nuestros accesorios para crear usuarios: no hay nada especial en esto.

## Arreglar el estilo del formulario

Así que... ¡vamos a ver qué aspecto tiene esto! Dirígete a `/register` para ver... ¡el formulario más feo del mundo! Nosotros... podemos hacerlo mejor. La plantilla de esta página es`registration/register.html.twig`. Ábrela

[[[ code('4990e01f5d') ]]]

y... Voy a añadir un par de divs para darle más estructura. Genial... y luego indentar todo este material del formulario para que esté dentro de ellos... y luego sólo necesitamos 3 divs de cierre en la parte inferior:

[[[ code('68fb0e02f8') ]]]

Genial. Eso no arregla realmente el formulario... pero al menos nuestro feo formulario aparece más o menos en el centro de la página. Oh, pero déjame arreglar mi error tipográfico en el `mt-4`. Y... sí, eso se ve mejor.

Para arreglar el formulario en sí, podemos decirle a Symfony que haga salir el formulario con un marcado que sea compatible con Bootstrap 5. Esto es... una especie de tema para el tutorial del formulario, pero es fácil. Ve a `config/packages/twig.yaml`. Aquí, añade una opción llamada `form_themes`con un nuevo elemento: `boostrap_5_layout.html.twig`:

[[[ code('60a8a4fc2c') ]]]

Pruébalo ahora y... ¡woh! ¡Eso ha supuesto una gran diferencia! Oh, pero déjame añadir una clase más a ese botón de registro... para que no sea invisible: `btn-primary`:

[[[ code('7d6f30ca9a') ]]]

Genial.

Y mientras hacemos que las cosas se vean y funcionen bien, por fin podemos hacer que el botón "Regístrate"... vaya realmente a alguna parte. En `base.html.twig`, busca "Apúntate" - aquí está - pon el `href` en `path()` y apunta a la nueva ruta, que... si nos fijamos... se llama `app_register`:

[[[ code('c9412b5ca4') ]]]

Así que `path('app_register')`:

[[[ code('a121687c21') ]]]

¡Genial!

Esto funcionará ahora si lo probamos. Pero, antes de hacerlo, quiero añadir otra característica a esto. Después de enviar con éxito el formulario de registro, quiero autentificar automáticamente al usuario. ¿Es posible? Por supuesto Hagámoslo a continuación.
