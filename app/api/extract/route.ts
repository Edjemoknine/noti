import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 1. Define Zod schema for type inference and runtime safety
const extractionSchema = z.object({
  title: z.string().describe("A concise title for the tasks or notes."),
  summary: z.string().describe("A short summary of the input text."),
  tags: z.array(z.string()).describe("Relevant tags or categories."),
  actions: z.array(z.string()).describe("Action items extracted as a list of tasks."),
});

type ExtractionResult = z.infer<typeof extractionSchema>;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // 2. Use Chat Completions with strict JSON schema response formatting
    const completion = await client.chat.completions.create({
      model: "gpt-5.6-luna",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that extracts structured data accurately.",
        },
        { role: "user", content: `Extract structured data from the following text:\n\n"${text}"` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "extraction_schema",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string", description: "A concise title." },
              summary: { type: "string", description: "A short summary." },
              tags: { type: "array", items: { type: "string" }, description: "Tags." },
              actions: { type: "array", items: { type: "string" }, description: "Action items." },
            },
            required: ["title", "summary", "tags", "actions"],
            additionalProperties: false,
          },
        },
      },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No content received from OpenAI");
    }

    // 3. Parse and validate through Zod safely
    const rawJson = JSON.parse(responseContent);
    const validatedData: ExtractionResult = extractionSchema.parse(rawJson);

    return Response.json(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues);
      return Response.json({ error: "Response did not match expected schema" }, { status: 422 });
    }

    console.error(error);
    return Response.json({ error: "Failed to process text" }, { status: 500 });
  }
}
