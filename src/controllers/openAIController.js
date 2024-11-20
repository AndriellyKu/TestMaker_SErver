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

// Função para validar JSON
function isValidJSON(str) {
  try {
      JSON.parse(str);
      return true;
  } catch (e) {
      return false;
  }
}

// Função para gerar perguntas com validação do JSON
const gerarPerguntasComValidacao = async (conteudo, questionCount, questionTypes, maxTentativas = 3) => {
  let tentativas = 0;
  let perguntasGeradas = [];

  while (tentativas < maxTentativas) {
    try {
      // Gera as perguntas com o OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Você é um gerador de questões para provas. Inclua respostas para cada pergunta no formato JSON sem espaços ou quebra de linha. Use apenas aspas duplas NUNCA USE aspas simples" },
          {
            role: "user",
            content: `Crie ${questionCount} questões do tipo ${questionTypes.join(", ")} sobre o seguinte conteúdo: ${conteudo}. 
            Inclua as respostas para as questões e, no caso de múltipla escolha, crie alternativas. 
            Responda em formato JSON sem espaços com a seguinte estrutura para cada pergunta:
            [          
              {
                "pergunta": "Texto da pergunta",
                "resposta": "Texto da resposta ou um array de alternativas",
                "tipo": "Tipo da pergunta (ex: 'multiple-choice', 'short-answer', etc.)",
                "categoria": "Categoria opcional"
              },
              {
                "pergunta": "Texto da pergunta",
                "resposta": 
                  {
                    "alternativas": ["Primeira alternativa", "Segunda alternativa", "Terceira alternativa", "Quarta alternativa", "Quinta alternativa"], // array com todas as alternativas
                    "respostaCorreta": 2 // índice da alternativa correta
                  },
                "tipo": "multiple-choice",
                "categoria": "Categoria opcional"
              }
            ]`,
          },
        ],
      });

      if (!response.choices || response.choices.length === 0) {
        throw new Error("Nenhuma resposta foi gerada pela IA.");
      }

      const resposta = response.choices[0].message.content;

      // Verifica se o JSON gerado é válido
      if (isValidJSON(resposta)) {
        // Se for válido, converte e retorna as perguntas
        perguntasGeradas = JSON.parse(resposta);

        return perguntasGeradas.map((pergunta) => {
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
      } else {
        // Se não for válido, tentamos novamente
        tentativas++;
        console.error(`Tentativa ${tentativas} falhou: Resposta não é um JSON válido`);
      }

    } catch (error) {
      tentativas++;
      console.error(`Tentativa ${tentativas} falhou: ${error.message}`);
    }

    // Se atingiu o número máximo de tentativas, lança um erro
    if (tentativas >= maxTentativas) {
      throw new Error("Erro ao gerar perguntas após várias tentativas.");
    }
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

  const professorId = user.id; // Aqui o professorId vem da requisição
  const { provaId, prompt, link, pdf, questionCount = 5, questionTypes = ["Múltipla escolha"], title, description } = req.body;

  // Converte o professorId (e qualquer outro id) para ObjectId
  const professorObjectId = mongoose.Types.ObjectId(professorId);

  // Converte o provaId para ObjectId também
  const provaObjectId = mongoose.Types.ObjectId(provaId);
try {
    // Verifica se a prova pertence ao professor, usando o ObjectId
    const provaExistente = await Prova.findOne({ _id: provaObjectId, professorId: professorObjectId });
    if (!provaExistente) {
      return res.status(404).json({
        error: "Prova não encontrada ou você não tem permissão para alterá-la.",
      });
    }

    let perguntasGeradas = [];

    // Gera perguntas com base no tipo de entrada fornecido
    if (prompt) {
      perguntasGeradas = await gerarPerguntasComValidacao(prompt, questionCount, questionTypes);
    } else if (link) {
      const conteudo = await extrairConteudoDoLink(link);
      perguntasGeradas = await gerarPerguntasComValidacao(conteudo, questionCount, questionTypes);
    } else if (pdf) {
      const pdfPath = path.resolve(__dirname, "../uploads", pdf); // Supõe o envio de nome do arquivo
      if (!fs.existsSync(pdfPath)) {
        throw new Error("O arquivo PDF especificado não foi encontrado.");
      }
      const pdfBuffer = fs.readFileSync(pdfPath);
      const conteudo = await extrairConteudoDoPDF(pdfBuffer);
      perguntasGeradas = await gerarPerguntasComValidacao(conteudo, questionCount, questionTypes);
    }

    // Atualiza os dados da prova
    if (title) provaExistente.title = title;
    if (description) provaExistente.description = description;
    provaExistente.perguntas = perguntasGeradas;

    await provaExistente.save();
    res.status(200).json(provaExistente);
  } catch (error) {
    console.error("Erro ao atualizar a prova:", error.message);
    res.status(500).json({ error: error.message || "Erro ao atualizar a prova." });
  }
};


module.exports = {
  atualizarPerguntasDaProva,
};
