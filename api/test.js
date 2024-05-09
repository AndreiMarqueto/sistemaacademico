const { assert } = require('chai');
const axios = require('axios');

describe('Testes da API', function () {
    let userId;

    it('Listar todos usuários', async function () {
        const response = await axios.get('http://localhost:3000/alunos');
        assert.equal(response.status, 200);
        assert.isArray(response.data);
    });

    it('Criar novo usuário', async function () {
        const newUser = { nome: 'Usuario Teste', idade: 20 }; // Chave 'nome' e 'idade' em minúsculas
        const response = await axios.post('http://localhost:3000/alunos', newUser);
        assert.equal(response.status, 200); // Geralmente, a criação retorna 201 Created
        assert.isObject(response.data);
        assert.property(response.data, 'id');
        assert.isNumber(response.data.id);
        userId = response.data.id; // armazena o ID do usuário para uso no próximo teste
    });

    it('Modificar usuário', async function () {
        const updatedUser = { nome: 'Usuario Teste Modificado', idade: 25 };
        const response = await axios.put(`http://localhost:3000/alunos/${userId}`, updatedUser);
        assert.equal(response.status, 200);
        assert.isObject(response.data);
        assert.propertyVal(response.data, 'nome', 'Usuario Teste Modificado');
    });
    

    it('Excluir usuário', async function () {
        const response = await axios.delete(`http://localhost:3000/alunos/${userId}`);
        assert.equal(response.status, 200); // Geralmente, a exclusão retorna 204 No Content
    });

});
