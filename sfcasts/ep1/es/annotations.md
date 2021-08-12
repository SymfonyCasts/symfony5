# Anotaciones y Rutas con Comodín

Es muy sencillo crear una ruta en YAML que apunte a una función del controlador. Pero
hay una forma aun más *simple* de crear rutas... y me *encanta*. Se llama:
anotaciones.

Primero, comenta la ruta en YAML. Básicamente, borrala. Para comprobar que no
funciona, refresca la homepage. Asi es! Regresó a la página de bienvenida.

[[[ code('6249b6bc32') ]]]

## Instalación Soporte a Anotaciones

Las anotaciones son un formato especial de configuración y el soporte a anotaciones *
no* es un standard en nuestra pequeña aplicación de Symfony. Y... eso está bien! De
hecho, esa es *toda* la filosofía de Symfony: empieza pequeño y agrega
funcionalidades cuando las necesites.

Para agregar soporte a anotaciones, vamos a utilizar Composer para requerir una nueva
librería. Si aun no tienes Composer instalado, ve a https://getcomposer.org.

Una vez que lo *instales*, corre:

```terminal
composer require annotations
```

Si estás familiarizado con Composer, el nombre de la librería se te ha de hacer
extraño. Y en realidad, instaló una librería totalmente *diferente*:
`sensio/framework-extra-bundle`. Casi al final del comando, menciona algo sobre dos
recetas. Hablaremos sobre ello próximamente: es parte de lo que hace especial a
Symfony.

## Agregando Rutas con Anotaciones

En fin, ya que el soporte a anotaciones está instalado, podemos agregar de vuelta
nuestra ruta usando anotaciones. Que significa eso? Arriba de la función del
controlador, escribe `/**` y presiona enter para crear una sección PHPDoc Luego
escribe `@Route` y autocompleta la del componente Routing. Tal como la otra vez,
PhpStorm agregó automáticamente el `use` statement en la parte de arriba de la clase.

Dentro de los paréntesis, escribe `"/"`.

[[[ code('8f140f527a') ]]]

Eso es todo! Cuando el usuario vaya a la homepage, se va a ejecutar la función abajo
de esto. Me *encantan* las anotaciones porque son simples de leer y mantienen la ruta
y controlador uno junto del otro. Y si... las anotaciones son
*literalmente* configuración dentro de comentarios de PHP. Si no te gustan, siempre
puedes utilizar YAML o XML: Symfony es super flexible. Desde el punto de vista del
rendimiento, todos los formatos son lo mismo.

Ahora cuando refrescamos la homepage... estamos de vuelta!

## Una Segunda Ruta y Controlador

Esta página eventualmente va a listar algunas preguntas recientes. Cuando le das
click a una pregunta en específico, necesitará su *propia* página. Vamos a crear una
segunda ruta y controlador para ello. Como? creando un segundo metodo. Que
tal: `public function show()`.

[[[ code('fe1ec280ee') ]]]

Arriba de esto, agrega `@Route()` y asigna la URL a, que te parece,
`/questions/how-to-tie-my-shoes-with-magic`. Eso seria grandioso!

[[[ code('6a6c0c73d5') ]]]

Adentro, justo como la última vez, retorna una nueva *respuesta*: la
de `HttpFoundation.`

> La página futura para mostrar preguntas

[[[ code('7b17b4ef63') ]]]

Vamos a probarla! Copia la URL, ve a tu navegador, pega y... funciona! Acabamos de
crear una *segunda* página... en menos de un minuto.

## El Controlador Frontal: Trabajando Detrás De Cámaras

Por cierto, no importa a cual URL vayamos - como esta o la homepage - el archivo PHP
que nuestro servidor web ejecuta es `index.php`. Es como *si* fuéramos a
`/index.php/questions /how-to-tie-my-shoes-with-magic`. La única razón por la que
no *necesitas* escribir `index.php` en la URL es porque nuestro servidor web local
está configurado para ejecutar `index.php` automáticamente. En producción, tu
configuración de Nginx o Apache debe de hacer lo mismo. Revisa la documentación de
Symfony para aprender como hacerlo.

## Rutas con Comodín

Eventualmente, vamos a tener una base de datos *llena* de preguntas. Y entonces,
no, *no* vamos a crear manualmente una ruta por cada pregunta. En su lugar, podemos
hacer más inteligente esta ruta. Reemplaza la parte
`how-to-tie-my-shoes-with-magic` por `{slug}`.

Cuando pones algo entre llaves dentro de una ruta, se convierte en *comodín*. Esta
ruta ahora aplica a `/questions/LO-QUE-SEA`. El nombre `{slug}` no es importante:
pudimos haber puesto lo que sea... por ejemplo `{slugulusErectus}`! No hace ninguna
diferencia.

Pero, *como sea* que llamemos a este comodín - ejemplo `{slug}` - ahora nos
*permite* tener un argumento en nuestro controlador con el mismo *nombre*: `$slug`...
el cual será asignado con el valor de esa parte de la URL.

[[[ code('d16dfb89a7') ]]]

Utilicemoslo para hacer mas elegante a nuestra página! Usemos `sprintf()`, escribe "
la pregunta" y agrega `%s` como comodín. Pasa `$slug` como comodín.

[[[ code('4b1f6f7659') ]]]

Bien! Cambia al navegador, refresca y... me encanta! Cambia la URL
a `/questions /accidentally-turned-cat-into-furry-shoes` y... eso también funciona!

En el futuro, vamos a utilizar el `$slug` para extraer la pregunta de la base de
datos. Pero como aun no llegamos ahí, usaré `str_replace()` ... y `ucwords()` *solo*
para hacerlo un poco mas elegante. Aun es pronto, pero la página ya *comienza* a
estar viva!

[[[ code('497e56f24a') ]]]

A continuación, nuestra aplicación esconde un secreto! Una pequeña línea de comandos
ejecutable que está *llena* de beneficios.
