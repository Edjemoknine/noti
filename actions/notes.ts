"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { notes, users } from "@/db/schema";

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

async function requireUserId() {
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

export async function listNotes() {
  const userId = await requireUserId();

  return db.select().from(notes).where(eq(notes.userId, userId)).orderBy(desc(notes.updatedAt));
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

  return note;
}

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
