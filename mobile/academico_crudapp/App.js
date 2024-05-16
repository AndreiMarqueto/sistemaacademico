// Importando os módulos necessários
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import axios from 'axios';
 
 
// Definindo a URL da API
const API_URL = 'http://172.16.7.6:3000/curso';
 
 
// Criando um componente para renderizar cada item da lista de cursos
const CursoItem = ({ curso, onDelete, onEdit }) => {
  return (
    <View style={styles.CursoItem}>
      <Text style={styles.cursoName}>{curso.nome}</Text>
      <Text style={styles.cursoDescricao}>{curso.descricao}</Text>
      <View style={styles.cursoActions}>
        <Button title="Editar" onPress={() => onEdit(curso)} />
        <Button title="Excluir" onPress={() => onDelete(curso.id)} />
      </View>
    </View>
  );
};
 
// Criando um componente para o formulário de cadastro e edição de cursos
const CursoForm = ({ curso, onSave, onCancel }) => {
  const [name, setName] = useState(curso ? curso.nome : '');
  const [descricao, setDescricao] = useState(curso ? curso.descricao : '');
 
  const handleSubmit = () => {
    if (curso) {
      // Atualizando um curso existente
      axios.put(`${API_URL}/${curso.id}`, { nome: name, descricao: descricao })
        .then(() => onSave())
        .catch((error) => alert(error.messdescricao));
    } else {
      // Criando um novo curso
      axios.post(API_URL, { nome: name, descricao: descricao })
        .then(() => onSave())
        .catch((error) => alert(error.messdescricao));
    }
  };
 
  return (
    <View style={styles.CursoForm}>
      <TextInput
        style={styles.input}
        placeholder="nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="descricao"
        value={descricao}
        onChangeText={setDescricao}
      />
      <View style={styles.formActions}>
        <Button title="Salvar" onPress={handleSubmit} />
        <Button title="Cancelar" onPress={onCancel} />
      </View>
    </View>
  );
};
 
 
// Criando um componente para a tela principal da aplicação
const App = () => {
  const [cursos, setcursos] = useState([]);
  const [selectedcurso, setSelectedcurso] = useState(null);
  const [mostraForm, setMostraForm] = useState(false);
 
  useEffect(() => {
    // Buscando os cursos da API quando o componente é montado
    fetchcursos();
  }, []);
 
  const fetchcursos = () => {
    // Buscando os cursos da API e atualizando o estado
    axios.get(API_URL)
      .then((response) => setcursos(response.data))
      .catch((error) => alert(error.messdescricao));
  };
 
  const handleDeletecurso = (id) => {
    // Excluindo um curso da API e atualizando o estado
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchcursos())
      .catch((error) => alert(error.messdescricao));
  };
 
  const handleEditcurso = (curso) => {
    // Selecionando um curso para editar e mostrando o formulário
    setSelectedcurso(curso);
    setMostraForm(true);
  };
 
  const handleSavecurso = () => {
    // Escondendo o formulário e atualizando os cursos
    setMostraForm(false);
    fetchcursos();
  };
 
  const handleCancelcurso = () => {
    // Escondendo o formulário e limpando o curso selecionado
    setMostraForm(false);
    setSelectedcurso(null);
  };
 
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD API com React Native</Text>
      {mostraForm ? (
        // Mostrando o formulário se o estado mostraForm for verdadeiro
        <CursoForm
          curso={selectedcurso}
          onSave={handleSavecurso}
          onCancel={handleCancelcurso}
        />
      ) : (
        // Mostrando a lista de cursos se o estado mostraForm for falso
        <>
           <FlatList
            data={cursos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CursoItem
                curso={item}
                onDelete={handleDeletecurso}
                onEdit={handleEditcurso}
              />
            )}
          />
          <Button title="Adicionar curso" onPress={() => setMostraForm(true)} />          
        </>
      )}
    </View>
  );
};
 
export default App;//tive que colocar essa linha
 
 
// Definindo os estilos dos componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  CursoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  cursoName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cursoDescricao: {
    flex: 1,
    fontSize: 18,
    textAlign: 'right',
  },
  cursoActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  CursoForm: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});