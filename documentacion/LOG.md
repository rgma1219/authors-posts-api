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
