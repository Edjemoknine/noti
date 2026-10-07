import { eq } from "drizzle-orm";
import { noteChunks } from "@/db/schema";
import { chunkNote } from "./chunk";
import { embedDocuments } from "./embedding";
import { db } from "@/db/drizzle";

export async function embedNote(note: {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  tags: string[];
  actionItems: string[];
  userId: string;
}) {
  const chunks = chunkNote(note.title, note.content, note.summary, note.tags, note.actionItems);
  const vectors = await embedDocuments(chunks);

  // Replace any existing chunks (makes this reusable for updates too)
  await db.delete(noteChunks).where(eq(noteChunks.noteId, note.id));
  await db.insert(noteChunks).values(
    chunks.map((content, i) => ({
      noteId: note.id,
      userId: note.userId,
      chunkIndex: i,
      title: note.title,
      content,
      embedding: vectors[i],
    })),
  );
}

/** Safe wrapper for background use: never throws */
export async function embedNoteSafe(note: Parameters<typeof embedNote>[0]) {
  try {
    await embedNote(note);
  } catch (err) {
    console.error(`[embed] note ${note.id} failed`, err);
  }
}
