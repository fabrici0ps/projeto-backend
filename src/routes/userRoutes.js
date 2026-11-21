import express from "express"
import {
    findById,
    create,
    update,
    remove,
    generateToken
} from "../controllers/userController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const userRoutes = express.Router()

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Gerenciamento de usuários e autenticação
 */

/**
 * @swagger
 * /v1/user/token:
 *   post:
 *     summary: Gera token JWT
 *     securitySchemes:
 *      bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     tags: [User]
 *     description: Autentica o usuário e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@mail.com
 *               password:
 *                 type: string
 *                 example: 123@123
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *       400:
 *         description: Senha incorreta ou dados inválidos
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.route("/v1/user/token").post(generateToken)

/**
 * @swagger
 * /v1/user:
 *   post:
 *     summary: Cadastra um usuário
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - surname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: João
 *               surname:
 *                 type: string
 *                 example: Silva
 *               email:
 *                 type: string
 *                 example: joao@mail.com
 *               password:
 *                 type: string
 *                 example: 123@123
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados enviados incorretos
 *       401:
 *         description: Token ausente ou inválido
 */
userRoutes.route("/v1/user").post(create)

/**
 * @swagger
 * /v1/user/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.route("/v1/user/:id").get(findById)

/**
 * @swagger
 * /v1/user/{id}:
 *   put:
 *     summary: Atualiza usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: João
 *               surname:
 *                 type: string
 *                 example: Silva
 *               email:
 *                 type: string
 *                 example: joao@mail.com
 *     
 *     responses:
 *       204:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados incorretos
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.route("/v1/user/:id").put(authMiddleware, update)

/**
 * @swagger
 * /v1/user/{id}:
 *   delete:
 *     summary: Remove usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         firstname: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.route("/v1/user/:id").delete(authMiddleware, remove)

export default userRoutes