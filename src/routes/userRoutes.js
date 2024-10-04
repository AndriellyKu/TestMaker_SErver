const express = require('express');
const { getUser, updateUser } = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../middleware/multerConfig.js'); 
const router = express.Router();

router.get('/:id', authenticateToken, getUser);

router.put('/:id', authenticateToken, updateUser);

router.put('/:id', authenticateToken, upload.single('profilePicture'), updateUser);


module.exports = router;
