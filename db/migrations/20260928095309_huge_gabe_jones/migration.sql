CREATE TABLE "note_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"note_id" uuid NOT NULL,
	"content" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE INDEX "note_chunks_embedding_idx" ON "note_chunks" USING hnsw ("embedding" vector_cosine_ops);