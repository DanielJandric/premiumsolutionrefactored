import OpenAI from "openai";

export function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Clé OpenAI manquante. Définissez OPENAI_API_KEY dans vos variables d'environnement.",
    );
  }

  return new OpenAI({
    apiKey,
  });
}
