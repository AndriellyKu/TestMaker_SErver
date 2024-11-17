const { OpenAI } = require('openai'); // Importa o cliente OpenAI
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const Prova = require('../models/Prova'); // Importa o modelo de Prova
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Inicializa o cliente OpenAI com a chave da API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Função para gerar questões e atualizar a prova existente no banco de dados
const gerarQuestoes = async (req, res) => {
  const { questionCount, questionTypes, examYear, examName, prompt, professorId, turmaId, files, links } = req.body;
  console.log(professorId);
  console.log('Me responda apenas asGerando questões com', questionCount, 'questões do tipo', questionTypes, 'para o exame de', examYear, 'com o nome', examName);

  try {
    const perguntas = [];
    const batchSize = 5; // Tamanho do lote

    // Função auxiliar para processar lotes
    const processBatch = async (batchStart, contentSource) => {
      const batchEnd = Math.min(batchStart + batchSize, questionCount);
      const batchQuestions = [];

      for (let i = batchStart; i < batchEnd; i++) {
        const promptMessage = `Gere uma questão do tipo ${questionTypes[i % questionTypes.length]} para o ano ${examYear} sobre ${examName}. ${contentSource}`;
        const resposta = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: promptMessage }],
        });
        batchQuestions.push(resposta.choices[0].message.content);
      }

      return batchQuestions;
    };

    // Processamento de diferentes fontes
    let contentSource = prompt || links.join(', ') || 'Nenhuma entrada fornecida';
    const batchQuestions = await processBatch(0, contentSource);
    perguntas.push(...batchQuestions);

    // Procurar a prova existente ou criar uma nova
    const provaExistente = await Prova.findOne({ professorId, turmaId, title: examName });

    if (provaExistente) {
      // Se a prova já existe, atualizamos o array de perguntas
      const updatedProva = await Prova.findByIdAndUpdate(
        provaExistente.id,
        {
          $push: {
            perguntas: perguntas.map(pergunta => ({
              pergunta: pergunta,
              resposta: 'Resposta gerada automaticamente', // Ajuste conforme necessário
            })),
          }
        },
        { new: true, runValidators: true } // Retorna o documento atualizado
      );

      // Retorna as questões geradas para o cliente
      return res.status(200).json({ perguntas, updatedProva });
    } else {
      // Se a prova não existe, cria uma nova
      const novaProva = new Prova({
        title: examName,
        description: 'Descrição da prova', // Ajuste conforme necessário
        professorId, // Recebe o ID do professor
        turmaId, // Recebe o ID da turma
        perguntas: perguntas.map(pergunta => ({
          pergunta: pergunta,
          resposta: 'Resposta gerada automaticamente', // Pode ajustar ou adicionar outra lógica para gerar as respostas
        })),
      });

      // Salva a nova prova no banco de dados
      await novaProva.save();

      // Retorna as questões geradas para o cliente
      return res.status(201).json({ perguntas });
    }
  } catch (error) {
    console.error('Erro ao gerar questões:', error);
    res.status(500).json({ error: 'Erro ao gerar questões.' });
  }
};

module.exports = { gerarQuestoes };
