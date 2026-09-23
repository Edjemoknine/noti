import { extractJSON } from "@/lib/utils";
import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);

const SYSTEM_PROMPT = `You are a note-taking assistant that converts raw spoken or typed notes into structured summaries.

Given a transcript, extract:
- "title": a short, specific title (3-6 words) capturing the main topic
- "tags": an array of relevant keywords or categories (1-5 words each) that describe the content
- "summary": 1-3 sentences summarizing the intent, written in third person, past/present tense (not "I need to...")
- "action_items": an array of concrete, actionable tasks mentioned or implied. Each item should be short, start with a verb, and be independently checkable. Do not invent tasks that aren't mentioned or clearly implied.

Rules:
- If no clear action items exist, return an empty array.
- Keep the title and summary tight — no filler phrases like "This note discusses...".
- Output ONLY valid JSON matching the schema below. No markdown, no code fences, no explanation.
- be more concise and specific than verbose. Avoid filler words.

Schema:
{
  "title": string,
  "summary": string,
  "tags": string[],
  "action_items": string[]
}`;

export async function POST(req: Request) {
  const { transcript } = await req.json();

  const response = await hf.chatCompletion({
    model: "meta-llama/Llama-3.1-8B-Instruct",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: transcript },
    ],
    max_tokens: 500,
    temperature: 0.3, // lower = more consistent extraction, less creative drift
  });

  const raw = response.choices[0].message.content ?? "";

  // Strip accidental code fences some models still add
  /*   const cleaned = raw.replace(/```json|```/g, "").trim();
   */
  try {
    const cleaned = extractJSON(raw);
    const parsed = JSON.parse(cleaned);
    return Response.json(parsed);
  } catch {
    return Response.json({ error: "Failed to parse model output", raw }, { status: 502 });
  }
}
