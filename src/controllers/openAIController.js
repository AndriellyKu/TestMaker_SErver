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

const gerarQuestoes = async (req, res) => {
  const { questionCount, questionTypes, examYear, examName, professorId, turmaId } = req.body;

  try {
    const perguntasRespostas = [];
    const batchSize = 5; // Tamanho do lote

    const processBatch = async (batchStart) => {
      const batchEnd = Math.min(batchStart + batchSize, questionCount);
      const batchQuestions = [];

      for (let i = batchStart; i < batchEnd; i++) {
        const promptMessage = `
          Gere uma pergunta objetiva do tipo "${questionTypes[i % questionTypes.length]}" sobre o tema "${examName}" para o ano "${examYear}". 
          Em seguida, forneça uma resposta para essa pergunta no formato:
          Pergunta: [Aqui a pergunta]
          Resposta: [Aqui a resposta]
        `;

        const resposta = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: promptMessage }],
        });

        // Filtrar perguntas e respostas
        const rawResponse = resposta.choices[0].message.content;
        const parsedQuestions = rawResponse
          .split('\n') // Divide por linhas
          .map((linha) => linha.trim()) // Remove espaços
          .filter((linha) => linha.includes('Pergunta:') || linha.includes('Resposta:')); // Apenas linhas relevantes

        // Agrupar pergunta-resposta
        for (let j = 0; j < parsedQuestions.length; j += 2) {
          const pergunta = parsedQuestions[j].replace('Pergunta:', '').trim();
          const resposta = parsedQuestions[j + 1]?.replace('Resposta:', '').trim() || 'Resposta não gerada.';
          batchQuestions.push({ pergunta, resposta });
        }
      }

      return batchQuestions;
    };

    // Processar em lotes
    const batchQuestions = await processBatch(0);
    perguntasRespostas.push(...batchQuestions);

    // Procurar ou criar prova
    const provaExistente = await Prova.findOne({ professorId, turmaId, title: examName });

    if (provaExistente) {
      const updatedProva = await Prova.findByIdAndUpdate(
        provaExistente.id,
        {
          $push: {
            perguntas: perguntasRespostas,
          },
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({ perguntas: perguntasRespostas, updatedProva });
    } else {
      const novaProva = new Prova({
        title: examName,
        description: 'Descrição da prova',
        professorId,
        turmaId,
        perguntas: perguntasRespostas,
      });

      await novaProva.save();
      return res.status(201).json({ perguntas: perguntasRespostas });
    }
  } catch (error) {
    console.error('Erro ao gerar questões:', error);
    res.status(500).json({ error: 'Erro ao gerar questões.' });
  }
};

module.exports = { gerarQuestoes };
