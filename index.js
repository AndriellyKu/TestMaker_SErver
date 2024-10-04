const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json()); 
app.use(cors()); 


mongoose.connect('mongodb://localhost:27017/TestMakerBD') 
  .then(() => {
    console.log("Conectado ao MongoDB");
  })
  .catch(err => console.log(err));


app.use('/auth', authRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
