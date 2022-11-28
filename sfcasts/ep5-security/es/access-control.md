# Denegación de acceso, access_control y roles

Ya hemos hablado mucho de la autenticación: el proceso de inicio de sesión. Y... incluso ya hemos iniciado la sesión. Así que vamos a echar nuestro primer vistazo a la autorización, que es la parte divertida en la que podemos ir de un lado a otro y denegar el acceso a diferentes partes de nuestro sitio.

## Hola control_de_acceso

La forma más fácil de expulsar a alguien de tu fiesta es en realidad dentro de`config/packages/security.yaml`. Es a través de `access_control`:

[[[ code('c21b478c72') ]]]

Descomenta la primera entrada:

[[[ code('1d9e53fd27') ]]]

El `path` es una expresión regular. Así que esto dice básicamente

> Si una URL empieza por `/admin` -por tanto, `/admin` o `/admin*` -, entonces denegaré
> el acceso a menos que el usuario tenga `ROLE_ADMIN`.

Hablaremos más sobre los roles en un minuto... pero puedo decirte que nuestro usuario no tiene ese rol. Así que... vamos a intentar ir a una URL que coincida con esta ruta. En realidad tenemos una pequeña sección de administración en nuestro sitio. Asegúrate de que estás conectado... y luego ve a `/admin`. ¡Acceso denegado! Se nos expulsa con un error 403.

En producción, puedes personalizar el aspecto de esta página de error 403... además de personalizar la página de error 404 o 422.

## ¡Roles! Usuario::getRoles()

Hablemos de estos "roles". Abre la clase `User`:`src/Entity/User.php`. Así es como funciona. En el momento en que nos conectamos, Symfony llama a este método `getRoles()`, que forma parte de `UserInterface`:

[[[ code('79edc2e00f') ]]]

Devolvemos un array con los roles que debe tener este usuario. El comando `make:user`generó esto para que siempre tengamos un rol llamado `ROLE_USER`... más cualquier rol extra almacenado en la propiedad `$this->roles`. Esa propiedad contiene una matriz de cadenas... que se almacenan en la base de datos como JSON:

[[[ code('26a1487de4') ]]]

Esto significa que podemos dar a cada usuario tantos roles como queramos. Hasta ahora, cuando hemos creado nuestros usuarios, no les hemos dado ningún rol... por lo que nuestra propiedad `roles` está vacía. Pero gracias a cómo está escrito el método `getRoles()`, cada usuario tiene al menos `ROLE_USER`. El comando `make:user` generó el código así porque todos los usuarios necesitan tener al menos un rol... de lo contrario vagan por nuestro sitio como usuarios zombis medio muertos. No es... bonito.

Así que, por convención, siempre damos a un usuario al menos `ROLE_USER`. Ah, y la única regla sobre los roles -eso es un trabalenguas- es que deben empezar por `ROLE_`. Más adelante en el tutorial, aprenderemos por qué.

En cualquier caso, en el momento en que nos conectamos, Symfony llama a `getRoles()`, nos devuelve el array de roles, y los almacena. De hecho, podemos ver esto si hacemos clic en el icono de seguridad de la barra de herramientas de depuración de la web. ¡Sí! Roles: `ROLE_USER`.

Entonces, cuando vamos a `/admin`, esto coincide con nuestra primera entrada `access_control`, comprueba si tenemos `ROLE_ADMIN`, no lo tenemos, y deniega el acceso.

## Sólo coincide UN control_de_acceso

Ah, pero hay un detalle importante que hay que saber sobre `access_control`: sólo se encontrará una coincidencia en una petición.

Por ejemplo, supón que tienes dos controles de acceso como éste:

```yaml
security:
    # ...
    access_control:
      - { path: ^/admin, roles: ROLE_ADMIN }
      - { path: ^/admin/foo, roles: ROLE_USER }
```

Si fuéramos a `/admin`, eso coincidiría con la primera regla y sólo utilizaría la primera regla. Funciona como el enrutamiento: recorre la lista de control de acceso de uno en uno y, en cuanto encuentra la primera coincidencia, se detiene y utiliza sólo esa entrada.

Esto nos ayudará más adelante, cuando neguemos el acceso a toda una sección excepto a una URL. Pero por ahora, ¡sólo tenlo en cuenta!

Y... eso es todo. Los controles de acceso nos proporcionan una forma realmente sencilla de asegurar secciones enteras de nuestro sitio. Pero es sólo una forma de denegar el acceso. Pronto hablaremos de cómo podemos denegar el acceso controlador por controlador, algo que me gusta mucho.

Pero antes de hacerlo, sé que si intento acceder a esta página sin `ROLE_ADMIN`, obtengo el error 403 prohibido. ¿Pero qué pasa si intento acceder a esta página como usuario anónimo? Ve a `/logout`? Ahora no estamos conectados.

Vuelve a `/admin` y... ¡whoa! ¡Un error!

> Se requiere una autentificación completa para acceder a este recurso.

A continuación, vamos a hablar del "punto de entrada" de tu cortafuegos: la forma en que ayudas a los usuarios anónimos a iniciar el proceso de acceso.
