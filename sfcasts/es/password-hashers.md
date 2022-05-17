# Codificadores de contraseña -> password_hashers & debug:firewall

Al convertirnos al nuevo sistema de seguridad, nuestras desaprobaciones acaban de bajar. Si miras lo que queda, una de ellas dice

> El nodo hijo "encoders" en la ruta "security" está obsoleto, utiliza "password_hashers"
> en su lugar.

Este es otro cambio que vimos al actualizar la receta de `security-bundle`. Originalmente, teníamos `encoders`. Esto le dice a Symfony qué algoritmo usar para hacer el hash de la contraseña. Esto ha sido renombrado a `password_hashers`. Y en lugar de necesitar nuestra clase personalizada, siempre podemos usar esta configuración. Esto dice

> Cualquier clase que implemente `PasswordAuthenticatedUserInterface` debe
> utilizar el algoritmo `auto`.

Y como toda clase de usuario con contraseña lo implementará -incluida nuestra clase- esto nos cubre.

Si antes tenías un algoritmo diferente, muévelo a esta línea. No queremos cambiar de algoritmo, sólo eliminar `encoders` en favor de`password_hashers`.

Ahora, en la página de inicio... ¡tenemos aún menos depreciaciones! ¡Quedan dos! Intentemos conectarnos. ¡Ah! Creo que antes se me escaparon algunos conflictos en mi diseño base.

Vamos a pasar por encima de ellos y a arreglarlos. En `templates/base.html.twig`... sí. Cuando actualizamos la receta de `twig-bundle`, esto entraba en conflicto y no me di cuenta.

Ahora... mucho mejor. Iniciemos la sesión: tenemos un usuario llamado `abraca_admin@example.com`con contraseña `tada`. Entra y... ¡está vivo!

## El comando debug:firewall

Por cierto, hablando de "seguridad" y "cortafuegos", Symfony incluye un nuevo comando para ayudar a depurar y visualizar tu cortafuegos. Se llama, apropiadamente,`debug:firewall`. Si lo ejecutas sin argumentos:

```terminal-silent
php bin/console debug:firewall
```

Te dirá los nombres de tu cortafuegos: `dev` y `main`. Vuelve a ejecutarlo con `main`:

```terminal-silent
php bin/console debug:firewall main
```

¡Aquí lo tenemos! Esto nos dice qué autentificadores tiene este cortafuegos, qué proveedor de usuarios está utilizando -aunque nuestra aplicación normalmente sólo tiene uno- y también el punto de entrada, que es algo de lo que hablamos en nuestro tutorial de Seguridad.

Bien, pon una gran marca de verificación junto a "actualizar la seguridad". A continuación, vamos a machacar las últimas depreciaciones y a aprender cómo podemos estar seguros de que no se nos ha escapado ninguna.
