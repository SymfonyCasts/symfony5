# Negar el acceso en un controlador

Me gusta utilizar el control de acceso en `security.yaml` para ayudarme a proteger secciones enteras de mi sitio... como si todo lo que está bajo `/admin` requiriera algún rol:

[[[ code('c56f5732f9') ]]]

Pero la mayoría de las veces, protejo mi sitio en base a un controlador por otro.

Abre `QuestionController` y encuentra la acción `new()`:

[[[ code('4f40a84be6') ]]]

Esto... obviamente... no es una página real... pero vamos a terminarla algún día... probablemente.

Imaginemos que esta página sí funciona y que cualquiera en nuestro sitio debería poder hacer nuevas preguntas... pero es necesario estar conectado para cargar esta página. Para imponerlo, en el controlador -en la primera línea- pongamos`$this->denyAccessUnlessGranted('ROLE_USER')`:

[[[ code('ac4b1fce3b') ]]]

Así que si el usuario no tiene `ROLE_USER` - lo que sólo es posible si no está conectado - entonces niega el acceso. Sí, denegar el acceso en un controlador es así de fácil.

Cerremos la sesión... y vayamos a esa página: `/questions/new`. ¡Qué bonito! Como somos anónimos, nos redirige a `/login`. Ahora iniciemos sesión - `abraca_admin@example.com`, contraseña `tada` y... ¡acceso concedido!

Si cambiamos a `ROLE_ADMIN`... que no es un rol que tengamos, obtenemos acceso denegado:

[[[ code('c7427c75f4') ]]]

## La excepción AccessDeniedException

Una cosa genial del método `denyAccessUnlessGranted()` es que no devolvemos el valor. Podemos decir simplemente `$this->denyAccessUnlessGranted()` y eso interrumpe el controlador...., lo que significa que el código de aquí abajo nunca se ejecuta.

Esto funciona porque, para denegar el acceso en Symfony, en realidad se lanza una clase de excepción especial: `AccessDeniedException`. Esta línea lanza esa excepción.

En realidad, podemos reescribir este código de forma más larga... sólo para aprender. Esta única línea es idéntica a decir: si no `$this->isGranted('ROLE_ADMIN')` -`isGranted()` es otro método de ayuda en la clase base - entonces lanza esa excepción especial diciendo `throw $this->createAccessDeniedException()` con:

> ¡No hay acceso para ti!

[[[ code('3975570dd2') ]]]

Eso hace lo mismo que antes.... y el mensaje que pases a la excepción sólo lo verán los desarrolladores. Mantén pulsado `Command` o `Ctrl` para saltar al método `createAccessDeniedException()`... puedes ver que vive en`AbstractController`. Este método es tan bonito y aburrido: crea y devuelve un nuevo `AccessDeniedException`. Esta excepción es la clave para denegar el acceso, y podrías lanzarla desde cualquier parte de tu código.

Cierra eso... y luego ve a actualizar. Sí, obtenemos lo mismo que antes.

## Negar el acceso con la anotación/atributo IsGranted

Hay otra forma interesante de denegar el acceso en un controlador... y funciona si tienes instalado `sensio/framework-extra-bundle`, como es nuestro caso. En lugar de escribir tus reglas de seguridad en PHP, puedes escribirlas como anotaciones o atributos de PHP. Compruébalo: encima del controlador, di `@IsGranted()` - le daré al tabulador para autocompletarlo y así obtener la declaración `use` - y luego `"ROLE_ADMIN"`:

[[[ code('23b430be9b') ]]]

Si intentamos esto... ¡acceso denegado! Nosotros, como desarrolladores, vemos un mensaje de error ligeramente diferente, pero el usuario final vería la misma página de error 403. Ah, y si utilizas PHP 8, puedes utilizar `IsGranted` como atributo PHP en lugar de una anotación:

```php
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class QuestionController extends AbstractController
{
    // ...
    /**
     * ...
     * #[IsGranted("ROLE_ADMIN")]
     */
    public function new()
    {
        return new Response('Sounds like a GREAT feature for V2!');
    }
    // ...
}
```

## Negar el acceso a toda una clase de controlador

Una de las cosas más interesantes de la anotación o atributo `IsGranted` es que puedes utilizarlo sobre la clase del controlador. Así que por encima de `QuestionController`, añade `@IsGranted("ROLE_ADMIN")`:

```php
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * @IsGranted("ROLE_ADMIN")
 */
class QuestionController extends AbstractController
{
    // ...
    public function new()
    {
        return new Response('Sounds like a GREAT feature for V2!');
    }
    // ...
}
```

De repente, `ROLE_ADMIN` será necesario para ejecutar cualquier controlador de este archivo. Yo no haré esto... porque entonces sólo los usuarios administradores podrían acceder a mi página web, pero es una gran característica.

Bien, volvamos a `new()`, cambiemos esto por `ROLE_USER`... para que la página vuelva a funcionar:

[[[ code('9f7991fe97') ]]]

Ahora mismo, todos los usuarios sólo tienen `ROLE_USER`. Así que lo siguiente: vamos a empezar a añadir roles adicionales a algunos usuarios en la base de datos para diferenciar entre los usuarios normales y los administradores. También aprenderemos a comprobar las reglas de autorización en Twig para poder mostrar condicionalmente los enlaces -como "iniciar sesión" o "cerrar sesión"- en la situación adecuada.
