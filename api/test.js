const assert = require('chai').assert;
const axios = require('axios');

describe('Testes da API', function () {
    let userId;

    it('Listar todos cursos', async function () {
        const response = await axios.get('http://localhost:3000/curso');
        assert.equal(response.status, 200);
        assert.isArray(response.data);
    });

    it('Criar novo curso', async function () {
        const newUser = { nome: 'Curso Teste', descricao: "Descricao Curso teste" };
        const response = await axios.post('http://localhost:3000/curso', newUser);
        assert.equal(response.status, 200);
        assert.isObject(response.data);
        assert.property(response.data, 'id');
        assert.isNumber(response.data.id);
        userId = response.data.id; // store the user ID for use in the next test
    });

    it('Modificar curso', async function () {
        const updatedUserData = { nome: 'Novo Nome', descricao: "Nova Descricao Curso" }; // Dados atualizados do curso
        const response = await axios.put(`http://localhost:3000/curso/${userId}`, updatedUserData);
        assert.equal(response.status, 200);
        assert.isObject(response.data);
        
        // Converta o ID retornado para um número antes de fazer a asserção
        const returnedId = parseInt(response.data.id);
    
        // Verifica se os dados foram atualizados corretamente
        assert.equal(returnedId, userId);
        assert.propertyVal(response.data, 'nome', updatedUserData.nome);
        assert.propertyVal(response.data, 'descricao', updatedUserData.descricao);
    });

    it('Excluir curso', async function () {
        const response = await axios.delete(`http://localhost:3000/curso/${userId}`);
        assert.equal(response.status, 200);
        const deletedUser = response.data;
        assert.isObject(deletedUser);
        assert.propertyVal(deletedUser, 'id', userId);
    });

});