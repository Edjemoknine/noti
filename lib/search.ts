import { requireUserId } from "@/actions/notes";
import { db } from "@/db/drizzle";
import { noteChunks, notes } from "@/db/schema";
import { cosineDistance, eq } from "drizzle-orm";

export async function semanticSearch(queryEmbedding: number[], limit = 5) {
  const userId = await requireUserId();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const distance = cosineDistance(noteChunks.embedding, queryEmbedding) as any;

  const results = await db
    .select({
      id: noteChunks.id,
      noteId: noteChunks.noteId,
      content: noteChunks.content,
      chunkIndex: noteChunks.chunkIndex,
      noteTitle: notes.title,
      distance,
    })
    .from(noteChunks)
    .innerJoin(notes, eq(noteChunks.noteId, notes.id))
    .where(eq(noteChunks.userId, userId))
    .orderBy(distance)
    .limit(limit);

  return results.map((result) => ({
    ...result,
    similarity: 1 - result.distance,
  }));
}
