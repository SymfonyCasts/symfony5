# Métodos de usuario personalizados y el usuario en un servicio

Sabemos cómo obtener el objeto usuario actual en un controlador. ¿Y desde Twig? Dirígete a `base.html.twig`. Veamos... aquí es donde se renderizan nuestros enlaces de "cierre de sesión" e "inicio de sesión". Intentemos renderizar el nombre del usuario aquí mismo.

## App.user en Twig

¿Cómo? En Twig, tenemos acceso a una única variable global llamada `app`, que tiene un montón de cosas útiles, como `app.session` y `app.request`. También tiene`app.user`, que será el objeto actual `User` o `null`. Así que podemos decir`app.user.firstName`:

[[[ code('35f8b1dcaf') ]]]

Esto es seguro porque estamos dentro de la comprobación de `is_granted()`... así que sabemos que hay un `User`.

¡Vamos a probarlo! Cierra el perfilador, actualiza la página y... ¡perfecto! ¡Parece que me llamo Tremayne!

Ahora que tenemos esto... es hora de hacerlo más elegante. Dentro de la comprobación de `is_granted()`, voy a pegar un gran menú de usuario: puedes conseguirlo en el bloque de código de esta página:

[[[ code('e530102feb') ]]]

Esto está completamente codificado para empezar... ¡pero se renderiza muy bien!

Vamos a hacerlo dinámico... hay algunos puntos. Para la imagen, estoy utilizando una API de avatar. Sólo tenemos que quitar la parte "Juan Pérez" e imprimir el nombre real del usuario: `app.user.firstName`. Y luego canalizar eso en `|url_encode`para que sea seguro poner una URL. También renderiza `app.user.firstName` dentro del texto `alt`:

[[[ code('091bdf7f97') ]]]

Para el enlace de "cierre de sesión", roba la función `path()` de abajo... y ponla aquí:

[[[ code('2fc4255d4c') ]]]

Elimina lo anterior en la parte inferior para terminar con esto:

[[[ code('4235857e51') ]]]

¡Genial! Cuando refresquemos... ¡voilà! Un verdadero menú desplegable de usuario.

## Añadir métodos personalizados al usuario

He mencionado varias veces que nuestra clase `User` es nuestra clase...., por lo que somos libres de añadirle los métodos que queramos. Por ejemplo, imagina que necesitamos obtener la URL del avatar del usuario en algunos lugares de nuestro sitio... y no queremos repetir esta larga cadena.

Copia esto y luego ve a abrir la clase `User`: `src/Entity/User.php`. En la parte inferior, crea un nuevo `public function getAvatarUri()`. Dale un argumento `int $size` que por defecto sea `32`... y un tipo de retorno `string`:

[[[ code('11816e9eff') ]]]

Pega la URL como ejemplo. Devolvamos la primera parte de eso... añade un `?` -que se me acaba de olvidar- y luego usa `http_build_query()`:

[[[ code('f877e76619') ]]]

Pásale un array... con el primer parámetro de consulta que necesitamos: `name` ajustado a`$this->getFirstName()`.

Pero podemos ser aún más inteligentes. Si te desplazas hacia arriba, la propiedad `firstName` puede ser `null`:

[[[ code('a4f20b77e6') ]]]

Es algo opcional que el usuario puede proporcionar. Así que, de vuelta al método, utiliza `getFirstName()` si tiene un valor... si no, vuelve al correo electrónico del usuario. Para `size`, que es el segundo parámetro de consulta, establécelo en `$size`... y también necesitamos establecer `background` en `random` para que las imágenes sean más divertidas:

[[[ code('4a11168db9') ]]]

Gracias a este pequeño y bonito método, en `base.html.twig` podemos sustituir todo esto por `app.user.avatarUri`:

[[[ code('49d8dd9533') ]]]

También podemos decir `getAvatarUri()`: ambos harán lo mismo.

Si lo probamos... ¡imagen rota! Ryan: ve a añadir el `?` que has olvidado, cabeza de chorlito.`http_build_query` añade el `&` entre los parámetros de consulta, pero seguimos necesitando el primer `?`:

[[[ code('f881376787') ]]]

Ahora... ¡mucho mejor!

Pero podemos hacerlo aún mejor En `base.html.twig`, utilizamos`app.user.firstName`:

[[[ code('f162f0eeb5') ]]]

Como acabamos de ver, esto puede estar vacío. Así que vamos a añadir un método de ayuda más a`User` llamado `getDisplayName()`, que devolverá un `string`:

[[[ code('0414b064fc') ]]]

Robaré algo de la lógica de arriba... y devolverá eso:

[[[ code('31807ed413') ]]]

Así que devolvemos el nombre o el correo electrónico. Podemos usar esto en`getAvatarUri()` - `getDisplayName()`:

[[[ code('91049a5040') ]]]

Y también en `base.html.twig`:

[[[ code('c384bcf30a') ]]]

Cuando actualizamos... ¡sí! ¡Sigue funcionando!

## Servicio de Seguridad: Obtención del usuario en un servicio

Bien: ahora hemos recuperado el objeto `User` desde un controlador a través de `$this->getUser()`... y en Twig a través de `app.user`. El único otro lugar donde necesitarás obtener el objeto`User` es desde un servicio.

Por ejemplo, hace un par de tutoriales, creamos este servicio `MarkdownHelper`:

[[[ code('a54488219c') ]]]

Le pasamos markdown, lo convierte en HTML... y luego... aprovecha... o algo así. Imaginemos que necesitamos el objeto `User` dentro de este método: vamos a utilizarlo para registrar otro mensaje.

Si necesitas el objeto `User` actualmente autentificado de un servicio, puedes obtenerlo a través de otro servicio llamado `Security`. Añade un nuevo argumento de tipo `Security` -el de `Symfony\Component` - llamado `$security`. Pulsa`Alt` + `Enter` y ve a "Inicializar propiedades" para crear esa propiedad y establecerla:

[[[ code('fe80c5aee3') ]]]

Como estoy usando PHP 7.4, esto añadió un tipo a mi propiedad.

A continuación, vamos a registrar un mensaje si el usuario está conectado. Para ello, di si `$this->security->getUser()`:

[[[ code('8babe8c1c7') ]]]

Realmente, esta es la forma de obtener el objeto `User`... pero también podemos usarlo para ver si el `User` está conectado porque esto devolverá `null` si no lo está. Una forma más "oficial" de hacer esto sería usar `isGranted()` - que es otro método de la clase `Security` - y comprobar `IS_AUTHENTICATED_REMEMBERED`:

```php
class MarkdownHelper
{
    // ...
    public function parse(string $source): string
    {
        // ...
        if ($this->security->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            // ...
        }
        // ...
    }
}
```

De todos modos, dentro de digamos `$this->logger->info()` con:

> Renderización de markdown para {usuario}

Pasar un array de contexto con `user` establecido en `$this->security->getUser()->getEmail()`:

[[[ code('c72c7baae7') ]]]

Como antes, sabemos que este será nuestro objeto `User`... pero nuestro editor sólo sabe que es algún `UserInterface`. Así que podríamos usar `getEmail()`... pero me quedo con `getUserIdentifier()`:

[[[ code('33f09f2e6b') ]]]

¡Vamos a probarlo! Tenemos markdown en esta página... así que actualiza... y luego haz clic en cualquier enlace de la barra de herramientas de depuración web para saltar al perfilador. Ve a los registros y... ¡ya está! Hay un montón de registros porque llamamos a este método un montón de veces.

A continuación, vamos a hablar de una función súper útil llamada "jerarquía de roles". Esto te da el poder de asignar roles adicionales a cualquier usuario que tenga algún otro rol.
