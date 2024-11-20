const Prova = require('../models/Prova');
const { gerarQuestoes } = require('../controllers/openAIController');
const fs = require("fs");
const path = require("path");

const atualizarPerguntasDaProva = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const professorId = req.user.id;
  const { provaId, prompt, link, pdf, questionCount, questionTypes, title, description } = req.body;

  try {
    // Verifica se a prova existe e pertence ao professor
    const provaExistente = await Prova.findOne({ _id: provaId, professorId });
    if (!provaExistente) {
      return res.status(404).json({ error: 'Prova não encontrada ou você não tem permissão para alterá-la' });
    }

    // Gerar as perguntas com base no prompt, link ou PDF
    let perguntasGeradas = [];

    if (prompt) {
      perguntasGeradas = await gerarPerguntasComPrompt(prompt, questionCount, questionTypes);
    } else if (link) {
      perguntasGeradas = await gerarPerguntasComLink(link, questionCount, questionTypes);
    } else if (pdf) {
      const pdfBuffer = fs.readFileSync(path.resolve(__dirname, "../uploads", pdf)); // Supondo que o PDF esteja em /uploads
      perguntasGeradas = await gerarPerguntasComPDF(pdfBuffer, questionCount, questionTypes);
    }

    // Atualizar a prova com as novas perguntas e título/descrição
    provaExistente.perguntas = perguntasGeradas;
    if (title) provaExistente.title = title;
    if (description) provaExistente.description = description;
    
    await provaExistente.save();

    res.status(200).json(provaExistente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar a prova' });
  }
};

module.exports = {
  atualizarPerguntasDaProva,
};
