const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Token recebido:', token);  // Log do token recebido

    if (token == null) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Erro ao verificar o token:', err);  // Log do erro
            return res.status(403).json({ message: 'Token inválido' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
