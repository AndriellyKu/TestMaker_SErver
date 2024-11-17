const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Alterado para bcryptjs

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'O nome de usuário é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório'],
        unique: true,
        match: [/.+@.+\..+/, 'Por favor, insira um email válido']
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        minlength: [8, 'A senha deve ter pelo menos 8 caracteres']
    },
    userType: {
        type: String,
        required: [true, 'O tipo de usuário é obrigatório'],
        enum: ['professor', 'aluno']
    },
    escola: {
        type: String,
        required: [true, 'O nome da escola é obrigatório']
    },
    profilePicture: {
        type: String,
        default: null 
    },
    turmas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turma'
    }]
});

// Middleware para hash de senha antes de salvar o usuário
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // Gera o salt
        this.password = await bcrypt.hash(this.password, salt); // Hasheia a senha
        next(); // Continua o fluxo
    } catch (error) {
        next(error); // Passa o erro para o próximo middleware
    }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password); // Compara a senha fornecida com a hasheada
};

// Criação do modelo User
const User = mongoose.model('User', userSchema);

module.exports = User;
