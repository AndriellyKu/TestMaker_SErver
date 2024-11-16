const Prova = require('../models/Prova');


// Função para listar provas criadas pelo professor
const listarProvasDoProfessor = async (req, res) => {
    const professorId = req.user._id; // Assumindo que `req.user` contém o `professorId`
    
    try {
        const provas = await Prova.find({ professorId }).populate('turmaId', 'nome');
        res.status(200).json(provas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar provas do professor: ' + error.message });
    }
};

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
    listarProvasDoProfessor, excluirProva, criarProva 
};
