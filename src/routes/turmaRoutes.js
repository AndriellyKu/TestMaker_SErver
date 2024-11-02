const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');
const { verificarProfessor } = require('../middlewares/auth');


router.post('/criar-turma', verificarProfessor, turmaController.criarTurma);

module.exports = router;
