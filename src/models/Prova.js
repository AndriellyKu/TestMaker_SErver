const mongoose = require('mongoose');

const provaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    professorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referência ao modelo de usuário (professor)
        required: true,
    },
    turmaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turma', // Referência ao modelo de turma
        required: true,
    },
    perguntas: [
        {
            pergunta: {
                type: String,
                required: true, // Texto da pergunta
            },
            resposta: {
                type: String,
                required: true, // Resposta da pergunta gerada pela IA
            }
        }
    ],
    data: {
        type: Date,
        default: Date.now,
    },
});

const Prova = mongoose.model('Prova', provaSchema);

module.exports = Prova;
