const mongoose = require('mongoose');

const turmaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    turma: {
        type: String,
        required: true,
    },
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    alunos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    background: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});

const Turma = mongoose.model('Turma', turmaSchema);

module.exports = Turma;
