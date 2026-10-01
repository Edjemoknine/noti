ALTER TABLE "note_chunks" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "note_chunks" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "note_chunks" ALTER COLUMN "embedding" SET DATA TYPE vector(384) USING "embedding"::vector(384);--> statement-breakpoint
CREATE INDEX "note_chunks_user_id_idx" ON "note_chunks" ("user_id");--> statement-breakpoint
ALTER TABLE "note_chunks" ADD CONSTRAINT "note_chunks_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;