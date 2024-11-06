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
    console.log("Professor ID:", professorId); 

    const professor = await User.findById(professorId, 'username profilePicture');
    if (!professor) {
      console.log("Professor não encontrado");
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    res.json({ name: professor.username, profilePic: professor.profilePicture });
  } catch (error) {
    console.error("Erro ao buscar dados do professor:", error);
    res.status(500).json({ message: 'Erro ao buscar dados do professor', error });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { nome, email } = req.body; // Campos que você deseja atualizar

  try {
      const updatedUser = await User.findByIdAndUpdate(userId, { nome, email }, { new: true });
      if (!updatedUser) return res.status(404).json({ message: "Usuário não encontrado" });
      res.status(200).json(updatedUser);
  } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário", error });
  }
};


module.exports = { getUser, updateUser, getProfessorData };
