import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";

// 'vitest' y 'supertest' sí se importan con ESM (vitest lo exige).
// Los módulos propios del proyecto se requieren con CommonJS, igual que
// hace el resto de la app - así comparten la misma caché de módulos de Node,
// y vi.spyOn modifica el mismo objeto que usa el controller.
const app = require("../app");
const authorsService = require("../services/authors.service");
const AppError = require("../utils/AppError");

describe("GET /authors", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("devuelve 200 y la lista de authors", async () => {
        const fakeAuthors = [
            {
                id: 1,
                name: "Autor Falso",
                email: "falso@test.com",
                bio: null,
                created_at: "2026-01-01T00:00:00.000Z",
            },
        ];

        vi.spyOn(authorsService, "getAll").mockResolvedValue(fakeAuthors);

        const res = await request(app).get("/authors");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(fakeAuthors);
        expect(authorsService.getAll).toHaveBeenCalledTimes(1);
    });
});

describe("GET /authors/:id", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("devuelve 200 y el autor con el respectivo ID", async () => {
        const fakeAuthor = {
            id: 2,
            name: "Autor Falso 2",
            email: "falso@test.com",
            bio: null,
            created_at: "2026-01-01T00:00:00.000Z",
        };

        vi.spyOn(authorsService, "getById").mockResolvedValue(fakeAuthor);

        const res = await request(app).get("/authors/2");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(fakeAuthor);
        expect(authorsService.getById).toHaveBeenCalledTimes(1);
    });

    it("devuelve 404 cuando el id del autor no existe en la BD", async () => {
        vi.spyOn(authorsService, "getById").mockRejectedValue(
            new AppError("Author no encontrado", 404),
        );

        const res = await request(app).get("/authors/999");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            status: "error",
            message: "Author no encontrado",
        });
        expect(authorsService.getById).toHaveBeenCalledTimes(1);
    });
});

describe("POST /authors", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("devuelve 201 y el author creado cuando los datos son válidos", async () => {
        const fakeNewAuthor = {
            id: 10,
            name: "Nuevo Autor",
            email: "nuevo@test.com",
            bio: null,
            created_at: "2026-01-01T00:00:00.000Z",
        };

        vi.spyOn(authorsService, "create").mockResolvedValue(fakeNewAuthor);

        const res = await request(app)
            .post("/authors")
            .send({ name: "Nuevo Autor", email: "nuevo@test.com" });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(fakeNewAuthor);
        expect(authorsService.create).toHaveBeenCalledTimes(1);
    });

    it("devuelve 400 cuando falta el campo name", async () => {
        vi.spyOn(authorsService, "create");

        const res = await request(app)
            .post("/authors")
            .send({ email: "sin-name@test.com" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            status: "error",
            message: 'El campo "name" es obligatorio',
        });
        expect(authorsService.create).not.toHaveBeenCalled();
    });
});
