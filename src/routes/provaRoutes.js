const express = require('express');
const router = express.Router();
const { listarProvasDoProfessor, excluirProva, criarProva } = require('../controllers/provaController');
const { gerarQuestoes } = require('../controllers/openAIController'); 
const authMiddleware = require('../middleware/authenticateToken');


router.get('/professor/provas', listarProvasDoProfessor);

router.post('/criar-prova', authMiddleware, criarProva);

router.delete('/excluir-prova/:id', excluirProva);

router.post('/gerar-questoes', authMiddleware, gerarQuestoes);

module.exports = router;
