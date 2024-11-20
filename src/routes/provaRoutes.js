const express = require('express');
const router = express.Router();
const { getProvaById } = require('../controllers/provaController');
const { listarProvasDoProfessor, excluirProva, criarProva } = require('../controllers/SalaController');
const { gerarQuestoes } = require('../controllers/openAIController');
const { gerarPerguntasComPrompt, gerarPerguntasComLink, gerarPerguntasComPDF, atualizarPerguntasDaProva } = require('../controllers/openAIController');
const authMiddleware = require('../middleware/authenticateToken');


router.get('/professor/provas', listarProvasDoProfessor);

router.post('/criar-prova', authMiddleware, criarProva);

router.delete('/excluir-prova/:id', excluirProva);

router.get("/:id", getProvaById);

// Defina a rota PUT para atualizar as perguntas da prova
router.put('/atualizar-prova', atualizarPerguntasDaProva);

module.exports = router;
