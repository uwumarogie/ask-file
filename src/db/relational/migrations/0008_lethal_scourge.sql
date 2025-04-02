ALTER TABLE "conversation" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "file" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "user_id" SET DATA TYPE uuid;