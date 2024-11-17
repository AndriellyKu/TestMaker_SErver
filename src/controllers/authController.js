const bcrypt = require('bcryptjs'); // Alterado para bcryptjs
const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); 
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { username, email, password, userType, escola } = req.body;
        console.log(username, email, password, userType, escola);
        const profilePicture = req.file ? req.file.path : null; // Valida se `req.file` existe

        if (!username || !email || !password || !userType || !escola) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        console.log("Imagem recebida:", profilePicture); // Para verificar o caminho

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email já registrado" });
        }

        console.log(username, email, password, userType, escola);

        // Hashear a senha antes de salvar o usuário
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Salva a senha hasheada
            userType,
            escola,
            profilePicture
        });

        await newUser.save();
        res.status(201).json({ message: "Usuário registrado com sucesso" });
    } catch (error) {
        console.error("Erro ao registrar o usuário:", error);
        res.status(500).json({ message: "Erro ao registrar o usuário", error: error.toString() });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        // Comparar a senha fornecida com a hasheada no banco
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Senha incorreta' });
        }

        // Gerar o token JWT
        const token = jwt.sign(
            { id: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({ token, userType: user.userType });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao realizar login', error });
    }
};

module.exports = { register, login };
