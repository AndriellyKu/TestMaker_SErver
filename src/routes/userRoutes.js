const express = require('express');
const { getUser, updateUser, getProfessorData } = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();


router.get('/:id', authenticateToken, getUser);


router.put('/:id', authenticateToken, updateUser);


router.get('/professor-data', authenticateToken, getProfessorData);

module.exports = router;
