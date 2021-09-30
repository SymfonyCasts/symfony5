# Rutas Inteligentes: Solo POST y Validación de {Comodín}

Dentro de nuestro JavaScript, estamos haciendo una petición POST a la API. Y tiene
sentido. El tema de "cual método HTTP" - como GET, POST, PUT, etc - se *supone* debes
usar para un llamado a la API... puede ser complicado. Pero como nuestra ruta
eventualmente va a *cambiar* algo en la base de datos, como práctica recomendable, no
queremos permitir a la gente que hagan llamados tipo GET a nuestra ruta. Por ahora,
podemos hacer un llamado `GET` con tan solo poner la URL en nuestro navegador. Hey!
Acabo de votar!

Para mejorar esto, en el `CommentController`, podemos hacer más inteligente a nuestra
ruta, podemos hacer que *solo* funcione cuando el método sea POST. Para lograrlo
agrega `methods="POST"`.

[[[ code('5c1cfcba94') ]]]

Tan *pronto* lo hagamos, al refrescar... error 404! La ruta ya no se encuentra

***TIP 
De hecho, es un error 405! Método HTTP no permitido.
***

## El Comando router:match

Otra buena forma de ver esto es en tu terminal. Corre: `php bin/console router:match`. 
Luego copia la URL... y pegala.

```terminal-silent
php bin/console router:match /comments/10/vote/up
```

Este divertido comando nos dice cuál *ruta* le pertenece a una URL. En este caso,
*ninguna* ruta fue encontrada pero esto nos dice que *casi* encuentra la ruta
`app_comment_commentvote`.

Para ver si un llamado `POST` sería encontrado, pasa `--method=POST`:

```terminal-silent
php bin/console router:match /comments/10/vote/up --method=POST
```

Y... Bum! Nos muestra la ruta que pudo encontrar y todos los detalles, incluyendo el
controlador.

## Restringiendo un {Comodín}

Pero hay algo más que no está del todo bien con nuestra ruta. La ruta *espera* que la
parte `{direction}` sea `arriba` o `abajo`. Pero... técnicamente, alguien podría
poner
`plátano` en la URL. De hecho, probémoslo: Cambia la dirección por `plátano`:

```terminal-silent
php bin/console router:match /comments/10/vote/banana --method=POST
```

Si! Votamos "plátano" para este comentario! No es el fin del mundo... si un usuario
intenta hackear nuestro sistema y hace esto, solo significaría un voto negativo. Pero
podemos hacerlo mejor.

Como has de saber, *normalmente* un comodín se empareja con *cualquier* cosa. Sin
embargo, si quisieras, puedes controlarlo con una expresión regular. Dentro de `{}`,
pero después del nombre, agrega `<>`. Dentro, escribe `up|down`.

[[[ code('ce6dc3ca9b') ]]]

*Ahora* prueba el comando router:match

```terminal-silent
php bin/console router:match /comments/10/vote/banana --method=POST
```

Si! *No* encuentra la ruta porque `plátano` no es arriba o abajo. Si cambiamos esto
por `arriba`, funciona:

```terminal-silent
php bin/console router:match /comments/10/vote/up --method=POST
```

## Como Hacer que el id Solo Funcione con Enteros?

Por cierto, podrías ser tentado a hacer más inteligente el comodín `{id}`. Asumiendo
que usamos ids con auto incremento en la base de datos, sabemos que el `id` debe de
ser un entero. Para hacer que esta ruta solo funcione si la parte del `id` es un
número, puedes agregar `<\d+>`, lo que significa: encuentra un "dígito" con cualquier
tamaño.

[[[ code('3416bdd71f') ]]]

Pero... En realidad *no* voy a poner esto aquí. Por qué? Eventualmente vamos a
usar `$id` para llamar a la base de datos. Si alguien escribe `plátano` aquí, a quien
le importa? El query no va a encontrar ningún comentario con `plátano` como id y
vamos a agregar algo de código para retornar una página 404. Incluso si alguien
intenta hacer un ataque de inyección de SQL, como aprenderás más tarde en nuestro
tutorial de base de datos, no *habría* problema, porque la capa de la base de datos
nos protege de ello.

[[[ code('4df10b95bc') ]]]

Hay que asegurarnos que todo aún funciona. Voy a cerrar una pestaña del navegador y
refrescar la página. Eso! los votos aún se ven bien.

A continuación, demos un vistazo a la parte más *fundamental* de Symfony: Los
servicios.
