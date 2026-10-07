import { embedSearch } from "./embedding";
import { semanticSearch } from "./search";

export async function searchNotes(query: string, embedEndpoint: URL, limit = 8) {
  const embedding = await embedSearch(query, embedEndpoint);
  console.log({ embedding });

  return semanticSearch(embedding, limit);
}
