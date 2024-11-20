const Prova = require('../models/Prova');

async function listarProvasDaTurma(req, res) {
  try {
    const turmaId = req.params.turmaId;

    // Buscar as provas associadas à turma
    const provas = await Prova.find({ turmaId: turmaId }).populate('turmaId'); // Populando a referência da turma, se necessário.

    if (!provas) {
      return res.status(404).json({ message: 'Nenhuma prova encontrada para esta turma.' });
    }

    return res.status(200).json(provas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar provas da turma.' });
  }
}


const excluirProva = async (req, res) => {
    const { id } = req.params; 
    const professorId = req.user._id; 

    try {
        const prova = await Prova.findOneAndDelete({ _id: id, professorId });
        
        if (!prova) {
            return res.status(404).json({ error: 'Prova não encontrada ou você não tem permissão para excluí-la' });
        }

        res.status(200).json({ message: 'Prova excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir a prova: ' + error.message });
    }
};

// Função para criar uma nova prova
const criarProva = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    const professorId = req.user.id; // Agora é seguro acessar `req.user`
    const { title, description, turmaId } = req.body;

    try {
        const novaProva = await Prova.create({
            title,
            description,
            professorId,
            turmaId,
        });

        res.status(201).json(novaProva);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar a prova: ' + error.message });
    }
};




module.exports = { 
    listarProvasDaTurma, excluirProva, criarProva 
};
