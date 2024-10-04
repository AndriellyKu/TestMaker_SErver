const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); 
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { username, email, password, userType, escola } = req.body;

        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já registrado' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria um novo usuário
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            userType,
            escola,
            profilePicture: req.file ? req.file.path : null, // Aqui é onde o caminho do arquivo de imagem é adicionado
        });

        // Salva o novo usuário no banco de dados
        await newUser.save();

        return res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar o usuário:', error);
        return res.status(500).json({ error: 'Erro ao registrar o usuário' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        // Verifica se a senha está correta
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("A senha confere:", isMatch);
        

        // Cria um token JWT
        const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(200).json({ message: 'Login realizado com sucesso!', token });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        return res.status(500).json({ error: 'Erro ao realizar login' });
    }
};

module.exports = { register, login };
