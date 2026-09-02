## Etapa 0 — Setup del proyecto (fecha: 02/09/2026)

- Verificación de entorno: Node v24.18.1, npm 11.16.0, Git 2.55, PostgreSQL 17.11.
- Definición de arquitectura en capas: routes → controllers → services → db, para separar
  responsabilidades (requisito de la rúbrica, categoría "Integración Express-PostgreSQL").
- Creación de la base de datos `authors_posts_api` en PostgreSQL local.
- Creación de usuario dedicado `api_user` con privilegios acotados a la base del proyecto
  (no se usa el superusuario `postgres`, siguiendo el principio de mínimo privilegio).
- Inicialización de repositorio Git y `package.json`.
- Instalación de dependencias mínimas: `express`, `pg` (sin ORM, para practicar SQL directo
  según lo pedido en la consigna; sin `dotenv`, usando la API nativa `process.loadEnvFile()`
  de Node en su lugar).
- Configuración de variables de entorno (`.env`, `.env.example`) usando los nombres estándar
  reconocidos por el driver `pg` (PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE).
- `.gitignore` configurado para excluir `node_modules/` y `.env`.
- Commit inicial: "chore: setup inicial del proyecto - estructura, dependencias y configuracion de entorno"

## Etapa 0 (cierre) — Conexión Express-PostgreSQL verificada (fecha: 02/09/2026)

- Creación de `src/db/pool.js`: módulo de conexión a PostgreSQL usando `Pool` de `pg`
  (no `Client`, para soportar múltiples conexiones concurrentes según buenas prácticas
  y requisito explícito de la rúbrica).
- El `Pool` toma la configuración automáticamente de las variables de entorno estándar
  reconocidas por el driver (PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE), sin
  necesidad de pasar un objeto de configuración explícito.
- Creación de `src/app.js`: configuración de la app de Express, separada del arranque
  del servidor (facilita testing futuro).
- Endpoint `GET /health` implementado como prueba de punta a punta: verifica que el
  servidor responde y que la conexión real a PostgreSQL funciona (ejecuta `SELECT NOW()`).
- Creación de `server.js`: punto de entrada que carga variables de entorno con
  `process.loadEnvFile()` (nativo de Node) antes de importar la app, y levanta el
  servidor en el puerto definido por `PORT`.
- Verificación exitosa: `GET /health` responde `{ "status": "ok", "db_time": "..." }`
  usando Thunder Client.
- **Etapa 0 completada**: proyecto configurado end-to-end (estructura, git, dependencias,
  variables de entorno, conexión a base de datos verificada).

## Etapa 1 — Modelado y persistencia en PostgreSQL (fecha: 02/09/2026)

- Diseño del modelo de datos según consigna: entidades `authors` (id, name, email, bio,
  created_at) y `posts` (id, author_id FK, title, content, published, created_at).
- Decisión de diseño: relación `posts.author_id -> authors.id` con `ON DELETE CASCADE`
  (al borrar un author, se eliminan automáticamente sus posts asociados).
- Constraints aplicadas: PK autoincremental (`SERIAL`) en ambas tablas, `NOT NULL` en
  campos obligatorios, `UNIQUE` en `authors.email` (requisito explícito de la rúbrica),
  `DEFAULT NOW()` en timestamps, `DEFAULT false` en `posts.published`.
- Creación de `scripts/setup.sql` (DDL idempotente, con `DROP TABLE IF EXISTS` para
  poder re-ejecutarse sin errores) y `scripts/seed.sql` (datos de prueba, usando
  `TRUNCATE ... RESTART IDENTITY CASCADE` para reinicios limpios).
- Verificación de tablas creadas (`\dt`) y datos insertados correctamente.
- Troubleshooting: se detectaron caracteres acentuados mostrados incorrectamente en la
  terminal de Git Bash (ej. "García" como "Garc├¡a"). Diagnóstico con `length()` vs.
  `octet_length()` confirmó que los datos están correctamente almacenados en UTF-8 en
  la base — el problema era exclusivamente de renderizado visual de la terminal
  (mintty/Git Bash), sin impacto funcional en la API.
- Commit: "feat: creacion de schema (authors, posts) y script de datos de prueba (seed)"

## Etapa 2 (inicio) — Manejo global de errores (fecha: 02/09/2026)

- Creación de `src/utils/AppError.js`: clase de error personalizada que extiende `Error`
  nativo, agregando `statusCode` e `isOperational` para distinguir errores de negocio
  esperados de bugs internos.
- Creación de `src/utils/asyncHandler.js`: wrapper nativo (sin dependencias como
  `express-async-errors`) que envuelve controllers async y redirige automáticamente
  cualquier error a `next()`, evitando repetir try/catch en cada controller.
- Creación de `src/middlewares/errorHandler.js`: middleware final de Express (firma de
  4 parámetros) que centraliza la respuesta de error, devolviendo status code y mensaje
  apropiados, y logueando el error completo en consola para debugging.
- Middleware adicional en `app.js` para capturar rutas no encontradas (404) con
  respuesta JSON consistente.
- Verificación: `/health` sigue funcionando correctamente; ruta inexistente (`/hola`)
  devuelve `404` con mensaje descriptivo.
- Commit: "feat: middleware global de manejo de errores (AppError, asyncHandler,
  errorHandler) y ruta 404"
