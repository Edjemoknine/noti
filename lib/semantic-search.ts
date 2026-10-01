import { embedSearch } from "./embedding";
import { semanticSearch } from "./search";

export async function searchNotes(query: string, limit = 8) {
  const embedding = await embedSearch(query);
  console.log({ embedding });

  return semanticSearch(embedding, limit);
}
