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

## Etapa 2 — CRUD completo de Authors (fecha: 02/09/2026)

- Creación de `src/utils/validators.js`: validación manual (sin librerías externas) de
  campos obligatorios y formato de email con regex, reutilizada en POST y PUT.
- Creación de `src/middlewares/requestLogger.js`: middleware nativo de logging (usando
  el evento 'finish' de `res`) para visibilidad de todos los requests en consola,
  sin usar `morgan`.
- Implementación de los 5 endpoints CRUD en arquitectura de capas (routes → controllers
  → services):
    - `GET /authors`: listado completo, ordenado por id.
    - `GET /authors/:id`: detalle por id, 404 si no existe.
    - `POST /authors`: creación con validación de campos obligatorios, formato de email,
      y unicidad (capturando el código de error 23505 de PostgreSQL para devolver 409).
    - `PUT /authors/:id`: actualización completa (reemplazo total, semántica REST correcta),
      exige name y email siempre; se decidió no implementar PATCH para mantener el alcance
      acotado según la consigna.
    - `DELETE /authors/:id`: borrado con status 204 (sin body, según estándar HTTP);
      se verificó el comportamiento ON DELETE CASCADE (al borrar un author, sus posts
      asociados se eliminan automáticamente a nivel de base de datos).
- Todas las queries parametrizadas ($1, $2, ...) para prevenir SQL injection.
- Códigos HTTP usados: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request),
  404 (Not Found), 409 (Conflict) — aplicados según semántica REST correspondiente.
- Verificación manual completa de los 5 endpoints con Thunder Client, incluyendo casos
  de éxito y de error.
- Commit: "feat: CRUD completo de authors con validaciones y manejo de errores"

## Etapa 3 (parcial) — Endpoints GET de Posts (fecha: 02/09/2026)

- Implementación de `GET /posts` (listado completo) y `GET /posts/:id` (detalle,
  con 404 si no existe), siguiendo el mismo patrón de capas usado en Authors.
- Implementación del endpoint especial requerido por la rúbrica:
  `GET /posts/author/:authorId`. Decisión de diseño: si el author no existe, se
  devuelve 404 (no un array vacío), para diferenciar claramente "author sin posts"
  de "author inexistente".
- Reutilización de `authorsService.getById()` desde `posts.service.js` para validar
  la existencia del author antes de buscar sus posts, evitando duplicar lógica de
  validación entre ambos services.
- Corrección de errores de aprendizaje durante el desarrollo: falta de `await` en
  una llamada async, y confusión inicial entre filtrar por `id` (PK de posts) vs.
  `author_id` (FK hacia authors) — buen ejercicio para afianzar el modelo relacional.
- Decisión sobre orden de rutas en Express: `/author/:authorId` debe declararse
  antes que `/:id`, ya que Express evalúa rutas en orden y `/:id` matchea
  cualquier valor (incluida la palabra "author") si se declara primero.
- Commit: "feat: endpoints GET de posts (listar, por id, por author) reutilizando
  authorsService"

## Etapa 3 — CRUD completo de Posts (fecha: 03/09/2026)

- Implementación de `POST /posts`: validación de campos obligatorios (author_id, title,
  content) mediante `validatePostInput`, y verificación de existencia del author
  reutilizando `authorsService.getById()` antes del INSERT (evita posts huérfanos con
  author_id inexistente). `published` es opcional, con default `false` si no se envía.
- Decisión de diseño: `PUT /posts/:id` no permite modificar `author_id` (queda fijo
  desde la creación). Justificación: en un escenario real con autenticación, el autor
  de un post debería ser inmutable, ya que representa quién lo publicó originalmente.
  Se creó una función de validación separada (`validatePostUpdateInput`) que solo exige
  `title` y `content`, sin pedir `author_id`.
- Nota de comportamiento documentada: al ser `PUT` un reemplazo completo (semántica REST
  estricta), si no se envía el campo `published`, este se reinicia a `false` (no conserva
  el valor previo). Se decidió mantener este comportamiento por consistencia con los
  principios REST, documentándolo explícitamente para quien consuma la API. Pendiente de
  consulta con el instructor para validar el criterio.
- Implementación de `DELETE /posts/:id`, confirmando que no existen tablas dependientes
  de `posts` (no hay comportamiento en cascada a verificar en esta dirección).
- Errores de tipeo detectados y corregidos durante el desarrollo (variable renombrada
  parcialmente en `getByAuthorId`, nombre de servicio mal escrito en `deletePost`) —
  buen ejercicio de revisión de código y refuerzo de la importancia de usar "Rename
  Symbol" del editor al renombrar variables.
- CRUD de Posts completo y verificado con Thunder Client: los 6 endpoints
  (GET listar, GET por id, GET por author, POST, PUT, DELETE) probados con casos de
  éxito y de error.
- Commit: "feat: CRUD completo de posts con validaciones, endpoint por author y
  manejo de errores"

## CRUD COMPLETO DEL PROYECTO (Authors + Posts): ✅

## Etapa 4 (inicio) — Configuración de Testing con Vitest + Supertest (fecha: 07/09/2026)

- Instalación de `vitest` y `supertest` como devDependencies (no se usan en producción).
- Script `test` actualizado en `package.json` a `vitest run` (modo no interactivo, apto
  para CI/CD y corrección).
- Definición de estrategia de testing según indicación del instructor: mockear los
  services (sin conexión real a la base de datos), en vez de tests de integración
  contra una base de datos real.
- Troubleshooting significativo durante la configuración inicial:
    1. Vitest no puede importarse con `require()` (es un paquete ESM-only) — se resolvió
       usando `import` para las utilidades de Vitest/Supertest.
    2. El auto-mock de Vitest (`vi.mock('ruta')` sin factory) resultó inconsistente con
       módulos CommonJS: la función mockeada no se aplicaba, y el test terminaba
       ejecutando código real contra la base de datos (error de conexión por falta de
       variables de entorno en el contexto de test).
    3. Causa raíz identificada: mezclar `import` (procesado por el motor ESM/Vite de
       Vitest) con `require()` (CommonJS nativo de Node) para los mismos módulos
       propios generaba DOS instancias distintas del mismo archivo en memoria (una por
       cada sistema de módulos), por lo que mockear una no afectaba a la otra.
    4. Solución adoptada: usar `import` únicamente para paquetes externos ESM
       (`vitest`, `supertest`), y `require()` para todos los módulos propios del
       proyecto (`app`, `authorsService`, etc.), garantizando que compartan la misma
       caché de módulos de Node. Con esto, `vi.spyOn(objeto, 'metodo')` sobre el
       objeto real (no vi.mock del módulo completo) permitió mockear correctamente.
- Primer test funcional: `GET /authors` devuelve 200 con datos simulados, sin
  conexión real a PostgreSQL.
- Commit: "test: configuracion inicial de Vitest + Supertest, primer test con mock
  via vi.spyOn"

## Etapa 4 (continuación) — Suite de tests completa (fecha: 07/09/2026)

- Completada la suite de tests con mocks (sin conexión a base de datos real),
  usando el patrón `vi.spyOn(servicioReal, "metodo")` sobre el objeto real
  compartido vía `require()`, validado en la sesión anterior.
- `authors.test.js` (5 tests):
    - GET /authors → 200 con lista simulada.
    - GET /authors/:id → 200 (éxito) y 404 (mockRejectedValue con AppError real).
    - POST /authors → 201 (éxito) y 400 (validación de "name" obligatorio, sin
      necesidad de mockear el service, ya que la validación corta el flujo antes).
- `posts.test.js` (2 tests):
    - GET /posts → 200 con lista simulada.
    - POST /posts → 201 (éxito).
- Error de aprendizaje corregido: al testear "POST /posts exitoso", el body enviado
  con `.send()` no incluía `author_id`, disparando sin querer la validación de
  campo obligatorio (400) en vez de llegar al camino de éxito esperado (201). Buen
  refuerzo del hábito de verificar qué campos exige la validación real antes de
  armar el body de un test de camino feliz.
- Total: 7 tests, todos pasando, superando el mínimo de 6 exigido por la rúbrica,
  con cobertura de casos de éxito y error para ambas entidades.
- Commit: "test: cobertura completa de tests con mocks para authors y posts
  (7 tests, exito y error)"

## Etapa 5 — Documentación OpenAPI (fecha: 07/09/2026)

- Decisión de enfoque: `swagger-jsdoc` (genera la especificación a partir de
  comentarios JSDoc en las rutas) + `swagger-ui-express` (interfaz interactiva en
  `/api-docs`). Se instalaron como dependencias de producción (no dev), ya que la
  interfaz debe estar disponible también en el entorno desplegado (Railway).
- Creación de `src/config/swagger.js`: configuración general de la API (info, tags,
  servers) y definición de schemas reutilizables (`Author`, `AuthorInput`, `Post`,
  `PostInput`, `PostUpdateInput`, `Error`) mediante `components.schemas`, evitando
  duplicar estructuras en cada endpoint.
- Documentación completa de los 11 endpoints (5 de authors, 6 de posts) mediante
  archivos dedicados en `src/docs/` (`authors.openapi.js` y `posts.openapi.js`),
  manteniendo los comentarios `@openapi` fuera de las rutas e incluyendo parámetros,
  request bodies y todas las respuestas posibles (200/201/204, 400, 404, 409) con
  sus schemas correspondientes.
- Documentación explícita en `PUT /posts/:id` sobre el comportamiento de `published`
  al no enviarse (se reinicia a `false`), coherente con la nota ya registrada en la
  Etapa 3.
- Montaje de la interfaz interactiva en `/api-docs` (`app.js`).
- Creación de `scripts/generate-openapi.js` y script `docs:generate` en package.json,
  para exportar la especificación como archivo físico `openapi.json` en la raíz del
  proyecto (entregable explícito de la rúbrica).
- Troubleshooting: error de ruta de módulo (`Cannot find module './config/swagger'`)
  por archivo mal ubicado, corregido verificando la estructura de carpetas.
- Ajuste de orden de tags en la interfaz (Authors antes de Posts), declarando
  `tags` explícitamente en la configuración general en vez de depender del orden
  de escaneo de archivos.
- Verificación: interfaz Swagger UI funcional en `http://localhost:3000/api-docs`,
  archivo `openapi.json` generado correctamente.
- Commit: "docs: documentacion OpenAPI completa con swagger-jsdoc y
  swagger-ui-express"
