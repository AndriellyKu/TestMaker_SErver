const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const turmaRouter = require('./src/routes/turmaRoutes'); // Importa as rotas da turma
const alunoRouter = require('./src/routes/alunoRouter');
const provaRoutes = require('./src/routes/provaRoutes'); // Certifique-se de que está corretamente importado
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuração do middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: 'https://test-maker-front-liard.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch(err => console.log(err));

// Definindo as rotas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/turmas', turmaRouter);
app.use('/alunos', alunoRouter);
app.use('/provas', provaRoutes); // Corrigida a vírgula aqui

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
