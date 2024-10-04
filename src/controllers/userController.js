const User = require('../models/User');


const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Não retornar a senha
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao obter o perfil do usuário:', error);
        return res.status(500).json({ error: 'Erro ao obter o perfil do usuário' });
    }
};


const updateUser = async (req, res) => {
    try {
        const { username, email, escola } = req.body;
        const profilePicture = req.file ? req.file.filename : null;

        const updatedData = { username, email, escola };
        if (profilePicture) {
            updatedData.profilePicture = profilePicture;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};


module.exports = { getUser, updateUser };
