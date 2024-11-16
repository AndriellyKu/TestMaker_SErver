const express = require('express');
const router = express.Router();
const { listarProvasDoProfessor, excluirProva, criarProva } = require('../controllers/provaController');
const authMiddleware = require('../middleware/authenticateToken');

// Rota para listar as provas do professor
router.get('/professor/provas', listarProvasDoProfessor);

// Rota para criar uma nova prova
router.post('/criar-prova', authMiddleware, criarProva);

// Rota para excluir uma prova (usando o ID da prova)
router.delete('/excluir-prova/:id', excluirProva);

module.exports = router;
