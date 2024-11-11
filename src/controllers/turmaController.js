const Turma = require('../models/Turma'); // Importe o modelo Turma

// Função para criar a turma
const criarTurma = async (req, res) => {
    try {
        // Extrai os dados do corpo da requisição
        const { nome, turma, professorId, background } = req.body;

        if (!nome || !turma || !professorId || !background) {
          return res.status(400).json({ message: 'Nome, turma, professor e background são obrigatórios.' });
        }
        
        // Cria a nova turma com o professorId e o background
        const novaTurma = new Turma({
          nome,
          turma,
          professorId,
          background, // Salva o campo background
          alunos: [], // Inicialmente, a turma não tem alunos
        });
        
        // Salva a nova turma no banco de dados
        await novaTurma.save();

        // Retorna a turma criada com um status 201 (Created)
        return res.status(201).json({
            message: 'Turma criada com sucesso!',
            turma: novaTurma,
        });
    } catch (error) {
        // Caso haja erro, retorna o erro com um status 500 (Internal Server Error)
        console.error(error);
        return res.status(500).json({
            message: 'Erro ao criar a turma.',
            error: error.message,
        });
    }
};

// Função para listar as turmas
// Função para listar as turmas criadas pelo professor autenticado
const listarTurmasDoProfessor = async (req, res) => {
  try {
      const professorId = req.user.id;  // Obtém o ID do professor a partir do token de autenticação

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

// Exportação das funções
module.exports = {
  criarTurma,
  listarTurmasDoProfessor,
  deletarTurma,
  // outras funções, se necessário
};