const express = require("express");
const router = express.Router();
const authorsController = require("../controllers/authors.controller");

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Listar todos los authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Lista de authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */
router.get("/", authorsController.getAllAuthors);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Obtener un author por id
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Author encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", authorsController.getAuthorById);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Crear un nuevo author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       201:
 *         description: Author creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Datos inválidos (falta name, email o formato incorrecto)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El email ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", authorsController.createAuthor);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Actualizar un author (reemplazo completo)
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       200:
 *         description: Author actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Author no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El email ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", authorsController.updateAuthor);

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Eliminar un author (elimina en cascada sus posts)
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Author eliminado (sin contenido)
 *       404:
 *         description: Author no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", authorsController.deleteAuthor);

module.exports = router;
