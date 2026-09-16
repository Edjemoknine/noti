CREATE TABLE "todo" (
	"id" integer PRIMARY KEY,
	"text" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL
);
