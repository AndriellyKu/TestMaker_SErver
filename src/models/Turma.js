const mongoose = require('mongoose');

// Função para gerar código único
function generateUniqueCode() {
    return new mongoose.Types.ObjectId().toString().slice(-6); 
}

// Definição do Schema da Turma
const turmaSchema = new mongoose.Schema({
    nome: {  // Nome da turma
        type: String,
        required: true,
    },
    codigo: {  // Código único da turma
        type: String,
        unique: true,
        default: generateUniqueCode,  // Gera um código único para cada turma
    },
    professorId: {  // Referência para o professor
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    alunos: [{  // Alunos matriculados na turma
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    background: {  // Novo campo para armazenar o background selecionado
        type: String,
    }
}, {
    timestamps: true,
});

// Definindo o modelo para a collection 'turmas'
const Turma = mongoose.model('Turma', turmaSchema);

module.exports = Turma;
