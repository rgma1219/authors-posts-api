import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";

const app = require("../app");
const postsService = require("../services/posts.service");

describe("GET /posts", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("devuelve 200 y la lista de posts", async () => {
        const fakePosts = [
            {
                id: 1,
                title: "Post Falso",
                content: "Contenido falso",
                published: true,
                created_at: "2026-01-01T00:00:00.000Z",
            },
        ];

        vi.spyOn(postsService, "getAll").mockResolvedValue(fakePosts);

        const res = await request(app).get("/posts");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(fakePosts);
        expect(postsService.getAll).toHaveBeenCalledTimes(1);
    });
});

describe("POST /posts", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("devuelve 201 y el post creado cuando los datos son válidos", async () => {
        const fakeNewPost = {
            id: 15,
            author_id: 2,
            title: "Nuevo Post",
            content: "Contenido del nuevo post",
            published: false,
            created_at: "2026-01-01T00:00:00.000Z",
        };

        vi.spyOn(postsService, "create").mockResolvedValue(fakeNewPost);

        const res = await request(app)
            .post("/posts")
            .send({
                author_id: 2,
                title: "Nuevo Post",
                content: "Contenido del nuevo post",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(fakeNewPost);
        expect(postsService.create).toHaveBeenCalledTimes(1);
    });
});
