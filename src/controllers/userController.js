const User = require('../models/User');

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error });
  }
};


const getProfessorData = async (req, res) => {
  try {
    const professorId = req.user.id; 
    const professor = await User.findById(professorId);
    
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    
    res.json({ name: professor.username, profilePic: professor.profilePicture });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dados do professor', error });
  }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { profilePicture, email, username, userType, escola } = req.body; 

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            profilePicture,
            email,
            username,
            userType,
            escola
        }, { new: true }); 

        if (!updatedUser) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao atualizar usuário', error });
    }
};


module.exports = { getUser, updateUser, getProfessorData };
