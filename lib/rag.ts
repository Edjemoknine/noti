import { embedSearch } from "./embedding";
import { generateAnswer } from "./llm";
import { semanticSearch } from "./search";

const MIN_SIMILARITY = 0.75;

export async function askNotes(question: string, embedEndpoint: URL) {
  // 1. Embed question
  const queryEmbedding = await embedSearch(question, embedEndpoint);

  // 2. Retrieve candidates
  const chunks = await semanticSearch(queryEmbedding, 8);

  // 3. Keep only relevant chunks
  const relevantChunks = chunks.filter((chunk) => chunk.similarity >= MIN_SIMILARITY);

  // 4. No relevant information
  if (relevantChunks.length === 0) {
    return {
      answer: "I couldn't find enough relevant information in your notes.",
      sources: [],
    };
  }

  // 5. Build context
  const context = relevantChunks
    .map(
      (chunk, index) =>
        `[Source ${index + 1}]
Title: ${chunk.noteTitle}
${chunk.content}`,
    )
    .join("\n\n");

  // 6. Generate grounded answer
  const answer = await generateAnswer(question, context);

  return {
    answer,
    sources: relevantChunks,
  };
}
