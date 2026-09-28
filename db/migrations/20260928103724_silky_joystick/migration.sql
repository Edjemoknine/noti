ALTER TABLE "note_chunks" ALTER COLUMN "note_id" SET DATA TYPE text USING "note_id"::text;--> statement-breakpoint
ALTER TABLE "note_chunks" ALTER COLUMN "embedding" SET DATA TYPE vector(1024) USING "embedding"::vector(1024);--> statement-breakpoint
CREATE INDEX "note_chunks_note_id_idx" ON "note_chunks" ("note_id");--> statement-breakpoint
ALTER TABLE "note_chunks" ADD CONSTRAINT "note_chunks_note_id_notes_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE;