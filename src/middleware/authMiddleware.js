const express = require('express');
const authMiddleware = require('./middlewares/authMiddleware'); 

const app = express();

app.use(express.json());


app.get('/public', (req, res) => {
    res.send('Esta é uma rota pública.');
});

app.get('/protected', authMiddleware, (req, res) => {
    res.send(`Bem-vindo, ${req.user.username}!`);
});

