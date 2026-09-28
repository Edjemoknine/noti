import {
  boolean,
  jsonb,
  pgTable,
  vector,
  index,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  tags: text("tags").array().notNull().default([]),
  actionItems: text("action_items").array().notNull().default([]),
  dataJson: jsonb("data_json"),
  coverImageUrl: text("cover_image_url").default(""),
  status: text("status").notNull().default("active"),
  color: text("color").notNull().default("violet"),
  starred: boolean("starred").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const noteChunks = pgTable(
  "note_chunks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    noteId: text("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    chunkIndex: integer("chunk_index").notNull(),
    embedding: vector("embedding", { dimensions: 384 }),
  },
  (table) => [
    index("note_chunks_embedding_idx").using("hnsw", table.embedding.op("vector_cosine_ops")),
    index("note_chunks_note_id_idx").on(table.noteId),
  ],
);
