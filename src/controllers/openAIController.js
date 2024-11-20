const { OpenAI } = require("openai");
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Prova = require("../models/Prova");

// Configuração do OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mapeamento de tipos para valores compatíveis com o schema
const tipoMap = {
  "Múltipla escolha": "multiple-choice",
  "Resposta curta": "short-answer",
  "Parágrafo": "paragraph",
  "Checkbox": "checkbox",
};

// Função para gerar perguntas usando o OpenAI
const gerarPerguntas = async (conteudo, questionCount, questionTypes) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Você é um gerador de questões para provas. Inclua respostas para cada pergunta no formato JSON sem espaços ou quebra de linha. Use apenas aspas duplas NUNCA USE aspas simples" },
        {
          role: "user",
          content: `Crie ${questionCount} questões do tipo ${questionTypes.join(
            ", "
          )} sobre o seguinte conteúdo: ${conteudo}. 
          Inclua as respostas para as questões e, no caso de múltipla escolha, crie alternativas. 
          Responda em formato JSON sem espaços com a seguinte estrutura para cada pergunta:
          [          {
            "pergunta": "Texto da pergunta",
            "resposta": "Texto da resposta ou um array de alternativas",
            "tipo": "Tipo da pergunta (ex: 'multiple-choice', 'short-answer', etc.)",
            "categoria": "Categoria opcional"
          },          {
            "pergunta": "Texto da pergunta",
            "resposta": 
              {
                "alternativas": ["Primeira alternativa", "Segunda alternativa", "Terceira alternativa", "Quarta alternativa", "Quinta alternativa"] // array com todas as alternativas
                "respostaCorreta": 2 // index da alternativa correta
              }
            "tipo":"multiple-choice",
            "categoria": "Categoria opcional"
          }]`,
        },
      ],
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error("Nenhuma resposta foi gerada pela IA.");
    }
    console.log(response.choices[0].message.content)
    // Aqui, ao invés de fazer split por '\n', o resultado será em formato JSON, facilitando a manipulação
    const perguntas = JSON.parse(response.choices[0].message.content);
    console.log(perguntas)

    return perguntas.map((pergunta) => {
      // Formata a resposta corretamente para "multiple-choice"
      if (pergunta.tipo === "multiple-choice" && Array.isArray(pergunta.resposta)) {
        return {
          pergunta: pergunta.pergunta,
          resposta: pergunta.resposta,
          tipo: pergunta.tipo,
          categoria: pergunta.categoria || "Geral",
        };
      }

      return {
        pergunta: pergunta.pergunta,
        resposta: pergunta.resposta,
        tipo: pergunta.tipo,
        categoria: pergunta.categoria || "Geral",
      };
    });
  } catch (error) {
    console.error("Erro ao gerar perguntas:", error.message);
    throw new Error("Erro ao gerar perguntas com IA.");
  }
  
};


// Função para extrair conteúdo de um PDF
const extrairConteudoDoPDF = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Erro ao extrair conteúdo do PDF:", error.message);
    throw new Error("Erro ao processar o PDF.");
  }
};

// Função para obter conteúdo de um link
const extrairConteudoDoLink = async (link) => {
  try {
    const response = await axios.get(link);
    return response.data; // Supondo que o link retorna texto
  } catch (error) {
    console.error("Erro ao acessar o link:", error.message);
    throw new Error("Erro ao processar o link fornecido.");
  }
};

// Função principal para atualizar perguntas de uma prova existente
const atualizarPerguntasDaProva = async (req, res) => {
  const { user } = req;
  if (!user) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  const professorId = user.id;
  console.log(professorId)

  const {
    provaId,
    prompt,
    link,
    pdf,
    questionCount = 5,
    questionTypes = ["Múltipla escolha"],
    title,
    description,
  } = req.body;
  console.log(provaId)
  try {
    // Verifica se a prova pertence ao professor
    const provaExistente = await Prova.findOne({ _id: provaId, professorId });
    if (!provaExistente) {
      return res.status(404).json({
        error: "Prova não encontrada ou você não tem permissão para alterá-la.",
      });
    }

    let perguntasGeradas = [];

    // Gera perguntas com base no tipo de entrada fornecido
    if (prompt) {
      perguntasGeradas = await gerarPerguntas(prompt, questionCount, questionTypes);
      
    } else if (link) {
      const conteudo = await extrairConteudoDoLink(link);
      perguntasGeradas = await gerarPerguntas(conteudo, questionCount, questionTypes);
    } else if (pdf) {
      const pdfPath = path.resolve(__dirname, "../uploads", pdf); // Supõe o envio de nome do arquivo
      if (!fs.existsSync(pdfPath)) {
        throw new Error("O arquivo PDF especificado não foi encontrado.");
      }
      const pdfBuffer = fs.readFileSync(pdfPath);
      const conteudo = await extrairConteudoDoPDF(pdfBuffer);
      perguntasGeradas = await gerarPerguntas(conteudo, questionCount, questionTypes);
    }

    // Atualiza os dados da prova
    if (title) provaExistente.title = title;
    if (description) provaExistente.description = description;
    provaExistente.perguntas = perguntasGeradas;

    await provaExistente.save();
    res.status(200).json(provaExistente);
  } catch (error) {
    console.error("Erro ao atualizar a prova:", error.message);
    res.status(500).json({ error: "Erro ao atualizar a prova." });
  }
};

function isValidJSON(str) {
  try {
      JSON.parse(str);
      return true;
  } catch (e) {
      return false;
  }
}

module.exports = {
  atualizarPerguntasDaProva,
};
