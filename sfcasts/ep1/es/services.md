# Objetos Servicio

En realidad, Symfony tiene dos partes... y acabamos de aprender *una* de ellas.

La primera parte es el sistema ruta-controlador. Y espero que te sientas muy cómodo:
crea una ruta, la ruta ejecuta una función del controlador, regresamos una respuesta.

La *segunda* mitad de Symfony es todo sobre los múltiples "objetos útiles" que flotan
alrededor de Symfony. Por ejemplo, cuando hacemos un render de un template, lo que en
*realidad* hacemos es aprovecharnos del objeto twig y decirle que haga el render. El
método `render()` es solo un atajo para utilizar ese objeto. También existe un objeto
logger, el objeto del caché y muchos otros, como el objeto de la conexión con la base
de datos y un objeto que ayuda a hacer llamados HTTP a otras APIs.

Básicamente... *cada cosa* que Symfony realiza - o *nosotros* - *realmente* es hecha
por uno de estos objetos útiles. Demonios, incluso el *rúter* es un objeto que busca
cuál ruta se empareja con el request actual.

En el mundo de Symfony - bueno, en realidad, en el mundo de programación orientada a
objetos - estos "objetos que hacen algún trabajo" se les otorga un nombre especial:
servicios. Pero no permitas que te confunda: cuando escuches "servicio", solo piensa:

> ¡Hey! Es un objeto que hace algún trabajo - como el objeto logger o
> el objeto que hace consultas a la base de datos.

## Listando Todos los Servicios

Dentro del `CommentController`, vamos a registrar un log. Para hacerlo, necesitamos
el servicio "logger". ¿Cómo lo podemos obtener?

Encuentra tu terminal y corre:

```terminal
php bin/console debug:autowiring
```

Saluda a uno de los comandos *más* importantes de `bin/console`. Esto nos muestra una
lista de *todos* los objetos servicio en nuestra app. Bueno, está bien, estos no
son *todos*: pero *es* una lista que contiene todos los servicios que *probablemente*
necesites.

Incluso en nuestra pequeña app, hay muchas cosas aquí: hay algo llamado
`Psr\Log\LoggerInterface`, hay cosas para el caché y mucho más. Conforme instalamos
más bundles, esta lista va a crecer. Más servicios significa más herramientas.

Para encontrar qué servicio nos permite crear "logs", corre:

```terminal
php bin/console debug:autowiring log
```

Esto retorna un *montón* de cosas... pero ignora todos los de aquí abajo por ahora y
enfocate en la línea de arriba. Esto nos dice que hay un objeto servicio logger y su
clase implementa una `Psr\Log\LoggerInterface`. ¿Por qué es esto importante? Porque
para *pedir* el servicio logger, lo haces utilizando este type-hint. Se le llama
"autowiring".

## Usando Autowiring para el Servicio del Logger

Así es como obtienes un servicio desde un controlador. Agrega un tercer argumento a
tu método - aunque el orden de los argumentos no importa. Escribe
`LoggerInterface` - autocompleta el del `Psr\Log\LoggerInterface` - y `$logger`.

[[[ code('cb7b5791f2') ]]]

Esto agregó el import arriba de la clase para `Psr\Log\LoggerInterface`, el cual es
él *mismo* type-hint que el `debug:autowiring` nos dijo que usáramos. Gracias a este
type-hint, cuando Symfony hace un render de nuestro controlador, sabrá que queremos
que nos pase el servicio del logger a este argumento.

Entonces... si: ahora existen *dos* tipos de argumentos que puedes agregar a tus
métodos del controlador. Primero, puedes tener un *argumento* que se empareja con un
comodín de tu ruta. Y segundo, puedes tener un argumento cuyo *type-hint* sea el
mismo a una de las clases o interfaces listadas en `debug:autowiring`.
`CacheInterface` es otro type-hint que podemos usar para tener el servicio de
*caché*.

## Utilizando el Servicio del Logger

Así que... ¡Vamos a usar este objeto! ¿Qué métodos nos permite llamar? ¡No tengo
idea! Pero como escribimos el type-hint apropiado, podemos decir `$logger->` y
PhpStorm nos dice *exactamente* cuales métodos tiene. Utilicemos `$logger->info()`
para decir "Voting up!". Cópialo y di "Voting down!" en el else.

[[[ code('38a18c81d7') ]]]

¡Es hora de probarlo! Refresca la página y... Hagamos click en arriba, abajo, arriba.
Esto... por lo menos no parece que esté *roto*.

Mueve el mouse sobre la parte del AJAX de la herramienta web debug y abre el profiler
para uno de estos llamados. El profiler tiene una sección de "Logs", la cual ofrece
una forma *fácil* de ver los logs para un solo Request. ¡Ahí está! "Voting up!".
También puedes encontrar esto en el archivo `var/log/dev.log`.

El punto es: Symfony tiene *muchos*, muchos objetos útiles, digo "servicios". Y poco
a poco, vamos a empezar a utilizar más de ellos... Cada vez agregando un *type-hint*
para decirle a Symfony cual servicio queremos.

## Autowiring & Utilizando el Servicio de Twig

Veamos otro ejemplo. El *primer* servicio que usamos en nuestro código es el servicio
de *Twig*. Lo usamos... de forma "indirecta" al llamar `$this->render()`. En
realidad, ese método es un atajo para utilizar el *servicio* Twig detrás de escenas.
Y eso *no* debería de sorprenderte. Como dije antes, *todo* lo que se realiza en
Symfony es hecho en *realidad* por un servicio.

Como reto, vamos a suponer que la función `render()` no existe. Gasp! En el
controlador del `homepage()` comentariza la línea `render()`.

Entonces... ¿Cómo podemos utilizar el servicio de Twig directamente para hacer un
render de un template? ¡No lo sé! *Definitivamente* podemos encontrar algo de
documentación al respecto... pero vamos a ver si podemos descubrirlo por nosotros
mismos con la ayuda del comando `debug:autowiring`

```terminal
php bin/console debug:autowiring twig
```

Y, ¡Voilà! Aparentemente existe una clase llamada `Twig\Environment` que podemos usar
como "type-hint" para obtener el servicio de Twig. En nuestro controlador, escribe
`Environment` y presiona tab para agregar el `import` arriba. Voy a nombrar al
argumento `$twigEnvironment`.

[[[ code('95c90d35db') ]]]

Dentro, escribe `$html = $twigEnvironment->`. De nuevo, sin leer *nada* de
documentación, gracias al hecho de que estamos escribiendo código responsablemente y
usamos type-hints, PhpStorm nos muestra *todos* los métodos de esta clase. ¡Mira!
¡Este método `render()` parece que es el que necesitamos! Pasa el mismo nombre del
template de antes.

[[[ code('7c48f5083f') ]]]

Cuando usas twig directamente, en vez de retornar un objeto tipo Response, retorna un
string con el HTML. No hay problema: termina con `return new Response()` - la de
`HttpFoundation` - y pasa` $html`.

[[[ code('702d2ebc1c') ]]]

Esto ahora está haciendo *exactamente* lo mismo que `$this->render()`. Para probarlo,
haz click en la página de inicio. Todavía funciona.

Ahora en realidad, más allá de ser un "gran ejercicio" para entender los servicios,
no hay razón para tomar el camino más *largo*. solo quiero que entiendas que los
servicios *realmente* son las "cosas" que hacen el trabajo detrás de escenas. Y si
quisieras hacer algo - como un log o un render de un template - lo que *realmente*
necesitas es encontrar que *servicios* hacen ese trabajo. Confía en mi, *esta* es la
clave para liberar todo tu potencial de Symfony.

Pongamos de vuelta el código anterior más corto, y comentariza el otro ejemplo.

[[[ code('5eb7b54438') ]]]

Muy bien, ya *casi* has terminado el primer tutorial de symfony. ¡Eres el mejor! Como
premio, vamos a terminar con algo divertido: Una introducción al sistema llamado
Webpack Encore que te va a permitir hacer cosas *alocadas* con tu CSS y JavaScript.
