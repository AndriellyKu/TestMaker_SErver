const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const turmaRouter = require('./src/routes/turmaRoutes');
const alunoRouter = require('./src/routes/alunoRouter');
const provaRoutes = require('./src/routes/provaRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();


const allowedOrigins = [
  'http://localhost:5173',
  'https://test-maker-front-liard.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch(err => console.log(err));


app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/turmas', turmaRouter);
app.use('/alunos', alunoRouter);
app.use('/provas', provaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
