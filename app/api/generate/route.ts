import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);

const SYSTEM_PROMPT = `You are a note-taking assistant that converts raw spoken or typed notes into structured summaries.

Given a transcript, extract:
- "title": a short, specific title (3-6 words) capturing the main topic
- "summary": 1-3 sentences summarizing the intent, past/present tense (not "I need to...")
- "content": a detailed summary of the transcript, past/present tense (not "I need to...") and should be related to the title and summary and try to explain and elaborate the note with details. Avoid filler phrases like "This note discusses..." or "In this note, we will cover...".
- "action_items": an array of concrete, actionable tasks mentioned or implied. Each item should be short, start with a verb, and be independently checkable. Do not invent tasks that aren't mentioned or clearly implied.
- "tags": an array of relevant keywords or categories (1-5 words each) that describe the content

Rules:
- If no clear action items exist, return an empty array.
- Keep the title and summary tight — no filler phrases like "This note discusses...".
- Output strictly valid JSON matching the schema below.

Schema:
{
  "title": "string",
  "summary": "string",
  "content": "string",
  "tags": ["string"],
  "action_items": ["string"]
}`;

// Helper to strip markdown fences if the model still includes them
function cleanJsonOutput(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "") // Remove opening ```json
    .replace(/\s*```$/, "") // Remove closing ```
    .trim();
}

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return Response.json({ error: "Transcript is required" }, { status: 400 });
    }

    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: transcript },
      ],
      response_format: { type: "json_object" }, // Force model into JSON mode
      max_tokens: 1500, // Increased to prevent truncated JSON
      temperature: 0.2,
    });

    const raw = response.choices[0]?.message?.content ?? "";
    console.log({ raw });

    const cleaned = cleanJsonOutput(raw);
    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API Route Error:", error);

    // Differentiate JSON Parsing failure vs Upstream/API failure
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: "Failed to parse model output", raw: error.message },
        { status: 422 },
      );
    }

    return Response.json(
      { error: "Internal Server Error or Upstream Inference Timeout", details: error?.message },
      { status: 500 },
    );
  }
}
