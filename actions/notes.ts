"use server";

import { after } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { notes, users } from "@/db/schema";
import { embedNoteSafe } from "@/lib/embed-note";

export type NoteInput = {
  title: string;
  body: string;
  tag?: string;
};

export type ExtractedNote = {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  action_items: string[];
  prompt: string;
};

export type NoteRecord = typeof notes.$inferSelect;
export type NoteListView = "all" | "starred" | "archive" | "none";

export async function requireUserId() {
  const { userId } = await auth();

  if (!userId) throw new Error("You must be signed in to manage notes.");
  return userId;
}

async function ensureUser(userId: string) {
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;

  if (!email) throw new Error("Your account needs an email address before creating notes.");

  await db
    .insert(users)
    .values({
      id: userId,
      email,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
      avatarUrl: clerkUser.imageUrl,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
        avatarUrl: clerkUser.imageUrl,
      },
    });
}

export async function listNotes({
  page = 1,
  view = "all",
}: { page?: number; view?: NoteListView } = {}) {
  const userId = await requireUserId();
  const pageSize = 5;
  const currentPage = Number.isSafeInteger(page) && page > 0 ? page : 1;

  if (view === "none") {
    return { notes: [], totalCount: 0, page: 1, pageCount: 0 };
  }

  const conditions = [eq(notes.userId, userId)];
  if (view === "starred") conditions.push(eq(notes.starred, true));
  if (view === "archive") conditions.push(eq(notes.status, "archived"));
  const where = and(...conditions);

  const [pageNotes, [countResult]] = await Promise.all([
    db
      .select()
      .from(notes)
      .where(where)
      .orderBy(desc(notes.updatedAt), desc(notes.id))
      .limit(pageSize)
      .offset((currentPage - 1) * pageSize),
    db.select({ totalCount: count() }).from(notes).where(where),
  ]);

  return {
    notes: pageNotes,
    totalCount: countResult.totalCount,
    page: currentPage,
    pageCount: Math.ceil(countResult.totalCount / pageSize),
  };
}

export async function getNote(id: string) {
  const userId = await requireUserId();

  const [note] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .limit(1);

  return note ?? null;
}

export async function setNoteStarred(id: string, starred: boolean) {
  const userId = await requireUserId();

  const [note] = await db
    .update(notes)
    .set({ starred, updatedAt: new Date() })
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .returning();

  return note ?? null;
}

export async function createNote(input: ExtractedNote & { tag?: string }) {
  const userId = await requireUserId();
  await ensureUser(userId);
  const title = input.title.trim();
  const body = input.content.trim();

  if (!title && !body) throw new Error("A note needs a title or body.");

  const [note] = await db
    .insert(notes)
    .values({
      id: crypto.randomUUID(),
      userId,
      title: title || "Untitled note",
      content: body,
      summary: input.summary.trim() || null,
      tags: input.tags,
      actionItems: input.action_items,
      dataJson: input,
    })
    .returning();

  // Runs after the response is sent, so the user doesn't wait for embedding
  after(() =>
    embedNoteSafe({
      id: note.id,
      title: note.title,
      content: note.content,
      summary: note.summary,
      userId: note.userId,
    }),
  );

  return note;
}

/* export async function createNote(input: ExtractedNote & { tag?: string }) {
  const userId = await requireUserId();
  await ensureUser(userId);
  const title = input.title.trim();
  const body = input.content.trim();

  if (!title && !body) throw new Error("A note needs a title or body.");

  const [note] = await db
    .insert(notes)
    .values({
      id: crypto.randomUUID(),
      userId,
      title: title || "Untitled note",
      content: body,
      summary: input.summary.trim() || null,
      tags: input.tags,
      actionItems: input.action_items,
      dataJson: input,
    })
    .returning();

  return note;
} */

export async function updateNote(id: string, input: ExtractedNote & { tag?: string }) {
  const userId = await requireUserId();
  const title = input.title.trim();
  const body = input.content.trim();

  if (!title && !body) throw new Error("A note needs a title or body.");

  const [note] = await db
    .update(notes)
    .set({
      title: title || "Untitled note",
      content: body,
      summary: input.summary.trim() || null,
      tags: input.tags,
      actionItems: input.action_items,
      dataJson: input,
      updatedAt: new Date(),
    })
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .returning();

  return note ?? null;
}

export async function deleteNote(id: string) {
  const userId = await requireUserId();

  const [note] = await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .returning({ id: notes.id });

  return note ?? null;
}
