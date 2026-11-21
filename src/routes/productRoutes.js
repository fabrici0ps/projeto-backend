
import express from "express"
import {
    create,
    findById,
    remove,
    search,
    update
} from "../controllers/productController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const productRoutes = express.Router()

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /v1/product/search:
 *   get:
 *     summary: Lista e filtra produtos
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Quantidade de produtos por página. Utilize -1 para retornar todos.
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
 *         description: Campos do produto separados por vírgula.
 *         example: name,slug,price
 *       - in: query
 *         name: match
 *         schema:
 *           type: string
 *         description: Pesquisa por nome ou descrição do produto.
 *       - in: query
 *         name: category_ids
 *         schema:
 *           type: string
 *         description: IDs das categorias separados por vírgula.
 *         example: 1,2,3
 *       - in: query
 *         name: price-range
 *         schema:
 *           type: string
 *         description: Intervalo mínimo e máximo de preço.
 *         example: 100-500
 *       - in: query
 *         name: option[1]
 *         schema:
 *           type: string
 *         description: Valores da opção identificada pelo ID 1, separados por vírgula.
 *         example: GG,PP
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 *       400:
 *         description: Parâmetros de busca ou paginação inválidos.
 *       500:
 *         description: Erro interno ao buscar produtos.
 */
productRoutes.get("/v1/product/search", search)

/**
 * @swagger
 * /v1/product/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do produto.
 *     responses:
 *       200:
 *         description: Produto encontrado.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao buscar produto.
 */
productRoutes.get("/v1/product/:id", findById)

/**
 * @swagger
 * /v1/product:
 *   post:
 *     summary: Cadastra um novo produto
 *     tags: [Product]
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
 *               - price
 *             properties:
 *               enabled:
 *                 type: boolean
 *                 example: true
 *               name:
 *                 type: string
 *                 example: Produto 01
 *               slug:
 *                 type: string
 *                 example: produto-01
 *               stock:
 *                 type: integer
 *                 example: 10
 *               description:
 *                 type: string
 *                 example: Descrição do produto
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 119.90
 *               price_with_discount:
 *                 type: number
 *                 format: float
 *                 example: 99.90
 *               category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: image/png
 *                     content:
 *                       type: string
 *                       description: Conteúdo da imagem em Base64.
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Cor
 *                     shape:
 *                       type: string
 *                       enum: [square, circle]
 *                       example: square
 *                     radius:
 *                       type: string
 *                       example: 4px
 *                     type:
 *                       type: string
 *                       enum: [text, color]
 *                       example: text
 *                     values:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [Preto, Branco]
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso.
 *       400:
 *         description: Dados enviados incorretos.
 *       401:
 *         description: Token ausente ou inválido.
 */
productRoutes.post("/v1/product", authMiddleware, create)

/**
 * @swagger
 * /v1/product/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do produto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enabled:
 *                 type: boolean
 *                 example: true
 *               name:
 *                 type: string
 *                 example: Produto atualizado
 *               slug:
 *                 type: string
 *                 example: produto-atualizado
 *               stock:
 *                 type: integer
 *                 example: 15
 *               description:
 *                 type: string
 *                 example: Nova descrição
 *               price:
 *                 type: number
 *                 example: 149.90
 *               price_with_discount:
 *                 type: number
 *                 example: 129.90
 *               category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     content:
 *                       type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     shape:
 *                       type: string
 *                       enum: [square, circle]
 *                     radius:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [text, color]
 *                     values:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       204:
 *         description: Produto atualizado com sucesso.
 *       400:
 *         description: Dados enviados incorretos.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Produto ou categoria não encontrada.
 */
productRoutes.put("/v1/product/:id", authMiddleware, update)

/**
 * @swagger
 * /v1/product/{id}:
 *   delete:
 *     summary: Exclui um produto
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador do produto.
 *     responses:
 *       204:
 *         description: Produto excluído com sucesso.
 *       401:
 *         description: Token ausente ou inválido.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao excluir produto.
 */
productRoutes.delete("/v1/product/:id", authMiddleware, remove)

export default productRoutes
