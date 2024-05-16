const express = require('express');
const mysql = require('mysql2/promise');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
 
const app = express();
app.disable("x-powered-by");
 
app.use(express.json());
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'cursos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
 
// Configuração do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de CRUD de cursos',
      version: '1.0.0',
      description: 'API para criar, ler, atualizar e deletar cursos'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ]
  },
  apis: ['index.js']
};
 
const swaggerSpec = swaggerJSDoc(options);
 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
/**
 * @swagger
 * /curso:
 *   get:
 *     summary: Retorna todos os cursos
 *     responses:
 *       '200':
 *         description: OK
 *   post:
 *     summary: Cria um novo curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: nome do curso
 *               descricao:
 *                 type: integer
 *                 description: descricao do curso
 *             example:
 *               nome: João da Silva
 *               descricao: 30
 *     responses:
 *       '200':
 *         description: OK
 *
 * /curso/{id}:
 *   put:
 *     summary: Atualiza um curso existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           description: ID do curso a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Novo nome do curso
 *               descricao:
 *                 type: integer
 *                 description: Nova descricao do curso
 *             example:
 *               nome: José da Silva
 *               descricao: 35
 *     responses:
 *       '204':
 *         description: No Content
 *   delete:
 *     summary: Deleta um curso existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           description: ID do curso a ser deletado
 *     responses:
 *       '204':
 *         description: No Content
 */
 
//exemplo: /curso?nome=João
 
app.get('/curso', async (req, res) => {
  try {
    const { nome } = req.query;
    let query = 'SELECT * FROM curso';
    let params = [];
   
    if (nome) {
      query += ' WHERE nome LIKE ?';
      params.push(`%${nome}%`);
    }
 
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao recuperar cursos:", error);
    res.status(500).send("Erro ao recuperar cursos");
  }
});
 
app.post('/curso', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const [curso] = await pool.query('INSERT INTO curso (nome, descricao) VALUES (?, ?)', [nome, descricao]);
    res.json({ id: curso.insertId, nome:nome, descricao:descricao});
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    res.status(500).send("Erro ao criar curso");
  }
});
 
app.put('/curso/:id', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const { id } = req.params;
    await pool.query('UPDATE curso SET nome = ?, descricao = ? WHERE id = ?', [nome, descricao, id]);
    res.status(200).json({ id: id, nome: nome, descricao: descricao });
  } catch (error) {
    console.error("Erro ao atualizar curso:", error);
    res.status(500).send("Erro ao atualizar curso");
  }
});
 
app.delete('/curso/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM curso WHERE id = ?', [id]);
    res.status(200).json({ id: Number(id) });
  } catch (error) {
    console.error("Erro ao deletar curso:", error);
    res.status(500).send("Erro ao deletar curso");
  }
});
 
app.get('/curso/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM curso WHERE id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    res.status(500).send("Erro ao buscar curso");
  }
});
 
const server = app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
 
// Mantém o servidor rodando mesmo se ocorrer um erro
process.on('uncaughtException', (err) => {
  console.error('Erro não tratado:', err);
});
 
process.on('unhandledRejection', (err) => {
  console.error('Rejeição não tratada:', err);
});