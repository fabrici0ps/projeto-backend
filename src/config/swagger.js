import swaggerJsdoc from "swagger-jsdoc"

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Projeto Backend - Geração Tech",
            version: "1.0.0",
            description: "Documentação da API do projeto de conclusão Geração Tech"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor de desenvolvimento"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./src/routes/*.js"]
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec