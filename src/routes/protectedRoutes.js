const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();


router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Você acessou uma rota protegida!' });
});

module.exports = router;
