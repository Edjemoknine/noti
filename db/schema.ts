import { integer, text, boolean, pgTable } from "drizzle-orm/pg-core";
export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  cover: text("cover").notNull(),
  tags: text("tags").notNull(),
  done: boolean("done").default(false).notNull(),
});
