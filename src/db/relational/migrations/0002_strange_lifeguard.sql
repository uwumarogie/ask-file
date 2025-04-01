ALTER TYPE "public"."role" RENAME TO "message_role";--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "message_role" DROP NOT NULL;