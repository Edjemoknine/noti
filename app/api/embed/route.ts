import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { notes } from "@/db/schema";
import { embedNote } from "@/lib/embed-note";
import { embedQuery } from "@/lib/embedding";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    if ("type" in body && body.type === "query") {
      if (!("query" in body) || typeof body.query !== "string" || !body.query.trim()) {
        return NextResponse.json({ error: "query is required" }, { status: 400 });
      }

      const embedding = await embedQuery(body.query);
      return NextResponse.json({ embeddings: [embedding] });
    }

    if ("type" in body && body.type === "note") {
      if (!("noteId" in body) || typeof body.noteId !== "string" || !body.noteId) {
        return NextResponse.json({ error: "noteId is required" }, { status: 400 });
      }

      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const [note] = await db
        .select()
        .from(notes)
        .where(and(eq(notes.id, body.noteId), eq(notes.userId, userId)))
        .limit(1);

      if (!note) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }

      await embedNote(note);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "type must be 'query' or 'note'" }, { status: 400 });
  } catch (error) {
    console.error("Embedding error:", error);

    return NextResponse.json({ error: "Failed to generate embeddings" }, { status: 500 });
  }
}
