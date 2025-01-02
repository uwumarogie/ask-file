ALTER TABLE "user" DROP CONSTRAINT "user_password_hash_unique";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "password_hash";