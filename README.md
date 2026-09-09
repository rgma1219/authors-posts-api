# Authors & Posts API

API REST desarrollada con Node.js, Express y PostgreSQL para gestionar autores y publicaciones. El proyecto implementa un CRUD completo para las entidades `authors` y `posts`, validaciones de entrada, manejo centralizado de errores, consultas parametrizadas y documentación OpenAPI.

La relación entre autores y publicaciones se modela mediante `posts.author_id`. Al eliminar un autor, sus publicaciones asociadas se eliminan automáticamente gracias a la restricción `ON DELETE CASCADE`.

## Demo y documentación

- **API en producción:** [https://authors-posts-api-production.up.railway.app/](https://authors-posts-api-production.up.railway.app/)
- **Documentación OpenAPI / Swagger UI:** [https://authors-posts-api-production.up.railway.app/api-docs/](https://authors-posts-api-production.up.railway.app/api-docs/)
- **Health check:** `GET /health`

## Tecnologías

- Node.js
- Express 5
- PostgreSQL
- `pg` para la conexión a la base de datos
- Swagger UI y OpenAPI 3
- Vitest y Supertest para testing

## Requisitos

- Node.js 20.12 o superior. Se utiliza la API nativa `process.loadEnvFile()` para cargar el archivo `.env`.
- npm
- PostgreSQL instalado y ejecutándose de forma local, o acceso a una instancia PostgreSQL remota.

## Instalación y ejecución local

1. Clonar el repositorio y entrar en la carpeta del proyecto:

    ```bash
    git clone https://github.com/rgma1219/authors-posts-api
    cd authors-posts-api
    ```

2. Instalar las dependencias:

    ```bash
    npm install
    ```

3. Crear una base de datos PostgreSQL, por ejemplo:

    ```sql
    CREATE DATABASE authors_posts_api;
    ```

4. Crear un archivo `.env` en la raíz del proyecto. Ejemplo:

    ```env
    PGUSER=api_user
    PGPASSWORD=tu_password
    PGHOST=localhost
    PGPORT=5432
    PGDATABASE=authors_posts_api
    PORT=3000
    ```

    También se puede tomar `.env.example` como plantilla. El archivo `.env` no debe subirse al repositorio.

5. Inicializar las tablas y cargar los datos de prueba. El siguiente comando ejecuta `scripts/setup.sql` y `scripts/seed.sql`:

    ```bash
    npm run db:init
    ```

    Si se desea ejecutar los scripts manualmente:

    ```bash
    psql -U api_user -d authors_posts_api -f scripts/setup.sql
    psql -U api_user -d authors_posts_api -f scripts/seed.sql
    ```

6. Iniciar el servidor:

    ```bash
    npm start
    ```

    La API estará disponible en [http://localhost:3000](http://localhost:3000). Para desarrollo, con reinicio automático al modificar archivos, usar:

    ```bash
    npm run dev
    ```

## Endpoints principales

### Authors

| Método   | Ruta           | Descripción             |
| -------- | -------------- | ----------------------- |
| `GET`    | `/authors`     | Lista todos los autores |
| `GET`    | `/authors/:id` | Obtiene un autor por ID |
| `POST`   | `/authors`     | Crea un autor           |
| `PUT`    | `/authors/:id` | Actualiza un autor      |
| `DELETE` | `/authors/:id` | Elimina un autor        |

### Posts

| Método   | Ruta                      | Descripción                         |
| -------- | ------------------------- | ----------------------------------- |
| `GET`    | `/posts`                  | Lista todas las publicaciones       |
| `GET`    | `/posts/:id`              | Obtiene una publicación por ID      |
| `GET`    | `/posts/author/:authorId` | Lista las publicaciones de un autor |
| `POST`   | `/posts`                  | Crea una publicación                |
| `PUT`    | `/posts/:id`              | Actualiza una publicación           |
| `DELETE` | `/posts/:id`              | Elimina una publicación             |

Los cuerpos de las solicitudes y las respuestas están detallados en [Swagger UI](https://authors-posts-api-production.up.railway.app/api-docs/).

## Tests

Ejecutar la suite de tests en modo no interactivo:

```bash
npm test
```

Los tests usan Vitest y Supertest. Los services se mockean, por lo que la suite no necesita conectarse a una base de datos real.

## Documentación OpenAPI

La documentación se sirve desde la aplicación mediante Swagger UI en:

- Local: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)
- Producción: [https://authors-posts-api-production.up.railway.app/api-docs/](https://authors-posts-api-production.up.railway.app/api-docs/)

Para regenerar el archivo `openapi.json` a partir de las rutas documentadas:

```bash
npm run docs:generate
```

## Deployment en Railway

El proyecto puede desplegarse en Railway como un servicio Node.js conectado a un servicio PostgreSQL.

1. Crear un proyecto en [Railway](https://railway.app/) y agregar un servicio PostgreSQL.
2. Agregar el repositorio como servicio de la API.
3. Configurar las variables de entorno de la API. La aplicación utiliza las variables estándar reconocidas por `pg`:

    ```env
    PGUSER=${{Postgres.PGUSER}}
    PGPASSWORD=${{Postgres.PGPASSWORD}}
    PGHOST=${{Postgres.PGHOST}}
    PGPORT=${{Postgres.PGPORT}}
    PGDATABASE=${{Postgres.PGDATABASE}}
    ```

    El nombre `Postgres` puede variar según el nombre asignado al servicio de base de datos en Railway. También se puede copiar cada valor desde la sección **Variables** del servicio PostgreSQL.

4. Configurar el comando de inicio:

    ```bash
    npm start
    ```

    Railway asigna automáticamente la variable `PORT`; el servidor la utiliza para escuchar en el puerto correcto.

5. Inicializar el esquema en la base de datos de Railway ejecutando `scripts/setup.sql` y `scripts/seed.sql` mediante el cliente PostgreSQL conectado al host interno, o ejecutando `npm run db:init` con las variables de Railway disponibles en el entorno.

### URLs de Railway

- **URL pública de la API:** [https://authors-posts-api-production.up.railway.app/](https://authors-posts-api-production.up.railway.app/)
- **URL pública de Swagger UI:** [https://authors-posts-api-production.up.railway.app/api-docs/](https://authors-posts-api-production.up.railway.app/api-docs/)
- **URL interna de PostgreSQL:** es el valor privado configurado por Railway en `PGHOST` (o el dominio privado equivalente que aparece en las variables del servicio PostgreSQL). Esta URL se usa únicamente para la comunicación interna entre la API y la base de datos; no debe exponerse como URL pública.

La URL pública de la API se obtiene desde **Settings > Domains** del servicio de la aplicación. Después de cada deploy, se puede comprobar la conexión con:

```text
GET https://authors-posts-api-production.up.railway.app/health
```

## Estructura del proyecto

```text
src/
├── config/          Configuración de Swagger
├── controllers/     Controladores HTTP
├── db/              Pool de conexión PostgreSQL
├── docs/             Documentación OpenAPI de los endpoints
├── middlewares/     Logging y manejo de errores
├── routes/          Rutas de authors y posts
├── services/        Lógica de acceso a datos
├── tests/            Tests automatizados de la API
└── utils/            Validadores y utilidades
scripts/              Setup y seed de la base de datos
server.js             Punto de entrada de la aplicación
```
