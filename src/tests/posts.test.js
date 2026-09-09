import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";

const app = require("../app");
const postsService = require("../services/posts.service");
const AppError = require("../utils/AppError");

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

        const res = await request(app).post("/posts").send({
            author_id: 2,
            title: "Nuevo Post",
            content: "Contenido del nuevo post",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            status: "success",
            message: "Post creado correctamente",
            id: fakeNewPost.id,
        });
        expect(postsService.create).toHaveBeenCalledTimes(1);
    });

    it("devuelve 400 cuando author_id no es un entero positivo", async () => {
        vi.spyOn(postsService, "create");

        const res = await request(app).post("/posts").send({
            author_id: "texto",
            title: "Nuevo Post",
            content: "Contenido del nuevo post",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            status: "error",
            message: "Debe ingresar un id de Autor",
        });
        expect(postsService.create).not.toHaveBeenCalled();
    });
});

describe("GET /posts/:id", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("devuelve 200 y el post solicitado", async () => {
        const post = { id: 15, title: "Post", content: "Contenido" };
        vi.spyOn(postsService, "getById").mockResolvedValue(post);

        const res = await request(app).get("/posts/15");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(post);
        expect(postsService.getById).toHaveBeenCalledWith("15");
    });

    it("devuelve 404 cuando el post no existe", async () => {
        vi.spyOn(postsService, "getById").mockRejectedValue(
            new AppError("Post no encontrado", 404),
        );

        const res = await request(app).get("/posts/999");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            status: "error",
            message: "Post no encontrado",
        });
    });
});

describe("GET /posts/author/:authorId", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("devuelve 200 con los posts del author", async () => {
        const posts = [{ id: 15, author_id: 2, title: "Post" }];
        vi.spyOn(postsService, "getByAuthorId").mockResolvedValue(posts);

        const res = await request(app).get("/posts/author/2");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(posts);
        expect(postsService.getByAuthorId).toHaveBeenCalledWith("2");
    });

    it("devuelve 404 cuando el author no existe", async () => {
        vi.spyOn(postsService, "getByAuthorId").mockRejectedValue(
            new AppError("Author no encontrado", 404),
        );

        const res = await request(app).get("/posts/author/999");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            status: "error",
            message: "Author no encontrado",
        });
    });
});

describe("PUT /posts/:id", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("devuelve 200 y el post actualizado", async () => {
        const updatedPost = {
            id: 15,
            author_id: 2,
            title: "Post actualizado",
            content: "Contenido actualizado",
            published: true,
        };
        vi.spyOn(postsService, "update").mockResolvedValue(updatedPost);

        const res = await request(app).put("/posts/15").send({
            title: updatedPost.title,
            content: updatedPost.content,
            published: updatedPost.published,
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(updatedPost);
        expect(postsService.update).toHaveBeenCalledWith("15", {
            title: updatedPost.title,
            content: updatedPost.content,
            published: updatedPost.published,
        });
    });

    it("devuelve 404 cuando el post a actualizar no existe", async () => {
        vi.spyOn(postsService, "update").mockRejectedValue(
            new AppError("Post no encontrado", 404),
        );

        const res = await request(app).put("/posts/999").send({
            title: "Post",
            content: "Contenido",
        });

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            status: "error",
            message: "Post no encontrado",
        });
    });
});

describe("DELETE /posts/:id", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("devuelve 204 cuando el post se elimina", async () => {
        vi.spyOn(postsService, "remove").mockResolvedValue({ id: 15 });

        const res = await request(app).delete("/posts/15");

        expect(res.statusCode).toBe(204);
        expect(res.body).toEqual({});
        expect(postsService.remove).toHaveBeenCalledWith("15");
    });
});
