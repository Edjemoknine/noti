import { drizzle } from "drizzle-orm/neon-http";
export const db = drizzle(
  "postgresql://neondb_owner:npg_84dBQwJIusyP@ep-nameless-queen-b23kp1u6-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
);
