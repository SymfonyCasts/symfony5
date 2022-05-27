# Mejoras en los formularios de Symfony 6

¡Vamos a explorar algunas nuevas características! Hay montones de ellas, y ya hemos visto un montón. No tengo tiempo para mostrar todo, pero afortunadamente, ¡no lo necesito! Si vas a https://symfony.com/blog, las novedades están muy bien documentadas. Haz clic en "Vivir al límite". Aquí puedes ver las entradas del blog que están clasificadas por cada versión. Esta es una colección de entradas de blog sobre las novedades de Symfony 5.1, como el nuevo sistema de seguridad. Y... aquí hay posts sobre las novedades de Symfony 5.3, o de la 5.4 a la 6.0. Así que si quieres profundizar y ver todas las novedades, están muy bien documentadas en estos posts.

Las nuevas características que quiero mostrar ahora mismo tienen que ver con el componente del formulario.

## Ordenación de los campos del formulario

Desde Symfony 5.3, tenemos una nueva y bonita característica llamada Ordenación de Campos de Formulario. Si vas a la página de registro, ésta muestra cuatro campos. Abramos la plantilla para ello:`templates/registration/register.html.twig`. Estoy renderizando todos los campos a mano. Reemplacemos esto por el muy perezoso `{{ form_widget(registrationForm) }}`... que simplemente vuelca todos los campos en el orden en que se añaden.

[[[ code('a50b830724') ]]]

Por desgracia... ahora el formulario... tiene un aspecto extraño. Para solucionarlo, abre la clase del tipo de formulario, que es `src/Form/RegistrationFormType.php`. Cada campo tiene ahora una opción llamada `priority`. Vamos a añadirla.

Empezando por `firstName`, pasa `null` por el tipo para que Symfony siga adivinando. Luego, pon `priority` a `4`, porque quiero que sea el primer campo. `email` debe ser el segundo campo, así que pasa `null` de nuevo y pon `priority` a `3`. Luego pon`plainPassword` a `priority` de `2`... y finalmente pon `agreeTerms` a `priority``1` .

[[[ code('1faae474c8') ]]]

Y ahora... ¡se ve muy bien! Así que si quieres renderizar perezosamente tus campos, puedes hacerlo... y no tener que preocuparte de que estén en un orden extraño.

## Hola renderForm()

Ya que estamos hablando de formularios, abre el controlador de esta página:`src/Controller/RegistrationController.php`. En Symfony 5.3, cuando renderizas una plantilla y pasas un formulario, ¡hay un nuevo atajo! En lugar de `render()` di`renderForm()`. La única otra diferencia es que puedes eliminar la llamada a`->createView()`.

[[[ code('fcdc601d94') ]]]

Eso es todo! este método `renderForm()` es igual que `render()`. Sigue renderizando esta plantilla, y sigue pasando cualquiera de estas variables a la plantilla. Pero si alguna de las variables que pasamos es un objeto "formulario", llama al método `createView()` por nosotros... ¡lo cual está bien!

Esto también supone otro cambio, que no es muy perceptible. Si tienes un error de validación, tu controlador devolverá ahora una respuesta con el código de estado 422. Pero eso no se verá diferente en tu navegador. Si envío una contraseña demasiado corta, todo se ve igual... aunque el código de estado es ahora 422.

Symfony hizo este cambio por dos razones. Primero... es técnicamente más correcto tener un código de estado de error si hay un error de validación. Y segundo, si usas Turbo, esto es necesario para que Turbo sepa que la validación de tu formulario ha fallado. Lo consigues gratis simplemente usando el nuevo método abreviado.

A continuación, Symfony viene con una bonita y opcional integración con Docker para el desarrollo local. Algunas partes de esta integración han cambiado recientemente. Veamos cómo podemos utilizar Docker para añadir a nuestra aplicación un sistema de captura de correos electrónicos que nos ayudará a probarlos.
