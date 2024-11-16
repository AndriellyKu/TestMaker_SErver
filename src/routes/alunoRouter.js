const express = require('express');
const router = express.Router();
const { listarTurmasDoAluno, entrarNaTurma } = require('../controllers/alunoController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/listar-turmas', authenticateToken, listarTurmasDoAluno);

router.post('/entrar-na-turma', authenticateToken, entrarNaTurma);

module.exports = router;
