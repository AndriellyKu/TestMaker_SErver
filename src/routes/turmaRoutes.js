const express = require('express');
const router = express.Router();
const { criarTurma, listarTurmasDoProfessor, deletarTurma } = require('../controllers/turmaController');
const authenticateToken = require('../middleware/authenticateToken'); 
const verificarProfessor = require('../middleware/verificaProfessor');

// Rota para criar uma turma
router.post('/criar-turma', authenticateToken, verificarProfessor, criarTurma);

// Rota para listar as turmas criadas pelo professor autenticado
router.get('/minhas-turmas', authenticateToken, verificarProfessor, listarTurmasDoProfessor);

// Rota para deletar uma turma específica criada pelo professor autenticado
router.delete('/deletar-turma/:id', authenticateToken, verificarProfessor, deletarTurma);

module.exports = router;
