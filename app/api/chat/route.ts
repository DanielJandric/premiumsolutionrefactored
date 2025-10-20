import { CHATBOT_SYSTEM_PROMPT } from "@/lib/openai/prompts";
import { createOpenAIClient } from "@/lib/openai/client";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const openai = createOpenAIClient();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: CHATBOT_SYSTEM_PROMPT,
        },
        ...messages,
      ],
    });

    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Erreur API Chat:", error);
    return new Response("Erreur lors de la génération de la réponse", {
      status: 500,
    });
  }
}
