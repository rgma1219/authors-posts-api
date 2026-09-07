import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";

// 'vitest' y 'supertest' sí se importan con ESM (vitest lo exige).
// Los módulos propios del proyecto se requieren con CommonJS, igual que
// hace el resto de la app - así comparten la misma caché de módulos de Node,
// y vi.spyOn modifica el mismo objeto que usa el controller.
const app = require("../app");
const authorsService = require("../services/authors.service");

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
