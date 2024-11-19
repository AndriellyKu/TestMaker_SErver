const mongoose = require('mongoose');


function generateUniqueCode() {
    return new mongoose.Types.ObjectId().toString().slice(-6); 
}


const turmaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    codigo: {  
        type: String,
        unique: true,
        default: generateUniqueCode,  
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
    background: { 
        type: String,
    }
}, {
    timestamps: true,
});


const Turma = mongoose.model('Turma', turmaSchema);

module.exports = Turma;
