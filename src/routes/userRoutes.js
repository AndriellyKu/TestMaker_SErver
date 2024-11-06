const express = require('express');
const { getUser, updateUser, getProfessorData } = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();
const multer = require('multer');

router.get('/professor-data', authenticateToken, getProfessorData);

router.get('/:id', authenticateToken, getUser);

router.put('/:id', authenticateToken, updateUser);



module.exports = router;
