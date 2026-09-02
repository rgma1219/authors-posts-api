## Sesión 1 — Etapa 0: Setup del proyecto

**Herramienta:** Claude (Anthropic)

**Prompts principales y resultados:**

1. Prompt: Definición del rol de tutor y desglose inicial de etapas del proyecto según consigna.
   Resultado: Plan de 8 etapas (setup, DB, CRUD authors, CRUD posts, testing, OpenAPI, deploy, cierre).

    ![Configuración inicial del proyecto](./capturas/1.png)

2. Prompt: Corrección de alcance según rúbrica (entidad "authors" no "users", endpoint
   /posts/author/:authorId obligatorio).
   Resultado: Ajuste del plan y tabla de mapeo rúbrica → etapas.

3. Prompt: Consultas sobre buenas prácticas de conexión a PostgreSQL (uso de superusuario
   vs. usuario dedicado).
   Resultado: Decisión de crear usuario `api_user` con privilegios acotados, aplicando
   principio de mínimo privilegio. Se creó y verificó la conexión con el nuevo usuario.

    ![Creación de nuevo rol](./capturas/2.png)

4. Prompt: Manejo de variables de entorno sin dependencias externas.
   Resultado: Uso de `process.loadEnvFile()` (API nativa de Node 20.12+) en lugar del
   paquete `dotenv`, alineado con la recomendación del instructor de priorizar soluciones nativas.

**Aprendizajes clave de la sesión:**

- Separación en capas (routes/controllers/services) desde el inicio del proyecto.
- Principio de mínimo privilegio aplicado a usuarios de base de datos.
- Alternativas nativas de Node a paquetes npm comunes (dotenv → loadEnvFile).

## Sesión 1 (continuación) — Conexión Express-PostgreSQL

**Prompts principales y resultados:**

5. Prompt: Implementación del módulo de conexión a PostgreSQL con Pool.
   Resultado: Se explicó la diferencia entre Pool y Client, y por qué Pool es obligatorio
   para una API que atiende múltiples requests concurrentes. Código de `src/db/pool.js`
   aprovechando las variables de entorno estándar del driver `pg`.

    ![Conexión a PostgreSQL con Pool](./capturas/3.png)

6. Prompt: Creación de servidor Express mínimo con endpoint de verificación.
   Resultado: Separación entre `app.js` (configuración de Express) y `server.js` (arranque
   del servidor), patrón que facilita testing en etapas posteriores. Endpoint `/health`
   con query real a la base para validar la conexión de punta a punta.

    ![Explicación loadEnvFile() y resultado de la prueba de salud](./capturas/4.png)

**Aprendizajes clave:**

- Diferencia entre `Pool` y `Client` en el driver `pg`, y por qué Pool es el estándar
  para APIs REST.
- Importancia del orden de carga: variables de entorno deben cargarse antes de crear
  el Pool de conexiones.
- Separación `app.js`/`server.js` como patrón que facilita testing automatizado.

## Sesión 1 (continuación) — Etapa 1: Modelado de datos

**Prompts principales y resultados:**

7. Prompt: Diseño de constraints y tipos de datos para el schema (authors/posts) según
   atributos definidos en la consigna.
   Resultado: Tabla de tipos y constraints (SERIAL, VARCHAR, TEXT, BOOLEAN, TIMESTAMP,
   NOT NULL, UNIQUE) justificando cada decisión contra los requisitos de la rúbrica.

    ![Definición de entidades y atributos según consigna](./capturas/5.png)

8. Prompt: Consulta sobre comportamiento de FK al eliminar un author con posts asociados.
   Resultado: Explicación de CASCADE vs RESTRICT; se eligió CASCADE.

9. Prompt: Troubleshooting de caracteres acentuados mostrados incorrectamente en consola
   tras ejecutar el seed (ej. "García" → "Garc├¡a").
   Resultado: Diagnóstico paso a paso descartando causas (encoding del archivo, codepage
   de Windows) hasta confirmar con `length()`/`octet_length()` en SQL que los datos
   estaban correctamente almacenados en UTF-8, y que el problema era únicamente de
   renderizado en la terminal Git Bash/mintty, sin impacto real en la aplicación.

**Aprendizajes clave:**

- Diseño de constraints relacionales (PK, FK, UNIQUE, DEFAULT) alineado a requisitos
  de negocio y de rúbrica.
- Diferencia entre CASCADE y RESTRICT en foreign keys.
- Técnica de diagnóstico de encoding usando `length()` vs `octet_length()` en PostgreSQL
  para distinguir un problema real de datos de un problema de visualización en terminal.

## Sesión 2 — Etapa 2: Manejo global de errores

**Prompts principales y resultados:**

10. Prompt: Diseño de un sistema de manejo de errores centralizado antes de construir
    el CRUD, para evitar refactorizar cada controller después.
    Resultado: Arquitectura de 3 piezas (AppError, asyncHandler, errorHandler middleware),
    todas con JavaScript nativo, sin dependencias externas como express-async-errors.
    Se explicó la convención de Express de identificar middlewares de error por su firma
    de 4 parámetros, y la importancia del orden de declaración de middlewares en app.js.

    ![Armado del middleware global de manejo de errores](./capturas/6.png)

**Aprendizajes clave:**

- Patrón de clase de error personalizada (AppError) para distinguir errores operacionales
  de bugs internos.
- Por qué Express no captura automáticamente errores de funciones async, y cómo resolverlo
  con un wrapper propio en vez de una dependencia.
- Orden correcto de middlewares en Express: rutas → 404 handler → error handler (siempre
  al final).
