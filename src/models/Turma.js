const mongoose = require('mongoose');

// Função para gerar código único
function generateUniqueCode() {
    return new mongoose.Types.ObjectId().toString().slice(-6); 
}

// Definição do Schema da Turma
const turmaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    turma: {
        type: String,
        required: true,
    },
    professorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    alunos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    codigo: {
        type: String,
        unique: true,
        default: generateUniqueCode,
    },
    background: {  // Novo campo para armazenar o background selecionado
        type: String,
    }
}, {
    timestamps: true,
});


// Definindo o modelo para a collection 'turmas'
const Turma = mongoose.model('Turma', turmaSchema);

module.exports = Turma;
