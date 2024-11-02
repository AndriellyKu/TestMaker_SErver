const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    }
});

userSchema.pre('save', async function (next) {
 
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); 
        this.password = await bcrypt.hash(this.password, salt); 
        next(); 
    } catch (error) {
        next(error); 
    }
});


userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User;
