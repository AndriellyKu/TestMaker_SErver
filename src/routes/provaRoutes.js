const express = require('express');
const router = express.Router();
const { listarProvasDaTurma, excluirProva, criarProva } = require('../controllers/SalaController');
const { gerarQuestoes } = require('../controllers/openAIController');
const { gerarPerguntasComPrompt, gerarPerguntasComLink, gerarPerguntasComPDF, atualizarPerguntasDaProva } = require('../controllers/openAIController');
const authMiddleware = require('../middleware/authenticateToken');

router.get('/:turmaId/provas', listarProvasDaTurma);

router.post('/criar-prova', authMiddleware, criarProva);

router.delete('/excluir-prova/:id', excluirProva);

// Defina a rota PUT para atualizar as perguntas da prova
router.put('/atualizar-prova', authMiddleware, atualizarPerguntasDaProva);

module.exports = router;
