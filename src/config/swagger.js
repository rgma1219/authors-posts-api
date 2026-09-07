const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Authors & Posts API",
            version: "1.0.0",
            description:
                "API REST para gestión de autores y posts (estilo JSONPlaceholder). " +
                "Proyecto Integrador - Módulo 2, Bootcamp Full Stack Development (Henry).",
        },
        tags: [
            { name: "Authors", description: "Operaciones sobre autores" },
            { name: "Posts", description: "Operaciones sobre posts" },
        ],
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor de desarrollo",
            },
        ],
        components: {
            schemas: {
                Author: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Ana García" },
                        email: {
                            type: "string",
                            format: "email",
                            example: "ana.garcia@example.com",
                        },
                        bio: {
                            type: "string",
                            nullable: true,
                            example: "Desarrolladora backend.",
                        },
                        created_at: { type: "string", format: "date-time" },
                    },
                },
                AuthorInput: {
                    type: "object",
                    required: ["name", "email"],
                    properties: {
                        name: { type: "string", example: "Ana García" },
                        email: {
                            type: "string",
                            format: "email",
                            example: "ana.garcia@example.com",
                        },
                        bio: {
                            type: "string",
                            nullable: true,
                            example: "Desarrolladora backend.",
                        },
                    },
                },
                Post: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        author_id: { type: "integer", example: 2 },
                        title: {
                            type: "string",
                            example: "Introducción a Express",
                        },
                        content: {
                            type: "string",
                            example: "Express es un framework minimalista...",
                        },
                        published: { type: "boolean", example: true },
                        created_at: { type: "string", format: "date-time" },
                    },
                },
                PostInput: {
                    type: "object",
                    required: ["author_id", "title", "content"],
                    properties: {
                        author_id: { type: "integer", example: 2 },
                        title: {
                            type: "string",
                            example: "Introducción a Express",
                        },
                        content: {
                            type: "string",
                            example: "Express es un framework minimalista...",
                        },
                        published: {
                            type: "boolean",
                            example: false,
                            default: false,
                        },
                    },
                },
                PostUpdateInput: {
                    type: "object",
                    required: ["title", "content"],
                    properties: {
                        title: {
                            type: "string",
                            example: "Título actualizado",
                        },
                        content: {
                            type: "string",
                            example: "Contenido actualizado.",
                        },
                        published: {
                            type: "boolean",
                            example: true,
                            default: false,
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        status: { type: "string", example: "error" },
                        message: {
                            type: "string",
                            example: "Recurso no encontrado",
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
