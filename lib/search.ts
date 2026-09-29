import { db } from "@/db/drizzle";
import { noteChunks } from "@/db/schema";
import { cosineDistance, desc, sql } from "drizzle-orm";

export async function semanticSearch(queryEmbedding: number[], limit = 5) {
  const distance = cosineDistance(noteChunks.embedding, queryEmbedding);

  const similarity = sql<number>`1 - ${distance}`;

  return db
    .select({
      id: noteChunks.id,
      noteId: noteChunks.noteId,
      content: noteChunks.content,
      chunkIndex: noteChunks.chunkIndex,
      similarity,
    })
    .from(noteChunks)
    .orderBy(desc(similarity))
    .limit(limit);
}
