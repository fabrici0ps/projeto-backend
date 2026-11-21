# Projeto Backend - Geração Tech

API REST desenvolvida como projeto de conclusão do curso Geração Tech, utilizando Node.js, Express, Sequelize e MySQL.

A aplicação disponibiliza endpoints para gerenciamento de usuários, categorias e produtos, incluindo autenticação com JWT e documentação interativa com Swagger.

## 🚀 Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [MySQL](https://www.mysql.com/)
- [JWT](https://jwt.io/) - Autenticação e autorização
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Criptografia de senhas
- [Swagger](https://swagger.io/) - Documentação da API
- [Dotenv](https://www.npmjs.com/package/dotenv) - Gerenciamento de variáveis de ambiente

## 📋 Pré-requisitos

Antes de iniciar, você precisará ter instalado:

- [Node.js](https://nodejs.org/)
- npm (gerenciador de pacotes)
- [MySQL](https://www.mysql.com/) - Banco de dados

## 🛠️ Como rodar o projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/fabrici0ps/projeto-backend.git
   ```

2. **Acesse a pasta do projeto:**

   ```bash
   cd projeto-backend
   ```

3. **Instale as dependências:**

   ```bash
   npm install
   ```

4. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto e informe as configurações de conexão com o banco de dados e a chave secreta utilizada na autenticação JWT.

   Exemplo:

   ```env
   DB_NAME=nome_do_banco
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha

   APP_SECRET_KEY=sua_chave_secreta
   ```

   **Importante:** ajuste os nomes das variáveis de banco de dados conforme os definidos no arquivo de conexão do projeto (`src/config/connection.js`). Não compartilhe o arquivo `.env` nem envie suas credenciais para o repositório.

5. **Crie o banco de dados:**

   No MySQL, crie o banco de dados informado na variável `DB_NAME`.

6. **Inicie o servidor:**

   ```bash
   npm run dev
   ```

7. **Acesse a API:**

   O servidor será iniciado na porta `3000`.

   ```text
   http://localhost:3000
   ```

## 📚 Documentação da API

A documentação interativa foi desenvolvida utilizando Swagger.

Com o servidor em execução, acesse:

```text
http://localhost:3000/api-docs
```

Por meio da documentação, é possível consultar os endpoints, visualizar os parâmetros necessários e realizar requisições diretamente pelo navegador.

## 🔐 Autenticação

A API utiliza JSON Web Token (JWT) para proteger as operações que exigem autenticação.

Para obter um token:

1. Acesse `POST /v1/user/token`.
2. Informe o e-mail e a senha cadastrados.
3. Copie o token retornado pela API.
4. Utilize o botão **Authorize** na documentação Swagger para autenticar as requisições protegidas.

As operações protegidas devem enviar o token no cabeçalho HTTP:

```http
Authorization: Bearer SEU_TOKEN
```

## 📌 Principais recursos

- **Usuários:** cadastro, consulta, atualização, exclusão e autenticação.
- **Categorias:** cadastro, consulta, atualização, exclusão e pesquisa.
- **Produtos:** cadastro, consulta, atualização, exclusão e pesquisa.
- **Relacionamentos:** associação entre produtos, categorias, imagens e opções.

## 📁 Estrutura do projeto

```text
projeto-backend/
├── src/
│   ├── config/
│   │   ├── connection.js
│   │   └── swagger.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   │   └── relations.js
│   ├── routes/
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

## 👨‍💻 Desenvolvido como projeto de conclusão

**Geração Tech**

Projeto desenvolvido para consolidar conhecimentos em desenvolvimento backend, construção de APIs REST, integração com banco de dados relacional e autenticação de usuários.