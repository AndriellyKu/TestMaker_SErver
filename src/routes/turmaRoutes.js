const express = require('express');
const router = express.Router();
const { criarTurma, deletarTurma, listarAlunosDaTurma, listarTurmasDoProfessor, listarProvasDaTurma  } = require('../controllers/turmaController');
const authenticateToken = require('../middleware/authenticateToken'); 
const verificarProfessor = require('../middleware/verificaProfessor');
const turmaController = require ('../controllers/turmaController');


router.post('/criar-turma', authenticateToken, verificarProfessor, criarTurma);

router.get('/minhas-turmas', authenticateToken, verificarProfessor, listarTurmasDoProfessor);

router.delete('/deletar-turma/:id', authenticateToken, verificarProfessor, deletarTurma);

router.get('/:id/provas', listarProvasDaTurma);

router.get('/:id/alunos', listarAlunosDaTurma);

module.exports = router;
