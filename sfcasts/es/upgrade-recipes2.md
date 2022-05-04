# Mejoras en las recetas: ¡Parte 2!

Corre:

```terminal
composer recipes:update
```

Lo siguiente es `doctrine-extensions-bundle`. Este... cuando miramos... ¡sólo modificamos un comentario! Fácil!. Así que confirma eso... y luego pasa a `debug-bundle`.

## symfony/debug-bundle Receta

```terminal-silent
composer recipes:update
```

Limpia la pantalla y ejecuta eso. Esto ha hecho dos cambios. Ejecutar:

```terminal
git status
```

El primer cambio fue que eliminó un archivo específico del entorno... y lo trasladó al archivo principal. El segundo cambio, que no es muy habitual en las actualizaciones de recetas, es que en `config/bundles.php`, antes cargaba `DebugBundle` en el entorno `dev`y en el entorno `test`. Ahora recomendamos cargarlo sólo en el entorno `dev`. Puedes cargarlo en el entorno `test`, pero tiende a ralentizar las cosas, así que se ha eliminado por defecto.

[[[ code('e0e76dc964') ]]]

¡Es fácil! Confirma esos cambios... ¡y sigue adelante!

## receta symfony/monolog-bundle

```terminal-silent
composer recipes:update
```

El siguiente es `symfony/monolog-bundle`. Este tiene un conflicto, pero es bastante sencillo. Anteriormente, teníamos archivos específicos del entorno en los directorios `dev/`, `prod/`, y `test/`. Todos ellos se han trasladado al archivo central`config/packages/monolog.yaml`. La única razón por la que había un conflicto en mi proyecto es porque había creado previamente este archivo en un tutorial para añadir un nuevo canal `markdown`. Moveré mi canal `markdown` aquí abajo... y mantendré lo nuevo.

[[[ code('5de4ed9382') ]]]

Debajo de esto, puedes ver la configuración `dev` para el registro, la configuración `test` y la configuración `prod`. De nuevo, si tenías una configuración personalizada en tus archivos antiguos, asegúrate de traerla al nuevo archivo para que no se pierda.

[[[ code('04e101b0ac') ]]]

Añade estos cambios... y... confirma.

## receta symfony/routing

Luego vuelve a la derecha:

```terminal
composer recipes:update
```

¡Nos estamos acercando! Actualiza `symfony/routing`. Veamos. Esto ha eliminado otro archivo de configuración específico del entorno. ¡Sí! ¡Menos archivos! También destaca un nuevo`default_uri` config que se establece si alguna vez necesitas generar URLs absolutas desde dentro de un comando.

Antes lo hacías configurando los parámetros de `router.request_context`. Ahora es más fácil, y esto lo anuncia.

[[[ code('1cbacc68f3') ]]]

Confirma esto... ¡y sigamos!

## symfony/security-bundle Receta

```terminal-silent
composer recipes:update
```

Hemos llegado a `symfony/security-bundle`. Éste tiene un conflicto... y está dentro de `config/packages/security.yaml`. Están ocurriendo algunas cosas importantes. La actualización de la receta ha añadido `enable_authenticator_manager: true`. Esto habilita el nuevo sistema de seguridad. Hablaremos de ello más adelante. Por ahora, pon esto en `false` para que sigamos utilizando el antiguo sistema de seguridad.

[[[ code('ff4f02678c') ]]]

También ha añadido algo llamado `password_hashers`, que sustituye a `encoders`. También vamos a hablar de eso más adelante. Por ahora, quiero que mantengas ambas cosas.

[[[ code('6600441dec') ]]]

También hay un conflicto en el cortafuegos. El cambio importante es que la nueva receta tiene `lazy: true`. Eso sustituye a `anonymous: lazy`, así que podemos seguir adelante y mantener ese cambio... pero utilizar el resto de nuestro cortafuegos.

[[[ code('16d29f55ba') ]]]

Ah, y en la parte inferior, tenemos una nueva y brillante sección `when@test`, que establece un hasher de contraseña personalizado. Puedes leer el comentario. Esto acelera tus pruebas haciendo mucho más rápido el hash de las contraseñas en el entorno de pruebas, donde no nos importa la seguridad de nuestro algoritmo de hash.

[[[ code('370ab38f70') ]]]

Añadamos los archivos... y sigamos.

## receta symfony/traducción

Lo siguiente es `symfony/translation`. Esto no es importante... sólo muestra algunas opciones de configuración nuevas. Todas están comentadas, así que... es bueno verlas, pero no son importantes.

[[[ code('8ad40575d1') ]]]

Confirma y... ¡sigue adelante!

## receta symfony/validator

Lo siguiente es `symfony/validator`. ¡Es muy sencillo! Esto movió la configuración de`config/test/validator.yaml` a la principal `validator.yaml`.

¡Confírmalo!

## receta symfony/web-profiler-bundle

Vamos a actualizar una receta más ahora mismo: `web-profiler-bundle`. ¿Adivinas lo que ha hecho? Ha añadido más configuración específica del entorno. Así que la configuración de`dev/web_profiler.yaml` y `test/web_profiler.yaml` se trasladó a la principal`web_profiler.yaml`. Lo mismo ocurrió con las rutas. La configuración de`dev` se trasladó a un nuevo `config/routes/web_profiler.yaml`. Vamos a confirmarlo y... ¡uf! ¡Casi lo hemos conseguido! ¡Sólo quedan dos recetas!

Vamos a actualizarlas. La receta WebpackEncoreBundle también nos dará la oportunidad de actualizar nuestro JavaScript a la nueva versión Stimulus 3.
