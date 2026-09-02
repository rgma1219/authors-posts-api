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
