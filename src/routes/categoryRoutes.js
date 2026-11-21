
import express from "express"
import {
    create,
    findById,
    remove,
    search,
    update
} from "../controllers/categoryController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const categoryRoutes = express.Router()

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Gerenciamento de categorias
 */

/**
 * @swagger
 * /v1/category/search:
 *   get:
 *     summary: Lista e filtra categorias
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Quantidade de registros por página. Use -1 para retornar todos.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página.
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Campos que deseja retornar, separados por vírgula.
 *         example: name,slug,use_in_menu
 *       - in: query
 *         name: use_in_menu
 *         schema:
 *           type: boolean
 *         description: Filtra categorias utilizadas no menu.
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso.
 *       404:
 *         description: Dados incorretos.
 */
categoryRoutes.route("/v1/category/search").get(search)

/**
 * @swagger
 * /v1/category/{id}:
 *   get:
 *     summary: Busca categoria por ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria.
 *     responses:
 *       200:
 *         description: Categoria encontrada.
 *       404:
 *         description: Categoria não encontrada.
 */
categoryRoutes.route("/v1/category/:id").get(findById)

/**
 * @swagger
 * /v1/category:
 *   post:
 *     summary: Cadastra uma categoria
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: Calçados
 *               slug:
 *                 type: string
 *                 example: calcados
 *               use_in_menu:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Categoria cadastrada com sucesso.
 *       400:
 *         description: Dados enviados incorretos.
 *       401:
 *         description: Token ausente ou inválido.
 */
categoryRoutes.route("/v1/category").post(authMiddleware, create)

/**
 * @swagger
 * /v1/category/{id}:
 *   put:
 *     summary: Atualiza uma categoria
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Calçados esportivos
 *               slug:
 *                 type: string
 *                 example: calcados-esportivos
 *               use_in_menu:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       204:
 *         description: Categoria atualizada com sucesso.
 *       400:
 *         description: Dados incorretos.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Categoria não encontrada.
 */
categoryRoutes.route("/v1/category/:id").put(authMiddleware, update)

/**
 * @swagger
 * /v1/category/{id}:
 *   delete:
 *     summary: Remove uma categoria
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria.
 *     responses:
 *       204:
 *         description: Categoria removida com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Categoria não encontrada.
 */
categoryRoutes.route("/v1/category/:id").delete(authMiddleware, remove)

export default categoryRoutes
