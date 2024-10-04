const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const upload = require('../middleware/multerConfig'); // Correto

router.post('/register', upload.single('profilePicture'), register);

router.post('/login', login);

module.exports = router;
