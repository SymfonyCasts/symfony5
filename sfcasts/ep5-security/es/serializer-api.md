# La API de usuario y el serializador

La mayoría de nuestras páginas hasta ahora han sido páginas HTML normales. Así que vamos a crear una ruta pura de la API que devuelva datos JSON sobre el usuario autentificado en ese momento. Puede ser una ruta a la que llamemos desde nuestro propio JavaScript... o quizás estés creando una API para que la consuma otra persona. Más adelante hablaremos de ello.

Vamos a crear un nuevo controlador para esto llamado `UserController`... y hagamos que extienda nuestra clase `BaseController`:

[[[ code('86930fcdb0') ]]]

Dentro, añade un método llamado `apiMe()`. Dale un `@Route()` - autocompleta el del Componente Symfony - y establece la URL como `/api/me`:

[[[ code('a982ace648') ]]]

Este no es un endpoint muy "restful", pero a menudo es conveniente tenerlo. Para requerir la autenticación para usar este endpoint, añade`@IsGranted("IS_AUTHENTICATED_REMEMBERED")`:

[[[ code('b17ba3ad0f') ]]]

En este proyecto estoy utilizando una mezcla de anotaciones y código PHP para denegar el acceso. Elige el que más te guste para tu aplicación. Dentro del método, podemos decir simplemente: devolver `$this->json()` y pasarle el usuario actual: `$this->getUser()`:

[[[ code('d69eb8320b') ]]]

¡Qué bonito! Vamos a probarlo. Ahora mismo estamos conectados... así que podemos ir a`/api/me` y ver... ¡absolutamente nada! ¡Sólo corchetes vacíos!

Por defecto, cuando llamas a `$this->json()`, pasa los datos a la clase`JsonResponse` de Symfony. Y entonces esa clase llama a la función `json_encode()` de PHP en nuestro objeto `User`. En PHP, a menos que hagas un trabajo extra, cuando pasas un objeto a`json_encode()`, lo único que hace es incluir las propiedades públicas. Como nuestra clase `User`no tiene ninguna propiedad pública:

[[[ code('c42669d2d8') ]]]

Obtenemos de vuelta una respuesta aburrida.

## Aprovechando el serializador

Esto... no es suficiente. Así que, en su lugar, vamos a aprovechar el componente serializador de Symfony. Para instalarlo, en tu terminal, ejecuta:

```terminal
composer require "serializer:1.0.4"
```

Esto instala el paquete del serializador, que incluye el componente Serializer de Symfony, así como algunas otras librerías que le ayudan a funcionar de forma realmente inteligente. Pero no tiene una receta que haga nada del otro mundo: sólo instala el código.

Una de las cosas buenas de utilizar `$this->json()` es que, en cuanto se instala el serializador de Symfony, automáticamente se empieza a utilizar para serializar los datos en lugar del normal `json_encode()`. En otras palabras, cuando actualizamos la ruta, ¡funciona!

## Añadir grupos de serialización

No vamos a hablar demasiado de cómo funciona el serializador de Symfony, ya que hablamos mucho de él en nuestros tutoriales de la Plataforma API. Pero al menos vamos a dar unas pinceladas básicas.

Por defecto, el serializador serializará cualquier propiedad pública o cualquier propiedad que tenga un "getter" en ella. Incluso serializará `displayName` -que no es una propiedad real- porque hay un método `getDisplayName()`.

En realidad... esto es demasiada información para incluirla en la ruta. Así que tomemos más control. Podemos hacerlo diciéndole al serializador que sólo serialice los campos que están en un grupo específico. Pasa 200 para el código de estado, un array de cabeceras vacío -ambos son los valores por defecto- para que podamos llegar al cuarto argumento de `$context`:

[[[ code('c3dd98356c') ]]]

Es una especie de "opciones" que pasas al serializador. Pasa una llamada`groups` establecida en un array. Voy a inventar un grupo llamado `user:read`... porque estamos "leyendo" de "usuario":

[[[ code('cb80558d0e') ]]]

Copia ese nombre de grupo. Ahora, dentro de la entidad `User`, tenemos que añadir este grupo a todos los campos que queramos incluir en la API. Por ejemplo, vamos a incluir `id`. Sobre la propiedad, añade una anotación o atributo PHP: `@Groups()`. Asegúrate de autocompletar el del serializador de Symfony para obtener la declaración `use`en la parte superior. Dentro, pegaré `user:read`:

[[[ code('cac2e3d5a0') ]]]

Copia eso y... vamos a exponer `email`, no queremos exponer `roles`, sí a`firstName` y... ya está:

[[[ code('f868f7a472') ]]]

También podríamos poner el grupo encima de `getDisplayName()` si quisiéramos incluirlo... o `getAvatarUri()`... en realidad lo añadiré ahí:

[[[ code('b91f60669e') ]]]

¡Intentémoslo! Refresca y... ¡superguay! ¡Tenemos esos 4 campos!

Y fíjate en una cosa: aunque se trata de una "ruta de la API"... y nuestra ruta de la API requiere que estemos conectados, podemos acceder totalmente a esto... aunque no tengamos un sistema de autenticación de tokens de la API. Tenemos acceso gracias a nuestra cookie de sesión normal.

Así que eso nos lleva a nuestra siguiente pregunta: si tienes rutas de API como ésta, ¿necesitas un sistema de autenticación por token de API o no? Abordemos ese tema a continuación.
