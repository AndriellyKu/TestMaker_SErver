const express = require('express');
const router = express.Router();
const { listarProvasDoProfessor, excluirProva, criarProva } = require('../controllers/provaController');
const { gerarQuestoes } = require('../controllers/openAIController');  // Importando a função de gerar questões
const authMiddleware = require('../middleware/authenticateToken');

// Rota para listar as provas do professor
router.get('/professor/provas', listarProvasDoProfessor);

// Rota para criar uma nova prova
router.post('/criar-prova', authMiddleware, criarProva);

// Rota para excluir uma prova (usando o ID da prova)
router.delete('/excluir-prova/:id', excluirProva);

// Rota para gerar questões para a prova
router.post('/gerar-questoes', authMiddleware, gerarQuestoes);  // Adicionando a rota para gerar questões

module.exports = router;
