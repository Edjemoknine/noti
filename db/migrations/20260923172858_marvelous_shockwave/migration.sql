DROP TABLE "tags";--> statement-breakpoint
ALTER TABLE "notes" DROP COLUMN "tag";--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "cover_image_url" SET DEFAULT '';