import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);

const MODEL = "meta-llama/Llama-3.1-8B-Instruct";

export async function generateAnswer(question: string, context: string) {
  const response = await hf.chatCompletion({
    model: MODEL,

    messages: [
      {
        role: "system",
        content: `
You are an AI assistant for a personal note-taking application.

Your job is to answer the user's question using the provided notes.

Rules:
- Use the provided notes as your primary source.
- Do not invent information.
- If the notes do not contain enough information to answer,
  clearly say that you could not find the answer in the user's notes.
- Keep the answer clear and concise.
- Do not mention "context", "retrieval", or "RAG" to the user.
        `.trim(),
      },
      {
        role: "user",
        content: `
Notes:

${context}

Question:

${question}
        `.trim(),
      },
    ],

    temperature: 0.2,
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content ?? "";
}
