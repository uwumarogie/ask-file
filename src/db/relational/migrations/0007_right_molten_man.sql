ALTER TABLE "users" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_id" SET DEFAULT gen_random_uuid();