import { StreamingTextResponse, OpenAIStream } from "ai";
import { createOpenAIClient } from "@/lib/openai/client";
import { COLLABORATOR_ASSISTANT_PROMPT } from "@/lib/openai/collaborator-prompt";
import { isCollaboratorAuthenticated } from "@/lib/auth/collaborator";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isCollaboratorAuthenticated())) {
    return new Response("Non autorisé", { status: 401 });
  }

  try {
    const { messages } = await req.json();
    const openai = createOpenAIClient();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      temperature: 0.4,
      max_tokens: 1200,
      messages: [
        {
          role: "system",
          content: COLLABORATOR_ASSISTANT_PROMPT,
        },
        ...(messages ?? []),
      ],
    });

    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Erreur chatbot collaborateurs:", error);
    return new Response("Erreur during chat processing", { status: 500 });
  }
}
