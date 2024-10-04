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
    background: {
        type: String,
        default: 'default_bg.jpg',
    },
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, 
});

const Turma = mongoose.model('Turma', turmaSchema);

module.exports = Turma;
