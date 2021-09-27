# Rutas, Controladores & Respuestas!

La página que estamos viendo ahora... la cual es súper divertida... e incluso cambia 
de color... está aquí *solo* para decir "Hola!". Symfony muestra está página porque, 
en realidad, nuestra aplicación aun no tiene *ninguna* página. Cambiemos eso.

## Ruta + Controlador = Página

Cada framework web... en *cualquier* lenguaje... tiene la misma labor principal: brindarte
un sistema de ruteo -> controlador: un sistema de dos pasos para construir páginas. La 
ruta define la URL de la página y en él controlador es donde escribimos código PHP para 
*construir* esa página, como HTML ó JSON.

Abre `config/routes.yaml`: 

[[[ code('4ab87bc059') ]]]

Mira! ya tenemos un ejemplo! Descomentarízalo. Si no te es familiar el formato YAML, es 
súper amigable: es un formato de configuración tipo llave-valor que se separa mediante 
dos puntos. La identación también es importante.

Esto crea una simple ruta donde la URL es `/`. El controlador apunta a una *función* que va 
a *construir* esta página... en realidad, esto apunta a un método de una clase. En general, 
esta ruta dice:

> cuando el usuario vaya a la homepage, por favor ejecuta el método `index`
> de la clase DefaultController.

Ah, y puedes ignorar esa llave `index` que está al principio del archivo: es solo el 
nombre interno de la ruta... y aun no es importante.

## Nuestra Aplicación

El proyecto que estamos construyendo se llama "Cauldron Overflow". *Originalmente* 
queríamos crear un sitio donde los desarrolladores puedan hacer preguntas y otros 
desarrolladores pudieran responderlas pero... alguien ya nos ganó... hace como... 
unos 10 años. Así como cualquier otro impresionante startup, estamos pivoteando!
Hemos notado que muchos magos accidentalmente se han hecho explotar... o invocan 
dragones que exhalan fuego cuando en realidad querían crear una pequeña fogata para 
azar malvaviscos. Así que... Cauldron Overflow está aquí para convertirse en *el* lugar
donde magos y hechiceros pueden preguntar y responder sobre desventuras mágicas.

## Creando un Controlador

En la homepage, eventualmente vamos a listar algunas de las preguntas más recientes.
Así que vamos a cambiar la clase del controlador a `QuestionController` y el método 
a `homepage`.

[[[ code('b54cc0bccb') ]]]

Ok, la ruta está lista: define la URL y apunta al controlador que va a construir 
la página. Ahora... necesitamos crear ese controlador! Dentro del directorio `src/` 
ya existe el directorio `Controller/` pero está vacío. Haré click derecho aquí y 
seleccionaré "Nueva clase PHP". Llamalo `QuestionController`.

## Namespaces y el Directorio src/

Ooh, mira esto. El *namespace* ya está ahí! Sorprendente! Esto es gracias a la 
configuración de Composer en el PhpStorm que agregamos en el último capítulo.

Así está la cosa: cada clase que creamos dentro del directorio `src/` va a requerir 
un namespace. Y... por alguna razón que no es muy importante, el namespace debe iniciar 
con `App\` y continuar con el nombre del directorio donde vive el archivo. Como estamos 
creando este archivo dentro del directorio `Controller/`, su namespace debe ser 
`App\Controller.` PhpStorm va a autocompletar esto siempre.

[[[ code('7dbf5d18ac') ]]]

Perfecto! Ahora, porque en `routes.yaml` decidimos nombrar al método `homepage`, crealo 
aquí: `public function homepage()`.

Perfect! Now, because in `routes.yaml` we decided to call the method `homepage`,
create that here: `public function homepage()`.

[[[ code('a74e0fbea7') ]]]

## Los Controladores Deben Regresar Una Respuesta

Y... felicitaciones! Estás dentro de una función del controlador, el cual algunas veces 
es llamado "acción"... solo para confundirnos. Nuestro trabajo aquí es simple: construir 
esa página. Podemos escribir `cualquier` código para hacerlo - como ejecutar queries en la 
base de datos, cachear cosas, realizar llamados a APIs, minar criptomonedas... lo que sea. 
La `única` regla es que la función del controlador `debe` regresar un objeto del tipo Symfony 
`Response`.

Escribe `return new Response()`. PhpStorm intenta autocompletar esto... pero existen 
multiples clases `Response` en nuestra app. La que queremos es la 
`Symfony\Component\HttpFoundation`. HttpFoundation es una de las partes - o "componentes" - más 
importantes en Symfony. Presiona tab para autocompletarlo.

Pero detente! Viste eso? Como dejamos que PhpStorm autocompletara esa clase por nosotros, 
escribió `Response`, pero *también* agregó la *declaración* de esa clase al principio del 
archivo! Esa es una de las *mejores* funciones de PhpStorm y lo utilizaré *bastante*. 
Me verás *constantemente* escribir una clase y dejar que PhpStorm la autocomplete. 
Para que agregue la *declaración* en el archivo por mi.

Dentro de `new Response()`, agrega algo de texto:

> Pero qué controlador tan embrujado hemos conjurado!

[[[ code('b1af94625a') ]]]

Y... listo! Acabamos de crear nuestra primera página! Vamos a probarla! Cuando vamos a 
la homepage, debería ejecutar nuestra función del controlador... la cual regresa el mensaje.

Encuentra tu navegador. Ya estamos en la homepage... así que solo refresca. Saluda a nuestra 
*primerísima* página. Lo sé, no hay mucho que ver aun, pero acabamos de cubrir la parte más 
*fundamental* de Symfony: el sistema ruta-controlador.

A continuación, hagamos nuestra ruta más elegante al usar algo llamado anotaciones. También 
vamos a crear una segunda página con una ruta que utiliza *comodines*.
