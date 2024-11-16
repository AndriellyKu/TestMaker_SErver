const Turma = require('../models/Turma');
const User = require('../models/User');



// Controller para o aluno entrar em uma turma usando o código
const entrarNaTurma = async (req, res) => {
    try {
        const { codigo } = req.body;  // Código da turma fornecido pelo aluno
        const usuario = req.user;  // Usuário autenticado pelo middleware
        
        // Verifica se o código da turma é válido
        const turma = await Turma.findOne({ codigo });
        if (!turma) {
            return res.status(404).json({ message: "Turma não encontrada." });
        }
        
        // Verifica se o aluno já está na turma
        if (turma.alunos.includes(usuario.id)) {
            return res.status(400).json({ message: "Você já está matriculado nesta turma." });
        }
        
        // Adiciona o aluno à turma
        turma.alunos.push(usuario.id);
        await turma.save();

        // Também é uma boa prática adicionar a turma ao usuário
        const aluno = await User.findById(usuario.id);
        if (aluno) {
            aluno.turmas.push(turma.id);  // Adiciona a turma ao campo `turmas` do aluno
            await aluno.save();
        }

        res.status(200).json({ message: "Você entrou na turma com sucesso.", turma });
    } catch (error) {
        console.error("Erro ao entrar na turma:", error);
        res.status(500).json({ message: "Erro ao tentar entrar na turma." });
    }
};

// Controller para listar as turmas do aluno autenticado
const listarTurmasDoAluno = async (req, res) => {
    try {
        const alunoId = req.user.id; // Obtém o ID do aluno a partir do token autenticado
        const aluno = await User.findById(alunoId).populate('turmas'); // Usando User em vez de Aluno

        if (!aluno) {
            return res.status(404).json({ message: 'Aluno não encontrado' });
        }

        res.json({ turmas: aluno.turmas });
    } catch (error) {
        console.error("Erro ao listar turmas do aluno:", error);
        res.status(500).json({ message: 'Erro ao listar turmas' });
    }
};

// Exporta as funções corretamente
module.exports = { listarTurmasDoAluno, entrarNaTurma };
