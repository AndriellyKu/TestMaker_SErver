const Turma = require('../models/Turma'); // Importe o modelo Turma
const Prova = require('../models/Prova');

// Função para criar uma nova turma
const criarTurma = async (req, res) => {
    try {
        const { nome, turma, professorId, background } = req.body;

        if (!nome || !turma || !professorId || !background) {
            return res.status(400).json({ message: 'Nome, turma, professor e background são obrigatórios.' });
        }

        const novaTurma = new Turma({
            nome,
            turma,
            professorId,
            background,
            alunos: [] // Inicialmente, a turma não tem alunos
        });

        await novaTurma.save();

        return res.status(201).json({
            message: 'Turma criada com sucesso!',
            turma: novaTurma
        });
    } catch (error) {
        console.error('Erro ao criar turma:', error);
        return res.status(500).json({
            message: 'Erro ao criar a turma.',
            error: error.message
        });
    }
};

// Função para listar todas as turmas de um professor autenticado
const listarTurmasDoProfessor = async (req, res) => {
    try {
        const professorId = req.user.id;

        const turmas = await Turma.find({ professorId });

        return res.status(200).json(turmas);
    } catch (error) {
        console.error('Erro ao listar turmas:', error);
        return res.status(500).json({ message: 'Erro ao listar turmas' });
    }
};


// Função para deletar uma turma específica criada pelo professor autenticado
const deletarTurma = async (req, res) => {
    try {
        const professorId = req.user.id;
        const turmaId = req.params.id;

        const turma = await Turma.findOne({ _id: turmaId, professorId });

        if (!turma) {
            return res.status(404).json({ message: 'Turma não encontrada ou você não tem permissão para deletá-la.' });
        }

        await Turma.deleteOne({ _id: turmaId });

        return res.status(200).json({ message: 'Turma deletada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar turma:', error);
        return res.status(500).json({ message: 'Erro ao deletar turma' });
    }
};

const listarAlunosDaTurma = async (req, res) => {
    try {
        const turmaId = req.params.id; // ID da turma

        // Encontra a turma e popula os alunos com apenas os campos necessários
        const turma = await Turma.findById(turmaId)
            .populate({
                path: 'alunos',
                select: 'username profilePicture escola'  // Seleciona apenas os campos necessários
            });

        if (!turma) {
            return res.status(404).json({ message: 'Turma não encontrada.' });
        }

        const alunos = turma.alunos || []; // Garante que 'alunos' seja um array

        // Retorna os alunos da turma com os campos selecionados
        return res.status(200).json(alunos);
    } catch (error) {
        console.error('Erro ao listar alunos:', error);
        return res.status(500).json({ message: 'Erro ao listar alunos da turma.' });
    }
};

const listarProvasDaTurma = async (req, res) => {
    try {
        const turmaId = req.params.id; // Obtém o ID da turma da URL

        // Busca todas as provas associadas à turma
        const provas = await Prova.find({ turmaId });

        if (!provas.length) {
            return res.status(404).json({ message: 'Nenhuma prova encontrada para esta turma.' });
        }

        return res.status(200).json(provas);
    } catch (error) {
        console.error('Erro ao listar provas:', error);
        return res.status(500).json({ message: 'Erro ao listar provas.' });
    }
};


// Exportação das funções para uso em rotas
module.exports = {
    listarProvasDaTurma,
    criarTurma,
    listarTurmasDoProfessor,
    deletarTurma,
    listarAlunosDaTurma
};
