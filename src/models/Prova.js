const mongoose = require("mongoose");

const provaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    turmaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turma",
      required: true,
    },
    perguntas: [
      {
        pergunta: { type: String, required: true },
        resposta: { type: mongoose.Schema.Types.Mixed, required: true },
        tipo: {
          type: String,
          enum: ["multiple-choice", "short-answer", "paragraph", "checkbox"],
          required: true,
        },
        categoria: { type: String, trim: true }, // Opcional
      },
    ],
    
    status: {
      type: String,
      enum: ["rascunho", "finalizado"],
      default: "rascunho",
    },
    data: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Inclui `createdAt` e `updatedAt` automaticamente
  }
);

module.exports = mongoose.model("Prova", provaSchema);
